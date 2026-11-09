import { openBlock as r, createElementBlock as d, normalizeStyle as ge, unref as R, renderSlot as re, createElementVNode as m, normalizeClass as Y, Fragment as P, renderList as ne, defineComponent as Zr, Comment as eu, h as ha, cloneVNode as tu, createBlock as F, withCtx as D, createVNode as A, toDisplayString as v, createCommentVNode as b, ref as E, inject as Se, watch as me, onMounted as Me, onBeforeUnmount as nt, reactive as zt, shallowRef as Ze, onUnmounted as Re, useAttrs as ma, computed as _, resolveDynamicComponent as Ke, mergeProps as De, useId as qs, resolveDirective as nu, withDirectives as et, createTextVNode as K, Teleport as bn, nextTick as Fe, Transition as Ut, withModifiers as xe, createApp as au, shallowReactive as su, withKeys as _t, createSlots as Pl, onScopeDispose as pa, useModel as ln, mergeModels as jt, toRef as Ca, vModelText as Zn, resolveComponent as ou, provide as Ds, onErrorCaptured as lu, TransitionGroup as Ps, isRef as So, getCurrentInstance as iu, getCurrentScope as jl, normalizeProps as cs, guardReactiveProps as Fl, vShow as Wl, useSlots as ru, defineAsyncComponent as uu } from "vue";
function Hl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, cu = 1600, du = {
  __name: "Shimmer",
  setup(e) {
    const t = Hl(cu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ge(R(t))
    }, null, 4));
  }
}, en = /* @__PURE__ */ U(du, [["__scopeId", "data-v-6c018b03"]]), fu = { class: "skeleton-line" }, hu = 2e3, mu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Hl(hu);
    return (n, a) => (r(), d("span", fu, [
      re(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(P, null, ne(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ge({ ...R(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, bt = /* @__PURE__ */ U(mu, [["__scopeId", "data-v-484fe8a0"]]), Gt = Zr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== eu);
      return a.length !== 1 ? ha(P, { key: n }, a) : a[0].key == null ? tu(a[0], { key: n }) : a[0];
    };
  }
}), pu = ["aria-label"], gu = ["aria-label"], vu = ["aria-label"], yu = ["aria-label"], bu = ["aria-label"], ku = ["aria-label"], wu = ["aria-label"], $u = {
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
      messages: D(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(P, null, ne(t, (f) => A(en, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, pu)
      ]),
      older: D(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(t.slice(0, 3), (f) => (r(), F(en, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, gu)
      ]),
      cards: D(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(P, null, ne(n, (h) => A(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, vu)
      ]),
      file: D(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            A(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(P, null, ne(s, (h) => A(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, yu)
      ]),
      page: D(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(bt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(P, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            bars: R(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, bu)
      ]),
      text: D(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            bars: R(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, ku)
      ]),
      default: D(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(P, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, wu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Qe = /* @__PURE__ */ U($u, [["__scopeId", "data-v-ef519c5f"]]), xu = {
  key: 1,
  class: "empty-state titled"
}, Su = { class: "empty-state-title" }, Mu = { class: "empty-state-text" }, _u = {
  key: 2,
  class: "empty-state"
}, Cu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), F(Qe, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", xu, [
      m("p", Su, v(e.title), 1),
      m("p", Mu, [
        re(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", _u, [
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, rn = /* @__PURE__ */ U(Cu, [["__scopeId", "data-v-b27e89b0"]]), Eu = { class: "fold-group" }, Au = ["aria-expanded"], Ou = { class: "fold-label" }, Tu = {
  key: 0,
  class: "fold-count"
}, Iu = {
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
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Ou, v(e.label), 1),
        e.count !== "" ? (r(), d("span", Tu, v(e.count), 1)) : b("", !0),
        m("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Au),
      e.open ? re(a.$slots, "default", {}, void 0, !0, 0) : b("", !0)
    ]));
  }
}, t6 = /* @__PURE__ */ U(Iu, [["__scopeId", "data-v-9ef1865c"]]), Bu = 150, Ru = () => Bu;
function js(e, t, n = Ru(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function zl(e, t, n) {
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
const Lu = 50, Mo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function n6(e) {
  const t = at().sources.find((n) => n.key === e);
  return t ? ds(t.read, t.events) : ds("", []);
}
function Ul(e, t, n, a, s = () => !1) {
  const o = E([]), l = E(null), i = E(""), u = E(!1), c = performance.now(), f = E(!1), h = E(""), p = E(null), y = /* @__PURE__ */ new Set();
  let k = null;
  function I(g) {
    return s() ? (y.add(g), k ?? (k = new Promise((S) => setTimeout(() => S(x()), Lu)))) : $(g);
  }
  async function x() {
    const g = new Set(y);
    y.clear(), k = null;
    const S = L, O = await t({ ids: [...g].join(","), limit: g.size });
    if (S !== L) return;
    if (!O.ok) return q();
    const N = new Map(O.value.rows.map((W) => [W.id, W]));
    o.value = o.value.flatMap((W) => g.has(W.id) ? N.has(W.id) ? [N.get(W.id)] : [] : [W]);
  }
  async function $(g) {
    const S = L, O = await t({ "before-id": g + 1, limit: 1 });
    if (S !== L) return;
    if (!O.ok) return q();
    const N = O.value.rows.find((W) => W.id === g);
    o.value = N ? o.value.map((W) => W.id === g ? N : W) : o.value.filter((W) => W.id !== g);
  }
  async function B(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((Q) => Q.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((Q) => Q.id === g.row_id)) return I(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return q();
    const O = Math.max(...o.value.map((Q) => Q.id)), N = L, W = await t({ "after-id": O });
    if (N !== L) return;
    if (!W.ok) return q();
    const V = new Set(o.value.map((Q) => Q.id));
    o.value = [...W.value.rows.filter((Q) => !V.has(Q.id)), ...o.value];
  }
  async function z() {
    if (!f.value || !o.value.length) return !1;
    const g = L, S = Math.min(...o.value.map((W) => W.id)), O = await t({ "before-id": S });
    if (g !== L) return !1;
    if (!O.ok || !O.value.rows.length) return f.value = !1;
    f.value = Mo(O.value, n());
    const N = new Set(o.value.map((W) => W.id));
    return o.value = [...o.value, ...O.value.rows.filter((W) => !N.has(W.id))], !0;
  }
  let L = 0;
  function w(g, S) {
    var W, V;
    const O = g.ok ? e.shared ? [g.value] : ((W = g.value) == null ? void 0 : W.rows) ?? [] : [];
    g.ok && (o.value = S(O)), l.value = g.ok ? g.value : null;
    const N = O.length ? Math.min(...O.map((Q) => Q.id)) : 0;
    g.ok && ((V = g.value) != null && V.rows) && !o.value.some((Q) => Q.id < N) && (f.value = !e.shared && Mo(g.value, n())), i.value = g.ok ? "" : g.error, js(c, () => u.value = !0);
  }
  async function H(g) {
    const S = ++L, O = await t({});
    S === L && w(O, g);
  }
  const j = (g) => {
    if (!a() || !g.length) return g;
    const S = Math.min(...g.map((N) => N.id)), O = Math.max(...g.map((N) => N.id));
    return [...o.value.filter((N) => N.id > O), ...g, ...o.value.filter((N) => N.id < S)];
  }, q = () => H(j), C = (g) => w(g, j), T = () => H((g) => g);
  async function M(g, S = null) {
    const O = await zl(S && { target: o, fields: { value: S(o.value) } }, g, e.run);
    return h.value = O.ok ? "" : O.error, p.value = O.ok ? O.value : null, await q(), O;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: q, loadLatest: T, older: z, act: M, actionFailure: h, answer: p, context: e, heard: B, showFirst: C, pageSize: n };
}
const Nu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ds(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = at(), l = Ul(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Nu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const qu = 2e3;
function Fs(e, t, n = qu) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Se(Le, null), u = () => {
    var I;
    return ((I = i == null ? void 0 : i.visible) == null ? void 0 : I.value) === !1;
  }, c = () => document.hidden || u(), f = async (I) => {
    o = !0;
    try {
      await I();
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
  }, k = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return y();
      await h(), p();
    }
  };
  me(() => {
    var I;
    return (I = i == null ? void 0 : i.visible) == null ? void 0 : I.value;
  }, k), Me(async () => {
    document.addEventListener("visibilitychange", k), u() || await y();
  }), nt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", k);
  });
}
const Gl = typeof document < "u" && document.documentElement.classList.contains("phone"), Vl = 120;
var ql;
const Ea = globalThis[ql = Symbol.for("journal.pressed")] ?? (globalThis[ql] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Du(e = 0) {
  const t = Ea.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Ea.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Ea.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function fs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Kl(e = window) {
  if (!fs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    fs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const hs = "journal.stale-build-reload", Pu = 'script[type="module"][src*="/assets/index-"]', _o = (e) => {
  var t;
  return ((t = e.querySelector(Pu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function ju(e = document, t = (a, s) => Ee.quietRead(a, s), n = () => Kl(window)) {
  const a = _o(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = _o(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Aa = "";
function Fu(e, t = () => Kl(window)) {
  if (!e) return !1;
  const n = !!Aa && Aa !== e;
  return Aa = e, n && t(), n;
}
const Wu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Hu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(hs) === e.message) return !1;
    t.setItem(hs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function zu(e = window.sessionStorage) {
  try {
    e.removeItem(hs);
  } catch {
    return;
  }
}
const Uu = 2e3, Gu = 3e4, Ve = zt({ starting: !1, external: !1, late: !1, offline: !1 }), Ws = () => Ve.starting, Vu = 3;
let Tn = 0, ms = 0, Yl = 0, Ql = [];
async function Ku() {
  try {
    const e = await Ee.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ve.external };
  }
}
let Co = null;
const Yu = () => Co ?? (Co = Ku().finally(() => Co = null));
function Qu() {
  clearTimeout(ms), clearTimeout(Yl), ms = 0, Object.assign(Ve, { starting: !1, external: !1, late: !1, offline: !1 }), Ql.splice(0).forEach((e) => e()), ju();
}
async function Xu() {
  Ve.offline = !navigator.onLine;
  const e = await Yu();
  if (Ve.external = e.updating, Tn = !e.restarting && !e.updating && e.reachable ? Tn + 1 : 0, Tn < Vu) return;
  Tn = 0, (!Fu(e.started_at) || fs()) && Qu();
}
function Xl() {
  ms = setTimeout(async () => {
    await Xu(), Ve.starting && Xl();
  }, Uu);
}
function Ju() {
  Ve.starting || (Ve.starting = !0, Ve.offline = !navigator.onLine, Xl(), Yl = setTimeout(() => Ve.late = !0, Gu));
}
const Jl = () => Ve.starting ? new Promise((e) => Ql.push(e)) : Promise.resolve();
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
function Zu(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class ec {
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Zu(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const dt = "viewer.shell", In = 2e4, tc = 4, Eo = "/api/read-lines", nc = 5e3, ac = 403, Ao = "/api/repeated-lines", sc = 10, oc = 2e3, lc = 3e5, a6 = 6e5, Bn = 6, ic = 500, rc = "/journal/summary", Oo = "/api/server-state", uc = 2e4, Rn = Gl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, cc = (e) => e.split("?")[0].endsWith(rc), ps = (e, t) => Object.assign(new Error(t), { status: e });
async function dc(e, t, n = ps) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const fc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), hc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), To = (e) => e.split(" ").slice(0, 2).join(" "), ot = "read", Bt = "write", mc = "stream";
class pc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Bn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = To(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < oc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < sc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Ao, { method: "POST", headers: { ...Rn, "Content-Type": "application/json" }, body: i }, [{ window: dt, line: Ao, kind: Bt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Du(n ? Vl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: hc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Bt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = In) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Ju(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= tc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Eo, { headers: Rn }, [{ window: dt, line: Eo, kind: ot }], nc).then(async (t) => {
      if (t.status === ac) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ps(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new ec(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = To(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Bn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Rn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: fc(a) }, c = s || (i ? lc : In);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: dt, line: n, kind: ot }], c)) : await this.sent(n, u, [{ window: dt, line: n, kind: Bt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((h) => setTimeout(h, ic)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Bn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return dc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: dt, line: t, kind: ot }], In)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Rn });
    if (!n.ok) throw ps(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Bn, o).then((i) => (this.written(n), i)) : Ws() && !cc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: dt, line: t, kind: mc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Oo, { cache: "no-store" }, [{ window: dt, line: Oo, kind: ot }], uc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = dt, line: s = t, limit: o = In } = {}) {
    const l = (n.method ?? "GET") === "GET" ? ot : Bt;
    return l === Bt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Oa = Symbol.for("journal.transport"), Ee = globalThis[Oa] ?? (globalThis[Oa] = new pc());
class Zl {
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
    Ee.readsOutdated();
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
const gc = 50, vc = "refresh", yc = 1e3, bc = 3e4, kc = "requested", wc = "after_window", $c = 50, Ln = ".*", xc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Sc(e) {
  const t = {}, n = zt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, h = !1;
  function p(C) {
    const T = () => u[C] ?? u[`${C.slice(0, C.lastIndexOf("."))}.*`] ?? {}, M = E(void 0), g = Ul(e, async (S) => {
      const O = await I(C, S);
      return O.ok && !Object.keys(S).length && (M.value = O.value), O;
    }, () => T().page_size || $c, () => !!T().page_size, () => !!T().reads_ids);
    return t[C] = { ...g, data: M, readAt: 0 };
  }
  const y = new Proxy({}, { get: (C, T) => typeof T != "string" || T.startsWith("__v") ? void 0 : t[T] ?? p(T) }), k = (C) => (u[C].loading !== kc || C.endsWith(Ln)) && (!u[C].tab || u[C].tab === n.tab);
  function I(C, T = {}) {
    return new Promise((M) => {
      a.push({ name: C, flags: T, resolve: M }), a.length === 1 && setTimeout(x);
    });
  }
  async function x() {
    const C = /* @__PURE__ */ new Map(), T = a.splice(0).filter((S) => {
      const O = JSON.stringify(S.flags);
      return C.has(S.name) || C.set(S.name, O), C.get(S.name) === O ? !0 : (a.push(S), !1);
    });
    a.length && setTimeout(x);
    const M = Object.fromEntries(T.flatMap(({ name: S, flags: O }) => Object.entries(O).map(([N, W]) => [`${S}.${N}`, W]))), g = await e.readKeys({ only: [...new Set(T.map(({ name: S }) => S))], state: { ...n, ...M } });
    T.forEach(({ name: S, resolve: O }) => O(g.ok ? g.value.keys[S] : g));
  }
  async function $(C) {
    var S;
    const T = ++f;
    (C.length ? C : Object.keys(u).filter((O) => !O.endsWith(Ln) && u[O].loading === "first" && k(O))).forEach((O) => l[O] = T);
    const g = await e.readKeys({ only: C, state: { ...n } });
    if (!g.ok) {
      if (g.failure === "cancelled") return !1;
      const O = (C.length ? C : Object.keys(t)).filter((W) => (l[W] ?? 0) <= T);
      O.forEach((W) => {
        y[W].readAt = Date.now(), g.failure === "unreachable" ? i.add(W) : i.delete(W), y[W].showFirst(g);
      });
      const N = g.failure === "unreachable" && ((S = e.waitForServer) == null ? void 0 : S.call(e));
      return N && N.then(() => {
        if (h) return;
        const W = O.filter((V) => l[V] === T);
        (W.length || !C.length && !O.length && f === T) && $(W);
      }), !1;
    }
    return j(g.value.declared), Object.entries(g.value.keys).forEach(([O, N]) => {
      (l[O] ?? 0) > T || (l[O] = T, y[O].readAt = Date.now(), i.delete(O), N.ok && (y[O].data.value = N.value), y[O].showFirst(N));
    }), !0;
  }
  function B(C) {
    const T = xc(C);
    return T.length ? (T.forEach((M) => o.names.add(M)), o.answer ?? (o.answer = new Promise((M) => setTimeout(() => {
      const g = [...o.names];
      o.names.clear(), o.answer = null, M($(g));
    })))) : $([]);
  }
  function z(C) {
    C.forEach((T) => s.add(T)), clearTimeout(c), c = setTimeout(() => {
      const T = [...s];
      s.clear(), T.length && B(T);
    }, gc);
  }
  const L = (C) => C.endsWith(Ln) ? Object.keys(t).filter((T) => T.startsWith(C.slice(0, -1)) && t[T].readAt) : [C], w = (C) => (u[C] ?? u[`${C.split(".")[0]}.*`]).reload_seconds;
  function H(C) {
    const T = Object.keys(u).filter((g) => C.event === vc || u[g].events.some((S) => zs(S, C.event)));
    T.filter((g) => u[g].page_size).forEach((g) => y[g].heard(C));
    const M = T.filter((g) => !u[g].page_size);
    M.filter((g) => !k(g)).forEach((g) => y[g].readAt = 0), z(M.filter(k).flatMap(L));
  }
  function j(C) {
    if (Object.keys(u).length) return;
    u = C;
    const T = [...new Set(Object.values(C).flatMap((g) => g.events))];
    T.length && e.follow(T, H);
    const M = Object.keys(C).filter((g) => C[g].loading === wc);
    M.length && $(M);
  }
  me(() => n.tab, () => {
    const C = Object.keys(u).filter((T) => !T.endsWith(Ln) && k(T) && !y[T].readAt);
    C.length && $(C);
  }), Re(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const C = Date.now(), T = Object.keys(u).filter((M) => u[M].reload_seconds > 0 && k(M)).flatMap(L).filter((M) => C - y[M].readAt >= (i.has(M) ? Math.min(w(M) * 1e3, bc) : w(M) * 1e3));
    T.length && z(T);
  }
  return Fs(q, () => e.visible.value, yc), queueMicrotask(() => $([])), { props: y, state: n, reload: B, readKey: I };
}
const Mc = Symbol("open-view"), Le = Symbol.for("journal.window-context"), ei = Symbol("dock-card"), ti = Symbol.for("journal.inspector-actions");
function _c(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Sc(e));
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
  return _c(e);
}
const Cc = (e, t) => e(ei, t), s6 = () => Se(ei), gs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Io = {
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
}, Ec = ["data-icon", "stroke-width", "innerHTML"], le = {
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
      style: ge({
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
    }, null, 12, Ec));
  }
}, Ac = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Oc = /* @__PURE__ */ U(Ac, [["__scopeId", "data-v-eb453d6f"]]), Tc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ma(), a = _(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = E(!1), o = _(() => t.busy || s.value), l = Se(Le, null), i = _(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const h = setTimeout(() => s.value = !0, Vl);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, f) => (r(), F(Ke(e.href ? "a" : "button"), De(a.value, {
      type: e.href ? void 0 : R(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: D(() => [
        m("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), F(le, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : b("", !0),
          re(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), F(Oc, {
          key: 0,
          class: "btn-spinner"
        })) : b("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ U(Tc, [["__scopeId", "data-v-ededdadf"]]), Ic = ["aria-checked", "aria-haspopup", "onClick"], Bc = {
  key: 0,
  class: "segmented-dot"
}, Rc = {
  key: 1,
  class: "segmented-note"
}, Lc = {
  key: 2,
  class: "segmented-count"
}, Nc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = qs();
    return (s, o) => {
      const l = nu("tip");
      return r(), d("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(P, null, ne(e.options, (i) => et((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", Bc)) : b("", !0),
          K(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", Rc, v(i.note), 1)) : b("", !0),
          i.count !== void 0 ? (r(), d("em", Lc, v(i.count), 1)) : b("", !0)
        ], 10, Ic)), [
          [l, i.tip || i.title, `${R(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Ft = /* @__PURE__ */ U(Nc, [["__scopeId", "data-v-c89bc92d"]]), qc = {
  key: 0,
  class: "more-items"
}, Dc = {
  key: 0,
  role: "alert"
}, Pc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", qc, [
      e.failure ? (r(), d("p", Dc, v(e.failure), 1)) : b("", !0),
      e.more ? (r(), F(pe, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: D(() => [
          K(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : b("", !0)
    ])) : b("", !0);
  }
}, kn = /* @__PURE__ */ U(Pc, [["__scopeId", "data-v-10464014"]]), jc = { class: "link-group" }, Fc = {
  class: "group-label",
  "data-link-kind": ""
}, Wc = ["disabled", "onClick"], Hc = { class: "title" }, zc = { class: "relations" }, Uc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = _(() => s.value ? n.rows : n.rows.slice(0, 3)), l = _(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (f, h) => (r(), d("div", jc, [
      m("div", Fc, v(l.value), 1),
      (r(!0), d(P, null, ne(o.value, (p) => (r(), d("button", De({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", Hc, v(p.endpoint.title), 1),
        m("span", zc, [
          K(v(c(p)), 1),
          i(p) ? (r(), d(P, { key: 0 }, [
            K(" · Unavailable")
          ], 64)) : b("", !0)
        ])
      ], 16, Wc))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : b("", !0)
    ]));
  }
}, Gc = /* @__PURE__ */ U(Uc, [["__scopeId", "data-v-be6f079c"]]), Vc = ["data-loaded"], Kc = { class: "rows" }, Yc = ["disabled", "onClick"], Qc = { class: "title" }, Xc = { class: "relations" }, Jc = { key: 2 }, Zc = {
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
    const n = e, a = t, s = E([]), o = E({}), l = E(0), i = E(""), u = E(null), c = E(!1), f = E("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (C) => C.toUpperCase())}s`, k = _(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, C) => q + C, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, C]) => ({ key: q, label: y(q), count: C }))
    ]), I = _(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((T) => T.endpoint.model))].map((T) => [T, s.value.filter((M) => M.endpoint.model === T).length])), C = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([T], [M]) => (C[T] ?? 3) - (C[M] ?? 3)).map(([T, M]) => ({ model: T, count: M, rows: s.value.filter((g) => g.endpoint.model === T) }));
    }), x = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, $ = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), B = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (C) => C.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((C) => C.replaceAll("_", " ")).join(", ")}`;
    async function z(q = 1) {
      const C = ++h;
      c.value = !0, f.value = "";
      const T = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && T.push("--outside-plan"), n.documentId && T.push("--first-counterpart", `doc:${n.documentId}`), i.value && T.push("--kind", i.value);
      try {
        const M = await n.read(T);
        if (C !== h) return;
        if (!M.ok) {
          f.value = M.error;
          return;
        }
        const g = M.value.counterparts ?? [], S = q === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(S.map((O) => [`${O.endpoint.model}:${O.endpoint.id}`, O])).values()], o.value = M.value.categories ?? {}, l.value = M.value.total, u.value = M.value.next_page ?? null;
      } catch (M) {
        C === h && (f.value = M.message);
      } finally {
        C === h && (c.value = !1);
      }
    }
    function L(q) {
      if (x(q)) return;
      const [C, T] = q.endpoint.open_ref.split(":");
      a("open", { table: C, id: Number(T) });
    }
    function w(q) {
      i.value = q, z();
    }
    const H = () => !c.value && u.value && z(u.value), j = _(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return me(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", z();
    }, { immediate: !0 }), (q, C) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      k.value.length > 2 ? (r(), F(Ft, {
        key: 0,
        options: k.value,
        value: i.value,
        wrap: "",
        onPick: w
      }, null, 8, ["options", "value"])) : b("", !0),
      m("div", Kc, [
        e.grouped ? (r(!0), d(P, { key: 0 }, ne(I.value, (T) => (r(), F(Gc, {
          key: T.model,
          model: T.model,
          count: T.count,
          rows: T.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: L
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(P, { key: 1 }, ne(s.value, (T) => (r(), d("button", De({
          key: `${T.endpoint.model}:${T.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, $(T), {
          disabled: x(T),
          onClick: (M) => L(T)
        }), [
          m("span", Qc, v(T.endpoint.title), 1),
          m("span", Xc, [
            K(v(B(T)), 1),
            x(T) ? (r(), d(P, { key: 0 }, [
              K(" · Unavailable")
            ], 64)) : b("", !0)
          ])
        ], 16, Yc))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Jc, v(e.empty), 1)) : b("", !0),
        A(kn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: j.value,
          onMore: H
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Vc)) : b("", !0);
  }
}, ed = /* @__PURE__ */ U(Zc, [["__scopeId", "data-v-3b23de37"]]), td = (e, t, n) => Math.max(t, Math.min(n, e)), nd = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, ni = /* @__PURE__ */ new WeakMap(), ad = (e, t) => ni.set(e, t);
function sd(e, t) {
  for (let n = t; n; n = ni.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function ai(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !sd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const Tt = 8, od = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = E(null), o = (g) => g ? `${g}px` : void 0, l = _(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = E({ w: 0, h: 0 }), u = E(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), h = (g) => {
      const S = g.closest(".pane, .float-window");
      return S ? f(S.getBoundingClientRect()) : c();
    }, p = (g, S) => `${Math.max(0, g ? Math.min(g, S) : S)}px`;
    function y(g, S) {
      return {
        below: g.bottom - S.bottom - a.gap - Tt,
        above: S.top - g.top - a.gap - Tt,
        across: g.right - g.left - 2 * Tt
      };
    }
    function k(g) {
      const S = h(a.anchor), O = y(S, g);
      return i.value.w <= O.across && i.value.h <= Math.max(O.below, O.above) ? S : c();
    }
    const I = _(() => {
      if (!u.value) return l.value;
      const g = u.value, S = k(g), O = y(S, g), { w: N, h: W } = i.value, V = a.align === "auto" ? g.left + g.right > S.left + S.right : a.align === "right", Q = td(V ? g.right - N : g.left, S.left + Tt, Math.max(S.left + Tt, S.right - N - Tt)), ve = W > O.below && O.above > O.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, O.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, O.below) };
      return { ...l.value, ...ve, left: `${Q}px`, maxWidth: p(a.maxWidth, O.across) };
    }), x = n, $ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function B(g) {
      const S = $(), O = S.indexOf(document.activeElement);
      S[(O + g + S.length) % S.length].focus();
    }
    const z = { ArrowDown: () => B(1), ArrowUp: () => B(-1), Escape: () => x("close") }, L = (g) => z[g.key] && (g.preventDefault(), z[g.key]()), w = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let H = 0;
    const j = new ResizeObserver(() => {
      cancelAnimationFrame(H), H = requestAnimationFrame(w);
    });
    ai(s, (g) => a.anchor && !a.anchor.contains(g.target) && x("close"));
    const q = (g, S) => ["top", "left", "right", "bottom"].some((O) => Math.abs(g[O] - S[O]) > 1), C = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let T = 0;
    function M() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || C(g)) return x("close");
        q(g, u.value) && (u.value = g);
      }
      T = requestAnimationFrame(M);
    }
    return Me(() => {
      a.anchor && s.value && ad(s.value, a.anchor), w(), s.value && j.observe(s.value), !a.plain && $()[0] && $()[0].focus(), M();
    }), Re(() => {
      j.disconnect(), cancelAnimationFrame(T), cancelAnimationFrame(H);
    }), t({ element: s }), (g, S) => (r(), F(bn, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", De({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: I.value,
        onKeydown: L
      }), [
        re(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ga = /* @__PURE__ */ U(od, [["__scopeId", "data-v-3d203970"]]), ld = { class: "split-button" }, id = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = E(null), s = E(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", ld, [
      A(pe, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: D(() => [
          re(l.$slots, "default", {}, void 0, !0)
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
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: D(() => [
            A(le, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), F(ga, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: D(() => [
          re(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : b("", !0)
    ]));
  }
}, rd = /* @__PURE__ */ U(id, [["__scopeId", "data-v-c258494d"]]), ud = 0, cd = "/api/lines", dd = "/api/line", Bo = 5e3, Ro = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Lo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ta = (e) => JSON.stringify(e.line), No = () => new DOMException("cancelled", "AbortError");
class fd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ta(t))) {
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
    this.timer ?? (this.timer = setTimeout(() => Ee.whenFree(() => this.send()), ud));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(No())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(No()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ee.sent(cd, Ro({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Lo(i.body, ot)), Bo);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ee.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, ot), Date.now() - n < Bo ? this.slow.delete(Ta(t.body)) : this.slow.add(Ta(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ee.sent(dd, Ro(t.body, t.signal), [Lo(t.body, n)], n === ot ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const si = new fd(), hd = "/api/window";
function md(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${hd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ee.whenFree(async () => {
    const f = await Ee.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: ot }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ee.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const oi = /* @__PURE__ */ new Map();
class pd {
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
function o6(e, t) {
  const n = new pd(e, t);
  return oi.set(e, n), n.load().catch(() => {
  }), n;
}
const Us = (e) => oi.get(e);
function gd(e, t, n) {
  const a = Us(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function vd(e, t) {
  if (!e) return !0;
  const n = Us(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const ea = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let li = {};
async function l6(e = (t) => Ee.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (li = (await t.json()).states);
}
const Gs = (e, t) => {
  var n;
  return (n = li[e]) == null ? void 0 : n[t];
}, un = (e, t) => {
  var n;
  return ((n = Gs(e, t)) == null ? void 0 : n.label) ?? ea(t);
}, ii = (e, t) => {
  var n;
  return ((n = Gs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, yd = (e, t) => {
  var n;
  return ((n = Gs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, bd = Symbol("pane-page"), Vs = Symbol("inspector-host"), ri = { 1: "refused", 2: "usage", 3: "fault" }, kd = 100, wd = 50, $d = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, xd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Sd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = E({}), declared: c = [], page: f = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: k = [], links: I = {}, search: x = {}, readOnly: $ = !1, shared: B = null }) {
  const z = /* @__PURE__ */ new Map(), L = (V, Q) => l.follow(e, V, (he) => {
    z.clear(), Q(he);
  }, a), w = new AbortController(), H = E(!1), j = performance.now();
  let q = 0, C = 0, T = () => {
  };
  const M = new Promise((V) => T = V);
  w.signal.addEventListener("abort", T, { once: !0 });
  const g = () => {
    clearTimeout(C), C = setTimeout(() => {
      q === 0 && js(j, () => {
        H.value = !0, T();
      });
    }, wd);
  }, S = (V, Q) => (q += 1, Lt(e, V, t, w.signal, Q).finally(() => {
    q -= 1, g();
  })), O = (V, Q) => (g(), M.then(() => w.signal.aborted ? ut : Lt(e, V, t, w.signal, Q))), N = ({ only: V = [], state: Q = {} } = {}) => (q += 1, _d(() => md(e, t, V, Q, w.signal), w.signal).finally(() => {
    q -= 1, g();
  })), W = (V, { unbatched: Q = !1, deferred: he = !1 } = {}) => {
    const ve = z.get(V);
    if (ve && performance.now() - ve.at < kd) return ve.answer;
    const ye = he && !H.value ? O(V, Q) : S(V, Q);
    return z.set(V, { answer: ye, at: performance.now() }), ye;
  };
  return {
    answered: H,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: _(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: k,
    links: I,
    search: x,
    readOnly: $,
    shared: B,
    read: W,
    readKeys: N,
    waitForServer: () => Ws() ? Jl() : null,
    run: (V) => Lt(e, V, t, w.signal),
    upload: (V) => Ed(V, e, w.signal),
    cancel: () => w.abort(),
    signal: w.signal,
    subscriptions: l,
    follow: (V, Q) => L([V].flat().filter((he) => o.some((ve) => zs(ve, he))), Q),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: L,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (V) => _(() => {
      var Q;
      return u.value[V] ?? ((Q = c.find((he) => he.key === V)) == null ? void 0 : Q.default);
    }),
    setting: async (V, Q) => {
      const he = await W(`window setting ${e} ${V}`);
      return he.ok ? he.value.value : Q;
    },
    setOption: h,
    keep: (V, Q) => Lt(e, ["window", "save-setting", e, V, JSON.stringify(Q)], t, w.signal)
  };
}
function ui(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const ut = { ok: !1, failure: "cancelled", error: "" }, Ks = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ci(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ut : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: ri[n.code] || "fault", error: ui(n.error) };
  } catch {
    return t != null && t.aborted ? ut : { ok: !1, failure: "unreachable", error: Ks };
  }
}
const Md = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: ri[e.code] || "fault", error: ui(e.error) };
async function _d(e, t) {
  try {
    const n = await e();
    return t.aborted ? ut : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Md(s)])) } };
  } catch {
    return t.aborted ? ut : { ok: !1, failure: "unreachable", error: Ks };
  }
}
async function di(e, t, n) {
  const a = await ci(() => si.read(e, t, n), t);
  return a.failure !== "unreachable" || !Ws() ? a : (await Jl(), t.aborted ? ut : di(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Ee.held(() => Cd(e, t, n, a, s), Ee.knownRead(Array.isArray(t) ? t : Ys(t)));
}
async function Cd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Ys(t), environment: n };
  return await Ee.isRead(o.line) ? Ee.joined(JSON.stringify(o), (l, i) => di({ ...o, attribution: i }, l, s), a, o).catch(() => ut) : ci(() => si.write({ ...o, attribution: {
    client_id: Ee.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Ed(e, t, n = void 0) {
  try {
    const a = await Ee.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ut : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ut : { ok: !1, failure: "unreachable", error: Ks };
  }
}
function Ys(e) {
  return [...e.matchAll($d)].map(([t]) => t.replace(xd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Ad = (e) => `show-${e}`, i6 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Ad((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), fi = "messages.chat", Od = {
  key: 0,
  class: "template-brief"
}, Td = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Id = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E([]), o = E(""), l = _(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = _(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Lt(fi, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === f);
      h && a("pick", String(h.id));
    }
    return u(), (c, f) => (r(), d(P, null, [
      A(Ft, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", Od, v(i.value.brief), 1)) : b("", !0),
      o.value ? (r(), d("p", Td, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, Bd = /* @__PURE__ */ U(Id, [["__scopeId", "data-v-14be8a5c"]]), Rd = { class: "info-tip" }, Ld = ["aria-label"], Nd = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, qd = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Rd, [
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
      ], 8, Ld),
      m("span", Nd, [
        (r(!0), d(P, null, ne(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, hi = /* @__PURE__ */ U(qd, [["__scopeId", "data-v-a2fe5ff1"]]), Dd = { class: "form-field" }, Pd = { class: "form-field-head" }, jd = ["for"], Fd = {
  key: 1,
  class: "form-field-aside"
}, Wd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Dd, [
      m("div", Pd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, jd),
        e.help ? (r(), F(hi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : b("", !0),
        t.$slots.aside ? (r(), d("span", Fd, [
          re(t.$slots, "aside", {}, void 0, !0)
        ])) : b("", !0)
      ]),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Hd = /* @__PURE__ */ U(Wd, [["__scopeId", "data-v-302c40bf"]]), vs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, zd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ma(), n = _(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => et((r(), d("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [R(vs), R(t).value]
    ]);
  }
}), Ud = /* @__PURE__ */ U(zd, [["__scopeId", "data-v-e130a5b9"]]), Gd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = qs(), o = _(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (r(), F(Hd, {
      label: e.field.label,
      for: R(s),
      "data-button-field": e.field.name
    }, {
      default: D(() => [
        A(Gt, { value: o.value }, {
          choice: D(() => [
            A(Ft, {
              id: R(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            A(Bd, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            A(Ud, {
              id: R(s),
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
}, va = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), F(pe, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: D(() => [
        A(le, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Vd(e, t, n, a = () => window) {
  Me(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Kd = (e, t = () => !0) => Vd("keydown", (n) => n.key === "Escape" && t() && e());
function mi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = E(!1), s = _(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Kd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Yd = 80, It = zt([]);
function pi(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), _(() => Yd + Math.max(0, It.indexOf(t)));
}
let gi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return gi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Qd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Xd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Qd)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Me(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : gi, document.addEventListener("keydown", s), Fe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Jd = ["aria-modal", "aria-label", "aria-labelledby"], Zd = {
  key: 0,
  class: "dialog-head"
}, ef = ["id", "tabindex"], tf = {
  key: 1,
  class: "dialog-foot"
}, nf = 500, af = 400, sf = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = mi(a, n), i = pi(s), u = E(null), c = E(null), f = E(null), h = qs(), p = E(!1), y = Date.now();
    n.modal && Xd(c, () => a("escape"), f);
    function k() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, af);
    }
    function I(B) {
      !n.modal || Date.now() - y >= nf || ![" ", "Enter"].includes(B.key) || (B.preventDefault(), B.stopPropagation());
    }
    const x = () => u.value && (u.value.scrollTop = u.value.scrollHeight), $ = new MutationObserver(x);
    return me(u, (B) => {
      $.disconnect(), B && n.follow && ($.observe(B, { childList: !0, subtree: !0, characterData: !0 }), x());
    }), Re(() => $.disconnect()), (B, z) => (r(), F(bn, { to: "body" }, [
      A(Ut, {
        name: "dialog",
        appear: "",
        onAfterLeave: R(l)
      }, {
        default: D(() => [
          R(s) ? (r(), d("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: R(i) }),
            onClick: xe(k, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? R(h) : void 0,
              onKeydownCapture: I
            }, [
              e.bare ? b("", !0) : (r(), d("header", Zd, [
                m("h3", {
                  id: R(h),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, ef),
                e.closable ? (r(), F(va, {
                  key: 0,
                  onClick: R(o)
                }, null, 8, ["onClick"])) : b("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: u,
                class: Y(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                re(B.$slots, "default", {}, void 0, !0)
              ], 2),
              B.$slots.foot ? (r(), d("footer", tf, [
                re(B.$slots, "foot", {}, void 0, !0)
              ])) : b("", !0)
            ], 42, Jd)
          ], 6)) : b("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ya = /* @__PURE__ */ U(sf, [["__scopeId", "data-v-24a11f8a"]]), of = {
  class: "action-output",
  "data-action-output": ""
}, lf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(ya, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: D(() => [
        m("pre", of, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, rf = /* @__PURE__ */ U(lf, [["__scopeId", "data-v-b32f94a4"]]);
function uf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = au(rf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const cf = (e, t, n = {}) => Ys(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function wn(e, t, n, a = {}) {
  var s;
  try {
    if (!await vd(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(fi, cf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && uf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const df = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ia = [
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
}, ff = ["secrets", "plugins"], vi = Object.keys(ba).filter((e) => !(Gl && ff.includes(e)));
_(() => vi.map((e) => ({ name: e, ...ba[e] })));
const Vt = (e) => ba[e], yi = new Map(vi.flatMap((e) => [e, e.replace(/s$/, ""), ba[e].title.toLowerCase()].map((t) => [t, e]))), gt = (e) => yi.get(String(e).toLowerCase()) || "", bi = [...yi.keys()].sort((e, t) => t.length - e.length).join("|"), hf = {
  class: "button-form",
  "data-button-form": ""
}, mf = {
  key: 0,
  class: "button-form-title"
}, pf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, gf = { class: "button-form-actions" }, vf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = E(!1), l = E(""), i = _(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = _(() => {
      var h;
      if (!n.row) return n.button.label;
      const f = ((h = Vt(gt(n.row.term))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await wn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, h) => (r(), F(ya, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => a("close"))
    }, {
      default: D(() => {
        var p;
        return [
          m("div", hf, [
            (p = e.row) != null && p.title ? (r(), d("p", mf, v(e.row.title), 1)) : b("", !0),
            (r(!0), d(P, null, ne(e.button.fields, (y) => (r(), F(Gd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (k) => s.value[y.name] = k
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", pf, v(l.value), 1)) : b("", !0),
            m("div", gf, [
              A(pe, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: D(() => [...h[2] || (h[2] = [
                  K("Cancel", -1)
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
                default: D(() => [...h[3] || (h[3] = [
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
}, yf = /* @__PURE__ */ U(vf, [["__scopeId", "data-v-e3f0d786"]]), bf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, kf = {
  key: 1,
  class: "menu-item-text"
}, wf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", bf, v(e.checked ? "✓" : ""), 1)) : b("", !0),
      e.description ? (r(), d("span", kf, [
        m("span", null, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : re(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ue = /* @__PURE__ */ U(wf, [["__scopeId", "data-v-fec99974"]]), $f = ["aria-busy"], xf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Sf = { class: "button-slot-confirm-text" }, Mf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, _f = {
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
    const n = e, a = t, s = _(() => Us(n.environment)), o = _(
      () => {
        var $;
        return !n.readOnly && (($ = s.value) == null ? void 0 : $.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = _(() => {
      var $;
      return !n.readOnly && (($ = s.value) == null ? void 0 : $.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = _(() => n.readOnly ? [] : gd(n.environment, n.name, n.row)), c = E(null), f = E(null), h = E(""), p = E(!1), y = ($) => [$.from ? `From ${$.from}` : "", $.tip, $.warning].filter(Boolean).join(" · "), k = ($) => $.icon || ($.warning ? "dot" : "");
    function I($) {
      if (!(p.value || n.readOnly)) {
        if ($.fields.length) {
          c.value = $;
          return;
        }
        if ($.confirm) {
          f.value = $;
          return;
        }
        return x($);
      }
    }
    async function x($) {
      f.value = null, h.value = "", a("failure", ""), p.value = !0;
      const B = await wn($, n.row, n.environment);
      p.value = !1, h.value = B.ok ? "" : B.error;
      const z = $.label.toLowerCase() + (n.objectName && !$.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", B.ok ? "" : `Could not ${z}: ${B.error}`), B.ok && a("done");
    }
    return ($, B) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(P, { key: 0 }, [
        B[5] || (B[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(pe, {
          small: "",
          onClick: i
        }, {
          default: D(() => [...B[4] || (B[4] = [
            K("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", xf, [
        m("span", Sf, v(f.value.confirm), 1),
        A(pe, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Y({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: B[0] || (B[0] = (z) => x(f.value))
        }, {
          default: D(() => [
            K(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(pe, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: B[1] || (B[1] = (z) => f.value = null)
        }, {
          default: D(() => [...B[6] || (B[6] = [
            K("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? b("", !0) : (r(), d(P, { key: 2 }, [
        (r(!0), d(P, null, ne(u.value, (z) => (r(), d(P, {
          key: z.name
        }, [
          z.menu.length ? (r(), F(rd, {
            key: 0,
            small: "",
            variant: z.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": z.menu_label || "More ways",
            title: y(z),
            "data-button": z.name,
            onMain: (L) => I(z)
          }, {
            menu: D(({ close: L }) => [
              (r(!0), d(P, null, ne(z.menu, (w) => (r(), F(Ue, {
                key: w.label,
                description: w.description,
                onClick: (H) => (L(), I({ ...z, ...w, menu: [] }))
              }, {
                default: D(() => [
                  K(v(w.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
              K(v(z.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), F(pe, {
            key: 1,
            small: "",
            variant: z.primary ? "primary" : "ghost",
            bordered: !z.primary,
            class: Y({ danger: z.danger }),
            icon: k(z),
            disabled: p.value,
            title: y(z),
            "data-button": z.name,
            onClick: (L) => I(z)
          }, {
            default: D(() => [
              K(v(z.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Mf, v(h.value), 1)) : b("", !0),
        c.value && !e.readOnly ? (r(), F(yf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: B[2] || (B[2] = (z) => c.value = null),
          onDone: B[3] || (B[3] = (z) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : b("", !0)
      ], 64))
    ], 10, $f));
  }
}, Qs = /* @__PURE__ */ U(_f, [["__scopeId", "data-v-a4b6f174"]]), Cf = {
  class: "running",
  "data-running-command": ""
}, Ef = ["title"], Af = {
  key: "idle",
  class: "running-idle"
}, Of = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Cf, [
      A(Ut, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Ef)) : (r(), d("span", Af, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, r6 = /* @__PURE__ */ U(Of, [["__scopeId", "data-v-d3240219"]]), Tf = ["aria-checked", "disabled", "aria-label", "title"], If = {
  key: 0,
  class: "switch-inner"
}, Bf = {
  key: 0,
  class: "switch-word"
}, Rf = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean, disabled: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("button", {
      type: "button",
      class: Y(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      disabled: e.disabled,
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: Y(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", If, v(e.word), 1)) : b("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", Bf, v(e.word), 1)) : b("", !0)
    ], 10, Tf));
  }
}, u6 = /* @__PURE__ */ U(Rf, [["__scopeId", "data-v-92ae7767"]]), Lf = { class: "notice-text" }, Nf = {
  key: 1,
  class: "notice-actions"
}, qf = {
  __name: "Notice",
  props: {
    tone: { type: String, default: "muted" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = ["brief", "report", "wait", "danger", "info", "need", "ask"];
    return (n, a) => (r(), d("div", {
      class: Y(["notice", [`notice-${e.tone}`, { "notice-band": t.includes(e.tone) }]])
    }, [
      e.icon ? (r(), F(le, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : b("", !0),
      m("span", Lf, [
        re(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", Nf, [
        re(n.$slots, "actions", {}, void 0, !0)
      ])) : b("", !0)
    ], 2));
  }
}, c6 = /* @__PURE__ */ U(qf, [["__scopeId", "data-v-445bd8a6"]]);
function ki(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function ta(e, t) {
  return ki(() => localStorage, e, t);
}
function wi(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Xs(e, t) {
  return wi(() => localStorage, e, t);
}
function $i(e, t) {
  me(t, (n) => Xs(e, n), { deep: !0 });
}
function Df(e, t) {
  return ki(() => sessionStorage, e, t);
}
function Pf(e, t) {
  return wi(() => sessionStorage, e, t);
}
const na = "journal.environment", xi = E(Df(na, ta(na, "")));
function jf(e) {
  xi.value = e, Pf(na, e), Xs(na, e);
}
const aa = E(location.hash), qo = Ze(null), Do = { integrations: "mcp", library: "team" };
function Ff() {
  if (!qo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Do[n]) {
    location.replace(`#/${[Do[n], ...a].join("/")}${t ? `?${t}` : ""}`), aa.value = location.hash;
    return;
  }
  !n || qo.value(n) || (jf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), aa.value = location.hash);
}
window.addEventListener("hashchange", () => {
  aa.value = location.hash, Ff();
});
const ys = _(() => {
  const [e, t = ""] = aa.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", h = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(h) || 0, env: u };
  });
  return {
    env: xi.value,
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
}), Js = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Js.page(e)}?open=${t}`
};
function Wf(e = "", t = 0, n = "") {
  location.hash = Js.page(e, t, n);
}
function Hf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const zf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Si(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(zf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function d6(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function yt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = ys.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Si([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Uf(e, t, n, a = 0, s = "") {
  if (e === ys.value.env) return yt(t, n, a, s);
  const o = ys.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Si([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function je(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Uf(a, s, Number(o), 0, t) : yt(s, Number(o), 0, t);
}
function Gf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = Gf(e);
  t && je(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function f6(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Vf = { class: "inspector-part" }, Kf = { class: "inspector-part-title" }, Yf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", Vf, [
      m("h4", Kf, v(e.title), 1),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, h6 = /* @__PURE__ */ U(Yf, [["__scopeId", "data-v-5175e4a3"]]), Po = /* @__PURE__ */ new Map(), Qf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = E(null), a = E(!1), s = E(t.name && Po.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Po.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Me(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (u, c) => (r(), d(P, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ge(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        re(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = xe((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : b("", !0)
    ], 64));
  }
}, Mi = /* @__PURE__ */ U(Qf, [["__scopeId", "data-v-4d2235ba"]]), Xf = ["aria-valuenow", "aria-valuemax"], Jf = {
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
    const t = e, n = _(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (r(), d("span", {
      class: Y(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, Xf));
  }
}, _i = /* @__PURE__ */ U(Jf, [["__scopeId", "data-v-9eba6a85"]]), Zf = { processes: "process", memories: "memory", replies: "reply" }, sa = (e) => (Zf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), bs = [], eh = 2e3, ht = /* @__PURE__ */ new Map(), th = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, nh = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? bs.unshift(e) : bs.push(e), ht.clear();
}
function Ci(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const ah = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, sh = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function rt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function oh(e, t) {
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
function cn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return lh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function lh(e) {
  return e.split(nh).map((t, n) => n % 2 ? t : t.replace(th, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function jo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const ih = 24;
function rh(e) {
  const [t, , ...n] = e, a = jo(t), s = n.map(jo), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > ih) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${cn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${cn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Ei = /^\s*(?:[-*+]|\d+[.)])\s+/, ks = /^\s*(\d+)[.)]\s/, Fo = (e) => e.match(/^\s*/)[0].length;
function Ai(e) {
  const t = e[0].match(ks), n = Fo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Fo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${cn(o.text)}${o.nested.length ? Ai(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function uh(e, t) {
  const n = ks.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Ei.test(e[s]) && ks.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Wo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Oi(e) {
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
    if (Wo(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(rh(t.slice(a, i))), a = i;
      continue;
    }
    if (Ei.test(s)) {
      const i = uh(t, a);
      n.push(Ai(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Oi(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Wo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${cn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const ch = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, dh = (e) => e.type !== "text" && !ch.test(e.html);
function fh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Oi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : dh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Zs(e, t = { env: "" }) {
  const n = sh(e, t), a = ht.get(n);
  if (ht.delete(n), a && a.source === t.source && a.reads.every((l) => ah(l, t)))
    return ht.set(n, a), a.html;
  const s = [], o = fh(oh(e, { ...t, reads: s }));
  return ht.set(n, { html: o, reads: s, source: t.source }), ht.size > eh && ht.delete(ht.keys().next().value), o;
}
const Ba = /* @__PURE__ */ new WeakMap();
function hh(e) {
  if (Ba.has(e)) return Ba.get(e);
  const t = su(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
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
function Ti() {
  const e = Se(Le, null), t = e ? hh(e) : null;
  return (n, a = {}) => Zs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Ii = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, $n = (e) => String(e || "").replace(Ii, (t, n, a, s) => s), mh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Nn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, ph = /^Traceback \(most recent call last\):/m, gh = 8;
function Bi(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, gh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function vh(e) {
  const t = [...e.matchAll(mh)].map((a) => a.index);
  if (Nn.lastIndex = 0, !t.length || !Nn.test(e)) return null;
  Nn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Nn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Bi(n), tail: "" } : null;
}
function yh(e) {
  const t = ph.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Bi([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = $n(e), n = yh(t) || vh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const oa = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ri = (e) => `${e.table}:${e.id}`, ws = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ra = 80;
function Ho(e) {
  return e.length <= Ra ? e : `${e.slice(0, Ra + 1).replace(/\s+\S*$/, "") || e.slice(0, Ra)}…`;
}
const zo = {
  messages: (e) => Ho(ws(e.text)),
  comments: (e) => Ho(ws(e.text)),
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
}, bh = (e) => (zo[e.table] ? zo[e.table](e) : e.title || "") || "", Ct = (e) => oa(e.created_at), kh = (e) => oa(e.updated_at) || Ct(e), wh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, $h = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function xh(e) {
  const t = wh.exec(e);
  if (t && gt(t[1])) return { at: t.index, length: t[0].length, table: gt(t[1]), id: Number(t[2]), label: t[3] };
  const n = $h.exec(e), a = n && gt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Sh(e, t, n, a) {
  const s = Ci(a, e, t), o = $n(s ? bh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${rt(Vt(e).title)} ${t}</span><span class="row-card-title">${rt(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = xh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Sh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Mh = /\.(png|jpe?g|gif|webp|svg)$/i, _h = (e) => Mh.test(e), Ch = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Eh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Ah(e, t) {
  const n = Ch.exec(e), [, a, s, o, l, i] = n || [], u = n && gt(a || o), c = u && Ci(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Vt(u).title} ${c.id} · ${rt(i)}`, p = _h(i) ? `<img class="file-card-image" src="${f}" alt="${rt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${rt(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function Oh(e) {
  const t = Eh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${rt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = Ah(e, t) || Oh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Th = /`([^`\n]+)`/g;
At((e) => e.replace(Th, (t, n) => `<code>${n}</code>`));
const Uo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Js.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(Ii, (n, a, s, o) => Uo[a] ? Uo[a](s, o, t) : o)
);
const Ih = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Li = new RegExp(`\\b(${bi}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Ni = new RegExp(`\\b(${bi}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Bh = new RegExp(`<code>((?:${Li.source}|${Ni.source}))</code>`, "gi"), Rh = (e) => e.replace(Bh, "$1"), Lh = (e, t) => `<a class="row-pill" href="#" data-peek="${gt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Nh = (e) => e.replace(Ni, (t, n, a) => a.replace(/\d+/g, (s) => Lh(n.replace(/s$/i, ""), s))), qh = (e) => Nh(e).replace(
  Li,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${gt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : Rh(e).split(Ih).map((n, a) => a % 2 ? n : qh(n)).join("")
);
const Dh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Ph = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, jh = /[\w\]]\(/, Fh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Wh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Hh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, zh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Uh = /[[({,]$/, Gh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Vh = /^(\t|\s{2,})\S/, Kh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Yh = /`[^`]+`/, Qh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Xh = /[{}()[\];=<>$&|*\\@+^~%]/g, qi = /^\s*(?:[-*+]|\d+[.)])\s/, Jh = /^\s*>/, Zh = /^\s*\|/, em = 0.6, tm = 0.4, nm = 5, am = 0.03, Di = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= nm && t.every((n) => Qh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Xh) ?? []).length / e.length < am;
}, La = (e) => {
  const t = e.trim();
  return Yh.test(t) ? !1 : [Dh, Ph, jh, Fh, Wh, Hh, zh, Uh, Gh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Vh.test(e) && !qi.test(e) && !Di(e);
};
function sm(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || qi.test(t[0]) || t.every((o) => Jh.test(o) || Zh.test(o))) return "text";
  const n = t.filter((o) => !Kh.test(o.trim()));
  if (t.length === 1) return !n.length || La(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(La).length, s = n.filter((o) => !La(o) && Di(o)).length;
  return a >= n.length * em && s <= n.length * tm ? "code" : "text";
}
const $s = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", om = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", lm = `${$s} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, im = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", rm = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Go = {
  js: { keywords: $s, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: om, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: lm, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: $s, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: im, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: rm, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, um = {
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
function Vo(e, t, n) {
  return n && e.startsWith(n, t);
}
function cm(e, t) {
  const n = Go[um[t] ?? t] || Go.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Vo(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Vo(e, o, n.block[0])) {
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
function dm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of cm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? rt(l) : `<span class="tok-${a}">${rt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function fm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const hm = 1500, Ko = /* @__PURE__ */ new WeakMap();
async function mm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await fm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ko.get(t)), Ko.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, hm)
  )));
}
typeof document < "u" && document.addEventListener("click", mm, !0);
const pm = /\n\s*\n/, gm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, vm = /^\s*(`{3,}|~{3,})\s*$/, ym = /^\s{4,}\S/, bm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, xs = /^\s*(?:[-*+]|\d+[.)])\s/, Pi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, km = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function eo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function wm(e) {
  const t = eo(e.join(`
`));
  return (km.find(([, n]) => n.test(t)) || ["text"])[0];
}
const $m = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Pi.test(t) && !xs.test(t);
}, xm = (e, t) => xs.test(t) || xs.test([...e].reverse().find((n) => n.trim()) || "");
function to(e, t) {
  const n = t || wm(e), a = dm(eo(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Sm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && vm.test(s));
  return a < 0 ? e.length : a;
}
function Mm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return to(a.map($n), n ? n.toLowerCase() : "");
}
function _m(e) {
  const t = e.split(pm).map((l) => ({ paragraph: l, type: sm(eo(l).split(`
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
      s(), n.push(to(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map($n), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Cm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : _m(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(gm);
    if (i) {
      const c = Sm(n, l, i[2]);
      o(), a.push(Mm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = $m(s) ? bm : ym;
    if (!t && u.test(n[l]) && !xm(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Pi.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(to([...f, ...n.slice(l, c)].map($n), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => Cm(e, t.document), { first: !0 });
const Em = ["innerHTML"], Am = ["innerHTML"], Om = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Ti(), a = _(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => R(Nt) && R(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Em)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => R(Nt) && R(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Am));
  }
}, lt = /* @__PURE__ */ U(Om, [["__scopeId", "data-v-d8e75741"]]), m6 = (e) => [...new Set(e.agents.map((t) => t.name))], Na = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, Tm = "main agent", no = (e, t) => t ? Tm : e, Im = ["data-agent-main"], Bm = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, Rm = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Lm = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = _(() => no(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Bm, [...s[0] || (s[0] = [
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
      e.iconOnly ? b("", !0) : (r(), d("span", Rm, v(n.value), 1))
    ], 10, Im));
  }
}, Dt = /* @__PURE__ */ U(Lm, [["__scopeId", "data-v-a4c3d1e5"]]), Nm = ["aria-expanded"], qm = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Dm = {
  key: 0,
  class: "tip-failure"
}, Pm = { key: 1 }, jm = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Se(Le, null), a = _(() => yd(t.type, t.state)), s = E(!1), o = E([]), l = E("");
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
      K(v(R(un)(e.type, e.state)) + " ", 1),
      s.value ? (r(), d("span", qm, [
        l.value ? (r(), d("span", Dm, v(l.value), 1)) : b("", !0),
        (r(!0), d(P, null, ne(o.value, (p) => (r(), d("span", {
          key: p,
          class: "tip-line"
        }, v(p), 1))), 128))
      ])) : b("", !0)
    ], 40, Nm)) : (r(), d("span", Pm, v(R(un)(e.type, e.state)), 1));
  }
}, Fm = /* @__PURE__ */ U(jm, [["__scopeId", "data-v-bf9353d9"]]), Wm = {
  class: "plan-details",
  "data-plan-details": ""
}, Hm = { class: "state-line" }, zm = {
  key: 0,
  class: "phase-count"
}, Um = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Gm = { class: "text" }, Vm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Km = { class: "overall" }, Ym = { class: "overall-figure" }, Qm = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, Xm = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, Jm = {
  key: 4,
  class: "part"
}, Zm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (r(), d("div", Wm, [
      m("div", Hm, [
        A(Fm, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: Y(["status", R(ii)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (r(), d("span", zm, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : b("", !0)
      ]),
      e.plan.reason ? (r(), d("section", Um, [
        m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Gm, v(e.plan.reason), 1)
      ])) : b("", !0),
      e.plan.total ? (r(), d("section", Vm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Km, [
          A(_i, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", Ym, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : b("", !0),
      e.plan.assignee ? (r(), d("p", Qm, [
        A(Dt, {
          name: e.plan.assignee.name,
          main: e.plan.assignee.main
        }, null, 8, ["name", "main"])
      ])) : e.plan.delegated ? (r(), d("p", Xm, [
        R(Na)(e.plan) ? (r(), F(Dt, {
          key: 0,
          name: R(Na)(e.plan).name,
          main: R(Na)(e.plan).main
        }, null, 8, ["name", "main"])) : (r(), d(P, { key: 1 }, [
          K(" Delegated ")
        ], 64))
      ])) : b("", !0),
      e.plan.brief ? (r(), d("section", Jm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        A(Mi, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: D(() => [
            A(lt, {
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
}, p6 = /* @__PURE__ */ U(Zm, [["__scopeId", "data-v-d555fe18"]]), ep = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), F(Ke(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: D(() => [
        re(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: Y(["tip", e.place]),
          role: "tooltip"
        }, [
          re(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, tp = /* @__PURE__ */ U(ep, [["__scopeId", "data-v-683e1839"]]), np = 5e3, ap = "cancelled", qa = /* @__PURE__ */ new Map();
async function sp(e, t) {
  const n = `${e.environment}:${t}`, a = qa.get(n);
  if (a && performance.now() - a.at < np) {
    const o = await a.answer;
    if (o.failure !== ap) return o;
    qa.delete(n);
  }
  const s = e.read(`agent tip ${t}`);
  return qa.set(n, { answer: s, at: performance.now() }), s;
}
function op(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function xn(e, t = Date.now()) {
  const n = op(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const lp = 36e5;
function ip(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / lp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Yo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function ji(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Qo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Da = (e) => String(e).padStart(2, "0");
function Fi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Da(t % 60)}s` : `${Math.floor(t / 3600)}h ${Da(Math.floor(t % 3600 / 60))}m ${Da(t % 60)}s`;
}
const rp = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, up = { state: "retired", words: "Retired" }, cp = (e) => e.retired ? up : rp[e.activity], dp = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), fp = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${xn(e, t)}` : "", hp = (e, t) => e ? `Seen: ${xn(e, t)}` : "", mp = {
  class: "line head",
  "data-agent-tip-head": ""
}, pp = { key: 0 }, gp = {
  class: "line",
  "data-agent-tip-identity": ""
}, vp = {
  class: "line status",
  "data-agent-tip-status": ""
}, yp = ["data-state"], bp = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, kp = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, wp = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, $p = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, xp = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Se(Le, null), a = E(!1), s = E(null), o = E(""), l = E(Date.now()), i = _(() => cp(s.value)), u = _(() => fp(s.value.since, l.value)), c = _(() => hp(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const h = await sp(n, t.agentId);
      o.value = h.ok ? "" : h.error, h.ok && (l.value = Date.now(), s.value = h.value);
    }
    return (h, p) => (r(), F(tp, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Pl({
      default: D(() => [
        re(h.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: D(() => [
          s.value ? (r(), d(P, { key: 0 }, [
            m("span", mp, [
              m("b", null, v(s.value.title), 1),
              p[0] || (p[0] = K()),
              s.value.name ? (r(), d("span", pp, v(s.value.name), 1)) : b("", !0)
            ]),
            m("span", gp, v(R(dp)(s.value)), 1),
            m("span", vp, [
              m("i", {
                "data-state": i.value.state
              }, null, 8, yp),
              K(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", bp, v(u.value), 1)) : b("", !0),
            c.value ? (r(), d("span", kp, v(c.value), 1)) : b("", !0)
          ], 64)) : (r(), d("b", wp, v(e.label), 1)),
          o.value ? (r(), d("span", $p, v(o.value), 1)) : b("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, dn = /* @__PURE__ */ U(xp, [["__scopeId", "data-v-71d17663"]]), Sp = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Mp = { class: "agent-word" }, _p = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = _(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((u) => u.helper_id && !n.has(u.state))) {
        const u = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, main: i.helper_main, held: u });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (r(), d("div", Sp, [
      (r(!0), d(P, null, ne(s.value, (i) => (r(), F(dn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: R(no)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => R(je)(`agents:${i.id}`)
      }, {
        default: D(() => [
          m("span", {
            class: Y(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Dt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          m("span", Mp, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : b("", !0);
  }
}, Cp = /* @__PURE__ */ U(_p, [["__scopeId", "data-v-619caeed"]]), Ep = { class: "phases" }, Ap = { class: "phead" }, Op = { class: "mark" }, Tp = { class: "ptitle" }, Ip = { class: "phead-end" }, Bp = {
  key: 0,
  class: "checkpoint"
}, Rp = { class: "progress" }, Lp = {
  key: 0,
  class: "when"
}, Np = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", Ep, [
      (r(!0), d(P, null, ne(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        m("div", Ap, [
          m("span", Op, [
            A(le, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", Tp, v(i + 1) + ". " + v(l.title), 1),
          m("span", Ip, [
            l.checkpoint ? (r(), d("span", Bp, "checkpoint")) : b("", !0),
            m("span", Rp, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", Lp, v(l.goal), 1)) : b("", !0),
        A(Cp, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(P, null, ne(l.tasks, (u) => re(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, g6 = /* @__PURE__ */ U(Np, [["__scopeId", "data-v-05aaa685"]]), qp = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Dp = { ...qp, done: "Completed" }, Pp = /* @__PURE__ */ new Set(["completed", "cancelled"]), jp = (e) => Pp.has(e), fn = (e) => jp(e) ? "done" : e, Fp = { class: "task-status-icon" }, Wp = ["width", "height", "aria-label"], Hp = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = _(() => ii("task", fn(t.status))), a = _(() => n.value === "testing" ? "started" : n.value), s = _(() => Dp[t.status] ?? un("task", t.status));
    return (o, l) => (r(), d("span", Fp, [
      A(Ut, {
        name: "turn",
        mode: "out-in"
      }, {
        default: D(() => [
          (r(), d("svg", {
            key: n.value,
            class: Y(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            A(Gt, { value: a.value }, {
              blocked: D(() => [...l[0] || (l[0] = [
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
              done: D(() => [...l[1] || (l[1] = [
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
              started: D(() => [...l[2] || (l[2] = [
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
              asked: D(() => [...l[3] || (l[3] = [
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
              paused: D(() => [...l[4] || (l[4] = [
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
              planned: D(() => [...l[5] || (l[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: D(() => [...l[6] || (l[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Wp))
        ]),
        _: 1
      })
    ]));
  }
}, ka = /* @__PURE__ */ U(Hp, [["__scopeId", "data-v-ae24a63f"]]), zp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, Up = {
  key: 0,
  class: "empty",
  role: "alert"
}, Gp = {
  key: 2,
  class: "empty"
}, Vp = { class: "day" }, Kp = { class: "events" }, Yp = { class: "mark" }, Qp = { class: "what" }, Xp = { class: "head" }, Jp = { class: "word" }, Zp = ["title", "onClick"], e1 = { class: "at" }, t1 = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = E(null), l = E(""), i = _(() => {
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
    return me(() => a.id, c, { immediate: !0 }), (f, h) => (r(), d("section", zp, [
      l.value ? (r(), d("p", Up, v(l.value), 1)) : o.value === null ? (r(), F(Qe, { key: 1 })) : o.value.length ? b("", !0) : (r(), d("p", Gp, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(P, null, ne(i.value, (p) => (r(), d(P, {
        key: p.day
      }, [
        m("h3", Vp, v(p.day), 1),
        m("ol", Kp, [
          (r(!0), d(P, null, ne(p.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", Yp, [
              n[y.event_type].state ? (r(), F(ka, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), F(le, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", Qp, [
              m("div", Xp, [
                m("span", Jp, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (k) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, Zp),
                m("span", e1, v(u(y.time)), 1)
              ]),
              y.text ? (r(), F(lt, {
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
}, v6 = /* @__PURE__ */ U(t1, [["__scopeId", "data-v-9e511133"]]), n1 = 1e3;
function Wi() {
  const e = E(Date.now()), t = setInterval(() => e.value = Date.now(), n1);
  return nt(() => clearInterval(t)), e;
}
const a1 = Symbol("resource-subscriptions");
function Sn(e, t, n = () => !0) {
  const a = Se(a1, () => new Zl(), !0), s = Hs(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  pa(() => {
    o(), s.cancel();
  });
}
const Hi = (e, t) => !e.row_id || t.has(e.row_id), s1 = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, y6 = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, o1 = "Not known", l1 = 80, i1 = 1e3, r1 = "worker", u1 = "main", c1 = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), d1 = (e) => e.ok ? e.value.rows : [], f1 = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), h1 = (e, t) => (t == null ? void 0 : t.given_name) || f1((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), m1 = (e, t) => e.ended_at ? "ended" : e.paused_at || c1.has(t == null ? void 0 : t.state) ? "waiting" : "running", zi = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function p1({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / i1, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Fi(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > l1 }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? o1 : `$${t.cost_dollars.toFixed(2)}` }), e.role === r1 && l.push({ key: "pace", label: "Tasks an hour", value: String(ip(zi(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === u1 && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function g1(e) {
  const t = zi(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function v1(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Yo(e.created_at)]), e.ended_at && n.push(["Ended", Yo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const y1 = { class: "band" }, b1 = { key: 0 }, k1 = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", y1, [
      A(le, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      re(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", b1, v(e.count), 1)) : b("", !0)
    ]));
  }
}, Wt = /* @__PURE__ */ U(k1, [["__scopeId", "data-v-1758914f"]]), w1 = { class: "number" }, $1 = { class: "text" }, x1 = 150, S1 = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = E(!1), a = _(() => t.text.length > x1), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(P, null, [
      e.text ? (r(), d(P, { key: 0 }, [
        A(Wt, { icon: "file" }, {
          default: D(() => [
            K(v(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
          class: Y(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : b("", !0)
      ], 64)) : b("", !0),
      e.points.length ? (r(), d(P, { key: 1 }, [
        A(Wt, { icon: "points" }, {
          default: D(() => [...l[1] || (l[1] = [
            K("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(P, null, ne(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", w1, v(i.id), 1),
            m("span", $1, [
              K(v(i.text), 1),
              m("span", {
                class: Y(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : b("", !0)
    ], 64));
  }
}, M1 = /* @__PURE__ */ U(S1, [["__scopeId", "data-v-c99de22c"]]), _1 = ["aria-expanded"], C1 = { class: "count" }, E1 = {
  key: 0,
  "data-agent-fold-body": ""
}, A1 = {
  __name: "AgentFold",
  props: /* @__PURE__ */ jt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = ln(e, "open");
    return (n, a) => (r(), d(P, null, [
      m("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        A(le, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        K(v(e.label), 1),
        m("span", C1, v(e.count), 1),
        A(le, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, _1),
      t.value ? (r(), d("div", E1, [
        re(n.$slots, "default", {}, void 0, !0)
      ])) : b("", !0)
    ], 64));
  }
}, Pa = /* @__PURE__ */ U(A1, [["__scopeId", "data-v-7f93d8d9"]]), O1 = ["onClick"], T1 = { class: "text" }, I1 = { class: "aside" }, B1 = {
  key: 0,
  class: "none"
}, R1 = {
  class: "skills",
  "data-agent-skills": ""
}, L1 = {
  key: 0,
  class: "none-inline"
}, N1 = { class: "label" }, q1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = zt({ helpers: !1, skills: !1 }), a = E([]), s = E([]), o = async (i) => d1(await t.read(i));
    me(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), me(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${ea(i.role)} ${i.id}`;
    return (i, u) => (r(), d(P, null, [
      A(Pa, {
        open: n.helpers,
        "onUpdate:open": u[0] || (u[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: D(() => [
          (r(!0), d(P, null, ne(a.value, (c) => (r(), d("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (f) => R(yt)("agents", c.id)
          }, [
            m("span", T1, v(l(c)), 1),
            m("span", I1, v(R(ea)(c.role)) + " " + v(c.id), 1)
          ], 8, O1))), 128)),
          a.value.length ? b("", !0) : (r(), d("p", B1, "It started no helpers."))
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
        default: D(() => [
          m("p", R1, [
            (r(!0), d(P, null, ne(s.value, (c) => (r(), d("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? b("", !0) : (r(), d("span", L1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Pa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: D(() => [
          (r(!0), d(P, null, ne(e.details, ([c, f, h]) => (r(), d("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", N1, v(c) + ":", 1),
            m("span", {
              class: Y(["value", h])
            }, v(f), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, D1 = /* @__PURE__ */ U(q1, [["__scopeId", "data-v-358a0300"]]), P1 = ["datetime", "title"], tt = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Wi(), a = _(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(R(xn)(e.at, R(n))), 9, P1));
  }
}, j1 = {
  class: "now",
  "data-agent-now": ""
}, F1 = {
  key: 1,
  class: "muted"
}, W1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, H1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, z1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, U1 = { class: "line" }, G1 = { class: "detail" }, V1 = { class: "bar" }, K1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = _(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = _(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(P, null, [
      A(Wt, { icon: "play" }, {
        default: D(() => [...o[2] || (o[2] = [
          K("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", j1, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => R(yt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", F1, v(e.nothing), 1)),
        n.value ? (r(), d("span", W1, v(n.value), 1)) : b("", !0),
        e.inspection.last_activity ? (r(), d("span", H1, [
          o[3] || (o[3] = K("Seen: ", -1)),
          A(tt, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : b("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", z1, [
        m("div", U1, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => R(yt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", G1, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", V1, [
          m("i", {
            style: ge({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : b("", !0)
    ], 64));
  }
}, Y1 = /* @__PURE__ */ U(K1, [["__scopeId", "data-v-ff25c609"]]), Q1 = ["onClick"], X1 = { class: "text" }, J1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, Z1 = { class: "text" }, eg = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, tg = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(P, null, [
      A(Wt, { icon: "clock" }, {
        default: D(() => [...n[0] || (n[0] = [
          K("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(P, null, ne(e.moves, (a) => (r(), d(P, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => R(yt)(a.table, a.id)
        }, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", X1, v(a.text), 1),
          A(tt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, Q1)) : (r(), d("div", J1, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", Z1, v(a.text), 1),
          A(tt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? b("", !0) : (r(), d("p", eg, "Nothing yet."))
    ], 64));
  }
}, ng = /* @__PURE__ */ U(tg, [["__scopeId", "data-v-58f0db57"]]), ag = {
  class: "strip",
  "data-agent-strip": ""
}, sg = ["data-agent-cell"], og = {
  key: 0,
  class: "meter"
}, lg = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", ag, [
      (r(!0), d(P, null, ne(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: Y({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", og, [
          m("i", {
            class: Y({ high: a.high }),
            style: ge({ width: `${a.meter}%` })
          }, null, 6)
        ])) : b("", !0)
      ], 8, sg))), 128))
    ]));
  }
}, ig = /* @__PURE__ */ U(lg, [["__scopeId", "data-v-b6657ab7"]]), rg = {}, ug = { class: "menu-label" };
function cg(e, t) {
  return r(), d("span", ug, [
    re(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Mt = /* @__PURE__ */ U(rg, [["render", cg], ["__scopeId", "data-v-aa955b3e"]]), dg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, fg = {
  key: 0,
  class: "skills-none"
}, hg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => n.skills.filter((l) => l.state === "loaded")), o = _(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", dg, [
      A(Mt, null, {
        default: D(() => [...i[1] || (i[1] = [
          K("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? b("", !0) : (r(), d("p", fg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(P, null, ne(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(le, {
          name: "book",
          size: 12
        }),
        K(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(P, { key: 1 }, [
        A(Mt, null, {
          default: D(() => [...i[2] || (i[2] = [
            K("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(P, null, ne(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          A(le, {
            name: "book",
            size: 12
          }),
          K(v(u.skill), 1)
        ]))), 128))
      ], 64)) : b("", !0),
      A(Ue, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: D(() => [...i[3] || (i[3] = [
          K("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, mg = /* @__PURE__ */ U(hg, [["__scopeId", "data-v-be514d47"]]), pg = ["disabled", "title"], gg = { class: "gauge usage" }, vg = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => n.windows[0] ?? null), o = _(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = _(() => o.value !== null && o.value >= 100), i = _(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), u = _(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
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
      f[1] || (f[1] = K()),
      m("span", gg, [
        m("span", {
          style: ge({ width: `${o.value}%` })
        }, null, 4)
      ]),
      K(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, pg)) : b("", !0);
  }
}, yg = /* @__PURE__ */ U(vg, [["__scopeId", "data-v-a36f09dc"]]), bg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["badge", e.tone])
    }, v(e.text), 3));
  }
}, ao = /* @__PURE__ */ U(bg, [["__scopeId", "data-v-9e7e1157"]]);
function kg(e, t, n, { groups: a, programs: s }) {
  const o = E({}), l = E(""), i = E(!1), u = _(() => !!e.value && !e.value.ended_at), c = _(() => u.value && !!e.value.paused_at);
  async function f(k, I = null) {
    l.value = "";
    const x = await zl(I, k, t);
    return l.value = x.ok ? "" : x.error, n(), x;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (k, I) => f(["agent", "control", String(e.value.id), k, I.value], { target: o, fields: { value: { ...o.value, [k]: I.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (k) => f(["agent", "launch", k.name]) };
}
function wg(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const $g = ["disabled", "title"], xg = ["disabled", "title"], Sg = { class: "gauge" }, Mg = ["disabled", "title"], _g = ["disabled"], Cg = ["disabled"], Eg = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ag = ["title"], Og = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Tg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ig = { class: "gauge" }, Bg = { class: "context-used" }, Rg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Lg = 75, Ng = {
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
    const n = e, a = t, s = kg(Ca(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ca(n, "controlGroups"), programs: Ca(n, "agentPrograms") }), o = E(null), l = E(""), i = _(() => s.groups.value.find((L) => L.key === l.value));
    function u(L, w) {
      o.value = L.currentTarget, l.value = w;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = _(() => n.skills.filter((L) => L.state === "loaded"));
    function h(L) {
      u(L, "skills"), a("skills");
    }
    const p = (L) => s.groups.value.some((w) => w.key === L), y = _(() => {
      var L;
      return s.chosen.value.model ?? ((L = I.value) == null ? void 0 : L.model) ?? "";
    }), k = _(() => {
      var L;
      return s.chosen.value.effort ?? ((L = I.value) == null ? void 0 : L.effort) ?? "";
    });
    _(() => !!n.agent && !n.agent.ended_at);
    const I = _(() => {
      var L;
      return ((L = n.usage.agents) == null ? void 0 : L.find((w) => {
        var H;
        return w.id === ((H = n.agent) == null ? void 0 : H.id);
      })) ?? null;
    }), x = _(() => {
      var L;
      return ((L = I.value) == null ? void 0 : L.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), $ = (L) => `${Math.round(L / 1e3)}k`, B = _(() => {
      var L;
      return (L = I.value) != null && L.context_limit_tokens ? `${$(I.value.context_tokens ?? 0)} of ${$(I.value.context_limit_tokens)}` : "";
    }), z = _(() => {
      var L;
      return (L = I.value) != null && L.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    });
    return (L, w) => {
      var H;
      return r(), d("div", {
        class: Y(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(P, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: w[0] || (w[0] = (j) => u(j, "agent"))
          }, [
            A(le, {
              name: "agents",
              size: 12
            }),
            K(" " + v(((H = e.agentPrograms.find((j) => j.name === e.agent.program)) == null ? void 0 : H.title) || e.agent.program), 1)
          ], 8, $g),
          A(yg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: w[1] || (w[1] = (j) => a("open", "usage", j))
          }, null, 8, ["windows", "disabled"]),
          x.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${x.value}% full: clear or compact it`,
            onClick: w[2] || (w[2] = (j) => p("context") ? u(j, "context") : a("open", "context", j.currentTarget))
          }, [
            A(le, {
              name: "gauge",
              size: 12
            }),
            w[14] || (w[14] = K()),
            m("span", Sg, [
              m("span", {
                style: ge({ width: `${x.value}%` })
              }, null, 4)
            ]),
            K(" " + v(x.value) + "% ", 1)
          ], 8, xg)) : b("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: w[3] || (w[3] = (j) => p("model") ? u(j, "model") : null)
          }, [
            A(le, {
              name: "model",
              size: 12
            }),
            K(" " + v(y.value), 1)
          ], 8, Mg)) : b("", !0),
          p("effort") || e.card && k.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: w[4] || (w[4] = (j) => u(j, "effort"))
          }, [
            A(le, {
              name: "bolt",
              size: 12
            }),
            K(" " + v(k.value), 1)
          ], 8, _g)) : b("", !0),
          z.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: w[5] || (w[5] = (j) => a("open", "cost", j.currentTarget))
          }, v(z.value), 9, Cg)) : b("", !0),
          e.branch ? (r(), d("span", Eg, [
            A(le, {
              name: "branch",
              size: 12
            }),
            K(" " + v(e.branch), 1)
          ])) : b("", !0),
          e.card ? b("", !0) : (r(), d("button", {
            key: 5,
            type: "button",
            class: Y(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: w[6] || (w[6] = (j) => a("open", "jobs", j.currentTarget))
          }, [
            A(le, {
              name: "clock",
              size: 12
            }),
            K(" " + v(e.jobs), 1)
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
            K(" " + v(f.value.length), 1)
          ])) : b("", !0),
          e.fitness ? (r(), d(P, { key: 7 }, [
            m("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Lg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: w[7] || (w[7] = (j) => a("open", "fitness", j.currentTarget))
            }, [
              A(le, {
                name: "heart",
                size: 12
              }),
              K(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: Y(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: w[8] || (w[8] = (j) => a("open", "load", j.currentTarget))
            }, [
              A(le, {
                name: "weight",
                size: 12
              }),
              K(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : b("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: w[9] || (w[9] = (j) => u(j, "start"))
        }, [
          A(le, {
            name: "agents",
            size: 12
          }),
          w[15] || (w[15] = K(" Start an agent", -1))
        ])) : b("", !0),
        w[21] || (w[21] = m("span", { class: "space" }, null, -1)),
        R(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: R(s).failure.value
        }, v(R(s).failure.value), 9, Ag)) : b("", !0),
        re(L.$slots, "default", {}, void 0, !0),
        o.value ? (r(), F(ga, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: D(() => {
            var j;
            return [
              l.value === "agent" ? (r(), d(P, { key: 0 }, [
                R(s).asking.value ? (r(), d(P, { key: 0 }, [
                  A(Mt, { "data-agent-stop-ask": "" }, {
                    default: D(() => [...w[16] || (w[16] = [
                      K("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(Ue, {
                    "data-agent-stop-confirm": "",
                    onClick: w[10] || (w[10] = (q) => (c(), R(s).stop()))
                  }, {
                    default: D(() => [...w[17] || (w[17] = [
                      K("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(Ue, {
                    onClick: w[11] || (w[11] = (q) => R(s).asking.value = !1)
                  }, {
                    default: D(() => [...w[18] || (w[18] = [
                      K("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), F(Ue, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: w[12] || (w[12] = (q) => R(s).asking.value = !0)
                }, {
                  default: D(() => [...w[19] || (w[19] = [
                    K("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(P, { key: 1 }, [
                A(Mt, null, {
                  default: D(() => [...w[20] || (w[20] = [
                    K("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(P, null, ne(R(s).programs.value, (q) => (r(), F(Ue, {
                  key: q.name,
                  "data-agent-program": q.name,
                  onClick: (C) => (c(), R(s).start(q))
                }, {
                  default: D(() => [
                    K(v(q.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), F(mg, {
                key: 2,
                skills: e.skills,
                onBrowse: w[13] || (w[13] = (q) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(P, { key: 3 }, [
                A(Mt, null, {
                  default: D(() => [
                    K(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(P, { key: 0 }, [
                  m("p", Og, v(R(wg)(((j = I.value) == null ? void 0 : j.last_compaction) ?? null)), 1),
                  m("div", Tg, [
                    m("span", Ig, [
                      m("span", {
                        style: ge({ width: `${x.value}%` })
                      }, null, 4)
                    ]),
                    m("span", Bg, v(x.value) + "%", 1)
                  ]),
                  B.value ? (r(), d("p", Rg, [
                    K(v(B.value) + " ", 1),
                    A(ao, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : b("", !0)
                ], 64)) : b("", !0),
                (r(!0), d(P, null, ne(i.value.choices, (q) => (r(), F(Ue, {
                  key: q.value,
                  "data-agent-choice": q.value,
                  onClick: (C) => (R(s).choose(i.value.key, q), c())
                }, {
                  default: D(() => [
                    K(v(q.label), 1)
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
}, qg = /* @__PURE__ */ U(Ng, [["__scopeId", "data-v-dc15ff96"]]), Dg = {
  class: "who",
  "data-agent-who": ""
}, Pg = { class: "name" }, jg = ["data-agent-state"], Fg = {
  class: "sub",
  "data-agent-started-by": ""
}, Wg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Dg, [
      m("h2", Pg, [
        m("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, jg),
        K(v(e.name), 1)
      ]),
      A(qg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", Fg, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, Hg = /* @__PURE__ */ U(Wg, [["__scopeId", "data-v-83bd4a9d"]]), zg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, Ug = { class: "scroll" }, Gg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Vg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, Kg = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Wi(), a = E(null), s = E(null), o = E(null), l = E({}), i = E({ helpers: 0, skills: 0 }), u = E(0), c = E([]), f = E([]), h = E("");
    let p = 0;
    const y = _(() => {
      var $;
      return a.value.ended_at ? g1(s.value) : `It has no task.${($ = s.value) != null && $.instruction ? " It was given an instruction." : ""}`;
    });
    async function k() {
      const $ = ++p, B = await t.read(["usage", "inspector", String(t.id), "--environment", t.environment]);
      $ === p && (h.value = B.ok ? "" : B.error, B.ok && (a.value = B.value.agent, s.value = B.value.facts, o.value = B.value.inspection, l.value = B.value.tool, i.value = { helpers: B.value.helpers, skills: B.value.skills }, c.value = B.value.points, f.value = B.value.programs, u.value += 1));
    }
    const I = _(() => /* @__PURE__ */ new Set([t.id])), x = {
      agent: ($) => Hi($, I.value),
      hook_call: ($) => s1($, "session_agent_id", I.value)
    };
    return Sn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], k, ($) => {
      var B;
      return ((B = x[$.event.split(".")[0]]) == null ? void 0 : B.call(x, $)) ?? !0;
    }), Me(k), ($, B) => {
      var z, L;
      return r(), d("article", zg, [
        m("div", Ug, [
          h.value ? (r(), d("p", Gg, v(h.value), 1)) : a.value && o.value ? (r(), d(P, { key: 1 }, [
            A(Hg, {
              name: R(h1)(a.value, s.value),
              state: R(m1)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: f.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((z = s.value) == null ? void 0 : z.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(ig, {
              cells: R(p1)({ row: a.value, facts: s.value, inspection: o.value, now: R(n) })
            }, null, 8, ["cells"]),
            A(Y1, {
              inspection: o.value,
              tool: l.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(M1, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((L = s.value) == null ? void 0 : L.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            A(ng, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(D1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: u.value,
              details: R(v1)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", Vg, "Ended " + v(R(xn)(a.value.ended_at, R(n))) + ". It takes no more actions.", 1)) : b("", !0)
          ], 64)) : (r(), F(Qe, { key: 2 }))
        ])
      ]);
    };
  }
}, b6 = /* @__PURE__ */ U(Kg, [["__scopeId", "data-v-26d7ee78"]]), Yg = ["aria-expanded"], Qg = { class: "drop-label" }, Xg = ["value"], Jg = {
  key: 1,
  class: "drop-lead"
}, Zg = { class: "drop-item-text" }, ev = {
  key: 2,
  class: "drop-note"
}, tv = {
  key: 1,
  class: "drop-none"
}, nv = {
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
    const n = e, a = t, s = E(!1), o = E(null), l = E(""), i = _(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((f) => `${f.label} ${f.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function u(c) {
      s.value = !1, a("pick", c);
    }
    return (c, f) => (r(), d("div", {
      class: Y(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      m("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Y(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: f[0] || (f[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (r(), F(le, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : b("", !0),
        m("span", Qg, v(e.label), 1),
        A(le, {
          name: "down",
          size: 11
        })
      ], 10, Yg),
      s.value ? (r(), F(ga, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (h) => s.value = !1)
      }, {
        default: D(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (h) => l.value = h.target.value)
          }, null, 40, Xg)) : b("", !0),
          (r(!0), d(P, null, ne(i.value, (h) => (r(), F(Ue, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => u(h)
          }, {
            default: D(() => [
              h.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: Y(["drop-dot", { live: h.running }])
              }, null, 2)) : b("", !0),
              h.lead ? (r(), d("span", Jg, v(h.lead), 1)) : b("", !0),
              m("span", Zg, v(h.label), 1),
              h.note ? (r(), d("span", ev, v(h.note), 1)) : b("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? b("", !0) : (r(), d("p", tv, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : b("", !0)
    ], 2));
  }
}, Ui = /* @__PURE__ */ U(nv, [["__scopeId", "data-v-29dfcce5"]]);
function av(e) {
  const t = E(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Me(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), nt(() => n.disconnect()), t;
}
const sv = ["data-comment-id"], ov = {
  key: 0,
  class: "comment-top"
}, lv = { class: "comment-mark" }, iv = {
  class: "comment-body",
  "data-comment": ""
}, rv = { class: "comment-foot" }, uv = {
  key: 1,
  "data-comment-lost": ""
}, cv = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (r(), d("article", {
      class: Y(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (r(), d("div", ov, [
        m("span", lv, v(e.comment.number), 1),
        m("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : b("", !0),
      m("p", iv, v(e.comment.body), 1),
      m("div", rv, [
        e.comment.created_at ? (r(), F(tt, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : b("", !0),
        e.lost ? (r(), d("span", uv, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : b("", !0)
      ])
    ], 10, sv));
  }
}, Gi = /* @__PURE__ */ U(cv, [["__scopeId", "data-v-a37d4507"]]);
var Dl;
/Mac|iPhone|iPad/.test(((Dl = navigator.userAgentData) == null ? void 0 : Dl.platform) || navigator.platform);
function Vi(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const dv = {
  class: "comment-box",
  "data-comment-box": ""
}, fv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, hv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, mv = { class: "comment-row" }, pv = ["placeholder"], gv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ jt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ jt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = ln(e, "draft"), l = E(""), i = E(!1), u = E(null), c = _(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = _(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const y = o.value.trim();
      if (!(!y || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(y), o.value = "", await Fe(), h();
        } catch (k) {
          l.value = k.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, k) => (r(), d("div", dv, [
      e.selection ? (r(), d("div", fv, [
        k[3] || (k[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        A(va, {
          title: "Comment on the whole document instead",
          onClick: k[0] || (k[0] = (I) => s("clear"))
        })
      ])) : b("", !0),
      l.value ? (r(), d("p", hv, v(l.value), 1)) : b("", !0),
      m("div", mv, [
        et(m("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": k[1] || (k[1] = (I) => o.value = I),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: k[2] || (k[2] = _t((I) => R(Vi)(I, p), ["enter"]))
        }, null, 42, pv), [
          [Zn, o.value]
        ]),
        A(pe, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: D(() => [...k[4] || (k[4] = [
            K("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, vv = /* @__PURE__ */ U(gv, [["__scopeId", "data-v-41d2081c"]]), qn = (e) => e ? e.split(", ") : [];
function yv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function bv(e, t) {
  return {
    reads: qn(e.reads_allowed),
    runs: qn(e.runs_allowed),
    missing: [...qn(e.reads_missing), ...qn(e.runs_missing)],
    ask: t
  };
}
const kv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = ou("SkeletonParts", !0);
      return r(!0), d(P, null, ne(e.parts, (u, c) => (r(), d(P, { key: c }, [
        (r(!0), d(P, null, ne(u.count, (f) => (r(), F(Gt, {
          key: f,
          value: u.shape
        }, {
          line: D(() => [
            A(en, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: D(() => [
            A(en, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: D(() => [
            A(en, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: D(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: D(() => [
            m("div", {
              class: "skeleton-row",
              style: ge(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            m("div", {
              class: "skeleton-stack",
              style: ge(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: D(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            m("div", {
              class: "skeleton-grid",
              style: ge(s(u))
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
}), wv = /* @__PURE__ */ U(kv, [["__scopeId", "data-v-fa8baeaf"]]), $v = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, xv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", $v, [
      A(wv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, so = /* @__PURE__ */ U(xv, [["__scopeId", "data-v-52f66b64"]]), Ki = {
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
}, Sv = { class: "bars" }, Mv = { class: "bar-name" }, _v = { class: "bar-value" }, Cv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = _(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", Sv, [
      (r(!0), d(P, null, ne(e.items, (u, c) => (r(), F(Ke(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: D(() => [
          m("span", Mv, v(u.label), 1),
          A(_i, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", _v, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Ev = /* @__PURE__ */ U(Cv, [["__scopeId", "data-v-663427f4"]]), Av = { class: "bars" }, Ov = {
  key: 0,
  class: "bars-title"
}, Tv = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Av, [
      e.node.title ? (r(), d("span", Ov, v(e.node.title), 1)) : b("", !0),
      A(Ev, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Iv = /* @__PURE__ */ U(Tv, [["__scopeId", "data-v-7135bb11"]]), Bv = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = _(() => n[a.node.type](a.node));
    return (l, i) => (r(), d("div", {
      class: Y([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (r(!0), d(P, null, ne(e.node.children || [], (u, c) => (r(), F(Yi, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Gn = /* @__PURE__ */ U(Bv, [["__scopeId", "data-v-d142a3f4"]]), Rv = {
  key: 0,
  class: "card-head"
}, Lv = { class: "card-title" }, Nv = {
  key: 0,
  class: "card-note"
}, qv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", Rv, [
        m("span", Lv, v(e.node.title), 1),
        e.node.note ? (r(), d("span", Nv, v(e.node.note), 1)) : b("", !0)
      ])) : b("", !0),
      A(Gn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Dv = /* @__PURE__ */ U(qv, [["__scopeId", "data-v-67b72d40"]]), Pv = { class: "fact" }, jv = { class: "fact-label" }, Fv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Pv, [
      m("span", jv, v(e.label), 1),
      A(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Wv = /* @__PURE__ */ U(Fv, [["__scopeId", "data-v-3a88ecf8"]]), Hv = { class: "list" }, zv = { class: "list-label" }, Uv = {
  key: 1,
  class: "list-note"
}, Gv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Hv, [
      (r(!0), d(P, null, ne(e.items, (o, l) => (r(), F(Ke(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          m("span", zv, v(o.label), 1),
          o.badge ? (r(), F(ao, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : b("", !0),
          o.note ? (r(), d("span", Uv, v(o.note), 1)) : b("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Vv = /* @__PURE__ */ U(Gv, [["__scopeId", "data-v-ebe2ae0a"]]), Kv = { class: "table" }, Yv = {
  key: 0,
  class: "table-row empty"
}, Qv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", Kv, [
      m("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (r(!0), d(P, null, ne(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (r(!0), d(P, null, ne(e.rows, (i, u) => (r(), F(Ke(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: ge(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          (r(!0), d(P, null, ne(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", Yv, v(e.empty), 1)) : b("", !0)
    ]));
  }
}, Xv = /* @__PURE__ */ U(Qv, [["__scopeId", "data-v-9326a52e"]]), Jv = { class: "stat-value" }, Zv = { class: "stat-label" }, ey = {
  key: 0,
  class: "stat-note"
}, ty = {
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
    return (a, s) => (r(), F(Ke(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: D(() => [
        m("span", Jv, v(e.value), 1),
        m("span", Zv, v(e.label), 1),
        e.note ? (r(), d("span", ey, v(e.note), 1)) : b("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ny = /* @__PURE__ */ U(ty, [["__scopeId", "data-v-ad0db6d6"]]), ay = { class: "code" }, sy = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (r(), F(Gt, {
      value: e.node.type
    }, {
      stack: D(() => [
        A(Gn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: D(() => [
        A(Gn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: D(() => [
        A(Gn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: D(() => [
        A(Dv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: D(() => [
        m("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: D(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        A(ny, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        A(Iv, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        A(Xv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        A(Vv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        A(lt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        A(Wv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        A(ao, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        m("pre", ay, [
          m("code", null, v(e.node.text), 1)
        ])
      ]),
      file: D(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Yi = /* @__PURE__ */ U(sy, [["__scopeId", "data-v-cbdcf540"]]), oy = { class: "dashboard" }, ly = { class: "trail" }, iy = ["onClick"], ry = {
  key: 0,
  class: "gone",
  role: "status"
}, uy = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = E(!!n.page && !s(n.page)), l = E(n.page && !o.value ? [n.page] : []), i = _(() => l.value.at(-1) || n.document.start), u = _(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return me(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (r(), d("div", oy, [
      e.document.broken ? (r(), F(rn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          K(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), F(rn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          K(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(P, { key: 2 }, [
        m("nav", ly, [
          m("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (k) => h(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(P, null, ne(l.value, (k, I) => (r(), d(P, {
            key: `${I}-${k}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Y(["step", { current: I === l.value.length - 1 }]),
              onClick: (x) => h(I + 1)
            }, v(c(k)), 11, iy)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", ry, "What you opened is no longer in this dashboard. Here is its start page.")) : b("", !0),
        A(Ut, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              A(Yi, {
                node: u.value.view,
                onOpen: f,
                onFile: y[1] || (y[1] = (k) => a("file", k))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : b("", !0)
    ]));
  }
}, cy = /* @__PURE__ */ U(uy, [["__scopeId", "data-v-fbe83734"]]);
function dy(e, t) {
  const n = at(), a = Hs(e, Ki.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Me(e), nt(() => {
    s(), a.cancel();
  });
}
const fy = {
  key: 0,
  class: "window-failure"
}, hy = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = at(), o = E(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? dy(l, n.events) : Fs(l, () => !0, Ki.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", fy, v(o.value.error), 1)) : o.value ? (r(), F(cy, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : b("", !0);
  }
}, my = 1e4;
class py {
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
    return this.heardAt !== null && t - this.heardAt > my;
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
const gy = {
  key: 0,
  class: "frame-note"
}, vy = {
  key: 0,
  class: "frame-note"
}, yy = ["src", "title"], by = 1e3, ky = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = at(), a = E(null), s = E(!1), o = E(!1);
    let l = null, i = 0;
    return Me(() => {
      l = new py(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, by);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", gy, "This window was closed because it stopped answering.")) : (r(), d(P, { key: 1 }, [
      s.value ? (r(), d("div", vy, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        A(pe, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: D(() => [...c[1] || (c[1] = [
            K("Close the window", -1)
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
        title: R(n).window
      }, null, 8, yy)
    ], 64));
  }
}, wy = /* @__PURE__ */ U(ky, [["__scopeId", "data-v-32a49046"]]), $y = {
  class: "allowance-prompt",
  role: "dialog"
}, xy = { class: "allowance-prompt-text" }, Sy = { class: "allowance-prompt-buttons" }, My = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", $y, [
      m("p", xy, v(R(yv)(e.request)), 1),
      m("div", Sy, [
        A(pe, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            K("Allow", -1)
          ])]),
          _: 1
        }),
        A(pe, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            K("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, _y = /* @__PURE__ */ U(My, [["__scopeId", "data-v-cad69fe2"]]), ja = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(rn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: D(() => [
        K(v(e.reason) + " ", 1),
        e.retry ? (r(), F(pe, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            K("Retry", -1)
          ])]),
          _: 1
        })) : b("", !0),
        e.removable ? (r(), F(pe, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            K("Remove tab", -1)
          ])]),
          _: 1
        })) : b("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Cy = ["data-window", "data-agent"], Ey = {
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
    const n = e, a = t, s = E(""), o = E(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = Se(Mc, null), u = Sd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: _(() => n.options),
      declared: n.declared,
      page: Se(bd, null),
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
    Ds(Le, u), me(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Me(u.settle), Re(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), lu((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ha(n.component), f = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), F(_y, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : b("", !0),
      e.unavailableReason ? (r(), F(ja, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), F(ja, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(P, { key: 4 }, [
        (r(), F(c, { key: o.value })),
        e.skeleton.length && !R(u).answered.value ? (r(), F(so, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : b("", !0)
      ], 64)) : (r(), F(ja, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Cy));
  }
}, tn = /* @__PURE__ */ U(Ey, [["__scopeId", "data-v-c4443e2b"]]), Qi = {
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
    const n = e, a = t, s = { render: () => ha(wy, { src: n.entry.entry_url }) };
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
}, Ay = ["data-window"], Xi = {
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
    const n = e, a = t, s = Ze(null), o = E("");
    return me(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, zu();
          } catch (i) {
            if (Wu(i) && Hu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(so, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Ay)) : (r(), F(tn, {
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
}, Oy = {
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
    const n = t, a = e, s = _(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = _(() => s.value && { render: () => ha(hy, { line: s.value.line, events: s.value.events }) }), l = E(null), i = _(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = _(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = _(
      () => {
        var p, y;
        return l.value ? bv(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
    return me(
      () => {
        var p, y;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && h();
      },
      { immediate: !0 }
    ), (p, y) => {
      var k, I;
      return !s.value && ((k = e.catalogue.loaded) == null ? void 0 : k.value) === !1 ? (r(), F(so, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((I = s.value) == null ? void 0 : I.shows) === "one-agent" && e.agent === null ? (r(), F(rn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), F(tn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), F(Xi, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), F(Qi, {
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
        onOption: y[2] || (y[2] = (x, $) => n("option", x, $))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), F(tn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (x) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Ty = ["data-section"], Iy = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, By = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Se(Vs, null), a = _(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = _(() => ({ row: t.row }));
    return (o, l) => R(n) ? (r(!0), d(P, { key: 0 }, ne(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), F(Oy, {
        key: 0,
        name: i.name,
        catalogue: R(n).catalogue,
        subscriptions: R(n).subscriptions,
        environment: R(n).environment,
        prompts: R(n).prompts,
        "shell-read": R(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", Iy, v(i.name) + " is not available", 1))
    ], 8, Ty))), 128)) : b("", !0);
  }
}, Ss = /* @__PURE__ */ U(By, [["__scopeId", "data-v-a47d36b7"]]), Ry = { class: "rail-head" }, Ly = { key: 0 }, Ny = {
  key: 1,
  class: "rail-none"
}, qy = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", Ry, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", Ly, v(e.total || e.comments.length), 1)) : b("", !0)
      ]),
      e.comments.length ? (r(!0), d(P, { key: 0 }, ne(e.comments, (a) => (r(), F(Gi, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", Ny, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, Dy = /* @__PURE__ */ U(qy, [["__scopeId", "data-v-4d684649"]]), Py = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, jy = ["aria-pressed"], Fy = ["aria-pressed"], Wy = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Hy = {
  key: 0,
  role: "alert"
}, zy = {
  key: 1,
  class: "sidebar-none"
}, Uy = ["data-question-id"], Gy = { class: "question-state" }, Vy = ["data-question-show", "onClick"], Ky = {
  key: 0,
  class: "sidebar-none"
}, Yy = {
  key: 1,
  class: "question-answer"
}, Qy = {
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
    const t = Se(Vs, null);
    return (n, a) => (r(), d("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", Py, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, jy),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Fy)
      ]),
      e.mode === "comments" ? (r(), d(P, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), F(Dy, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : b("", !0),
        A(kn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", Wy, [
        e.failure ? (r(), d("p", Hy, v(e.failure), 1)) : e.questions.length ? b("", !0) : (r(), d("p", zy, "No questions about this text yet.")),
        (r(!0), d(P, null, ne(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", Gy, v(R(un)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, Vy),
            s.quote ? (r(), d(P, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", Ky, "The quoted text has changed.")) : b("", !0)
            ], 64)) : b("", !0),
            s.answer ? (r(), d("p", Yy, "Answered: " + v(s.answer), 1)) : b("", !0),
            A(Ss, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(Qs, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = R(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Uy);
        }), 128))
      ]))
    ], 2));
  }
}, Xo = /* @__PURE__ */ U(Qy, [["__scopeId", "data-v-660e5c85"]]), Xy = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Jy = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = zt({ abstract: n.row.abstract, body: n.row.body }), o = E("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), F(ya, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: D(() => [
        m("span", Xy, v(o.value), 1),
        A(pe, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: D(() => [...u[6] || (u[6] = [
            K("Cancel", -1)
          ])]),
          _: 1
        }),
        A(pe, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: D(() => [...u[7] || (u[7] = [
            K("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: D(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: xe(l, ["prevent"])
        }, [
          m("label", null, [
            u[4] || (u[4] = m("span", null, "Abstract", -1)),
            et(m("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Zn, s.abstract]
            ])
          ]),
          m("label", null, [
            u[5] || (u[5] = m("span", null, "Text", -1)),
            et(m("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Zn, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, Zy = /* @__PURE__ */ U(Jy, [["__scopeId", "data-v-464d77a8"]]);
function Ji(e, t) {
  const n = E([]), a = E(!1), s = E(null), o = E(0), l = E(!1), i = E("");
  let u = 0, c = 0;
  const f = (k) => {
    if (typeof k.body == "string") return k.body;
    const { term: I, id: x, title: $ } = e(), B = `On ${I} ${x}, ${$}: `;
    return k.text.startsWith(B) ? k.text.slice(B.length) : k.text;
  };
  async function h(k = 1) {
    const { term: I, id: x } = e();
    if (!x) return;
    const $ = ++c;
    l.value = !0, i.value = "";
    try {
      const B = await t([I, "comments", String(x), "--page", String(k), "--page-size", "25"]);
      if ($ !== c) return;
      if (!B.ok) {
        i.value = B.error;
        return;
      }
      const z = B.value.rows ?? [], L = k === 1 ? z : [...n.value, ...z];
      n.value = [...new Map(L.map((w) => [w.id, w])).values()], o.value = B.value.total ?? n.value.length, s.value = B.value.next_page ?? null;
    } catch (B) {
      $ === c && (i.value = B.message);
    } finally {
      $ === c && (l.value = !1);
    }
  }
  async function p(k) {
    var w;
    const { term: I, id: x } = e(), $ = `${I}:${x}`, B = { id: `sending-${++u}`, text: k };
    n.value = [...n.value, B], o.value++, a.value = !0;
    const z = await t([I, "comment", String(x), k]);
    if ($ !== `${e().term}:${e().id}`) return;
    if (!z.ok)
      throw n.value = n.value.filter((H) => H.id !== B.id), o.value = Math.max(0, o.value - 1), new Error(z.error);
    await h();
    const L = (w = z.value) == null ? void 0 : w.id;
    L && !n.value.some((H) => H.id === L) && (n.value = [...n.value, { ...B, id: L }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return me(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function e0(e, t) {
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
const t0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, n0 = ["datetime"], a0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, s0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, o0 = {
  key: 2,
  class: "document-none"
}, l0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(""), l = _(() => s.value ? e0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", t0, [
      e.editing ? (r(), F(pe, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (h) => a("close-revision"))
      }, {
        default: D(() => [...f[1] || (f[1] = [
          K("Close the open revision", -1)
        ])]),
        _: 1
      })) : b("", !0),
      e.revisions.length ? (r(), d(P, { key: 1 }, [
        (r(!0), d(P, null, ne(e.revisions, (h) => (r(), F(pe, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: D(() => [
            K("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, n0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", a0, v(o.value), 1)) : b("", !0),
        s.value ? (r(), d(P, { key: 1 }, [
          A(pe, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: D(() => [...f[2] || (f[2] = [
              K("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", s0, [
            (r(!0), d(P, null, ne(l.value, (h) => (r(), d("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : b("", !0)
      ], 64)) : (r(), d("p", o0, "No revisions"))
    ]));
  }
}, i0 = /* @__PURE__ */ U(l0, [["__scopeId", "data-v-3a381aa4"]]), r0 = "button, [data-comment-number]", u0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Zi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(r0) || n.push(t.currentNode);
  return n;
}
function Jo(e, t, n) {
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
const c0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function d0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Zi(e), s = a.map((c) => c.data).join(""), o = Jo(a, n.startContainer, n.startOffset), l = s.slice(o, Jo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: c0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function f0(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function h0(e, t, n) {
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
function m0({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function p0(e, t) {
  const n = Zi(e), a = f0(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = h0(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(m0).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Fa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Fa(t.number, t.id, t.label)) : l.at(-1).append(Fa(t.number, t.id, t.label))), !0;
}
function g0(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !p0(e, a) && a.id && n.push(a.id);
  return n;
}
const v0 = (e) => e.closest(u0) ?? e;
function Zo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const y0 = {
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
    const a = e, s = n, o = E(null), l = E(null), i = E(null), u = E(!1), c = E(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const I = a.comments.filter((z) => z.quote).map((z) => ({ ...z, label: a.annotationLabel, hot: z.id === a.hot })), x = g0(l.value, a.pending ? [...I, { ...a.pending, pending: !0 }] : I);
      s("lost", x);
      const $ = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!$) {
        c.value = null;
        return;
      }
      const B = document.createElement("div");
      B.className = "inline-comment", v0($).after(B), c.value = B;
    }
    function h() {
      if (!l.value) return;
      const I = d0(l.value);
      if (u.value = !!I, !I) {
        i.value = null;
        return;
      }
      const x = window.getSelection().getRangeAt(0).getBoundingClientRect(), $ = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(x.left - $.left, 0)}px`, top: `${x.top - $.top + o.value.scrollTop}px` }, s("select", I);
    }
    function p(I) {
      const x = I.target.closest("[data-comment-number]");
      x ? s("number", Number(x.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(I) {
      var x;
      (x = l.value.querySelector(`[data-comment="${I}"]`)) == null || x.scrollIntoView({ block: "center" });
    }
    function k(I) {
      var x;
      (x = l.value.querySelectorAll("h3, h4, h5, h6")[I]) == null || x.scrollIntoView({ block: "start" });
    }
    return me(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Me(() => {
      f(), document.addEventListener("selectionchange", h);
    }), nt(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: k, nextTick: Fe }), (I, x) => (r(), d("div", {
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
        style: ge(i.value),
        "data-comment-pill": "",
        onMousedown: x[0] || (x[0] = xe(() => {
        }, ["prevent"])),
        onClick: x[1] || (x[1] = ($) => s("write"))
      }, [
        A(le, {
          name: "chat",
          size: 13
        }),
        x[2] || (x[2] = K("Comment on this", -1))
      ], 36)) : b("", !0),
      c.value ? (r(), F(bn, {
        key: 1,
        to: c.value
      }, [
        re(I.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : b("", !0),
      re(I.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, b0 = /* @__PURE__ */ U(y0, [["__scopeId", "data-v-548d0aaa"]]), k0 = { class: "document-tabs" }, w0 = { class: "document-body" }, $0 = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, x0 = {
  key: 1,
  class: "document-loading"
}, S0 = {
  class: "document-details",
  "data-resource-fields": ""
}, M0 = 760, _0 = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = Se(ti, E(null)), a = E(null), s = av(a), o = _(() => s.value !== null && s.value < M0), l = E(null), i = E(""), u = E([]), c = E([]), f = E(""), h = E("comments"), p = E("text"), y = E(0), k = E(0), I = E([]), x = E(null), $ = E(""), B = E(!1), z = E(null), L = E(null);
    let w = 0;
    const H = Ji(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (oe) => t.read(oe)), j = _(() => Zo(H.comments.value)), q = _(() => h.value === "questions" ? Zo(c.value) : j.value), C = _(() => h.value === "questions" ? q.value.length : H.total.value), T = _(() => {
      var oe;
      return (oe = l.value) != null && oe.body ? Zs(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), M = _(() => {
      var oe;
      return (((oe = l.value) == null ? void 0 : oe.body) ?? "").split(`
`).filter((te) => /^#{1,4} /.test(te)).map((te, ae) => ({ key: String(ae), value: ae, label: te.replace(/^#+ /, "") }));
    }), g = _(() => j.value.find((oe) => oe.id === k.value)), S = _(() => {
      var oe;
      return (oe = l.value) != null && oe.close_reason ? "Closed" : "Open";
    }), O = _(() => p.value === "comments" && !o.value ? "text" : p.value), N = (oe) => oe.ok ? oe.value.rows ?? [] : [];
    async function W() {
      const oe = ++w, te = await t.read([t.term, "inspect", String(t.id)]);
      if (oe !== w) return;
      i.value = te.ok ? "" : te.error, l.value = te.ok ? te.value : null;
      const ae = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), Te = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      oe === w && (c.value = N(ae), f.value = ae.ok ? "" : ae.error, u.value = Te ? N(Te) : []);
    }
    async function V(oe) {
      const te = x.value ? ["--quote", x.value.quote, "--position", String(x.value.position), "--selection-type", x.value.selection_type] : [], ae = await t.read([t.term, "comment", String(t.id), ...te, "--", oe]);
      if (!ae.ok) throw new Error(ae.error);
      x.value = null, await Promise.all([W(), H.load()]);
    }
    async function Q() {
      const oe = await t.read(["doc", "close", String(t.id)]);
      i.value = oe.ok ? "" : oe.error, oe.ok && await W();
    }
    function he() {
      $.value.trim() || (x.value = null);
    }
    function ve(oe) {
      var te;
      if (y.value = oe, o.value && h.value === "questions") {
        p.value = "comments";
        return;
      }
      o.value ? k.value = k.value === oe ? 0 : oe : (te = a.value.querySelector(h.value === "questions" ? `[data-question-id="${oe}"]` : `[data-comment-id="${oe}"]`)) == null || te.scrollIntoView({ block: "nearest" });
    }
    async function ye(oe) {
      var te, ae;
      p.value = "text", y.value = oe, await ((te = z.value) == null ? void 0 : te.nextTick()), (ae = z.value) == null || ae.show(oe);
    }
    function _e() {
      B.value = !1, W();
    }
    return me(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", y.value = 0, k.value = 0, x.value = null, c.value = [], f.value = "", W();
    }, { immediate: !0 }), me(h, () => {
      y.value = 0, k.value = 0;
    }), (oe, te) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), F(bn, {
        key: 0,
        to: R(n),
        disabled: !R(n)
      }, [
        m("span", {
          class: Y(["document-actions", { placed: R(n) }]),
          "data-document-actions": ""
        }, [
          A(pe, {
            bordered: "",
            "data-text-edit": "",
            onClick: te[0] || (te[0] = (ae) => B.value = !0)
          }, {
            default: D(() => [...te[14] || (te[14] = [
              K("Edit", -1)
            ])]),
            _: 1
          }),
          O.value === "text" && M.value.length > 1 ? (r(), F(Ui, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: M.value,
            "data-text-chapters": "",
            onPick: te[1] || (te[1] = (ae) => {
              var Te;
              return (Te = z.value) == null ? void 0 : Te.showHeading(ae.value);
            })
          }, null, 8, ["label", "items"])) : b("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : b("", !0),
      m("nav", k0, [
        m("button", {
          type: "button",
          class: Y(["document-tab-button", { on: O.value === "text" }]),
          "data-document-tab": "text",
          onClick: te[2] || (te[2] = (ae) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: O.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: te[3] || (te[3] = (ae) => p.value = "comments")
        }, [
          K(v(h.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(C.value || ""), 1)
        ], 2)) : b("", !0),
        e.term === "doc" ? (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: O.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: te[4] || (te[4] = (ae) => p.value = "revisions")
        }, [
          te[15] || (te[15] = K("Revisions ", -1)),
          m("em", null, v(u.value.length || ""), 1)
        ], 2)) : b("", !0)
      ]),
      m("div", w0, [
        i.value ? (r(), d("p", $0, v(i.value), 1)) : l.value ? O.value === "revisions" ? (r(), F(i0, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: Q,
          onRestored: W
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : O.value === "comments" ? (r(), F(Xo, {
          key: 3,
          mode: h.value,
          "onUpdate:mode": te[5] || (te[5] = (ae) => h.value = ae),
          tab: "",
          comments: j.value,
          questions: c.value,
          hot: y.value,
          lost: I.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!R(H).nextPage.value,
          "comment-loading": R(H).loading.value,
          "comment-failure": R(H).failure.value,
          "comment-total": R(H).total.value,
          onMore: R(H).loadMore,
          onShow: ye,
          onChanged: W
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(P, { key: 4 }, [
          A(b0, {
            ref_key: "words",
            ref: z,
            html: T.value,
            comments: q.value,
            "annotation-label": h.value === "questions" ? "Question" : "Comment",
            hot: y.value,
            pending: x.value,
            inline: k.value,
            onSelect: te[7] || (te[7] = (ae) => x.value = ae),
            onClear: he,
            onNumber: ve,
            onWrite: te[8] || (te[8] = (ae) => {
              var Te;
              return (Te = L.value) == null ? void 0 : Te.focus();
            }),
            onLost: te[9] || (te[9] = (ae) => I.value = ae)
          }, {
            inline: D(() => [
              g.value ? (r(), F(Gi, {
                key: 0,
                comment: g.value,
                hot: "",
                onShow: te[6] || (te[6] = (ae) => ye(g.value.id))
              }, null, 8, ["comment"])) : b("", !0)
            ]),
            default: D(() => [
              m("dl", S0, [
                te[17] || (te[17] = m("h4", null, "Details", -1)),
                te[18] || (te[18] = m("dt", null, "State", -1)),
                m("dd", null, v(S.value), 1),
                l.value.close_reason ? (r(), d(P, { key: 0 }, [
                  te[16] || (te[16] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(l.value.close_reason), 1)
                ], 64)) : b("", !0),
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
          o.value ? b("", !0) : (r(), F(Xo, {
            key: 0,
            mode: h.value,
            "onUpdate:mode": te[10] || (te[10] = (ae) => h.value = ae),
            comments: j.value,
            questions: c.value,
            hot: y.value,
            lost: I.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!R(H).nextPage.value,
            "comment-loading": R(H).loading.value,
            "comment-failure": R(H).failure.value,
            "comment-total": R(H).total.value,
            onMore: R(H).loadMore,
            onShow: ye,
            onChanged: W
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (r(), d("div", x0, [
          A(Qe)
        ]))
      ]),
      l.value ? (r(), F(vv, {
        key: 1,
        ref_key: "composer",
        ref: L,
        draft: $.value,
        "onUpdate:draft": te[11] || (te[11] = (ae) => $.value = ae),
        selection: x.value,
        send: V,
        narrow: o.value,
        onClear: te[12] || (te[12] = (ae) => x.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : b("", !0),
      B.value ? (r(), F(Zy, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: te[13] || (te[13] = (ae) => B.value = !1),
        onSaved: _e
      }, null, 8, ["term", "id", "row", "read"])) : b("", !0)
    ], 512));
  }
}, k6 = /* @__PURE__ */ U(_0, [["__scopeId", "data-v-c33a5a33"]]), C0 = {
  key: 1,
  class: "row-list-failure"
}, E0 = ["data-row"], A0 = {
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
    const t = e, n = _(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = E(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), F(Qe, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", C0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), F(rn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: D(() => [
        K(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(P, { key: 3 }, [
      (r(), F(Ke(e.arrival || e.moves ? Ps : "ul"), De(n.value, { class: "row-list" }), {
        default: D(() => [
          (r(!0), d(P, null, ne(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            re(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, E0))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : b("", !0)
    ], 64));
  }
}, O0 = /* @__PURE__ */ U(A0, [["__scopeId", "data-v-e9f251f3"]]), T0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, I0 = {
  key: 1,
  class: "agent-rows-note"
}, B0 = {
  key: 2,
  class: "agent-rows-note"
}, R0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, L0 = ["data-agent-row", "onClick"], N0 = { class: "agent-row-name" }, q0 = { class: "agent-row-state" }, D0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = _(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = _(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", T0, [
      e.loaded ? e.failure ? (r(), d("p", I0, v(e.failure), 1)) : e.rows.length ? (r(), d(P, { key: 3 }, [
        m("p", R0, v(a.value) + " running", 1),
        (r(!0), d(P, null, ne(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => R(je)(`agents:${l.id}`)
        }, [
          m("span", N0, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", q0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, L0))), 128))
      ], 64)) : (r(), d("p", B0, v(e.none), 1)) : (r(), F(Qe, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, w6 = /* @__PURE__ */ U(D0, [["__scopeId", "data-v-a01e5a17"]]), ft = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ge = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, ze = { across: 48, down: 110, margin: 32, labelSpace: 14 }, P0 = 6;
function oo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const j0 = (e) => {
  const t = oo(e, ft.lineChars), n = Math.max(ft.minWidth, Math.max(...t.map((a) => a.length)) * ft.charWidth + ft.padX * 2);
  return { name: e, lines: t, line: ft.line, padY: ft.padY, width: n, height: t.length * ft.line + ft.padY * 2 };
};
function F0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function W0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function H0(e, t, n) {
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
  for (let l = 0; l < P0; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function z0(e, t) {
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
function U0(e) {
  const t = [...new Set(e.flatMap(([L, w]) => [L, w]))], n = new Set(e.map(([, L]) => L)), a = t.filter((L) => !n.has(L)), s = F0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((L, w) => !s.has(w)), l = W0(t, o), i = H0(t, o, l), u = new Map(t.map((L) => [L, j0(L)])), c = i.map((L) => L.reduce((w, H) => w + u.get(H).width, 0) + ze.across * (L.length - 1)), f = Math.max(...c) + ze.margin * 2, h = V0(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = ze.margin;
  i.forEach((L, w) => {
    let H = (f - c[w]) / 2;
    const j = Math.max(...L.map((q) => u.get(q).height));
    L.forEach((q) => {
      const C = u.get(q);
      p.set(q, { ...C, x: H, y: y + (j - C.height) / 2 }), H += C.width + ze.across;
    }), y += j + (h[w] ?? ze.down);
  });
  const k = e.map(([L, w, H], j) => ({ from: L, to: w, label: H || "", back: s.has(j) || l.get(w) <= l.get(L) }));
  z0(k, p);
  const I = k.map((L) => K0(L, p.get(L.from), p.get(L.to))), x = [...p.values()], $ = J0(I, x), B = Math.max(y - ze.down, ...$.filter((L) => L.label).map((L) => L.label.y + L.label.height));
  return { width: Math.max(f - ze.margin, ...$.filter((L) => L.label).map((L) => L.label.x + L.label.width)) + ze.margin, height: B + ze.margin, nodes: x, arrows: $ };
}
const G0 = (e) => e ? oo(e, Ge.lineChars).length * Ge.line + Ge.pad * 2 : 0;
function V0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => ze.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += G0(l) + ze.labelSpace);
  }), a.map((s) => Math.max(ze.down, s));
}
function K0(e, t, n) {
  const a = e.label ? oo(e.label, Ge.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ge.charWidth + Ge.pad * 2 : 0, o = a.length * Ge.line + (a.length ? Ge.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const Y0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Q0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], X0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ge.line);
function J0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = Y0(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = X0.flatMap((u) => Q0.map((c) => s(c, u))).find((u) => !n.some((c) => el(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => el(i, u)); ) i.y += Ge.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ge.line, pad: Ge.pad } };
  });
}
const el = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Z0 = { class: "flowchart-tools" }, eb = ["width", "height", "viewBox", "aria-label"], tb = ["d"], nb = ["x", "y", "width", "height"], ab = ["x", "y"], sb = ["x", "dy"], ob = {
  key: 0,
  class: "flowchart-label"
}, lb = ["x", "y", "width", "height"], ib = ["x", "y"], rb = ["x", "dy"], ub = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => U0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = E(null), i = E({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var $;
      const I = ($ = l.value) == null ? void 0 : $.getBoundingClientRect();
      if (!(I != null && I.width)) return;
      const x = Math.min(I.width / s.value.width, I.height / s.value.height, 1.5);
      i.value = { zoom: x, x: (I.width - s.value.width * x) / 2, y: (I.height - s.value.height * x) / 2 };
    }
    function f(I, x, $) {
      const { zoom: B, x: z, y: L } = i.value, w = Math.min(o.most, Math.max(o.least, B * I));
      i.value = { zoom: w, x: x - (x - z) * w / B, y: $ - ($ - L) * w / B };
    }
    function h(I) {
      const x = l.value.getBoundingClientRect();
      f(I, x.width / 2, x.height / 2);
    }
    function p(I) {
      const x = l.value.getBoundingClientRect();
      I.ctrlKey || I.metaKey ? f(I.deltaY < 0 ? o.step : 1 / o.step, I.clientX - x.left, I.clientY - x.top) : i.value = { ...i.value, x: i.value.x - I.deltaX, y: i.value.y - I.deltaY };
    }
    function y(I) {
      var x, $, B;
      I.preventDefault(), (x = window.getSelection()) == null || x.removeAllRanges(), u = { x: I.clientX - i.value.x, y: I.clientY - i.value.y }, (B = ($ = l.value).setPointerCapture) == null || B.call($, I.pointerId);
    }
    function k(I) {
      u && (i.value = { ...i.value, x: I.clientX - u.x, y: I.clientY - u.y });
    }
    return Me(c), (I, x) => (r(), F(ya, {
      padded: "",
      title: e.title,
      large: "",
      onClose: x[4] || (x[4] = ($) => a("close"))
    }, {
      default: D(() => [
        m("div", Z0, [
          A(pe, {
            small: "",
            onClick: x[0] || (x[0] = ($) => h(o.step))
          }, {
            default: D(() => [...x[5] || (x[5] = [
              K("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(pe, {
            small: "",
            onClick: x[1] || (x[1] = ($) => h(1 / o.step))
          }, {
            default: D(() => [...x[6] || (x[6] = [
              K("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(pe, {
            small: "",
            onClick: c
          }, {
            default: D(() => [...x[7] || (x[7] = [
              K("Fit the whole chart", -1)
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
          onPointermove: k,
          onPointerup: x[2] || (x[2] = ($) => So(u) ? u.value = null : u = null),
          onPointercancel: x[3] || (x[3] = ($) => So(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (r(!0), d(P, null, ne(s.value.arrows, ($, B) => (r(), d("path", {
              key: `arrow-${B}`,
              class: "flowchart-arrow",
              d: $.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, tb))), 128)),
            (r(!0), d(P, null, ne(s.value.nodes, ($) => (r(), d("g", {
              key: $.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: $.x,
                y: $.y,
                width: $.width,
                height: $.height,
                rx: "8"
              }, null, 8, nb),
              m("text", {
                x: $.x + $.width / 2,
                y: $.y + $.padY + $.line / 2
              }, [
                (r(!0), d(P, null, ne($.lines, (B, z) => (r(), d("tspan", {
                  key: z,
                  x: $.x + $.width / 2,
                  dy: z ? $.line : 0
                }, v(B), 9, sb))), 128))
              ], 8, ab)
            ]))), 128)),
            (r(!0), d(P, null, ne(s.value.arrows, ($, B) => (r(), d(P, {
              key: `label-${B}`
            }, [
              $.label ? (r(), d("g", ob, [
                m("rect", {
                  x: $.label.x,
                  y: $.label.y,
                  width: $.label.width,
                  height: $.label.height,
                  rx: "4"
                }, null, 8, lb),
                m("text", {
                  x: $.label.x + $.label.width / 2,
                  y: $.label.y + $.label.pad + $.label.line / 2
                }, [
                  (r(!0), d(P, null, ne($.label.lines, (z, L) => (r(), d("tspan", {
                    key: L,
                    x: $.label.x + $.label.width / 2,
                    dy: L ? $.label.line : 0
                  }, v(z), 9, rb))), 128))
                ], 8, ib)
              ])) : b("", !0)
            ], 64))), 128))
          ], 12, eb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, cb = /* @__PURE__ */ U(ub, [["__scopeId", "data-v-e98799dc"]]), db = ["innerHTML"], fb = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = _(() => Io[t.name] || Io.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, db));
  }
}, Et = /* @__PURE__ */ U(fb, [["__scopeId", "data-v-beb5935c"]]), hb = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(Et, { name: "fold" })
    ], 2));
  }
}, Kt = /* @__PURE__ */ U(hb, [["__scopeId", "data-v-d03899bb"]]), mb = ["data-tip", "aria-label"], pb = {
  key: 0,
  class: "mact-word"
}, gb = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(Et, { name: "open" }),
      e.open ? (r(), d("span", pb, v(e.label), 1)) : b("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, mb));
  }
}, er = /* @__PURE__ */ U(gb, [["__scopeId", "data-v-3b292e09"]]), tr = 120, Vn = 280, nr = 160, vb = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, yb = ["leaving", "resizing", "entering"];
function Ms(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function bb(e) {
  const t = yb.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Ms(e);
  return e.classList.add(...t), n;
}
function ar(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = E(t()), s = E("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function u(h, p) {
    i(h);
    const y = bb(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Vn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Vn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const k = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, u(h, Ms(h)));
    });
    return k.observe(p), k;
  }
  async function f(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || vb()) {
      a.value = h;
      return;
    }
    const k = Ms(p);
    if (l(p, k), s.value = "leaving", await n(tr), y !== o) return;
    a.value = h, s.value = "resizing", await Fe(), u(p, k);
    const I = c(p);
    await n(Vn), I == null || I.disconnect(), y === o && (i(p), s.value = "entering", await n(nr), y === o && (s.value = ""));
  }
  return me(t, (h) => f(h)), nt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const kb = { class: "growing-card-top" }, wb = ["aria-expanded"], $b = { class: "growing-card-avatar" }, xb = { class: "growing-card-title" }, Sb = { class: "growing-card-more" }, Mb = { class: "growing-card-body" }, _b = {
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
    const n = e, a = t, s = E(!1), o = E(null), { folded: l, phase: i } = ar(o, () => !s.value), u = _(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = _(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, h) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", R(i), { open: !R(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", kb, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", $b, [
            e.bad ? (r(), F(Et, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(P, { key: 1 }, [
              K(v(u.value), 1)
            ], 64)) : (r(), F(le, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", xb, v(e.title), 1),
          A(Kt, { open: s.value }, null, 8, ["open"])
        ], 8, wb),
        e.action ? (r(), F(er, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : b("", !0),
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
        ])) : b("", !0)
      ]),
      m("div", Sb, [
        m("div", Mb, [
          (r(!0), d(P, null, ne(c.value, (p, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Cb = /* @__PURE__ */ U(_b, [["__scopeId", "data-v-f2b4930d"]]), Eb = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Ab = { class: "md inline" }, Ob = ["disabled", "title", "onClick"], Tb = {
  key: 1,
  class: "message-links-many"
}, Ib = ["aria-expanded"], Bb = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Rb = ["disabled", "onClick"], Lb = { class: "row-pill message-links-chip" }, Nb = { class: "message-links-title" }, qb = { key: 0 }, Wa = 3, Db = "task", Pb = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => n.total || n.links.length), o = _(() => n.links.every((p) => p.endpoint.model === Db) ? "tasks" : "items"), l = E(!1), i = E(null);
    ai(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, je(p.endpoint.open_ref));
    }
    return (p, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Wa, three: s.value === Wa, open: l.value }]),
      "data-message-links": ""
    }, [
      A(Et, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", Eb, [
        m("span", Ab, [
          y[1] || (y[1] = K("Linked: ", -1)),
          (r(!0), d(P, null, ne(e.links, (k) => (r(), d("button", {
            key: `${k.endpoint.model}:${k.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(k),
            title: k.endpoint.title,
            onClick: (I) => h(k)
          }, [
            K(v(k.endpoint.model.replaceAll("_", " ")) + " " + v(k.endpoint.id), 1),
            f(k) ? (r(), d(P, { key: 0 }, [
              K(" (" + v(f(k)) + ")", 1)
            ], 64)) : b("", !0),
            c(k) ? (r(), d(P, { key: 1 }, [
              K(" (unavailable)")
            ], 64)) : b("", !0)
          ], 8, Ob))), 128))
        ])
      ])) : b("", !0),
      s.value >= Wa ? (r(), d("span", Tb, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          K(v(s.value) + " linked " + v(o.value) + " ", 1),
          A(Kt, { open: l.value }, null, 8, ["open"])
        ], 8, Ib)
      ])) : b("", !0),
      l.value ? (r(), d("div", Bb, [
        (r(!0), d(P, null, ne(e.links, (k) => (r(), d("button", {
          key: `${k.endpoint.model}:${k.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(k),
          onClick: (I) => h(k)
        }, [
          m("span", Lb, v(k.endpoint.model.replaceAll("_", " ")) + " " + v(k.endpoint.id), 1),
          m("span", Nb, v(k.endpoint.title), 1),
          m("span", null, v(f(k)), 1),
          c(k) ? (r(), d("span", qb, "Unavailable")) : b("", !0)
        ], 8, Rb))), 128))
      ])) : b("", !0),
      A(kn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (k) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, jb = /* @__PURE__ */ U(Pb, [["__scopeId", "data-v-14ec7c9a"]]), Fb = ["title", "aria-label"], Wb = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Hb = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, zb = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = _(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: Y(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", Wb, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Hb)) : b("", !0)
      ]))
    ], 10, Fb));
  }
}, Ub = /* @__PURE__ */ U(zb, [["__scopeId", "data-v-6dc92808"]]), Gb = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Vb = (e) => e.worker_id != null ? "report" : "message", Kb = (e) => Gb[Vb(e)], Yb = "img,pre,table";
function Qb(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Xb(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Jb(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Yb)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Qb(Xb(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Zb(e, t) {
  let n = null;
  const a = () => e.value && Jb(e.value);
  Me(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
}
const ek = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function tk(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Dn = /* @__PURE__ */ new WeakMap(), Ne = "work", Je = "sent", nk = 50, tl = 50, nl = () => ({ rows: E([]), total: E(0), next: E(null), loading: E(!1), failure: E(""), version: 0 });
function ak(e) {
  var I;
  if (Dn.has(e)) return Dn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (x) => {
    var $;
    return (($ = e.visible) == null ? void 0 : $.value) !== !1 && [...x.views].some((B) => B.visible);
  };
  function o(x, $) {
    const B = x[$], z = ++B.version;
    return B.loading.value = !0, B.failure.value = "", z;
  }
  function l(x, $, B, z, L) {
    const w = x[$];
    if (t.get(x.id) !== x || w.version !== B) return;
    if (w.loading.value = !1, !L.ok) {
      w.failure.value = L.error;
      return;
    }
    const H = $ === Ne ? L.value.counterparts ?? [] : L.value.rows ?? [], j = z === 1 ? H : [...w.rows.value, ...H], q = $ === Ne ? (C) => `${C.endpoint.model}:${C.endpoint.id}` : (C) => C.id ?? C.target_id;
    w.rows.value = [...new Map(j.map((C) => [q(C), C])).values()], w.total.value = L.value.total ?? w.rows.value.length, w.next.value = L.value.next_page ?? null;
  }
  function i(x, $, B, z) {
    const L = x[$];
    L.version === B && (L.failure.value = z.message, L.loading.value = !1);
  }
  async function u(x, $, B) {
    const z = o(x, $), L = $ === Ne ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(x, $, z, B, await e.read(`link list --source message:${x.id} ${L} --page ${B} --page-size ${$ === Ne ? 10 : 25}`));
    } catch (w) {
      i(x, $, z, w);
    }
  }
  async function c(x) {
    const $ = x.map((B) => ({ [Ne]: o(B, Ne), [Je]: o(B, Je) }));
    try {
      const B = await e.read(`link receipts --messages ${x.map((z) => z.id).join(",")}`);
      x.forEach((z, L) => {
        const w = B.ok ? B.value.messages[String(z.id)] : null;
        l(z, Ne, $[L][Ne], 1, B.ok ? { ok: !0, value: w.named } : B), l(z, Je, $[L][Je], 1, B.ok ? { ok: !0, value: w.sent } : B);
      });
    } catch (B) {
      x.forEach((z, L) => [Ne, Je].forEach((w) => i(z, w, $[L][w], B)));
    }
  }
  function f() {
    a = null;
    const x = [...n].map(($) => t.get($)).filter(($) => $ && s($));
    n.clear(), x.forEach(($) => $.dirty.clear());
    for (let $ = 0; $ < x.length; $ += tl) c(x.slice($, $ + tl));
  }
  function h(x, $ = [Ne, Je]) {
    for (const B of $) x.dirty.add(B);
    s(x) && (n.add(x.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(x) {
    const $ = x.sources ?? (x.source_model && Number.isInteger(x.source_id) ? [{ model: x.source_model, id: x.source_id }] : []), B = x.link_types ?? (x.link_type ? [x.link_type] : []), z = B.length ? [Ne, Je].filter((w) => w === Ne ? B.some((H) => ["about", "edited"].includes(H)) : B.includes("sent_to")) : [Ne, Je];
    if (!z.length) return;
    const L = $.length ? [...new Set($.filter((w) => w.model === "message").map((w) => w.id))].map((w) => t.get(w)).filter(Boolean) : [...t.values()].filter(s).slice(0, nk);
    for (const w of L) h(w, z);
  }
  const y = (I = e.follow) == null ? void 0 : I.call(e, ["link.*"], p), k = {
    attach(x, $) {
      let B = t.get(x);
      return B || (B = { id: x, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ne, Je]), work: nl(), sent: nl() }, t.set(x, B)), B.views.add($), B.dirty.size && h(B, [...B.dirty]), B;
    },
    shown(x) {
      x.dirty.size && h(x, [...x.dirty]);
    },
    detach(x, $) {
      x.views.delete($), x.views.size || t.delete(x.id), t.size || (clearTimeout(a), y == null || y(), Dn.delete(e));
    },
    more(x, $) {
      const B = x == null ? void 0 : x[$];
      if (B != null && B.next.value && !B.loading.value) return u(x, $, B.next.value);
    }
  };
  return Dn.set(e, k), k;
}
function sk(e, t, n) {
  const a = Ze(null);
  let s = null;
  const o = me(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = ak(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((k) => k.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = me(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), h == null || h.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return pa(o), {
    links: _(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: _(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: _(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: _(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: _(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: _(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
    }),
    sentMore: _(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: _(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: _(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ne),
    loadSent: () => s == null ? void 0 : s.more(a.value, Je)
  };
}
const ok = ["data-incoming", "data-ref"], lk = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], ik = { class: "message-body" }, rk = ["title"], uk = ["innerHTML"], ck = ["innerHTML"], dk = {
  class: "message-faces",
  "data-message-faces": ""
}, fk = ["title", "data-face", "onClick"], hk = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, mk = ["title", "data-reaction", "onClick"], pk = {
  key: 0,
  class: "message-reaction-count"
}, gk = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, vk = ["href", "title"], yk = ["src", "alt"], bk = ["href"], kk = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, wk = { class: "message-foot" }, $k = { class: "message-time" }, xk = {
  class: "message-id",
  "data-message-id": ""
}, Sk = 1500, Mk = "An earlier message", _k = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E(null), l = _(() => ["user", "comment"].includes(n.message.type)), i = _(() => {
      const [oe, te] = (n.message.commented_row || ":").split(":"), ae = gt(oe);
      return ae ? { ref: `${ae}:${te}`, label: `${Vt(ae).title.toLowerCase()} ${te}` } : null;
    }), u = _(() => n.message.worker_id ?? null), c = _(() => Kb(n.message)), f = _(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var oe;
      await ((oe = navigator.clipboard) == null ? void 0 : oe.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Sk);
    }
    const p = Ti(), y = _(() => p(n.message.text ?? "")), k = _(() => JSON.parse(n.message.flowchart_edges || "[]")), I = E(!1), x = _(() => ws(n.quote)), $ = _(() => p(x.value || Mk));
    function B() {
      const oe = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      oe ? oe.scrollIntoView({ block: "center", behavior: "smooth" }) : je(`messages:${n.message.parent_id}`);
    }
    Zb(o, () => `${n.message.text} ${x.value}`);
    const z = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, L = (oe) => `/api/files/message/${n.message.id}/${encodeURIComponent(oe)}`, w = _(() => JSON.parse(n.message.captions || "{}")), H = _(() => (n.message.files ?? []).map((oe) => ({ name: oe, address: L(oe), isImage: z.test(oe), title: w.value[oe] || oe }))), j = _(() => ji(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), q = Se(Le, null), { links: C, total: T, more: M, loading: g, failure: S, sentTo: O, sentMore: N, sentLoading: W, sentFailure: V, loadMore: Q, loadSent: he } = sk(q, () => l.value && !n.message.local ? n.message.id : null, o), ve = E(!1), ye = _(() => tk(n.message.reactions));
    function _e(oe) {
      ve.value = !1, a("react", n.message, oe);
    }
    return (oe, te) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(Cb, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: te[0] || (te[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, ok)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", ik, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: te[5] || (te[5] = (...ae) => R(Nt) && R(Nt)(...ae))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: te[1] || (te[1] = xe((ae) => R(je)(i.value.ref), ["stop"]))
          }, [
            A(le, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, rk)) : b("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(B, ["stop"]),
            innerHTML: $.value
          }, null, 8, uk)) : b("", !0),
          u.value !== null ? (r(), F(dn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: te[2] || (te[2] = xe((ae) => R(je)(`agents:${u.value}`), ["stop"]))
          }, {
            default: D(() => [
              K("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : b("", !0),
          A(Mi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: D(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, ck)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          k.value.length ? (r(), d(P, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: te[3] || (te[3] = (ae) => I.value = !0)
            }, "Open the flowchart"),
            I.value ? (r(), F(cb, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: te[4] || (te[4] = (ae) => I.value = !1)
            }, null, 8, ["title", "edges"])) : b("", !0)
          ], 64)) : b("", !0)
        ], 2),
        m("div", {
          class: Y(["message-tools", { picking: ve.value }]),
          "data-message-tools": ""
        }, [
          ve.value ? (r(), d(P, { key: 0 }, [
            m("div", dk, [
              (r(!0), d(P, null, ne(R(ek), (ae) => (r(), d("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Te) => _e(ae)
              }, v(ae), 9, fk))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: te[6] || (te[6] = (ae) => ve.value = !1)
            }, [
              A(le, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(P, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: te[7] || (te[7] = (ae) => ve.value = !0)
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
            }, "Delete")) : b("", !0)
          ], 64))
        ], 2)
      ]),
      ye.value.length ? (r(), d("div", hk, [
        (r(!0), d(P, null, ne(ye.value, (ae) => (r(), d("button", {
          key: ae.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Te) => a("react", e.message, ae.emoji)
        }, [
          K(v(ae.emoji) + " ", 1),
          ae.count > 1 ? (r(), d("span", pk, v(ae.count), 1)) : b("", !0)
        ], 10, mk))), 128))
      ])) : b("", !0),
      H.value.length ? (r(), d("div", gk, [
        (r(!0), d(P, null, ne(H.value, (ae) => (r(), d(P, {
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
            }, null, 8, yk)
          ], 8, vk)) : (r(), d("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, v(ae.name), 9, bk))
        ], 64))), 128))
      ])) : b("", !0),
      R(O).length ? (r(), d("div", kk, [
        A(le, {
          name: "send",
          size: 12
        }),
        (r(!0), d(P, null, ne(R(O), (ae) => (r(), F(dn, {
          key: ae.id,
          as: "button",
          "agent-id": ae.id,
          label: `Worker ${ae.id}`,
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          onClick: xe((Te) => ae.open_ref && R(je)(ae.open_ref), ["stop"])
        }, {
          default: D(() => [
            K("Also sent to worker " + v(ae.id), 1),
            ae.unavailable ? (r(), d(P, { key: 0 }, [
              K(" (unavailable)")
            ], 64)) : b("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : b("", !0),
      A(kn, {
        more: R(N),
        loading: R(W),
        failure: R(V),
        label: "More recipients",
        onMore: R(he)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", wk, [
        m("time", $k, v(j.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(P, { key: 0 }, [
          te[10] || (te[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", xk, "message " + v(e.message.id), 1)
        ], 64)) : b("", !0),
        l.value ? (r(), F(Ub, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : b("", !0)
      ]),
      R(C).length || R(S) ? (r(), F(jb, {
        key: 3,
        links: R(C),
        total: R(T),
        more: R(M),
        loading: R(g),
        failure: R(S),
        onMore: R(Q)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : b("", !0)
    ], 8, lk));
  }
}, $6 = /* @__PURE__ */ U(_k, [["__scopeId", "data-v-82f2c98a"]]), la = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ha = 200, sr = (e) => {
  var t;
  return ((t = la.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? la[0].key;
}, x6 = (e) => {
  var t;
  return ((t = la.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Ck = ["aria-label"], Ek = 300, al = 400, Ak = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ha } },
  setup(e) {
    const t = e, n = _(() => sr(t.value)), a = _(() => n.value < Ha ? [1, 0.25, 0.25] : n.value === Ha ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= al, high: n.value >= Ek && n.value < al }]),
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
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, Ck));
  }
}, S6 = /* @__PURE__ */ U(Ak, [["__scopeId", "data-v-b10e610f"]]), or = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], M6 = (e) => {
  const t = or[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, Ok = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, sl = (e) => Ok[e.card.state] || "idle", Tk = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), ol = { working: 0, waiting: 1, idle: 2, stopped: 3 }, ll = (e, t) => ol[sl(e)] - ol[sl(t)], il = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, _6 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => ll(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Tk(a, s)) : [...e].sort((a, s) => ll(a, s) || (il[t] || il.state)(a, s)), Ik = { class: "list-row" }, Bk = {
  key: 0,
  class: "list-row-type"
}, Rk = { class: "list-row-main" }, Lk = {
  key: 0,
  class: "list-row-title"
}, Nk = { class: "list-row-body" }, qk = {
  key: 1,
  class: "list-row-end"
}, Dk = {
  key: 1,
  class: "list-row-text"
}, Pk = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Ik, [
      e.type ? (r(), d("span", Bk, v(e.type), 1)) : b("", !0),
      m("div", Rk, [
        e.title ? (r(), d("span", Lk, v(e.title), 1)) : b("", !0),
        m("div", Nk, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", qk, [
          re(t.$slots, "end", {}, void 0, !0)
        ])) : b("", !0)
      ]),
      e.text ? (r(), d("span", Dk, v(e.text), 1)) : b("", !0)
    ]));
  }
}, C6 = /* @__PURE__ */ U(Pk, [["__scopeId", "data-v-dfc8c3a7"]]), E6 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = _(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, i) => (r(), F(Ui, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, jk = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, _s = /* @__PURE__ */ U(jk, [["__scopeId", "data-v-978e0921"]]), Fk = ["aria-label"], Wk = { class: "head" }, Hk = { class: "names" }, zk = { class: "body" }, Uk = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = mi(a, n), i = pi(s);
    return (u, c) => (r(), F(bn, { to: "body" }, [
      A(Ut, {
        name: "side",
        appear: "",
        onAfterLeave: R(l)
      }, {
        default: D(() => [
          R(s) ? (r(), d("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: R(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...f) => R(o) && R(o)(...f), ["self"]))
          }, [
            m("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(P, { key: 0 }, [
                m("header", Wk, [
                  m("div", Hk, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (r(), F(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : b("", !0),
                    re(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  re(u.$slots, "actions", {}, void 0, !0),
                  A(va, {
                    title: e.closeLabel,
                    onClick: R(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), F(_s, { key: 0 }, {
                  default: D(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : b("", !0),
                m("div", zk, [
                  re(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), F(_s, {
                  key: 1,
                  class: "below"
                }, {
                  default: D(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : b("", !0)
              ], 64)) : re(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, Fk)
          ], 6)) : b("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, A6 = /* @__PURE__ */ U(Uk, [["__scopeId", "data-v-d0a677ef"]]), Gk = {
  key: 1,
  class: "text-field-label"
}, Vk = {
  key: 2,
  class: "text-field-end"
}, Kk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ jt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = ln(e, "modelValue"), a = ma(), s = "onUpdate:modelValue" in (((f = iu()) == null ? void 0 : f.vnode.props) || {}), o = _(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = _(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), u = _(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = E(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (r(), d("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, R(a).class]),
      style: ge(R(a).style)
    }, [
      e.icon ? (r(), F(le, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : b("", !0),
      e.label ? (r(), d("span", Gk, v(e.label), 1)) : b("", !0),
      et(m("input", De({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [R(vs), o.value]
      ]),
      h.$slots.end ? (r(), d("span", Vk, [
        re(h.$slots, "end", {}, void 0, !0)
      ])) : b("", !0)
    ], 6)) : et((r(), d("input", De({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [R(vs), o.value]
    ]);
  }
}), O6 = /* @__PURE__ */ U(Kk, [["__scopeId", "data-v-d9c38ca8"]]), Yk = { class: "title" }, Qk = { class: "state" }, Xk = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ds(t.line, t.events);
    return (o, l) => (r(), F(O0, {
      rows: R(n),
      failure: R(a),
      loaded: R(s),
      empty: e.empty
    }, {
      default: D(({ row: i }) => [
        m("span", Yk, v(i.title), 1),
        m("span", Qk, v(R(un)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, T6 = /* @__PURE__ */ U(Xk, [["__scopeId", "data-v-6be0c59e"]]);
function Jk(e = 1e3, t = null) {
  const n = E(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const za = E(Date.now() / 1e3);
let rl = 0, Pn = 0;
function lo() {
  return Pn || (za.value = Date.now() / 1e3, rl = setInterval(() => za.value = Date.now() / 1e3, 1e3)), Pn += 1, jl() && pa(() => {
    Pn -= 1, Pn || clearInterval(rl);
  }), za;
}
const Zk = 200, ew = tr + Vn + nr + Zk, tw = 300, jn = /* @__PURE__ */ new WeakMap();
function nw(e, t) {
  const n = jn.get(e) ?? [];
  jn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = jn.get(e);
    jn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, tw);
}
function Qt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function aw(e, t, n) {
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
function sw(e, t, n, a) {
  me(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(aw(o, l, n.value)), performance.now() - l < ew) return void requestAnimationFrame(u);
        nw(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const ow = ["title", "data-figure-mark", "data-folded", "data-open"], lw = {
  key: 2,
  class: "worker"
}, iw = { class: "head" }, rw = { key: 0 }, uw = {
  key: 3,
  class: "status"
}, cw = {
  key: 0,
  class: "figure"
}, dw = {
  class: "figure-decimal",
  "data-figure-decimal": ""
}, fw = {
  key: 1,
  class: "ran-for"
}, hw = { key: 2 }, mw = {
  key: 3,
  class: "news"
}, pw = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, gw = {
  key: 6,
  class: "settled"
}, vw = {
  key: 1,
  class: "bar"
}, yw = {
  key: 3,
  class: "detail body"
}, bw = {
  key: 0,
  class: "body-label"
}, kw = ["title"], ww = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ma(), a = ["onClick", "onAct"], s = _(() => Object.fromEntries(Object.entries(n).filter(([ye]) => !a.includes(ye)))), o = E(!1), l = _(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = _(() => t.open !== void 0), u = _(() => i.value || l.value), c = _(() => i.value ? t.open : o.value), f = _(() => i.value ? !t.open : l.value && !o.value), h = _(() => !!(t.mark.action && n.onAct)), p = _(() => u.value || h.value || !!n.onClick), y = E(null), k = E(null), { folded: I, phase: x } = ar(y, () => f.value);
    sw(y, f, x, Se(Le, null));
    function $(ye) {
      var _e, oe;
      if (!(ye.target !== y.value && !k.value.contains(ye.target))) {
        if (i.value) return (_e = n.onClick) == null ? void 0 : _e.call(n, ye);
        if (l.value) return void (o.value = !o.value);
        (oe = n.onAct || n.onClick) == null || oe(ye);
      }
    }
    const B = (ye) => n.onAct(ye), z = ["failed", "unfinished"], L = _(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? z.includes(t.mark.state) ? "danger" : "good" : ""), w = _(() => t.mark.color ? t.mark.color : L.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : L.value ? `var(--tone-${L.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), H = _(() => w.value || "var(--tone-work)"), j = _(() => !t.mark.ending && !t.mark.ended && L.value !== "stopped"), q = lo(), C = _(
      () => t.mark.began_at && j.value && !t.mark.figure && !t.mark.counting ? Fi(q.value - t.mark.began_at) : ""
    ), T = _(() => {
      const { started: ye, ended: _e } = t.mark;
      return ye ? _e ? `ran ${Qo(_e - ye, !0)}` : Qo(q.value - ye, !0) : C.value;
    }), M = ["bad", "danger", "warn"], g = _(() => M.includes(L.value) || t.mark.asks ? "attention" : j.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], O = _(() => S.includes(L.value)), N = _(() => g.value === "process" ? "running" : O.value ? "cross" : L.value === "stopped" ? "stopped" : L.value === "good" ? "tick" : ""), W = _(
      () => !!(t.mark.figure || T.value || t.mark.docked || t.mark.stopping || N.value || t.mark.settled || t.mark.news)
    ), V = _(() => /^(\d+)(\.\d+)(.*)$/.exec(t.mark.figure ?? "")), Q = _(() => t.mark.markIcon ? { component: Et, props: { class: "ico", name: t.mark.markIcon } } : { component: le, props: { name: t.mark.icon || "dot" } }), he = _(() => [t.mark.title, t.mark.time ? ji(t.mark.time) : ""].filter(Boolean).join(" · ")), ve = _(() => ({
      ...w.value ? { "--mark": w.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ye, _e) => (r(), d("div", De(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${g.value}`,
        R(x),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: w.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ve.value,
      title: he.value,
      "data-figure-mark": e.mark.key,
      "data-folded": R(I) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: $
    }), [
      (r(), F(Ke(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: k,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: D(() => [
          e.mark.agentId ? (r(), F(dn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: D(() => [
              (r(), F(Ke(Q.value.component), cs(Fl(Q.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), F(Ke(Q.value.component), cs(De({ key: 1 }, Q.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", lw, v(e.mark.worker), 1)) : b("", !0),
          m("span", iw, [
            A(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", rw, v(e.mark.name), 1)) : b("", !0),
            u.value ? (r(), F(Kt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : b("", !0)
          ]),
          W.value ? (r(), d("span", uw, [
            e.mark.figure ? (r(), d("span", cw, [
              V.value ? (r(), d(P, { key: 0 }, [
                K(v(V.value[1]), 1),
                m("span", dw, v(V.value[2]), 1),
                K(v(V.value[3]), 1)
              ], 64)) : (r(), d(P, { key: 1 }, [
                K(v(e.mark.figure), 1)
              ], 64))
            ])) : b("", !0),
            T.value ? (r(), d("span", fw, v(T.value), 1)) : b("", !0),
            e.mark.stopping ? (r(), d("span", hw, "Stopping")) : b("", !0),
            e.mark.news ? (r(), d("span", mw, v(e.mark.news), 1)) : b("", !0),
            N.value === "running" ? (r(), d("span", pw)) : N.value ? (r(), F(Et, {
              key: 5,
              class: Y(["sign", N.value]),
              name: N.value
            }, null, 8, ["class", "name"])) : b("", !0),
            e.mark.settled ? (r(), d("span", gw, v(e.mark.settled), 1)) : b("", !0)
          ])) : b("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (r(), F(er, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(B, ["stop"])
      }, null, 8, ["label", "open"])) : b("", !0),
      (e.mark.figure || e.mark.counting) && j.value ? (r(), d("span", vw, [
        m("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: H.value })
        }, null, 4)
      ])) : b("", !0),
      e.mark.detail && !R(I) ? (r(), F(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : b("", !0),
      e.mark.body && !R(I) ? (r(), d("div", yw, [
        e.mark.bodyLabel ? (r(), d("p", bw, v(e.mark.bodyLabel), 1)) : b("", !0),
        A(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : b("", !0),
      e.mark.command && !R(I) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, kw)) : b("", !0),
      e.mark.card ? (r(), F(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : b("", !0),
      re(ye.$slots, "default", {
        shown: !R(I)
      }, void 0, !0)
    ], 16, ow));
  }
}), lr = /* @__PURE__ */ U(ww, [["__scopeId", "data-v-26436a00"]]), $w = 8, xw = 40, Sw = [];
class io {
  constructor(t, n, { top: a = $w, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Sw.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new io(t, {
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
    n > xw && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Mw = 60, _w = 300, ir = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function rr(e, t) {
  const n = E([]), a = E(0);
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
  const c = new io("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => _w, more: () => a.value > 0, previous: u }, { top: Mw });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Cw = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function ur(e) {
  var n;
  const t = Cw[e] || ((n = Vt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ew = (e) => ur(String(e).split(":")[0]), Aw = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ow = "agents", Tw = { passed: "good", failed: "danger", warned: "warn", running: "" }, Iw = { good: "good", warn: "warn", danger: "danger" }, ul = {
  "open row": (e) => je(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Wf(e.target_model, e.target_id || 0)
}, Bw = { "open row": (e) => Ew(e.target_model), "open page": () => ur("pages") };
function Rw(e, t) {
  const n = t || {}, a = ul[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Tw[e.outcome] || "" : Iw[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === Ow ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Bw[a](e) : "",
    handlers: a ? { onAct: () => ul[a](e) } : {}
  };
}
const Lw = 24, Nw = 1e3, cl = 2e3, qw = 0.25, Dw = 5e3;
function Pw(e, t = Lw, n = () => !0) {
  const a = E(!1), s = E(0), o = E(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const L = c();
    return L ? L.scrollHeight - L.scrollTop - L.clientHeight : 0;
  }, h = () => !c() || f() <= t;
  function p(L) {
    if (clearTimeout(l), !L) {
      o.value = !1, u = Date.now();
      return;
    }
    const w = Date.now() - u < cl ? cl : Nw;
    l = setTimeout(() => o.value = a.value, w);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function k(L = !1) {
    const w = c();
    w && L && w.scrollTo ? w.scrollTo({ top: w.scrollHeight, behavior: "smooth" }) : w && (w.scrollTop = w.scrollHeight), y();
  }
  function I() {
    $(), !a.value && (a.value = !0, p(!0));
  }
  const x = () => !!c() && f() <= c().clientHeight * qw;
  function $() {
    clearTimeout(i), x() && (i = setTimeout(() => a.value && x() && n() && k(!0), Dw));
  }
  function B() {
    h() ? y() : I();
  }
  function z(L = 1, w = !1) {
    a.value ? s.value += Math.max(0, L) : k(w);
  }
  return jl() && pa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: h, follow: y, toBottom: k, left: I, scrolled: B, arrived: z };
}
const jw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Fw = (e) => String(e ?? "").replace(jw, ""), Ww = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), { away: o, scrolled: l, arrived: i, toBottom: u } = Pw(s);
    me(
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
      K(v(R(Fw)(e.lines.join(`
`)) || e.empty), 1),
      R(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => R(u)(!0))
      }, "Follow")) : b("", !0)
    ], 544));
  }
}, Hw = /* @__PURE__ */ U(Ww, [["__scopeId", "data-v-89621acd"]]), zw = "*.*", Uw = {
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
    const t = e, n = Se(Le, null), a = new Zl();
    me(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (y) => a.dispatch(y));
        f(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = _(() => !!(t.declaration.shipped || t.declaration.trusted)), i = _(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [zw] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), F(Xi, {
      key: 0,
      entry: i.value,
      subscriptions: R(a),
      environment: R(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), F(Qi, {
      key: 1,
      entry: i.value,
      subscriptions: R(a),
      environment: R(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Gw = { class: "mark-more-inner" }, Vw = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Kw = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Yw = {
  key: 3,
  class: "mark-lines"
}, Qw = "process", dl = "task", Xw = {
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
    const t = e, n = at(), a = _(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = _(() => Aw.has(t.mark.variant) && t.mark.detail || ""), o = _(() => t.mark.target_model === dl ? t.mark.target_id : 0), l = rr(
      ir(n),
      () => t.mark.target_id
    ), i = l.lines, u = E(!1), c = E(""), f = _(() => !t.declaration.body_url && t.mark.target_model === Qw && !!t.mark.target_id);
    async function h(y = l.follow) {
      const k = await y();
      u.value = !0, c.value = k.ok ? "" : k.error;
    }
    const p = _(() => t.shown && f.value);
    return me(p, (y) => y && h()), Fs(() => p.value && h(), () => p.value && !t.mark.ended_at), me(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, k) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: k[1] || (k[1] = xe(() => {
      }, ["stop"]))
    }, [
      m("div", Gw, [
        e.declaration.body_url ? (r(), F(Uw, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(P, { key: 1 }, [
          s.value ? (r(), d(P, { key: 0 }, [
            k[2] || (k[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Vw, v(s.value), 1)
          ], 64)) : b("", !0),
          f.value && c.value ? (r(), d("p", Kw, v(c.value), 1)) : f.value && u.value ? (r(), d(P, { key: 2 }, [
            k[3] || (k[3] = m("p", { class: "mark-label" }, "Output", -1)),
            A(Hw, {
              class: "mark-terminal",
              lines: R(i),
              feed: R(l).feed,
              onOlder: R(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", Yw, v(a.value.join(`
`)), 1)) : b("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: k[0] || (k[0] = xe((I) => R(je)(`${dl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : b("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Cs = /* @__PURE__ */ U(Xw, [["__scopeId", "data-v-df71b15a"]]), Jw = ["title", "aria-label", "onClick"], Zw = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, e2 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = _(() => df(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = E(""), s = Se(Le);
    async function o(l) {
      const i = await wn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(P, null, [
      (r(!0), d(P, null, ne(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: xe((c) => o(u), ["stop"])
      }, [
        A(Et, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, Jw))), 128)),
      a.value ? (r(), d("span", Zw, v(a.value), 1)) : b("", !0)
    ], 64));
  }
}, t2 = /* @__PURE__ */ U(e2, [["__scopeId", "data-v-7a62c88e"]]);
function cr(e, t) {
  const n = Ze(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ee.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const dr = cr("/api/marks", "marks"), I6 = dr.fetchAll, n2 = dr.find, a2 = ["data-ref"], s2 = ["data-ref"], o2 = { class: "mark-row" }, l2 = "dock add", i2 = "questions.answer", r2 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = _(() => n2(a.mark.type)), o = _(() => Rw(a.mark, s.value)), l = _(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = _(() => l.value || !!o.value.handlers.onAct), u = _(() => a.mark.type === i2), c = E(!1);
    function f() {
      c.value = !c.value;
    }
    const h = _(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var k;
        return !a.docked || !((k = y.runs) != null && k.startsWith(l2));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var k, I;
      return (k = s.value) != null && k.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": R(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(Cs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, a2)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (I = s.value) == null ? void 0 : I.full_width, docked: e.docked, "user-side": R(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", o2, [
          A(lr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Pl({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: D(({ shown: x }) => [
                A(Cs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: x
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A(t2, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, s2));
    };
  }
}, u2 = /* @__PURE__ */ U(r2, [["__scopeId", "data-v-424ddb61"]]), c2 = ["data-ref"], d2 = ["inert"], f2 = { class: "group-fold" }, h2 = { class: "thread-group" }, m2 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = E(!1), a = E(!1), s = E(!1), o = E(null);
    me(n, async (i) => {
      var u;
      a.value = !0, await Fe(), (u = o.value) == null || u.offsetHeight, s.value = i;
    });
    const l = _(() => ({
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
      A(lr, {
        mark: l.value,
        open: n.value,
        onClick: u[0] || (u[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (r(), d("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Y(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        m("div", f2, [
          m("div", h2, [
            (r(!0), d(P, null, ne(e.group.marks, (c) => (r(), F(u2, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, d2)) : b("", !0)
    ], 8, c2));
  }
}, B6 = /* @__PURE__ */ U(m2, [["__scopeId", "data-v-45b58b9b"]]);
function p2(e) {
  const t = E(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Me(() => n.observe(e.value)), nt(() => n.disconnect()), t;
}
const g2 = { class: "chat-dock-fold" }, v2 = ["aria-label"], y2 = { class: "chat-dock-head" }, b2 = { class: "chat-dock-inner" }, k2 = { class: "chat-dock-foot" }, fr = 700, w2 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = E(null), a = E(null), s = p2(a), o = E(!1);
    let l = 0;
    return Me(() => l = setTimeout(() => o.value = !0, fr)), nt(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", g2, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          re(i.$slots, "edge", {}, void 0, !0),
          m("header", y2, [
            re(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", b2, [
              m("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ge(R(s) === null ? null : { height: `${R(s)}px` })
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
          m("footer", k2, [
            re(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, v2)
      ])
    ], 2));
  }
}, $2 = /* @__PURE__ */ U(w2, [["__scopeId", "data-v-574cba3d"]]), x2 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ua = 5, S2 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ua, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ua}s`, animationDelay: `${(n - Ua).toFixed(2)}s` };
    return (s, o) => (r(), d("span", x2, [
      m("i", { style: a })
    ]));
  }
}, M2 = /* @__PURE__ */ U(S2, [["__scopeId", "data-v-2a7bc150"]]), _2 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Es = (e) => e.charAt(0).toUpperCase() + e.slice(1), C2 = (e) => Es(e.replace(/_at$/, "").replaceAll("_", " ")), E2 = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, A2 = (e, t, n) => [Es(`${e} ${n}`), (t == null ? void 0 : t.state) && Es(t.state)].filter(Boolean).join(" · "), hr = (e) => e.given_name || `${ea(e.role)} ${e.id}`, O2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? hr(t) : (e == null ? void 0 : e.name) ?? "", T2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? hr(t) : "", I2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !_2.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: C2(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], B2 = { reviewing: "Under review" }, R2 = (e, t) => e || B2[t == null ? void 0 : t.state] || "", mr = cr("/api/docks", "docks"), R6 = mr.fetchAll, Rt = mr.find, L2 = 6, Ga = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ro = (e) => Date.parse(e.leaves_at) / 1e3, Jt = (e) => !!(e.leaves_at && !e.kept), N2 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Jt(e) || t < ro(e) || n.has(e.id)), q2 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => N2(a, t, n)).sort((a, s) => a.id - s.id);
function D2(e, t, n = L2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ro(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const P2 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), As = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), j2 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), F2 = (e) => ({ ...e.kept ? As("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : As("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), W2 = ["keep", "unkeep", "open", "undock"], H2 = (e) => ({ ...e, iconOnly: W2.includes(e.action) });
function z2(e, t) {
  var n;
  return [
    ...j2(e, t) ? [F2(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Vt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    As("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(H2);
}
function pr(e, t) {
  const n = z2(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: P2(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const U2 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || pr(e, t).title, G2 = { class: "dock-text" }, V2 = ["title"], K2 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Y2 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, Q2 = {
  key: 1,
  "data-dock-row": ""
}, X2 = { class: "dock-acts" }, J2 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = _(() => Rt(a.item.type)), o = lo(), l = _(() => xn(a.item.created_at, o.value * 1e3)), i = E(null), u = E(null), c = E(null), f = E(null), h = _(() => pr(a.item, s.value)), p = at(), y = _(() => `dock.${a.item.id}`), k = _(() => p.props[y.value].data.value), I = _(() => U2(a.item, s.value, k.value)), x = _(() => sa(a.item.target_model ?? "")), $ = _(() => {
      var M;
      return ((M = s.value) == null ? void 0 : M.word) ?? "";
    }), B = _(() => ({ ...k.value, id: a.item.target_id, term: x.value })), z = () => {
      var M, g;
      return ((g = (M = s.value) == null ? void 0 : M.reads) == null ? void 0 : g.length) && p.reload(y.value);
    };
    Cc(Ds, { data: k, reload: z, readOutput: ir(p) }), me(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (M, g, S) => {
        var N;
        z();
        const O = (N = p.followUndeclared) == null ? void 0 : N.call(p, [`${x.value.replaceAll("-", "_")}.*`], (W) => {
          (!W.row_id || W.row_id === a.item.target_id) && z();
        });
        S(() => O == null ? void 0 : O());
      },
      { immediate: !0 }
    );
    const L = E(/* @__PURE__ */ new Set()), w = E("");
    async function H(M) {
      if (M.action === "undock") return n("undock", M);
      if (M.action === "open") return je(`${a.item.target_model}:${a.item.target_id}`);
      M.action === "declared" && (L.value = /* @__PURE__ */ new Set([...L.value, M.label])), w.value = "";
      const S = await wn(M, { id: a.item.target_id }, p.environment);
      (S == null ? void 0 : S.ok) === !1 && (L.value = new Set([...L.value].filter((O) => O !== M.label)), w.value = `Could not ${M.label.toLowerCase()}: ${S.error}`);
    }
    const j = _(() => h.value.actions.filter((M) => !L.value.has(M.label))), q = _(() => {
      var M;
      return R2((M = s.value) == null ? void 0 : M.badge, B.value);
    }), C = _(() => h.value.controls), T = _(() => {
      var M;
      return !!((M = s.value) != null && M.draws_head) && !a.collapsed;
    });
    return (M, g) => {
      var S, O, N, W;
      return r(), F($2, {
        label: h.value.title + ((S = s.value) != null && S.needs_user ? ", waiting for you" : ""),
        type: (O = s.value) != null && O.needs_user ? "waiting" : "",
        folded: !!((N = s.value) != null && N.folds) && e.folded,
        body: !!((W = s.value) != null && W.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: g[3] || (g[3] = (V) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (r(), F(M2, {
            key: 0,
            "ends-at": R(ro)(e.item)
          }, null, 8, ["ends-at"])) : b("", !0)
        ]),
        head: D(() => {
          var V;
          return [
            T.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(P, { key: 1 }, [
              A(le, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", G2, [
                m("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: I.value
                }, v(I.value), 11, V2)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (V = s.value) != null && V.leaves_after_seconds ? b("", !0) : (r(), d(P, { key: 0 }, [
                K(v(l.value), 1)
              ], 64))
            ], 512),
            C.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: g[0] || (g[0] = xe(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(P, null, ne(C.value, (Q) => {
                var he, ve;
                return r(), d(P, {
                  key: Q.action + Q.runs
                }, [
                  !L.value.has(Q.label) && (!((he = Q.variants) != null && he.length) || !((ve = B.value) != null && ve.state) || Q.variants.includes(B.value.state)) ? (r(), F(pe, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: Q.pressed }),
                    "aria-pressed": Q.pressed,
                    "aria-label": Q.label,
                    title: Q.label,
                    "data-dock-action": Q.action,
                    onClick: (ye) => H(Q)
                  }, {
                    default: D(() => [
                      A(le, {
                        name: Q.icon,
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
        still: D(() => [
          w.value || e.refusal ? (r(), d("p", K2, v(w.value || e.refusal), 1)) : b("", !0)
        ]),
        foot: D(() => {
          var V;
          return [
            m("span", Y2, [
              q.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(q.value), 3)) : b("", !0),
              $.value ? (r(), d("span", Q2, v($.value) + " " + v(e.item.target_id), 1)) : b("", !0),
              m("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (V = s.value) != null && V.folds ? (r(), F(pe, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: g[1] || (g[1] = (Q) => n("fold"))
            }, {
              default: D(() => [
                K(v(s.value.folds) + " ", 1),
                A(Kt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : b("", !0),
            m("span", X2, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              A(Qs, {
                name: `dock.${e.item.type}`,
                row: B.value,
                environment: R(p).environment,
                "read-only": R(p).readOnly,
                "object-name": R(sa)(e.item.target_model),
                "external-failure": "",
                onFailure: g[2] || (g[2] = (Q) => w.value = Q),
                onDone: M.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (r(!0), d(P, null, ne(j.value, (Q) => (r(), F(pe, {
                key: Q.action + Q.runs,
                small: "",
                variant: Q.primary ? "primary" : "ghost",
                bordered: !Q.primary,
                "data-dock-action": Q.action,
                onClick: (he) => H(Q)
              }, {
                default: D(() => [
                  K(v(Q.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: D(() => {
          var V;
          return [
            (V = s.value) != null && V.body_url ? (r(), F(Cs, {
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
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : b("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, fl = /* @__PURE__ */ U(J2, [["__scopeId", "data-v-c4a0c2b2"]]), Z2 = 24, e5 = 8, L6 = 420;
function N6({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= Z2 ? !0 : e < t && s > e5 ? !1 : null;
}
const t5 = (e, t) => e === void 0 ? t : e, n5 = { me: 1, people: [] }, ia = zt({
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
  people: n5,
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
$i("journal.activity", () => ia.activity);
$i("journal.side.mini", () => ia.sideMini);
const gr = "journal.viewer.";
function a5(e, t, n) {
  try {
    const a = n.getItem(gr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function s5(e, t, n) {
  try {
    n.setItem(gr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function hl(e, t, n = window.localStorage) {
  const a = E(a5(e, t, n));
  return me(a, (s) => s5(e, s, n), { deep: !0 }), a;
}
const o5 = {
  key: "dock-all",
  class: "dock-all"
}, l5 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var M, g;
    const t = e, n = Jk(500), a = E(/* @__PURE__ */ new Set()), s = Se(Le), o = E(/* @__PURE__ */ new Set()), l = E({});
    async function i(S, O) {
      l.value = { ...l.value, [S.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, S.id]);
      const N = await wn(O, { id: S.target_id }, s.environment);
      (N == null ? void 0 : N.ok) === !1 && (o.value = new Set([...o.value].filter((W) => W !== S.id)), l.value = { ...l.value, [S.id]: `Could not dismiss this card: ${N.error}` });
    }
    const u = _(
      () => q2(
        t.items.filter((S) => !o.value.has(S.id)),
        n.value,
        a.value
      )
    ), c = _(
      () => D2(
        u.value.filter((S) => Ga(S, Rt)),
        n.value
      )
    ), f = _(() => u.value.filter((S) => !c.value.includes(S) && !Ga(S, Rt))), h = hl(`dock-size:${((M = ia.identity) == null ? void 0 : M.root) || location.host}`, null), p = (S) => {
      var O;
      return !!((O = Rt(S.type)) != null && O.needs_user);
    }, y = E(/* @__PURE__ */ new Set()), k = E(/* @__PURE__ */ new Set()), I = _(() => u.value.length === 1), x = (S) => p(S) || I.value, $ = (S) => x(S) ? y.value.has(S.id) || k.value.has(S.id) : h.value ? h.value.collapsed && !h.value.opened.includes(S.id) : t.collapsed, B = _(() => u.value.some($));
    me(() => t.collapsed, (S) => {
      k.value = new Set(S ? u.value.filter(p).map((O) => O.id) : []);
    });
    function z() {
      const S = !B.value;
      h.value = { collapsed: S, opened: [] }, y.value = new Set(S ? u.value.filter(p).map((O) => O.id) : []), k.value = /* @__PURE__ */ new Set();
    }
    function L(S) {
      var N;
      if (!$(S)) return;
      if (x(S)) {
        y.value = new Set([...y.value].filter((W) => W !== S.id)), k.value = new Set([...k.value].filter((W) => W !== S.id));
        return;
      }
      const O = (N = h.value) != null && N.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...O, S.id] };
    }
    const w = hl(`dock-folded:${((g = ia.identity) == null ? void 0 : g.root) || location.host}`, {}), H = (S) => {
      var O;
      return !!((O = Rt(S.type)) != null && O.folds) && (t.insidesFolded || t5(w.value[S.id], Ga(S, Rt) || t.folded));
    };
    function j(S) {
      H(S) && q(S), w.value = { ...w.value, [S.id]: !H(S) };
    }
    function q(S) {
      var O;
      !((O = h.value) != null && O.collapsed) || h.value.opened.includes(S.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, S.id] });
    }
    function C(S) {
      a.value = /* @__PURE__ */ new Set([...a.value, S.id]);
    }
    function T(S) {
      a.value = new Set([...a.value].filter((O) => O !== S.id));
    }
    return (S, O) => (r(), F(Ps, {
      tag: "div",
      name: "dock",
      duration: R(fr),
      class: "dock-stack"
    }, {
      default: D(() => [
        u.value.length > 1 ? (r(), d("div", o5, [
          A(pe, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": B.value ? "Open all" : "Collapse all",
            onClick: z
          }, {
            default: D(() => [
              A(Kt, {
                open: !B.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : b("", !0),
        (r(!0), d(P, null, ne(f.value, (N) => (r(), F(fl, {
          key: N.id,
          item: N,
          class: Y({ timed: R(Jt)(N) }),
          leaving: R(Jt)(N) && !a.value.has(N.id),
          folded: H(N),
          collapsed: $(N),
          refusal: l.value[N.id],
          onOpen: (W) => L(N),
          onFold: (W) => j(N),
          onUndock: (W) => i(N, W),
          onMouseenter: (W) => C(N),
          onMouseleave: (W) => T(N)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(P, null, ne(c.value, (N) => (r(), F(fl, {
          key: N.id,
          item: N,
          class: Y({ timed: R(Jt)(N) }),
          leaving: R(Jt)(N) && !a.value.has(N.id),
          folded: H(N),
          collapsed: $(N),
          refusal: l.value[N.id],
          onOpen: (W) => L(N),
          onFold: (W) => j(N),
          onUndock: (W) => i(N, W),
          onMouseenter: (W) => C(N),
          onMouseleave: (W) => T(N)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, q6 = /* @__PURE__ */ U(l5, [["__scopeId", "data-v-2c47a65e"]]), St = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Kn = (e) => Math.min(Math.max(e, 0), 1), i5 = (e) => {
  const t = Kn(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => i5((e - t) / (n - t));
function D6(e) {
  const t = Kn(e), n = Kn((t - 0.12) / 0.76) * St.shuffles, a = Math.min(Math.floor(n), St.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), i = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), u = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * Kn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / St.shuffles, lift: St.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function P6(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const ml = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, j6 = (e) => ml[e] ?? ml.butler, uo = 2400, r5 = 0.05;
function u5({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, r5), l = Math.min(t + uo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function F6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function c5(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function W6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const H6 = (e, t) => ({ ...e, stretch: t.stretch }), z6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, vr = (e, t) => t >= (e.least ?? 0);
function U6(e, t, n) {
  if (!vr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const G6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), d5 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", pl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), f5 = (e) => e.right > e.left && e.bottom > e.top;
function V6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(d5)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = pl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = pl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), f5(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function yr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[h] || e[f] > o[p]) && (i = -1);
      else {
        const k = (o[h] - e[f]) / y, I = (o[p] - e[f]) / y;
        l = Math.max(l, Math.min(k, I)), i = Math.min(i, Math.max(k, I));
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
}, hn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), h5 = (e) => e * e * (3 - 2 * e), Ie = (e, [t, n]) => h5(hn(e, t, n)), m5 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], pt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Fn = ([e, t], n) => e + n() * (t - e);
function p5(e) {
  return m5.map(() => {
    const t = Fn(pt.speed, e), n = Fn(pt.angle, e) * Math.PI / 180, a = Fn(pt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Fn(pt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const g5 = p5(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function v5(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * pt.gravity * (t[2] - pt.floor))) / pt.gravity;
}
function K6(e, t, n = g5) {
  const a = Oe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = v5(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, h) => f + o.velocity[h] * u);
  return c[2] -= pt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const Y6 = (e, t) => e && Oe[e.name] ? { name: e.name, u: t / e.frames } : null;
function Q6(e, t) {
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
const X6 = () => Array.from({ length: Oe.pogo.count }, (e, t) => Oe.pogo.bounce * (t + 1) / Oe.pogo.count), Pt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function J6(e, t, n) {
  const { away: a, side: s } = Oe.bug_smash, o = s * a * n, [l, i] = [t.left + Pt.margin * n, t.right - Pt.margin * n], u = Math.min(Math.max(e + o + s * Pt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function Z6(e, t, n) {
  const a = Oe.bug_smash, s = Ie(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Pt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Pt.tall * n * (1 - Ie(t, a.emerge)),
      turn: 90 * (1 - Ie(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ie(t, a.gone)
    }
  };
}
function eM(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Pt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = u5({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Pe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function tM(e) {
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
function y5(e, t) {
  const n = Oe.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = c5(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function nM(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Oe.bug_shot, { frame: l, bug: i, shot: u } = y5(n, e.length), c = e.map(($, B) => ({ ...Os($, t, Math.min(n / o.fps, Yn(B).shot)), shot: B < u })), f = Ie(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map(($, B) => ({ bug: $, index: B, seconds: n / o.fps - Yn(B).shot, spot: Os($, t, Yn(B).shot) })).filter(($) => $.seconds >= 0), k = y.flatMap(($) => {
    const B = (s == null ? void 0 : s.get($.index)) ?? x5($.bug, t, $.spot, s ? [] : a);
    return s == null || s.set($.index, B), s && S5(B, $.seconds, a), M5(B, $.seconds, a);
  }), I = y.filter(($) => w5($.bug)).map(($) => ({ seconds: $.seconds, from: $.spot })), x = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * f, y: h.y + (p.y - h.y) * f, back: x }, slush: k, camera: I };
}
function Yn(e) {
  const t = Oe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function aM(e, t, n, a) {
  const { limit: s, margin: o } = Oe.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const h = Yn(f), p = Os(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), k = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), I = Math.abs(p.x - u) >= y ? u : p.x + k * y, x = k > 0 ? Math.max(u, Math.min(I, i)) : Math.min(u, Math.max(I, l)), $ = { from: u, to: x, begin: h.walk, end: h.aim };
    return u = x, $;
  });
}
function sM(e, t, n) {
  var o;
  const a = Oe.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Ie(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Ce = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, b5 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function k5(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const w5 = (e) => e.along * 97 % 1 < Ce.camera, mn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ce.gravity * t * t });
function $5(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ce.gravity * (t.bottom - e.from.y))) / Ce.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ce.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ce.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ce.step) {
    const f = Math.min(c + Ce.step, l.t), h = mn(e, f), p = yr(i, h, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = h;
  }
  const u = mn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function x5(e, t, n, a = []) {
  const s = k5(e.along + 1), [o, l] = b5[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ce.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ce.spread * Math.PI / 180), c = Ce.speed[0] + s() * (Ce.speed[1] - Ce.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ce.radius[0] + s() * (Ce.radius[1] - Ce.radius[0]) };
    return { ...f, ...$5(f, t, a) };
  });
}
function S5(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ce.step) {
      const l = Math.min(o + Ce.step, s), i = yr(mn(a, o), mn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function M5(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...mn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ce.hold) / Ce.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function oM(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Oe.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, h = Ie(e, [0, c]), p = Ie(e, [c, c + f]);
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
function lM(e, t, n, a, s) {
  const { sway: o, above: l } = Oe.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], h = (I) => {
    const [x, $] = [I.x - e.at.x, I.y - e.at.y];
    return { x: i.x + x * c - $ * f, y: i.y + x * f + $ * c };
  }, [p, y] = [...n].sort((I, x) => I.x - x.x), k = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: k.map((I, x) => ({ from: I, to: x < k.length / 2 ? p : y })) };
}
const iM = (e, t) => Ie(t, e.grows) * (1 - Ie(t, e.sinks));
function ra(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: hn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: hn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function rM(e, t) {
  const n = Oe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = ra(n, t), l = 1 - (1 - n.small) * Ie(a, n.shrinks) * (1 - Ie(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = ra(n, t), o = n.flat * Ie(a, n.squashes) * (1 - Ie(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * hn(s, ...n.springs)) * (1 - hn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const uM = (e) => e === "pack_box";
function cM(e) {
  const { into: t, out: n } = ra(Oe.rope_swing, e);
  return 1 - Ie(t, [0, 1]) * (1 - Ie(n, [0, 1]));
}
function dM(e) {
  const t = Oe.rope_swing, { into: n, out: a } = ra(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ie(n, [0, 1]) * (1 - Ie(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const _5 = { after: 3 }, co = 10, C5 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, E5 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, A5 = { weight: 19 }, br = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, O5 = { every: 120 }, kr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, wr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, T5 = {
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
}, Mn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: co }), ie = (e, t, n = {}) => Mn(e, "clip", t, n), Va = (e, t, n = {}) => Mn(e, "look", t, n), gl = (e, t, n = {}) => Mn(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...Mn(e, "pick", t, n), ...a }), we = (e) => Mn("nothing", "nothing", e, {}), I5 = 120, B5 = 300, Ka = (e, t) => ({ ...ie(e, t), cooldown: B5 }), de = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), R5 = () => [ie("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: C5[e.name] }), Xt = (e) => ({ ...e, shenanigan: !0, lasts: E5[e.name] }), wa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...de("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ie("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...de("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...$t(ie("bug_shot", 3)), toward: "", onto: !1 },
    { ...$t(ie("bug_smash", 2)), toward: "", onto: !1 },
    ie("nod", 2)
  ]),
  ...de("tests_failed", { cooldown: 20, toward: "card" }, [ie("startled", 2), ie("dismay", 1), ie("tantrum", 3), we(1)]),
  ...de("committed", { cooldown: 30, toward: "card", onto: !0 }, [ie("nod", 2), we(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...de("sin_fixed", { cooldown: 300 }, [ie("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...de("sin_committed", { cooldown: 300 }, [ie("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...de("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ie("nod", 4), ie("hand_rub", 4), we(7)]),
  ...de("question_asked", { cooldown: 60 }, [ie("ask_sign", 9), ie("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...de("reported", { cooldown: 90 }, [gl("read", 3), ie("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...de("read_message", { cooldown: 30 }, [gl("read", 3), we(1)]),
  ...de("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), we(6)]),
  ...de("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...de("bar_done", { holds: !0 }, R5()),
  ...de("bar_failed", { holds: !0 }, [ie("fume", 1), ie("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...de("standing", { cooldown: 12 }, [ie("look_left", 2), ie("look_right", 2), ie("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...de("launched", { cooldown: 300 }, [ie("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...de("building", { cooldown: 30 }, [ie("wipe_brow", 4), ie("look_left", 1), ie("look_right", 1), we(69)]),
  ...de("failed", { cooldown: 20, toward: "card" }, [ie("shake", 3), ie("tantrum", 2), we(2)]),
  ...de("refused", { cooldown: 20 }, [ie("shake", 1), we(1)]),
  ...de("work_done", { cooldown: 120 }, [ie("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...de("pondering", { cooldown: [30, 60] }, [be("ponder", 1)]),
  ...de("thought_cloud", { cooldown: 90 }, [be("cloud", 1)]),
  ...de("light_bulb", { cooldown: 150 }, [be("bulb", 1)]),
  ...de("answered", { cooldown: 15 }, [Va("amused", 3), we(2)]),
  ...de("heard", { cooldown: 30 }, [
    ie("bow", 1, { voices: ["butler"] }),
    ie("salute", 1, { voices: ["squire"] }),
    ie("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...de("long_walk", { cooldown: 90 }, [ie("stumble", 3), we(22)]),
  ...de("card_arrived", { cooldown: 20, toward: "card" }, [ie("glance", 7), we(13)]),
  ...de("typing", { cooldown: 60 }, [Va("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(T5).flatMap(([e, t]) => de(`reacted:${e}`, {}, [Va(t, 1)])),
  ...Object.entries(kr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => de(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(wr).flatMap(([e, t]) => de(`agent_reacted:${e}`, {}, [ie(t, 1)])),
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
    { ...Xt($t(ie("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Xt($t(ie("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...de("held:search", { cooldown: I5 }, [Ka("search", 3), { ...Ka("binoculars", 2), when: { home: !0 } }, { ...Ka("glass_bubble", 2), when: { bubble: !0 } }]),
  ...de("held:type", {}, [ie("type", 3), ie("type_ponder", 1)]),
  ...de("held:compacting", {}, [ie("pack_box", 3), ie("vacuum", 2), ie("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...de("spell", {}, [be("writing", 12, { state: "writing" }), be("reading", 12, { state: "reading" }), be("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...de("tickled", {}, [{ ...$t(ie("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...de("eager", {}, [ie("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...de("jump", {}, [Xt($t(ie("backflip", 7, { high: !0 }))), ie("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...de("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...de("unit", { cooldown: br.build.cooldown }, [be("unit", A5.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...de("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...de("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: O5.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...de("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...de("roam", {}, [
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
], $r = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), xr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), L5 = (e) => Array.isArray(e) ? e[0] : e, N5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, q5 = (e) => wa.some((t) => t.when.moment === e);
function D5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || xr(f).every(([h, p]) => n(h) >= L5(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = wa.filter((f) => $r(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= _5.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var h;
    return f.type === "nothing" || f.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Ye(e, t) {
  const n = D5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Sr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Sr(e, t, n) {
  var a;
  for (const [s, o] of xr(t)) (a = e.memory) == null || a.set(s, e.now + N5(o, n));
}
function fM(e, t, n) {
  Sr(e, wa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const hM = (e) => Object.values(br).find((t) => $r(t.when, e)) ?? null, P5 = (e, t, n) => n - t <= (e.lifetime ?? co), mM = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || vr(e.clip, t));
class Mr {
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
}, pM = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), _r = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), gM = {
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
}, vM = 120, j5 = 20, yM = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < j5), F5 = (e) => Ts[e] || Ts.idle, bM = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Cr = "airborne", W5 = "landing", H5 = "travelling", Er = "grounded", kM = ({ airborne: e, landing: t, trip: n }) => e ? Cr : t ? W5 : n != null && n.started ? H5 : Er;
function wM(e, t) {
  var s;
  const n = z5(e, t);
  return e.mode === Er && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function z5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === Cr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...U5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : F5(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function U5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Is = (e) => e.outcome, G5 = /^plugin:[^:]+:sins:/, vl = (e) => e.type === "plugins.card" && G5.test(e.markKey), V5 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => vl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => vl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], $M = (e, t) => e.filter((n) => n.author === "user" && oa(n.read_at) > t).map((n) => ({ beat: "read_message", time: oa(n.read_at), card: Ri(n) })).sort((n, a) => n.time - a.time), yl = { user: "reacted", agent: "agent_reacted" };
function xM(e, t) {
  return e.filter((n) => yl[n.author] && Ct(n) > t).map((n) => ({ beat: `${yl[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const K5 = [.../* @__PURE__ */ new Set([...Object.values(kr).flatMap((e) => Object.keys(e)), ...Object.keys(wr)])];
function SM(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = K5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: Ri(n) })).sort((n, a) => n.time - a.time);
}
const Y5 = (e) => new Mr(e).isTest(), ua = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Is(e)] || "";
}, Q5 = 1800, X5 = (e, t) => {
  if (ua(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ua(n) !== "finished" && Number(e.time) - Number(n.time) <= Q5 ? "tests_fixed" : "tests_passed";
};
function MM(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Y5), s = a.filter((i) => ua(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, ua(i))), o.map((i) => ({ beat: X5(i, s), time: Number(i.time), card: i.key }));
}
function _M(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Is(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Is(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const CM = (e) => e.map((t) => {
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
function EM(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function AM(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function OM(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = V5.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function fo(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const bl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function J5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    fo(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function TM(e, t, n, a = {}) {
  const s = Ye({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : q5(`held:${e}`) ? "idle" : e;
}
const qe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function IM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < qe.ahead * n ? 180 : Math.sign(a) * qe.turn;
}
const kl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function BM(e, t) {
  const n = Math.min(qe.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(qe.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(qe.lines, Math.floor((e.bottom - e.top - 2 * a) / qe.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / qe.sweep) % s, i = o % qe.sweep, u = qe.sweep - qe.returnSeconds, c = kl((i - u) / qe.returnSeconds), f = i <= u ? kl(i / u) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + h * qe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const wl = 3, Ar = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, $l = 12, RM = (e, t) => ({ mood: e, began: t, seen: 0 });
function LM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Ar(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= wl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * $l) / $l, lasts: wl } };
}
const NM = (e) => e.posture === "hang" && !Ar(e.face), Z5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), e$ = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function qM(e, t, n) {
  return Z5.has(e) ? 1 / 0 : !e$.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Or(n - t.began, t.share) - it.lead, 0);
}
const t$ = 5;
function DM(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= t$ ? { beat: "long_walk", time: n } : null };
}
const n$ = 30, Wn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function PM(e, t, n, a, s = null) {
  if (t && n < t.until || !Wn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ye({ moment: "spell", state: e, tally: s }, a), [l, i] = Wn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Wn.every } : { state: e, began: 0, until: 0, next: n + Wn.every };
}
const jM = (e, t, n) => t && n < t.until && _r.has(e.state) ? { state: t.state, since: t.began } : e, it = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Or = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function FM(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Or(o, e.share);
  return s ? { eager: a$(t, l), moment: null } : l > it.lead ? { eager: t, moment: null } : l < it.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > it.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < it.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ye({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function a$(e, t) {
  return e.on && t > it.lead + it.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= it.lead && t >= it.least ? { ...e, on: !0, calm: !1 } : e;
}
const s$ = 1, o$ = { look: "look", gaze: "gaze" };
function l$(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ye({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [o$[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const i$ = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Ye({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), r$ = (e, t, n, a, s, o = 0) => Ye({ moment: "jump", high: e > s$ * t, memory: a, now: s, room: o }, n).name === "backflip", u$ = { work: ["building"], idle: ["standing"] };
function WM(e, t, n, a) {
  const s = Ts[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(u$[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), _r.has(e) ? { moments: o, began: n || a } : (n && a - n >= n$ && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function c$(e, t, n) {
  return !Ye({ moment: "pondering", memory: e, now: t }, n) || !Ye({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ye({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const xl = { pondering: c$ };
function HM(e, t, n, a, s, o) {
  if (xl[e.beat]) {
    const i = xl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = l$(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== co && { lifetime: l.lifetime } } } : null;
}
function zM(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = i$(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const UM = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function GM(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function VM(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const KM = (e, t) => !!(e != null && e.watches) && !t.once, YM = 10, QM = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || P5(a, a.queuedAt, n)), XM = (e, t) => t ? null : e[0] ?? null;
function JM(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const ZM = (e, t) => !t.during || !e.some((n) => n.during === t.during), d$ = 2 * Math.PI, f$ = 500;
function e_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / f$, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, h = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = d$ * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, I = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? m$(y, t, n, p, s) : g$(y, t, n, p) : t) ?? y, x = I != null && I.behind && I.mood === "reading" ? h$(e.point, I, n, l, s) : I;
  return { point: x ?? null, toward: x ? { x: x.x - n.x, y: x.y - n.y } : null, amount: h, at: a };
}
function h$(e, t, n, a, s) {
  const o = (C) => C * 180 / Math.PI, l = (C) => o(Math.atan2(Math.sin(C * Math.PI / 180), Math.cos(C * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : f, k = y + l(c - y), I = Math.min(Math.max(a / 1e3, 0), 0.1), x = qe.turnSpeed * I, $ = h ? y + Math.min(Math.max(k - y, -x), x) : k, B = h ? e.readingFollow + p : $, z = B + ($ - B) * (1 - Math.exp(-I / qe.followSeconds)), L = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, w = o(fo(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), H = Math.min(Math.max(w, -L.up), L.down), j = qe.tipSpeed * I, q = h ? e.readingPitch + Math.min(Math.max(H - e.readingPitch, -j), j) : H;
  return { ...t, readingYaw: $, readingFollow: z, readingPitch: q, readingFacing: i };
}
function m$(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (B) => {
    const { yaw: z, pitch: L } = fo(B.x - n.x, s, n.y - B.y, o);
    return { yaw: z, pitch: Math.min(Math.max(L, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [bl(i(e)), bl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const h = a / f, [p, y] = [Math.sin((1 - h) * f) / Math.sin(f), Math.sin(h * f) / Math.sin(f)], [k, I, x] = u.map((B, z) => p * B + y * c[z]), $ = s * k / I;
  return { ...t, x: n.x + $, y: n.y - J5($, s, -Math.asin(Math.min(Math.max(x, -1), 1)), o) };
}
const p$ = 0.15;
function t_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= p$;
}
function g$(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const v$ = (e) => !(e != null && e.on);
function n_(e, t, n) {
  if (v$(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const pn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, st = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ya = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Sl = (e) => e * e * (3 - 2 * e);
function y$(e) {
  if (e < 0 || e >= st.seconds) return null;
  const t = Ya(e, ...st.flicker), n = Math.floor(t * st.flickers * 2) % 2 === 0, a = e < st.flicker[1] ? n ? 0.35 + 0.5 * t : st.dim : 1;
  return { strength: 1 - Sl(Ya(e, ...st.fade)), lit: a, white: e < st.flash[0] ? 0 : 1 - Sl(Ya(e, ...st.flash)) };
}
const a_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function s_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = y$(t - e.at);
  return a && { colour: pn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: st.signs[e.tone], ...a } };
}
function o_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function l_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= pn.looks || a === null && n - e.since >= pn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function i_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const mt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, r_ = { behind: 39, figure: 40, ahead: 41 }, b$ = "[data-figure-pile]", k$ = { amber: [1, 0.69, 0.125], good: pn.colours.good, bad: pn.colours.bad }, Qn = { phases: 4, ms: 230, dim: 0.25 }, u_ = (e, t, n) => e !== "amber" || (t + n) % Qn.phases < Qn.phases / 2 ? 1 : Qn.dim, c_ = (e) => e === "amber" ? Qn.phases : 1;
function d_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const f_ = Object.keys(k$), Xe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Zt = ([e, t], n) => e + n() * (t - e);
function h_(e) {
  const t = Xe.least + Math.floor(e() * (Xe.most - Xe.least + 1));
  return Array.from({ length: Math.min(t, Xe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Xe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Zt(Xe.start, e), l = Zt(Xe.reach, e);
    return {
      text: Ye({ moment: "digit" }, e).name,
      x: a * o,
      y: Xe.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Zt(Xe.moveMs, e)),
      fadeMs: Math.round(Zt(Xe.fadeMs, e))
    };
  });
}
const Qa = { high: 3, gap: 1 };
function m_(e) {
  const t = Math.floor(e / Qa.high);
  return { left: -(mt.inside + mt.width / 2 + t * (mt.width + Qa.gap)), up: e % Qa.high * (mt.height - mt.top) };
}
const w$ = (e, t, n) => Ye({ moment: "unit", memory: e, now: t }, n) !== null, $$ = { after: 5 }, x$ = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Mr(t).isBuild());
function p_(e, t, n) {
  const a = x$(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= $$.after ? s : null;
}
function g_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: w$(n, a, s) } : null;
}
const Ml = { ahead: 140, up: 70 };
function v_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Ml.ahead, y: a - Ml.up } } : o ? { at: { x: n(o), y: a - o.up - mt.height } } : t ? { at: null } : null;
}
const Xa = { least: 4e3, most: 1e4 }, S$ = (e) => Xa.least + e() * (Xa.most - Xa.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function y_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = S$(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const b_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), k_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Tr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), w_ = new Set(wa.filter((e) => Tr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), M$ = (e) => e.some((t) => t.state === "built"), $_ = (e, t) => M$(t) ? e.filter((n) => !Tr.has(n.beat)) : e, vt = { reach: 40, room: 6 }, _$ = (e, t) => t <= e - vt.reach + 2, x_ = (e, t, n) => _$(e, n) ? t - vt.reach : e - vt.reach - vt.room, S_ = (e, t, n, a) => a > 0 && t < e && t + vt.reach >= e - 2 ? Math.min(n, Math.max(e, t + vt.reach)) : e, Ja = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, M_ = (e) => Zt(e() < Ja.longShare ? Ja.long : Ja.short, e), C$ = 2 * mt.width;
function __(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= C$ ? o : e + (o - e + s / 2) % s;
}
const E$ = 60, C_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= E$, _l = "[data-figure-home]", _n = () => {
  var t;
  const e = document.querySelector(_l);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(_l)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, A$ = "[data-figure-docked-bars]", O$ = "[data-figure-chat-foot]", T$ = [0.85, 0.6, 0.35, 0.15], I$ = ["question", "waiting", "suggestion"], E_ = (e, t) => I$.find((n) => e[n] > 0 && t[n] === "behind") || null;
function A_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const B$ = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", R$ = "[data-figure-newest]";
function Ir() {
  var a, s;
  const e = (a = _n()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(R$), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ho(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function gn(e, t, n = Ir()) {
  if (!e || !n) return !0;
  const a = ct(e, t), s = xa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Be.top * t.size, bottom: a.top + Be.bottom * t.size }, l = St.gap;
  return !$a(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function O_(e, t, n, a = Ir()) {
  if (!a || gn(t, e, a)) return null;
  const s = xa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Ot(), u = t.posture === "stand" ? po * e.size : jr * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - St.gap - l, a.right + St.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && gn(p, e, a) && u4(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Za = 0.26, Br = 0.54, L$ = 1.25 / 5.4, Cn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Za, travels: "stand" },
  lounge: { drop: Za, travels: "stand" },
  composed: { drop: Za, travels: "stand" },
  hang: { drop: Br, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, T_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * L$ * Math.cos(t * Math.PI / 180),
  y: 1 - n - Br
}), nn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), N$ = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), I_ = (e, t) => (e === "sit" ? N$.has(t) : nn.has(e)) ? e : "stand";
function B_(e, t) {
  return e.facing === t.facing || !nn.has(e.posture) && !nn.has(t.posture) ? t : { posture: "stand", facing: nn.has(e.posture) ? e.facing : t.facing };
}
const R_ = 0.25, L_ = (e, t) => nn.has(e) && Cn[t].drop === 0, Rr = 2, q$ = 90, D$ = 180, P$ = 140, j$ = 280, F$ = 420, W$ = 0.25, H$ = 290, z$ = 600, U$ = "cubic-bezier(0.2, 0.7, 0.4, 1)", G$ = "cubic-bezier(0.55, 0, 0.9, 0.6)", es = 5;
function ca(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < es) return null;
  (l || i) && (o = Math.max(o, Rr));
  const y = o > 1, k = Math.abs(t.x - e.x), I = k < es ? 0 : k / (q$ * o) * 1e3, x = Math.min(I, y ? P$ : D$), $ = Math.abs(t.y - e.y), B = t.y < e.y, z = B && !p && r$($, n, u, c, f, h), L = B ? F$ + Math.min($, 400) * W$ : Math.sqrt(2 * $ / uo) * 1e3, w = {
    x: t.x,
    y: t.y,
    ms: $ > es ? z ? z$ : L : 0,
    lead: z ? H$ : B ? j$ : 0,
    easing: B ? U$ : G$,
    hopping: !0,
    clip: z ? "backflip" : B ? "jump" : "fall"
  }, H = { x: t.x, y: t.y, ms: I + x, lead: 0, easing: "linear", ramp: x, ...y ? { clip: "run" } : {} }, j = p ? V$(t, n) : w, q = B && !a ? [{ ...H, y: e.y }, j] : [{ ...w, x: e.x }, H];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const V$ = (e, t) => ({ x: e.x, y: e.y, ms: Oe.pogo.frames / Oe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), K$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], N_ = (e, t, n) => e.posture === "walk" && n ? "walk" : K$(e.clip, t), ct = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Cn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, $a = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ho = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ot() {
  var t;
  const e = (t = _n()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Hn = 0.5, Cl = 20;
function q_(e, t, n = Ot()) {
  const a = ct(e, t);
  return a.left >= n.left + Cl && a.right <= n.right - Cl;
}
function mo(e, t, n = Ot()) {
  const a = ct(e, t), s = a.right - a.left, o = xa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Hn && i <= n.right + Hn && a.top >= n.top - Hn && u <= n.bottom + Hn;
}
const da = [0.35, 0.5, 0.65], fa = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Be = { left: da[0], right: da.at(-1), top: fa[0], bottom: fa.at(-1) }, Y$ = 0.24;
function xa(e) {
  if (e.posture === "stand") return { left: Be.left, right: Be.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Y$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Be.left, t), right: Math.max(Be.right, t) };
}
function Q$(e, { size: t }, n = Ot()) {
  const a = xa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const po = (Be.right - Be.left) / 2 + 0.08;
function D_(e, t) {
  return e === "hang" ? Be : { ...Be, bottom: Math.min(Be.bottom, 1 - t - Cn[e].drop) };
}
const X$ = "[data-figure-agent]";
function Lr(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !ho(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const Nr = (e) => fa.flatMap(
  (t) => da.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function go(e, t, n = "") {
  if (!gn(e, t)) return da.length * fa.length;
  const a = ct(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(B$)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && $a(s, u) && ho(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return Nr(s).filter(([i, u]) => l(i, u) || Lr(i, u, n)).length;
}
function J$(e, t) {
  const n = ct(e, t);
  return Nr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Lr(a, s, "", X$)).length;
}
const El = 4;
function P_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = El; o <= s; o += El)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!J$(i, e) && gn(i, e)) return i;
    }
  return null;
}
function vn(e, t, n) {
  const a = Ot(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => mo(l, t, a) && gn(l, t)).map((l) => ({ spot: l, covered: go(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const qr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Z$ = [0.5, 0.25, 0.75], e4 = (e) => qr(e.getBoundingClientRect(), Z$), Dr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, t4 = po, n4 = (e, t, { size: n }, a = t4) => Pr(e, Dr[t], a * n, "stand");
function Pr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const a4 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, jr = 0.1, s4 = (e, t, { size: n }) => Pr(e, a4[t], jr * n, "sit"), o4 = (e) => ((e + 180) % 360 + 360) % 360 - 180, ts = 60;
function j_(e, t) {
  const n = o4(t);
  return !e.aside || Math.abs(n) >= ts ? t : n < 0 ? 360 - ts : ts;
}
const an = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, l4 = (e) => [.../* @__PURE__ */ new Set([e, ...an.turns.map((t) => (t + 360) % 360)])];
function F_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = l4(t), l = an.every[0] + a() * (an.every[1] - an.every[0]);
  return { face: t, from: s ? i4(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function i4(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / an.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function W_(e, t) {
  const { element: n, edge: a } = Sa(), s = ["left", "right"].map((i) => En(s4(a, i, e), e)).filter((i) => n && mo(i, e) && !go(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function H_(e, t, { size: n }) {
  const a = (Be.right - Be.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Fr } : e;
}
const Fr = 7;
function Wr() {
  const e = [...document.querySelectorAll(b$)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function r4(e, t) {
  const n = ct(e, t), a = n.right - n.left;
  return { left: n.left + Be.left * a, right: n.left + Be.right * a, top: n.top + Be.top * a, bottom: n.bottom };
}
function u4(e, t) {
  const n = Wr();
  return !n || !$a(r4(e, t), n);
}
const c4 = 4;
function Sa() {
  const e = An(), t = Wr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > c4 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Fr - n, 0) } };
}
const z_ = ({ size: e, below: t }) => (1 - t) * e;
function En(e, t) {
  const n = Ot(), { size: a, below: s } = t, o = Cn[e.posture].drop * a;
  return { ...Q$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Bs = (e, t) => Object.keys(Dr).map((n) => En(n4(e, n, t), t)), vo = (e, t) => qr(e, T$).map((n) => En(n, t)), Hr = (e, t, n) => vn(e, t, n) ?? e[0];
function U_(e, t) {
  const { element: n, edge: a } = Sa();
  return { ...Hr(Bs(a, e), e, t), view: null, on: n };
}
function G_(e, t, n, a) {
  const { element: s, edge: o } = Sa(), l = (a ? Bs(o, t) : [...Bs(o, t), ...vo(o, t)]).filter(
    (c) => !$a(ct(c, t), e)
  ), i = vn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !go(i, t) ? i : vn(l, t, n);
  return u && { ...u, view: null, on: s };
}
function An() {
  var a;
  const e = _n(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(A$);
  if (!t) return { ...Ma(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Al = { within: 2 };
function V_(e) {
  const { element: t, docked: n, edge: a } = An();
  if (!n || e.on !== t) return !0;
  const s = Ma().edge;
  return a.left > s.left + Al.within || a.left + a.width < s.left + s.width - Al.within;
}
const d4 = "[data-figure-closing]";
function K_() {
  var n;
  const { element: e, docked: t } = An();
  return t && !!((n = e.firstElementChild) != null && n.matches(d4));
}
const zr = "[data-figure-progress]";
function Y_(e) {
  const t = e.querySelector(zr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Q_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const f4 = { across: 300, above: 380, below: 60 };
function X_(e) {
  const { across: t, above: n, below: a } = f4;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: h4(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const h4 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Ur = "[data-figure-bar]", Rs = { back: 144, along: 0.4 };
function J_(e) {
  const { element: t, docked: n, edge: a } = An(), s = n ? t.querySelector(Ur) : null;
  if (!(s != null && s.querySelector(zr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...En({ x: o - Rs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Z_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Rs.along * a.size ? t.x + Rs.along * a.size : e.x, y: e.y, behind: !0 };
}
function eC(e) {
  const t = e.querySelector(Ur), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Ma() {
  const e = _n();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function tC(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Ma(), u = n === null ? m4(i, e, o === null ? t : { x: o, y: i.top }, a, s) : En({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function m4(e, t, n, a, s) {
  const o = vo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + mt.width < s && u.x + a - vt.reach - vt.room >= l);
  return vn(i.length ? i : o, t, n);
}
const p4 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function nC(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Rr));
  const y = (z) => {
    const L = ct(z, n, Cn[z.posture].travels);
    return { x: L.left, y: L.top };
  }, k = t.ladder ?? e.ladder;
  if (k && !(t.ladder && e.ladder)) return g4(y(e), y(t), y({ ...k.foot, posture: "stand" }), k.way, !!t.ladder, n, s);
  const [I, ...x] = [e, ...u, t].map(y), $ = ca(I, x[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: h, pogo: p }), B = x.slice(1).map((z, L) => {
    var w;
    return (w = ca(x[L], z, n.size, { random: i, memory: c, now: f, room: h })) == null ? void 0 : w.legs.find((H) => H.hopping);
  });
  return $ && { ...$, legs: [...$.legs, ...B.filter(Boolean)] };
}
function g4(e, t, n, a, s, o, l) {
  const i = (f, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - f.x, h.y - f.y) / p4.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? ca(e, n, o.size, { pace: l }) : ca(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function aC(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function sC(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && vn(e4(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Sa();
  return { ...Hr(vo(s, t), t, n), view: null, on: a };
}
const v4 = "[data-figure-bubble]", y4 = 250;
let sn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Gr = 0;
const Yt = () => sn, ns = /* @__PURE__ */ new WeakMap();
let b4 = 0;
function yo(e) {
  return ns.has(e) || ns.set(e, `floor-${++b4}`), ns.get(e);
}
const k4 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, w4 = () => {
  var e, t;
  return ((t = (e = _n()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function $4(e, t) {
  var a;
  const n = (a = e.querySelector(O$)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function x4(e, t) {
  const n = e && $4(e, t), a = e ? [...e.querySelectorAll(v4)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || k4(l, n))).map(({ element: o, type: l, box: i }) => ({ id: yo(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const S4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= y4 ? (t.top - a.top) / s * 1e3 : 0;
};
function Vr(e = sn, t = performance.now()) {
  const n = Ot(), a = w4(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = An(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Ma();
  return c.element && u.push({ id: yo(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...x4(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: S4(e, f, t) }))) });
}
const Ls = /* @__PURE__ */ new Set();
function M4(e) {
  return Ls.add(e), () => Ls.delete(e);
}
function _4() {
  Kr();
  const e = () => {
    Gr = requestAnimationFrame(e), !document.hidden && (sn = Vr(sn), Ls.forEach((t) => t(sn)));
  };
  e();
}
function Kr() {
  cancelAnimationFrame(Gr);
}
const bo = 5, C4 = 56, E4 = { share: 0.6 }, A4 = (e) => -Math.sqrt(2 * uo * E4.share * e), Ht = (e, t) => e.find((n) => n.id === t) ?? null;
function oC(e, t = Vr().floors) {
  const n = Ht(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : yo(e.on) : null, o = s && Ht(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Yr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = Yt().floors) {
  const c = Ht(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || O4(c, f, o)) && T4(f, i, u) ? { x: f.x, y: f.y } : null;
}
const ko = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, O4 = (e, t, n) => !ko({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function lC(e, t = Yt().floors) {
  if (!ko(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= bo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function T4(e, t, n = Yt().floors) {
  const a = Ht(n, "home");
  return e.posture === "hang" && a && ct(e, t).bottom >= a.top ? !1 : mo(e, t);
}
function iC(e, t, n, a = Yt().floors) {
  const s = Yr(e, n, a);
  if (!e.home) return I4(e, t, s, a);
  if (!s) return null;
  const o = Ht(a, "home"), l = s.y - t.y, i = l > bo ? "dropping" : -l > C4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function I4(e, t, n, a) {
  const s = n ? Ht(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: A4(e.risen) };
  if (!n) return null;
  if (ko(t) && n.y - t.y > bo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function rC(e, t, n) {
  const a = po * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function uC(e, t, n, a = Yt().floors) {
  const s = t && Yr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const B4 = ["data-type"], R4 = { class: "figure-floor-name" }, L4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", R4, v(e.floor.type), 1)
    ], 12, B4));
  }
}, N4 = /* @__PURE__ */ U(L4, [["__scopeId", "data-v-4e0f1e2e"]]), q4 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, D4 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ze(Yt().floors);
    let n = () => {
    };
    return Me(() => {
      n = M4((a) => t.value = a.floors), _4();
    }), Re(() => {
      n(), Kr();
    }), (a, s) => (r(), d("div", q4, [
      (r(!0), d(P, null, ne(t.value, (o) => (r(), F(N4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, cC = /* @__PURE__ */ U(D4, [["__scopeId", "data-v-e519168b"]]), on = (e) => typeof e == "number" ? e : Date.parse(e);
function dC(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: on(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => on(s.row.created_at) - on(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Ol = 20;
async function fC(e, t, n) {
  for (let a = 0; a < Ol; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || on(o.created_at) <= on(s.created_at) || !await n()) return a;
  }
  return Ol;
}
const P4 = 3, as = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function j4(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = as[n.grouping]) == null ? void 0 : a.call(as, e.row, n)) || "";
}
function F4(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function hC(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= P4 ? [F4(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = j4(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function W4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const mC = (e) => (t) => t.filter((n) => n.id !== e), pC = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), gC = (e) => (t) => [...t, e], vC = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function yC(e, t = {}) {
  const n = at(), a = E(null), s = E("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function bC(e) {
  const t = at(), n = E("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const zn = /* @__PURE__ */ new Map();
function H4(e, t) {
  if (zn.has(e)) return zn.get(e);
  const n = t().finally(() => zn.delete(e));
  return zn.set(e, n), n;
}
function kC() {
  const e = at(), t = E(null), n = E("");
  async function a() {
    const s = await H4(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const z4 = { class: "cards-page" }, U4 = { class: "cards-bar" }, G4 = { class: "cards-count" }, V4 = { class: "cards" }, K4 = {
  key: 1,
  class: "cards-note"
}, Y4 = {
  key: 2,
  class: "cards-note"
}, Q4 = ["data-row", "onClick"], X4 = { class: "card-head" }, J4 = { class: "card-title" }, Z4 = { class: "card-foot" }, ex = {
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
    return (a, s) => (r(), d("div", z4, [
      m("div", U4, [
        m("span", G4, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(pe, De({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: D(() => [
            A(le, {
              name: "plus",
              size: 12
            }),
            K(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", V4, [
        e.loaded ? e.failure ? (r(), d("p", K4, v(e.failure), 1)) : e.rows.length ? b("", !0) : (r(), d("p", Y4, "No " + v(e.term) + "s yet", 1)) : (r(), F(Qe, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(P, null, ne(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", X4, [
            A(le, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            K(" " + v(e.head(o)), 1),
            A(tt, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", J4, v(e.title(o)), 1),
          m("span", Z4, v(e.foot(o)), 1)
        ], 8, Q4))), 128))
      ]),
      re(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, wC = /* @__PURE__ */ U(ex, [["__scopeId", "data-v-b39fea5d"]]), Tl = "newest";
function $C(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Se(Le, null)) == null ? void 0 : c.search, s = E(""), o = E(Tl), l = E("all"), i = _(() => {
    const f = s.value.trim().toLowerCase(), h = e.value.filter((p) => W4(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Tl ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), u = _(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const tx = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, nx = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, ax = 40, sx = "top", ox = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Se(Le, null)) == null ? void 0 : p.autoScroll, s = _(() => a === sx), o = E(null), l = E(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= ax, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    me(() => {
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
    }), nt(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, k) => (r(), d("div", tx, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        re(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", nx, [
        A(Ut, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: D(() => [
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
              k[0] || (k[0] = K(" Newest ", -1))
            ], 512), [
              [Wl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, xC = /* @__PURE__ */ U(ox, [["__scopeId", "data-v-d704d7e3"]]), lx = ["aria-selected", "data-tab", "onClick"], ix = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, rx = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Se(Le, null), o = _(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = E(null), i = E({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var k;
      const y = (k = l.value) == null ? void 0 : k.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => Fe(() => c(!0));
    let h = null;
    return Me(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Re(() => h == null ? void 0 : h.disconnect()), me(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), me(() => n.answer, f, { deep: !0 }), (p, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(P, null, ne(o.value, (k) => {
        var I, x;
        return r(), d("button", {
          key: k.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((I = e.active) == null ? void 0 : I.key) === k.key }]),
          "aria-selected": ((x = e.active) == null ? void 0 : x.key) === k.key,
          "data-tab": k.key,
          onClick: ($) => a("choose", k)
        }, [
          K(v(k.label) + " ", 1),
          u(k) ? (r(), d("span", ix, v(e.answer[k.count_field]), 1)) : b("", !0)
        ], 10, lx);
      }), 128)),
      m("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ge({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, SC = /* @__PURE__ */ U(rx, [["__scopeId", "data-v-63fcd326"]]), ux = { class: "task-bar" }, cx = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", ux, [
      m("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: ge({ width: `${n(e.done)}%` })
      }, null, 4),
      m("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: ge({ width: `${n(e.testing)}%` })
      }, null, 4)
    ]));
  }
}, MC = /* @__PURE__ */ U(cx, [["__scopeId", "data-v-a4fc52ae"]]), dx = {
  class: "tab-body",
  "data-tab-body": ""
}, fx = { "data-tab-content": "" }, hx = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = E(!1);
    let a = 0;
    return me(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, js(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", dx, [
      n.value ? (r(), F(Qe, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : b("", !0),
      et(m("div", fx, [
        re(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Wl, !n.value]
      ])
    ]));
  }
}, _C = /* @__PURE__ */ U(hx, [["__scopeId", "data-v-63876533"]]), mx = {
  class: "search-bar",
  "data-search-bar": ""
}, px = { class: "search-bar-control" }, gx = ["value", "placeholder", "aria-label"], vx = ["aria-expanded"], yx = {
  key: 0,
  "data-menu-count": ""
}, bx = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var $;
    const a = e, s = n, o = ru(), l = (($ = Se(Le, null)) == null ? void 0 : $.search) ?? {}, i = _(() => l.placeholder || a.placeholder), u = l.context ?? [], c = E(null), f = E(null), h = E([]), p = _(() => h.value.length ? h.value[h.value.length - 1].next : u), y = _(() => !!o.menu || u.length > 0), k = (B) => {
      h.value = [], f.value = f.value ? null : B.currentTarget;
    };
    function I(B) {
      if (B.next.length) {
        h.value = [...h.value, B];
        return;
      }
      f.value = null, s("pick", B.click);
    }
    function x() {
      var B;
      s("update:modelValue", ""), (B = c.value) == null || B.focus();
    }
    return t({ focus: () => {
      var B;
      return (B = c.value) == null ? void 0 : B.focus();
    } }), (B, z) => {
      var L;
      return r(), d("div", mx, [
        m("div", px, [
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
            onInput: z[0] || (z[0] = (w) => s("update:modelValue", w.target.value)),
            onKeydown: _t(x, ["esc"])
          }, null, 40, gx),
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
          ])) : b("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: k
          }, [
            e.menuCount ? (r(), d("span", yx, v(e.menuCount), 1)) : b("", !0),
            A(le, {
              name: "caret",
              size: 12
            })
          ], 8, vx)) : b("", !0)
        ]),
        (L = R(l).button) != null && L.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: z[1] || (z[1] = (w) => s("pick", R(l).button.click))
        }, v(R(l).button.title), 1)) : b("", !0),
        re(B.$slots, "default", {}, void 0, !0),
        f.value ? (r(), F(ga, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: z[3] || (z[3] = xe(() => {
          }, ["stop"])),
          onClose: z[4] || (z[4] = (w) => f.value = null)
        }, {
          default: D(() => [
            h.value.length ? (r(), F(Ue, {
              key: 0,
              "data-search-back": "",
              onClick: z[2] || (z[2] = (w) => h.value = h.value.slice(0, -1))
            }, {
              default: D(() => [
                K("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : b("", !0),
            (r(!0), d(P, null, ne(p.value, (w) => (r(), F(Ue, {
              key: w.title,
              description: w.subtext,
              "data-search-entry": w.title,
              onClick: (H) => I(w)
            }, {
              default: D(() => [
                K(v(w.title) + v(w.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? b("", !0) : re(B.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : b("", !0)
      ]);
    };
  }
}, kx = /* @__PURE__ */ U(bx, [["__scopeId", "data-v-45374bed"]]), wx = {
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
    return (o, l) => (r(), F(kx, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: D(() => [
        A(Mt, null, {
          default: D(() => [...l[2] || (l[2] = [
            K("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(P, null, ne(a, (i) => A(Ue, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: D(() => [
            K(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(P, { key: 0 }, [
          A(Mt, null, {
            default: D(() => [...l[3] || (l[3] = [
              K("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(P, null, ne(s, (i) => A(Ue, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: D(() => [
              K(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : b("", !0)
      ]),
      default: D(() => [
        re(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, CC = /* @__PURE__ */ U(wx, [["__scopeId", "data-v-dab0064d"]]);
function EC() {
  const e = E(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const AC = (e) => import(
  /* @vite-ignore */
  e
), $x = 86400, Ns = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function xx(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ns(t) - Ns(e)) / $x);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function OC(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ns(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: xx(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ss = 280, os = 240, ls = 120, Sx = 6, Mx = 14, yn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function _x(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Qr(e, t) {
  const n = Math.max(0, _x(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Cx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Mx}px)` }), e.offsetHeight, e.style.transition = `height ${ss}ms ${yn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Qr(t, e));
    const p = s() - i;
    if (!u && p >= ss && (u = !0, e.style.transition = `opacity ${os}ms ease-out, transform ${os}ms ${yn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < ss + os) return a(h);
    f();
  };
  return a(h), f;
}
function TC(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Sx}px)` }), e.offsetHeight, e.style.transition = `opacity ${ls}ms ease-out, transform ${ls}ms ${yn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Qr(t, e)), s() - l < ls) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const Ex = 140, Un = 220, Il = 5;
function IC({ gap: e = Ex, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, h) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), h();
    });
  }
  function u() {
    const f = n.splice(0, Il);
    if (s = f.length > 0, !s) return;
    let h = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(u, e));
      });
  }
  const c = (f, h, p, y = Cx) => {
    if (l || !h.pane || !h.follows()) return p();
    const k = { el: f, options: h, done: p, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(k, () => o = t(u, e));
    f.style.display = "none", n.push(k), n.length >= Il && c.flush();
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
function BC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Un}ms ${yn}, opacity ${Un}ms ease-in, margin ${Un}ms ${yn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Un);
}
const Xr = "chat.pins.minimised", Xn = E(ta(Xr, !1));
function Bl(e) {
  Xn.value = e, Xs(Xr, e);
}
function Ax(e) {
  const t = _(() => e()), n = _(() => Xn.value ? [] : e()), a = () => Bl(!Xn.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && Bl(!1)
  ), { pins: t, visible: n, minimised: Xn, toggle: a };
}
const Ox = ["title"], Tx = {
  key: 0,
  class: "pins-count"
}, Ix = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Ax(() => t.pinRows);
    return (o, l) => R(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: R(a), inline: e.inline }]),
      title: R(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...i) => R(s) && R(s)(...i), ["stop"]))
    }, [
      A(le, {
        name: R(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      R(a) ? (r(), d("span", Tx, v(R(n).length), 1)) : b("", !0)
    ], 10, Ox)) : b("", !0);
  }
}, RC = /* @__PURE__ */ U(Ix, [["__scopeId", "data-v-d073c504"]]), Bx = ["title"], Rx = ["title"], Lx = { class: "diff-card-dir" }, Nx = { class: "diff-card-name" }, qx = ["title"], Dx = ["title"], Px = {
  key: 0,
  class: "diff-card-note"
}, jx = ["href"], Fx = ["src", "alt"], Wx = { class: "diff-card-rows" }, Hx = { class: "diff-row-num" }, zx = { class: "diff-row-sign" }, Ux = { class: "diff-row-code" }, Gx = {
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
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, u = _(() => n.path.lastIndexOf("/") + 1), c = _(() => n.path.slice(0, u.value)), f = _(() => n.path.slice(u.value)), h = _(() => n.change === "deleted"), p = _(() => l[n.change]), y = _(() => new Set(n.rows.filter((T) => T.line_type === "add").map((T) => T.line))), k = E("after"), I = _(() => k.value === "before" ? n.whole.old : n.whole.text), x = _(() => n.whole && n.whole.text !== void 0 ? I.value.split(`
`).map((T, M) => ({ line_type: k.value === "after" && y.value.has(M + 1) ? "add" : "ctx", line: M + 1, text: T })) : n.rows.filter(
      (T) => !(n.editsOnly && ["ctx", "fold"].includes(T.line_type)) && !(n.hideRemovals && T.line_type === "del")
    )), $ = E(!1), B = _(() => n.lines && !$.value && !n.whole), z = _(() => B.value ? x.value.slice(0, n.lines) : x.value), L = _(() => x.value.length - z.value.length), w = (T) => T.line === null || T.line_type === "del" ? "" : T.line, H = (T) => T.line_type === "fold" ? T.hidden ? `⋯ ${T.hidden} lines` : "⋯" : T.text, j = E(null), q = E(null);
    let C = null;
    return Me(() => {
      if (!q.value) return;
      let T = !0;
      C = new ResizeObserver(() => {
        !j.value || !q.value || (j.value.style.transition = T ? "none" : "", j.value.style.height = `${q.value.offsetHeight}px`, T = !1);
      }), C.observe(q.value);
    }), Re(() => C && C.disconnect()), (T, M) => (r(), d("section", {
      class: Y(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: M[2] || (M[2] = (g) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${R(s)}-click to open it`,
          onClick: o
        }, [
          m("span", Lx, v(c.value), 1),
          m("span", Nx, v(f.value), 1),
          p.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, v(p.value), 3)) : b("", !0)
        ], 8, Rx),
        m("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        A(tt, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: k.value === "after" ? "Show the file before" : "Show the file after",
          onClick: M[0] || (M[0] = xe((g) => k.value = k.value === "after" ? "before" : "after", ["stop"]))
        }, v(k.value === "after" ? "After" : "Before"), 9, qx)) : b("", !0),
        h.value ? b("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: M[1] || (M[1] = xe((g) => a("whole"), ["stop"]))
        }, [
          A(le, {
            name: "file",
            size: 12
          })
        ], 10, Dx))
      ], 8, Bx),
      e.whole && e.whole.error ? (r(), d("p", Px, v(e.whole.error), 1)) : b("", !0),
      !h.value && !e.folded ? (r(), d(P, { key: 1 }, [
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
          }, null, 8, Fx)
        ], 8, jx)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: j,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            m("div", Wx, [
              (r(!0), d(P, null, ne(z.value, (g, S) => (r(), d("div", {
                key: S,
                class: Y(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                m("span", Hx, v(w(g)), 1),
                m("span", zx, v(i[g.line_type]), 1),
                m("span", Ux, v(H(g)), 1)
              ], 2))), 128)),
              L.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: M[3] || (M[3] = xe((g) => $.value = !0, ["stop"]))
              }, v(L.value) + " more " + v(L.value === 1 ? "line" : "lines"), 1)) : b("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : b("", !0)
    ], 2));
  }
}, LC = /* @__PURE__ */ U(Gx, [["__scopeId", "data-v-23581cbb"]]), Vx = { "data-queue-controls": "" }, Kx = { class: "counts" }, Yx = { "data-queue-spots": "" }, Qx = {
  class: "spots",
  "aria-label": "Places in use"
}, Xx = { "data-queue-waiting": "" }, Jx = { key: 0 }, Zx = { class: "control" }, e8 = { class: "stepper" }, t8 = ["disabled"], n8 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, a8 = ["disabled"], s8 = ["for"], o8 = ["id", "value", "disabled", "onChange"], l8 = { class: "control" }, i8 = ["aria-checked", "disabled"], r8 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, u8 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, c8 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, d8 = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", Vx, [
      A(Wt, { icon: "gauge" }, {
        default: D(() => [...u[3] || (u[3] = [
          K("Now", -1)
        ])]),
        _: 1
      }),
      m("div", Kx, [
        m("div", null, [
          m("strong", Yx, [
            K(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", Qx, [
            (r(!0), d(P, null, ne(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", Xx, v(e.queue.waiting_count), 1),
          u[4] || (u[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", Jx, "The oldest goes first.")) : b("", !0)
        ])
      ]),
      m("div", Zx, [
        u[5] || (u[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", e8, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, t8),
          m("output", n8, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, a8)
        ])
      ]),
      (r(!0), d(P, null, ne(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, s8),
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
        }, null, 40, o8)
      ]))), 128)),
      m("div", l8, [
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
        ])], 8, i8)
      ]),
      e.queue.halt_cause === "update" ? (r(), d("p", r8, [
        A(le, {
          name: "pause",
          size: 13
        }),
        u[8] || (u[8] = K("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", u8, [
        A(le, {
          name: "pause",
          size: 13
        }),
        K("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : b("", !0),
      o.value ? (r(), d("p", c8, v(o.value), 1)) : b("", !0)
    ]));
  }
}, f8 = /* @__PURE__ */ U(d8, [["__scopeId", "data-v-975b4b89"]]), h8 = ["data-queue-row", "data-queue-process"], m8 = ["aria-expanded"], p8 = { class: "run-line" }, g8 = { class: "leading" }, v8 = {
  key: 0,
  "data-queue-position": ""
}, y8 = ["title"], b8 = { class: "command" }, k8 = {
  class: "time",
  "data-queue-time": ""
}, w8 = { class: "details" }, $8 = { "data-queue-type": "" }, x8 = { class: "failed" }, S8 = { class: "drop-inner" }, M8 = { class: "output" }, _8 = { class: "output-heading" }, C8 = ["href"], E8 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(), o = rr((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = lo(), u = _(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = _(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, k = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return k < 60 ? `${k} s` : k < 3600 ? `${Math.floor(k / 60)} m ${k % 60} s` : `${Math.floor(k / 3600)} h ${String(Math.floor(k / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await Fe(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await Fe(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return me(() => n.expanded, h, { immediate: !0 }), Sn(["output.*"], f, (p) => Hi(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (r(), d("div", {
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
          y[3] || (y[3] = _t(xe((k) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = _t(xe((k) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", p8, [
          m("span", g8, [
            e.run.section === "waiting" ? (r(), d("span", v8, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, y8))
          ]),
          m("code", b8, v(e.run.line), 1),
          m("span", k8, v(c.value), 1),
          A(le, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", w8, [
          m("span", $8, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(P, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = xe((k) => R(yt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(P, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : b("", !0),
          e.run.task_id ? (r(), d(P, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = xe((k) => R(yt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : b("", !0),
          e.run.state === "failed" ? (r(), d(P, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", x8, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : b("", !0)
        ])
      ], 40, m8),
      m("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        m("div", S8, [
          m("div", M8, [
            m("div", _8, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, C8)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (k) => e.expanded && R(o).loadEarlier(k.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              K(v(e.run.line), 1),
              R(l).length ? (r(), d(P, { key: 0 }, [
                K(v(`
` + R(l).join(`
`)), 1)
              ], 64)) : b("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, h8));
  }
}, A8 = /* @__PURE__ */ U(E8, [["__scopeId", "data-v-18099d0b"]]), O8 = {
  class: "process-queue",
  "data-test-queue": ""
}, T8 = { class: "scroll" }, I8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, B8 = ["data-queue-empty"], is = 20, R8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = E(null), a = E(""), s = E([]), o = E(is), l = _(() => {
      var p, y;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let i = 0;
    const u = _(() => n.value ? [
      { type: "running", heading: "Running", icon: "start", rows: n.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: n.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: n.value.recent, empty: "Nothing has run yet." }
    ].flatMap((y) => [
      { key: `band:${y.type}`, section: y },
      ...y.rows.length ? y.rows.map((k, I) => ({ key: `run:${k.id}`, run: k, position: I + 1 })) : [{ key: `none:${y.type}`, section: y, empty: !0 }]
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
    return Sn(["process.*", "setting.*"], f), Me(f), (p, y) => (r(), d("article", O8, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", T8, [
        a.value ? (r(), d("p", I8, v(a.value), 1)) : b("", !0),
        n.value ? (r(), d(P, { key: 1 }, [
          A(f8, {
            queue: n.value,
            read: e.read,
            onSaved: f
          }, null, 8, ["queue", "read"]),
          A(Ps, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: D(() => [
              (r(!0), d(P, null, ne(u.value, (k) => (r(), d(P, {
                key: k.key
              }, [
                k.run ? (r(), F(A8, {
                  key: 0,
                  run: k.run,
                  environment: n.value.environment_name,
                  position: k.position,
                  read: e.read,
                  expanded: s.value.includes(k.run.id),
                  onToggle: (I) => c(k.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : k.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": k.section.type
                }, v(k.section.empty), 9, B8)) : (r(), F(Wt, {
                  key: 2,
                  icon: k.section.icon,
                  count: k.section.rows.length,
                  "data-queue-heading": k.section.type
                }, {
                  default: D(() => [
                    K(v(k.section.heading), 1)
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
          }, "Show older commands")) : b("", !0)
        ], 64)) : a.value ? b("", !0) : (r(), F(Qe, { key: 2 }))
      ])
    ]));
  }
}, NC = /* @__PURE__ */ U(R8, [["__scopeId", "data-v-d9b6ef6b"]]), L8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, N8 = ["aria-expanded"], q8 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, D8 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, P8 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, j8 = {
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
    const t = e, n = E(t.open), a = E(0), s = E(0), o = E("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return me(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), Sn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(P, null, [
      a.value ? (r(), d("section", L8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", q8, v(a.value), 1),
          A(Kt, { open: n.value }, null, 8, ["open"])
        ], 8, N8),
        m("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", D8, [
            A(ed, {
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
          ])) : b("", !0)
        ], 2)
      ])) : b("", !0),
      o.value ? (r(), d("p", P8, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, F8 = /* @__PURE__ */ U(j8, [["__scopeId", "data-v-a4550728"]]), W8 = ["placeholder"], H8 = { class: "actions" }, z8 = { class: "error" }, U8 = {
  key: 1,
  class: "card closed"
}, G8 = { class: "mark" }, V8 = { class: "prompt" }, K8 = {
  key: 0,
  class: "draft"
}, Y8 = {
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
    const a = e, s = n, o = ln(e, "draft"), l = ln(e, "error"), i = E(!!l.value), u = E(!1), c = E(!1), f = E(null);
    async function h() {
      var k, I;
      i.value = !0, u.value = !1, await Fe(), (I = ((k = f.value) == null ? void 0 : k.querySelector("input")) || f.value) == null || I.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const k = o.value.trim();
      if (!(!k || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(k), i.value = !1, u.value = !0;
        } catch (I) {
          o.value = k, l.value = I.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (k, I) => (r(), d("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(y, ["prevent"]),
        onKeydown: _t(p, ["esc"])
      }, [
        re(k.$slots, "who", {}, void 0, !0),
        et(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": I[0] || (I[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: I[1] || (I[1] = _t((x) => R(Vi)(x, y), ["enter"]))
        }, null, 40, W8), [
          [Zn, o.value]
        ]),
        m("div", H8, [
          m("span", z8, v(l.value), 1),
          A(pe, {
            small: "",
            onClick: p
          }, {
            default: D(() => [...I[3] || (I[3] = [
              K("Cancel", -1)
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
            default: D(() => [...I[4] || (I[4] = [
              K("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", U8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", G8, [
            A(le, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", V8, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", K8, "Draft kept")) : b("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: I[2] || (I[2] = (x) => s("show"))
        }, [
          m("span", null, v(R(nd)(e.count, "comment")), 1),
          A(le, {
            name: "down",
            size: 12
          })
        ])) : b("", !0)
      ]))
    ], 2));
  }
}, Q8 = /* @__PURE__ */ U(Y8, [["__scopeId", "data-v-b68baddd"]]), X8 = { wide: 1130 }, J8 = /\{([A-Za-z_]\w*)\}/g;
function Jn(e, t, n = {}) {
  return e.replace(J8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const Z8 = (e, t, n, a) => Jn(e.label, n, { row_id: a, id: a }) || A2(t, n, a), e3 = { class: "comment-side-head" }, t3 = {
  key: 0,
  class: "comment-none"
}, n3 = { key: 0 }, a3 = {
  key: 1,
  class: "comment-none"
}, s3 = {
  class: "comment",
  "data-comment": ""
}, o3 = {
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
      class: Y(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", e3, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        A(va, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", t3, "No comments yet")) : b("", !0),
      (r(!0), d(P, null, ne(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", n3, v(a.quote), 1)) : b("", !0),
        a.revision ? (r(), d("span", a3, "Revision " + v(a.revision), 1)) : b("", !0),
        m("p", s3, v(e.words(a)), 1)
      ]))), 128)),
      A(kn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Rl = /* @__PURE__ */ U(o3, [["__scopeId", "data-v-276284a3"]]), l3 = { class: "resource-heading" }, i3 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, r3 = {
  key: 1,
  class: "resource-abstract"
}, u3 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", l3, [
      e.title ? (r(), d("h2", i3, v(e.title), 1)) : b("", !0),
      e.abstract ? (r(), d("p", r3, v(e.abstract), 1)) : b("", !0)
    ]));
  }
}, c3 = /* @__PURE__ */ U(u3, [["__scopeId", "data-v-d65ef53f"]]), d3 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, f3 = { class: "inspector-icons" }, h3 = { class: "inspector-icons-start" }, m3 = {
  class: "inspector-label",
  "data-resource-type": ""
}, p3 = { class: "inspector-icons-end" }, g3 = ["href"], v3 = {
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
    const n = e, a = t, s = _(() => `${n.opened.table}:${n.opened.id}`), o = _(() => n.shareable && !n.readOnly), l = _(() => n.backed ? "Close all rows" : "Close");
    return (i, u) => (r(), d("header", d3, [
      m("div", f3, [
        m("span", h3, [
          e.backed ? (r(), F(pe, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: u[0] || (u[0] = (c) => a("back"))
          }, {
            default: D(() => [
              A(le, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : b("", !0),
          e.stepped ? (r(), d(P, { key: 1 }, [
            A(pe, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: u[1] || (u[1] = (c) => a("step", -1))
            }, {
              default: D(() => [
                A(le, {
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
              onClick: u[2] || (u[2] = (c) => a("step", 1))
            }, {
              default: D(() => [
                A(le, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : b("", !0)
        ]),
        m("p", m3, v(e.label), 1),
        m("span", p3, [
          e.embedded ? (r(), F(pe, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: u[3] || (u[3] = (c) => R(je)(s.value))
          }, {
            default: D(() => [
              A(le, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : b("", !0),
          o.value ? (r(), d("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this link",
            "aria-label": "Share this link",
            "data-resource-share": "",
            href: R(Hf)(s.value)
          }, [
            A(le, {
              name: "share",
              size: 13
            })
          ], 8, g3)) : b("", !0),
          e.embedded ? b("", !0) : (r(), F(pe, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: u[4] || (u[4] = (c) => a("close"))
          }, {
            default: D(() => [
              A(le, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(c3, {
        title: e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, y3 = /* @__PURE__ */ U(v3, [["__scopeId", "data-v-414d2086"]]), b3 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, k3 = { class: "field-name" }, w3 = {
  key: 1,
  class: "field-value"
}, $3 = ["onClick"], x3 = {
  key: 2,
  class: "field-value"
}, S3 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", b3, [
      (r(!0), d(P, null, ne(e.fields, (o) => (r(), d(P, {
        key: o.name
      }, [
        m("p", k3, v(o.label), 1),
        o.isTime ? (r(), F(tt, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", w3, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, $3)
        ])) : (r(), d("p", x3, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, M3 = /* @__PURE__ */ U(S3, [["__scopeId", "data-v-7e45afb5"]]);
async function _3(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: O2(s.value.actor, s.value.creator_agent), owner: a.length ? T2(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const C3 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, E3 = {
  key: 1,
  class: "inspector-wait"
}, A3 = { class: "inspector-main" }, O3 = { class: "inspector-column" }, T3 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, I3 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, B3 = { class: "inspector-text" }, R3 = ["innerHTML"], L3 = {
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
    const n = e, a = t, s = E(null);
    Ds(ti, _(() => {
      var W;
      return ((W = s.value) == null ? void 0 : W.$el) ?? null;
    }));
    const o = /* @__PURE__ */ new Set(["question", "memory", "rule"]), l = _(() => n.catalogue.inspector(n.term) ?? {
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
    }), i = E(null), u = E(""), c = E(""), f = E(""), h = E("details"), p = E(null), y = E(0);
    let k = 0;
    const I = _(() => ({ row_id: n.id, id: n.id })), x = _(() => i.value ? Jn(l.value.title, i.value, I.value) || E2(n.term, i.value, n.id) : ""), $ = _(() => i.value ? Z8(l.value, n.term, i.value, n.id) : ""), B = _(() => $.value === x.value ? "" : $.value), z = _(() => i.value ? Jn(l.value.description, i.value, I.value) : ""), L = _(() => {
      var W, V, Q;
      return ((W = i.value) == null ? void 0 : W.body) || ((V = i.value) == null ? void 0 : V.brief) || (o.has(n.term) ? (Q = i.value) == null ? void 0 : Q.text : "") || "";
    }), w = _(() => L.value ? Zs(L.value, { env: "", rowNames: !1 }) : ""), H = _(() => I2(i.value, L.value, u.value, c.value)), j = _(() => l.value.comments && y.value >= X8.wide), q = _(() => l.value.comments && !j.value), C = (W) => l.value.components.filter((V) => (V.tab || "") === W).map((V) => V.window), T = _(() => [...new Set(l.value.components.map((W) => W.tab).filter(Boolean))]), M = _(() => T.value.length || q.value ? [{ key: "details", label: "Details" }, ...T.value.map((W) => ({ key: W, label: W })), ...q.value ? [{ key: "comments", label: "Comments" }] : []] : []), g = _(() => {
      const W = l.value.links;
      return W ? { categories: W.categories, open: W.open, outsidePlan: W.excludes_plan, pageSize: W.page_size } : null;
    }), S = Ji(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (W) => n.read(W));
    async function O() {
      const W = ++k, V = await n.read(Jn(l.value.reads, null, I.value).split(/\s+/).filter(Boolean));
      if (W !== k || (f.value = V.ok ? "" : V.error, !V.ok)) return;
      i.value = V.value;
      const Q = await _3(n.read, i.value);
      W === k && (u.value = Q.creator, c.value = Q.owner);
    }
    me(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", h.value = "details", O();
    }, { immediate: !0 }), Sn(l.value.events, O), me(S.open, (W) => W && q.value && (h.value = "comments"));
    let N = null;
    return Me(() => {
      var W;
      y.value = ((W = p.value) == null ? void 0 : W.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (N = new ResizeObserver(() => y.value = p.value.clientWidth), N.observe(p.value));
    }), Re(() => N == null ? void 0 : N.disconnect()), (W, V) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(y3, {
        label: B.value,
        title: x.value,
        description: z.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: V[0] || (V[0] = (Q) => a("close")),
        onBack: V[1] || (V[1] = (Q) => a("back")),
        onStep: V[2] || (V[2] = (Q) => a("step", Q))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", C3, v(f.value), 1)) : i.value ? (r(), d(P, { key: 2 }, [
        A(_s, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: D(() => [
            A(Qs, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: O
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        m("div", A3, [
          m("div", O3, [
            M.value.length ? (r(), d("div", T3, [
              A(Ft, {
                options: M.value,
                value: h.value,
                onPick: V[3] || (V[3] = (Q) => h.value = Q)
              }, null, 8, ["options", "value"])
            ])) : b("", !0),
            m("div", I3, [
              A(Gt, { value: h.value }, {
                details: D(() => [
                  m("div", B3, [
                    w.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: w.value
                    }, null, 8, R3)) : b("", !0),
                    l.value.lists_fields ? (r(), F(M3, {
                      key: 1,
                      fields: H.value,
                      onPeek: V[4] || (V[4] = (Q) => a("open", Q))
                    }, null, 8, ["fields"])) : b("", !0)
                  ]),
                  A(Ss, {
                    "slot-name": `inspector.${e.term}`,
                    names: C(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: D(() => [
                  A(Rl, {
                    below: "",
                    comments: R(S).comments.value,
                    words: R(S).words,
                    more: !!R(S).nextPage.value,
                    loading: R(S).loading.value,
                    failure: R(S).failure.value,
                    onMore: R(S).loadMore,
                    onClose: V[5] || (V[5] = (Q) => h.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: D(() => [
                  A(Ss, {
                    names: C(h.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              g.value ? (r(), F(F8, De({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, g.value, {
                onOpen: V[6] || (V[6] = (Q) => a("open", Q))
              }), null, 16, ["model", "id", "read"])) : b("", !0)
            ]),
            l.value.comments ? (r(), F(Q8, {
              key: 1,
              send: R(S).send,
              count: R(S).total.value,
              onShow: V[7] || (V[7] = (Q) => q.value && (h.value = "comments"))
            }, null, 8, ["send", "count"])) : b("", !0)
          ]),
          j.value ? (r(), F(Rl, {
            key: 0,
            comments: R(S).comments.value,
            words: R(S).words,
            more: !!R(S).nextPage.value,
            loading: R(S).loading.value,
            failure: R(S).failure.value,
            onMore: R(S).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : b("", !0)
        ])
      ], 64)) : (r(), d("div", E3, [
        A(Qe)
      ]))
    ], 512));
  }
}, N3 = /* @__PURE__ */ U(L3, [["__scopeId", "data-v-60363e95"]]), qC = {
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
    const t = Se(Vs);
    return (n, a) => (r(), F(N3, De(n.$props, {
      catalogue: R(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, q3 = { class: "facts" }, D3 = { class: "fact wide" }, P3 = ["title"], j3 = {
  key: 1,
  class: "fact-value"
}, F3 = {
  key: 0,
  class: "fact"
}, W3 = { class: "fact-value" }, H3 = { class: "fact" }, z3 = { class: "fact-label" }, U3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, G3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, V3 = {
  key: 2,
  class: "fact"
}, K3 = { class: "fact-value" }, Y3 = { class: "fact wide" }, Q3 = { class: "fact-label" }, X3 = { class: "fact wide" }, J3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Z3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = la.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", q3, [
        m("div", D3, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => R(je)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, P3)) : (r(), d("span", j3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", F3, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", W3, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : b("", !0),
        e.task.helper_id ? (r(), d(P, { key: 1 }, [
          m("div", H3, [
            m("span", z3, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A(dn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: R(no)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => R(je)(`agents:${e.task.helper_id}`))
            }, {
              default: D(() => [
                A(Dt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          R(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", U3, [
            A(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = K(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", G3, [
            A(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = K(" takes it after the task it is on.", -1))
          ])) : b("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", V3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", K3, "Agent " + v(e.task.holder_id), 1)
        ])) : b("", !0),
        m("div", Y3, [
          m("span", Q3, [
            i[9] || (i[9] = K(" Complexity ", -1)),
            A(hi, {
              lines: R(or).map((f, h) => `${h + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Ft, {
            options: R(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        m("div", X3, [
          i[10] || (i[10] = m("span", { class: "fact-label" }, "Priority", -1)),
          A(Ft, {
            options: R(n),
            value: String(R(sr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", J3, v(e.refusal), 1)) : b("", !0)
        ])
      ]);
    };
  }
}, eS = /* @__PURE__ */ U(Z3, [["__scopeId", "data-v-4bf27961"]]);
function tS(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const nS = { class: "number" }, aS = { class: "title" }, sS = { class: "word" }, oS = {
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
    return (a, s) => (r(), F(Ke(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: D(() => [
        A(ka, { status: e.status }, null, 8, ["status"]),
        m("span", nS, v(e.number), 1),
        m("span", aS, v(e.title), 1),
        m("span", sS, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, rs = /* @__PURE__ */ U(oS, [["__scopeId", "data-v-f6417ae8"]]), lS = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, iS = { class: "level" }, rS = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1);
    me(() => n.task.id, () => s.value = !1);
    const o = _(() => tS(n.task.id, n.graph)), l = _(() => s.value ? o.value.above : o.value.above.slice(-1)), i = _(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = _(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), f = (h, p = !1) => ({ status: fn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (r(), d("section", lS, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (r(!0), d(P, null, ne(l.value, (y) => (r(), d(P, {
        key: y.map((k) => k.id).join()
      }, [
        m("div", iS, [
          (r(!0), d(P, null, ne(y, (k) => (r(), F(rs, De({
            key: k.id,
            ref_for: !0
          }, f(k), {
            onSelect: p[0] || (p[0] = (I) => a("select", I))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(rs, cs(Fl(f(e.task, !0))), null, 16),
      (r(!0), d(P, null, ne(i.value, (y) => (r(), d(P, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        A(rs, De({ ref_for: !0 }, f(y), {
          onSelect: p[1] || (p[1] = (k) => a("select", k))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : b("", !0)
    ])) : b("", !0);
  }
}, uS = /* @__PURE__ */ U(rS, [["__scopeId", "data-v-79c52417"]]), cS = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, dS = ["datetime"], fS = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", cS, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (r(!0), d(P, null, ne(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, dS),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : b("", !0);
  }
}, hS = /* @__PURE__ */ U(fS, [["__scopeId", "data-v-b41f213b"]]), mS = {
  class: "part",
  "data-resource-waits": ""
}, pS = ["onClick"], gS = { class: "wait-id" }, vS = { class: "wait-title" }, yS = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", mS, [
      m("h4", null, v(e.title), 1),
      (r(!0), d(P, null, ne(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(ka, {
          status: R(fn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", gS, v(o.id), 1),
        m("span", vS, v(o.title), 1)
      ], 8, pS))), 128))
    ]));
  }
}, Ll = /* @__PURE__ */ U(yS, [["__scopeId", "data-v-8fb2e251"]]), bS = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, kS = { class: "text" }, wS = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, $S = 180, xS = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = E(!1), l = _(() => a.task.waits.filter((u) => !n.has(u.state))), i = _(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(P, null, [
      l.value.length ? (r(), F(Ll, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : b("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", bS, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", kS, v(e.task.outcome), 1)
      ])) : b("", !0),
      e.task.brief ? (r(), d("section", wS, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Y(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > $S && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : b("", !0)
      ])) : b("", !0),
      i.value.length ? (r(), F(Ll, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : b("", !0)
    ], 64));
  }
}, SS = /* @__PURE__ */ U(xS, [["__scopeId", "data-v-4a3f1e79"]]), MS = {
  class: "task-details",
  "data-task-details": ""
}, _S = { class: "since" }, CS = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, ES = { class: "text" }, AS = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, OS = {
  key: 1,
  class: "note"
}, TS = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, IS = { class: "text" }, BS = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", MS, [
        m("div", {
          class: Y(["state-line", R(fn)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(ka, {
              status: R(fn)(e.task.state)
            }, null, 8, ["status"]),
            K(" " + v(a(e.task.state)), 1)
          ]),
          m("span", _S, [
            o[5] || (o[5] = K(" since ", -1)),
            A(tt, {
              at: R(kh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", CS, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", ES, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", AS, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", OS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", TS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", IS, v(e.task.reason), 1)
        ])) : b("", !0),
        e.graph ? (r(), F(uS, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : b("", !0),
        A(eS, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(SS, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(hS, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, DC = /* @__PURE__ */ U(BS, [["__scopeId", "data-v-7e73fa21"]]), RS = 50, LS = { messages: 25 }, NS = (e) => LS[e] || RS, qS = {
  class: "task-log",
  "aria-label": "Task log"
}, DS = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, PS = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, jS = { class: "entries" }, FS = ["data-task-log-important"], WS = ["datetime"], HS = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, zS = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = E([]), a = E(1), s = E(!0), o = E(!0), l = E("");
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
        String(NS("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return me(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), nt(() => {
      i += 1;
    }), (c, f) => (r(), d("section", qS, [
      o.value ? (r(), F(Qe, { key: 0 })) : l.value ? (r(), d(P, { key: 1 }, [
        m("p", DS, v(l.value), 1),
        A(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (h) => u(a.value))
        }, {
          default: D(() => [...f[3] || (f[3] = [
            K("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(P, { key: 2 }, [
        n.value.length ? b("", !0) : (r(), d("p", PS, "No log entries yet.")),
        m("ol", jS, [
          (r(!0), d(P, null, ne(n.value, (h) => (r(), d("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, WS),
            m("p", null, v(h.line), 1)
          ], 10, FS))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", HS, [
          A(pe, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (h) => u(a.value - 1))
          }, {
            default: D(() => [...f[4] || (f[4] = [
              K("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          A(pe, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (h) => u(a.value + 1))
          }, {
            default: D(() => [...f[5] || (f[5] = [
              K("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : b("", !0)
      ], 64))
    ]));
  }
}, PC = /* @__PURE__ */ U(zS, [["__scopeId", "data-v-cfa43bf1"]]);
function US(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var us = { exports: {} }, Nl;
function GS() {
  return Nl || (Nl = 1, (function(e, t) {
    var n = (function() {
      var a = function(w, H) {
        var j = 236, q = 17, C = w, T = o[H], M = null, g = 0, S = null, O = [], N = {}, W = function(X, J) {
          g = C * 4 + 17, M = (function(G) {
            for (var Z = new Array(G), ee = 0; ee < G; ee += 1) {
              Z[ee] = new Array(G);
              for (var se = 0; se < G; se += 1)
                Z[ee][se] = null;
            }
            return Z;
          })(g), V(0, 0), V(g - 7, 0), V(0, g - 7), ve(), he(), _e(X, J), C >= 7 && ye(X), S == null && (S = ae(C, T, O)), oe(S, J);
        }, V = function(X, J) {
          for (var G = -1; G <= 7; G += 1)
            if (!(X + G <= -1 || g <= X + G))
              for (var Z = -1; Z <= 7; Z += 1)
                J + Z <= -1 || g <= J + Z || (0 <= G && G <= 6 && (Z == 0 || Z == 6) || 0 <= Z && Z <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= Z && Z <= 4 ? M[X + G][J + Z] = !0 : M[X + G][J + Z] = !1);
        }, Q = function() {
          for (var X = 0, J = 0, G = 0; G < 8; G += 1) {
            W(!0, G);
            var Z = i.getLostPoint(N);
            (G == 0 || X > Z) && (X = Z, J = G);
          }
          return J;
        }, he = function() {
          for (var X = 8; X < g - 8; X += 1)
            M[X][6] == null && (M[X][6] = X % 2 == 0);
          for (var J = 8; J < g - 8; J += 1)
            M[6][J] == null && (M[6][J] = J % 2 == 0);
        }, ve = function() {
          for (var X = i.getPatternPosition(C), J = 0; J < X.length; J += 1)
            for (var G = 0; G < X.length; G += 1) {
              var Z = X[J], ee = X[G];
              if (M[Z][ee] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    se == -2 || se == 2 || ce == -2 || ce == 2 || se == 0 && ce == 0 ? M[Z + se][ee + ce] = !0 : M[Z + se][ee + ce] = !1;
            }
        }, ye = function(X) {
          for (var J = i.getBCHTypeNumber(C), G = 0; G < 18; G += 1) {
            var Z = !X && (J >> G & 1) == 1;
            M[Math.floor(G / 3)][G % 3 + g - 8 - 3] = Z;
          }
          for (var G = 0; G < 18; G += 1) {
            var Z = !X && (J >> G & 1) == 1;
            M[G % 3 + g - 8 - 3][Math.floor(G / 3)] = Z;
          }
        }, _e = function(X, J) {
          for (var G = T << 3 | J, Z = i.getBCHTypeInfo(G), ee = 0; ee < 15; ee += 1) {
            var se = !X && (Z >> ee & 1) == 1;
            ee < 6 ? M[ee][8] = se : ee < 8 ? M[ee + 1][8] = se : M[g - 15 + ee][8] = se;
          }
          for (var ee = 0; ee < 15; ee += 1) {
            var se = !X && (Z >> ee & 1) == 1;
            ee < 8 ? M[8][g - ee - 1] = se : ee < 9 ? M[8][15 - ee - 1 + 1] = se : M[8][15 - ee - 1] = se;
          }
          M[g - 8][8] = !X;
        }, oe = function(X, J) {
          for (var G = -1, Z = g - 1, ee = 7, se = 0, ce = i.getMaskFunction(J), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var $e = 0; $e < 2; $e += 1)
                if (M[Z][ue - $e] == null) {
                  var Ae = !1;
                  se < X.length && (Ae = (X[se] >>> ee & 1) == 1);
                  var fe = ce(Z, ue - $e);
                  fe && (Ae = !Ae), M[Z][ue - $e] = Ae, ee -= 1, ee == -1 && (se += 1, ee = 7);
                }
              if (Z += G, Z < 0 || g <= Z) {
                Z -= G, G = -G;
                break;
              }
            }
        }, te = function(X, J) {
          for (var G = 0, Z = 0, ee = 0, se = new Array(J.length), ce = new Array(J.length), ue = 0; ue < J.length; ue += 1) {
            var $e = J[ue].dataCount, Ae = J[ue].totalCount - $e;
            Z = Math.max(Z, $e), ee = Math.max(ee, Ae), se[ue] = new Array($e);
            for (var fe = 0; fe < se[ue].length; fe += 1)
              se[ue][fe] = 255 & X.getBuffer()[fe + G];
            G += $e;
            var We = i.getErrorCorrectPolynomial(Ae), He = c(se[ue], We.getLength() - 1), wo = He.mod(We);
            ce[ue] = new Array(We.getLength() - 1);
            for (var fe = 0; fe < ce[ue].length; fe += 1) {
              var $o = fe + wo.getLength() - ce[ue].length;
              ce[ue][fe] = $o >= 0 ? wo.getAt($o) : 0;
            }
          }
          for (var xo = 0, fe = 0; fe < J.length; fe += 1)
            xo += J[fe].totalCount;
          for (var _a = new Array(xo), On = 0, fe = 0; fe < Z; fe += 1)
            for (var ue = 0; ue < J.length; ue += 1)
              fe < se[ue].length && (_a[On] = se[ue][fe], On += 1);
          for (var fe = 0; fe < ee; fe += 1)
            for (var ue = 0; ue < J.length; ue += 1)
              fe < ce[ue].length && (_a[On] = ce[ue][fe], On += 1);
          return _a;
        }, ae = function(X, J, G) {
          for (var Z = f.getRSBlocks(X, J), ee = h(), se = 0; se < G.length; se += 1) {
            var ce = G[se];
            ee.put(ce.getMode(), 4), ee.put(ce.getLength(), i.getLengthInBits(ce.getMode(), X)), ce.write(ee);
          }
          for (var ue = 0, se = 0; se < Z.length; se += 1)
            ue += Z[se].dataCount;
          if (ee.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + ee.getLengthInBits() + ">" + ue * 8 + ")";
          for (ee.getLengthInBits() + 4 <= ue * 8 && ee.put(0, 4); ee.getLengthInBits() % 8 != 0; )
            ee.putBit(!1);
          for (; !(ee.getLengthInBits() >= ue * 8 || (ee.put(j, 8), ee.getLengthInBits() >= ue * 8)); )
            ee.put(q, 8);
          return te(ee, Z);
        };
        N.addData = function(X, J) {
          J = J || "Byte";
          var G = null;
          switch (J) {
            case "Numeric":
              G = p(X);
              break;
            case "Alphanumeric":
              G = y(X);
              break;
            case "Byte":
              G = k(X);
              break;
            case "Kanji":
              G = I(X);
              break;
            default:
              throw "mode:" + J;
          }
          O.push(G), S = null;
        }, N.isDark = function(X, J) {
          if (X < 0 || g <= X || J < 0 || g <= J)
            throw X + "," + J;
          return M[X][J];
        }, N.getModuleCount = function() {
          return g;
        }, N.make = function() {
          if (C < 1) {
            for (var X = 1; X < 40; X++) {
              for (var J = f.getRSBlocks(X, T), G = h(), Z = 0; Z < O.length; Z++) {
                var ee = O[Z];
                G.put(ee.getMode(), 4), G.put(ee.getLength(), i.getLengthInBits(ee.getMode(), X)), ee.write(G);
              }
              for (var se = 0, Z = 0; Z < J.length; Z++)
                se += J[Z].dataCount;
              if (G.getLengthInBits() <= se * 8)
                break;
            }
            C = X;
          }
          W(!1, Q());
        }, N.createTableTag = function(X, J) {
          X = X || 2, J = typeof J > "u" ? X * 4 : J;
          var G = "";
          G += '<table style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: " + J + "px;", G += '">', G += "<tbody>";
          for (var Z = 0; Z < N.getModuleCount(); Z += 1) {
            G += "<tr>";
            for (var ee = 0; ee < N.getModuleCount(); ee += 1)
              G += '<td style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: 0px;", G += " width: " + X + "px;", G += " height: " + X + "px;", G += " background-color: ", G += N.isDark(Z, ee) ? "#000000" : "#ffffff", G += ";", G += '"/>';
            G += "</tr>";
          }
          return G += "</tbody>", G += "</table>", G;
        }, N.createSvgTag = function(X, J, G, Z) {
          var ee = {};
          typeof arguments[0] == "object" && (ee = arguments[0], X = ee.cellSize, J = ee.margin, G = ee.alt, Z = ee.title), X = X || 2, J = typeof J > "u" ? X * 4 : J, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-description" : null, Z = typeof Z == "string" ? { text: Z } : Z || {}, Z.text = Z.text || null, Z.id = Z.text ? Z.id || "qrcode-title" : null;
          var se = N.getModuleCount() * X + J * 2, ce, ue, $e, Ae, fe = "", We;
          for (We = "l" + X + ",0 0," + X + " -" + X + ",0 0,-" + X + "z ", fe += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', fe += ee.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', fe += ' viewBox="0 0 ' + se + " " + se + '" ', fe += ' preserveAspectRatio="xMinYMin meet"', fe += Z.text || G.text ? ' role="img" aria-labelledby="' + Te([Z.id, G.id].join(" ").trim()) + '"' : "", fe += ">", fe += Z.text ? '<title id="' + Te(Z.id) + '">' + Te(Z.text) + "</title>" : "", fe += G.text ? '<description id="' + Te(G.id) + '">' + Te(G.text) + "</description>" : "", fe += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', fe += '<path d="', $e = 0; $e < N.getModuleCount(); $e += 1)
            for (Ae = $e * X + J, ce = 0; ce < N.getModuleCount(); ce += 1)
              N.isDark($e, ce) && (ue = ce * X + J, fe += "M" + ue + "," + Ae + We);
          return fe += '" stroke="transparent" fill="black"/>', fe += "</svg>", fe;
        }, N.createDataURL = function(X, J) {
          X = X || 2, J = typeof J > "u" ? X * 4 : J;
          var G = N.getModuleCount() * X + J * 2, Z = J, ee = G - J;
          return L(G, G, function(se, ce) {
            if (Z <= se && se < ee && Z <= ce && ce < ee) {
              var ue = Math.floor((se - Z) / X), $e = Math.floor((ce - Z) / X);
              return N.isDark($e, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, N.createImgTag = function(X, J, G) {
          X = X || 2, J = typeof J > "u" ? X * 4 : J;
          var Z = N.getModuleCount() * X + J * 2, ee = "";
          return ee += "<img", ee += ' src="', ee += N.createDataURL(X, J), ee += '"', ee += ' width="', ee += Z, ee += '"', ee += ' height="', ee += Z, ee += '"', G && (ee += ' alt="', ee += Te(G), ee += '"'), ee += "/>", ee;
        };
        var Te = function(X) {
          for (var J = "", G = 0; G < X.length; G += 1) {
            var Z = X.charAt(G);
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
        }, Jr = function(X) {
          var J = 1;
          X = typeof X > "u" ? J * 2 : X;
          var G = N.getModuleCount() * J + X * 2, Z = X, ee = G - X, se, ce, ue, $e, Ae, fe = {
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
          for (se = 0; se < G; se += 2) {
            for (ue = Math.floor((se - Z) / J), $e = Math.floor((se + 1 - Z) / J), ce = 0; ce < G; ce += 1)
              Ae = "█", Z <= ce && ce < ee && Z <= se && se < ee && N.isDark(ue, Math.floor((ce - Z) / J)) && (Ae = " "), Z <= ce && ce < ee && Z <= se + 1 && se + 1 < ee && N.isDark($e, Math.floor((ce - Z) / J)) ? Ae += " " : Ae += "█", He += X < 1 && se + 1 >= ee ? We[Ae] : fe[Ae];
            He += `
`;
          }
          return G % 2 && X > 0 ? He.substring(0, He.length - G - 1) + Array(G + 1).join("▀") : He.substring(0, He.length - 1);
        };
        return N.createASCII = function(X, J) {
          if (X = X || 1, X < 2)
            return Jr(J);
          X -= 1, J = typeof J > "u" ? X * 2 : J;
          var G = N.getModuleCount() * X + J * 2, Z = J, ee = G - J, se, ce, ue, $e, Ae = Array(X + 1).join("██"), fe = Array(X + 1).join("  "), We = "", He = "";
          for (se = 0; se < G; se += 1) {
            for (ue = Math.floor((se - Z) / X), He = "", ce = 0; ce < G; ce += 1)
              $e = 1, Z <= ce && ce < ee && Z <= se && se < ee && N.isDark(ue, Math.floor((ce - Z) / X)) && ($e = 0), He += $e ? Ae : fe;
            for (ue = 0; ue < X; ue += 1)
              We += He + `
`;
          }
          return We.substring(0, We.length - 1);
        }, N.renderTo2dContext = function(X, J) {
          J = J || 2;
          for (var G = N.getModuleCount(), Z = 0; Z < G; Z++)
            for (var ee = 0; ee < G; ee++)
              X.fillStyle = N.isDark(Z, ee) ? "black" : "white", X.fillRect(Z * J, ee * J, J, J);
        }, N;
      };
      a.stringToBytesFuncs = {
        default: function(w) {
          for (var H = [], j = 0; j < w.length; j += 1) {
            var q = w.charCodeAt(j);
            H.push(q & 255);
          }
          return H;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(w, H) {
        var j = (function() {
          for (var C = B(w), T = function() {
            var he = C.read();
            if (he == -1) throw "eof";
            return he;
          }, M = 0, g = {}; ; ) {
            var S = C.read();
            if (S == -1) break;
            var O = T(), N = T(), W = T(), V = String.fromCharCode(S << 8 | O), Q = N << 8 | W;
            g[V] = Q, M += 1;
          }
          if (M != H)
            throw M + " != " + H;
          return g;
        })(), q = 63;
        return function(C) {
          for (var T = [], M = 0; M < C.length; M += 1) {
            var g = C.charCodeAt(M);
            if (g < 128)
              T.push(g);
            else {
              var S = j[C.charAt(M)];
              typeof S == "number" ? (S & 255) == S ? T.push(S) : (T.push(S >>> 8), T.push(S & 255)) : T.push(q);
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
        ], H = 1335, j = 7973, q = 21522, C = {}, T = function(M) {
          for (var g = 0; M != 0; )
            g += 1, M >>>= 1;
          return g;
        };
        return C.getBCHTypeInfo = function(M) {
          for (var g = M << 10; T(g) - T(H) >= 0; )
            g ^= H << T(g) - T(H);
          return (M << 10 | g) ^ q;
        }, C.getBCHTypeNumber = function(M) {
          for (var g = M << 12; T(g) - T(j) >= 0; )
            g ^= j << T(g) - T(j);
          return M << 12 | g;
        }, C.getPatternPosition = function(M) {
          return w[M - 1];
        }, C.getMaskFunction = function(M) {
          switch (M) {
            case l.PATTERN000:
              return function(g, S) {
                return (g + S) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, S) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, S) {
                return S % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, S) {
                return (g + S) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, S) {
                return (Math.floor(g / 2) + Math.floor(S / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, S) {
                return g * S % 2 + g * S % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, S) {
                return (g * S % 2 + g * S % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, S) {
                return (g * S % 3 + (g + S) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + M;
          }
        }, C.getErrorCorrectPolynomial = function(M) {
          for (var g = c([1], 0), S = 0; S < M; S += 1)
            g = g.multiply(c([1, u.gexp(S)], 0));
          return g;
        }, C.getLengthInBits = function(M, g) {
          if (1 <= g && g < 10)
            switch (M) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + M;
            }
          else if (g < 27)
            switch (M) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + M;
            }
          else if (g < 41)
            switch (M) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + M;
            }
          else
            throw "type:" + g;
        }, C.getLostPoint = function(M) {
          for (var g = M.getModuleCount(), S = 0, O = 0; O < g; O += 1)
            for (var N = 0; N < g; N += 1) {
              for (var W = 0, V = M.isDark(O, N), Q = -1; Q <= 1; Q += 1)
                if (!(O + Q < 0 || g <= O + Q))
                  for (var he = -1; he <= 1; he += 1)
                    N + he < 0 || g <= N + he || Q == 0 && he == 0 || V == M.isDark(O + Q, N + he) && (W += 1);
              W > 5 && (S += 3 + W - 5);
            }
          for (var O = 0; O < g - 1; O += 1)
            for (var N = 0; N < g - 1; N += 1) {
              var ve = 0;
              M.isDark(O, N) && (ve += 1), M.isDark(O + 1, N) && (ve += 1), M.isDark(O, N + 1) && (ve += 1), M.isDark(O + 1, N + 1) && (ve += 1), (ve == 0 || ve == 4) && (S += 3);
            }
          for (var O = 0; O < g; O += 1)
            for (var N = 0; N < g - 6; N += 1)
              M.isDark(O, N) && !M.isDark(O, N + 1) && M.isDark(O, N + 2) && M.isDark(O, N + 3) && M.isDark(O, N + 4) && !M.isDark(O, N + 5) && M.isDark(O, N + 6) && (S += 40);
          for (var N = 0; N < g; N += 1)
            for (var O = 0; O < g - 6; O += 1)
              M.isDark(O, N) && !M.isDark(O + 1, N) && M.isDark(O + 2, N) && M.isDark(O + 3, N) && M.isDark(O + 4, N) && !M.isDark(O + 5, N) && M.isDark(O + 6, N) && (S += 40);
          for (var ye = 0, N = 0; N < g; N += 1)
            for (var O = 0; O < g; O += 1)
              M.isDark(O, N) && (ye += 1);
          var _e = Math.abs(100 * ye / g / g - 50) / 5;
          return S += _e * 10, S;
        }, C;
      })(), u = (function() {
        for (var w = new Array(256), H = new Array(256), j = 0; j < 8; j += 1)
          w[j] = 1 << j;
        for (var j = 8; j < 256; j += 1)
          w[j] = w[j - 4] ^ w[j - 5] ^ w[j - 6] ^ w[j - 8];
        for (var j = 0; j < 255; j += 1)
          H[w[j]] = j;
        var q = {};
        return q.glog = function(C) {
          if (C < 1)
            throw "glog(" + C + ")";
          return H[C];
        }, q.gexp = function(C) {
          for (; C < 0; )
            C += 255;
          for (; C >= 256; )
            C -= 255;
          return w[C];
        }, q;
      })();
      function c(w, H) {
        if (typeof w.length > "u")
          throw w.length + "/" + H;
        var j = (function() {
          for (var C = 0; C < w.length && w[C] == 0; )
            C += 1;
          for (var T = new Array(w.length - C + H), M = 0; M < w.length - C; M += 1)
            T[M] = w[M + C];
          return T;
        })(), q = {};
        return q.getAt = function(C) {
          return j[C];
        }, q.getLength = function() {
          return j.length;
        }, q.multiply = function(C) {
          for (var T = new Array(q.getLength() + C.getLength() - 1), M = 0; M < q.getLength(); M += 1)
            for (var g = 0; g < C.getLength(); g += 1)
              T[M + g] ^= u.gexp(u.glog(q.getAt(M)) + u.glog(C.getAt(g)));
          return c(T, 0);
        }, q.mod = function(C) {
          if (q.getLength() - C.getLength() < 0)
            return q;
          for (var T = u.glog(q.getAt(0)) - u.glog(C.getAt(0)), M = new Array(q.getLength()), g = 0; g < q.getLength(); g += 1)
            M[g] = q.getAt(g);
          for (var g = 0; g < C.getLength(); g += 1)
            M[g] ^= u.gexp(u.glog(C.getAt(g)) + T);
          return c(M, 0).mod(C);
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
        ], H = function(C, T) {
          var M = {};
          return M.totalCount = C, M.dataCount = T, M;
        }, j = {}, q = function(C, T) {
          switch (T) {
            case o.L:
              return w[(C - 1) * 4 + 0];
            case o.M:
              return w[(C - 1) * 4 + 1];
            case o.Q:
              return w[(C - 1) * 4 + 2];
            case o.H:
              return w[(C - 1) * 4 + 3];
            default:
              return;
          }
        };
        return j.getRSBlocks = function(C, T) {
          var M = q(C, T);
          if (typeof M > "u")
            throw "bad rs block @ typeNumber:" + C + "/errorCorrectionLevel:" + T;
          for (var g = M.length / 3, S = [], O = 0; O < g; O += 1)
            for (var N = M[O * 3 + 0], W = M[O * 3 + 1], V = M[O * 3 + 2], Q = 0; Q < N; Q += 1)
              S.push(H(W, V));
          return S;
        }, j;
      })(), h = function() {
        var w = [], H = 0, j = {};
        return j.getBuffer = function() {
          return w;
        }, j.getAt = function(q) {
          var C = Math.floor(q / 8);
          return (w[C] >>> 7 - q % 8 & 1) == 1;
        }, j.put = function(q, C) {
          for (var T = 0; T < C; T += 1)
            j.putBit((q >>> C - T - 1 & 1) == 1);
        }, j.getLengthInBits = function() {
          return H;
        }, j.putBit = function(q) {
          var C = Math.floor(H / 8);
          w.length <= C && w.push(0), q && (w[C] |= 128 >>> H % 8), H += 1;
        }, j;
      }, p = function(w) {
        var H = s.MODE_NUMBER, j = w, q = {};
        q.getMode = function() {
          return H;
        }, q.getLength = function(M) {
          return j.length;
        }, q.write = function(M) {
          for (var g = j, S = 0; S + 2 < g.length; )
            M.put(C(g.substring(S, S + 3)), 10), S += 3;
          S < g.length && (g.length - S == 1 ? M.put(C(g.substring(S, S + 1)), 4) : g.length - S == 2 && M.put(C(g.substring(S, S + 2)), 7));
        };
        var C = function(M) {
          for (var g = 0, S = 0; S < M.length; S += 1)
            g = g * 10 + T(M.charAt(S));
          return g;
        }, T = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          throw "illegal char :" + M;
        };
        return q;
      }, y = function(w) {
        var H = s.MODE_ALPHA_NUM, j = w, q = {};
        q.getMode = function() {
          return H;
        }, q.getLength = function(T) {
          return j.length;
        }, q.write = function(T) {
          for (var M = j, g = 0; g + 1 < M.length; )
            T.put(
              C(M.charAt(g)) * 45 + C(M.charAt(g + 1)),
              11
            ), g += 2;
          g < M.length && T.put(C(M.charAt(g)), 6);
        };
        var C = function(T) {
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
      }, k = function(w) {
        var H = s.MODE_8BIT_BYTE, j = a.stringToBytes(w), q = {};
        return q.getMode = function() {
          return H;
        }, q.getLength = function(C) {
          return j.length;
        }, q.write = function(C) {
          for (var T = 0; T < j.length; T += 1)
            C.put(j[T], 8);
        }, q;
      }, I = function(w) {
        var H = s.MODE_KANJI, j = a.stringToBytesFuncs.SJIS;
        if (!j)
          throw "sjis not supported.";
        (function(T, M) {
          var g = j(T);
          if (g.length != 2 || (g[0] << 8 | g[1]) != M)
            throw "sjis not supported.";
        })("友", 38726);
        var q = j(w), C = {};
        return C.getMode = function() {
          return H;
        }, C.getLength = function(T) {
          return ~~(q.length / 2);
        }, C.write = function(T) {
          for (var M = q, g = 0; g + 1 < M.length; ) {
            var S = (255 & M[g]) << 8 | 255 & M[g + 1];
            if (33088 <= S && S <= 40956)
              S -= 33088;
            else if (57408 <= S && S <= 60351)
              S -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + S;
            S = (S >>> 8 & 255) * 192 + (S & 255), T.put(S, 13), g += 2;
          }
          if (g < M.length)
            throw "illegal char at " + (g + 1);
        }, C;
      }, x = function() {
        var w = [], H = {};
        return H.writeByte = function(j) {
          w.push(j & 255);
        }, H.writeShort = function(j) {
          H.writeByte(j), H.writeByte(j >>> 8);
        }, H.writeBytes = function(j, q, C) {
          q = q || 0, C = C || j.length;
          for (var T = 0; T < C; T += 1)
            H.writeByte(j[T + q]);
        }, H.writeString = function(j) {
          for (var q = 0; q < j.length; q += 1)
            H.writeByte(j.charCodeAt(q));
        }, H.toByteArray = function() {
          return w;
        }, H.toString = function() {
          var j = "";
          j += "[";
          for (var q = 0; q < w.length; q += 1)
            q > 0 && (j += ","), j += w[q];
          return j += "]", j;
        }, H;
      }, $ = function() {
        var w = 0, H = 0, j = 0, q = "", C = {}, T = function(g) {
          q += String.fromCharCode(M(g & 63));
        }, M = function(g) {
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
        return C.writeByte = function(g) {
          for (w = w << 8 | g & 255, H += 8, j += 1; H >= 6; )
            T(w >>> H - 6), H -= 6;
        }, C.flush = function() {
          if (H > 0 && (T(w << 6 - H), w = 0, H = 0), j % 3 != 0)
            for (var g = 3 - j % 3, S = 0; S < g; S += 1)
              q += "=";
        }, C.toString = function() {
          return q;
        }, C;
      }, B = function(w) {
        var H = w, j = 0, q = 0, C = 0, T = {};
        T.read = function() {
          for (; C < 8; ) {
            if (j >= H.length) {
              if (C == 0)
                return -1;
              throw "unexpected end of file./" + C;
            }
            var g = H.charAt(j);
            if (j += 1, g == "=")
              return C = 0, -1;
            if (g.match(/^\s$/))
              continue;
            q = q << 6 | M(g.charCodeAt(0)), C += 6;
          }
          var S = q >>> C - 8 & 255;
          return C -= 8, S;
        };
        var M = function(g) {
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
      }, z = function(w, H) {
        var j = w, q = H, C = new Array(w * H), T = {};
        T.setPixel = function(O, N, W) {
          C[N * j + O] = W;
        }, T.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(j), O.writeShort(q), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(j), O.writeShort(q), O.writeByte(0);
          var N = 2, W = g(N);
          O.writeByte(N);
          for (var V = 0; W.length - V > 255; )
            O.writeByte(255), O.writeBytes(W, V, 255), V += 255;
          O.writeByte(W.length - V), O.writeBytes(W, V, W.length - V), O.writeByte(0), O.writeString(";");
        };
        var M = function(O) {
          var N = O, W = 0, V = 0, Q = {};
          return Q.write = function(he, ve) {
            if (he >>> ve)
              throw "length over";
            for (; W + ve >= 8; )
              N.writeByte(255 & (he << W | V)), ve -= 8 - W, he >>>= 8 - W, V = 0, W = 0;
            V = he << W | V, W = W + ve;
          }, Q.flush = function() {
            W > 0 && N.writeByte(V);
          }, Q;
        }, g = function(O) {
          for (var N = 1 << O, W = (1 << O) + 1, V = O + 1, Q = S(), he = 0; he < N; he += 1)
            Q.add(String.fromCharCode(he));
          Q.add(String.fromCharCode(N)), Q.add(String.fromCharCode(W));
          var ve = x(), ye = M(ve);
          ye.write(N, V);
          var _e = 0, oe = String.fromCharCode(C[_e]);
          for (_e += 1; _e < C.length; ) {
            var te = String.fromCharCode(C[_e]);
            _e += 1, Q.contains(oe + te) ? oe = oe + te : (ye.write(Q.indexOf(oe), V), Q.size() < 4095 && (Q.size() == 1 << V && (V += 1), Q.add(oe + te)), oe = te);
          }
          return ye.write(Q.indexOf(oe), V), ye.write(W, V), ye.flush(), ve.toByteArray();
        }, S = function() {
          var O = {}, N = 0, W = {};
          return W.add = function(V) {
            if (W.contains(V))
              throw "dup key:" + V;
            O[V] = N, N += 1;
          }, W.size = function() {
            return N;
          }, W.indexOf = function(V) {
            return O[V];
          }, W.contains = function(V) {
            return typeof O[V] < "u";
          }, W;
        };
        return T;
      }, L = function(w, H, j) {
        for (var q = z(w, H), C = 0; C < H; C += 1)
          for (var T = 0; T < w; T += 1)
            q.setPixel(T, C, j(T, C));
        var M = x();
        q.write(M);
        for (var g = $(), S = M.toByteArray(), O = 0; O < S.length; O += 1)
          g.writeByte(S[O]);
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
var VS = GS();
const KS = /* @__PURE__ */ US(VS), YS = ["width", "height", "viewBox"], QS = ["width", "height"], XS = ["d"], JS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = _(() => {
      const a = KS(0, "M");
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
      }, null, 8, QS),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, XS)
    ], 8, YS));
  }
}, jC = /* @__PURE__ */ U(JS, [["__scopeId", "data-v-489f0852"]]), ZS = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, FC = /* @__PURE__ */ U(ZS, [["__scopeId", "data-v-47e67f04"]]);
function WC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const HC = uu(() => import("./VoiceFigure-BTBrulaO.js").then((e) => e.V)), zC = "1.2.0", UC = "3.5";
export {
  Pf as $,
  Oe as A,
  Be as B,
  $a as C,
  ct as D,
  G_ as E,
  n4 as F,
  NM as G,
  W_ as H,
  N$ as I,
  u4 as J,
  Ot as K,
  a6 as L,
  po as M,
  p4 as N,
  r4 as O,
  wa as P,
  r_ as Q,
  pM as R,
  Qn as S,
  h_ as T,
  iM as U,
  Ie as V,
  ra as W,
  lM as X,
  oM as Y,
  Df as Z,
  U as _,
  X6 as a,
  O_ as a$,
  h4 as a0,
  gM as a1,
  vM as a2,
  Le as a3,
  EM as a4,
  CM as a5,
  Ct as a6,
  yM as a7,
  jM as a8,
  j6 as a9,
  $_ as aA,
  o_ as aB,
  M$ as aC,
  zM as aD,
  UM as aE,
  V_ as aF,
  Rr as aG,
  f_ as aH,
  _n as aI,
  G6 as aJ,
  H6 as aK,
  N_ as aL,
  Cn as aM,
  j_ as aN,
  LM as aO,
  l_ as aP,
  i_ as aQ,
  s_ as aR,
  pn as aS,
  St as aT,
  F6 as aU,
  p5 as aV,
  n_ as aW,
  hM as aX,
  Ir as aY,
  Ht as aZ,
  Yt as a_,
  T_ as aa,
  D_ as ab,
  Y6 as ac,
  rM as ad,
  uM as ae,
  MM as af,
  _M as ag,
  AM as ah,
  tM as ai,
  _l as aj,
  bM as ak,
  PM as al,
  X_ as am,
  JM as an,
  QM as ao,
  YM as ap,
  OM as aq,
  xM as ar,
  $M as as,
  SM as at,
  d_ as au,
  DM as av,
  FM as aw,
  eC as ax,
  nn as ay,
  WM as az,
  _4 as b,
  Z_ as b$,
  J$ as b0,
  P_ as b1,
  g_ as b2,
  p_ as b3,
  P5 as b4,
  br as b5,
  C_ as b6,
  qM as b7,
  Ma as b8,
  mt as b9,
  y_ as bA,
  S_ as bB,
  vt as bC,
  m_ as bD,
  M_ as bE,
  HM as bF,
  ZM as bG,
  GM as bH,
  qe as bI,
  RM as bJ,
  __ as bK,
  rC as bL,
  uC as bM,
  D6 as bN,
  y5 as bO,
  IM as bP,
  b_ as bQ,
  J6 as bR,
  Q_ as bS,
  v_ as bT,
  k_ as bU,
  w_ as bV,
  TM as bW,
  _$ as bX,
  BM as bY,
  KM as bZ,
  Y_ as b_,
  x_ as ba,
  Qa as bb,
  Ri as bc,
  nC as bd,
  oC as be,
  c_ as bf,
  L_ as bg,
  P6 as bh,
  XM as bi,
  aC as bj,
  kM as bk,
  wM as bl,
  aM as bm,
  mM as bn,
  U6 as bo,
  B_ as bp,
  Z6 as bq,
  eM as br,
  sM as bs,
  t_ as bt,
  c5 as bu,
  F_ as bv,
  i4 as bw,
  nM as bx,
  V6 as by,
  e_ as bz,
  D5 as c,
  la as c$,
  z6 as c0,
  W6 as c1,
  VM as c2,
  lC as c3,
  ko as c4,
  iC as c5,
  Yr as c6,
  R_ as c7,
  dM as c8,
  cM as c9,
  io as cA,
  cC as cB,
  t6 as cC,
  Kt as cD,
  Hd as cE,
  qC as cF,
  tp as cG,
  ti as cH,
  le as cI,
  hi as cJ,
  SC as cK,
  h6 as cL,
  zC as cM,
  UC as cN,
  C6 as cO,
  CC as cP,
  Cs as cQ,
  B6 as cR,
  u2 as cS,
  Ue as cT,
  Mt as cU,
  ga as cV,
  $6 as cW,
  E6 as cX,
  c6 as cY,
  Mc as cZ,
  Hw as c_,
  m5 as ca,
  K6 as cb,
  o4 as cc,
  a_ as cd,
  fo as ce,
  k$ as cf,
  u_ as cg,
  an as ch,
  Pt as ci,
  Dt as cj,
  b6 as ck,
  w6 as cl,
  dn as cm,
  xC as cn,
  pe as co,
  yf as cp,
  Qs as cq,
  va as cr,
  cy as cs,
  ya as ct,
  LC as cu,
  q6 as cv,
  k6 as cw,
  hy as cx,
  Ui as cy,
  rn as cz,
  Ye as d,
  n2 as d$,
  RC as d0,
  p6 as d1,
  g6 as d2,
  v6 as d3,
  S6 as d4,
  NC as d5,
  jC as d6,
  Ki as d7,
  ed as d8,
  wC as d9,
  FC as dA,
  so as dB,
  gC as dC,
  js as dD,
  op as dE,
  no as dF,
  m6 as dG,
  xn as dH,
  vd as dI,
  IC as dJ,
  TC as dK,
  Us as dL,
  gd as dM,
  Hs as dN,
  BC as dO,
  N6 as dP,
  Hi as dQ,
  s1 as dR,
  y6 as dS,
  Sw as dT,
  R6 as dU,
  I6 as dV,
  hC as dW,
  dm as dX,
  dC as dY,
  l6 as dZ,
  AC as d_,
  O0 as da,
  r6 as db,
  L6 as dc,
  kx as dd,
  Ft as de,
  A6 as df,
  Qe as dg,
  bt as dh,
  wv as di,
  rd as dj,
  Fm as dk,
  T6 as dl,
  u6 as dm,
  Gt as dn,
  _C as dp,
  MC as dq,
  uS as dr,
  DC as ds,
  PC as dt,
  ka as du,
  Ud as dv,
  lt as dw,
  O6 as dx,
  tt as dy,
  HC as dz,
  fM as e,
  W4 as e0,
  sr as e1,
  d6 as e2,
  _6 as e3,
  pC as e4,
  vC as e5,
  je as e6,
  ip as e7,
  x6 as e8,
  Cc as e9,
  yC as eA,
  ds as eB,
  bC as eC,
  kC as eD,
  at as eE,
  OC as eF,
  ea as eG,
  fC as ea,
  ir as eb,
  mC as ec,
  zl as ed,
  M6 as ee,
  hp as ef,
  i6 as eg,
  fp as eh,
  Na as ei,
  o6 as ej,
  un as ek,
  ii as el,
  yd as em,
  f6 as en,
  gt as eo,
  WC as ep,
  H4 as eq,
  n6 as er,
  s6 as es,
  $C as et,
  Wi as eu,
  EC as ev,
  rr as ew,
  ai as ex,
  Ax as ey,
  Fs as ez,
  u5 as f,
  tC as g,
  gn as h,
  H_ as i,
  sC as j,
  z_ as k,
  I_ as l,
  T4 as m,
  go as n,
  q_ as o,
  Q6 as p,
  U_ as q,
  Vr as r,
  Kr as s,
  Ee as t,
  F5 as u,
  E_ as v,
  J_ as w,
  A_ as x,
  An as y,
  K_ as z
};
