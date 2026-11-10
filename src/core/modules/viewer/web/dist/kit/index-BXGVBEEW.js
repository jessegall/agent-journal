import { openBlock as r, createElementBlock as d, normalizeStyle as ve, unref as B, renderSlot as re, createElementVNode as m, normalizeClass as Q, Fragment as j, renderList as ne, defineComponent as eu, Comment as tu, h as ha, cloneVNode as nu, createBlock as W, withCtx as P, createVNode as A, toDisplayString as v, createCommentVNode as k, ref as _, inject as Se, watch as pe, onMounted as Me, onBeforeUnmount as nt, reactive as Ut, shallowRef as Ze, onUnmounted as Re, useAttrs as ma, computed as M, resolveDynamicComponent as Ke, mergeProps as De, useId as qs, resolveDirective as au, withDirectives as et, createTextVNode as Y, Teleport as kn, nextTick as Fe, Transition as Gt, withModifiers as $e, createApp as su, shallowReactive as ou, withKeys as Ct, createSlots as Fl, onScopeDispose as pa, useModel as rn, mergeModels as jt, toRef as Ca, vModelText as ea, resolveComponent as lu, provide as Ds, onErrorCaptured as iu, TransitionGroup as Ps, isRef as _o, getCurrentInstance as ru, getCurrentScope as Wl, normalizeProps as cs, guardReactiveProps as Hl, vShow as zl, useSlots as uu, defineAsyncComponent as cu } from "vue";
function Ul(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, du = 1600, fu = {
  __name: "Shimmer",
  setup(e) {
    const t = Ul(du);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ve(B(t))
    }, null, 4));
  }
}, tn = /* @__PURE__ */ U(fu, [["__scopeId", "data-v-6c018b03"]]), hu = { class: "skeleton-line" }, mu = 2e3, pu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Ul(mu);
    return (n, a) => (r(), d("span", hu, [
      re(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Q(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(j, null, ne(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Q(["bar", { still: e.still }]),
          style: ve({ ...B(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, bt = /* @__PURE__ */ U(pu, [["__scopeId", "data-v-484fe8a0"]]), Vt = eu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== tu);
      return a.length !== 1 ? ha(j, { key: n }, a) : a[0].key == null ? nu(a[0], { key: n }) : a[0];
    };
  }
}), gu = ["aria-label"], vu = ["aria-label"], yu = ["aria-label"], bu = ["aria-label"], ku = ["aria-label"], wu = ["aria-label"], $u = ["aria-label"], xu = {
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
    return (u, c) => (r(), W(Vt, { value: e.shape }, {
      messages: P(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(j, null, ne(t, (f) => A(tn, {
            key: f.id,
            class: Q(["skeleton-message", { mine: f.mine }]),
            style: ve({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, gu)
      ]),
      older: P(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(j, null, ne(t.slice(0, 3), (f) => (r(), W(tn, {
            key: f.id,
            class: Q(["skeleton-message", { mine: f.mine }]),
            style: ve({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, vu)
      ]),
      cards: P(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(j, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(j, null, ne(n, (h) => A(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, yu)
      ]),
      file: P(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(j, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            A(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(j, null, ne(s, (h) => A(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, bu)
      ]),
      page: P(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(bt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(j, null, ne(e.count, (f) => (r(), W(bt, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, ku)
      ]),
      text: P(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(j, null, ne(e.count, (f) => (r(), W(bt, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, wu)
      ]),
      default: P(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(j, null, ne(e.count, (f) => (r(), W(bt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, $u)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Qe = /* @__PURE__ */ U(xu, [["__scopeId", "data-v-ef519c5f"]]), Su = {
  key: 1,
  class: "empty-state titled"
}, Mu = { class: "empty-state-title" }, _u = { class: "empty-state-text" }, Cu = {
  key: 2,
  class: "empty-state"
}, Au = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), W(Qe, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", Su, [
      m("p", Mu, v(e.title), 1),
      m("p", _u, [
        re(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", Cu, [
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, un = /* @__PURE__ */ U(Au, [["__scopeId", "data-v-b27e89b0"]]), Eu = { class: "fold-group" }, Ou = ["aria-expanded"], Tu = { class: "fold-label" }, Iu = {
  key: 0,
  class: "fold-count"
}, Bu = {
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
    return (a, s) => (r(), d("div", Eu, [
      m("button", {
        type: "button",
        class: Q(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Tu, v(e.label), 1),
        e.count !== "" ? (r(), d("span", Iu, v(e.count), 1)) : k("", !0),
        m("span", {
          class: Q(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Ou),
      e.open ? re(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, l6 = /* @__PURE__ */ U(Bu, [["__scopeId", "data-v-9ef1865c"]]), Ru = 150, Lu = () => Ru;
function js(e, t, n = Lu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Gl(e, t, n) {
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
const Nu = 50, Co = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function i6(e) {
  const t = at().sources.find((n) => n.key === e);
  return t ? ds(t.read, t.events) : ds("", []);
}
function Vl(e, t, n, a, s = () => !1) {
  const o = _([]), l = _(null), i = _(""), u = _(!1), c = performance.now(), f = _(!1), h = _(""), p = _(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function E(g) {
    return s() ? (y.add(g), b ?? (b = new Promise(($) => setTimeout(() => $(x()), Nu)))) : S(g);
  }
  async function x() {
    const g = new Set(y);
    y.clear(), b = null;
    const $ = H, C = await t({ ids: [...g].join(","), limit: g.size });
    if ($ !== H) return;
    if (!C.ok) return q();
    const R = new Map(C.value.rows.map((F) => [F.id, F]));
    o.value = o.value.flatMap((F) => g.has(F.id) ? R.has(F.id) ? [R.get(F.id)] : [] : [F]);
  }
  async function S(g) {
    const $ = H, C = await t({ "before-id": g + 1, limit: 1 });
    if ($ !== H) return;
    if (!C.ok) return q();
    const R = C.value.rows.find((F) => F.id === g);
    o.value = R ? o.value.map((F) => F.id === g ? R : F) : o.value.filter((F) => F.id !== g);
  }
  async function O(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((K) => K.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((K) => K.id === g.row_id)) return E(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return q();
    const C = Math.max(...o.value.map((K) => K.id)), R = H, F = await t({ "after-id": C });
    if (R !== H) return;
    if (!F.ok) return q();
    const G = new Set(o.value.map((K) => K.id));
    o.value = [...F.value.rows.filter((K) => !G.has(K.id)), ...o.value];
  }
  async function z() {
    if (!f.value || !o.value.length) return !1;
    const g = H, $ = Math.min(...o.value.map((F) => F.id)), C = await t({ "before-id": $ });
    if (g !== H) return !1;
    if (!C.ok || !C.value.rows.length) return f.value = !1;
    f.value = Co(C.value, n());
    const R = new Set(o.value.map((F) => F.id));
    return o.value = [...o.value, ...C.value.rows.filter((F) => !R.has(F.id))], !0;
  }
  let H = 0;
  function I(g, $) {
    var F, G;
    const C = g.ok ? e.shared ? [g.value] : ((F = g.value) == null ? void 0 : F.rows) ?? [] : [];
    g.ok && (o.value = $(C)), l.value = g.ok ? g.value : null;
    const R = C.length ? Math.min(...C.map((K) => K.id)) : 0;
    g.ok && ((G = g.value) != null && G.rows) && !o.value.some((K) => K.id < R) && (f.value = !e.shared && Co(g.value, n())), i.value = g.ok ? "" : g.error, js(c, () => u.value = !0);
  }
  async function D(g) {
    const $ = ++H, C = await t({});
    $ === H && I(C, g);
  }
  const L = (g) => {
    if (!a() || !g.length) return g;
    const $ = Math.min(...g.map((R) => R.id)), C = Math.max(...g.map((R) => R.id));
    return [...o.value.filter((R) => R.id > C), ...g, ...o.value.filter((R) => R.id < $)];
  }, q = () => D(L), T = (g) => I(g, L), N = () => D((g) => g);
  async function w(g, $ = null) {
    const C = await Gl($ && { target: o, fields: { value: $(o.value) } }, g, e.run);
    return h.value = C.ok ? "" : C.error, p.value = C.ok ? C.value : null, await q(), C;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: q, loadLatest: N, older: z, act: w, actionFailure: h, answer: p, context: e, heard: O, showFirst: T, pageSize: n };
}
const qu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ds(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = at(), l = Vl(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${qu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Du = 2e3;
function Fs(e, t, n = Du) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Se(Le, null), u = () => {
    var E;
    return ((E = i == null ? void 0 : i.visible) == null ? void 0 : E.value) === !1;
  }, c = () => document.hidden || u(), f = async (E) => {
    o = !0;
    try {
      await E();
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
  pe(() => {
    var E;
    return (E = i == null ? void 0 : i.visible) == null ? void 0 : E.value;
  }, b), Me(async () => {
    document.addEventListener("visibilitychange", b), u() || await y();
  }), nt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const Kl = typeof document < "u" && document.documentElement.classList.contains("phone"), Yl = 120;
var Pl;
const Aa = globalThis[Pl = Symbol.for("journal.pressed")] ?? (globalThis[Pl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Pu(e = 0) {
  const t = Aa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Aa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Aa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function fs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Ql(e = window) {
  if (!fs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    fs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const hs = "journal.stale-build-reload", ju = 'script[type="module"][src*="/assets/index-"]', Ao = (e) => {
  var t;
  return ((t = e.querySelector(ju)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Fu(e = document, t = (a, s) => Ce.quietRead(a, s), n = () => Ql(window)) {
  const a = Ao(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Ao(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ea = "";
function Wu(e, t = () => Ql(window)) {
  if (!e) return !1;
  const n = !!Ea && Ea !== e;
  return Ea = e, n && t(), n;
}
const Hu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function zu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(hs) === e.message) return !1;
    t.setItem(hs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Uu(e = window.sessionStorage) {
  try {
    e.removeItem(hs);
  } catch {
    return;
  }
}
const Gu = 2e3, Vu = 3e4, Ve = Ut({ starting: !1, external: !1, late: !1, offline: !1 }), Ws = () => Ve.starting, Ku = 3;
let In = 0, ms = 0, Xl = 0, Jl = [];
async function Yu() {
  try {
    const e = await Ce.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ve.external };
  }
}
let Eo = null;
const Qu = () => Eo ?? (Eo = Yu().finally(() => Eo = null));
function Xu() {
  clearTimeout(ms), clearTimeout(Xl), ms = 0, Object.assign(Ve, { starting: !1, external: !1, late: !1, offline: !1 }), Jl.splice(0).forEach((e) => e()), Fu();
}
async function Ju() {
  Ve.offline = !navigator.onLine;
  const e = await Qu();
  if (Ve.external = e.updating, In = !e.restarting && !e.updating && e.reachable ? In + 1 : 0, In < Ku) return;
  In = 0, (!Wu(e.started_at) || fs()) && Xu();
}
function Zl() {
  ms = setTimeout(async () => {
    await Ju(), Ve.starting && Zl();
  }, Gu);
}
function Zu() {
  Ve.starting || (Ve.starting = !0, Ve.offline = !navigator.onLine, Zl(), Xl = setTimeout(() => Ve.late = !0, Vu));
}
const ei = () => Ve.starting ? new Promise((e) => Jl.push(e)) : Promise.resolve();
function Hs(e, t, n = 0) {
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
function ec(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class tc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Hs(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = ec(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const dt = "viewer.shell", Bn = 2e4, nc = 4, Oo = "/api/read-lines", ac = 5e3, sc = 403, To = "/api/repeated-lines", oc = 10, lc = 2e3, ic = 3e5, r6 = 6e5, Rn = 6, rc = 500, uc = "/journal/summary", Io = "/api/server-state", cc = 2e4, Ln = Kl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, dc = (e) => e.split("?")[0].endsWith(uc), ps = (e, t) => Object.assign(new Error(t), { status: e });
async function fc(e, t, n = ps) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const hc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), mc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Bo = (e) => e.split(" ").slice(0, 2).join(" "), ot = "read", Rt = "write", pc = "stream";
class gc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Rn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Bo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < lc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < oc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(To, { method: "POST", headers: { ...Ln, "Content-Type": "application/json" }, body: i }, [{ window: dt, line: To, kind: Rt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Pu(n ? Yl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: mc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Rt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = Bn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Zu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= nc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Oo, { headers: Ln }, [{ window: dt, line: Oo, kind: ot }], ac).then(async (t) => {
      if (t.status === sc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ps(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new tc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Bo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Rn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Ln, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: hc(a) }, c = s || (i ? ic : Bn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: dt, line: n, kind: ot }], c)) : await this.sent(n, u, [{ window: dt, line: n, kind: Rt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((h) => setTimeout(h, rc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Rn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return fc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: dt, line: t, kind: ot }], Bn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Ln });
    if (!n.ok) throw ps(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Rn, o).then((i) => (this.written(n), i)) : Ws() && !dc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: dt, line: t, kind: pc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Io, { cache: "no-store" }, [{ window: dt, line: Io, kind: ot }], cc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = dt, line: s = t, limit: o = Bn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? ot : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Oa = Symbol.for("journal.transport"), Ce = globalThis[Oa] ?? (globalThis[Oa] = new gc());
class ti {
  constructor() {
    this.following = Ze([]), this.held = /* @__PURE__ */ new Set();
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
      n.patterns.some((a) => zs(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function zs(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const ni = (e, t) => !e.row_id || t.has(e.row_id), vc = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, yc = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, bc = 50, kc = "refresh", wc = 1e3, $c = 3e4, xc = "requested", Sc = "after_window", Mc = 50, Nn = ".*", _c = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Cc(e) {
  const t = {}, n = Ut({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, h = !1;
  const p = (w) => u[w] ?? u[`${w.slice(0, w.lastIndexOf("."))}.*`] ?? {};
  function y(w) {
    const g = () => p(w), $ = _(void 0), C = Vl(e, async (R) => {
      const F = await x(w, R);
      return F.ok && !Object.keys(R).length && ($.value = F.value), F;
    }, () => g().page_size || Mc, () => !!g().page_size, () => !!g().reads_ids);
    return t[w] = { ...C, data: $, readAt: 0 };
  }
  const b = new Proxy({}, { get: (w, g) => typeof g != "string" || g.startsWith("__v") ? void 0 : t[g] ?? y(g) }), E = (w) => (u[w].loading !== xc || w.endsWith(Nn)) && (!u[w].tab || u[w].tab === n.tab);
  function x(w, g = {}) {
    return new Promise(($) => {
      a.push({ name: w, flags: g, resolve: $ }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const w = /* @__PURE__ */ new Map(), g = a.splice(0).filter((R) => {
      const F = JSON.stringify(R.flags);
      return w.has(R.name) || w.set(R.name, F), w.get(R.name) === F ? !0 : (a.push(R), !1);
    });
    a.length && setTimeout(S);
    const $ = Object.fromEntries(g.flatMap(({ name: R, flags: F }) => Object.entries(F).map(([G, K]) => [`${R}.${G}`, K]))), C = await e.readKeys({ only: [...new Set(g.map(({ name: R }) => R))], state: { ...n, ...$ } });
    g.forEach(({ name: R, resolve: F }) => F(C.ok ? C.value.keys[R] : C));
  }
  async function O(w) {
    var R;
    const g = ++f;
    (w.length ? w : Object.keys(u).filter((F) => !F.endsWith(Nn) && u[F].loading === "first" && E(F))).forEach((F) => l[F] = g);
    const C = await e.readKeys({ only: w, state: { ...n } });
    if (!C.ok) {
      if (C.failure === "cancelled") return !1;
      const F = (w.length ? w : Object.keys(t)).filter((K) => (l[K] ?? 0) <= g);
      F.forEach((K) => {
        b[K].readAt = Date.now(), C.failure === "unreachable" ? i.add(K) : i.delete(K), b[K].showFirst(C);
      });
      const G = C.failure === "unreachable" && ((R = e.waitForServer) == null ? void 0 : R.call(e));
      return G && G.then(() => {
        if (h) return;
        const K = F.filter((he) => l[he] === g);
        (K.length || !w.length && !F.length && f === g) && O(K);
      }), !1;
    }
    return T(C.value.declared), Object.entries(C.value.keys).forEach(([F, G]) => {
      (l[F] ?? 0) > g || (l[F] = g, b[F].readAt = Date.now(), i.delete(F), G.ok && (b[F].data.value = G.value), b[F].showFirst(G));
    }), !0;
  }
  function z(w) {
    const g = _c(w);
    return g.length ? (g.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const C = [...o.names];
      o.names.clear(), o.answer = null, $(O(C));
    })))) : O([]);
  }
  function H(w) {
    w.forEach((g) => s.add(g)), clearTimeout(c), c = setTimeout(() => {
      const g = [...s];
      s.clear(), g.length && z(g);
    }, bc);
  }
  const I = (w) => w.endsWith(Nn) ? Object.keys(t).filter((g) => g.startsWith(w.slice(0, -1)) && t[g].readAt) : [w], D = (w, g) => {
    const $ = p(w).event_column;
    return !$ || yc(g, $, /* @__PURE__ */ new Set([Number(w.slice(w.lastIndexOf(".") + 1))]));
  }, L = (w) => (u[w] ?? u[`${w.split(".")[0]}.*`]).reload_seconds;
  function q(w) {
    const g = Object.keys(u).filter((C) => w.event === kc || u[C].events.some((R) => zs(R, w.event)));
    g.filter((C) => u[C].page_size).forEach((C) => b[C].heard(w));
    const $ = g.filter((C) => !u[C].page_size);
    $.filter((C) => !E(C)).forEach((C) => b[C].readAt = 0), H($.filter(E).flatMap(I).filter((C) => D(C, w)));
  }
  function T(w) {
    if (Object.keys(u).length) return;
    u = w;
    const g = [...new Set(Object.values(w).flatMap((C) => C.events))];
    g.length && e.follow(g, q);
    const $ = Object.keys(w).filter((C) => w[C].loading === Sc);
    $.length && O($);
  }
  pe(() => n.tab, () => {
    const w = Object.keys(u).filter((g) => !g.endsWith(Nn) && E(g) && !b[g].readAt);
    w.length && O(w);
  }), Re(() => {
    h = !0, clearTimeout(c);
  });
  function N() {
    const w = Date.now(), g = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && E($)).flatMap(I).filter(($) => w - b[$].readAt >= (i.has($) ? Math.min(L($) * 1e3, $c) : L($) * 1e3));
    g.length && H(g);
  }
  return Fs(N, () => e.visible.value, wc), queueMicrotask(() => O([])), { props: b, state: n, reload: z, readKey: x };
}
const Ac = Symbol("open-view"), Le = Symbol.for("journal.window-context"), ai = Symbol("dock-card"), si = Symbol.for("journal.inspector-actions");
function Ec(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Cc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function at() {
  const e = Se(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return Ec(e);
}
const Oc = (e, t) => e(ai, t), u6 = () => Se(ai), gs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ro = {
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
}, Tc = ["data-icon", "stroke-width", "innerHTML"], le = {
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
    }, null, 12, Tc));
  }
}, Ic = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Bc = /* @__PURE__ */ U(Ic, [["__scopeId", "data-v-eb453d6f"]]), Rc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ma(), a = M(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = _(!1), o = M(() => t.busy || s.value), l = Se(Le, null), i = M(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const h = setTimeout(() => s.value = !0, Yl);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, f) => (r(), W(Ke(e.href ? "a" : "button"), De(a.value, {
      type: e.href ? void 0 : B(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: P(() => [
        m("span", {
          class: Q(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), W(le, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          re(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), W(Bc, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ge = /* @__PURE__ */ U(Rc, [["__scopeId", "data-v-ededdadf"]]), Lc = ["aria-checked", "aria-haspopup", "onClick"], Nc = {
  key: 0,
  class: "segmented-dot"
}, qc = {
  key: 1,
  class: "segmented-note"
}, Dc = {
  key: 2,
  class: "segmented-count"
}, Pc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = qs();
    return (s, o) => {
      const l = au("tip");
      return r(), d("span", {
        class: Q(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(j, null, ne(e.options, (i) => et((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Q(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", Nc)) : k("", !0),
          Y(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", qc, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", Dc, v(i.count), 1)) : k("", !0)
        ], 10, Lc)), [
          [l, i.tip || i.title, `${B(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Ft = /* @__PURE__ */ U(Pc, [["__scopeId", "data-v-c89bc92d"]]), jc = {
  key: 0,
  class: "more-items"
}, Fc = {
  key: 0,
  role: "alert"
}, Wc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", jc, [
      e.failure ? (r(), d("p", Fc, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), W(ge, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: P(() => [
          Y(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, wn = /* @__PURE__ */ U(Wc, [["__scopeId", "data-v-10464014"]]), Hc = { class: "link-group" }, zc = {
  class: "group-label",
  "data-link-kind": ""
}, Uc = ["disabled", "onClick"], Gc = { class: "title" }, Vc = { class: "relations" }, Kc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = M(() => s.value ? n.rows : n.rows.slice(0, 3)), l = M(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (f, h) => (r(), d("div", Hc, [
      m("div", zc, v(l.value), 1),
      (r(!0), d(j, null, ne(o.value, (p) => (r(), d("button", De({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", Gc, v(p.endpoint.title), 1),
        m("span", Vc, [
          Y(v(c(p)), 1),
          i(p) ? (r(), d(j, { key: 0 }, [
            Y(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Uc))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Yc = /* @__PURE__ */ U(Kc, [["__scopeId", "data-v-be6f079c"]]), Qc = ["data-loaded"], Xc = { class: "rows" }, Jc = ["disabled", "onClick"], Zc = { class: "title" }, ed = { class: "relations" }, td = { key: 2 }, nd = {
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
    const n = e, a = t, s = _([]), o = _({}), l = _(0), i = _(""), u = _(null), c = _(!1), f = _("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (T) => T.toUpperCase())}s`, b = M(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, T) => q + T, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, T]) => ({ key: q, label: y(q), count: T }))
    ]), E = M(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((N) => N.endpoint.model))].map((N) => [N, s.value.filter((w) => w.endpoint.model === N).length])), T = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([N], [w]) => (T[N] ?? 3) - (T[w] ?? 3)).map(([N, w]) => ({ model: N, count: w, rows: s.value.filter((g) => g.endpoint.model === N) }));
    }), x = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, S = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), O = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (T) => T.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((T) => T.replaceAll("_", " ")).join(", ")}`;
    async function z(q = 1) {
      const T = ++h;
      c.value = !0, f.value = "";
      const N = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && N.push("--outside-plan"), n.documentId && N.push("--first-counterpart", `doc:${n.documentId}`), i.value && N.push("--kind", i.value);
      try {
        const w = await n.read(N);
        if (T !== h) return;
        if (!w.ok) {
          f.value = w.error;
          return;
        }
        const g = w.value.counterparts ?? [], $ = q === 1 ? g : [...s.value, ...g];
        s.value = [...new Map($.map((C) => [`${C.endpoint.model}:${C.endpoint.id}`, C])).values()], o.value = w.value.categories ?? {}, l.value = w.value.total, u.value = w.value.next_page ?? null;
      } catch (w) {
        T === h && (f.value = w.message);
      } finally {
        T === h && (c.value = !1);
      }
    }
    function H(q) {
      if (x(q)) return;
      const [T, N] = q.endpoint.open_ref.split(":");
      a("open", { table: T, id: Number(N) });
    }
    function I(q) {
      i.value = q, z();
    }
    const D = () => !c.value && u.value && z(u.value), L = M(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return pe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", z();
    }, { immediate: !0 }), (q, T) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Q(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), W(Ft, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : k("", !0),
      m("div", Xc, [
        e.grouped ? (r(!0), d(j, { key: 0 }, ne(E.value, (N) => (r(), W(Yc, {
          key: N.model,
          model: N.model,
          count: N.count,
          rows: N.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: H
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(j, { key: 1 }, ne(s.value, (N) => (r(), d("button", De({
          key: `${N.endpoint.model}:${N.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, S(N), {
          disabled: x(N),
          onClick: (w) => H(N)
        }), [
          m("span", Zc, v(N.endpoint.title), 1),
          m("span", ed, [
            Y(v(O(N)), 1),
            x(N) ? (r(), d(j, { key: 0 }, [
              Y(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, Jc))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", td, v(e.empty), 1)) : k("", !0),
        A(wn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: L.value,
          onMore: D
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Qc)) : k("", !0);
  }
}, ad = /* @__PURE__ */ U(nd, [["__scopeId", "data-v-3b23de37"]]), sd = (e, t, n) => Math.max(t, Math.min(n, e)), od = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, oi = /* @__PURE__ */ new WeakMap(), ld = (e, t) => oi.set(e, t);
function id(e, t) {
  for (let n = t; n; n = oi.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function li(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !id(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const It = 8, rd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = _(null), o = (g) => g ? `${g}px` : void 0, l = M(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = _({ w: 0, h: 0 }), u = _(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), h = (g) => {
      const $ = g.closest(".pane, .float-window");
      return $ ? f($.getBoundingClientRect()) : c();
    }, p = (g, $) => `${Math.max(0, g ? Math.min(g, $) : $)}px`;
    function y(g, $) {
      return {
        below: g.bottom - $.bottom - a.gap - It,
        above: $.top - g.top - a.gap - It,
        across: g.right - g.left - 2 * It
      };
    }
    function b(g) {
      const $ = h(a.anchor), C = y($, g);
      return i.value.w <= C.across && i.value.h <= Math.max(C.below, C.above) ? $ : c();
    }
    const E = M(() => {
      if (!u.value) return l.value;
      const g = u.value, $ = b(g), C = y($, g), { w: R, h: F } = i.value, G = a.align === "auto" ? g.left + g.right > $.left + $.right : a.align === "right", K = sd(G ? g.right - R : g.left, $.left + It, Math.max($.left + It, $.right - R - It)), ce = F > C.below && C.above > C.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, C.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, C.below) };
      return { ...l.value, ...ce, left: `${K}px`, maxWidth: p(a.maxWidth, C.across) };
    }), x = n, S = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function O(g) {
      const $ = S(), C = $.indexOf(document.activeElement);
      $[(C + g + $.length) % $.length].focus();
    }
    const z = { ArrowDown: () => O(1), ArrowUp: () => O(-1), Escape: () => x("close") }, H = (g) => z[g.key] && (g.preventDefault(), z[g.key]()), I = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let D = 0;
    const L = new ResizeObserver(() => {
      cancelAnimationFrame(D), D = requestAnimationFrame(I);
    });
    li(s, (g) => a.anchor && !a.anchor.contains(g.target) && x("close"));
    const q = (g, $) => ["top", "left", "right", "bottom"].some((C) => Math.abs(g[C] - $[C]) > 1), T = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let N = 0;
    function w() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || T(g)) return x("close");
        q(g, u.value) && (u.value = g);
      }
      N = requestAnimationFrame(w);
    }
    return Me(() => {
      a.anchor && s.value && ld(s.value, a.anchor), I(), s.value && L.observe(s.value), !a.plain && S()[0] && S()[0].focus(), w();
    }), Re(() => {
      L.disconnect(), cancelAnimationFrame(N), cancelAnimationFrame(D);
    }), t({ element: s }), (g, $) => (r(), W(kn, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", De({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: E.value,
        onKeydown: H
      }), [
        re(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ga = /* @__PURE__ */ U(rd, [["__scopeId", "data-v-3d203970"]]), ud = { class: "split-button" }, cd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = _(null), s = _(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", ud, [
      A(ge, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: P(() => [
          re(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        A(ge, {
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
            A(le, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), W(ga, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: P(() => [
          re(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, dd = /* @__PURE__ */ U(cd, [["__scopeId", "data-v-c258494d"]]), fd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, hd = {
  key: 1,
  class: "menu-item-text"
}, md = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Q(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", fd, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", hd, [
        m("span", null, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : re(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ue = /* @__PURE__ */ U(md, [["__scopeId", "data-v-fec99974"]]), pd = ["aria-expanded"], gd = { class: "drop-label" }, vd = ["value"], yd = {
  key: 1,
  class: "drop-lead"
}, bd = { class: "drop-item-text" }, kd = {
  key: 2,
  class: "drop-note"
}, wd = {
  key: 1,
  class: "drop-none"
}, $d = {
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
      return c ? n.items.filter((f) => `${f.label} ${f.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function u(c) {
      s.value = !1, a("pick", c);
    }
    return (c, f) => (r(), d("div", {
      class: Q(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      m("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Q(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: f[0] || (f[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (r(), W(le, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        m("span", gd, v(e.label), 1),
        A(le, {
          name: "down",
          size: 11
        })
      ], 10, pd),
      s.value ? (r(), W(ga, {
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
          }, null, 40, vd)) : k("", !0),
          (r(!0), d(j, null, ne(i.value, (h) => (r(), W(Ue, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => u(h)
          }, {
            default: P(() => [
              h.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: Q(["drop-dot", { live: h.running }])
              }, null, 2)) : k("", !0),
              h.lead ? (r(), d("span", yd, v(h.lead), 1)) : k("", !0),
              m("span", bd, v(h.label), 1),
              h.note ? (r(), d("span", kd, v(h.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", wd, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Us = /* @__PURE__ */ U($d, [["__scopeId", "data-v-29dfcce5"]]), xd = 0, Sd = "/api/lines", Md = "/api/line", Lo = 5e3, No = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), qo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ta = (e) => JSON.stringify(e.line), Do = () => new DOMException("cancelled", "AbortError");
class _d {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ta(t))) {
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
    this.timer ?? (this.timer = setTimeout(() => Ce.whenFree(() => this.send()), xd));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Do())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Do()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ce.sent(Sd, No({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => qo(i.body, ot)), Lo);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
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
    await this.alone(t, ot), Date.now() - n < Lo ? this.slow.delete(Ta(t.body)) : this.slow.add(Ta(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ce.sent(Md, No(t.body, t.signal), [qo(t.body, n)], n === ot ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const ii = new _d(), Cd = "/api/window";
function Ad(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Cd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ce.whenFree(async () => {
    const f = await Ce.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: ot }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ce.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const ri = /* @__PURE__ */ new Map();
class Ed {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ze({ buttons: [], missing: {} }), this.loading = Ze(!1), this.loaded = Ze(!1), this.failed = Ze(""), this.pending = null;
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
function c6(e, t) {
  const n = new Ed(e, t);
  return ri.set(e, n), n.load().catch(() => {
  }), n;
}
const Gs = (e) => ri.get(e);
function Od(e, t, n) {
  const a = Gs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Td(e, t) {
  if (!e) return !0;
  const n = Gs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Wt = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let ui = {};
async function d6(e = (t) => Ce.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (ui = (await t.json()).states);
}
const Vs = (e, t) => {
  var n;
  return (n = ui[e]) == null ? void 0 : n[t];
}, cn = (e, t) => {
  var n;
  return ((n = Vs(e, t)) == null ? void 0 : n.label) ?? Wt(t);
}, ci = (e, t) => {
  var n;
  return ((n = Vs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Id = (e, t) => {
  var n;
  return ((n = Vs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, Bd = Symbol("pane-page"), Ks = Symbol("inspector-host"), di = { 1: "refused", 2: "usage", 3: "fault" }, Rd = 100, Ld = 50, Nd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, qd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Dd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = _({}), declared: c = [], page: f = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: E = {}, search: x = {}, readOnly: S = !1, shared: O = null }) {
  const z = /* @__PURE__ */ new Map(), H = (G, K) => l.follow(e, G, (he) => {
    z.clear(), K(he);
  }, a), I = new AbortController(), D = _(!1), L = performance.now();
  let q = 0, T = 0, N = () => {
  };
  const w = new Promise((G) => N = G);
  I.signal.addEventListener("abort", N, { once: !0 });
  const g = () => {
    clearTimeout(T), T = setTimeout(() => {
      q === 0 && js(L, () => {
        D.value = !0, N();
      });
    }, Ld);
  }, $ = (G, K) => (q += 1, St(e, G, t, I.signal, K).finally(() => {
    q -= 1, g();
  })), C = (G, K) => (g(), w.then(() => I.signal.aborted ? ut : St(e, G, t, I.signal, K))), R = ({ only: G = [], state: K = {} } = {}) => (q += 1, jd(() => Ad(e, t, G, K, I.signal), I.signal).finally(() => {
    q -= 1, g();
  })), F = (G, { unbatched: K = !1, deferred: he = !1 } = {}) => {
    const ce = z.get(G);
    if (ce && performance.now() - ce.at < Rd) return ce.answer;
    const be = he && !D.value ? C(G, K) : $(G, K);
    return z.set(G, { answer: be, at: performance.now() }), be;
  };
  return {
    answered: D,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: M(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: E,
    search: x,
    readOnly: S,
    shared: O,
    read: F,
    readKeys: R,
    waitForServer: () => Ws() ? ei() : null,
    run: (G) => St(e, G, t, I.signal),
    upload: (G) => Wd(G, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (G, K) => H([G].flat().filter((he) => o.some((ce) => zs(ce, he))), K),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: H,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (G) => M(() => {
      var K;
      return u.value[G] ?? ((K = c.find((he) => he.key === G)) == null ? void 0 : K.default);
    }),
    setting: async (G, K) => {
      const he = await F(`window setting ${e} ${G}`);
      return he.ok ? he.value.value : K;
    },
    setOption: h,
    keep: (G, K) => St(e, ["window", "save-setting", e, G, JSON.stringify(K)], t, I.signal)
  };
}
function fi(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const ut = { ok: !1, failure: "cancelled", error: "" }, Ys = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function hi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ut : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: di[n.code] || "fault", error: fi(n.error) };
  } catch {
    return t != null && t.aborted ? ut : { ok: !1, failure: "unreachable", error: Ys };
  }
}
const Pd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: di[e.code] || "fault", error: fi(e.error) };
async function jd(e, t) {
  try {
    const n = await e();
    return t.aborted ? ut : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Pd(s)])) } };
  } catch {
    return t.aborted ? ut : { ok: !1, failure: "unreachable", error: Ys };
  }
}
async function mi(e, t, n) {
  const a = await hi(() => ii.read(e, t, n), t);
  return a.failure !== "unreachable" || !Ws() ? a : (await ei(), t.aborted ? ut : mi(e, t, n));
}
function St(e, t, n, a = void 0, s = !1) {
  return Ce.held(() => Fd(e, t, n, a, s), Ce.knownRead(Array.isArray(t) ? t : Qs(t)));
}
async function Fd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Qs(t), environment: n };
  return await Ce.isRead(o.line) ? Ce.joined(JSON.stringify(o), (l, i) => mi({ ...o, attribution: i }, l, s), a, o).catch(() => ut) : hi(() => ii.write({ ...o, attribution: {
    client_id: Ce.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Wd(e, t, n = void 0) {
  try {
    const a = await Ce.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ut : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ut : { ok: !1, failure: "unreachable", error: Ys };
  }
}
function Qs(e) {
  return [...e.matchAll(Nd)].map(([t]) => t.replace(qd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Hd = (e) => `show-${e}`, f6 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Hd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Xs = "messages.chat", zd = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, Ud = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = M(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: c.given_name || `${Wt(c.role)} ${c.number}`, note: `${Wt(c.role)} ${c.number}` }))), i = M(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await St(Xs, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(j, null, [
      A(Us, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (h) => a("pick", h.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", zd, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Gd = /* @__PURE__ */ U(Ud, [["__scopeId", "data-v-43907c1e"]]), Vd = {
  key: 0,
  class: "template-brief"
}, Kd = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Yd = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = M(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = M(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await St(Xs, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === f);
      h && a("pick", String(h.id));
    }
    return u(), (c, f) => (r(), d(j, null, [
      A(Ft, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", Vd, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", Kd, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Qd = /* @__PURE__ */ U(Yd, [["__scopeId", "data-v-14be8a5c"]]), Xd = { class: "info-tip" }, Jd = ["aria-label"], Zd = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, ef = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Xd, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(le, {
          name: "info",
          size: 13
        })
      ], 8, Jd),
      m("span", Zd, [
        (r(!0), d(j, null, ne(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, pi = /* @__PURE__ */ U(ef, [["__scopeId", "data-v-a2fe5ff1"]]), tf = { class: "form-field" }, nf = { class: "form-field-head" }, af = ["for"], sf = {
  key: 1,
  class: "form-field-aside"
}, of = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", tf, [
      m("div", nf, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, af),
        e.help ? (r(), W(pi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", sf, [
          re(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, lf = /* @__PURE__ */ U(of, [["__scopeId", "data-v-302c40bf"]]), vs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, rf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ma(), n = M(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => et((r(), d("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [B(vs), B(t).value]
    ]);
  }
}), uf = /* @__PURE__ */ U(rf, [["__scopeId", "data-v-e130a5b9"]]), cf = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = qs(), o = M(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), W(lf, {
      label: e.field.label,
      for: B(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        A(Vt, { value: o.value }, {
          choice: P(() => [
            A(Ft, {
              id: B(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            A(Qd, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: P(() => [
            A(Gd, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            A(uf, {
              id: B(s),
              value: e.value,
              onInput: i[3] || (i[3] = (u) => a("pick", u.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, va = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), W(ge, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        A(le, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function df(e, t, n, a = () => window) {
  Me(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const ff = (e, t = () => !0) => df("keydown", (n) => n.key === "Escape" && t() && e());
function gi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = _(!1), s = M(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return ff(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const hf = 80, Bt = Ut([]);
function vi(e) {
  const t = Symbol("layer"), n = () => Bt.includes(t) && Bt.splice(Bt.indexOf(t), 1);
  return pe(
    e,
    (a) => {
      a && !Bt.includes(t) && Bt.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), M(() => hf + Math.max(0, Bt.indexOf(t)));
}
let yi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return yi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const mf = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function pf(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(mf)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Me(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : yi, document.addEventListener("keydown", s), Fe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const gf = ["aria-modal", "aria-label", "aria-labelledby"], vf = {
  key: 0,
  class: "dialog-head"
}, yf = ["id", "tabindex"], bf = {
  key: 1,
  class: "dialog-foot"
}, kf = 500, wf = 400, $f = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = gi(a, n), i = vi(s), u = _(null), c = _(null), f = _(null), h = qs(), p = _(!1), y = Date.now();
    n.modal && pf(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, wf);
    }
    function E(O) {
      !n.modal || Date.now() - y >= kf || ![" ", "Enter"].includes(O.key) || (O.preventDefault(), O.stopPropagation());
    }
    const x = () => u.value && (u.value.scrollTop = u.value.scrollHeight), S = new MutationObserver(x);
    return pe(u, (O) => {
      S.disconnect(), O && n.follow && (S.observe(O, { childList: !0, subtree: !0, characterData: !0 }), x());
    }), Re(() => S.disconnect()), (O, z) => (r(), W(kn, { to: "body" }, [
      A(Gt, {
        name: "dialog",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: P(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Q(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ve({ zIndex: B(i) }),
            onClick: $e(b, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: Q(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? B(h) : void 0,
              onKeydownCapture: E
            }, [
              e.bare ? k("", !0) : (r(), d("header", vf, [
                m("h3", {
                  id: B(h),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, yf),
                e.closable ? (r(), W(va, {
                  key: 0,
                  onClick: B(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: u,
                class: Q(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                re(O.$slots, "default", {}, void 0, !0)
              ], 2),
              O.$slots.foot ? (r(), d("footer", bf, [
                re(O.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, gf)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ya = /* @__PURE__ */ U($f, [["__scopeId", "data-v-24a11f8a"]]), xf = {
  class: "action-output",
  "data-action-output": ""
}, Sf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), W(ya, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: P(() => [
        m("pre", xf, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Mf = /* @__PURE__ */ U(Sf, [["__scopeId", "data-v-b32f94a4"]]);
function _f(e) {
  const t = document.body.appendChild(document.createElement("div")), n = su(Mf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const Cf = (e, t, n = {}) => Qs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function $n(e, t, n, a = {}) {
  var s;
  try {
    if (!await Td(e.module, n)) return { ok: !1, error: "" };
    const o = await St(Xs, Cf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && _f(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const Af = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ia = [
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
}), ba = {
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
    filters: Ia
  }),
  tasks: ke("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ia
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
  pins: ke("Pin", "band", "One line pinned to the chat while it matters", { filters: Ia }),
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
}, Ef = ["secrets", "plugins"], bi = Object.keys(ba).filter((e) => !(Kl && Ef.includes(e)));
M(() => bi.map((e) => ({ name: e, ...ba[e] })));
const Kt = (e) => ba[e], ki = new Map(bi.flatMap((e) => [e, e.replace(/s$/, ""), ba[e].title.toLowerCase()].map((t) => [t, e]))), gt = (e) => ki.get(String(e).toLowerCase()) || "", wi = [...ki.keys()].sort((e, t) => t.length - e.length).join("|"), Of = {
  class: "button-form",
  "data-button-form": ""
}, Tf = {
  key: 0,
  class: "button-form-title"
}, If = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Bf = { class: "button-form-actions" }, Rf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = _(!1), l = _(""), i = M(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = M(() => {
      var h;
      if (!n.row) return n.button.label;
      const f = ((h = Kt(gt(n.row.term))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await $n(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, h) => (r(), W(ya, {
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
          m("div", Of, [
            (p = e.row) != null && p.title ? (r(), d("p", Tf, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(j, null, ne(e.button.fields, (y) => (r(), W(cf, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", If, v(l.value), 1)) : k("", !0),
            m("div", Bf, [
              A(ge, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: P(() => [...h[2] || (h[2] = [
                  Y("Cancel", -1)
                ])]),
                _: 1
              }),
              A(ge, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: P(() => [...h[3] || (h[3] = [
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
}, Lf = /* @__PURE__ */ U(Rf, [["__scopeId", "data-v-e3f0d786"]]), Nf = ["aria-busy"], qf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Df = { class: "button-slot-confirm-text" }, Pf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, jf = {
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
    const n = e, a = t, s = M(() => Gs(n.environment)), o = M(
      () => {
        var S;
        return !n.readOnly && ((S = s.value) == null ? void 0 : S.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = M(() => {
      var S;
      return !n.readOnly && ((S = s.value) == null ? void 0 : S.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = M(() => n.readOnly ? [] : Od(n.environment, n.name, n.row)), c = _(null), f = _(null), h = _(""), p = _(!1), y = (S) => [S.from ? `From ${S.from}` : "", S.tip, S.warning].filter(Boolean).join(" · "), b = (S) => S.icon || (S.warning ? "dot" : "");
    function E(S) {
      if (!(p.value || n.readOnly)) {
        if (S.fields.length) {
          c.value = S;
          return;
        }
        if (S.confirm) {
          f.value = S;
          return;
        }
        return x(S);
      }
    }
    async function x(S) {
      f.value = null, h.value = "", a("failure", ""), p.value = !0;
      const O = await $n(S, n.row, n.environment);
      p.value = !1, h.value = O.ok ? "" : O.error;
      const z = S.label.toLowerCase() + (n.objectName && !S.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", O.ok ? "" : `Could not ${z}: ${O.error}`), O.ok && a("done");
    }
    return (S, O) => (r(), d("span", {
      class: Q(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(j, { key: 0 }, [
        O[5] || (O[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(ge, {
          small: "",
          onClick: i
        }, {
          default: P(() => [...O[4] || (O[4] = [
            Y("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", qf, [
        m("span", Df, v(f.value.confirm), 1),
        A(ge, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Q({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: O[0] || (O[0] = (z) => x(f.value))
        }, {
          default: P(() => [
            Y(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(ge, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: O[1] || (O[1] = (z) => f.value = null)
        }, {
          default: P(() => [...O[6] || (O[6] = [
            Y("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(j, { key: 2 }, [
        (r(!0), d(j, null, ne(u.value, (z) => (r(), d(j, {
          key: z.name
        }, [
          z.menu.length ? (r(), W(dd, {
            key: 0,
            small: "",
            variant: z.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": z.menu_label || "More ways",
            title: y(z),
            "data-button": z.name,
            onMain: (H) => E(z)
          }, {
            menu: P(({ close: H }) => [
              (r(!0), d(j, null, ne(z.menu, (I) => (r(), W(Ue, {
                key: I.label,
                description: I.description,
                onClick: (D) => (H(), E({ ...z, ...I, menu: [] }))
              }, {
                default: P(() => [
                  Y(v(I.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              Y(v(z.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), W(ge, {
            key: 1,
            small: "",
            variant: z.primary ? "primary" : "ghost",
            bordered: !z.primary,
            class: Q({ danger: z.danger }),
            icon: b(z),
            disabled: p.value,
            title: y(z),
            "data-button": z.name,
            onClick: (H) => E(z)
          }, {
            default: P(() => [
              Y(v(z.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Pf, v(h.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), W(Lf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: O[2] || (O[2] = (z) => c.value = null),
          onDone: O[3] || (O[3] = (z) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, Nf));
  }
}, Js = /* @__PURE__ */ U(jf, [["__scopeId", "data-v-a4b6f174"]]), Ff = {
  class: "running",
  "data-running-command": ""
}, Wf = ["title"], Hf = {
  key: "idle",
  class: "running-idle"
}, zf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Ff, [
      A(Gt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Wf)) : (r(), d("span", Hf, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, h6 = /* @__PURE__ */ U(zf, [["__scopeId", "data-v-d3240219"]]), Uf = ["aria-checked", "disabled", "aria-label", "title"], Gf = {
  key: 0,
  class: "switch-inner"
}, Vf = {
  key: 0,
  class: "switch-word"
}, Kf = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean, disabled: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("button", {
      type: "button",
      class: Q(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      disabled: e.disabled,
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: Q(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", Gf, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", Vf, v(e.word), 1)) : k("", !0)
    ], 10, Uf));
  }
}, m6 = /* @__PURE__ */ U(Kf, [["__scopeId", "data-v-92ae7767"]]), Yf = { class: "notice-text" }, Qf = {
  key: 1,
  class: "notice-actions"
}, Xf = {
  __name: "Notice",
  props: {
    tone: { type: String, default: "muted" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = ["brief", "report", "wait", "danger", "info", "need", "ask"];
    return (n, a) => (r(), d("div", {
      class: Q(["notice", [`notice-${e.tone}`, { "notice-band": t.includes(e.tone) }]])
    }, [
      e.icon ? (r(), W(le, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : k("", !0),
      m("span", Yf, [
        re(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", Qf, [
        re(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, p6 = /* @__PURE__ */ U(Xf, [["__scopeId", "data-v-445bd8a6"]]);
function $i(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function ta(e, t) {
  return $i(() => localStorage, e, t);
}
function xi(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Zs(e, t) {
  return xi(() => localStorage, e, t);
}
function Si(e, t) {
  pe(t, (n) => Zs(e, n), { deep: !0 });
}
function Jf(e, t) {
  return $i(() => sessionStorage, e, t);
}
function Zf(e, t) {
  return xi(() => sessionStorage, e, t);
}
const na = "journal.environment", Mi = _(Jf(na, ta(na, "")));
function eh(e) {
  Mi.value = e, Zf(na, e), Zs(na, e);
}
const aa = _(location.hash), Po = Ze(null), jo = { integrations: "mcp", library: "team" };
function th() {
  if (!Po.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (jo[n]) {
    location.replace(`#/${[jo[n], ...a].join("/")}${t ? `?${t}` : ""}`), aa.value = location.hash;
    return;
  }
  !n || Po.value(n) || (eh(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), aa.value = location.hash);
}
window.addEventListener("hashchange", () => {
  aa.value = location.hash, th();
});
const ys = M(() => {
  const [e, t = ""] = aa.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", h = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(h) || 0, env: u };
  });
  return {
    env: Mi.value,
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
}), eo = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${eo.page(e)}?open=${t}`
};
function nh(e = "", t = 0, n = "") {
  location.hash = eo.page(e, t, n);
}
function ah(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const sh = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function _i(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(sh).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function g6(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function yt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = ys.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  _i([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function oh(e, t, n, a = 0, s = "") {
  if (e === ys.value.env) return yt(t, n, a, s);
  const o = ys.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  _i([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function je(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? oh(a, s, Number(o), 0, t) : yt(s, Number(o), 0, t);
}
function lh(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = lh(e);
  t && je(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function v6(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const ih = { class: "inspector-part" }, rh = { class: "inspector-part-title" }, uh = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", ih, [
      m("h4", rh, v(e.title), 1),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, y6 = /* @__PURE__ */ U(uh, [["__scopeId", "data-v-5175e4a3"]]), Fo = /* @__PURE__ */ new Map(), ch = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = _(null), a = _(!1), s = _(t.name && Fo.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Fo.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Me(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (u, c) => (r(), d(j, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: Q(["folded-body", { folded: a.value && !s.value }]),
        style: ve(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        re(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = $e((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, Ci = /* @__PURE__ */ U(ch, [["__scopeId", "data-v-4d2235ba"]]), dh = ["aria-valuenow", "aria-valuemax"], fh = {
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
    return (a, s) => (r(), d("span", {
      class: Q(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: ve({ width: n.value })
      }, null, 4)
    ], 10, dh));
  }
}, Ai = /* @__PURE__ */ U(fh, [["__scopeId", "data-v-9eba6a85"]]), hh = { processes: "process", memories: "memory", replies: "reply" }, sa = (e) => (hh[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), bs = [], mh = 2e3, ht = /* @__PURE__ */ new Map(), ph = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, gh = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Ot(e, { first: t = !1 } = {}) {
  t ? bs.unshift(e) : bs.push(e), ht.clear();
}
function Ei(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const vh = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, yh = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function rt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function bh(e, t) {
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
function dn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return kh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function kh(e) {
  return e.split(gh).map((t, n) => n % 2 ? t : t.replace(ph, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Wo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const wh = 24;
function $h(e) {
  const [t, , ...n] = e, a = Wo(t), s = n.map(Wo), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > wh) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${dn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${dn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Oi = /^\s*(?:[-*+]|\d+[.)])\s+/, ks = /^\s*(\d+)[.)]\s/, Ho = (e) => e.match(/^\s*/)[0].length;
function Ti(e) {
  const t = e[0].match(ks), n = Ho(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Ho(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${dn(o.text)}${o.nested.length ? Ti(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function xh(e, t) {
  const n = ks.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Oi.test(e[s]) && ks.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const zo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ii(e) {
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
      n.push(`<h${i}>${dn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (zo(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push($h(t.slice(a, i))), a = i;
      continue;
    }
    if (Oi.test(s)) {
      const i = xh(t, a);
      n.push(Ti(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Ii(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !zo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${dn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Sh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Mh = (e) => e.type !== "text" && !Sh.test(e.html);
function _h(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Ii(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Mh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function to(e, t = { env: "" }) {
  const n = yh(e, t), a = ht.get(n);
  if (ht.delete(n), a && a.source === t.source && a.reads.every((l) => vh(l, t)))
    return ht.set(n, a), a.html;
  const s = [], o = _h(bh(e, { ...t, reads: s }));
  return ht.set(n, { html: o, reads: s, source: t.source }), ht.size > mh && ht.delete(ht.keys().next().value), o;
}
const Ba = /* @__PURE__ */ new WeakMap();
function Ch(e) {
  if (Ba.has(e)) return Ba.get(e);
  const t = ou(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const h = s(c, f), p = e.read(`${sa(c)} show ${f}`);
    n.set(h, p), p.then((y) => {
      n.get(h) === p && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${sa(c).replace(/-/g, "_")}.*`], (f) => {
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
function Bi() {
  const e = Se(Le, null), t = e ? Ch(e) : null;
  return (n, a = {}) => to(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Ri = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, xn = (e) => String(e || "").replace(Ri, (t, n, a, s) => s), Ah = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), qn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Eh = /^Traceback \(most recent call last\):/m, Oh = 8;
function Li(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Oh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Th(e) {
  const t = [...e.matchAll(Ah)].map((a) => a.index);
  if (qn.lastIndex = 0, !t.length || !qn.test(e)) return null;
  qn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(qn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Li(n), tail: "" } : null;
}
function Ih(e) {
  const t = Eh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Li([o]), tail: n.slice(s).join(`
`) };
}
Ot((e) => {
  const t = xn(e), n = Ih(t) || Th(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const oa = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ni = (e) => `${e.table}:${e.id}`, ws = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ra = 80;
function Uo(e) {
  return e.length <= Ra ? e : `${e.slice(0, Ra + 1).replace(/\s+\S*$/, "") || e.slice(0, Ra)}…`;
}
const Go = {
  messages: (e) => Uo(ws(e.text)),
  comments: (e) => Uo(ws(e.text)),
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
}, Bh = (e) => (Go[e.table] ? Go[e.table](e) : e.title || "") || "", At = (e) => oa(e.created_at), Rh = (e) => oa(e.updated_at) || At(e), Lh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Nh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function qh(e) {
  const t = Lh.exec(e);
  if (t && gt(t[1])) return { at: t.index, length: t[0].length, table: gt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Nh.exec(e), a = n && gt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Dh(e, t, n, a) {
  const s = Ei(a, e, t), o = xn(s ? Bh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${rt(Kt(e).title)} ${t}</span><span class="row-card-title">${rt(o)}</span></a>`;
}
Ot(
  (e, t) => {
    const n = qh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Dh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ph = /\.(png|jpe?g|gif|webp|svg)$/i, jh = (e) => Ph.test(e), Fh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Wh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Hh(e, t) {
  const n = Fh.exec(e), [, a, s, o, l, i] = n || [], u = n && gt(a || o), c = u && Ei(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Kt(u).title} ${c.id} · ${rt(i)}`, p = jh(i) ? `<img class="file-card-image" src="${f}" alt="${rt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${rt(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function zh(e) {
  const t = Wh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${rt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Ot(
  (e, t) => {
    if (t.inline) return null;
    const n = Hh(e, t) || zh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Uh = /`([^`\n]+)`/g;
Ot((e) => e.replace(Uh, (t, n) => `<code>${n}</code>`));
const Vo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${eo.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Ot(
  (e, t) => e.replace(Ri, (n, a, s, o) => Vo[a] ? Vo[a](s, o, t) : o)
);
const Gh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, qi = new RegExp(`\\b(${wi}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Di = new RegExp(`\\b(${wi}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Vh = new RegExp(`<code>((?:${qi.source}|${Di.source}))</code>`, "gi"), Kh = (e) => e.replace(Vh, "$1"), Yh = (e, t) => `<a class="row-pill" href="#" data-peek="${gt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Qh = (e) => e.replace(Di, (t, n, a) => a.replace(/\d+/g, (s) => Yh(n.replace(/s$/i, ""), s))), Xh = (e) => Qh(e).replace(
  qi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${gt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Ot(
  (e, t) => t.rowNames === !1 ? e : Kh(e).split(Gh).map((n, a) => a % 2 ? n : Xh(n)).join("")
);
const Jh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Zh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, em = /[\w\]]\(/, tm = /^[\w$.[\]'"]+\s*=\s*[^=]/, nm = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, am = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, sm = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, om = /[[({,]$/, lm = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, im = /^(\t|\s{2,})\S/, rm = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, um = /`[^`]+`/, cm = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, dm = /[{}()[\];=<>$&|*\\@+^~%]/g, Pi = /^\s*(?:[-*+]|\d+[.)])\s/, fm = /^\s*>/, hm = /^\s*\|/, mm = 0.6, pm = 0.4, gm = 5, vm = 0.03, ji = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= gm && t.every((n) => cm.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(dm) ?? []).length / e.length < vm;
}, La = (e) => {
  const t = e.trim();
  return um.test(t) ? !1 : [Jh, Zh, em, tm, nm, am, sm, om, lm].some((n) => n.test(t)) || /[;{}]$/.test(t) || im.test(e) && !Pi.test(e) && !ji(e);
};
function ym(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Pi.test(t[0]) || t.every((o) => fm.test(o) || hm.test(o))) return "text";
  const n = t.filter((o) => !rm.test(o.trim()));
  if (t.length === 1) return !n.length || La(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(La).length, s = n.filter((o) => !La(o) && ji(o)).length;
  return a >= n.length * mm && s <= n.length * pm ? "code" : "text";
}
const $s = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", bm = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", km = `${$s} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, wm = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", $m = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ko = {
  js: { keywords: $s, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: bm, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: km, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: $s, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: wm, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: $m, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, xm = {
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
function Yo(e, t, n) {
  return n && e.startsWith(n, t);
}
function Sm(e, t) {
  const n = Ko[xm[t] ?? t] || Ko.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Yo(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Yo(e, o, n.block[0])) {
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
function Mm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Sm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? rt(l) : `<span class="tok-${a}">${rt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function _m(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Cm = 1500, Qo = /* @__PURE__ */ new WeakMap();
async function Am(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await _m(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Qo.get(t)), Qo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Cm)
  )));
}
typeof document < "u" && document.addEventListener("click", Am, !0);
const Em = /\n\s*\n/, Om = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Tm = /^\s*(`{3,}|~{3,})\s*$/, Im = /^\s{4,}\S/, Bm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, xs = /^\s*(?:[-*+]|\d+[.)])\s/, Fi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Rm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function no(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Lm(e) {
  const t = no(e.join(`
`));
  return (Rm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Nm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Fi.test(t) && !xs.test(t);
}, qm = (e, t) => xs.test(t) || xs.test([...e].reverse().find((n) => n.trim()) || "");
function ao(e, t) {
  const n = t || Lm(e), a = Mm(no(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Dm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Tm.test(s));
  return a < 0 ? e.length : a;
}
function Pm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return ao(a.map(xn), n ? n.toLowerCase() : "");
}
function jm(e) {
  const t = e.split(Em).map((l) => ({ paragraph: l, type: ym(no(l).split(`
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
      s(), n.push(ao(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(xn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Fm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : jm(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(Om);
    if (i) {
      const c = Dm(n, l, i[2]);
      o(), a.push(Pm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = Nm(s) ? Bm : Im;
    if (!t && u.test(n[l]) && !qm(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Fi.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(ao([...f, ...n.slice(l, c)].map(xn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Ot((e, t) => Fm(e, t.document), { first: !0 });
const Wm = ["innerHTML"], Hm = ["innerHTML"], zm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Bi(), a = M(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => B(Nt) && B(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Wm)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => B(Nt) && B(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Hm));
  }
}, lt = /* @__PURE__ */ U(zm, [["__scopeId", "data-v-d8e75741"]]), b6 = (e) => [...new Set(e.agents.map((t) => t.name))], Na = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, Um = "main agent", so = (e, t) => t ? Um : e, Gm = ["data-agent-main"], Vm = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, Km = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Ym = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = M(() => so(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Q(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Vm, [...s[0] || (s[0] = [
        m("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        m("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), W(le, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? k("", !0) : (r(), d("span", Km, v(n.value), 1))
    ], 10, Gm));
  }
}, Dt = /* @__PURE__ */ U(Ym, [["__scopeId", "data-v-a4c3d1e5"]]), Qm = ["aria-expanded"], Xm = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Jm = {
  key: 0,
  class: "tip-failure"
}, Zm = { key: 1 }, ep = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Se(Le, null), a = M(() => Id(t.type, t.state)), s = _(!1), o = _([]), l = _("");
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
      onKeydown: Ct(u, ["escape"])
    }, [
      Y(v(B(cn)(e.type, e.state)) + " ", 1),
      s.value ? (r(), d("span", Xm, [
        l.value ? (r(), d("span", Jm, v(l.value), 1)) : k("", !0),
        (r(!0), d(j, null, ne(o.value, (p) => (r(), d("span", {
          key: p,
          class: "tip-line"
        }, v(p), 1))), 128))
      ])) : k("", !0)
    ], 40, Qm)) : (r(), d("span", Zm, v(B(cn)(e.type, e.state)), 1));
  }
}, tp = /* @__PURE__ */ U(ep, [["__scopeId", "data-v-bf9353d9"]]), np = {
  class: "plan-details",
  "data-plan-details": ""
}, ap = { class: "state-line" }, sp = {
  key: 0,
  class: "phase-count"
}, op = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, lp = { class: "text" }, ip = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, rp = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, up = { class: "overall" }, cp = { class: "overall-figure" }, dp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, fp = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, hp = {
  key: 5,
  class: "part"
}, mp = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", np, [
        m("div", ap, [
          A(tp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Q(["status", B(ci)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", sp, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", op, [
          m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          m("p", lp, v(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", ip, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", rp, [
          n[0] || (n[0] = m("h4", null, "Progress", -1)),
          m("div", up, [
            A(Ai, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            m("span", cp, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", dp, [
          A(Dt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", fp, [
          B(Na)(e.plan) ? (r(), W(Dt, {
            key: 0,
            name: B(Na)(e.plan).name,
            main: B(Na)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(j, { key: 1 }, [
            Y(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", hp, [
          n[1] || (n[1] = m("h4", null, "The brief", -1)),
          A(Ci, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: P(() => [
              A(lt, {
                class: "text",
                "data-resource-text": "",
                text: e.plan.brief
              }, null, 8, ["text"])
            ]),
            _: 1
          }, 8, ["name"])
        ])) : k("", !0)
      ]);
    };
  }
}, k6 = /* @__PURE__ */ U(mp, [["__scopeId", "data-v-8c7a9053"]]), pp = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), W(Ke(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: P(() => [
        re(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: Q(["tip", e.place]),
          role: "tooltip"
        }, [
          re(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, gp = /* @__PURE__ */ U(pp, [["__scopeId", "data-v-683e1839"]]), Wi = (e) => `row:${e}`, vp = 5e3, yp = "cancelled", qa = /* @__PURE__ */ new Map();
async function bp(e, t) {
  const n = `${e.environment}:${t}`, a = qa.get(n);
  if (a && performance.now() - a.at < vp) {
    const o = await a.answer;
    if (o.failure !== yp) return o;
    qa.delete(n);
  }
  const s = e.read(`agent tip ${Wi(t)}`);
  return qa.set(n, { answer: s, at: performance.now() }), s;
}
function kp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Sn(e, t = Date.now()) {
  const n = kp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const wp = 36e5;
function $p(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / wp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Xo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Hi(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Jo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Da = (e) => String(e).padStart(2, "0");
function zi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Da(t % 60)}s` : `${Math.floor(t / 3600)}h ${Da(Math.floor(t % 3600 / 60))}m ${Da(t % 60)}s`;
}
const xp = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, Sp = { state: "retired", words: "Retired" }, Mp = (e) => e.retired ? Sp : xp[e.activity], _p = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), Cp = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${Sn(e, t)}` : "", Ap = (e, t) => e ? `Seen: ${Sn(e, t)}` : "", Ep = {
  class: "line head",
  "data-agent-tip-head": ""
}, Op = { key: 0 }, Tp = {
  class: "line",
  "data-agent-tip-identity": ""
}, Ip = {
  class: "line status",
  "data-agent-tip-status": ""
}, Bp = ["data-state"], Rp = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, Lp = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, Np = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, qp = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, Dp = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Se(Le, null), a = _(!1), s = _(null), o = _(""), l = _(Date.now()), i = M(() => Mp(s.value)), u = M(() => Cp(s.value.since, l.value)), c = M(() => Ap(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const h = await bp(n, t.agentId);
      o.value = h.ok ? "" : h.error, h.ok && (l.value = Date.now(), s.value = h.value);
    }
    return (h, p) => (r(), W(gp, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Fl({
      default: P(() => [
        re(h.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: P(() => [
          s.value ? (r(), d(j, { key: 0 }, [
            m("span", Ep, [
              m("b", null, v(s.value.title), 1),
              p[0] || (p[0] = Y()),
              s.value.name ? (r(), d("span", Op, v(s.value.name), 1)) : k("", !0)
            ]),
            m("span", Tp, v(B(_p)(s.value)), 1),
            m("span", Ip, [
              m("i", {
                "data-state": i.value.state
              }, null, 8, Bp),
              Y(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", Rp, v(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", Lp, v(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", Np, v(e.label), 1)),
          o.value ? (r(), d("span", qp, v(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, fn = /* @__PURE__ */ U(Dp, [["__scopeId", "data-v-71d17663"]]), Pp = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, jp = { class: "agent-word" }, Fp = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = M(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((u) => u.helper_id && !n.has(u.state))) {
        const u = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, main: i.helper_main, held: u });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (r(), d("div", Pp, [
      (r(!0), d(j, null, ne(s.value, (i) => (r(), W(fn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: B(so)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => B(je)(`agents:${i.id}`)
      }, {
        default: P(() => [
          m("span", {
            class: Q(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Dt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          m("span", jp, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, Wp = /* @__PURE__ */ U(Fp, [["__scopeId", "data-v-619caeed"]]), Hp = { class: "phases" }, zp = { class: "phead" }, Up = { class: "mark" }, Gp = { class: "ptitle" }, Vp = { class: "phead-end" }, Kp = {
  key: 0,
  class: "checkpoint"
}, Yp = { class: "progress" }, Qp = {
  key: 0,
  class: "when"
}, Xp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", Hp, [
      (r(!0), d(j, null, ne(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Q(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        m("div", zp, [
          m("span", Up, [
            A(le, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", Gp, v(i + 1) + ". " + v(l.title), 1),
          m("span", Vp, [
            l.checkpoint ? (r(), d("span", Kp, "checkpoint")) : k("", !0),
            m("span", Yp, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", Qp, v(l.goal), 1)) : k("", !0),
        A(Wp, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(j, null, ne(l.tasks, (u) => re(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, w6 = /* @__PURE__ */ U(Xp, [["__scopeId", "data-v-05aaa685"]]), Jp = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Zp = { ...Jp, done: "Completed" }, e1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), t1 = (e) => e1.has(e), hn = (e) => t1(e) ? "done" : e, n1 = { class: "task-status-icon" }, a1 = ["width", "height", "aria-label"], s1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = M(() => ci("task", hn(t.status))), a = M(() => n.value === "testing" ? "started" : n.value), s = M(() => Zp[t.status] ?? cn("task", t.status));
    return (o, l) => (r(), d("span", n1, [
      A(Gt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (r(), d("svg", {
            key: n.value,
            class: Q(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            A(Vt, { value: a.value }, {
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
          ], 10, a1))
        ]),
        _: 1
      })
    ]));
  }
}, ka = /* @__PURE__ */ U(s1, [["__scopeId", "data-v-ae24a63f"]]), o1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, l1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, i1 = {
  key: 2,
  class: "empty"
}, r1 = { class: "day" }, u1 = { class: "events" }, c1 = { class: "mark" }, d1 = { class: "what" }, f1 = { class: "head" }, h1 = { class: "word" }, m1 = ["title", "onClick"], p1 = { class: "at" }, g1 = {
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
    return pe(() => a.id, c, { immediate: !0 }), (f, h) => (r(), d("section", o1, [
      l.value ? (r(), d("p", l1, v(l.value), 1)) : o.value === null ? (r(), W(Qe, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", i1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(j, null, ne(i.value, (p) => (r(), d(j, {
        key: p.day
      }, [
        m("h3", r1, v(p.day), 1),
        m("ol", u1, [
          (r(!0), d(j, null, ne(p.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Q(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", c1, [
              n[y.event_type].state ? (r(), W(ka, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), W(le, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", d1, [
              m("div", f1, [
                m("span", h1, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, m1),
                m("span", p1, v(u(y.time)), 1)
              ]),
              y.text ? (r(), W(lt, {
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
}, $6 = /* @__PURE__ */ U(g1, [["__scopeId", "data-v-9e511133"]]), v1 = 1e3;
function Ui() {
  const e = _(Date.now()), t = setInterval(() => e.value = Date.now(), v1);
  return nt(() => clearInterval(t)), e;
}
const y1 = Symbol("resource-subscriptions");
function Mn(e, t, n = () => !0) {
  const a = Se(y1, () => new ti(), !0), s = Hs(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  pa(() => {
    o(), s.cancel();
  });
}
const b1 = "Not known", k1 = 80, w1 = 1e3, $1 = "worker", x1 = "main", S1 = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), M1 = (e) => e.ok ? e.value.rows : [], _1 = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), C1 = (e, t) => (t == null ? void 0 : t.given_name) || _1((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), A1 = (e, t) => e.ended_at ? "ended" : e.paused_at || S1.has(t == null ? void 0 : t.state) ? "waiting" : "running", Gi = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function E1({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / w1, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: zi(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > k1 }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? b1 : `$${t.cost_dollars.toFixed(2)}` }), e.role === $1 && l.push({ key: "pace", label: "Tasks an hour", value: String($p(Gi(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === x1 && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function O1(e) {
  const t = Gi(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function T1(e, t) {
  const n = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Xo(e.created_at)]), e.ended_at && n.push(["Ended", Xo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const I1 = { class: "band" }, B1 = { key: 0 }, R1 = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", I1, [
      A(le, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      re(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", B1, v(e.count), 1)) : k("", !0)
    ]));
  }
}, Ht = /* @__PURE__ */ U(R1, [["__scopeId", "data-v-1758914f"]]), L1 = { class: "number" }, N1 = { class: "text" }, q1 = 150, D1 = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = _(!1), a = M(() => t.text.length > q1), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(j, null, [
      e.text ? (r(), d(j, { key: 0 }, [
        A(Ht, { icon: "file" }, {
          default: P(() => [
            Y(v(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
          class: Q(["brief", { clamp: !n.value }]),
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
      e.points.length ? (r(), d(j, { key: 1 }, [
        A(Ht, { icon: "points" }, {
          default: P(() => [...l[1] || (l[1] = [
            Y("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(j, null, ne(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", L1, v(i.id), 1),
            m("span", N1, [
              Y(v(i.text), 1),
              m("span", {
                class: Q(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, P1 = /* @__PURE__ */ U(D1, [["__scopeId", "data-v-c99de22c"]]), j1 = ["aria-expanded"], F1 = { class: "count" }, W1 = {
  key: 0,
  "data-agent-fold-body": ""
}, H1 = {
  __name: "AgentFold",
  props: /* @__PURE__ */ jt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = rn(e, "open");
    return (n, a) => (r(), d(j, null, [
      m("button", {
        type: "button",
        class: Q(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        A(le, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        Y(v(e.label), 1),
        m("span", F1, v(e.count), 1),
        A(le, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, j1),
      t.value ? (r(), d("div", W1, [
        re(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Pa = /* @__PURE__ */ U(H1, [["__scopeId", "data-v-7f93d8d9"]]), z1 = ["onClick"], U1 = { class: "text" }, G1 = { class: "aside" }, V1 = {
  key: 0,
  class: "none"
}, K1 = {
  class: "skills",
  "data-agent-skills": ""
}, Y1 = {
  key: 0,
  class: "none-inline"
}, Q1 = { class: "label" }, X1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Ut({ helpers: !1, skills: !1 }), a = _([]), s = _([]), o = async (i) => M1(await t.read(i));
    pe(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), pe(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Wt(i.role)} ${i.number}`;
    return (i, u) => (r(), d(j, null, [
      A(Pa, {
        open: n.helpers,
        "onUpdate:open": u[0] || (u[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: P(() => [
          (r(!0), d(j, null, ne(a.value, (c) => (r(), d("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (f) => B(yt)("agents", c.id)
          }, [
            m("span", U1, v(l(c)), 1),
            m("span", G1, v(B(Wt)(c.role)) + " " + v(c.id), 1)
          ], 8, z1))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", V1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Pa, {
        open: n.skills,
        "onUpdate:open": u[1] || (u[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: P(() => [
          m("p", K1, [
            (r(!0), d(j, null, ne(s.value, (c) => (r(), d("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", Y1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Pa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: P(() => [
          (r(!0), d(j, null, ne(e.details, ([c, f, h]) => (r(), d("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", Q1, v(c) + ":", 1),
            m("span", {
              class: Q(["value", h])
            }, v(f), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, J1 = /* @__PURE__ */ U(X1, [["__scopeId", "data-v-97ed0c20"]]), Z1 = ["datetime", "title"], tt = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ui(), a = M(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(B(Sn)(e.at, B(n))), 9, Z1));
  }
}, eg = {
  class: "now",
  "data-agent-now": ""
}, tg = {
  key: 1,
  class: "muted"
}, ng = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, ag = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, sg = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, og = { class: "line" }, lg = { class: "detail" }, ig = { class: "bar" }, rg = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = M(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(j, null, [
      A(Ht, { icon: "play" }, {
        default: P(() => [...o[2] || (o[2] = [
          Y("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", eg, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => B(yt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", tg, v(e.nothing), 1)),
        n.value ? (r(), d("span", ng, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", ag, [
          o[3] || (o[3] = Y("Seen: ", -1)),
          A(tt, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", sg, [
        m("div", og, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => B(yt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", lg, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", ig, [
          m("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, ug = /* @__PURE__ */ U(rg, [["__scopeId", "data-v-ff25c609"]]), cg = ["onClick"], dg = { class: "text" }, fg = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, hg = { class: "text" }, mg = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, pg = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(j, null, [
      A(Ht, { icon: "clock" }, {
        default: P(() => [...n[0] || (n[0] = [
          Y("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(j, null, ne(e.moves, (a) => (r(), d(j, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => B(yt)(a.table, a.id)
        }, [
          m("i", {
            class: Q(["dot", a.tone])
          }, null, 2),
          m("span", dg, v(a.text), 1),
          A(tt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, cg)) : (r(), d("div", fg, [
          m("i", {
            class: Q(["dot", a.tone])
          }, null, 2),
          m("span", hg, v(a.text), 1),
          A(tt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", mg, "Nothing yet."))
    ], 64));
  }
}, gg = /* @__PURE__ */ U(pg, [["__scopeId", "data-v-58f0db57"]]), vg = {
  class: "strip",
  "data-agent-strip": ""
}, yg = ["data-agent-cell"], bg = {
  key: 0,
  class: "meter"
}, kg = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", vg, [
      (r(!0), d(j, null, ne(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: Q({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", bg, [
          m("i", {
            class: Q({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, yg))), 128))
    ]));
  }
}, wg = /* @__PURE__ */ U(kg, [["__scopeId", "data-v-b6657ab7"]]), $g = {}, xg = { class: "menu-label" };
function Sg(e, t) {
  return r(), d("span", xg, [
    re(e.$slots, "default", {}, void 0, !0)
  ]);
}
const _t = /* @__PURE__ */ U($g, [["render", Sg], ["__scopeId", "data-v-aa955b3e"]]), Mg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, _g = {
  key: 0,
  class: "skills-none"
}, Cg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.skills.filter((l) => l.state === "loaded")), o = M(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", Mg, [
      A(_t, null, {
        default: P(() => [...i[1] || (i[1] = [
          Y("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", _g, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(j, null, ne(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(le, {
          name: "book",
          size: 12
        }),
        Y(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(j, { key: 1 }, [
        A(_t, null, {
          default: P(() => [...i[2] || (i[2] = [
            Y("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(j, null, ne(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          A(le, {
            name: "book",
            size: 12
          }),
          Y(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      A(Ue, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: P(() => [...i[3] || (i[3] = [
          Y("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Ag = /* @__PURE__ */ U(Cg, [["__scopeId", "data-v-be514d47"]]), Eg = ["disabled", "title"], Og = { class: "gauge usage" }, Tg = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.windows[0] ?? null), o = M(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = M(() => o.value !== null && o.value >= 100), i = M(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), u = M(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, f) => o.value !== null ? (r(), d("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: u.value,
      onClick: f[0] || (f[0] = (h) => a("open", h.currentTarget))
    }, [
      A(le, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = Y()),
      m("span", Og, [
        m("span", {
          style: ve({ width: `${o.value}%` })
        }, null, 4)
      ]),
      Y(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, Eg)) : k("", !0);
  }
}, Ig = /* @__PURE__ */ U(Tg, [["__scopeId", "data-v-a36f09dc"]]), Bg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Q(["badge", e.tone])
    }, v(e.text), 3));
  }
}, oo = /* @__PURE__ */ U(Bg, [["__scopeId", "data-v-9e7e1157"]]);
function Rg(e, t, n, { groups: a, programs: s }) {
  const o = _({}), l = _(""), i = _(!1), u = M(() => !!e.value && !e.value.ended_at), c = M(() => u.value && !!e.value.paused_at);
  async function f(b, E = null) {
    l.value = "";
    const x = await Gl(E, b, t);
    return l.value = x.ok ? "" : x.error, n(), x;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, E) => f(["agent", "control", String(e.value.number), b, E.value], { target: o, fields: { value: { ...o.value, [b]: E.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
function Lg(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Ng = ["disabled", "title"], qg = ["disabled", "title"], Dg = { class: "gauge" }, Pg = ["disabled", "title"], jg = ["disabled"], Fg = ["disabled"], Wg = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Hg = ["title"], zg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ug = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Gg = { class: "gauge" }, Vg = { class: "context-used" }, Kg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Yg = 75, Qg = {
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
    const n = e, a = t, s = Rg(Ca(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ca(n, "controlGroups"), programs: Ca(n, "agentPrograms") }), o = _(null), l = _(""), i = M(() => s.groups.value.find((D) => D.key === l.value));
    function u(D, L) {
      o.value = D.currentTarget, l.value = L;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = M(() => n.skills.filter((D) => D.state === "loaded"));
    function h(D) {
      u(D, "skills"), a("skills");
    }
    const p = (D) => s.groups.value.some((L) => L.key === D), y = M(() => {
      var D;
      return s.chosen.value.model ?? ((D = E.value) == null ? void 0 : D.model) ?? "";
    }), b = M(() => {
      var D;
      return s.chosen.value.effort ?? ((D = E.value) == null ? void 0 : D.effort) ?? "";
    });
    M(() => !!n.agent && !n.agent.ended_at);
    const E = M(() => {
      var D;
      return ((D = n.usage.agents) == null ? void 0 : D.find((L) => {
        var q;
        return L.id === ((q = n.agent) == null ? void 0 : q.id);
      })) ?? null;
    }), x = M(() => {
      var D;
      return ((D = E.value) == null ? void 0 : D.context_percent) == null ? null : Math.round(E.value.context_percent);
    }), S = (D) => `${Math.round(D / 1e3)}k`, O = M(() => {
      var D;
      return !!((D = E.value) != null && D.context_limit_tokens);
    }), z = M(() => {
      var D, L;
      return ((D = E.value) == null ? void 0 : D.context_limit_tokens) || ((L = E.value) == null ? void 0 : L.context_window_tokens) || 0;
    }), H = M(() => z.value ? `${S(E.value.context_tokens ?? 0)} of ${S(z.value)}` : ""), I = M(() => {
      var D;
      return (D = E.value) != null && D.cost_dollars ? `$${E.value.cost_dollars.toFixed(2)}` : "";
    });
    return (D, L) => {
      var q;
      return r(), d("div", {
        class: Q(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(j, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: L[0] || (L[0] = (T) => u(T, "agent"))
          }, [
            A(le, {
              name: "agents",
              size: 12
            }),
            Y(" " + v(((q = e.agentPrograms.find((T) => T.name === e.agent.program)) == null ? void 0 : q.title) || e.agent.program), 1)
          ], 8, Ng),
          A(Ig, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: L[1] || (L[1] = (T) => a("open", "usage", T))
          }, null, 8, ["windows", "disabled"]),
          x.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${x.value}% full: clear or compact it`,
            onClick: L[2] || (L[2] = (T) => p("context") ? u(T, "context") : a("open", "context", T.currentTarget))
          }, [
            A(le, {
              name: "gauge",
              size: 12
            }),
            L[14] || (L[14] = Y()),
            m("span", Dg, [
              m("span", {
                style: ve({ width: `${x.value}%` })
              }, null, 4)
            ]),
            Y(" " + v(x.value) + "% ", 1)
          ], 8, qg)) : k("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: L[3] || (L[3] = (T) => p("model") ? u(T, "model") : null)
          }, [
            A(le, {
              name: "model",
              size: 12
            }),
            Y(" " + v(y.value), 1)
          ], 8, Pg)) : k("", !0),
          p("effort") || e.card && b.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: L[4] || (L[4] = (T) => u(T, "effort"))
          }, [
            A(le, {
              name: "bolt",
              size: 12
            }),
            Y(" " + v(b.value), 1)
          ], 8, jg)) : k("", !0),
          I.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: L[5] || (L[5] = (T) => a("open", "cost", T.currentTarget))
          }, v(I.value), 9, Fg)) : k("", !0),
          e.branch ? (r(), d("span", Wg, [
            A(le, {
              name: "branch",
              size: 12
            }),
            Y(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (r(), d("button", {
            key: 5,
            type: "button",
            class: Q(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: L[6] || (L[6] = (T) => a("open", "jobs", T.currentTarget))
          }, [
            A(le, {
              name: "clock",
              size: 12
            }),
            Y(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: h
          }, [
            A(le, {
              name: "book",
              size: 12
            }),
            Y(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(j, { key: 7 }, [
            m("button", {
              type: "button",
              class: Q(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Yg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: L[7] || (L[7] = (T) => a("open", "fitness", T.currentTarget))
            }, [
              A(le, {
                name: "heart",
                size: 12
              }),
              Y(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: Q(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: L[8] || (L[8] = (T) => a("open", "load", T.currentTarget))
            }, [
              A(le, {
                name: "weight",
                size: 12
              }),
              Y(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: L[9] || (L[9] = (T) => u(T, "start"))
        }, [
          A(le, {
            name: "agents",
            size: 12
          }),
          L[15] || (L[15] = Y(" Start an agent", -1))
        ])) : k("", !0),
        L[21] || (L[21] = m("span", { class: "space" }, null, -1)),
        B(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: B(s).failure.value
        }, v(B(s).failure.value), 9, Hg)) : k("", !0),
        re(D.$slots, "default", {}, void 0, !0),
        o.value ? (r(), W(ga, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: P(() => {
            var T;
            return [
              l.value === "agent" ? (r(), d(j, { key: 0 }, [
                B(s).asking.value ? (r(), d(j, { key: 0 }, [
                  A(_t, { "data-agent-stop-ask": "" }, {
                    default: P(() => [...L[16] || (L[16] = [
                      Y("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(Ue, {
                    "data-agent-stop-confirm": "",
                    onClick: L[10] || (L[10] = (N) => (c(), B(s).stop()))
                  }, {
                    default: P(() => [...L[17] || (L[17] = [
                      Y("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(Ue, {
                    onClick: L[11] || (L[11] = (N) => B(s).asking.value = !1)
                  }, {
                    default: P(() => [...L[18] || (L[18] = [
                      Y("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), W(Ue, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: L[12] || (L[12] = (N) => B(s).asking.value = !0)
                }, {
                  default: P(() => [...L[19] || (L[19] = [
                    Y("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(j, { key: 1 }, [
                A(_t, null, {
                  default: P(() => [...L[20] || (L[20] = [
                    Y("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(j, null, ne(B(s).programs.value, (N) => (r(), W(Ue, {
                  key: N.name,
                  "data-agent-program": N.name,
                  onClick: (w) => (c(), B(s).start(N))
                }, {
                  default: P(() => [
                    Y(v(N.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), W(Ag, {
                key: 2,
                skills: e.skills,
                onBrowse: L[13] || (L[13] = (N) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(j, { key: 3 }, [
                A(_t, null, {
                  default: P(() => [
                    Y(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(j, { key: 0 }, [
                  m("p", zg, v(B(Lg)(((T = E.value) == null ? void 0 : T.last_compaction) ?? null)), 1),
                  m("div", Ug, [
                    m("span", Gg, [
                      m("span", {
                        style: ve({ width: `${x.value}%` })
                      }, null, 4)
                    ]),
                    m("span", Vg, v(x.value) + "%", 1)
                  ]),
                  H.value ? (r(), d("p", Kg, [
                    Y(v(H.value) + " ", 1),
                    O.value ? (r(), W(oo, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                (r(!0), d(j, null, ne(i.value.choices, (N) => (r(), W(Ue, {
                  key: N.value,
                  "data-agent-choice": N.value,
                  onClick: (w) => (B(s).choose(i.value.key, N), c())
                }, {
                  default: P(() => [
                    Y(v(N.label), 1)
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
}, Xg = /* @__PURE__ */ U(Qg, [["__scopeId", "data-v-c1e2d220"]]), Jg = {
  class: "who",
  "data-agent-who": ""
}, Zg = { class: "name" }, ev = ["data-agent-state"], tv = {
  class: "sub",
  "data-agent-started-by": ""
}, nv = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Jg, [
      m("h2", Zg, [
        m("i", {
          class: Q(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, ev),
        Y(v(e.name), 1)
      ]),
      A(Xg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", tv, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, av = /* @__PURE__ */ U(nv, [["__scopeId", "data-v-83bd4a9d"]]), sv = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, ov = { class: "scroll" }, lv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, iv = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, rv = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ui(), a = _(null), s = _(null), o = _(null), l = _({}), i = _({ helpers: 0, skills: 0 }), u = _(0), c = _([]), f = _([]), h = _("");
    let p = 0;
    const y = M(() => {
      var S;
      return a.value.ended_at ? O1(s.value) : `It has no task.${(S = s.value) != null && S.instruction ? " It was given an instruction." : ""}`;
    });
    async function b() {
      const S = ++p, O = await t.read(["usage", "inspector", Wi(t.id), "--environment", t.environment]);
      S === p && (h.value = O.ok ? "" : O.error, O.ok && (a.value = O.value.agent, s.value = O.value.facts, o.value = O.value.inspection, l.value = O.value.tool, i.value = { helpers: O.value.helpers, skills: O.value.skills }, c.value = O.value.points, f.value = O.value.programs, u.value += 1));
    }
    const E = M(() => /* @__PURE__ */ new Set([t.id])), x = {
      agent: (S) => ni(S, E.value),
      hook_call: (S) => vc(S, "session_agent_id", E.value)
    };
    return Mn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], b, (S) => {
      var O;
      return ((O = x[S.event.split(".")[0]]) == null ? void 0 : O.call(x, S)) ?? !0;
    }), Me(b), (S, O) => {
      var z, H;
      return r(), d("article", sv, [
        m("div", ov, [
          h.value ? (r(), d("p", lv, v(h.value), 1)) : a.value && o.value ? (r(), d(j, { key: 1 }, [
            A(av, {
              name: B(C1)(a.value, s.value),
              state: B(A1)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: f.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((z = s.value) == null ? void 0 : z.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(wg, {
              cells: B(E1)({ row: a.value, facts: s.value, inspection: o.value, now: B(n) })
            }, null, 8, ["cells"]),
            A(ug, {
              inspection: o.value,
              tool: l.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(P1, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((H = s.value) == null ? void 0 : H.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            A(gg, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(J1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: u.value,
              details: B(T1)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", iv, "Ended " + v(B(Sn)(a.value.ended_at, B(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), W(Qe, { key: 2 }))
        ])
      ]);
    };
  }
}, x6 = /* @__PURE__ */ U(rv, [["__scopeId", "data-v-d5346e68"]]);
function uv(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Me(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), nt(() => n.disconnect()), t;
}
const cv = ["data-comment-id"], dv = {
  key: 0,
  class: "comment-top"
}, fv = { class: "comment-mark" }, hv = {
  class: "comment-body",
  "data-comment": ""
}, mv = { class: "comment-foot" }, pv = {
  key: 1,
  "data-comment-lost": ""
}, gv = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (r(), d("article", {
      class: Q(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (r(), d("div", dv, [
        m("span", fv, v(e.comment.number), 1),
        m("span", {
          class: Q(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      m("p", hv, v(e.comment.body), 1),
      m("div", mv, [
        e.comment.created_at ? (r(), W(tt, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", pv, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, cv));
  }
}, Vi = /* @__PURE__ */ U(gv, [["__scopeId", "data-v-a37d4507"]]);
var jl;
/Mac|iPhone|iPad/.test(((jl = navigator.userAgentData) == null ? void 0 : jl.platform) || navigator.platform);
function Ki(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const vv = {
  class: "comment-box",
  "data-comment-box": ""
}, yv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, bv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, kv = { class: "comment-row" }, wv = ["placeholder"], $v = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ jt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ jt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = rn(e, "draft"), l = _(""), i = _(!1), u = _(null), c = M(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = M(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const y = o.value.trim();
      if (!(!y || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(y), o.value = "", await Fe(), h();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, b) => (r(), d("div", vv, [
      e.selection ? (r(), d("div", yv, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Q(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        A(va, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (E) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", bv, v(l.value), 1)) : k("", !0),
      m("div", kv, [
        et(m("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": b[1] || (b[1] = (E) => o.value = E),
          rows: "1",
          maxlength: "2000",
          class: Q({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = Ct((E) => B(Ki)(E, p), ["enter"]))
        }, null, 42, wv), [
          [ea, o.value]
        ]),
        A(ge, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: P(() => [...b[4] || (b[4] = [
            Y("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, xv = /* @__PURE__ */ U($v, [["__scopeId", "data-v-41d2081c"]]), Dn = (e) => e ? e.split(", ") : [];
function Sv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Mv(e, t) {
  return {
    reads: Dn(e.reads_allowed),
    runs: Dn(e.runs_allowed),
    missing: [...Dn(e.reads_missing), ...Dn(e.runs_missing)],
    ask: t
  };
}
const _v = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = lu("SkeletonParts", !0);
      return r(!0), d(j, null, ne(e.parts, (u, c) => (r(), d(j, { key: c }, [
        (r(!0), d(j, null, ne(u.count, (f) => (r(), W(Vt, {
          key: f,
          value: u.shape
        }, {
          line: P(() => [
            A(tn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            A(tn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            A(tn, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ve({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: P(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: P(() => [
            m("div", {
              class: "skeleton-row",
              style: ve(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            m("div", {
              class: "skeleton-stack",
              style: ve(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: P(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ve(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            m("div", {
              class: "skeleton-grid",
              style: ve(s(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Cv = /* @__PURE__ */ U(_v, [["__scopeId", "data-v-fa8baeaf"]]), Av = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Ev = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", Av, [
      A(Cv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, lo = /* @__PURE__ */ U(Ev, [["__scopeId", "data-v-52f66b64"]]), Yi = {
  runningTool: 500,
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
}, Ov = { class: "bars" }, Tv = { class: "bar-name" }, Iv = { class: "bar-value" }, Bv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = M(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", Ov, [
      (r(!0), d(j, null, ne(e.items, (u, c) => (r(), W(Ke(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Q(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: P(() => [
          m("span", Tv, v(u.label), 1),
          A(Ai, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Iv, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Rv = /* @__PURE__ */ U(Bv, [["__scopeId", "data-v-663427f4"]]), Lv = { class: "bars" }, Nv = {
  key: 0,
  class: "bars-title"
}, qv = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Lv, [
      e.node.title ? (r(), d("span", Nv, v(e.node.title), 1)) : k("", !0),
      A(Rv, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Dv = /* @__PURE__ */ U(qv, [["__scopeId", "data-v-7135bb11"]]), Pv = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = M(() => n[a.node.type](a.node));
    return (l, i) => (r(), d("div", {
      class: Q([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ve(o.value)
    }, [
      (r(!0), d(j, null, ne(e.node.children || [], (u, c) => (r(), W(Qi, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Vn = /* @__PURE__ */ U(Pv, [["__scopeId", "data-v-d142a3f4"]]), jv = {
  key: 0,
  class: "card-head"
}, Fv = { class: "card-title" }, Wv = {
  key: 0,
  class: "card-note"
}, Hv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Q(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", jv, [
        m("span", Fv, v(e.node.title), 1),
        e.node.note ? (r(), d("span", Wv, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      A(Vn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, zv = /* @__PURE__ */ U(Hv, [["__scopeId", "data-v-67b72d40"]]), Uv = { class: "fact" }, Gv = { class: "fact-label" }, Vv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Uv, [
      m("span", Gv, v(e.label), 1),
      A(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Kv = /* @__PURE__ */ U(Vv, [["__scopeId", "data-v-3a88ecf8"]]), Yv = { class: "list" }, Qv = { class: "list-label" }, Xv = {
  key: 1,
  class: "list-note"
}, Jv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Yv, [
      (r(!0), d(j, null, ne(e.items, (o, l) => (r(), W(Ke(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Q(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          m("span", Qv, v(o.label), 1),
          o.badge ? (r(), W(oo, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", Xv, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Zv = /* @__PURE__ */ U(Jv, [["__scopeId", "data-v-ebe2ae0a"]]), ey = { class: "table" }, ty = {
  key: 0,
  class: "table-row empty"
}, ny = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", ey, [
      m("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (r(!0), d(j, null, ne(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (r(!0), d(j, null, ne(e.rows, (i, u) => (r(), W(Ke(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: Q(["table-row", i.tone, { opens: i.open }]),
        style: ve(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: P(() => [
          (r(!0), d(j, null, ne(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", ty, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, ay = /* @__PURE__ */ U(ny, [["__scopeId", "data-v-9326a52e"]]), sy = { class: "stat-value" }, oy = { class: "stat-label" }, ly = {
  key: 0,
  class: "stat-note"
}, iy = {
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
    return (a, s) => (r(), W(Ke(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Q(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        m("span", sy, v(e.value), 1),
        m("span", oy, v(e.label), 1),
        e.note ? (r(), d("span", ly, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ry = /* @__PURE__ */ U(iy, [["__scopeId", "data-v-ad0db6d6"]]), uy = { class: "code" }, cy = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (r(), W(Vt, {
      value: e.node.type
    }, {
      stack: P(() => [
        A(Vn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: P(() => [
        A(Vn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: P(() => [
        A(Vn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        A(zv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        m("h3", {
          class: Q(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: P(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        A(ry, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        A(Dv, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        A(ay, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        A(Zv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        A(lt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        A(Kv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        A(oo, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        m("pre", uy, [
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
}), Qi = /* @__PURE__ */ U(cy, [["__scopeId", "data-v-cbdcf540"]]), dy = { class: "dashboard" }, fy = { class: "trail" }, hy = ["onClick"], my = {
  key: 0,
  class: "gone",
  role: "status"
}, py = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = _(!!n.page && !s(n.page)), l = _(n.page && !o.value ? [n.page] : []), i = M(() => l.value.at(-1) || n.document.start), u = M(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return pe(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (r(), d("div", dy, [
      e.document.broken ? (r(), W(un, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          Y(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), W(un, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          Y(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(j, { key: 2 }, [
        m("nav", fy, [
          m("button", {
            type: "button",
            class: Q(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(j, null, ne(l.value, (b, E) => (r(), d(j, {
            key: `${E}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Q(["step", { current: E === l.value.length - 1 }]),
              onClick: (x) => h(E + 1)
            }, v(c(b)), 11, hy)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", my, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        A(Gt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              A(Qi, {
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
}, gy = /* @__PURE__ */ U(py, [["__scopeId", "data-v-fbe83734"]]);
function vy(e, t) {
  const n = at(), a = Hs(e, Yi.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Me(e), nt(() => {
    s(), a.cancel();
  });
}
const yy = {
  key: 0,
  class: "window-failure"
}, by = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = at(), o = _(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? vy(l, n.events) : Fs(l, () => !0, Yi.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", yy, v(o.value.error), 1)) : o.value ? (r(), W(gy, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, ky = 1e4;
class wy {
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
    return this.heardAt !== null && t - this.heardAt > ky;
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
const $y = {
  key: 0,
  class: "frame-note"
}, xy = {
  key: 0,
  class: "frame-note"
}, Sy = ["src", "title"], My = 1e3, _y = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = at(), a = _(null), s = _(!1), o = _(!1);
    let l = null, i = 0;
    return Me(() => {
      l = new wy(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, My);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", $y, "This window was closed because it stopped answering.")) : (r(), d(j, { key: 1 }, [
      s.value ? (r(), d("div", xy, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        A(ge, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: P(() => [...c[1] || (c[1] = [
            Y("Close the window", -1)
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
        title: B(n).window
      }, null, 8, Sy)
    ], 64));
  }
}, Cy = /* @__PURE__ */ U(_y, [["__scopeId", "data-v-32a49046"]]), Ay = {
  class: "allowance-prompt",
  role: "dialog"
}, Ey = { class: "allowance-prompt-text" }, Oy = { class: "allowance-prompt-buttons" }, Ty = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Ay, [
      m("p", Ey, v(B(Sv)(e.request)), 1),
      m("div", Oy, [
        A(ge, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            Y("Allow", -1)
          ])]),
          _: 1
        }),
        A(ge, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            Y("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Iy = /* @__PURE__ */ U(Ty, [["__scopeId", "data-v-cad69fe2"]]), ja = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), W(un, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        Y(v(e.reason) + " ", 1),
        e.retry ? (r(), W(ge, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            Y("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), W(ge, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            Y("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, By = ["data-window", "data-agent"], Ry = {
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
    const i = Se(Ac, null), u = Dd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: M(() => n.options),
      declared: n.declared,
      page: Se(Bd, null),
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
    Ds(Le, u), pe(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Me(u.settle), Re(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), iu((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ha(n.component), f = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), W(Iy, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), W(ja, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), W(ja, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(j, { key: 4 }, [
        (r(), W(c, { key: o.value })),
        e.skeleton.length && !B(u).answered.value ? (r(), W(lo, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), W(ja, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, By));
  }
}, nn = /* @__PURE__ */ U(Ry, [["__scopeId", "data-v-c4443e2b"]]), Xi = {
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
    const n = e, a = t, s = { render: () => ha(Cy, { src: n.entry.entry_url }) };
    return (o, l) => (r(), W(nn, {
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
}, Ly = ["data-window"], Ji = {
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
    const n = e, a = t, s = Ze(null), o = _("");
    return pe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Uu();
          } catch (i) {
            if (Hu(i) && zu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(lo, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Ly)) : (r(), W(nn, {
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
}, Ny = {
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
    const n = t, a = e, s = M(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = M(() => s.value && { render: () => ha(by, { line: s.value.line, events: s.value.events }) }), l = _(null), i = M(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = M(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = M(
      () => {
        var p, y;
        return l.value ? Mv(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
      var b, E;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), W(lo, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((E = s.value) == null ? void 0 : E.shows) === "one-agent" && e.agent === null ? (r(), W(un, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), W(nn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), W(Ji, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (x, S) => n("option", x, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), W(Xi, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (x, S) => n("option", x, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), W(nn, {
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
        onOption: y[2] || (y[2] = (x, S) => n("option", x, S))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), W(nn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (x) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, qy = ["data-section"], Dy = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Py = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Se(Ks, null), a = M(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = M(() => ({ row: t.row }));
    return (o, l) => B(n) ? (r(!0), d(j, { key: 0 }, ne(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), W(Ny, {
        key: 0,
        name: i.name,
        catalogue: B(n).catalogue,
        subscriptions: B(n).subscriptions,
        environment: B(n).environment,
        prompts: B(n).prompts,
        "shell-read": B(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", Dy, v(i.name) + " is not available", 1))
    ], 8, qy))), 128)) : k("", !0);
  }
}, Ss = /* @__PURE__ */ U(Py, [["__scopeId", "data-v-a47d36b7"]]), jy = { class: "rail-head" }, Fy = { key: 0 }, Wy = {
  key: 1,
  class: "rail-none"
}, Hy = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Q(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", jy, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", Fy, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(j, { key: 0 }, ne(e.comments, (a) => (r(), W(Vi, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", Wy, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, zy = /* @__PURE__ */ U(Hy, [["__scopeId", "data-v-4d684649"]]), Uy = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, Gy = ["aria-pressed"], Vy = ["aria-pressed"], Ky = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Yy = {
  key: 0,
  role: "alert"
}, Qy = {
  key: 1,
  class: "sidebar-none"
}, Xy = ["data-question-id"], Jy = { class: "question-state" }, Zy = ["data-question-show", "onClick"], e0 = {
  key: 0,
  class: "sidebar-none"
}, t0 = {
  key: 1,
  class: "question-answer"
}, n0 = {
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
    const t = Se(Ks, null);
    return (n, a) => (r(), d("div", {
      class: Q(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", Uy, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, Gy),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Vy)
      ]),
      e.mode === "comments" ? (r(), d(j, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), W(zy, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        A(wn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", Ky, [
        e.failure ? (r(), d("p", Yy, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", Qy, "No questions about this text yet.")),
        (r(!0), d(j, null, ne(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Q(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", Jy, v(B(cn)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, Zy),
            s.quote ? (r(), d(j, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", e0, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", t0, "Answered: " + v(s.answer), 1)) : k("", !0),
            A(Ss, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(Js, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = B(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Xy);
        }), 128))
      ]))
    ], 2));
  }
}, Zo = /* @__PURE__ */ U(n0, [["__scopeId", "data-v-660e5c85"]]), a0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, s0 = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ut({ abstract: n.row.abstract, body: n.row.body }), o = _("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), W(ya, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: P(() => [
        m("span", a0, v(o.value), 1),
        A(ge, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: P(() => [...u[6] || (u[6] = [
            Y("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ge, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: P(() => [...u[7] || (u[7] = [
            Y("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: P(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: $e(l, ["prevent"])
        }, [
          m("label", null, [
            u[4] || (u[4] = m("span", null, "Abstract", -1)),
            et(m("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [ea, s.abstract]
            ])
          ]),
          m("label", null, [
            u[5] || (u[5] = m("span", null, "Text", -1)),
            et(m("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [ea, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, o0 = /* @__PURE__ */ U(s0, [["__scopeId", "data-v-464d77a8"]]);
function Zi(e, t) {
  const n = _([]), a = _(!1), s = _(null), o = _(0), l = _(!1), i = _("");
  let u = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: E, id: x, title: S } = e(), O = `On ${E} ${x}, ${S}: `;
    return b.text.startsWith(O) ? b.text.slice(O.length) : b.text;
  };
  async function h(b = 1) {
    const { term: E, id: x } = e();
    if (!x) return;
    const S = ++c;
    l.value = !0, i.value = "";
    try {
      const O = await t([E, "comments", String(x), "--page", String(b), "--page-size", "25"]);
      if (S !== c) return;
      if (!O.ok) {
        i.value = O.error;
        return;
      }
      const z = O.value.rows ?? [], H = b === 1 ? z : [...n.value, ...z];
      n.value = [...new Map(H.map((I) => [I.id, I])).values()], o.value = O.value.total ?? n.value.length, s.value = O.value.next_page ?? null;
    } catch (O) {
      S === c && (i.value = O.message);
    } finally {
      S === c && (l.value = !1);
    }
  }
  async function p(b) {
    var I;
    const { term: E, id: x } = e(), S = `${E}:${x}`, O = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, O], o.value++, a.value = !0;
    const z = await t([E, "comment", String(x), b]);
    if (S !== `${e().term}:${e().id}`) return;
    if (!z.ok)
      throw n.value = n.value.filter((D) => D.id !== O.id), o.value = Math.max(0, o.value - 1), new Error(z.error);
    await h();
    const H = (I = z.value) == null ? void 0 : I.id;
    H && !n.value.some((D) => D.id === H) && (n.value = [...n.value, { ...O, id: H }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return pe(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function l0(e, t) {
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
const i0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, r0 = ["datetime"], u0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, c0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, d0 = {
  key: 2,
  class: "document-none"
}, f0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(""), l = M(() => s.value ? l0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", i0, [
      e.editing ? (r(), W(ge, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (h) => a("close-revision"))
      }, {
        default: P(() => [...f[1] || (f[1] = [
          Y("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(j, { key: 1 }, [
        (r(!0), d(j, null, ne(e.revisions, (h) => (r(), W(ge, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: P(() => [
            Y("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, r0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", u0, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(j, { key: 1 }, [
          A(ge, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: P(() => [...f[2] || (f[2] = [
              Y("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", c0, [
            (r(!0), d(j, null, ne(l.value, (h) => (r(), d("div", {
              key: h.key,
              class: Q(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", d0, "No revisions"))
    ]));
  }
}, h0 = /* @__PURE__ */ U(f0, [["__scopeId", "data-v-3a381aa4"]]), m0 = "button, [data-comment-number]", p0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function er(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(m0) || n.push(t.currentNode);
  return n;
}
function el(e, t, n) {
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
const g0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function v0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = er(e), s = a.map((c) => c.data).join(""), o = el(a, n.startContainer, n.startOffset), l = s.slice(o, el(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: g0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function y0(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function b0(e, t, n) {
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
function k0({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function w0(e, t) {
  const n = er(e), a = y0(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = b0(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(k0).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Fa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Fa(t.number, t.id, t.label)) : l.at(-1).append(Fa(t.number, t.id, t.label))), !0;
}
function $0(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !w0(e, a) && a.id && n.push(a.id);
  return n;
}
const x0 = (e) => e.closest(p0) ?? e;
function tl(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const S0 = {
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
    const a = e, s = n, o = _(null), l = _(null), i = _(null), u = _(!1), c = _(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const E = a.comments.filter((z) => z.quote).map((z) => ({ ...z, label: a.annotationLabel, hot: z.id === a.hot })), x = $0(l.value, a.pending ? [...E, { ...a.pending, pending: !0 }] : E);
      s("lost", x);
      const S = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!S) {
        c.value = null;
        return;
      }
      const O = document.createElement("div");
      O.className = "inline-comment", x0(S).after(O), c.value = O;
    }
    function h() {
      if (!l.value) return;
      const E = v0(l.value);
      if (u.value = !!E, !E) {
        i.value = null;
        return;
      }
      const x = window.getSelection().getRangeAt(0).getBoundingClientRect(), S = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(x.left - S.left, 0)}px`, top: `${x.top - S.top + o.value.scrollTop}px` }, s("select", E);
    }
    function p(E) {
      const x = E.target.closest("[data-comment-number]");
      x ? s("number", Number(x.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(E) {
      var x;
      (x = l.value.querySelector(`[data-comment="${E}"]`)) == null || x.scrollIntoView({ block: "center" });
    }
    function b(E) {
      var x;
      (x = l.value.querySelectorAll("h3, h4, h5, h6")[E]) == null || x.scrollIntoView({ block: "start" });
    }
    return pe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Me(() => {
      f(), document.addEventListener("selectionchange", h);
    }), nt(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: Fe }), (E, x) => (r(), d("div", {
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
        style: ve(i.value),
        "data-comment-pill": "",
        onMousedown: x[0] || (x[0] = $e(() => {
        }, ["prevent"])),
        onClick: x[1] || (x[1] = (S) => s("write"))
      }, [
        A(le, {
          name: "chat",
          size: 13
        }),
        x[2] || (x[2] = Y("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), W(kn, {
        key: 1,
        to: c.value
      }, [
        re(E.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      re(E.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, M0 = /* @__PURE__ */ U(S0, [["__scopeId", "data-v-548d0aaa"]]), _0 = { class: "document-tabs" }, C0 = { class: "document-body" }, A0 = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, E0 = {
  key: 1,
  class: "document-loading"
}, O0 = {
  class: "document-details",
  "data-resource-fields": ""
}, T0 = 760, I0 = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = Se(si, _(null)), a = _(null), s = uv(a), o = M(() => s.value !== null && s.value < T0), l = _(null), i = _(""), u = _([]), c = _([]), f = _(""), h = _("comments"), p = _("text"), y = _(0), b = _(0), E = _([]), x = _(null), S = _(""), O = _(!1), z = _(null), H = _(null);
    let I = 0;
    const D = Zi(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (oe) => t.read(oe)), L = M(() => tl(D.comments.value)), q = M(() => h.value === "questions" ? tl(c.value) : L.value), T = M(() => h.value === "questions" ? q.value.length : D.total.value), N = M(() => {
      var oe;
      return (oe = l.value) != null && oe.body ? to(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), w = M(() => {
      var oe;
      return (((oe = l.value) == null ? void 0 : oe.body) ?? "").split(`
`).filter((te) => /^#{1,4} /.test(te)).map((te, ae) => ({ key: String(ae), value: ae, label: te.replace(/^#+ /, "") }));
    }), g = M(() => L.value.find((oe) => oe.id === b.value)), $ = M(() => {
      var oe;
      return (oe = l.value) != null && oe.close_reason ? "Closed" : "Open";
    }), C = M(() => p.value === "comments" && !o.value ? "text" : p.value), R = (oe) => oe.ok ? oe.value.rows ?? [] : [];
    async function F() {
      const oe = ++I, te = await t.read([t.term, "inspect", String(t.id)]);
      if (oe !== I) return;
      i.value = te.ok ? "" : te.error, l.value = te.ok ? te.value : null;
      const ae = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), Oe = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      oe === I && (c.value = R(ae), f.value = ae.ok ? "" : ae.error, u.value = Oe ? R(Oe) : []);
    }
    async function G(oe) {
      const te = x.value ? ["--quote", x.value.quote, "--position", String(x.value.position), "--selection-type", x.value.selection_type] : [], ae = await t.read([t.term, "comment", String(t.id), ...te, "--", oe]);
      if (!ae.ok) throw new Error(ae.error);
      x.value = null, await Promise.all([F(), D.load()]);
    }
    async function K() {
      const oe = await t.read(["doc", "close", String(t.id)]);
      i.value = oe.ok ? "" : oe.error, oe.ok && await F();
    }
    function he() {
      S.value.trim() || (x.value = null);
    }
    function ce(oe) {
      var te;
      if (y.value = oe, o.value && h.value === "questions") {
        p.value = "comments";
        return;
      }
      o.value ? b.value = b.value === oe ? 0 : oe : (te = a.value.querySelector(h.value === "questions" ? `[data-question-id="${oe}"]` : `[data-comment-id="${oe}"]`)) == null || te.scrollIntoView({ block: "nearest" });
    }
    async function be(oe) {
      var te, ae;
      p.value = "text", y.value = oe, await ((te = z.value) == null ? void 0 : te.nextTick()), (ae = z.value) == null || ae.show(oe);
    }
    function Ie() {
      O.value = !1, F();
    }
    return pe(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", y.value = 0, b.value = 0, x.value = null, c.value = [], f.value = "", F();
    }, { immediate: !0 }), pe(h, () => {
      y.value = 0, b.value = 0;
    }), (oe, te) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), W(kn, {
        key: 0,
        to: B(n),
        disabled: !B(n)
      }, [
        m("span", {
          class: Q(["document-actions", { placed: B(n) }]),
          "data-document-actions": ""
        }, [
          A(ge, {
            bordered: "",
            "data-text-edit": "",
            onClick: te[0] || (te[0] = (ae) => O.value = !0)
          }, {
            default: P(() => [...te[14] || (te[14] = [
              Y("Edit", -1)
            ])]),
            _: 1
          }),
          C.value === "text" && w.value.length > 1 ? (r(), W(Us, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: w.value,
            "data-text-chapters": "",
            onPick: te[1] || (te[1] = (ae) => {
              var Oe;
              return (Oe = z.value) == null ? void 0 : Oe.showHeading(ae.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      m("nav", _0, [
        m("button", {
          type: "button",
          class: Q(["document-tab-button", { on: C.value === "text" }]),
          "data-document-tab": "text",
          onClick: te[2] || (te[2] = (ae) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Q(["document-tab-button", { on: C.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: te[3] || (te[3] = (ae) => p.value = "comments")
        }, [
          Y(v(h.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(T.value || ""), 1)
        ], 2)) : k("", !0),
        e.term === "doc" ? (r(), d("button", {
          key: 1,
          type: "button",
          class: Q(["document-tab-button", { on: C.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: te[4] || (te[4] = (ae) => p.value = "revisions")
        }, [
          te[15] || (te[15] = Y("Revisions ", -1)),
          m("em", null, v(u.value.length || ""), 1)
        ], 2)) : k("", !0)
      ]),
      m("div", C0, [
        i.value ? (r(), d("p", A0, v(i.value), 1)) : l.value ? C.value === "revisions" ? (r(), W(h0, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: K,
          onRestored: F
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : C.value === "comments" ? (r(), W(Zo, {
          key: 3,
          mode: h.value,
          "onUpdate:mode": te[5] || (te[5] = (ae) => h.value = ae),
          tab: "",
          comments: L.value,
          questions: c.value,
          hot: y.value,
          lost: E.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!B(D).nextPage.value,
          "comment-loading": B(D).loading.value,
          "comment-failure": B(D).failure.value,
          "comment-total": B(D).total.value,
          onMore: B(D).loadMore,
          onShow: be,
          onChanged: F
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(j, { key: 4 }, [
          A(M0, {
            ref_key: "words",
            ref: z,
            html: N.value,
            comments: q.value,
            "annotation-label": h.value === "questions" ? "Question" : "Comment",
            hot: y.value,
            pending: x.value,
            inline: b.value,
            onSelect: te[7] || (te[7] = (ae) => x.value = ae),
            onClear: he,
            onNumber: ce,
            onWrite: te[8] || (te[8] = (ae) => {
              var Oe;
              return (Oe = H.value) == null ? void 0 : Oe.focus();
            }),
            onLost: te[9] || (te[9] = (ae) => E.value = ae)
          }, {
            inline: P(() => [
              g.value ? (r(), W(Vi, {
                key: 0,
                comment: g.value,
                hot: "",
                onShow: te[6] || (te[6] = (ae) => be(g.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: P(() => [
              m("dl", O0, [
                te[17] || (te[17] = m("h4", null, "Details", -1)),
                te[18] || (te[18] = m("dt", null, "State", -1)),
                m("dd", null, v($.value), 1),
                l.value.close_reason ? (r(), d(j, { key: 0 }, [
                  te[16] || (te[16] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(l.value.close_reason), 1)
                ], 64)) : k("", !0),
                te[19] || (te[19] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  A(tt, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                te[20] || (te[20] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  A(tt, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          o.value ? k("", !0) : (r(), W(Zo, {
            key: 0,
            mode: h.value,
            "onUpdate:mode": te[10] || (te[10] = (ae) => h.value = ae),
            comments: L.value,
            questions: c.value,
            hot: y.value,
            lost: E.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!B(D).nextPage.value,
            "comment-loading": B(D).loading.value,
            "comment-failure": B(D).failure.value,
            "comment-total": B(D).total.value,
            onMore: B(D).loadMore,
            onShow: be,
            onChanged: F
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (r(), d("div", E0, [
          A(Qe)
        ]))
      ]),
      l.value ? (r(), W(xv, {
        key: 1,
        ref_key: "composer",
        ref: H,
        draft: S.value,
        "onUpdate:draft": te[11] || (te[11] = (ae) => S.value = ae),
        selection: x.value,
        send: G,
        narrow: o.value,
        onClear: te[12] || (te[12] = (ae) => x.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      O.value ? (r(), W(o0, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: te[13] || (te[13] = (ae) => O.value = !1),
        onSaved: Ie
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, S6 = /* @__PURE__ */ U(I0, [["__scopeId", "data-v-c33a5a33"]]), B0 = {
  key: 1,
  class: "row-list-failure"
}, R0 = ["data-row"], L0 = {
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
    const t = e, n = M(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = _(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), W(Qe, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", B0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), W(un, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        Y(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(j, { key: 3 }, [
      (r(), W(Ke(e.arrival || e.moves ? Ps : "ul"), De(n.value, { class: "row-list" }), {
        default: P(() => [
          (r(!0), d(j, null, ne(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            re(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, R0))), 128))
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
}, N0 = /* @__PURE__ */ U(L0, [["__scopeId", "data-v-e9f251f3"]]), q0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, D0 = {
  key: 1,
  class: "agent-rows-note"
}, P0 = {
  key: 2,
  class: "agent-rows-note"
}, j0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, F0 = ["data-agent-row", "onClick"], W0 = { class: "agent-row-name" }, H0 = { class: "agent-row-state" }, z0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = M(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", q0, [
      e.loaded ? e.failure ? (r(), d("p", D0, v(e.failure), 1)) : e.rows.length ? (r(), d(j, { key: 3 }, [
        m("p", j0, v(a.value) + " running", 1),
        (r(!0), d(j, null, ne(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => B(je)(`agents:${l.id}`)
        }, [
          m("span", W0, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", H0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, F0))), 128))
      ], 64)) : (r(), d("p", P0, v(e.none), 1)) : (r(), W(Qe, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, M6 = /* @__PURE__ */ U(z0, [["__scopeId", "data-v-a01e5a17"]]), ft = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ge = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, ze = { across: 48, down: 110, margin: 32, labelSpace: 14 }, U0 = 6;
function io(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const G0 = (e) => {
  const t = io(e, ft.lineChars), n = Math.max(ft.minWidth, Math.max(...t.map((a) => a.length)) * ft.charWidth + ft.padX * 2);
  return { name: e, lines: t, line: ft.line, padY: ft.padY, width: n, height: t.length * ft.line + ft.padY * 2 };
};
function V0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function K0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Y0(e, t, n) {
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
  for (let l = 0; l < U0; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function Q0(e, t) {
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
function X0(e) {
  const t = [...new Set(e.flatMap(([H, I]) => [H, I]))], n = new Set(e.map(([, H]) => H)), a = t.filter((H) => !n.has(H)), s = V0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((H, I) => !s.has(I)), l = K0(t, o), i = Y0(t, o, l), u = new Map(t.map((H) => [H, G0(H)])), c = i.map((H) => H.reduce((I, D) => I + u.get(D).width, 0) + ze.across * (H.length - 1)), f = Math.max(...c) + ze.margin * 2, h = Z0(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = ze.margin;
  i.forEach((H, I) => {
    let D = (f - c[I]) / 2;
    const L = Math.max(...H.map((q) => u.get(q).height));
    H.forEach((q) => {
      const T = u.get(q);
      p.set(q, { ...T, x: D, y: y + (L - T.height) / 2 }), D += T.width + ze.across;
    }), y += L + (h[I] ?? ze.down);
  });
  const b = e.map(([H, I, D], L) => ({ from: H, to: I, label: D || "", back: s.has(L) || l.get(I) <= l.get(H) }));
  Q0(b, p);
  const E = b.map((H) => eb(H, p.get(H.from), p.get(H.to))), x = [...p.values()], S = sb(E, x), O = Math.max(y - ze.down, ...S.filter((H) => H.label).map((H) => H.label.y + H.label.height));
  return { width: Math.max(f - ze.margin, ...S.filter((H) => H.label).map((H) => H.label.x + H.label.width)) + ze.margin, height: O + ze.margin, nodes: x, arrows: S };
}
const J0 = (e) => e ? io(e, Ge.lineChars).length * Ge.line + Ge.pad * 2 : 0;
function Z0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => ze.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += J0(l) + ze.labelSpace);
  }), a.map((s) => Math.max(ze.down, s));
}
function eb(e, t, n) {
  const a = e.label ? io(e.label, Ge.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ge.charWidth + Ge.pad * 2 : 0, o = a.length * Ge.line + (a.length ? Ge.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const tb = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, nb = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], ab = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ge.line);
function sb(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = tb(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = ab.flatMap((u) => nb.map((c) => s(c, u))).find((u) => !n.some((c) => nl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => nl(i, u)); ) i.y += Ge.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ge.line, pad: Ge.pad } };
  });
}
const nl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, ob = { class: "flowchart-tools" }, lb = ["width", "height", "viewBox", "aria-label"], ib = ["d"], rb = ["x", "y", "width", "height"], ub = ["x", "y"], cb = ["x", "dy"], db = {
  key: 0,
  class: "flowchart-label"
}, fb = ["x", "y", "width", "height"], hb = ["x", "y"], mb = ["x", "dy"], pb = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => X0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = _(null), i = _({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var S;
      const E = (S = l.value) == null ? void 0 : S.getBoundingClientRect();
      if (!(E != null && E.width)) return;
      const x = Math.min(E.width / s.value.width, E.height / s.value.height, 1.5);
      i.value = { zoom: x, x: (E.width - s.value.width * x) / 2, y: (E.height - s.value.height * x) / 2 };
    }
    function f(E, x, S) {
      const { zoom: O, x: z, y: H } = i.value, I = Math.min(o.most, Math.max(o.least, O * E));
      i.value = { zoom: I, x: x - (x - z) * I / O, y: S - (S - H) * I / O };
    }
    function h(E) {
      const x = l.value.getBoundingClientRect();
      f(E, x.width / 2, x.height / 2);
    }
    function p(E) {
      const x = l.value.getBoundingClientRect();
      E.ctrlKey || E.metaKey ? f(E.deltaY < 0 ? o.step : 1 / o.step, E.clientX - x.left, E.clientY - x.top) : i.value = { ...i.value, x: i.value.x - E.deltaX, y: i.value.y - E.deltaY };
    }
    function y(E) {
      var x, S, O;
      E.preventDefault(), (x = window.getSelection()) == null || x.removeAllRanges(), u = { x: E.clientX - i.value.x, y: E.clientY - i.value.y }, (O = (S = l.value).setPointerCapture) == null || O.call(S, E.pointerId);
    }
    function b(E) {
      u && (i.value = { ...i.value, x: E.clientX - u.x, y: E.clientY - u.y });
    }
    return Me(c), (E, x) => (r(), W(ya, {
      padded: "",
      title: e.title,
      large: "",
      onClose: x[4] || (x[4] = (S) => a("close"))
    }, {
      default: P(() => [
        m("div", ob, [
          A(ge, {
            small: "",
            onClick: x[0] || (x[0] = (S) => h(o.step))
          }, {
            default: P(() => [...x[5] || (x[5] = [
              Y("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(ge, {
            small: "",
            onClick: x[1] || (x[1] = (S) => h(1 / o.step))
          }, {
            default: P(() => [...x[6] || (x[6] = [
              Y("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(ge, {
            small: "",
            onClick: c
          }, {
            default: P(() => [...x[7] || (x[7] = [
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
          onPointermove: b,
          onPointerup: x[2] || (x[2] = (S) => _o(u) ? u.value = null : u = null),
          onPointercancel: x[3] || (x[3] = (S) => _o(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
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
            (r(!0), d(j, null, ne(s.value.arrows, (S, O) => (r(), d("path", {
              key: `arrow-${O}`,
              class: "flowchart-arrow",
              d: S.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, ib))), 128)),
            (r(!0), d(j, null, ne(s.value.nodes, (S) => (r(), d("g", {
              key: S.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: S.x,
                y: S.y,
                width: S.width,
                height: S.height,
                rx: "8"
              }, null, 8, rb),
              m("text", {
                x: S.x + S.width / 2,
                y: S.y + S.padY + S.line / 2
              }, [
                (r(!0), d(j, null, ne(S.lines, (O, z) => (r(), d("tspan", {
                  key: z,
                  x: S.x + S.width / 2,
                  dy: z ? S.line : 0
                }, v(O), 9, cb))), 128))
              ], 8, ub)
            ]))), 128)),
            (r(!0), d(j, null, ne(s.value.arrows, (S, O) => (r(), d(j, {
              key: `label-${O}`
            }, [
              S.label ? (r(), d("g", db, [
                m("rect", {
                  x: S.label.x,
                  y: S.label.y,
                  width: S.label.width,
                  height: S.label.height,
                  rx: "4"
                }, null, 8, fb),
                m("text", {
                  x: S.label.x + S.label.width / 2,
                  y: S.label.y + S.label.pad + S.label.line / 2
                }, [
                  (r(!0), d(j, null, ne(S.label.lines, (z, H) => (r(), d("tspan", {
                    key: H,
                    x: S.label.x + S.label.width / 2,
                    dy: H ? S.label.line : 0
                  }, v(z), 9, mb))), 128))
                ], 8, hb)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, lb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, gb = /* @__PURE__ */ U(pb, [["__scopeId", "data-v-e98799dc"]]), vb = ["innerHTML"], yb = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => Ro[t.name] || Ro.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, vb));
  }
}, Et = /* @__PURE__ */ U(yb, [["__scopeId", "data-v-beb5935c"]]), bb = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Q(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(Et, { name: "fold" })
    ], 2));
  }
}, Yt = /* @__PURE__ */ U(bb, [["__scopeId", "data-v-d03899bb"]]), kb = ["data-tip", "aria-label"], wb = {
  key: 0,
  class: "mact-word"
}, $b = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Q(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(Et, { name: "open" }),
      e.open ? (r(), d("span", wb, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, kb));
  }
}, tr = /* @__PURE__ */ U($b, [["__scopeId", "data-v-3b292e09"]]), nr = 120, Kn = 280, ar = 160, xb = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Sb = ["leaving", "resizing", "entering"];
function Ms(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Mb(e) {
  const t = Sb.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Ms(e);
  return e.classList.add(...t), n;
}
function sr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = _(t()), s = _("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function u(h, p) {
    i(h);
    const y = Mb(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Kn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Kn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, u(h, Ms(h)));
    });
    return b.observe(p), b;
  }
  async function f(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || xb()) {
      a.value = h;
      return;
    }
    const b = Ms(p);
    if (l(p, b), s.value = "leaving", await n(nr), y !== o) return;
    a.value = h, s.value = "resizing", await Fe(), u(p, b);
    const E = c(p);
    await n(Kn), E == null || E.disconnect(), y === o && (i(p), s.value = "entering", await n(ar), y === o && (s.value = ""));
  }
  return pe(t, (h) => f(h)), nt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const _b = { class: "growing-card-top" }, Cb = ["aria-expanded"], Ab = { class: "growing-card-avatar" }, Eb = { class: "growing-card-title" }, Ob = { class: "growing-card-more" }, Tb = { class: "growing-card-body" }, Ib = {
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
    const n = e, a = t, s = _(!1), o = _(null), { folded: l, phase: i } = sr(o, () => !s.value), u = M(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = M(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, h) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Q(["growing-card-wrap", B(i), { open: !B(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", _b, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", Ab, [
            e.bad ? (r(), W(Et, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(j, { key: 1 }, [
              Y(v(u.value), 1)
            ], 64)) : (r(), W(le, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", Eb, v(e.title), 1),
          A(Yt, { open: s.value }, null, 8, ["open"])
        ], 8, Cb),
        e.action ? (r(), W(tr, {
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
          A(le, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      m("div", Ob, [
        m("div", Tb, [
          (r(!0), d(j, null, ne(c.value, (p, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Bb = /* @__PURE__ */ U(Ib, [["__scopeId", "data-v-f2b4930d"]]), Rb = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Lb = { class: "md inline" }, Nb = ["disabled", "title", "onClick"], qb = {
  key: 1,
  class: "message-links-many"
}, Db = ["aria-expanded"], Pb = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, jb = ["disabled", "onClick"], Fb = { class: "row-pill message-links-chip" }, Wb = { class: "message-links-title" }, Hb = { key: 0 }, Wa = 3, zb = "task", Ub = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.total || n.links.length), o = M(() => n.links.every((p) => p.endpoint.model === zb) ? "tasks" : "items"), l = _(!1), i = _(null);
    li(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, je(p.endpoint.open_ref));
    }
    return (p, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Q(["message-links", { many: s.value > Wa, three: s.value === Wa, open: l.value }]),
      "data-message-links": ""
    }, [
      A(Et, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", Rb, [
        m("span", Lb, [
          y[1] || (y[1] = Y("Linked: ", -1)),
          (r(!0), d(j, null, ne(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (E) => h(b)
          }, [
            Y(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            f(b) ? (r(), d(j, { key: 0 }, [
              Y(" (" + v(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(j, { key: 1 }, [
              Y(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, Nb))), 128))
        ])
      ])) : k("", !0),
      s.value >= Wa ? (r(), d("span", qb, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          Y(v(s.value) + " linked " + v(o.value) + " ", 1),
          A(Yt, { open: l.value }, null, 8, ["open"])
        ], 8, Db)
      ])) : k("", !0),
      l.value ? (r(), d("div", Pb, [
        (r(!0), d(j, null, ne(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (E) => h(b)
        }, [
          m("span", Fb, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          m("span", Wb, v(b.endpoint.title), 1),
          m("span", null, v(f(b)), 1),
          c(b) ? (r(), d("span", Hb, "Unavailable")) : k("", !0)
        ], 8, jb))), 128))
      ])) : k("", !0),
      A(wn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Gb = /* @__PURE__ */ U(Ub, [["__scopeId", "data-v-14ec7c9a"]]), Vb = ["title", "aria-label"], Kb = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Yb = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Qb = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = M(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: Q(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", Kb, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Yb)) : k("", !0)
      ]))
    ], 10, Vb));
  }
}, Xb = /* @__PURE__ */ U(Qb, [["__scopeId", "data-v-6dc92808"]]), Jb = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Zb = (e) => e.worker_id != null ? "report" : "message", ek = (e) => Jb[Zb(e)], tk = "img,pre,table";
function nk(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function ak(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function sk(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(tk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = nk(ak(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function ok(e, t) {
  let n = null;
  const a = () => e.value && sk(e.value);
  Me(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), pe(t, a, { flush: "post" });
}
const lk = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function ik(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Pn = /* @__PURE__ */ new WeakMap(), Ne = "work", Je = "sent", rk = 50, al = 50, sl = () => ({ rows: _([]), total: _(0), next: _(null), loading: _(!1), failure: _(""), version: 0 });
function uk(e) {
  var E;
  if (Pn.has(e)) return Pn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (x) => {
    var S;
    return ((S = e.visible) == null ? void 0 : S.value) !== !1 && [...x.views].some((O) => O.visible);
  };
  function o(x, S) {
    const O = x[S], z = ++O.version;
    return O.loading.value = !0, O.failure.value = "", z;
  }
  function l(x, S, O, z, H) {
    const I = x[S];
    if (t.get(x.id) !== x || I.version !== O) return;
    if (I.loading.value = !1, !H.ok) {
      I.failure.value = H.error;
      return;
    }
    const D = S === Ne ? H.value.counterparts ?? [] : H.value.rows ?? [], L = z === 1 ? D : [...I.rows.value, ...D], q = S === Ne ? (T) => `${T.endpoint.model}:${T.endpoint.id}` : (T) => T.id ?? T.target_id;
    I.rows.value = [...new Map(L.map((T) => [q(T), T])).values()], I.total.value = H.value.total ?? I.rows.value.length, I.next.value = H.value.next_page ?? null;
  }
  function i(x, S, O, z) {
    const H = x[S];
    H.version === O && (H.failure.value = z.message, H.loading.value = !1);
  }
  async function u(x, S, O) {
    const z = o(x, S), H = S === Ne ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(x, S, z, O, await e.read(`link list --source message:${x.id} ${H} --page ${O} --page-size ${S === Ne ? 10 : 25}`));
    } catch (I) {
      i(x, S, z, I);
    }
  }
  async function c(x) {
    const S = x.map((O) => ({ [Ne]: o(O, Ne), [Je]: o(O, Je) }));
    try {
      const O = await e.read(`link receipts --messages ${x.map((z) => z.id).join(",")}`);
      x.forEach((z, H) => {
        const I = O.ok ? O.value.messages[String(z.id)] : null;
        l(z, Ne, S[H][Ne], 1, O.ok ? { ok: !0, value: I.named } : O), l(z, Je, S[H][Je], 1, O.ok ? { ok: !0, value: I.sent } : O);
      });
    } catch (O) {
      x.forEach((z, H) => [Ne, Je].forEach((I) => i(z, I, S[H][I], O)));
    }
  }
  function f() {
    a = null;
    const x = [...n].map((S) => t.get(S)).filter((S) => S && s(S));
    n.clear(), x.forEach((S) => S.dirty.clear());
    for (let S = 0; S < x.length; S += al) c(x.slice(S, S + al));
  }
  function h(x, S = [Ne, Je]) {
    for (const O of S) x.dirty.add(O);
    s(x) && (n.add(x.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(x) {
    const S = x.sources ?? (x.source_model && Number.isInteger(x.source_id) ? [{ model: x.source_model, id: x.source_id }] : []), O = x.link_types ?? (x.link_type ? [x.link_type] : []), z = O.length ? [Ne, Je].filter((I) => I === Ne ? O.some((D) => ["about", "edited"].includes(D)) : O.includes("sent_to")) : [Ne, Je];
    if (!z.length) return;
    const H = S.length ? [...new Set(S.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, rk);
    for (const I of H) h(I, z);
  }
  const y = (E = e.follow) == null ? void 0 : E.call(e, ["link.*"], p), b = {
    attach(x, S) {
      let O = t.get(x);
      return O || (O = { id: x, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ne, Je]), work: sl(), sent: sl() }, t.set(x, O)), O.views.add(S), O.dirty.size && h(O, [...O.dirty]), O;
    },
    shown(x) {
      x.dirty.size && h(x, [...x.dirty]);
    },
    detach(x, S) {
      x.views.delete(S), x.views.size || t.delete(x.id), t.size || (clearTimeout(a), y == null || y(), Pn.delete(e));
    },
    more(x, S) {
      const O = x == null ? void 0 : x[S];
      if (O != null && O.next.value && !O.loading.value) return u(x, S, O.next.value);
    }
  };
  return Pn.set(e, b), b;
}
function ck(e, t, n) {
  const a = Ze(null);
  let s = null;
  const o = pe(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = uk(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = pe(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), h == null || h.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return pa(o), {
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Ne),
    loadSent: () => s == null ? void 0 : s.more(a.value, Je)
  };
}
const dk = ["data-incoming", "data-ref"], fk = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], hk = { class: "message-body" }, mk = ["title"], pk = ["innerHTML"], gk = ["innerHTML"], vk = {
  class: "message-faces",
  "data-message-faces": ""
}, yk = ["title", "data-face", "onClick"], bk = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, kk = ["title", "data-reaction", "onClick"], wk = {
  key: 0,
  class: "message-reaction-count"
}, $k = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, xk = ["href", "title"], Sk = ["src", "alt"], Mk = ["href"], _k = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Ck = { class: "message-foot" }, Ak = { class: "message-time" }, Ek = {
  class: "message-id",
  "data-message-id": ""
}, Ok = 1500, Tk = "An earlier message", Ik = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _(null), l = M(() => ["user", "comment"].includes(n.message.type)), i = M(() => {
      const [oe, te] = (n.message.commented_row || ":").split(":"), ae = gt(oe);
      return ae ? { ref: `${ae}:${te}`, label: `${Kt(ae).title.toLowerCase()} ${te}` } : null;
    }), u = M(() => n.message.worker_id ?? null), c = M(() => ek(n.message)), f = M(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var oe;
      await ((oe = navigator.clipboard) == null ? void 0 : oe.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Ok);
    }
    const p = Bi(), y = M(() => p(n.message.text ?? "")), b = M(() => JSON.parse(n.message.flowchart_edges || "[]")), E = _(!1), x = M(() => ws(n.quote)), S = M(() => p(x.value || Tk));
    function O() {
      const oe = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      oe ? oe.scrollIntoView({ block: "center", behavior: "smooth" }) : je(`messages:${n.message.parent_id}`);
    }
    ok(o, () => `${n.message.text} ${x.value}`);
    const z = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, H = (oe) => `/api/files/message/${n.message.id}/${encodeURIComponent(oe)}`, I = M(() => JSON.parse(n.message.captions || "{}")), D = M(() => (n.message.files ?? []).map((oe) => ({ name: oe, address: H(oe), isImage: z.test(oe), title: I.value[oe] || oe }))), L = M(() => Hi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), q = Se(Le, null), { links: T, total: N, more: w, loading: g, failure: $, sentTo: C, sentMore: R, sentLoading: F, sentFailure: G, loadMore: K, loadSent: he } = ck(q, () => l.value && !n.message.local ? n.message.id : null, o), ce = _(!1), be = M(() => ik(n.message.reactions));
    function Ie(oe) {
      ce.value = !1, a("react", n.message, oe);
    }
    return (oe, te) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(Bb, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: te[0] || (te[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, dk)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", hk, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: Q(["message-card", "md", { comment: i.value }]),
          onClick: te[5] || (te[5] = (...ae) => B(Nt) && B(Nt)(...ae))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: te[1] || (te[1] = $e((ae) => B(je)(i.value.ref), ["stop"]))
          }, [
            A(le, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, mk)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(O, ["stop"]),
            innerHTML: S.value
          }, null, 8, pk)) : k("", !0),
          u.value !== null ? (r(), W(fn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: te[2] || (te[2] = $e((ae) => B(je)(`agents:${u.value}`), ["stop"]))
          }, {
            default: P(() => [
              Y("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          A(Ci, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: P(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, gk)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(j, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: te[3] || (te[3] = (ae) => E.value = !0)
            }, "Open the flowchart"),
            E.value ? (r(), W(gb, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: te[4] || (te[4] = (ae) => E.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        m("div", {
          class: Q(["message-tools", { picking: ce.value }]),
          "data-message-tools": ""
        }, [
          ce.value ? (r(), d(j, { key: 0 }, [
            m("div", vk, [
              (r(!0), d(j, null, ne(B(lk), (ae) => (r(), d("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Oe) => Ie(ae)
              }, v(ae), 9, yk))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: te[6] || (te[6] = (ae) => ce.value = !1)
            }, [
              A(le, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(j, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: te[7] || (te[7] = (ae) => ce.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: te[8] || (te[8] = (ae) => a("reply", e.message))
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
              onClick: te[9] || (te[9] = (ae) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      be.value.length ? (r(), d("div", bk, [
        (r(!0), d(j, null, ne(be.value, (ae) => (r(), d("button", {
          key: ae.emoji,
          type: "button",
          class: Q(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Oe) => a("react", e.message, ae.emoji)
        }, [
          Y(v(ae.emoji) + " ", 1),
          ae.count > 1 ? (r(), d("span", wk, v(ae.count), 1)) : k("", !0)
        ], 10, kk))), 128))
      ])) : k("", !0),
      D.value.length ? (r(), d("div", $k, [
        (r(!0), d(j, null, ne(D.value, (ae) => (r(), d(j, {
          key: ae.name
        }, [
          ae.isImage ? (r(), d("a", {
            key: 0,
            href: ae.address,
            target: "_blank",
            class: "message-image",
            title: ae.title
          }, [
            m("img", {
              src: ae.address,
              alt: ae.name,
              "data-figure-picture": ""
            }, null, 8, Sk)
          ], 8, xk)) : (r(), d("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, v(ae.name), 9, Mk))
        ], 64))), 128))
      ])) : k("", !0),
      B(C).length ? (r(), d("div", _k, [
        A(le, {
          name: "send",
          size: 12
        }),
        (r(!0), d(j, null, ne(B(C), (ae) => (r(), W(fn, {
          key: ae.id,
          as: "button",
          "agent-id": ae.id,
          label: `Worker ${ae.id}`,
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          onClick: $e((Oe) => ae.open_ref && B(je)(ae.open_ref), ["stop"])
        }, {
          default: P(() => [
            Y("Also sent to worker " + v(ae.id), 1),
            ae.unavailable ? (r(), d(j, { key: 0 }, [
              Y(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      A(wn, {
        more: B(R),
        loading: B(F),
        failure: B(G),
        label: "More recipients",
        onMore: B(he)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Ck, [
        m("time", Ak, v(L.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(j, { key: 0 }, [
          te[10] || (te[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Ek, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), W(Xb, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      B(T).length || B($) ? (r(), W(Gb, {
        key: 3,
        links: B(T),
        total: B(N),
        more: B(w),
        loading: B(g),
        failure: B($),
        onMore: B(K)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, fk));
  }
}, _6 = /* @__PURE__ */ U(Ik, [["__scopeId", "data-v-82f2c98a"]]), la = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ha = 200, or = (e) => {
  var t;
  return ((t = la.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? la[0].key;
}, C6 = (e) => {
  var t;
  return ((t = la.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Bk = ["aria-label"], Rk = 300, ol = 400, Lk = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ha } },
  setup(e) {
    const t = e, n = M(() => or(t.value)), a = M(() => n.value < Ha ? [1, 0.25, 0.25] : n.value === Ha ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Q(["ico", "prio", { hot: n.value >= ol, high: n.value >= Rk && n.value < ol }]),
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
    ], 10, Bk));
  }
}, A6 = /* @__PURE__ */ U(Lk, [["__scopeId", "data-v-b10e610f"]]), lr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], E6 = (e) => {
  const t = lr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, Nk = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, ll = (e) => Nk[e.card.state] || "idle", qk = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), il = { working: 0, waiting: 1, idle: 2, stopped: 3 }, rl = (e, t) => il[ll(e)] - il[ll(t)], ul = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, O6 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => rl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || qk(a, s)) : [...e].sort((a, s) => rl(a, s) || (ul[t] || ul.state)(a, s)), Dk = { class: "list-row" }, Pk = {
  key: 0,
  class: "list-row-type"
}, jk = { class: "list-row-main" }, Fk = {
  key: 0,
  class: "list-row-title"
}, Wk = { class: "list-row-body" }, Hk = {
  key: 1,
  class: "list-row-end"
}, zk = {
  key: 1,
  class: "list-row-text"
}, Uk = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Dk, [
      e.type ? (r(), d("span", Pk, v(e.type), 1)) : k("", !0),
      m("div", jk, [
        e.title ? (r(), d("span", Fk, v(e.title), 1)) : k("", !0),
        m("div", Wk, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", Hk, [
          re(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (r(), d("span", zk, v(e.text), 1)) : k("", !0)
    ]));
  }
}, T6 = /* @__PURE__ */ U(Uk, [["__scopeId", "data-v-dfc8c3a7"]]), I6 = {
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
    return (l, i) => (r(), W(Us, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Gk = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: Q(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, _s = /* @__PURE__ */ U(Gk, [["__scopeId", "data-v-978e0921"]]), Vk = ["aria-label"], Kk = { class: "head" }, Yk = { class: "names" }, Qk = { class: "body" }, Xk = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = gi(a, n), i = vi(s);
    return (u, c) => (r(), W(kn, { to: "body" }, [
      A(Gt, {
        name: "side",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: P(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Q(["veil", { over: e.over, under: e.depth }]),
            style: ve({ "--depth": e.depth, zIndex: B(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = $e((...f) => B(o) && B(o)(...f), ["self"]))
          }, [
            m("aside", {
              class: Q(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(j, { key: 0 }, [
                m("header", Kk, [
                  m("div", Yk, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (r(), W(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    re(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  re(u.$slots, "actions", {}, void 0, !0),
                  A(va, {
                    title: e.closeLabel,
                    onClick: B(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), W(_s, { key: 0 }, {
                  default: P(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                m("div", Qk, [
                  re(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), W(_s, {
                  key: 1,
                  class: "below"
                }, {
                  default: P(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : re(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, Vk)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, B6 = /* @__PURE__ */ U(Xk, [["__scopeId", "data-v-d0a677ef"]]), Jk = {
  key: 1,
  class: "text-field-label"
}, Zk = {
  key: 2,
  class: "text-field-end"
}, ew = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ jt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = rn(e, "modelValue"), a = ma(), s = "onUpdate:modelValue" in (((f = ru()) == null ? void 0 : f.vnode.props) || {}), o = M(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = M(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), u = M(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = _(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (r(), d("label", {
      key: 0,
      class: Q(["text-field", { large: e.large, ended: h.$slots.end }, B(a).class]),
      style: ve(B(a).style)
    }, [
      e.icon ? (r(), W(le, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", Jk, v(e.label), 1)) : k("", !0),
      et(m("input", De({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [B(vs), o.value]
      ]),
      h.$slots.end ? (r(), d("span", Zk, [
        re(h.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : et((r(), d("input", De({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [B(vs), o.value]
    ]);
  }
}), R6 = /* @__PURE__ */ U(ew, [["__scopeId", "data-v-d9c38ca8"]]), tw = { class: "title" }, nw = { class: "state" }, aw = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ds(t.line, t.events);
    return (o, l) => (r(), W(N0, {
      rows: B(n),
      failure: B(a),
      loaded: B(s),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        m("span", tw, v(i.title), 1),
        m("span", nw, v(B(cn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, L6 = /* @__PURE__ */ U(aw, [["__scopeId", "data-v-6be0c59e"]]);
function sw(e = 1e3, t = null) {
  const n = _(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const za = _(Date.now() / 1e3);
let cl = 0, jn = 0;
function ro() {
  return jn || (za.value = Date.now() / 1e3, cl = setInterval(() => za.value = Date.now() / 1e3, 1e3)), jn += 1, Wl() && pa(() => {
    jn -= 1, jn || clearInterval(cl);
  }), za;
}
const ow = 200, lw = nr + Kn + ar + ow, iw = 300, Fn = /* @__PURE__ */ new WeakMap();
function rw(e, t) {
  const n = Fn.get(e) ?? [];
  Fn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Fn.get(e);
    Fn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, iw);
}
function Xt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function uw(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Xt(e),
    top: Xt(e.querySelector(".top")),
    title: Xt(e.querySelector(".title")),
    contents: Xt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: Xt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function cw(e, t, n, a) {
  pe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(uw(o, l, n.value)), performance.now() - l < lw) return void requestAnimationFrame(u);
        rw(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const dw = ["title", "data-figure-mark", "data-folded", "data-open"], fw = {
  key: 2,
  class: "worker"
}, hw = { class: "head" }, mw = { key: 0 }, pw = {
  key: 3,
  class: "status"
}, gw = {
  key: 0,
  class: "figure"
}, vw = {
  key: 1,
  class: "ran-for"
}, yw = { key: 2 }, bw = {
  key: 3,
  class: "news"
}, kw = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, ww = {
  key: 6,
  class: "settled"
}, $w = {
  key: 1,
  class: "bar"
}, xw = {
  key: 3,
  class: "detail body"
}, Sw = {
  key: 0,
  class: "body-label"
}, Mw = ["title"], _w = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ma(), a = ["onClick", "onAct"], s = M(() => Object.fromEntries(Object.entries(n).filter(([ce]) => !a.includes(ce)))), o = _(!1), l = M(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = M(() => t.open !== void 0), u = M(() => i.value || l.value), c = M(() => i.value ? t.open : o.value), f = M(() => i.value ? !t.open : l.value && !o.value), h = M(() => !!(t.mark.action && n.onAct)), p = M(() => u.value || h.value || !!n.onClick), y = _(null), b = _(null), { folded: E, phase: x } = sr(y, () => f.value);
    cw(y, f, x, Se(Le, null));
    function S(ce) {
      var be, Ie;
      if (!(ce.target !== y.value && !b.value.contains(ce.target))) {
        if (i.value) return (be = n.onClick) == null ? void 0 : be.call(n, ce);
        if (l.value) return void (o.value = !o.value);
        (Ie = n.onAct || n.onClick) == null || Ie(ce);
      }
    }
    const O = (ce) => n.onAct(ce), z = ["failed", "unfinished"], H = M(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? z.includes(t.mark.state) ? "danger" : "good" : ""), I = M(() => t.mark.color ? t.mark.color : H.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : H.value ? `var(--tone-${H.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), D = M(() => I.value || "var(--tone-work)"), L = M(() => !t.mark.ending && !t.mark.ended && H.value !== "stopped"), q = ro(), T = M(
      () => t.mark.began_at && L.value && !t.mark.figure && !t.mark.counting ? zi(q.value - t.mark.began_at) : ""
    ), N = M(() => {
      const { started: ce, ended: be } = t.mark;
      return ce ? be ? `ran ${Jo(be - ce, !0)}` : Jo(q.value - ce, !0) : T.value;
    }), w = ["bad", "danger", "warn"], g = M(() => w.includes(H.value) || t.mark.asks ? "attention" : L.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), $ = ["bad", "danger"], C = M(() => $.includes(H.value)), R = M(() => g.value === "process" ? "running" : C.value ? "cross" : H.value === "stopped" ? "stopped" : H.value === "good" ? "tick" : ""), F = M(
      () => !!(t.mark.figure || N.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), G = M(() => t.mark.markIcon ? { component: Et, props: { class: "ico", name: t.mark.markIcon } } : { component: le, props: { name: t.mark.icon || "dot" } }), K = M(() => [t.mark.title, t.mark.time ? Hi(t.mark.time) : ""].filter(Boolean).join(" · ")), he = M(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ce, be) => (r(), d("div", De(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${g.value}`,
        B(x),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: C.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: I.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: he.value,
      title: K.value,
      "data-figure-mark": e.mark.key,
      "data-folded": B(E) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: S
    }), [
      (r(), W(Ke(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: P(() => [
          e.mark.agentId ? (r(), W(fn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: P(() => [
              (r(), W(Ke(G.value.component), cs(Hl(G.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), W(Ke(G.value.component), cs(De({ key: 1 }, G.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", fw, v(e.mark.worker), 1)) : k("", !0),
          m("span", hw, [
            A(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", mw, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), W(Yt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          F.value ? (r(), d("span", pw, [
            e.mark.figure ? (r(), d("span", gw, v(e.mark.figure), 1)) : k("", !0),
            N.value ? (r(), d("span", vw, v(N.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", yw, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", bw, v(e.mark.news), 1)) : k("", !0),
            R.value === "running" ? (r(), d("span", kw)) : R.value ? (r(), W(Et, {
              key: 5,
              class: Q(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", ww, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (r(), W(tr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: $e(O, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && L.value ? (r(), d("span", $w, [
        m("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: D.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !B(E) ? (r(), W(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !B(E) ? (r(), d("div", xw, [
        e.mark.bodyLabel ? (r(), d("p", Sw, v(e.mark.bodyLabel), 1)) : k("", !0),
        A(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !B(E) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Mw)) : k("", !0),
      e.mark.card ? (r(), W(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      re(ce.$slots, "default", {
        shown: !B(E)
      }, void 0, !0)
    ], 16, dw));
  }
}), ir = /* @__PURE__ */ U(_w, [["__scopeId", "data-v-6e839007"]]), Cw = 8, Aw = 40, Ew = [];
class uo {
  constructor(t, n, { top: a = Cw, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Ew.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new uo(t, {
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
    n > Aw && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await Fe(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await Fe();
  }
}
const Ow = 60, Tw = 300, rr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function ur(e, t) {
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
  async function u() {
    const h = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return h.ok ? (n.value = [...h.value.lines, ...n.value], a.value = h.value.first_byte, !0) : !1;
  }
  const c = new uo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Tw, more: () => a.value > 0, previous: u }, { top: Ow });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Iw = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function cr(e) {
  var n;
  const t = Iw[e] || ((n = Kt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const Bw = (e) => cr(String(e).split(":")[0]), Rw = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Lw = "agents", Nw = { passed: "good", failed: "danger", warned: "warn", running: "" }, qw = { good: "good", warn: "warn", danger: "danger" }, dl = {
  "open row": (e) => je(`${e.target_model}:${e.target_id}`),
  "open page": (e) => nh(e.target_model, e.target_id || 0)
}, Dw = { "open row": (e) => Bw(e.target_model), "open page": () => cr("pages") };
function Pw(e, t) {
  const n = t || {}, a = dl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Nw[e.outcome] || "" : qw[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === Lw ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Dw[a](e) : "",
    handlers: a ? { onAct: () => dl[a](e) } : {}
  };
}
const jw = 24, Fw = 1e3, fl = 2e3, Ww = 0.25, Hw = 5e3;
function zw(e, t = jw, n = () => !0) {
  const a = _(!1), s = _(0), o = _(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const H = c();
    return H ? H.scrollHeight - H.scrollTop - H.clientHeight : 0;
  }, h = () => !c() || f() <= t;
  function p(H) {
    if (clearTimeout(l), !H) {
      o.value = !1, u = Date.now();
      return;
    }
    const I = Date.now() - u < fl ? fl : Fw;
    l = setTimeout(() => o.value = a.value, I);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(H = !1) {
    const I = c();
    I && H && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), y();
  }
  function E() {
    S(), !a.value && (a.value = !0, p(!0));
  }
  const x = () => !!c() && f() <= c().clientHeight * Ww;
  function S() {
    clearTimeout(i), x() && (i = setTimeout(() => a.value && x() && n() && b(!0), Hw));
  }
  function O() {
    h() ? y() : E();
  }
  function z(H = 1, I = !1) {
    a.value ? s.value += Math.max(0, H) : b(I);
  }
  return Wl() && pa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: h, follow: y, toBottom: b, left: E, scrolled: O, arrived: z };
}
const Uw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Gw = (e) => String(e ?? "").replace(Uw, ""), Vw = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), { away: o, scrolled: l, arrived: i, toBottom: u } = zw(s);
    pe(
      () => [n.lines, n.lines.length],
      () => Fe(() => {
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
      Y(v(B(Gw)(e.lines.join(`
`)) || e.empty), 1),
      B(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => B(u)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, Kw = /* @__PURE__ */ U(Vw, [["__scopeId", "data-v-89621acd"]]), Yw = "*.*", Qw = {
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
    const t = e, n = Se(Le, null), a = new ti();
    pe(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (y) => a.dispatch(y));
        f(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = M(() => !!(t.declaration.shipped || t.declaration.trusted)), i = M(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Yw] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), W(Ji, {
      key: 0,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), W(Xi, {
      key: 1,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Xw = { class: "mark-more-inner" }, Jw = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Zw = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, e2 = {
  key: 3,
  class: "mark-lines"
}, t2 = "process", hl = "task", n2 = {
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
    const t = e, n = at(), a = M(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = M(() => Rw.has(t.mark.variant) && t.mark.detail || ""), o = M(() => t.mark.target_model === hl ? t.mark.target_id : 0), l = ur(
      rr(n),
      () => t.mark.target_id
    ), i = l.lines, u = _(!1), c = _(""), f = M(() => !t.declaration.body_url && t.mark.target_model === t2 && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = M(() => t.shown && f.value);
    return pe(p, (y) => y && h()), Fs(() => p.value && h(), () => p.value && !t.mark.ended_at), pe(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, b) => (r(), d("div", {
      class: Q(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = $e(() => {
      }, ["stop"]))
    }, [
      m("div", Xw, [
        e.declaration.body_url ? (r(), W(Qw, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(j, { key: 1 }, [
          s.value ? (r(), d(j, { key: 0 }, [
            b[2] || (b[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Jw, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", Zw, v(c.value), 1)) : f.value && u.value ? (r(), d(j, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            A(Kw, {
              class: "mark-terminal",
              lines: B(i),
              feed: B(l).feed,
              onOlder: B(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", e2, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = $e((E) => B(je)(`${hl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Cs = /* @__PURE__ */ U(n2, [["__scopeId", "data-v-df71b15a"]]), a2 = ["title", "aria-label", "onClick"], s2 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, o2 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = M(() => Af(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = _(""), s = Se(Le);
    async function o(l) {
      const i = await $n(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(j, null, [
      (r(!0), d(j, null, ne(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: $e((c) => o(u), ["stop"])
      }, [
        A(Et, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, a2))), 128)),
      a.value ? (r(), d("span", s2, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, l2 = /* @__PURE__ */ U(o2, [["__scopeId", "data-v-7a62c88e"]]);
function dr(e, t) {
  const n = Ze(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ce.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const fr = dr("/api/marks", "marks"), N6 = fr.fetchAll, i2 = fr.find, r2 = ["data-ref"], u2 = ["data-ref"], c2 = { class: "mark-row" }, d2 = "dock add", f2 = "questions.answer", h2 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = M(() => i2(a.mark.type)), o = M(() => Pw(a.mark, s.value)), l = M(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = M(() => l.value || !!o.value.handlers.onAct), u = M(() => a.mark.type === f2), c = _(!1);
    function f() {
      c.value = !c.value;
    }
    const h = M(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(d2));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var b, E;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: Q(["thread-turn", "card", "whole-card", { "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(Cs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, r2)) : (r(), d("div", {
        key: 1,
        class: Q(["thread-turn", "card", { "full-width": (E = s.value) == null ? void 0 : E.full_width, docked: e.docked, "user-side": B(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", c2, [
          A(ir, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Fl({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: x }) => [
                A(Cs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: x
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A(l2, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, u2));
    };
  }
}, m2 = /* @__PURE__ */ U(h2, [["__scopeId", "data-v-424ddb61"]]), p2 = ["data-ref"], g2 = ["inert"], v2 = { class: "group-fold" }, y2 = { class: "thread-group" }, b2 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(!1), a = _(!1), s = _(!1), o = _(null);
    pe(n, async (i) => {
      var u;
      a.value = !0, await Fe(), (u = o.value) == null || u.offsetHeight, s.value = i;
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
    return (i, u) => (r(), d("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      A(ir, {
        mark: l.value,
        open: n.value,
        onClick: u[0] || (u[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (r(), d("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Q(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        m("div", v2, [
          m("div", y2, [
            (r(!0), d(j, null, ne(e.group.marks, (c) => (r(), W(m2, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, g2)) : k("", !0)
    ], 8, p2));
  }
}, q6 = /* @__PURE__ */ U(b2, [["__scopeId", "data-v-45b58b9b"]]);
function k2(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Me(() => n.observe(e.value)), nt(() => n.disconnect()), t;
}
const w2 = { class: "chat-dock-fold" }, $2 = ["aria-label"], x2 = { class: "chat-dock-head" }, S2 = { class: "chat-dock-inner" }, M2 = { class: "chat-dock-foot" }, hr = 700, _2 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = _(null), a = _(null), s = k2(a), o = _(!1);
    let l = 0;
    return Me(() => l = setTimeout(() => o.value = !0, hr)), nt(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Q(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", w2, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Q(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          re(i.$slots, "edge", {}, void 0, !0),
          m("header", x2, [
            re(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Q(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", S2, [
              m("div", {
                class: Q(["chat-dock-grow", { settled: o.value }]),
                style: ve(B(s) === null ? null : { height: `${B(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  re(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          re(i.$slots, "still", {}, void 0, !0),
          m("footer", M2, [
            re(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, $2)
      ])
    ], 2));
  }
}, C2 = /* @__PURE__ */ U(_2, [["__scopeId", "data-v-cc05fdac"]]), A2 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ua = 5, E2 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ua, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ua}s`, animationDelay: `${(n - Ua).toFixed(2)}s` };
    return (s, o) => (r(), d("span", A2, [
      m("i", { style: a })
    ]));
  }
}, O2 = /* @__PURE__ */ U(E2, [["__scopeId", "data-v-2a7bc150"]]), T2 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), As = (e) => e.charAt(0).toUpperCase() + e.slice(1), I2 = (e) => As(e.replace(/_at$/, "").replaceAll("_", " ")), B2 = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, R2 = (e, t, n) => [As(`${e} ${n}`), (t == null ? void 0 : t.state) && As(t.state)].filter(Boolean).join(" · "), mr = (e) => e.given_name || `${Wt(e.role)} ${e.number}`, L2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? mr(t) : (e == null ? void 0 : e.name) ?? "", N2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? mr(t) : "", q2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !T2.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: I2(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], D2 = { reviewing: "Under review" }, P2 = (e, t) => e || D2[t == null ? void 0 : t.state] || "", pr = dr("/api/docks", "docks"), D6 = pr.fetchAll, Lt = pr.find, j2 = 6, Ga = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, co = (e) => Date.parse(e.leaves_at) / 1e3, Zt = (e) => !!(e.leaves_at && !e.kept), F2 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Zt(e) || t < co(e) || n.has(e.id)), W2 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => F2(a, t, n)).sort((a, s) => a.id - s.id);
function H2(e, t, n = j2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(co(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const z2 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Es = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), U2 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), G2 = (e) => ({ ...e.kept ? Es("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Es("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), V2 = ["keep", "unkeep", "open", "undock"], K2 = (e) => ({ ...e, iconOnly: V2.includes(e.action) });
function Y2(e, t) {
  var n;
  return [
    ...U2(e, t) ? [G2(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Kt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Es("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(K2);
}
function gr(e, t) {
  const n = Y2(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: z2(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Q2 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || gr(e, t).title, X2 = { class: "dock-text" }, J2 = ["title"], Z2 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, e$ = {
  class: "dock-facts",
  "data-dock-facts": ""
}, t$ = {
  key: 1,
  "data-dock-row": ""
}, n$ = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = M(() => Lt(a.item.type)), o = ro(), l = M(() => Sn(a.item.created_at, o.value * 1e3)), i = _(null), u = _(null), c = _(null), f = _(null), h = M(() => gr(a.item, s.value)), p = at(), y = M(() => `dock.${a.item.id}`), b = M(() => p.props[y.value].data.value), E = M(() => Q2(a.item, s.value, b.value)), x = M(() => sa(a.item.target_model ?? "")), S = M(() => {
      var w;
      return ((w = s.value) == null ? void 0 : w.word) ?? "";
    }), O = M(() => ({ ...b.value, id: a.item.target_id, term: x.value })), z = () => {
      var w, g;
      return ((g = (w = s.value) == null ? void 0 : w.reads) == null ? void 0 : g.length) && p.reload(y.value);
    };
    Oc(Ds, { data: b, reload: z, readOutput: rr(p) }), pe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (w, g, $) => {
        var R;
        z();
        const C = (R = p.followUndeclared) == null ? void 0 : R.call(p, [`${x.value.replaceAll("-", "_")}.*`], (F) => {
          (!F.row_id || F.row_id === a.item.target_id) && z();
        });
        $(() => C == null ? void 0 : C());
      },
      { immediate: !0 }
    );
    const H = _(/* @__PURE__ */ new Set()), I = _("");
    async function D(w) {
      if (w.action === "undock") return n("undock", w);
      if (w.action === "open") return je(`${a.item.target_model}:${a.item.target_id}`);
      w.action === "declared" && (H.value = /* @__PURE__ */ new Set([...H.value, w.label])), I.value = "";
      const $ = await $n(w, { id: a.item.target_id }, p.environment);
      ($ == null ? void 0 : $.ok) === !1 && (H.value = new Set([...H.value].filter((C) => C !== w.label)), I.value = `Could not ${w.label.toLowerCase()}: ${$.error}`);
    }
    const L = M(() => h.value.actions.filter((w) => !H.value.has(w.label))), q = M(() => {
      var w;
      return P2((w = s.value) == null ? void 0 : w.badge, O.value);
    }), T = M(() => h.value.controls), N = M(() => {
      var w;
      return !!((w = s.value) != null && w.draws_head) && !a.collapsed;
    });
    return (w, g) => {
      var $, C, R, F;
      return r(), W(C2, {
        label: h.value.title + (($ = s.value) != null && $.needs_user ? ", waiting for you" : ""),
        type: (C = s.value) != null && C.needs_user ? "waiting" : "",
        folded: !!((R = s.value) != null && R.folds) && e.folded,
        body: !!((F = s.value) != null && F.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: g[4] || (g[4] = (G) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (r(), W(O2, {
            key: 0,
            "ends-at": B(co)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: P(() => {
          var G;
          return [
            N.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(j, { key: 1 }, [
              A(le, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", X2, [
                m("span", {
                  class: Q(["dock-title", { strip: e.collapsed }]),
                  title: E.value
                }, v(E.value), 11, J2)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (G = s.value) != null && G.leaves_after_seconds ? k("", !0) : (r(), d(j, { key: 0 }, [
                Y(v(l.value), 1)
              ], 64))
            ], 512),
            T.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: g[0] || (g[0] = $e(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(j, null, ne(T.value, (K) => {
                var he, ce;
                return r(), d(j, {
                  key: K.action + K.runs
                }, [
                  !H.value.has(K.label) && (!((he = K.variants) != null && he.length) || !((ce = O.value) != null && ce.state) || K.variants.includes(O.value.state)) ? (r(), W(ge, {
                    key: 0,
                    variant: "icon",
                    class: Q({ kept: K.pressed }),
                    "aria-pressed": K.pressed,
                    "aria-label": K.label,
                    title: K.label,
                    "data-dock-action": K.action,
                    onClick: (be) => D(K)
                  }, {
                    default: P(() => [
                      A(le, {
                        name: K.icon,
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
        still: P(() => [
          I.value || e.refusal ? (r(), d("p", Z2, v(I.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: P(() => {
          var G;
          return [
            m("span", e$, [
              q.value ? (r(), d("span", {
                key: 0,
                class: Q(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(q.value), 3)) : k("", !0),
              S.value ? (r(), d("span", t$, v(S.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              m("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (G = s.value) != null && G.folds ? (r(), W(ge, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: g[1] || (g[1] = (K) => n("fold"))
            }, {
              default: P(() => [
                Y(v(s.value.folds) + " ", 1),
                A(Yt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            m("span", {
              class: "dock-acts",
              onClick: g[3] || (g[3] = $e(() => {
              }, ["stop"]))
            }, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              A(Js, {
                name: `dock.${e.item.type}`,
                row: O.value,
                environment: B(p).environment,
                "read-only": B(p).readOnly,
                "object-name": B(sa)(e.item.target_model),
                "external-failure": "",
                onFailure: g[2] || (g[2] = (K) => I.value = K),
                onDone: w.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (r(!0), d(j, null, ne(L.value, (K) => (r(), W(ge, {
                key: K.action + K.runs,
                small: "",
                variant: K.primary ? "primary" : "ghost",
                bordered: !K.primary,
                "data-dock-action": K.action,
                onClick: (he) => D(K)
              }, {
                default: P(() => [
                  Y(v(K.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: P(() => {
          var G;
          return [
            (G = s.value) != null && G.body_url ? (r(), W(Cs, {
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
}, ml = /* @__PURE__ */ U(n$, [["__scopeId", "data-v-66588dbe"]]), a$ = 24, s$ = 8, P6 = 420;
function j6({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= a$ ? !0 : e < t && s > s$ ? !1 : null;
}
const o$ = (e, t) => e === void 0 ? t : e, l$ = { me: 1, people: [] }, ia = Ut({
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
  people: l$,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: ta("journal.activity", !0),
  wide: !1,
  sideMini: ta("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Si("journal.activity", () => ia.activity);
Si("journal.side.mini", () => ia.sideMini);
const vr = "journal.viewer.";
function i$(e, t, n) {
  try {
    const a = n.getItem(vr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function r$(e, t, n) {
  try {
    n.setItem(vr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function pl(e, t, n = window.localStorage) {
  const a = _(i$(e, t, n));
  return pe(a, (s) => r$(e, s, n), { deep: !0 }), a;
}
const u$ = {
  key: "dock-all",
  class: "dock-all"
}, c$ = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var w, g;
    const t = e, n = sw(500), a = _(/* @__PURE__ */ new Set()), s = Se(Le), o = _(/* @__PURE__ */ new Set()), l = _({});
    async function i($, C) {
      l.value = { ...l.value, [$.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, $.id]);
      const R = await $n(C, { id: $.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((F) => F !== $.id)), l.value = { ...l.value, [$.id]: `Could not dismiss this card: ${R.error}` });
    }
    const u = M(
      () => W2(
        t.items.filter(($) => !o.value.has($.id)),
        n.value,
        a.value
      )
    ), c = M(
      () => H2(
        u.value.filter(($) => Ga($, Lt)),
        n.value
      )
    ), f = M(() => u.value.filter(($) => !c.value.includes($) && !Ga($, Lt))), h = pl(`dock-size:${((w = ia.identity) == null ? void 0 : w.root) || location.host}`, null), p = ($) => {
      var C;
      return !!((C = Lt($.type)) != null && C.needs_user);
    }, y = _(/* @__PURE__ */ new Set()), b = _(/* @__PURE__ */ new Set()), E = M(() => u.value.length === 1), x = ($) => p($) || E.value, S = ($) => x($) ? y.value.has($.id) || b.value.has($.id) : h.value ? h.value.collapsed && !h.value.opened.includes($.id) : t.collapsed, O = M(() => u.value.some(S));
    pe(() => t.collapsed, ($) => {
      b.value = new Set($ ? u.value.filter(p).map((C) => C.id) : []);
    });
    function z() {
      const $ = !O.value;
      h.value = { collapsed: $, opened: [] }, y.value = new Set($ ? u.value.filter(p).map((C) => C.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function H($) {
      var R;
      if (!S($)) return;
      if (x($)) {
        y.value = new Set([...y.value].filter((F) => F !== $.id)), b.value = new Set([...b.value].filter((F) => F !== $.id));
        return;
      }
      const C = (R = h.value) != null && R.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...C, $.id] };
    }
    const I = pl(`dock-folded:${((g = ia.identity) == null ? void 0 : g.root) || location.host}`, {}), D = ($) => {
      var C;
      return !!((C = Lt($.type)) != null && C.folds) && (t.insidesFolded || o$(I.value[$.id], Ga($, Lt) || t.folded));
    };
    function L($) {
      D($) && q($), I.value = { ...I.value, [$.id]: !D($) };
    }
    function q($) {
      var C;
      !((C = h.value) != null && C.collapsed) || h.value.opened.includes($.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, $.id] });
    }
    function T($) {
      a.value = /* @__PURE__ */ new Set([...a.value, $.id]);
    }
    function N($) {
      a.value = new Set([...a.value].filter((C) => C !== $.id));
    }
    return ($, C) => (r(), W(Ps, {
      tag: "div",
      name: "dock",
      duration: B(hr),
      class: "dock-stack"
    }, {
      default: P(() => [
        u.value.length > 1 ? (r(), d("div", u$, [
          A(ge, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": O.value ? "Open all" : "Collapse all",
            onClick: z
          }, {
            default: P(() => [
              A(Yt, {
                open: !O.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(j, null, ne(f.value, (R) => (r(), W(ml, {
          key: R.id,
          item: R,
          class: Q({ timed: B(Zt)(R) }),
          leaving: B(Zt)(R) && !a.value.has(R.id),
          folded: D(R),
          collapsed: S(R),
          refusal: l.value[R.id],
          onOpen: (F) => H(R),
          onFold: (F) => L(R),
          onUndock: (F) => i(R, F),
          onMouseenter: (F) => T(R),
          onMouseleave: (F) => N(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(j, null, ne(c.value, (R) => (r(), W(ml, {
          key: R.id,
          item: R,
          class: Q({ timed: B(Zt)(R) }),
          leaving: B(Zt)(R) && !a.value.has(R.id),
          folded: D(R),
          collapsed: S(R),
          refusal: l.value[R.id],
          onOpen: (F) => H(R),
          onFold: (F) => L(R),
          onUndock: (F) => i(R, F),
          onMouseenter: (F) => T(R),
          onMouseleave: (F) => N(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, F6 = /* @__PURE__ */ U(c$, [["__scopeId", "data-v-2c47a65e"]]), Mt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Yn = (e) => Math.min(Math.max(e, 0), 1), d$ = (e) => {
  const t = Yn(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => d$((e - t) / (n - t));
function W6(e) {
  const t = Yn(e), n = Yn((t - 0.12) / 0.76) * Mt.shuffles, a = Math.min(Math.floor(n), Mt.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), i = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), u = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * Yn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / Mt.shuffles, lift: Mt.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function H6(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const gl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, z6 = (e) => gl[e] ?? gl.butler, fo = 2400, f$ = 0.05;
function h$({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, f$), l = Math.min(t + fo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function U6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function m$(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function G6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const V6 = (e, t) => ({ ...e, stretch: t.stretch }), K6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, yr = (e, t) => t >= (e.least ?? 0);
function Y6(e, t, n) {
  if (!yr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const Q6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), p$ = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", vl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), g$ = (e) => e.right > e.left && e.bottom > e.top;
function X6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(p$)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = vl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = vl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), g$(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function br(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[h] || e[f] > o[p]) && (i = -1);
      else {
        const b = (o[h] - e[f]) / y, E = (o[p] - e[f]) / y;
        l = Math.max(l, Math.min(b, E)), i = Math.min(i, Math.max(b, E));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const u = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: u, y: c, on: "surface", surface: s.id, dx: u - s.left, dy: c - s.top };
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
}, mn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), v$ = (e) => e * e * (3 - 2 * e), Te = (e, [t, n]) => v$(mn(e, t, n)), y$ = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], pt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Wn = ([e, t], n) => e + n() * (t - e);
function b$(e) {
  return y$.map(() => {
    const t = Wn(pt.speed, e), n = Wn(pt.angle, e) * Math.PI / 180, a = Wn(pt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Wn(pt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const k$ = b$(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function w$(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * pt.gravity * (t[2] - pt.floor))) / pt.gravity;
}
function J6(e, t, n = k$) {
  const a = Ee.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = w$(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, h) => f + o.velocity[h] * u);
  return c[2] -= pt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const Z6 = (e, t) => e && Ee[e.name] ? { name: e.name, u: t / e.frames } : null;
function eM(e, t) {
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
const tM = () => Array.from({ length: Ee.pogo.count }, (e, t) => Ee.pogo.bounce * (t + 1) / Ee.pogo.count), Pt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function nM(e, t, n) {
  const { away: a, side: s } = Ee.bug_smash, o = s * a * n, [l, i] = [t.left + Pt.margin * n, t.right - Pt.margin * n], u = Math.min(Math.max(e + o + s * Pt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function aM(e, t, n) {
  const a = Ee.bug_smash, s = Te(t, a.walk), o = ([l, i]) => l + (i - l) * s;
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
function sM(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Pt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = h$({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Pe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function oM(e) {
  const t = Pe.least + Math.floor(e() * (Pe.most - Pe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Pe.walls[Math.floor(e() * Pe.walls.length)],
    along: Pe.margin + e() * (1 - 2 * Pe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Os(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Pe.margin, l = ((e.along - Pe.margin + e.way * Pe.speed * n / a) / s % 2 + 2) % 2, i = Pe.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Pe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Pe.inset : t.right - Pe.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function $$(e, t) {
  const n = Ee.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = m$(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function lM(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ee.bug_shot, { frame: l, bug: i, shot: u } = $$(n, e.length), c = e.map((S, O) => ({ ...Os(S, t, Math.min(n / o.fps, Qn(O).shot)), shot: O < u })), f = Te(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((S, O) => ({ bug: S, index: O, seconds: n / o.fps - Qn(O).shot, spot: Os(S, t, Qn(O).shot) })).filter((S) => S.seconds >= 0), b = y.flatMap((S) => {
    const O = (s == null ? void 0 : s.get(S.index)) ?? C$(S.bug, t, S.spot, s ? [] : a);
    return s == null || s.set(S.index, O), s && A$(O, S.seconds, a), E$(O, S.seconds, a);
  }), E = y.filter((S) => M$(S.bug)).map((S) => ({ seconds: S.seconds, from: S.spot })), x = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * f, y: h.y + (p.y - h.y) * f, back: x }, slush: b, camera: E };
}
function Qn(e) {
  const t = Ee.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function iM(e, t, n, a) {
  const { limit: s, margin: o } = Ee.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const h = Qn(f), p = Os(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), E = Math.abs(p.x - u) >= y ? u : p.x + b * y, x = b > 0 ? Math.max(u, Math.min(E, i)) : Math.min(u, Math.max(E, l)), S = { from: u, to: x, begin: h.walk, end: h.aim };
    return u = x, S;
  });
}
function rM(e, t, n) {
  var o;
  const a = Ee.bug_shot.back.stride * n;
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
const _e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, x$ = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function S$(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const M$ = (e) => e.along * 97 % 1 < _e.camera, pn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * _e.gravity * t * t });
function _$(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * _e.gravity * (t.bottom - e.from.y))) / _e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * _e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / _e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += _e.step) {
    const f = Math.min(c + _e.step, l.t), h = pn(e, f), p = br(i, h, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = h;
  }
  const u = pn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function C$(e, t, n, a = []) {
  const s = S$(e.along + 1), [o, l] = x$[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: _e.count }, () => {
    const u = i + (s() - 0.5) * 2 * (_e.spread * Math.PI / 180), c = _e.speed[0] + s() * (_e.speed[1] - _e.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: _e.radius[0] + s() * (_e.radius[1] - _e.radius[0]) };
    return { ...f, ..._$(f, t, a) };
  });
}
function A$(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += _e.step) {
      const l = Math.min(o + _e.step, s), i = br(pn(a, o), pn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function E$(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...pn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - _e.hold) / _e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function uM(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Ee.bug_shot;
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
function cM(e, t, n, a, s) {
  const { sway: o, above: l } = Ee.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], h = (E) => {
    const [x, S] = [E.x - e.at.x, E.y - e.at.y];
    return { x: i.x + x * c - S * f, y: i.y + x * f + S * c };
  }, [p, y] = [...n].sort((E, x) => E.x - x.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((E, x) => ({ from: E, to: x < b.length / 2 ? p : y })) };
}
const dM = (e, t) => Te(t, e.grows) * (1 - Te(t, e.sinks));
function ra(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: mn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: mn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function fM(e, t) {
  const n = Ee[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = ra(n, t), l = 1 - (1 - n.small) * Te(a, n.shrinks) * (1 - Te(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = ra(n, t), o = n.flat * Te(a, n.squashes) * (1 - Te(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * mn(s, ...n.springs)) * (1 - mn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const hM = (e) => e === "pack_box";
function mM(e) {
  const { into: t, out: n } = ra(Ee.rope_swing, e);
  return 1 - Te(t, [0, 1]) * (1 - Te(n, [0, 1]));
}
function pM(e) {
  const t = Ee.rope_swing, { into: n, out: a } = ra(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Te(n, [0, 1]) * (1 - Te(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const O$ = { after: 3 }, ho = 10, T$ = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, I$ = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, B$ = { weight: 19 }, kr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, R$ = { every: 120 }, wr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, $r = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, L$ = {
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
}, _n = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: ho }), ie = (e, t, n = {}) => _n(e, "clip", t, n), Va = (e, t, n = {}) => _n(e, "look", t, n), yl = (e, t, n = {}) => _n(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ..._n(e, "pick", t, n), ...a }), we = (e) => _n("nothing", "nothing", e, {}), N$ = 120, q$ = 300, Ka = (e, t) => ({ ...ie(e, t), cooldown: q$ }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), D$ = () => [ie("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: T$[e.name] }), Jt = (e) => ({ ...e, shenanigan: !0, lasts: I$[e.name] }), wa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ie("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...$t(ie("bug_shot", 3)), toward: "", onto: !1 },
    { ...$t(ie("bug_smash", 2)), toward: "", onto: !1 },
    ie("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [ie("startled", 2), ie("dismay", 1), ie("tantrum", 3), we(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [ie("nod", 2), we(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [ie("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [ie("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ie("nod", 4), ie("hand_rub", 4), we(7)]),
  ...fe("question_asked", { cooldown: 60 }, [ie("ask_sign", 9), ie("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [yl("read", 3), ie("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [yl("read", 3), we(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), we(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, D$()),
  ...fe("bar_failed", { holds: !0 }, [ie("fume", 1), ie("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [ie("look_left", 2), ie("look_right", 2), ie("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [ie("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [ie("wipe_brow", 4), ie("look_left", 1), ie("look_right", 1), we(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [ie("shake", 3), ie("tantrum", 2), we(2)]),
  ...fe("refused", { cooldown: 20 }, [ie("shake", 1), we(1)]),
  ...fe("work_done", { cooldown: 120 }, [ie("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [ye("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [ye("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [ye("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [Va("amused", 3), we(2)]),
  ...fe("heard", { cooldown: 30 }, [
    ie("bow", 1, { voices: ["butler"] }),
    ie("salute", 1, { voices: ["squire"] }),
    ie("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [ie("stumble", 3), we(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [ie("glance", 7), we(13)]),
  ...fe("typing", { cooldown: 60 }, [Va("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(L$).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [Va(t, 1)])),
  ...Object.entries(wr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries($r).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [ie(t, 1)])),
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
    { ...Jt($t(ie("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Jt($t(ie("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: N$ }, [Ka("search", 3), { ...Ka("binoculars", 2), when: { home: !0 } }, { ...Ka("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [ie("type", 3), ie("type_ponder", 1)]),
  ...fe("held:compacting", {}, [ie("pack_box", 3), ie("vacuum", 2), ie("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [ye("writing", 12, { state: "writing" }), ye("reading", 12, { state: "reading" }), ye("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...$t(ie("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [ie("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [Jt($t(ie("backflip", 7, { high: !0 }))), ie("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [ye("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: kr.build.cooldown }, [ye("unit", B$.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: R$.every }, ye("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [ye("0", 1), ye("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    ye("rest", 35, {}, { stay: [25, 60] }),
    ye("seat", 15, {}, { stay: [15, 40] }),
    ye("edge", 25, {}, { stay: [8, 20] }),
    Jt(ye("bubble", 15, {}, { stay: [30, 80] })),
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
    Jt($t(ye("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...fe("laptop", {}, [ye("seat", 6, {}, { stay: [60, 150] }), ye("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...fe("ledge_at", {}, [ye("middle", 2, {}, { along: 1 / 2 }), ye("third", 1, {}, { along: 1 / 3 }), ye("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...fe("composed_as", {}, [
    ye("facing", 4, {}, { turn: 0, leans: 0 }),
    ye("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ye("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ye("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ye("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], xr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Sr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), P$ = (e) => Array.isArray(e) ? e[0] : e, j$ = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, F$ = (e) => wa.some((t) => t.when.moment === e);
function W$(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || Sr(f).every(([h, p]) => n(h) >= P$(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = wa.filter((f) => xr(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= O$.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var h;
    return f.type === "nothing" || f.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Ye(e, t) {
  const n = W$(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Mr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Mr(e, t, n) {
  var a;
  for (const [s, o] of Sr(t)) (a = e.memory) == null || a.set(s, e.now + j$(o, n));
}
function gM(e, t, n) {
  Mr(e, wa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const vM = (e) => Object.values(kr).find((t) => xr(t.when, e)) ?? null, H$ = (e, t, n) => n - t <= (e.lifetime ?? ho), yM = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || yr(e.clip, t));
class _r {
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
}, bM = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Cr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), kM = {
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
}, wM = 120, z$ = 20, $M = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < z$), U$ = (e) => Ts[e] || Ts.idle, xM = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Ar = "airborne", G$ = "landing", V$ = "travelling", Er = "grounded", SM = ({ airborne: e, landing: t, trip: n }) => e ? Ar : t ? G$ : n != null && n.started ? V$ : Er;
function MM(e, t) {
  var s;
  const n = K$(e, t);
  return e.mode === Er && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function K$(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === Ar && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Y$(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : U$(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function Y$(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Is = (e) => e.outcome, Q$ = /^plugin:[^:]+:sins:/, bl = (e) => e.type === "plugins.card" && Q$.test(e.markKey), X$ = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => bl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => bl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], _M = (e, t) => e.filter((n) => n.author === "user" && oa(n.read_at) > t).map((n) => ({ beat: "read_message", time: oa(n.read_at), card: Ni(n) })).sort((n, a) => n.time - a.time), kl = { user: "reacted", agent: "agent_reacted" };
function CM(e, t) {
  return e.filter((n) => kl[n.author] && At(n) > t).map((n) => ({ beat: `${kl[n.author]}:${n.emoji}`, time: At(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const J$ = [.../* @__PURE__ */ new Set([...Object.values(wr).flatMap((e) => Object.keys(e)), ...Object.keys($r)])];
function AM(e, t) {
  return e.filter((n) => n.author === "agent" && At(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = J$.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: At(n), card: Ni(n) })).sort((n, a) => n.time - a.time);
}
const Z$ = (e) => new _r(e).isTest(), ua = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Is(e)] || "";
}, e5 = 1800, t5 = (e, t) => {
  if (ua(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ua(n) !== "finished" && Number(e.time) - Number(n.time) <= e5 ? "tests_fixed" : "tests_passed";
};
function EM(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Z$), s = a.filter((i) => ua(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, ua(i))), o.map((i) => ({ beat: t5(i, s), time: Number(i.time), card: i.key }));
}
function OM(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Is(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Is(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const TM = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: At(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function IM(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function BM(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function RM(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = X$.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function mo(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const wl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function n5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    mo(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function LM(e, t, n, a = {}) {
  const s = Ye({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : F$(`held:${e}`) ? "idle" : e;
}
const qe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function NM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < qe.ahead * n ? 180 : Math.sign(a) * qe.turn;
}
const $l = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function qM(e, t) {
  const n = Math.min(qe.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(qe.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(qe.lines, Math.floor((e.bottom - e.top - 2 * a) / qe.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / qe.sweep) % s, i = o % qe.sweep, u = qe.sweep - qe.returnSeconds, c = $l((i - u) / qe.returnSeconds), f = i <= u ? $l(i / u) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + h * qe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const xl = 3, Or = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Sl = 12, DM = (e, t) => ({ mood: e, began: t, seen: 0 });
function PM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Or(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= xl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Sl) / Sl, lasts: xl } };
}
const jM = (e) => e.posture === "hang" && !Or(e.face), a5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), s5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function FM(e, t, n) {
  return a5.has(e) ? 1 / 0 : !s5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Tr(n - t.began, t.share) - it.lead, 0);
}
const o5 = 5;
function WM(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= o5 ? { beat: "long_walk", time: n } : null };
}
const l5 = 30, Hn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function HM(e, t, n, a, s = null) {
  if (t && n < t.until || !Hn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ye({ moment: "spell", state: e, tally: s }, a), [l, i] = Hn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Hn.every } : { state: e, began: 0, until: 0, next: n + Hn.every };
}
const zM = (e, t, n) => t && n < t.until && Cr.has(e.state) ? { state: t.state, since: t.began } : e, it = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Tr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function UM(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Tr(o, e.share);
  return s ? { eager: i5(t, l), moment: null } : l > it.lead ? { eager: t, moment: null } : l < it.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > it.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < it.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ye({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function i5(e, t) {
  return e.on && t > it.lead + it.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= it.lead && t >= it.least ? { ...e, on: !0, calm: !1 } : e;
}
const r5 = 1, u5 = { look: "look", gaze: "gaze" };
function c5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ye({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [u5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const d5 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Ye({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), f5 = (e, t, n, a, s, o = 0) => Ye({ moment: "jump", high: e > r5 * t, memory: a, now: s, room: o }, n).name === "backflip", h5 = { work: ["building"], idle: ["standing"] };
function GM(e, t, n, a) {
  const s = Ts[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(h5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Cr.has(e) ? { moments: o, began: n || a } : (n && a - n >= l5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function m5(e, t, n) {
  return !Ye({ moment: "pondering", memory: e, now: t }, n) || !Ye({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ye({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Ml = { pondering: m5 };
function VM(e, t, n, a, s, o) {
  if (Ml[e.beat]) {
    const i = Ml[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = c5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== ho && { lifetime: l.lifetime } } } : null;
}
function KM(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = d5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const YM = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function QM(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function XM(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const JM = (e, t) => !!(e != null && e.watches) && !t.once, ZM = 10, e_ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || H$(a, a.queuedAt, n)), t_ = (e, t) => t ? null : e[0] ?? null;
function n_(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const a_ = (e, t) => !t.during || !e.some((n) => n.during === t.during), p5 = 2 * Math.PI, g5 = 500;
function s_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / g5, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, h = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = p5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, E = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? y5(y, t, n, p, s) : k5(y, t, n, p) : t) ?? y, x = E != null && E.behind && E.mood === "reading" ? v5(e.point, E, n, l, s) : E;
  return { point: x ?? null, toward: x ? { x: x.x - n.x, y: x.y - n.y } : null, amount: h, at: a };
}
function v5(e, t, n, a, s) {
  const o = (T) => T * 180 / Math.PI, l = (T) => o(Math.atan2(Math.sin(T * Math.PI / 180), Math.cos(T * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : f, b = y + l(c - y), E = Math.min(Math.max(a / 1e3, 0), 0.1), x = qe.turnSpeed * E, S = h ? y + Math.min(Math.max(b - y, -x), x) : b, O = h ? e.readingFollow + p : S, z = O + (S - O) * (1 - Math.exp(-E / qe.followSeconds)), H = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(mo(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), D = Math.min(Math.max(I, -H.up), H.down), L = qe.tipSpeed * E, q = h ? e.readingPitch + Math.min(Math.max(D - e.readingPitch, -L), L) : D;
  return { ...t, readingYaw: S, readingFollow: z, readingPitch: q, readingFacing: i };
}
function y5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (O) => {
    const { yaw: z, pitch: H } = mo(O.x - n.x, s, n.y - O.y, o);
    return { yaw: z, pitch: Math.min(Math.max(H, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [wl(i(e)), wl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const h = a / f, [p, y] = [Math.sin((1 - h) * f) / Math.sin(f), Math.sin(h * f) / Math.sin(f)], [b, E, x] = u.map((O, z) => p * O + y * c[z]), S = s * b / E;
  return { ...t, x: n.x + S, y: n.y - n5(S, s, -Math.asin(Math.min(Math.max(x, -1), 1)), o) };
}
const b5 = 0.15;
function o_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= b5;
}
function k5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const w5 = (e) => !(e != null && e.on);
function l_(e, t, n) {
  if (w5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const gn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, st = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ya = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), _l = (e) => e * e * (3 - 2 * e);
function $5(e) {
  if (e < 0 || e >= st.seconds) return null;
  const t = Ya(e, ...st.flicker), n = Math.floor(t * st.flickers * 2) % 2 === 0, a = e < st.flicker[1] ? n ? 0.35 + 0.5 * t : st.dim : 1;
  return { strength: 1 - _l(Ya(e, ...st.fade)), lit: a, white: e < st.flash[0] ? 0 : 1 - _l(Ya(e, ...st.flash)) };
}
const i_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function r_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = $5(t - e.at);
  return a && { colour: gn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: st.signs[e.tone], ...a } };
}
function u_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function c_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= gn.looks || a === null && n - e.since >= gn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function d_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const mt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, f_ = { behind: 39, figure: 40, ahead: 41 }, x5 = "[data-figure-pile]", S5 = { amber: [1, 0.69, 0.125], good: gn.colours.good, bad: gn.colours.bad }, Xn = { phases: 4, ms: 230, dim: 0.25 }, h_ = (e, t, n) => e !== "amber" || (t + n) % Xn.phases < Xn.phases / 2 ? 1 : Xn.dim, m_ = (e) => e === "amber" ? Xn.phases : 1;
function p_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const g_ = Object.keys(S5), Xe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, en = ([e, t], n) => e + n() * (t - e);
function v_(e) {
  const t = Xe.least + Math.floor(e() * (Xe.most - Xe.least + 1));
  return Array.from({ length: Math.min(t, Xe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Xe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = en(Xe.start, e), l = en(Xe.reach, e);
    return {
      text: Ye({ moment: "digit" }, e).name,
      x: a * o,
      y: Xe.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(en(Xe.moveMs, e)),
      fadeMs: Math.round(en(Xe.fadeMs, e))
    };
  });
}
const Qa = { high: 3, gap: 1 };
function y_(e) {
  const t = Math.floor(e / Qa.high);
  return { left: -(mt.inside + mt.width / 2 + t * (mt.width + Qa.gap)), up: e % Qa.high * (mt.height - mt.top) };
}
const M5 = (e, t, n) => Ye({ moment: "unit", memory: e, now: t }, n) !== null, _5 = { after: 5 }, C5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new _r(t).isBuild());
function b_(e, t, n) {
  const a = C5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= _5.after ? s : null;
}
function k_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: M5(n, a, s) } : null;
}
const Cl = { ahead: 140, up: 70 };
function w_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Cl.ahead, y: a - Cl.up } } : o ? { at: { x: n(o), y: a - o.up - mt.height } } : t ? { at: null } : null;
}
const Xa = { least: 4e3, most: 1e4 }, A5 = (e) => Xa.least + e() * (Xa.most - Xa.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function $_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = A5(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const x_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), S_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Ir = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), M_ = new Set(wa.filter((e) => Ir.has(e.when.moment) && e.type === "clip").map((e) => e.name)), E5 = (e) => e.some((t) => t.state === "built"), __ = (e, t) => E5(t) ? e.filter((n) => !Ir.has(n.beat)) : e, vt = { reach: 40, room: 6 }, O5 = (e, t) => t <= e - vt.reach + 2, C_ = (e, t, n) => O5(e, n) ? t - vt.reach : e - vt.reach - vt.room, A_ = (e, t, n, a) => a > 0 && t < e && t + vt.reach >= e - 2 ? Math.min(n, Math.max(e, t + vt.reach)) : e, Ja = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, E_ = (e) => en(e() < Ja.longShare ? Ja.long : Ja.short, e), T5 = 2 * mt.width;
function O_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= T5 ? o : e + (o - e + s / 2) % s;
}
const I5 = 60, T_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= I5, Al = "[data-figure-home]", Cn = () => {
  var t;
  const e = document.querySelector(Al);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Al)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, B5 = "[data-figure-docked-bars]", R5 = "[data-figure-chat-foot]", L5 = [0.85, 0.6, 0.35, 0.15], N5 = ["question", "waiting", "suggestion"], I_ = (e, t) => N5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function B_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const q5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", D5 = "[data-figure-newest]";
function Br() {
  var a, s;
  const e = (a = Cn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(D5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !po(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function vn(e, t, n = Br()) {
  if (!e || !n) return !0;
  const a = ct(e, t), s = xa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Be.top * t.size, bottom: a.top + Be.bottom * t.size }, l = Mt.gap;
  return !$a(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function R_(e, t, n, a = Br()) {
  if (!a || vn(t, e, a)) return null;
  const s = xa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Tt(), u = t.posture === "stand" ? vo * e.size : Fr * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - Mt.gap - l, a.right + Mt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && vn(p, e, a) && h4(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Za = 0.26, Rr = 0.54, P5 = 1.25 / 5.4, An = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Za, travels: "stand" },
  lounge: { drop: Za, travels: "stand" },
  composed: { drop: Za, travels: "stand" },
  hang: { drop: Rr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, L_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * P5 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Rr
}), an = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), j5 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), N_ = (e, t) => (e === "sit" ? j5.has(t) : an.has(e)) ? e : "stand";
function q_(e, t) {
  return e.facing === t.facing || !an.has(e.posture) && !an.has(t.posture) ? t : { posture: "stand", facing: an.has(e.posture) ? e.facing : t.facing };
}
const D_ = 0.25, P_ = (e, t) => an.has(e) && An[t].drop === 0, Lr = 2, F5 = 90, W5 = 180, H5 = 140, z5 = 280, U5 = 420, G5 = 0.25, V5 = 290, K5 = 600, Y5 = "cubic-bezier(0.2, 0.7, 0.4, 1)", Q5 = "cubic-bezier(0.55, 0, 0.9, 0.6)", es = 5;
function ca(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < es) return null;
  (l || i) && (o = Math.max(o, Lr));
  const y = o > 1, b = Math.abs(t.x - e.x), E = b < es ? 0 : b / (F5 * o) * 1e3, x = Math.min(E, y ? H5 : W5), S = Math.abs(t.y - e.y), O = t.y < e.y, z = O && !p && f5(S, n, u, c, f, h), H = O ? U5 + Math.min(S, 400) * G5 : Math.sqrt(2 * S / fo) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: S > es ? z ? K5 : H : 0,
    lead: z ? V5 : O ? z5 : 0,
    easing: O ? Y5 : Q5,
    hopping: !0,
    clip: z ? "backflip" : O ? "jump" : "fall"
  }, D = { x: t.x, y: t.y, ms: E + x, lead: 0, easing: "linear", ramp: x, ...y ? { clip: "run" } : {} }, L = p ? X5(t, n) : I, q = O && !a ? [{ ...D, y: e.y }, L] : [{ ...I, x: e.x }, D];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const X5 = (e, t) => ({ x: e.x, y: e.y, ms: Ee.pogo.frames / Ee.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), J5 = (e, t) => e.postures.includes(t) ? t : e.postures[0], j_ = (e, t, n) => e.posture === "walk" && n ? "walk" : J5(e.clip, t), ct = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - An[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, $a = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, po = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Tt() {
  var t;
  const e = (t = Cn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const zn = 0.5, El = 20;
function F_(e, t, n = Tt()) {
  const a = ct(e, t);
  return a.left >= n.left + El && a.right <= n.right - El;
}
function go(e, t, n = Tt()) {
  const a = ct(e, t), s = a.right - a.left, o = xa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - zn && i <= n.right + zn && a.top >= n.top - zn && u <= n.bottom + zn;
}
const da = [0.35, 0.5, 0.65], fa = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Be = { left: da[0], right: da.at(-1), top: fa[0], bottom: fa.at(-1) }, Z5 = 0.24;
function xa(e) {
  if (e.posture === "stand") return { left: Be.left, right: Be.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Z5 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Be.left, t), right: Math.max(Be.right, t) };
}
function e4(e, { size: t }, n = Tt()) {
  const a = xa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const vo = (Be.right - Be.left) / 2 + 0.08;
function W_(e, t) {
  return e === "hang" ? Be : { ...Be, bottom: Math.min(Be.bottom, 1 - t - An[e].drop) };
}
const t4 = "[data-figure-agent]";
function Nr(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !po(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const qr = (e) => fa.flatMap(
  (t) => da.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function yo(e, t, n = "") {
  if (!vn(e, t)) return da.length * fa.length;
  const a = ct(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(q5)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && $a(s, u) && po(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return qr(s).filter(([i, u]) => l(i, u) || Nr(i, u, n)).length;
}
function n4(e, t) {
  const n = ct(e, t);
  return qr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Nr(a, s, "", t4)).length;
}
const Ol = 4;
function H_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Ol; o <= s; o += Ol)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!n4(i, e) && vn(i, e)) return i;
    }
  return null;
}
function yn(e, t, n) {
  const a = Tt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => go(l, t, a) && vn(l, t)).map((l) => ({ spot: l, covered: yo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Dr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), a4 = [0.5, 0.25, 0.75], s4 = (e) => Dr(e.getBoundingClientRect(), a4), Pr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, o4 = vo, l4 = (e, t, { size: n }, a = o4) => jr(e, Pr[t], a * n, "stand");
function jr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const i4 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Fr = 0.1, r4 = (e, t, { size: n }) => jr(e, i4[t], Fr * n, "sit"), u4 = (e) => ((e + 180) % 360 + 360) % 360 - 180, ts = 60;
function z_(e, t) {
  const n = u4(t);
  return !e.aside || Math.abs(n) >= ts ? t : n < 0 ? 360 - ts : ts;
}
const sn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, c4 = (e) => [.../* @__PURE__ */ new Set([e, ...sn.turns.map((t) => (t + 360) % 360)])];
function U_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = c4(t), l = sn.every[0] + a() * (sn.every[1] - sn.every[0]);
  return { face: t, from: s ? d4(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function d4(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / sn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function G_(e, t) {
  const { element: n, edge: a } = Sa(), s = ["left", "right"].map((i) => En(r4(a, i, e), e)).filter((i) => n && go(i, e) && !yo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function V_(e, t, { size: n }) {
  const a = (Be.right - Be.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Wr } : e;
}
const Wr = 7;
function Hr() {
  const e = [...document.querySelectorAll(x5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function f4(e, t) {
  const n = ct(e, t), a = n.right - n.left;
  return { left: n.left + Be.left * a, right: n.left + Be.right * a, top: n.top + Be.top * a, bottom: n.bottom };
}
function h4(e, t) {
  const n = Hr();
  return !n || !$a(f4(e, t), n);
}
const m4 = 4;
function Sa() {
  const e = On(), t = Hr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > m4 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Wr - n, 0) } };
}
const K_ = ({ size: e, below: t }) => (1 - t) * e;
function En(e, t) {
  const n = Tt(), { size: a, below: s } = t, o = An[e.posture].drop * a;
  return { ...e4(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Bs = (e, t) => Object.keys(Pr).map((n) => En(l4(e, n, t), t)), bo = (e, t) => Dr(e, L5).map((n) => En(n, t)), zr = (e, t, n) => yn(e, t, n) ?? e[0];
function Y_(e, t) {
  const { element: n, edge: a } = Sa();
  return { ...zr(Bs(a, e), e, t), view: null, on: n };
}
function Q_(e, t, n, a) {
  const { element: s, edge: o } = Sa(), l = (a ? Bs(o, t) : [...Bs(o, t), ...bo(o, t)]).filter(
    (c) => !$a(ct(c, t), e)
  ), i = yn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !yo(i, t) ? i : yn(l, t, n);
  return u && { ...u, view: null, on: s };
}
function On() {
  var a;
  const e = Cn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(B5);
  if (!t) return { ...Ma(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Tl = { within: 2 };
function X_(e) {
  const { element: t, docked: n, edge: a } = On();
  if (!n || e.on !== t) return !0;
  const s = Ma().edge;
  return a.left > s.left + Tl.within || a.left + a.width < s.left + s.width - Tl.within;
}
const p4 = "[data-figure-closing]";
function J_() {
  var n;
  const { element: e, docked: t } = On();
  return t && !!((n = e.firstElementChild) != null && n.matches(p4));
}
const Ur = "[data-figure-progress]";
function Z_(e) {
  const t = e.querySelector(Ur);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function eC(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const g4 = { across: 300, above: 380, below: 60 };
function tC(e) {
  const { across: t, above: n, below: a } = g4;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: v4(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const v4 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Gr = "[data-figure-bar]", Rs = { back: 144, along: 0.4 };
function nC(e) {
  const { element: t, docked: n, edge: a } = On(), s = n ? t.querySelector(Gr) : null;
  if (!(s != null && s.querySelector(Ur))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...En({ x: o - Rs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function aC(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Rs.along * a.size ? t.x + Rs.along * a.size : e.x, y: e.y, behind: !0 };
}
function sC(e) {
  const t = e.querySelector(Gr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Ma() {
  const e = Cn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function oC(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Ma(), u = n === null ? y4(i, e, o === null ? t : { x: o, y: i.top }, a, s) : En({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function y4(e, t, n, a, s) {
  const o = bo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + mt.width < s && u.x + a - vt.reach - vt.room >= l);
  return yn(i.length ? i : o, t, n);
}
const b4 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function lC(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Lr));
  const y = (z) => {
    const H = ct(z, n, An[z.posture].travels);
    return { x: H.left, y: H.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return k4(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [E, ...x] = [e, ...u, t].map(y), S = ca(E, x[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: h, pogo: p }), O = x.slice(1).map((z, H) => {
    var I;
    return (I = ca(x[H], z, n.size, { random: i, memory: c, now: f, room: h })) == null ? void 0 : I.legs.find((D) => D.hopping);
  });
  return S && { ...S, legs: [...S.legs, ...O.filter(Boolean)] };
}
function k4(e, t, n, a, s, o, l) {
  const i = (f, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - f.x, h.y - f.y) / b4.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? ca(e, n, o.size, { pace: l }) : ca(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function iC(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function rC(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && yn(s4(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Sa();
  return { ...zr(bo(s, t), t, n), view: null, on: a };
}
const w4 = "[data-figure-bubble]", $4 = 250;
let on = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Vr = 0;
const Qt = () => on, ns = /* @__PURE__ */ new WeakMap();
let x4 = 0;
function ko(e) {
  return ns.has(e) || ns.set(e, `floor-${++x4}`), ns.get(e);
}
const S4 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, M4 = () => {
  var e, t;
  return ((t = (e = Cn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function _4(e, t) {
  var a;
  const n = (a = e.querySelector(R5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function C4(e, t) {
  const n = e && _4(e, t), a = e ? [...e.querySelectorAll(w4)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || S4(l, n))).map(({ element: o, type: l, box: i }) => ({ id: ko(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const A4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= $4 ? (t.top - a.top) / s * 1e3 : 0;
};
function Kr(e = on, t = performance.now()) {
  const n = Tt(), a = M4(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = On(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Ma();
  return c.element && u.push({ id: ko(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...C4(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: A4(e, f, t) }))) });
}
const Ls = /* @__PURE__ */ new Set();
function E4(e) {
  return Ls.add(e), () => Ls.delete(e);
}
function O4() {
  Yr();
  const e = () => {
    Vr = requestAnimationFrame(e), !document.hidden && (on = Kr(on), Ls.forEach((t) => t(on)));
  };
  e();
}
function Yr() {
  cancelAnimationFrame(Vr);
}
const wo = 5, T4 = 56, I4 = { share: 0.6 }, B4 = (e) => -Math.sqrt(2 * fo * I4.share * e), zt = (e, t) => e.find((n) => n.id === t) ?? null;
function uC(e, t = Kr().floors) {
  const n = zt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : ko(e.on) : null, o = s && zt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Qr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = Qt().floors) {
  const c = zt(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || R4(c, f, o)) && L4(f, i, u) ? { x: f.x, y: f.y } : null;
}
const $o = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, R4 = (e, t, n) => !$o({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function cC(e, t = Qt().floors) {
  if (!$o(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= wo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function L4(e, t, n = Qt().floors) {
  const a = zt(n, "home");
  return e.posture === "hang" && a && ct(e, t).bottom >= a.top ? !1 : go(e, t);
}
function dC(e, t, n, a = Qt().floors) {
  const s = Qr(e, n, a);
  if (!e.home) return N4(e, t, s, a);
  if (!s) return null;
  const o = zt(a, "home"), l = s.y - t.y, i = l > wo ? "dropping" : -l > T4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function N4(e, t, n, a) {
  const s = n ? zt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: B4(e.risen) };
  if (!n) return null;
  if ($o(t) && n.y - t.y > wo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function fC(e, t, n) {
  const a = vo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function hC(e, t, n, a = Qt().floors) {
  const s = t && Qr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const q4 = ["data-type"], D4 = { class: "figure-floor-name" }, P4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", D4, v(e.floor.type), 1)
    ], 12, q4));
  }
}, j4 = /* @__PURE__ */ U(P4, [["__scopeId", "data-v-4e0f1e2e"]]), F4 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, W4 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ze(Qt().floors);
    let n = () => {
    };
    return Me(() => {
      n = E4((a) => t.value = a.floors), O4();
    }), Re(() => {
      n(), Yr();
    }), (a, s) => (r(), d("div", F4, [
      (r(!0), d(j, null, ne(t.value, (o) => (r(), W(j4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, mC = /* @__PURE__ */ U(W4, [["__scopeId", "data-v-e519168b"]]), ln = (e) => typeof e == "number" ? e : Date.parse(e);
function pC(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: ln(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => ln(s.row.created_at) - ln(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Il = 20;
async function gC(e, t, n) {
  for (let a = 0; a < Il; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || ln(o.created_at) <= ln(s.created_at) || !await n()) return a;
  }
  return Il;
}
const H4 = 3, as = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function z4(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = as[n.grouping]) == null ? void 0 : a.call(as, e.row, n)) || "";
}
function U4(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function vC(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= H4 ? [U4(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = z4(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function G4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const yC = (e) => (t) => t.filter((n) => n.id !== e), bC = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), kC = (e) => (t) => [...t, e], wC = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function $C(e, t = {}) {
  const n = at(), a = _(null), s = _("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function xC(e) {
  const t = at(), n = _("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Un = /* @__PURE__ */ new Map();
function V4(e, t) {
  if (Un.has(e)) return Un.get(e);
  const n = t().finally(() => Un.delete(e));
  return Un.set(e, n), n;
}
function SC() {
  const e = at(), t = _(null), n = _("");
  async function a() {
    const s = await V4(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const K4 = { class: "cards-page" }, Y4 = { class: "cards-bar" }, Q4 = { class: "cards-count" }, X4 = { class: "cards" }, J4 = {
  key: 1,
  class: "cards-note"
}, Z4 = {
  key: 2,
  class: "cards-note"
}, ex = ["data-row", "onClick"], tx = { class: "card-head" }, nx = { class: "card-title" }, ax = { class: "card-foot" }, sx = {
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
    return (a, s) => (r(), d("div", K4, [
      m("div", Y4, [
        m("span", Q4, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(ge, De({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: P(() => [
            A(le, {
              name: "plus",
              size: 12
            }),
            Y(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", X4, [
        e.loaded ? e.failure ? (r(), d("p", J4, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", Z4, "No " + v(e.term) + "s yet", 1)) : (r(), W(Qe, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(j, null, ne(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", tx, [
            A(le, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            Y(" " + v(e.head(o)), 1),
            A(tt, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", nx, v(e.title(o)), 1),
          m("span", ax, v(e.foot(o)), 1)
        ], 8, ex))), 128))
      ]),
      re(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, MC = /* @__PURE__ */ U(sx, [["__scopeId", "data-v-b39fea5d"]]), Bl = "newest";
function _C(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Se(Le, null)) == null ? void 0 : c.search, s = _(""), o = _(Bl), l = _("all"), i = M(() => {
    const f = s.value.trim().toLowerCase(), h = e.value.filter((p) => G4(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Bl ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), u = M(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const ox = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, lx = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, ix = 40, rx = "top", ux = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Se(Le, null)) == null ? void 0 : p.autoScroll, s = M(() => a === rx), o = _(null), l = _(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= ix, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    pe(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await Fe(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return Me(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), nt(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (r(), d("div", ox, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Q(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        re(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", lx, [
        A(Gt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: P(() => [
            et(m("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              A(le, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = Y(" Newest ", -1))
            ], 512), [
              [zl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, CC = /* @__PURE__ */ U(ux, [["__scopeId", "data-v-d704d7e3"]]), cx = ["aria-selected", "data-tab", "onClick"], dx = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, fx = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Se(Le, null), o = M(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = _(null), i = _({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => Fe(() => c(!0));
    let h = null;
    return Me(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Re(() => h == null ? void 0 : h.disconnect()), pe(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), pe(() => n.answer, f, { deep: !0 }), (p, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(j, null, ne(o.value, (b) => {
        var E, x;
        return r(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Q(["inner-tab", { on: ((E = e.active) == null ? void 0 : E.key) === b.key }]),
          "aria-selected": ((x = e.active) == null ? void 0 : x.key) === b.key,
          "data-tab": b.key,
          onClick: (S) => a("choose", b)
        }, [
          Y(v(b.label) + " ", 1),
          u(b) ? (r(), d("span", dx, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, cx);
      }), 128)),
      m("i", {
        class: Q(["inner-tabs-line", { slides: i.value.slides }]),
        style: ve({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, AC = /* @__PURE__ */ U(fx, [["__scopeId", "data-v-63fcd326"]]), hx = { class: "task-bar" }, mx = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", hx, [
      m("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: ve({ width: `${n(e.done)}%` })
      }, null, 4),
      m("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: ve({ width: `${n(e.testing)}%` })
      }, null, 4)
    ]));
  }
}, EC = /* @__PURE__ */ U(mx, [["__scopeId", "data-v-a4fc52ae"]]), px = {
  class: "tab-body",
  "data-tab-body": ""
}, gx = { "data-tab-content": "" }, vx = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = _(!1);
    let a = 0;
    return pe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, js(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", px, [
      n.value ? (r(), W(Qe, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      et(m("div", gx, [
        re(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [zl, !n.value]
      ])
    ]));
  }
}, OC = /* @__PURE__ */ U(vx, [["__scopeId", "data-v-63876533"]]), yx = {
  class: "search-bar",
  "data-search-bar": ""
}, bx = { class: "search-bar-control" }, kx = ["value", "placeholder", "aria-label"], wx = ["aria-expanded"], $x = {
  key: 0,
  "data-menu-count": ""
}, xx = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var S;
    const a = e, s = n, o = uu(), l = ((S = Se(Le, null)) == null ? void 0 : S.search) ?? {}, i = M(() => l.placeholder || a.placeholder), u = l.context ?? [], c = _(null), f = _(null), h = _([]), p = M(() => h.value.length ? h.value[h.value.length - 1].next : u), y = M(() => !!o.menu || u.length > 0), b = (O) => {
      h.value = [], f.value = f.value ? null : O.currentTarget;
    };
    function E(O) {
      if (O.next.length) {
        h.value = [...h.value, O];
        return;
      }
      f.value = null, s("pick", O.click);
    }
    function x() {
      var O;
      s("update:modelValue", ""), (O = c.value) == null || O.focus();
    }
    return t({ focus: () => {
      var O;
      return (O = c.value) == null ? void 0 : O.focus();
    } }), (O, z) => {
      var H;
      return r(), d("div", yx, [
        m("div", bx, [
          A(le, {
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
            onInput: z[0] || (z[0] = (I) => s("update:modelValue", I.target.value)),
            onKeydown: Ct(x, ["esc"])
          }, null, 40, kx),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: x
          }, [
            A(le, {
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
            e.menuCount ? (r(), d("span", $x, v(e.menuCount), 1)) : k("", !0),
            A(le, {
              name: "caret",
              size: 12
            })
          ], 8, wx)) : k("", !0)
        ]),
        (H = B(l).button) != null && H.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: z[1] || (z[1] = (I) => s("pick", B(l).button.click))
        }, v(B(l).button.title), 1)) : k("", !0),
        re(O.$slots, "default", {}, void 0, !0),
        f.value ? (r(), W(ga, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: z[3] || (z[3] = $e(() => {
          }, ["stop"])),
          onClose: z[4] || (z[4] = (I) => f.value = null)
        }, {
          default: P(() => [
            h.value.length ? (r(), W(Ue, {
              key: 0,
              "data-search-back": "",
              onClick: z[2] || (z[2] = (I) => h.value = h.value.slice(0, -1))
            }, {
              default: P(() => [
                Y("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(j, null, ne(p.value, (I) => (r(), W(Ue, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (D) => E(I)
            }, {
              default: P(() => [
                Y(v(I.title) + v(I.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? k("", !0) : re(O.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, Sx = /* @__PURE__ */ U(xx, [["__scopeId", "data-v-45374bed"]]), Mx = {
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
    return (o, l) => (r(), W(Sx, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        A(_t, null, {
          default: P(() => [...l[2] || (l[2] = [
            Y("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(j, null, ne(a, (i) => A(Ue, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: P(() => [
            Y(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(j, { key: 0 }, [
          A(_t, null, {
            default: P(() => [...l[3] || (l[3] = [
              Y("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(j, null, ne(s, (i) => A(Ue, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: P(() => [
              Y(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: P(() => [
        re(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, TC = /* @__PURE__ */ U(Mx, [["__scopeId", "data-v-dab0064d"]]);
function IC() {
  const e = _(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const BC = (e) => import(
  /* @vite-ignore */
  e
), _x = 86400, Ns = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Cx(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ns(t) - Ns(e)) / _x);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function RC(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ns(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Cx(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ss = 280, os = 240, ls = 120, Ax = 6, Ex = 14, bn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Ox(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Xr(e, t) {
  const n = Math.max(0, Ox(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Tx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Ex}px)` }), e.offsetHeight, e.style.transition = `height ${ss}ms ${bn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Xr(t, e));
    const p = s() - i;
    if (!u && p >= ss && (u = !0, e.style.transition = `opacity ${os}ms ease-out, transform ${os}ms ${bn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < ss + os) return a(h);
    f();
  };
  return a(h), f;
}
function LC(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Ax}px)` }), e.offsetHeight, e.style.transition = `opacity ${ls}ms ease-out, transform ${ls}ms ${bn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Xr(t, e)), s() - l < ls) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const Ix = 140, Gn = 220, Rl = 5;
function NC({ gap: e = Ix, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, h) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), h();
    });
  }
  function u() {
    const f = n.splice(0, Rl);
    if (s = f.length > 0, !s) return;
    let h = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(u, e));
      });
  }
  const c = (f, h, p, y = Tx) => {
    if (l || !h.pane || !h.follows()) return p();
    const b = { el: f, options: h, done: p, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= Rl && c.flush();
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
function qC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Gn}ms ${bn}, opacity ${Gn}ms ease-in, margin ${Gn}ms ${bn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Gn);
}
const Jr = "chat.pins.minimised", Jn = _(ta(Jr, !1));
function Ll(e) {
  Jn.value = e, Zs(Jr, e);
}
function Bx(e) {
  const t = M(() => e()), n = M(() => Jn.value ? [] : e()), a = () => Ll(!Jn.value), s = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => At(o) > s).length,
    (o, l) => o > l && Ll(!1)
  ), { pins: t, visible: n, minimised: Jn, toggle: a };
}
const Rx = ["title"], Lx = {
  key: 0,
  class: "pins-count"
}, Nx = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Bx(() => t.pinRows);
    return (o, l) => B(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Q(["pins-toggle", { minimised: B(a), inline: e.inline }]),
      title: B(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...i) => B(s) && B(s)(...i), ["stop"]))
    }, [
      A(le, {
        name: B(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      B(a) ? (r(), d("span", Lx, v(B(n).length), 1)) : k("", !0)
    ], 10, Rx)) : k("", !0);
  }
}, DC = /* @__PURE__ */ U(Nx, [["__scopeId", "data-v-d073c504"]]), qx = ["title"], Dx = ["title"], Px = { class: "diff-card-dir" }, jx = { class: "diff-card-name" }, Fx = ["title"], Wx = ["title"], Hx = {
  key: 0,
  class: "diff-card-note"
}, zx = ["href"], Ux = ["src", "alt"], Gx = { class: "diff-card-rows" }, Vx = { class: "diff-row-num" }, Kx = { class: "diff-row-sign" }, Yx = { class: "diff-row-code" }, Qx = {
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
    function o(N) {
      (N.metaKey || N.ctrlKey) && (N.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, u = M(() => n.path.lastIndexOf("/") + 1), c = M(() => n.path.slice(0, u.value)), f = M(() => n.path.slice(u.value)), h = M(() => n.change === "deleted"), p = M(() => l[n.change]), y = M(() => new Set(n.rows.filter((N) => N.line_type === "add").map((N) => N.line))), b = _("after"), E = M(() => b.value === "before" ? n.whole.old : n.whole.text), x = M(() => n.whole && n.whole.text !== void 0 ? E.value.split(`
`).map((N, w) => ({ line_type: b.value === "after" && y.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: N })) : n.rows.filter(
      (N) => !(n.editsOnly && ["ctx", "fold"].includes(N.line_type)) && !(n.hideRemovals && N.line_type === "del")
    )), S = _(!1), O = M(() => n.lines && !S.value && !n.whole), z = M(() => O.value ? x.value.slice(0, n.lines) : x.value), H = M(() => x.value.length - z.value.length), I = (N) => N.line === null || N.line_type === "del" ? "" : N.line, D = (N) => N.line_type === "fold" ? N.hidden ? `⋯ ${N.hidden} lines` : "⋯" : N.text, L = _(null), q = _(null);
    let T = null;
    return Me(() => {
      if (!q.value) return;
      let N = !0;
      T = new ResizeObserver(() => {
        !L.value || !q.value || (L.value.style.transition = N ? "none" : "", L.value.style.height = `${q.value.offsetHeight}px`, N = !1);
      }), T.observe(q.value);
    }), Re(() => T && T.disconnect()), (N, w) => (r(), d("section", {
      class: Q(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (g) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${B(s)}-click to open it`,
          onClick: o
        }, [
          m("span", Px, v(c.value), 1),
          m("span", jx, v(f.value), 1),
          p.value ? (r(), d("span", {
            key: 0,
            class: Q(["diff-card-badge", e.change])
          }, v(p.value), 3)) : k("", !0)
        ], 8, Dx),
        m("span", {
          class: Q(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: Q(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        A(tt, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = $e((g) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, v(b.value === "after" ? "After" : "Before"), 9, Fx)) : k("", !0),
        h.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Q(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = $e((g) => a("whole"), ["stop"]))
        }, [
          A(le, {
            name: "file",
            size: 12
          })
        ], 10, Wx))
      ], 8, qx),
      e.whole && e.whole.error ? (r(), d("p", Hx, v(e.whole.error), 1)) : k("", !0),
      !h.value && !e.folded ? (r(), d(j, { key: 1 }, [
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
          }, null, 8, Ux)
        ], 8, zx)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: L,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            m("div", Gx, [
              (r(!0), d(j, null, ne(z.value, (g, $) => (r(), d("div", {
                key: $,
                class: Q(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                m("span", Vx, v(I(g)), 1),
                m("span", Kx, v(i[g.line_type]), 1),
                m("span", Yx, v(D(g)), 1)
              ], 2))), 128)),
              H.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = $e((g) => S.value = !0, ["stop"]))
              }, v(H.value) + " more " + v(H.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, PC = /* @__PURE__ */ U(Qx, [["__scopeId", "data-v-23581cbb"]]), Xx = { "data-queue-controls": "" }, Jx = { class: "counts" }, Zx = { "data-queue-spots": "" }, e8 = {
  class: "spots",
  "aria-label": "Places in use"
}, t8 = { "data-queue-waiting": "" }, n8 = { key: 0 }, a8 = { class: "control" }, s8 = { class: "stepper" }, o8 = ["disabled"], l8 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, i8 = ["disabled"], r8 = ["for"], u8 = ["id", "value", "disabled", "onChange"], c8 = { class: "control" }, d8 = ["aria-checked", "disabled"], f8 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, h8 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, m8 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, p8 = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", Xx, [
      A(Ht, { icon: "gauge" }, {
        default: P(() => [...u[3] || (u[3] = [
          Y("Now", -1)
        ])]),
        _: 1
      }),
      m("div", Jx, [
        m("div", null, [
          m("strong", Zx, [
            Y(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", e8, [
            (r(!0), d(j, null, ne(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Q({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", t8, v(e.queue.waiting_count), 1),
          u[4] || (u[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", n8, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      m("div", a8, [
        u[5] || (u[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", s8, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, o8),
          m("output", l8, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, i8)
        ])
      ]),
      (r(!0), d(j, null, ne(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, r8),
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
        }, null, 40, u8)
      ]))), 128)),
      m("div", c8, [
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
        ])], 8, d8)
      ]),
      e.queue.halt_cause === "update" ? (r(), d("p", f8, [
        A(le, {
          name: "pause",
          size: 13
        }),
        u[8] || (u[8] = Y("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", h8, [
        A(le, {
          name: "pause",
          size: 13
        }),
        Y("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", m8, v(o.value), 1)) : k("", !0)
    ]));
  }
}, g8 = /* @__PURE__ */ U(p8, [["__scopeId", "data-v-975b4b89"]]), v8 = ["data-queue-row", "data-queue-process"], y8 = ["aria-expanded"], b8 = { class: "run-line" }, k8 = { class: "leading" }, w8 = {
  key: 0,
  "data-queue-position": ""
}, $8 = ["title"], x8 = { class: "command" }, S8 = {
  class: "time",
  "data-queue-time": ""
}, M8 = { class: "details" }, _8 = { "data-queue-type": "" }, C8 = { class: "failed" }, A8 = { class: "drop-inner" }, E8 = { class: "output" }, O8 = { class: "output-heading" }, T8 = ["href"], I8 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(), o = ur((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = ro(), u = M(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = M(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await Fe(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await Fe(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return pe(() => n.expanded, h, { immediate: !0 }), Mn(["output.*"], f, (p) => ni(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (r(), d("div", {
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
          y[3] || (y[3] = Ct($e((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = Ct($e((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", b8, [
          m("span", k8, [
            e.run.section === "waiting" ? (r(), d("span", w8, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Q(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, $8))
          ]),
          m("code", x8, v(e.run.line), 1),
          m("span", S8, v(c.value), 1),
          A(le, {
            class: Q(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", M8, [
          m("span", _8, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(j, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = $e((b) => B(yt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(j, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(j, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = $e((b) => B(yt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(j, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", C8, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, y8),
      m("div", {
        class: Q(["drop", { open: e.expanded }])
      }, [
        m("div", A8, [
          m("div", E8, [
            m("div", O8, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, T8)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && B(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              Y(v(e.run.line), 1),
              B(l).length ? (r(), d(j, { key: 0 }, [
                Y(v(`
` + B(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, v8));
  }
}, B8 = /* @__PURE__ */ U(I8, [["__scopeId", "data-v-18099d0b"]]), R8 = {
  class: "process-queue",
  "data-test-queue": ""
}, L8 = { class: "scroll" }, N8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, q8 = ["data-queue-empty"], is = 20, D8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _(null), a = _(""), s = _([]), o = _(is), l = M(() => {
      var p, y;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let i = 0;
    const u = M(() => n.value ? [
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
    async function f() {
      const p = ++i, y = await t.read(o.value === is ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      p === i && (a.value = y.ok ? "" : y.error, y.ok && (n.value = y.value));
    }
    function h() {
      o.value += is, f();
    }
    return Mn(["process.*", "setting.*"], f), Me(f), (p, y) => (r(), d("article", R8, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", L8, [
        a.value ? (r(), d("p", N8, v(a.value), 1)) : k("", !0),
        n.value ? (r(), d(j, { key: 1 }, [
          A(g8, {
            queue: n.value,
            read: e.read,
            onSaved: f
          }, null, 8, ["queue", "read"]),
          A(Ps, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: P(() => [
              (r(!0), d(j, null, ne(u.value, (b) => (r(), d(j, {
                key: b.key
              }, [
                b.run ? (r(), W(B8, {
                  key: 0,
                  run: b.run,
                  environment: n.value.environment_name,
                  position: b.position,
                  read: e.read,
                  expanded: s.value.includes(b.run.id),
                  onToggle: (E) => c(b.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : b.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": b.section.type
                }, v(b.section.empty), 9, q8)) : (r(), W(Ht, {
                  key: 2,
                  icon: b.section.icon,
                  count: b.section.rows.length,
                  "data-queue-heading": b.section.type
                }, {
                  default: P(() => [
                    Y(v(b.section.heading), 1)
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
        ], 64)) : a.value ? k("", !0) : (r(), W(Qe, { key: 2 }))
      ])
    ]));
  }
}, jC = /* @__PURE__ */ U(D8, [["__scopeId", "data-v-d9b6ef6b"]]), P8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, j8 = ["aria-expanded"], F8 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, W8 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, H8 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, z8 = {
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
    const t = e, n = _(t.open), a = _(0), s = _(0), o = _("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return pe(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), Mn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(j, null, [
      a.value ? (r(), d("section", P8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", F8, v(a.value), 1),
          A(Yt, { open: n.value }, null, 8, ["open"])
        ], 8, j8),
        m("div", {
          class: Q(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", W8, [
            A(ad, {
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
      o.value ? (r(), d("p", H8, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, U8 = /* @__PURE__ */ U(z8, [["__scopeId", "data-v-a4550728"]]), G8 = ["placeholder"], V8 = { class: "actions" }, K8 = { class: "error" }, Y8 = {
  key: 1,
  class: "card closed"
}, Q8 = { class: "mark" }, X8 = { class: "prompt" }, J8 = {
  key: 0,
  class: "draft"
}, Z8 = {
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
    const a = e, s = n, o = rn(e, "draft"), l = rn(e, "error"), i = _(!!l.value), u = _(!1), c = _(!1), f = _(null);
    async function h() {
      var b, E;
      i.value = !0, u.value = !1, await Fe(), (E = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || E.focus();
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
        } catch (E) {
          o.value = b, l.value = E.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, E) => (r(), d("div", {
      class: Q(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(y, ["prevent"]),
        onKeydown: Ct(p, ["esc"])
      }, [
        re(b.$slots, "who", {}, void 0, !0),
        et(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": E[0] || (E[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: E[1] || (E[1] = Ct((x) => B(Ki)(x, y), ["enter"]))
        }, null, 40, G8), [
          [ea, o.value]
        ]),
        m("div", V8, [
          m("span", K8, v(l.value), 1),
          A(ge, {
            small: "",
            onClick: p
          }, {
            default: P(() => [...E[3] || (E[3] = [
              Y("Cancel", -1)
            ])]),
            _: 1
          }),
          A(ge, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: P(() => [...E[4] || (E[4] = [
              Y("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", Y8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", Q8, [
            A(le, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", X8, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", J8, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: E[2] || (E[2] = (x) => s("show"))
        }, [
          m("span", null, v(B(od)(e.count, "comment")), 1),
          A(le, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, e3 = /* @__PURE__ */ U(Z8, [["__scopeId", "data-v-b68baddd"]]), t3 = { wide: 1130 }, n3 = /\{([A-Za-z_]\w*)\}/g;
function Zn(e, t, n = {}) {
  return e.replace(n3, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const a3 = (e, t, n, a) => Zn(e.label, n, { row_id: a, id: a }) || R2(t, n, a), s3 = { class: "comment-side-head" }, o3 = {
  key: 0,
  class: "comment-none"
}, l3 = { key: 0 }, i3 = {
  key: 1,
  class: "comment-none"
}, r3 = {
  class: "comment",
  "data-comment": ""
}, u3 = {
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
      class: Q(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", s3, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        A(va, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", o3, "No comments yet")) : k("", !0),
      (r(!0), d(j, null, ne(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", l3, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", i3, "Revision " + v(a.revision), 1)) : k("", !0),
        m("p", r3, v(e.words(a)), 1)
      ]))), 128)),
      A(wn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Nl = /* @__PURE__ */ U(u3, [["__scopeId", "data-v-276284a3"]]), c3 = { class: "resource-heading" }, d3 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, f3 = {
  key: 1,
  class: "resource-abstract"
}, h3 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", c3, [
      e.title ? (r(), d("h2", d3, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", f3, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, m3 = /* @__PURE__ */ U(h3, [["__scopeId", "data-v-d65ef53f"]]), p3 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, g3 = { class: "inspector-icons" }, v3 = { class: "inspector-icons-start" }, y3 = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, b3 = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, k3 = { class: "inspector-icons-end" }, w3 = ["href"], $3 = {
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
    const n = e, a = t, s = M(() => `${n.opened.table}:${n.opened.id}`), o = M(() => n.shareable && !n.readOnly), l = M(() => !n.label && !!n.title), i = M(() => n.backed ? "Close all rows" : "Close");
    return (u, c) => (r(), d("header", p3, [
      m("div", g3, [
        m("span", v3, [
          e.backed ? (r(), W(ge, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: c[0] || (c[0] = (f) => a("back"))
          }, {
            default: P(() => [
              A(le, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (r(), d(j, { key: 1 }, [
            A(ge, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: P(() => [
                A(le, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            A(ge, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: P(() => [
                A(le, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        l.value ? (r(), d("h2", y3, v(e.title), 1)) : (r(), d("p", b3, v(e.label), 1)),
        m("span", k3, [
          e.embedded ? (r(), W(ge, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => B(je)(s.value))
          }, {
            default: P(() => [
              A(le, {
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
            href: B(ah)(s.value)
          }, [
            A(le, {
              name: "share",
              size: 13
            })
          ], 8, w3)) : k("", !0),
          e.embedded ? k("", !0) : (r(), W(ge, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: P(() => [
              A(le, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(m3, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, x3 = /* @__PURE__ */ U($3, [["__scopeId", "data-v-3df1ccb0"]]), S3 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, M3 = { class: "field-name" }, _3 = {
  key: 1,
  class: "field-value"
}, C3 = ["onClick"], A3 = {
  key: 2,
  class: "field-value"
}, E3 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", S3, [
      (r(!0), d(j, null, ne(e.fields, (o) => (r(), d(j, {
        key: o.name
      }, [
        m("p", M3, v(o.label), 1),
        o.isTime ? (r(), W(tt, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", _3, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, C3)
        ])) : (r(), d("p", A3, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, O3 = /* @__PURE__ */ U(E3, [["__scopeId", "data-v-7e45afb5"]]);
async function T3(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: L2(s.value.actor, s.value.creator_agent), owner: a.length ? N2(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const I3 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, B3 = {
  key: 1,
  class: "inspector-wait"
}, R3 = { class: "inspector-main" }, L3 = { class: "inspector-column" }, N3 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, q3 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, D3 = { class: "inspector-text" }, P3 = ["innerHTML"], j3 = {
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
    const n = e, a = t, s = _(null);
    Ds(si, M(() => {
      var F;
      return ((F = s.value) == null ? void 0 : F.$el) ?? null;
    }));
    const o = /* @__PURE__ */ new Set(["question", "memory", "rule"]), l = M(() => n.catalogue.inspector(n.term) ?? {
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
    }), i = _(null), u = _(""), c = _(""), f = _(""), h = _("details"), p = _(null), y = _(0);
    let b = 0;
    const E = M(() => ({ row_id: n.id, id: n.id })), x = M(() => i.value ? Zn(l.value.title, i.value, E.value) || B2(n.term, i.value, n.id) : ""), S = M(() => i.value ? a3(l.value, n.term, i.value, n.id) : ""), O = M(() => S.value === x.value ? "" : S.value), z = M(() => i.value ? Zn(l.value.description, i.value, E.value) : ""), H = M(() => {
      var F, G, K;
      return ((F = i.value) == null ? void 0 : F.body) || ((G = i.value) == null ? void 0 : G.brief) || (o.has(n.term) ? (K = i.value) == null ? void 0 : K.text : "") || "";
    }), I = M(() => H.value ? to(H.value, { env: "", rowNames: !1 }) : ""), D = M(() => q2(i.value, H.value, u.value, c.value)), L = M(() => l.value.comments && y.value >= t3.wide), q = M(() => l.value.comments && !L.value), T = (F) => l.value.components.filter((G) => (G.tab || "") === F).map((G) => G.window), N = M(() => [...new Set(l.value.components.map((F) => F.tab).filter(Boolean))]), w = M(() => N.value.length || q.value ? [{ key: "details", label: "Details" }, ...N.value.map((F) => ({ key: F, label: F })), ...q.value ? [{ key: "comments", label: "Comments" }] : []] : []), g = M(() => {
      const F = l.value.links;
      return F ? { categories: F.categories, open: F.open, outsidePlan: F.excludes_plan, pageSize: F.page_size } : null;
    }), $ = Zi(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (F) => n.read(F));
    async function C() {
      const F = ++b, G = await n.read(Zn(l.value.reads, null, E.value).split(/\s+/).filter(Boolean));
      if (F !== b || (f.value = G.ok ? "" : G.error, !G.ok)) return;
      i.value = G.value;
      const K = await T3(n.read, i.value);
      F === b && (u.value = K.creator, c.value = K.owner);
    }
    pe(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", h.value = "details", C();
    }, { immediate: !0 }), Mn(l.value.events, C), pe($.open, (F) => F && q.value && (h.value = "comments"));
    let R = null;
    return Me(() => {
      var F;
      y.value = ((F = p.value) == null ? void 0 : F.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (R = new ResizeObserver(() => y.value = p.value.clientWidth), R.observe(p.value));
    }), Re(() => R == null ? void 0 : R.disconnect()), (F, G) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(x3, {
        label: O.value,
        title: x.value,
        description: z.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: G[0] || (G[0] = (K) => a("close")),
        onBack: G[1] || (G[1] = (K) => a("back")),
        onStep: G[2] || (G[2] = (K) => a("step", K))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", I3, v(f.value), 1)) : i.value ? (r(), d(j, { key: 2 }, [
        A(_s, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: P(() => [
            A(Js, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: C
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        m("div", R3, [
          m("div", L3, [
            w.value.length ? (r(), d("div", N3, [
              A(Ft, {
                options: w.value,
                value: h.value,
                onPick: G[3] || (G[3] = (K) => h.value = K)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            m("div", q3, [
              A(Vt, { value: h.value }, {
                details: P(() => [
                  m("div", D3, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, P3)) : k("", !0),
                    l.value.lists_fields ? (r(), W(O3, {
                      key: 1,
                      fields: D.value,
                      onPeek: G[4] || (G[4] = (K) => a("open", K))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  A(Ss, {
                    "slot-name": `inspector.${e.term}`,
                    names: T(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: P(() => [
                  A(Nl, {
                    below: "",
                    comments: B($).comments.value,
                    words: B($).words,
                    more: !!B($).nextPage.value,
                    loading: B($).loading.value,
                    failure: B($).failure.value,
                    onMore: B($).loadMore,
                    onClose: G[5] || (G[5] = (K) => h.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: P(() => [
                  A(Ss, {
                    names: T(h.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              g.value ? (r(), W(U8, De({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, g.value, {
                onOpen: G[6] || (G[6] = (K) => a("open", K))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), W(e3, {
              key: 1,
              send: B($).send,
              count: B($).total.value,
              onShow: G[7] || (G[7] = (K) => q.value && (h.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          L.value ? (r(), W(Nl, {
            key: 0,
            comments: B($).comments.value,
            words: B($).words,
            more: !!B($).nextPage.value,
            loading: B($).loading.value,
            failure: B($).failure.value,
            onMore: B($).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (r(), d("div", B3, [
        A(Qe)
      ]))
    ], 512));
  }
}, F3 = /* @__PURE__ */ U(j3, [["__scopeId", "data-v-60363e95"]]), FC = {
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
    const t = Se(Ks);
    return (n, a) => (r(), W(F3, De(n.$props, {
      catalogue: B(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, W3 = { class: "facts" }, H3 = { class: "fact wide" }, z3 = ["title"], U3 = {
  key: 1,
  class: "fact-value"
}, G3 = {
  key: 0,
  class: "fact"
}, V3 = { class: "fact-value" }, K3 = { class: "fact" }, Y3 = { class: "fact-label" }, Q3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, X3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, J3 = {
  key: 2,
  class: "fact"
}, Z3 = { class: "fact-value" }, eS = { class: "fact wide" }, tS = { class: "fact-label" }, nS = { class: "fact wide" }, aS = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, sS = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = la.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", W3, [
        m("div", H3, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => B(je)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, z3)) : (r(), d("span", U3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", G3, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", V3, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(j, { key: 1 }, [
          m("div", K3, [
            m("span", Y3, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A(fn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: B(so)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => B(je)(`agents:${e.task.helper_id}`))
            }, {
              default: P(() => [
                A(Dt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          B(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", Q3, [
            A(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = Y(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", X3, [
            A(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = Y(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", J3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", Z3, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        m("div", eS, [
          m("span", tS, [
            i[9] || (i[9] = Y(" Complexity ", -1)),
            A(pi, {
              lines: B(lr).map((f, h) => `${h + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Ft, {
            options: B(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        m("div", nS, [
          i[10] || (i[10] = m("span", { class: "fact-label" }, "Priority", -1)),
          A(Ft, {
            options: B(n),
            value: String(B(or)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", aS, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, oS = /* @__PURE__ */ U(sS, [["__scopeId", "data-v-4bf27961"]]);
function lS(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const iS = { class: "number" }, rS = { class: "title" }, uS = { class: "word" }, cS = {
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
    return (a, s) => (r(), W(Ke(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Q(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: P(() => [
        A(ka, { status: e.status }, null, 8, ["status"]),
        m("span", iS, v(e.number), 1),
        m("span", rS, v(e.title), 1),
        m("span", uS, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, rs = /* @__PURE__ */ U(cS, [["__scopeId", "data-v-f6417ae8"]]), dS = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, fS = { class: "level" }, hS = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1);
    pe(() => n.task.id, () => s.value = !1);
    const o = M(() => lS(n.task.id, n.graph)), l = M(() => s.value ? o.value.above : o.value.above.slice(-1)), i = M(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = M(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), f = (h, p = !1) => ({ status: hn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (r(), d("section", dS, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (r(!0), d(j, null, ne(l.value, (y) => (r(), d(j, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", fS, [
          (r(!0), d(j, null, ne(y, (b) => (r(), W(rs, De({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: p[0] || (p[0] = (E) => a("select", E))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(rs, cs(Hl(f(e.task, !0))), null, 16),
      (r(!0), d(j, null, ne(i.value, (y) => (r(), d(j, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        A(rs, De({ ref_for: !0 }, f(y), {
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
}, mS = /* @__PURE__ */ U(hS, [["__scopeId", "data-v-79c52417"]]), pS = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, gS = ["datetime"], vS = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", pS, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (r(!0), d(j, null, ne(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, gS),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, yS = /* @__PURE__ */ U(vS, [["__scopeId", "data-v-b41f213b"]]), bS = {
  class: "part",
  "data-resource-waits": ""
}, kS = ["onClick"], wS = { class: "wait-id" }, $S = { class: "wait-title" }, xS = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", bS, [
      m("h4", null, v(e.title), 1),
      (r(!0), d(j, null, ne(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(ka, {
          status: B(hn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", wS, v(o.id), 1),
        m("span", $S, v(o.title), 1)
      ], 8, kS))), 128))
    ]));
  }
}, ql = /* @__PURE__ */ U(xS, [["__scopeId", "data-v-8fb2e251"]]), SS = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, MS = { class: "text" }, _S = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, CS = 180, AS = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = _(!1), l = M(() => a.task.waits.filter((u) => !n.has(u.state))), i = M(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(j, null, [
      l.value.length ? (r(), W(ql, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", SS, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", MS, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", _S, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Q(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > CS && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), W(ql, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, ES = /* @__PURE__ */ U(AS, [["__scopeId", "data-v-4a3f1e79"]]), OS = {
  class: "task-details",
  "data-task-details": ""
}, TS = { class: "since" }, IS = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, BS = { class: "text" }, RS = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, LS = {
  key: 1,
  class: "note"
}, NS = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, qS = { class: "text" }, DS = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", OS, [
        m("div", {
          class: Q(["state-line", B(hn)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(ka, {
              status: B(hn)(e.task.state)
            }, null, 8, ["status"]),
            Y(" " + v(a(e.task.state)), 1)
          ]),
          m("span", TS, [
            o[5] || (o[5] = Y(" since ", -1)),
            A(tt, {
              at: B(Rh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", IS, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", BS, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", RS, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", LS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", NS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", qS, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), W(mS, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        A(oS, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(ES, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(yS, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, WC = /* @__PURE__ */ U(DS, [["__scopeId", "data-v-7e73fa21"]]), PS = 50, jS = { messages: 25 }, FS = (e) => jS[e] || PS, WS = {
  class: "task-log",
  "aria-label": "Task log"
}, HS = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, zS = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, US = { class: "entries" }, GS = ["data-task-log-important"], VS = ["datetime"], KS = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, YS = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = _([]), a = _(1), s = _(!0), o = _(!0), l = _("");
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
        String(FS("task_logs")),
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
    ), nt(() => {
      i += 1;
    }), (c, f) => (r(), d("section", WS, [
      o.value ? (r(), W(Qe, { key: 0 })) : l.value ? (r(), d(j, { key: 1 }, [
        m("p", HS, v(l.value), 1),
        A(ge, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (h) => u(a.value))
        }, {
          default: P(() => [...f[3] || (f[3] = [
            Y("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(j, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", zS, "No log entries yet.")),
        m("ol", US, [
          (r(!0), d(j, null, ne(n.value, (h) => (r(), d("li", {
            key: h.id,
            class: Q(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, VS),
            m("p", null, v(h.line), 1)
          ], 10, GS))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", KS, [
          A(ge, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (h) => u(a.value - 1))
          }, {
            default: P(() => [...f[4] || (f[4] = [
              Y("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          A(ge, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (h) => u(a.value + 1))
          }, {
            default: P(() => [...f[5] || (f[5] = [
              Y("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, HC = /* @__PURE__ */ U(YS, [["__scopeId", "data-v-cfa43bf1"]]);
function QS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var us = { exports: {} }, Dl;
function XS() {
  return Dl || (Dl = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, D) {
        var L = 236, q = 17, T = I, N = o[D], w = null, g = 0, $ = null, C = [], R = {}, F = function(X, J) {
          g = T * 4 + 17, w = (function(V) {
            for (var Z = new Array(V), ee = 0; ee < V; ee += 1) {
              Z[ee] = new Array(V);
              for (var se = 0; se < V; se += 1)
                Z[ee][se] = null;
            }
            return Z;
          })(g), G(0, 0), G(g - 7, 0), G(0, g - 7), ce(), he(), Ie(X, J), T >= 7 && be(X), $ == null && ($ = ae(T, N, C)), oe($, J);
        }, G = function(X, J) {
          for (var V = -1; V <= 7; V += 1)
            if (!(X + V <= -1 || g <= X + V))
              for (var Z = -1; Z <= 7; Z += 1)
                J + Z <= -1 || g <= J + Z || (0 <= V && V <= 6 && (Z == 0 || Z == 6) || 0 <= Z && Z <= 6 && (V == 0 || V == 6) || 2 <= V && V <= 4 && 2 <= Z && Z <= 4 ? w[X + V][J + Z] = !0 : w[X + V][J + Z] = !1);
        }, K = function() {
          for (var X = 0, J = 0, V = 0; V < 8; V += 1) {
            F(!0, V);
            var Z = i.getLostPoint(R);
            (V == 0 || X > Z) && (X = Z, J = V);
          }
          return J;
        }, he = function() {
          for (var X = 8; X < g - 8; X += 1)
            w[X][6] == null && (w[X][6] = X % 2 == 0);
          for (var J = 8; J < g - 8; J += 1)
            w[6][J] == null && (w[6][J] = J % 2 == 0);
        }, ce = function() {
          for (var X = i.getPatternPosition(T), J = 0; J < X.length; J += 1)
            for (var V = 0; V < X.length; V += 1) {
              var Z = X[J], ee = X[V];
              if (w[Z][ee] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var de = -2; de <= 2; de += 1)
                    se == -2 || se == 2 || de == -2 || de == 2 || se == 0 && de == 0 ? w[Z + se][ee + de] = !0 : w[Z + se][ee + de] = !1;
            }
        }, be = function(X) {
          for (var J = i.getBCHTypeNumber(T), V = 0; V < 18; V += 1) {
            var Z = !X && (J >> V & 1) == 1;
            w[Math.floor(V / 3)][V % 3 + g - 8 - 3] = Z;
          }
          for (var V = 0; V < 18; V += 1) {
            var Z = !X && (J >> V & 1) == 1;
            w[V % 3 + g - 8 - 3][Math.floor(V / 3)] = Z;
          }
        }, Ie = function(X, J) {
          for (var V = N << 3 | J, Z = i.getBCHTypeInfo(V), ee = 0; ee < 15; ee += 1) {
            var se = !X && (Z >> ee & 1) == 1;
            ee < 6 ? w[ee][8] = se : ee < 8 ? w[ee + 1][8] = se : w[g - 15 + ee][8] = se;
          }
          for (var ee = 0; ee < 15; ee += 1) {
            var se = !X && (Z >> ee & 1) == 1;
            ee < 8 ? w[8][g - ee - 1] = se : ee < 9 ? w[8][15 - ee - 1 + 1] = se : w[8][15 - ee - 1] = se;
          }
          w[g - 8][8] = !X;
        }, oe = function(X, J) {
          for (var V = -1, Z = g - 1, ee = 7, se = 0, de = i.getMaskFunction(J), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var xe = 0; xe < 2; xe += 1)
                if (w[Z][ue - xe] == null) {
                  var Ae = !1;
                  se < X.length && (Ae = (X[se] >>> ee & 1) == 1);
                  var me = de(Z, ue - xe);
                  me && (Ae = !Ae), w[Z][ue - xe] = Ae, ee -= 1, ee == -1 && (se += 1, ee = 7);
                }
              if (Z += V, Z < 0 || g <= Z) {
                Z -= V, V = -V;
                break;
              }
            }
        }, te = function(X, J) {
          for (var V = 0, Z = 0, ee = 0, se = new Array(J.length), de = new Array(J.length), ue = 0; ue < J.length; ue += 1) {
            var xe = J[ue].dataCount, Ae = J[ue].totalCount - xe;
            Z = Math.max(Z, xe), ee = Math.max(ee, Ae), se[ue] = new Array(xe);
            for (var me = 0; me < se[ue].length; me += 1)
              se[ue][me] = 255 & X.getBuffer()[me + V];
            V += xe;
            var We = i.getErrorCorrectPolynomial(Ae), He = c(se[ue], We.getLength() - 1), xo = He.mod(We);
            de[ue] = new Array(We.getLength() - 1);
            for (var me = 0; me < de[ue].length; me += 1) {
              var So = me + xo.getLength() - de[ue].length;
              de[ue][me] = So >= 0 ? xo.getAt(So) : 0;
            }
          }
          for (var Mo = 0, me = 0; me < J.length; me += 1)
            Mo += J[me].totalCount;
          for (var _a = new Array(Mo), Tn = 0, me = 0; me < Z; me += 1)
            for (var ue = 0; ue < J.length; ue += 1)
              me < se[ue].length && (_a[Tn] = se[ue][me], Tn += 1);
          for (var me = 0; me < ee; me += 1)
            for (var ue = 0; ue < J.length; ue += 1)
              me < de[ue].length && (_a[Tn] = de[ue][me], Tn += 1);
          return _a;
        }, ae = function(X, J, V) {
          for (var Z = f.getRSBlocks(X, J), ee = h(), se = 0; se < V.length; se += 1) {
            var de = V[se];
            ee.put(de.getMode(), 4), ee.put(de.getLength(), i.getLengthInBits(de.getMode(), X)), de.write(ee);
          }
          for (var ue = 0, se = 0; se < Z.length; se += 1)
            ue += Z[se].dataCount;
          if (ee.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + ee.getLengthInBits() + ">" + ue * 8 + ")";
          for (ee.getLengthInBits() + 4 <= ue * 8 && ee.put(0, 4); ee.getLengthInBits() % 8 != 0; )
            ee.putBit(!1);
          for (; !(ee.getLengthInBits() >= ue * 8 || (ee.put(L, 8), ee.getLengthInBits() >= ue * 8)); )
            ee.put(q, 8);
          return te(ee, Z);
        };
        R.addData = function(X, J) {
          J = J || "Byte";
          var V = null;
          switch (J) {
            case "Numeric":
              V = p(X);
              break;
            case "Alphanumeric":
              V = y(X);
              break;
            case "Byte":
              V = b(X);
              break;
            case "Kanji":
              V = E(X);
              break;
            default:
              throw "mode:" + J;
          }
          C.push(V), $ = null;
        }, R.isDark = function(X, J) {
          if (X < 0 || g <= X || J < 0 || g <= J)
            throw X + "," + J;
          return w[X][J];
        }, R.getModuleCount = function() {
          return g;
        }, R.make = function() {
          if (T < 1) {
            for (var X = 1; X < 40; X++) {
              for (var J = f.getRSBlocks(X, N), V = h(), Z = 0; Z < C.length; Z++) {
                var ee = C[Z];
                V.put(ee.getMode(), 4), V.put(ee.getLength(), i.getLengthInBits(ee.getMode(), X)), ee.write(V);
              }
              for (var se = 0, Z = 0; Z < J.length; Z++)
                se += J[Z].dataCount;
              if (V.getLengthInBits() <= se * 8)
                break;
            }
            T = X;
          }
          F(!1, K());
        }, R.createTableTag = function(X, J) {
          X = X || 2, J = typeof J > "u" ? X * 4 : J;
          var V = "";
          V += '<table style="', V += " border-width: 0px; border-style: none;", V += " border-collapse: collapse;", V += " padding: 0px; margin: " + J + "px;", V += '">', V += "<tbody>";
          for (var Z = 0; Z < R.getModuleCount(); Z += 1) {
            V += "<tr>";
            for (var ee = 0; ee < R.getModuleCount(); ee += 1)
              V += '<td style="', V += " border-width: 0px; border-style: none;", V += " border-collapse: collapse;", V += " padding: 0px; margin: 0px;", V += " width: " + X + "px;", V += " height: " + X + "px;", V += " background-color: ", V += R.isDark(Z, ee) ? "#000000" : "#ffffff", V += ";", V += '"/>';
            V += "</tr>";
          }
          return V += "</tbody>", V += "</table>", V;
        }, R.createSvgTag = function(X, J, V, Z) {
          var ee = {};
          typeof arguments[0] == "object" && (ee = arguments[0], X = ee.cellSize, J = ee.margin, V = ee.alt, Z = ee.title), X = X || 2, J = typeof J > "u" ? X * 4 : J, V = typeof V == "string" ? { text: V } : V || {}, V.text = V.text || null, V.id = V.text ? V.id || "qrcode-description" : null, Z = typeof Z == "string" ? { text: Z } : Z || {}, Z.text = Z.text || null, Z.id = Z.text ? Z.id || "qrcode-title" : null;
          var se = R.getModuleCount() * X + J * 2, de, ue, xe, Ae, me = "", We;
          for (We = "l" + X + ",0 0," + X + " -" + X + ",0 0,-" + X + "z ", me += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', me += ee.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', me += ' viewBox="0 0 ' + se + " " + se + '" ', me += ' preserveAspectRatio="xMinYMin meet"', me += Z.text || V.text ? ' role="img" aria-labelledby="' + Oe([Z.id, V.id].join(" ").trim()) + '"' : "", me += ">", me += Z.text ? '<title id="' + Oe(Z.id) + '">' + Oe(Z.text) + "</title>" : "", me += V.text ? '<description id="' + Oe(V.id) + '">' + Oe(V.text) + "</description>" : "", me += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', me += '<path d="', xe = 0; xe < R.getModuleCount(); xe += 1)
            for (Ae = xe * X + J, de = 0; de < R.getModuleCount(); de += 1)
              R.isDark(xe, de) && (ue = de * X + J, me += "M" + ue + "," + Ae + We);
          return me += '" stroke="transparent" fill="black"/>', me += "</svg>", me;
        }, R.createDataURL = function(X, J) {
          X = X || 2, J = typeof J > "u" ? X * 4 : J;
          var V = R.getModuleCount() * X + J * 2, Z = J, ee = V - J;
          return H(V, V, function(se, de) {
            if (Z <= se && se < ee && Z <= de && de < ee) {
              var ue = Math.floor((se - Z) / X), xe = Math.floor((de - Z) / X);
              return R.isDark(xe, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(X, J, V) {
          X = X || 2, J = typeof J > "u" ? X * 4 : J;
          var Z = R.getModuleCount() * X + J * 2, ee = "";
          return ee += "<img", ee += ' src="', ee += R.createDataURL(X, J), ee += '"', ee += ' width="', ee += Z, ee += '"', ee += ' height="', ee += Z, ee += '"', V && (ee += ' alt="', ee += Oe(V), ee += '"'), ee += "/>", ee;
        };
        var Oe = function(X) {
          for (var J = "", V = 0; V < X.length; V += 1) {
            var Z = X.charAt(V);
            switch (Z) {
              case "<":
                J += "&lt;";
                break;
              case ">":
                J += "&gt;";
                break;
              case "&":
                J += "&amp;";
                break;
              case '"':
                J += "&quot;";
                break;
              default:
                J += Z;
                break;
            }
          }
          return J;
        }, Zr = function(X) {
          var J = 1;
          X = typeof X > "u" ? J * 2 : X;
          var V = R.getModuleCount() * J + X * 2, Z = X, ee = V - X, se, de, ue, xe, Ae, me = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, We = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, He = "";
          for (se = 0; se < V; se += 2) {
            for (ue = Math.floor((se - Z) / J), xe = Math.floor((se + 1 - Z) / J), de = 0; de < V; de += 1)
              Ae = "█", Z <= de && de < ee && Z <= se && se < ee && R.isDark(ue, Math.floor((de - Z) / J)) && (Ae = " "), Z <= de && de < ee && Z <= se + 1 && se + 1 < ee && R.isDark(xe, Math.floor((de - Z) / J)) ? Ae += " " : Ae += "█", He += X < 1 && se + 1 >= ee ? We[Ae] : me[Ae];
            He += `
`;
          }
          return V % 2 && X > 0 ? He.substring(0, He.length - V - 1) + Array(V + 1).join("▀") : He.substring(0, He.length - 1);
        };
        return R.createASCII = function(X, J) {
          if (X = X || 1, X < 2)
            return Zr(J);
          X -= 1, J = typeof J > "u" ? X * 2 : J;
          var V = R.getModuleCount() * X + J * 2, Z = J, ee = V - J, se, de, ue, xe, Ae = Array(X + 1).join("██"), me = Array(X + 1).join("  "), We = "", He = "";
          for (se = 0; se < V; se += 1) {
            for (ue = Math.floor((se - Z) / X), He = "", de = 0; de < V; de += 1)
              xe = 1, Z <= de && de < ee && Z <= se && se < ee && R.isDark(ue, Math.floor((de - Z) / X)) && (xe = 0), He += xe ? Ae : me;
            for (ue = 0; ue < X; ue += 1)
              We += He + `
`;
          }
          return We.substring(0, We.length - 1);
        }, R.renderTo2dContext = function(X, J) {
          J = J || 2;
          for (var V = R.getModuleCount(), Z = 0; Z < V; Z++)
            for (var ee = 0; ee < V; ee++)
              X.fillStyle = R.isDark(Z, ee) ? "black" : "white", X.fillRect(Z * J, ee * J, J, J);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(I) {
          for (var D = [], L = 0; L < I.length; L += 1) {
            var q = I.charCodeAt(L);
            D.push(q & 255);
          }
          return D;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(I, D) {
        var L = (function() {
          for (var T = O(I), N = function() {
            var he = T.read();
            if (he == -1) throw "eof";
            return he;
          }, w = 0, g = {}; ; ) {
            var $ = T.read();
            if ($ == -1) break;
            var C = N(), R = N(), F = N(), G = String.fromCharCode($ << 8 | C), K = R << 8 | F;
            g[G] = K, w += 1;
          }
          if (w != D)
            throw w + " != " + D;
          return g;
        })(), q = 63;
        return function(T) {
          for (var N = [], w = 0; w < T.length; w += 1) {
            var g = T.charCodeAt(w);
            if (g < 128)
              N.push(g);
            else {
              var $ = L[T.charAt(w)];
              typeof $ == "number" ? ($ & 255) == $ ? N.push($) : (N.push($ >>> 8), N.push($ & 255)) : N.push(q);
            }
          }
          return N;
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
        var I = [
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
        ], D = 1335, L = 7973, q = 21522, T = {}, N = function(w) {
          for (var g = 0; w != 0; )
            g += 1, w >>>= 1;
          return g;
        };
        return T.getBCHTypeInfo = function(w) {
          for (var g = w << 10; N(g) - N(D) >= 0; )
            g ^= D << N(g) - N(D);
          return (w << 10 | g) ^ q;
        }, T.getBCHTypeNumber = function(w) {
          for (var g = w << 12; N(g) - N(L) >= 0; )
            g ^= L << N(g) - N(L);
          return w << 12 | g;
        }, T.getPatternPosition = function(w) {
          return I[w - 1];
        }, T.getMaskFunction = function(w) {
          switch (w) {
            case l.PATTERN000:
              return function(g, $) {
                return (g + $) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, $) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, $) {
                return $ % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, $) {
                return (g + $) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, $) {
                return (Math.floor(g / 2) + Math.floor($ / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, $) {
                return g * $ % 2 + g * $ % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, $) {
                return (g * $ % 2 + g * $ % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, $) {
                return (g * $ % 3 + (g + $) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + w;
          }
        }, T.getErrorCorrectPolynomial = function(w) {
          for (var g = c([1], 0), $ = 0; $ < w; $ += 1)
            g = g.multiply(c([1, u.gexp($)], 0));
          return g;
        }, T.getLengthInBits = function(w, g) {
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
        }, T.getLostPoint = function(w) {
          for (var g = w.getModuleCount(), $ = 0, C = 0; C < g; C += 1)
            for (var R = 0; R < g; R += 1) {
              for (var F = 0, G = w.isDark(C, R), K = -1; K <= 1; K += 1)
                if (!(C + K < 0 || g <= C + K))
                  for (var he = -1; he <= 1; he += 1)
                    R + he < 0 || g <= R + he || K == 0 && he == 0 || G == w.isDark(C + K, R + he) && (F += 1);
              F > 5 && ($ += 3 + F - 5);
            }
          for (var C = 0; C < g - 1; C += 1)
            for (var R = 0; R < g - 1; R += 1) {
              var ce = 0;
              w.isDark(C, R) && (ce += 1), w.isDark(C + 1, R) && (ce += 1), w.isDark(C, R + 1) && (ce += 1), w.isDark(C + 1, R + 1) && (ce += 1), (ce == 0 || ce == 4) && ($ += 3);
            }
          for (var C = 0; C < g; C += 1)
            for (var R = 0; R < g - 6; R += 1)
              w.isDark(C, R) && !w.isDark(C, R + 1) && w.isDark(C, R + 2) && w.isDark(C, R + 3) && w.isDark(C, R + 4) && !w.isDark(C, R + 5) && w.isDark(C, R + 6) && ($ += 40);
          for (var R = 0; R < g; R += 1)
            for (var C = 0; C < g - 6; C += 1)
              w.isDark(C, R) && !w.isDark(C + 1, R) && w.isDark(C + 2, R) && w.isDark(C + 3, R) && w.isDark(C + 4, R) && !w.isDark(C + 5, R) && w.isDark(C + 6, R) && ($ += 40);
          for (var be = 0, R = 0; R < g; R += 1)
            for (var C = 0; C < g; C += 1)
              w.isDark(C, R) && (be += 1);
          var Ie = Math.abs(100 * be / g / g - 50) / 5;
          return $ += Ie * 10, $;
        }, T;
      })(), u = (function() {
        for (var I = new Array(256), D = new Array(256), L = 0; L < 8; L += 1)
          I[L] = 1 << L;
        for (var L = 8; L < 256; L += 1)
          I[L] = I[L - 4] ^ I[L - 5] ^ I[L - 6] ^ I[L - 8];
        for (var L = 0; L < 255; L += 1)
          D[I[L]] = L;
        var q = {};
        return q.glog = function(T) {
          if (T < 1)
            throw "glog(" + T + ")";
          return D[T];
        }, q.gexp = function(T) {
          for (; T < 0; )
            T += 255;
          for (; T >= 256; )
            T -= 255;
          return I[T];
        }, q;
      })();
      function c(I, D) {
        if (typeof I.length > "u")
          throw I.length + "/" + D;
        var L = (function() {
          for (var T = 0; T < I.length && I[T] == 0; )
            T += 1;
          for (var N = new Array(I.length - T + D), w = 0; w < I.length - T; w += 1)
            N[w] = I[w + T];
          return N;
        })(), q = {};
        return q.getAt = function(T) {
          return L[T];
        }, q.getLength = function() {
          return L.length;
        }, q.multiply = function(T) {
          for (var N = new Array(q.getLength() + T.getLength() - 1), w = 0; w < q.getLength(); w += 1)
            for (var g = 0; g < T.getLength(); g += 1)
              N[w + g] ^= u.gexp(u.glog(q.getAt(w)) + u.glog(T.getAt(g)));
          return c(N, 0);
        }, q.mod = function(T) {
          if (q.getLength() - T.getLength() < 0)
            return q;
          for (var N = u.glog(q.getAt(0)) - u.glog(T.getAt(0)), w = new Array(q.getLength()), g = 0; g < q.getLength(); g += 1)
            w[g] = q.getAt(g);
          for (var g = 0; g < T.getLength(); g += 1)
            w[g] ^= u.gexp(u.glog(T.getAt(g)) + N);
          return c(w, 0).mod(T);
        }, q;
      }
      var f = (function() {
        var I = [
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
        ], D = function(T, N) {
          var w = {};
          return w.totalCount = T, w.dataCount = N, w;
        }, L = {}, q = function(T, N) {
          switch (N) {
            case o.L:
              return I[(T - 1) * 4 + 0];
            case o.M:
              return I[(T - 1) * 4 + 1];
            case o.Q:
              return I[(T - 1) * 4 + 2];
            case o.H:
              return I[(T - 1) * 4 + 3];
            default:
              return;
          }
        };
        return L.getRSBlocks = function(T, N) {
          var w = q(T, N);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + T + "/errorCorrectionLevel:" + N;
          for (var g = w.length / 3, $ = [], C = 0; C < g; C += 1)
            for (var R = w[C * 3 + 0], F = w[C * 3 + 1], G = w[C * 3 + 2], K = 0; K < R; K += 1)
              $.push(D(F, G));
          return $;
        }, L;
      })(), h = function() {
        var I = [], D = 0, L = {};
        return L.getBuffer = function() {
          return I;
        }, L.getAt = function(q) {
          var T = Math.floor(q / 8);
          return (I[T] >>> 7 - q % 8 & 1) == 1;
        }, L.put = function(q, T) {
          for (var N = 0; N < T; N += 1)
            L.putBit((q >>> T - N - 1 & 1) == 1);
        }, L.getLengthInBits = function() {
          return D;
        }, L.putBit = function(q) {
          var T = Math.floor(D / 8);
          I.length <= T && I.push(0), q && (I[T] |= 128 >>> D % 8), D += 1;
        }, L;
      }, p = function(I) {
        var D = s.MODE_NUMBER, L = I, q = {};
        q.getMode = function() {
          return D;
        }, q.getLength = function(w) {
          return L.length;
        }, q.write = function(w) {
          for (var g = L, $ = 0; $ + 2 < g.length; )
            w.put(T(g.substring($, $ + 3)), 10), $ += 3;
          $ < g.length && (g.length - $ == 1 ? w.put(T(g.substring($, $ + 1)), 4) : g.length - $ == 2 && w.put(T(g.substring($, $ + 2)), 7));
        };
        var T = function(w) {
          for (var g = 0, $ = 0; $ < w.length; $ += 1)
            g = g * 10 + N(w.charAt($));
          return g;
        }, N = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return q;
      }, y = function(I) {
        var D = s.MODE_ALPHA_NUM, L = I, q = {};
        q.getMode = function() {
          return D;
        }, q.getLength = function(N) {
          return L.length;
        }, q.write = function(N) {
          for (var w = L, g = 0; g + 1 < w.length; )
            N.put(
              T(w.charAt(g)) * 45 + T(w.charAt(g + 1)),
              11
            ), g += 2;
          g < w.length && N.put(T(w.charAt(g)), 6);
        };
        var T = function(N) {
          if ("0" <= N && N <= "9")
            return N.charCodeAt(0) - 48;
          if ("A" <= N && N <= "Z")
            return N.charCodeAt(0) - 65 + 10;
          switch (N) {
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
              throw "illegal char :" + N;
          }
        };
        return q;
      }, b = function(I) {
        var D = s.MODE_8BIT_BYTE, L = a.stringToBytes(I), q = {};
        return q.getMode = function() {
          return D;
        }, q.getLength = function(T) {
          return L.length;
        }, q.write = function(T) {
          for (var N = 0; N < L.length; N += 1)
            T.put(L[N], 8);
        }, q;
      }, E = function(I) {
        var D = s.MODE_KANJI, L = a.stringToBytesFuncs.SJIS;
        if (!L)
          throw "sjis not supported.";
        (function(N, w) {
          var g = L(N);
          if (g.length != 2 || (g[0] << 8 | g[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var q = L(I), T = {};
        return T.getMode = function() {
          return D;
        }, T.getLength = function(N) {
          return ~~(q.length / 2);
        }, T.write = function(N) {
          for (var w = q, g = 0; g + 1 < w.length; ) {
            var $ = (255 & w[g]) << 8 | 255 & w[g + 1];
            if (33088 <= $ && $ <= 40956)
              $ -= 33088;
            else if (57408 <= $ && $ <= 60351)
              $ -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + $;
            $ = ($ >>> 8 & 255) * 192 + ($ & 255), N.put($, 13), g += 2;
          }
          if (g < w.length)
            throw "illegal char at " + (g + 1);
        }, T;
      }, x = function() {
        var I = [], D = {};
        return D.writeByte = function(L) {
          I.push(L & 255);
        }, D.writeShort = function(L) {
          D.writeByte(L), D.writeByte(L >>> 8);
        }, D.writeBytes = function(L, q, T) {
          q = q || 0, T = T || L.length;
          for (var N = 0; N < T; N += 1)
            D.writeByte(L[N + q]);
        }, D.writeString = function(L) {
          for (var q = 0; q < L.length; q += 1)
            D.writeByte(L.charCodeAt(q));
        }, D.toByteArray = function() {
          return I;
        }, D.toString = function() {
          var L = "";
          L += "[";
          for (var q = 0; q < I.length; q += 1)
            q > 0 && (L += ","), L += I[q];
          return L += "]", L;
        }, D;
      }, S = function() {
        var I = 0, D = 0, L = 0, q = "", T = {}, N = function(g) {
          q += String.fromCharCode(w(g & 63));
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
        return T.writeByte = function(g) {
          for (I = I << 8 | g & 255, D += 8, L += 1; D >= 6; )
            N(I >>> D - 6), D -= 6;
        }, T.flush = function() {
          if (D > 0 && (N(I << 6 - D), I = 0, D = 0), L % 3 != 0)
            for (var g = 3 - L % 3, $ = 0; $ < g; $ += 1)
              q += "=";
        }, T.toString = function() {
          return q;
        }, T;
      }, O = function(I) {
        var D = I, L = 0, q = 0, T = 0, N = {};
        N.read = function() {
          for (; T < 8; ) {
            if (L >= D.length) {
              if (T == 0)
                return -1;
              throw "unexpected end of file./" + T;
            }
            var g = D.charAt(L);
            if (L += 1, g == "=")
              return T = 0, -1;
            if (g.match(/^\s$/))
              continue;
            q = q << 6 | w(g.charCodeAt(0)), T += 6;
          }
          var $ = q >>> T - 8 & 255;
          return T -= 8, $;
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
        return N;
      }, z = function(I, D) {
        var L = I, q = D, T = new Array(I * D), N = {};
        N.setPixel = function(C, R, F) {
          T[R * L + C] = F;
        }, N.write = function(C) {
          C.writeString("GIF87a"), C.writeShort(L), C.writeShort(q), C.writeByte(128), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(255), C.writeByte(255), C.writeByte(255), C.writeString(","), C.writeShort(0), C.writeShort(0), C.writeShort(L), C.writeShort(q), C.writeByte(0);
          var R = 2, F = g(R);
          C.writeByte(R);
          for (var G = 0; F.length - G > 255; )
            C.writeByte(255), C.writeBytes(F, G, 255), G += 255;
          C.writeByte(F.length - G), C.writeBytes(F, G, F.length - G), C.writeByte(0), C.writeString(";");
        };
        var w = function(C) {
          var R = C, F = 0, G = 0, K = {};
          return K.write = function(he, ce) {
            if (he >>> ce)
              throw "length over";
            for (; F + ce >= 8; )
              R.writeByte(255 & (he << F | G)), ce -= 8 - F, he >>>= 8 - F, G = 0, F = 0;
            G = he << F | G, F = F + ce;
          }, K.flush = function() {
            F > 0 && R.writeByte(G);
          }, K;
        }, g = function(C) {
          for (var R = 1 << C, F = (1 << C) + 1, G = C + 1, K = $(), he = 0; he < R; he += 1)
            K.add(String.fromCharCode(he));
          K.add(String.fromCharCode(R)), K.add(String.fromCharCode(F));
          var ce = x(), be = w(ce);
          be.write(R, G);
          var Ie = 0, oe = String.fromCharCode(T[Ie]);
          for (Ie += 1; Ie < T.length; ) {
            var te = String.fromCharCode(T[Ie]);
            Ie += 1, K.contains(oe + te) ? oe = oe + te : (be.write(K.indexOf(oe), G), K.size() < 4095 && (K.size() == 1 << G && (G += 1), K.add(oe + te)), oe = te);
          }
          return be.write(K.indexOf(oe), G), be.write(F, G), be.flush(), ce.toByteArray();
        }, $ = function() {
          var C = {}, R = 0, F = {};
          return F.add = function(G) {
            if (F.contains(G))
              throw "dup key:" + G;
            C[G] = R, R += 1;
          }, F.size = function() {
            return R;
          }, F.indexOf = function(G) {
            return C[G];
          }, F.contains = function(G) {
            return typeof C[G] < "u";
          }, F;
        };
        return N;
      }, H = function(I, D, L) {
        for (var q = z(I, D), T = 0; T < D; T += 1)
          for (var N = 0; N < I; N += 1)
            q.setPixel(N, T, L(N, T));
        var w = x();
        q.write(w);
        for (var g = S(), $ = w.toByteArray(), C = 0; C < $.length; C += 1)
          g.writeByte($[C]);
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
var JS = XS();
const ZS = /* @__PURE__ */ QS(JS), e6 = ["width", "height", "viewBox"], t6 = ["width", "height"], n6 = ["d"], a6 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = M(() => {
      const a = ZS(0, "M");
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
      }, null, 8, t6),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, n6)
    ], 8, e6));
  }
}, zC = /* @__PURE__ */ U(a6, [["__scopeId", "data-v-489f0852"]]), s6 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ve({ padding: e.padding })
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, UC = /* @__PURE__ */ U(s6, [["__scopeId", "data-v-47e67f04"]]);
function GC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const VC = cu(() => import("./VoiceFigure-BpFGbGZY.js").then((e) => e.V)), KC = "1.2.0", YC = "3.5";
export {
  Zf as $,
  Ee as A,
  Be as B,
  $a as C,
  ct as D,
  Q_ as E,
  l4 as F,
  jM as G,
  G_ as H,
  j5 as I,
  h4 as J,
  Tt as K,
  r6 as L,
  vo as M,
  b4 as N,
  f4 as O,
  wa as P,
  f_ as Q,
  bM as R,
  Xn as S,
  v_ as T,
  dM as U,
  Te as V,
  ra as W,
  cM as X,
  uM as Y,
  Jf as Z,
  U as _,
  tM as a,
  R_ as a$,
  v4 as a0,
  kM as a1,
  wM as a2,
  Le as a3,
  IM as a4,
  TM as a5,
  At as a6,
  $M as a7,
  zM as a8,
  z6 as a9,
  __ as aA,
  u_ as aB,
  E5 as aC,
  KM as aD,
  YM as aE,
  X_ as aF,
  Lr as aG,
  g_ as aH,
  Cn as aI,
  Q6 as aJ,
  V6 as aK,
  j_ as aL,
  An as aM,
  z_ as aN,
  PM as aO,
  c_ as aP,
  d_ as aQ,
  r_ as aR,
  gn as aS,
  Mt as aT,
  U6 as aU,
  b$ as aV,
  l_ as aW,
  vM as aX,
  Br as aY,
  zt as aZ,
  Qt as a_,
  L_ as aa,
  W_ as ab,
  Z6 as ac,
  fM as ad,
  hM as ae,
  EM as af,
  OM as ag,
  BM as ah,
  oM as ai,
  Al as aj,
  xM as ak,
  HM as al,
  tC as am,
  n_ as an,
  e_ as ao,
  ZM as ap,
  RM as aq,
  CM as ar,
  _M as as,
  AM as at,
  p_ as au,
  WM as av,
  UM as aw,
  sC as ax,
  an as ay,
  GM as az,
  O4 as b,
  aC as b$,
  n4 as b0,
  H_ as b1,
  k_ as b2,
  b_ as b3,
  H$ as b4,
  kr as b5,
  T_ as b6,
  FM as b7,
  Ma as b8,
  mt as b9,
  $_ as bA,
  A_ as bB,
  vt as bC,
  y_ as bD,
  E_ as bE,
  VM as bF,
  a_ as bG,
  QM as bH,
  qe as bI,
  DM as bJ,
  O_ as bK,
  fC as bL,
  hC as bM,
  W6 as bN,
  $$ as bO,
  NM as bP,
  x_ as bQ,
  nM as bR,
  eC as bS,
  w_ as bT,
  S_ as bU,
  M_ as bV,
  LM as bW,
  O5 as bX,
  qM as bY,
  JM as bZ,
  Z_ as b_,
  C_ as ba,
  Qa as bb,
  Ni as bc,
  lC as bd,
  uC as be,
  m_ as bf,
  P_ as bg,
  H6 as bh,
  t_ as bi,
  iC as bj,
  SM as bk,
  MM as bl,
  iM as bm,
  yM as bn,
  Y6 as bo,
  q_ as bp,
  aM as bq,
  sM as br,
  rM as bs,
  o_ as bt,
  m$ as bu,
  U_ as bv,
  d4 as bw,
  lM as bx,
  X6 as by,
  s_ as bz,
  W$ as c,
  la as c$,
  K6 as c0,
  G6 as c1,
  XM as c2,
  cC as c3,
  $o as c4,
  dC as c5,
  Qr as c6,
  D_ as c7,
  pM as c8,
  mM as c9,
  uo as cA,
  mC as cB,
  l6 as cC,
  Yt as cD,
  lf as cE,
  FC as cF,
  gp as cG,
  si as cH,
  le as cI,
  pi as cJ,
  AC as cK,
  y6 as cL,
  KC as cM,
  YC as cN,
  T6 as cO,
  TC as cP,
  Cs as cQ,
  q6 as cR,
  m2 as cS,
  Ue as cT,
  _t as cU,
  ga as cV,
  _6 as cW,
  I6 as cX,
  p6 as cY,
  Ac as cZ,
  Kw as c_,
  y$ as ca,
  J6 as cb,
  u4 as cc,
  i_ as cd,
  mo as ce,
  S5 as cf,
  h_ as cg,
  sn as ch,
  Pt as ci,
  Dt as cj,
  x6 as ck,
  M6 as cl,
  fn as cm,
  CC as cn,
  ge as co,
  Lf as cp,
  Js as cq,
  va as cr,
  gy as cs,
  ya as ct,
  PC as cu,
  F6 as cv,
  S6 as cw,
  by as cx,
  Us as cy,
  un as cz,
  Ye as d,
  d6 as d$,
  DC as d0,
  k6 as d1,
  w6 as d2,
  $6 as d3,
  A6 as d4,
  jC as d5,
  zC as d6,
  Yi as d7,
  ad as d8,
  MC as d9,
  UC as dA,
  lo as dB,
  kC as dC,
  js as dD,
  kp as dE,
  so as dF,
  b6 as dG,
  Wi as dH,
  Sn as dI,
  Td as dJ,
  NC as dK,
  LC as dL,
  Gs as dM,
  Od as dN,
  Hs as dO,
  Xo as dP,
  qC as dQ,
  j6 as dR,
  ni as dS,
  vc as dT,
  yc as dU,
  Ew as dV,
  D6 as dW,
  N6 as dX,
  vC as dY,
  Mm as dZ,
  pC as d_,
  N0 as da,
  h6 as db,
  P6 as dc,
  Sx as dd,
  Ft as de,
  B6 as df,
  Qe as dg,
  bt as dh,
  Cv as di,
  dd as dj,
  tp as dk,
  L6 as dl,
  m6 as dm,
  Vt as dn,
  OC as dp,
  EC as dq,
  mS as dr,
  WC as ds,
  HC as dt,
  ka as du,
  uf as dv,
  lt as dw,
  R6 as dx,
  tt as dy,
  VC as dz,
  gM as e,
  BC as e0,
  i2 as e1,
  G4 as e2,
  or as e3,
  g6 as e4,
  O6 as e5,
  bC as e6,
  wC as e7,
  je as e8,
  $p as e9,
  Bx as eA,
  Fs as eB,
  $C as eC,
  ds as eD,
  xC as eE,
  SC as eF,
  at as eG,
  RC as eH,
  Wt as eI,
  C6 as ea,
  Oc as eb,
  gC as ec,
  rr as ed,
  yC as ee,
  Gl as ef,
  E6 as eg,
  Ap as eh,
  f6 as ei,
  Cp as ej,
  Na as ek,
  c6 as el,
  cn as em,
  ci as en,
  Id as eo,
  v6 as ep,
  gt as eq,
  GC as er,
  V4 as es,
  i6 as et,
  u6 as eu,
  _C as ev,
  Ui as ew,
  IC as ex,
  ur as ey,
  li as ez,
  h$ as f,
  oC as g,
  vn as h,
  V_ as i,
  rC as j,
  K_ as k,
  N_ as l,
  L4 as m,
  yo as n,
  F_ as o,
  eM as p,
  Y_ as q,
  Kr as r,
  Yr as s,
  Ce as t,
  U$ as u,
  I_ as v,
  nC as w,
  B_ as x,
  On as y,
  J_ as z
};
