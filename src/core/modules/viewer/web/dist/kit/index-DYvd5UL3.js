import { openBlock as r, createElementBlock as d, normalizeStyle as ye, unref as O, renderSlot as ne, createElementVNode as h, normalizeClass as K, Fragment as R, renderList as X, defineComponent as Fu, Comment as Wu, h as _a, cloneVNode as Hu, createBlock as P, withCtx as q, createVNode as A, toDisplayString as v, createCommentVNode as w, ref as E, inject as Se, watch as fe, onMounted as Ce, onBeforeUnmount as tt, reactive as nn, shallowRef as lt, onUnmounted as Be, useAttrs as Ca, computed as _, resolveDynamicComponent as Ze, mergeProps as De, useId as Zs, resolveDirective as zu, withDirectives as ke, createTextVNode as U, Teleport as Tn, nextTick as Ne, Transition as an, withModifiers as ge, createApp as Uu, shallowReactive as Vu, withKeys as Ve, createSlots as Ea, onScopeDispose as Aa, useModel as Dt, mergeModels as ht, toRef as Fa, vModelText as Ue, resolveComponent as li, provide as eo, onErrorCaptured as Gu, TransitionGroup as to, isRef as zo, getCurrentInstance as Ku, useSlots as Yu, vShow as no, getCurrentScope as ii, normalizeProps as kt, guardReactiveProps as ri, vModelSelect as Pt, defineAsyncComponent as Qu } from "vue";
function ui(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const H = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Xu = 1600, Ju = {
  __name: "Shimmer",
  setup(e) {
    const t = ui(Xu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ye(O(t))
    }, null, 4));
  }
}, hn = /* @__PURE__ */ H(Ju, [["__scopeId", "data-v-6c018b03"]]), Zu = { class: "skeleton-line" }, ec = 2e3, tc = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = ui(ec);
    return (n, a) => (r(), d("span", Zu, [
      ne(n.$slots, "default", {}, void 0, !0),
      h("span", {
        class: K(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(R, null, X(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: K(["bar", { still: e.still }]),
          style: ye({ ...O(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Ot = /* @__PURE__ */ H(tc, [["__scopeId", "data-v-484fe8a0"]]), Ft = Fu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Wu);
      return a.length !== 1 ? _a(R, { key: n }, a) : a[0].key == null ? Hu(a[0], { key: n }) : a[0];
    };
  }
}), nc = ["aria-label"], ac = ["aria-label"], sc = ["aria-label"], oc = ["aria-label"], lc = ["aria-label"], ic = ["aria-label"], rc = ["aria-label"], uc = {
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
    return (u, c) => (r(), P(Ft, { value: e.shape }, {
      messages: q(() => [
        h("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(R, null, X(t, (f) => A(hn, {
            key: f.id,
            class: K(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, nc)
      ]),
      older: q(() => [
        h("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(t.slice(0, 3), (f) => (r(), P(hn, {
            key: f.id,
            class: K(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, ac)
      ]),
      cards: q(() => [
        h("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(R, null, X(n, (m) => A(Ot, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, sc)
      ]),
      file: q(() => [
        h("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            A(Ot, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(R, null, X(s, (m) => A(Ot, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, oc)
      ]),
      page: q(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(Ot, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(R, null, X(e.count, (f) => (r(), P(Ot, {
            key: f,
            bars: O(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, lc)
      ]),
      text: q(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(e.count, (f) => (r(), P(Ot, {
            key: f,
            bars: O(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, ic)
      ]),
      default: q(() => [
        h("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(R, null, X(e.count, (f) => (r(), P(Ot, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, rc)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, nt = /* @__PURE__ */ H(uc, [["__scopeId", "data-v-ef519c5f"]]), cc = {
  key: 1,
  class: "empty-state titled"
}, dc = { class: "empty-state-title" }, fc = { class: "empty-state-text" }, mc = {
  key: 2,
  class: "empty-state"
}, hc = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), P(nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", cc, [
      h("p", dc, v(e.title), 1),
      h("p", fc, [
        ne(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", mc, [
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Mt = /* @__PURE__ */ H(hc, [["__scopeId", "data-v-b27e89b0"]]), pc = { class: "fold-group" }, vc = ["aria-expanded"], gc = { class: "fold-label" }, yc = {
  key: 0,
  class: "fold-count"
}, bc = {
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
    return (a, s) => (r(), d("div", pc, [
      h("button", {
        type: "button",
        class: K(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        h("span", gc, v(e.label), 1),
        e.count !== "" ? (r(), d("span", yc, v(e.count), 1)) : w("", !0),
        h("span", {
          class: K(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, vc),
      e.open ? ne(a.$slots, "default", {}, void 0, !0, 0) : w("", !0)
    ]));
  }
}, ZE = /* @__PURE__ */ H(bc, [["__scopeId", "data-v-9ef1865c"]]), kc = 150, wc = () => kc;
function ao(e, t, n = wc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function ci(e, t, n) {
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
const $c = 50, Uo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function eA(e) {
  const t = at().sources.find((n) => n.key === e);
  return t ? Ms(t.read, t.events) : Ms("", []);
}
function di(e, t, n, a, s = () => !1) {
  const o = E([]), l = E(null), i = E(""), u = E(!1), c = performance.now(), f = E(!1), m = E(""), p = E(null), b = /* @__PURE__ */ new Set();
  let $ = null;
  function y(g) {
    return s() ? (b.add(g), $ ?? ($ = new Promise((x) => setTimeout(() => x(k()), $c)))) : S(g);
  }
  async function k() {
    const g = new Set(b);
    b.clear(), $ = null;
    const x = D, T = await t({ ids: [...g].join(","), limit: g.size });
    if (x !== D) return;
    if (!T.ok) return B();
    const L = new Map(T.value.rows.map((W) => [W.id, W]));
    o.value = o.value.flatMap((W) => g.has(W.id) ? L.has(W.id) ? [L.get(W.id)] : [] : [W]);
  }
  async function S(g) {
    const x = D, T = await t({ "before-id": g + 1, limit: 1 });
    if (x !== D) return;
    if (!T.ok) return B();
    const L = T.value.rows.find((W) => W.id === g);
    o.value = L ? o.value.map((W) => W.id === g ? L : W) : o.value.filter((W) => W.id !== g);
  }
  async function C(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((Z) => Z.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((Z) => Z.id === g.row_id)) return y(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return B();
    const T = Math.max(...o.value.map((Z) => Z.id)), L = D, W = await t({ "after-id": T });
    if (L !== D) return;
    if (!W.ok) return B();
    const Y = new Set(o.value.map((Z) => Z.id));
    o.value = [...W.value.rows.filter((Z) => !Y.has(Z.id)), ...o.value];
  }
  async function N() {
    if (!f.value || !o.value.length) return !1;
    const g = D, x = Math.min(...o.value.map((W) => W.id)), T = await t({ "before-id": x });
    if (g !== D) return !1;
    if (!T.ok || !T.value.rows.length) return f.value = !1;
    f.value = Uo(T.value, n());
    const L = new Set(o.value.map((W) => W.id));
    return o.value = [...o.value, ...T.value.rows.filter((W) => !L.has(W.id))], !0;
  }
  let D = 0;
  function I(g, x) {
    var W, Y;
    const T = g.ok ? e.shared ? [g.value] : ((W = g.value) == null ? void 0 : W.rows) ?? [] : [];
    g.ok && (o.value = x(T)), l.value = g.ok ? g.value : null;
    const L = T.length ? Math.min(...T.map((Z) => Z.id)) : 0;
    g.ok && ((Y = g.value) != null && Y.rows) && !o.value.some((Z) => Z.id < L) && (f.value = !e.shared && Uo(g.value, n())), i.value = g.ok ? "" : g.error, ao(c, () => u.value = !0);
  }
  async function G(g) {
    const x = ++D, T = await t({});
    x === D && I(T, g);
  }
  const F = (g) => {
    if (!a() || !g.length) return g;
    const x = Math.min(...g.map((L) => L.id)), T = Math.max(...g.map((L) => L.id));
    return [...o.value.filter((L) => L.id > T), ...g, ...o.value.filter((L) => L.id < x)];
  }, B = () => G(F), j = (g) => I(g, F), V = () => G((g) => g);
  async function M(g, x = null) {
    const T = await ci(x && { target: o, fields: { value: x(o.value) } }, g, e.run);
    return m.value = T.ok ? "" : T.error, p.value = T.ok ? T.value : null, await B(), T;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: B, loadLatest: V, older: N, act: M, actionFailure: m, answer: p, context: e, heard: C, showFirst: j, pageSize: n };
}
const xc = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ms(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = at(), l = di(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${xc(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Sc = 2e3;
function so(e, t, n = Sc) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Se(Le, null), u = () => {
    var y;
    return ((y = i == null ? void 0 : i.visible) == null ? void 0 : y.value) === !1;
  }, c = () => document.hidden || u(), f = async (y) => {
    o = !0;
    try {
      await y();
    } catch {
    } finally {
      o = !1;
    }
  }, m = () => f(async () => t() && await e()), p = () => {
    s || c() || (a = setTimeout(
      async () => {
        c() || await m(), p();
      },
      typeof n == "function" ? n() : n
    ));
  }, b = async () => {
    l = !0, await f(e), p();
  }, $ = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return b();
      await m(), p();
    }
  };
  fe(() => {
    var y;
    return (y = i == null ? void 0 : i.visible) == null ? void 0 : y.value;
  }, $), Ce(async () => {
    document.addEventListener("visibilitychange", $), u() || await b();
  }), tt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", $);
  });
}
const fi = typeof document < "u" && document.documentElement.classList.contains("phone"), mi = 120;
var si;
const Wa = globalThis[si = Symbol.for("journal.pressed")] ?? (globalThis[si] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Mc(e = 0) {
  const t = Wa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Wa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Wa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function _s(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function hi(e = window) {
  if (!_s(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    _s(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Cs = "journal.stale-build-reload", _c = 'script[type="module"][src*="/assets/index-"]', Vo = (e) => {
  var t;
  return ((t = e.querySelector(_c)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Cc(e = document, t = (a, s) => Oe.quietRead(a, s), n = () => hi(window)) {
  const a = Vo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Vo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ha = "";
function Ec(e, t = () => hi(window)) {
  if (!e) return !1;
  const n = !!Ha && Ha !== e;
  return Ha = e, n && t(), n;
}
const Ac = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Oc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Cs) === e.message) return !1;
    t.setItem(Cs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Tc(e = window.sessionStorage) {
  try {
    e.removeItem(Cs);
  } catch {
    return;
  }
}
const Ic = 2e3, Bc = 3e4, Je = nn({ starting: !1, external: !1, late: !1, offline: !1 }), oo = () => Je.starting, Rc = 3;
let zn = 0, Es = 0, pi = 0, vi = [];
async function Lc() {
  try {
    const e = await Oe.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Je.external };
  }
}
let Go = null;
const Nc = () => Go ?? (Go = Lc().finally(() => Go = null));
function qc() {
  clearTimeout(Es), clearTimeout(pi), Es = 0, Object.assign(Je, { starting: !1, external: !1, late: !1, offline: !1 }), vi.splice(0).forEach((e) => e()), Cc();
}
async function Dc() {
  Je.offline = !navigator.onLine;
  const e = await Nc();
  if (Je.external = e.updating, zn = !e.restarting && !e.updating && e.reachable ? zn + 1 : 0, zn < Rc) return;
  zn = 0, (!Ec(e.started_at) || _s()) && qc();
}
function gi() {
  Es = setTimeout(async () => {
    await Dc(), Je.starting && gi();
  }, Ic);
}
function Ko() {
  Je.starting || (Je.starting = !0, Je.offline = !navigator.onLine, gi(), pi = setTimeout(() => Je.late = !0, Bc));
}
const yi = () => Je.starting ? new Promise((e) => vi.push(e)) : Promise.resolve();
function Oa(e, t, n = 0) {
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
function Pc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class jc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Oa(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Pc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const gt = "viewer.shell";
function Fc(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const Un = 2e4, Wc = 4, Yo = "/api/read-lines", Hc = 5e3, zc = 403, Qo = "/api/repeated-lines", Uc = 10, Vc = 2e3, Gc = 3e5, tA = 6e5, Kc = "X-Journal-Window-Hidden", Vn = 6, Yc = 500, Qc = "/journal/summary", Xo = "/api/server-state", Xc = 2e4, Gn = fi ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Jc = (e) => e.split("?")[0].endsWith(Qc), As = (e, t) => Object.assign(new Error(t), { status: e });
async function Zc(e, t, n = As) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const ed = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), td = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Jo = (e) => e.split(" ").slice(0, 2).join(" "), ut = "read", Vt = "write", nd = "stream";
class ad {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Vn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Jo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < Vc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Uc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Qo, { method: "POST", headers: { ...Gn, "Content-Type": "application/json" }, body: i }, [{ window: gt, line: Qo, kind: Vt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Mc(n ? mi : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [Kc]: Fc() ? "1" : "0" } }, i = s ? { ...l, signal: td(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === Vt ? { ...i, priority: "high" } : i);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up; a read is tried once more at once first, since the
  // server closes a connection left idle and the read may have gone out on it; a write is never sent twice
  async sent(t, n, a, s = Un) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      if (!(o instanceof TypeError)) throw o;
      if ((n.method || "GET") === "GET")
        try {
          return await this.out(t, n, a, s);
        } catch (l) {
          throw l instanceof TypeError && Ko(), l;
        }
      throw Ko(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Wc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Yo, { headers: Gn }, [{ window: gt, line: Yo, kind: ut }], Hc).then(async (t) => {
      if (t.status === zc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw As(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new jc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Jo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Vn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Gn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: ed(a) }, c = s || (i ? Gc : Un);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: gt, line: n, kind: ut }], c)) : await this.sent(n, u, [{ window: gt, line: n, kind: Vt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((m) => setTimeout(m, Yc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Vn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Zc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: gt, line: t, kind: ut }], Un)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Gn });
    if (!n.ok) throw As(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Vn, o).then((i) => (this.written(n), i)) : oo() && !Jc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: gt, line: t, kind: nd }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Xo, { cache: "no-store" }, [{ window: gt, line: Xo, kind: ut }], Xc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = gt, line: s = t, limit: o = Un } = {}) {
    const l = (n.method ?? "GET") === "GET" ? ut : Vt;
    return l === Vt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const za = Symbol.for("journal.transport"), Oe = globalThis[za] ?? (globalThis[za] = new ad());
class bi {
  constructor() {
    this.following = lt([]), this.held = /* @__PURE__ */ new Set();
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
    Oe.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => lo(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function lo(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const ki = (e, t) => !e.row_id || t.has(e.row_id), sd = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, od = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, ld = 50, id = "refresh", rd = 1e3, ud = 3e4, cd = "requested", dd = "after_window", fd = 50, Kn = ".*", md = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function hd(e) {
  const t = {}, n = nn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, m = !1;
  const p = (M) => u[M] ?? u[`${M.slice(0, M.lastIndexOf("."))}.*`] ?? {};
  function b(M) {
    const g = () => p(M), x = E(void 0), T = di(e, async (L) => {
      const W = await k(M, L);
      return W.ok && !Object.keys(L).length && (x.value = W.value), W;
    }, () => g().page_size || fd, () => !!g().page_size, () => !!g().reads_ids);
    return t[M] = { ...T, data: x, readAt: 0 };
  }
  const $ = new Proxy({}, { get: (M, g) => typeof g != "string" || g.startsWith("__v") ? void 0 : t[g] ?? b(g) }), y = (M) => (u[M].loading !== cd || M.endsWith(Kn)) && (!u[M].tab || u[M].tab === n.tab);
  function k(M, g = {}) {
    return new Promise((x) => {
      a.push({ name: M, flags: g, resolve: x }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const M = /* @__PURE__ */ new Map(), g = a.splice(0).filter((L) => {
      const W = JSON.stringify(L.flags);
      return M.has(L.name) || M.set(L.name, W), M.get(L.name) === W ? !0 : (a.push(L), !1);
    });
    a.length && setTimeout(S);
    const x = Object.fromEntries(g.flatMap(({ name: L, flags: W }) => Object.entries(W).map(([Y, Z]) => [`${L}.${Y}`, Z]))), T = await e.readKeys({ only: [...new Set(g.map(({ name: L }) => L))], state: { ...n, ...x } });
    g.forEach(({ name: L, resolve: W }) => W(T.ok ? T.value.keys[L] : T));
  }
  async function C(M) {
    var L;
    const g = ++f;
    (M.length ? M : Object.keys(u).filter((W) => !W.endsWith(Kn) && u[W].loading === "first" && y(W))).forEach((W) => l[W] = g);
    const T = await e.readKeys({ only: M, state: { ...n } });
    if (!T.ok) {
      if (T.failure === "cancelled") return !1;
      const W = (M.length ? M : Object.keys(t)).filter((Z) => (l[Z] ?? 0) <= g);
      W.forEach((Z) => {
        $[Z].readAt = Date.now(), T.failure === "unreachable" ? i.add(Z) : i.delete(Z), $[Z].showFirst(T);
      });
      const Y = T.failure === "unreachable" && ((L = e.waitForServer) == null ? void 0 : L.call(e));
      return Y && Y.then(() => {
        if (m) return;
        const Z = W.filter((le) => l[le] === g);
        (Z.length || !M.length && !W.length && f === g) && C(Z);
      }), !1;
    }
    return j(T.value.declared), Object.entries(T.value.keys).forEach(([W, Y]) => {
      (l[W] ?? 0) > g || (l[W] = g, $[W].readAt = Date.now(), i.delete(W), Y.ok && ($[W].data.value = Y.value), $[W].showFirst(Y));
    }), !0;
  }
  function N(M) {
    const g = md(M);
    return g.length ? (g.forEach((x) => o.names.add(x)), o.answer ?? (o.answer = new Promise((x) => setTimeout(() => {
      const T = [...o.names];
      o.names.clear(), o.answer = null, x(C(T));
    })))) : C([]);
  }
  function D(M) {
    M.forEach((g) => s.add(g)), clearTimeout(c), c = setTimeout(() => {
      const g = [...s];
      s.clear(), g.length && N(g);
    }, ld);
  }
  const I = (M) => M.endsWith(Kn) ? Object.keys(t).filter((g) => g.startsWith(M.slice(0, -1)) && t[g].readAt) : [M], G = (M, g) => {
    const x = p(M).event_column;
    return !x || od(g, x, /* @__PURE__ */ new Set([Number(M.slice(M.lastIndexOf(".") + 1))]));
  }, F = (M) => (u[M] ?? u[`${M.split(".")[0]}.*`]).reload_seconds;
  function B(M) {
    const g = Object.keys(u).filter((T) => M.event === id || u[T].events.some((L) => lo(L, M.event)));
    g.filter((T) => u[T].page_size).forEach((T) => $[T].heard(M));
    const x = g.filter((T) => !u[T].page_size);
    x.filter((T) => !y(T)).forEach((T) => $[T].readAt = 0), D(x.filter(y).flatMap(I).filter((T) => G(T, M)));
  }
  function j(M) {
    if (Object.keys(u).length) return;
    u = M;
    const g = [...new Set(Object.values(M).flatMap((T) => T.events))];
    g.length && e.follow(g, B);
    const x = Object.keys(M).filter((T) => M[T].loading === dd);
    x.length && C(x);
  }
  fe(() => n.tab, () => {
    const M = Object.keys(u).filter((g) => !g.endsWith(Kn) && y(g) && !$[g].readAt);
    M.length && C(M);
  }), Be(() => {
    m = !0, clearTimeout(c);
  });
  function V() {
    const M = Date.now(), g = Object.keys(u).filter((x) => u[x].reload_seconds > 0 && y(x)).flatMap(I).filter((x) => M - $[x].readAt >= (i.has(x) ? Math.min(F(x) * 1e3, ud) : F(x) * 1e3));
    g.length && D(g);
  }
  return so(V, () => e.visible.value, rd), queueMicrotask(() => C([])), { props: $, state: n, reload: N, readKey: k };
}
const pd = Symbol("open-view"), Le = Symbol.for("journal.window-context"), wi = Symbol("dock-card"), $i = Symbol.for("journal.inspector-actions");
function vd(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = hd(e));
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
  return vd(e);
}
const gd = (e, t) => e(wi, t), nA = () => Se(wi), Os = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Zo = {
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
  agent: Os,
  worker: Os,
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
}, yd = ["data-icon", "stroke-width", "innerHTML"], ae = {
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
      agent: Os,
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
      code: '<path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (o, l) => (r(), d("svg", {
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
    }, null, 12, yd));
  }
}, bd = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ye({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, kd = /* @__PURE__ */ H(bd, [["__scopeId", "data-v-eb453d6f"]]), wd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Ca(), a = _(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = E(!1), o = _(() => t.busy || s.value), l = Se(Le, null), i = _(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const m = setTimeout(() => s.value = !0, mi);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(m), s.value = !1;
      }
    }
    return (c, f) => (r(), P(Ze(e.href ? "a" : "button"), De(a.value, {
      type: e.href ? void 0 : O(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: q(() => [
        h("span", {
          class: K(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), P(ae, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : w("", !0),
          ne(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), P(kd, {
          key: 0,
          class: "btn-spinner"
        })) : w("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), re = /* @__PURE__ */ H(wd, [["__scopeId", "data-v-ededdadf"]]), $d = ["aria-checked", "aria-haspopup", "onClick"], xd = {
  key: 0,
  class: "segmented-dot"
}, Sd = {
  key: 1,
  class: "segmented-note"
}, Md = {
  key: 2,
  class: "segmented-count"
}, _d = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Zs();
    return (s, o) => {
      const l = zu("tip");
      return r(), d("span", {
        class: K(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(R, null, X(e.options, (i) => ke((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: K(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", xd)) : w("", !0),
          U(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", Sd, v(i.note), 1)) : w("", !0),
          i.count !== void 0 ? (r(), d("em", Md, v(i.count), 1)) : w("", !0)
        ], 10, $d)), [
          [l, i.tip || i.title, `${O(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, _t = /* @__PURE__ */ H(_d, [["__scopeId", "data-v-c89bc92d"]]), Cd = {
  key: 0,
  class: "more-items"
}, Ed = {
  key: 0,
  role: "alert"
}, Ad = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", Cd, [
      e.failure ? (r(), d("p", Ed, v(e.failure), 1)) : w("", !0),
      e.more ? (r(), P(re, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: q(() => [
          U(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : w("", !0)
    ])) : w("", !0);
  }
}, In = /* @__PURE__ */ H(Ad, [["__scopeId", "data-v-10464014"]]), Od = { class: "link-group" }, Td = {
  class: "group-label",
  "data-link-kind": ""
}, Id = ["disabled", "onClick"], Bd = { class: "title" }, Rd = { class: "relations" }, Ld = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = _(() => s.value ? n.rows : n.rows.slice(0, 3)), l = _(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (m) => m.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((m) => m.replaceAll("_", " ")).join(", ")}`;
    return (f, m) => (r(), d("div", Od, [
      h("div", Td, v(l.value), 1),
      (r(!0), d(R, null, X(o.value, (p) => (r(), d("button", De({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (b) => a("open", p)
      }), [
        h("span", Bd, v(p.endpoint.title), 1),
        h("span", Rd, [
          U(v(c(p)), 1),
          i(p) ? (r(), d(R, { key: 0 }, [
            U(" · Unavailable")
          ], 64)) : w("", !0)
        ])
      ], 16, Id))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: m[0] || (m[0] = (p) => s.value = !0)
      }, "Show more")) : w("", !0)
    ]));
  }
}, Nd = /* @__PURE__ */ H(Ld, [["__scopeId", "data-v-be6f079c"]]), qd = ["data-loaded"], Dd = { class: "rows" }, Pd = ["disabled", "onClick"], jd = { class: "title" }, Fd = { class: "relations" }, Wd = { key: 2 }, Hd = {
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
    let m = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, b = (B) => p[B] || `${B.replaceAll("_", " ").replace(/^./, (j) => j.toUpperCase())}s`, $ = _(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((B, j) => B + j, 0) },
      ...Object.entries(o.value).filter(([B]) => !n.onlyKinds.length || n.onlyKinds.includes(B)).map(([B, j]) => ({ key: B, label: b(B), count: j }))
    ]), y = _(() => {
      const B = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((V) => V.endpoint.model))].map((V) => [V, s.value.filter((M) => M.endpoint.model === V).length])), j = { doc: 0, task: 1, message: 2 };
      return Object.entries(B).sort(([V], [M]) => (j[V] ?? 3) - (j[M] ?? 3)).map(([V, M]) => ({ model: V, count: M, rows: s.value.filter((g) => g.endpoint.model === V) }));
    }), k = (B) => B.endpoint.unavailable || !B.endpoint.open_ref, S = (B) => ({ [n.linkAttribute]: !0, "data-link-model": B.endpoint.model, "data-link-id": B.endpoint.id }), C = (B) => `${B.endpoint.model === "doc" && B.endpoint.id === n.documentId ? "Design document" : B.endpoint.model.replaceAll("_", " ").replace(/^./, (j) => j.toUpperCase())} ${B.endpoint.id}, ${B.relations.map((j) => j.replaceAll("_", " ")).join(", ")}`;
    async function N(B = 1) {
      const j = ++m;
      c.value = !0, f.value = "";
      const V = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(B), "--page-size", String(n.pageSize)];
      n.outsidePlan && V.push("--outside-plan"), n.documentId && V.push("--first-counterpart", `doc:${n.documentId}`), i.value && V.push("--kind", i.value);
      try {
        const M = await n.read(V);
        if (j !== m) return;
        if (!M.ok) {
          f.value = M.error;
          return;
        }
        const g = M.value.counterparts ?? [], x = B === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(x.map((T) => [`${T.endpoint.model}:${T.endpoint.id}`, T])).values()], o.value = M.value.categories ?? {}, l.value = M.value.total, u.value = M.value.next_page ?? null;
      } catch (M) {
        j === m && (f.value = M.message);
      } finally {
        j === m && (c.value = !1);
      }
    }
    function D(B) {
      if (k(B)) return;
      const [j, V] = B.endpoint.open_ref.split(":");
      a("open", { table: j, id: Number(V) });
    }
    function I(B) {
      i.value = B, N();
    }
    const G = () => !c.value && u.value && N(u.value), F = _(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return fe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", N();
    }, { immediate: !0 }), (B, j) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: K(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      $.value.length > 2 ? (r(), P(_t, {
        key: 0,
        options: $.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : w("", !0),
      h("div", Dd, [
        e.grouped ? (r(!0), d(R, { key: 0 }, X(y.value, (V) => (r(), P(Nd, {
          key: V.model,
          model: V.model,
          count: V.count,
          rows: V.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: D
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(R, { key: 1 }, X(s.value, (V) => (r(), d("button", De({
          key: `${V.endpoint.model}:${V.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, S(V), {
          disabled: k(V),
          onClick: (M) => D(V)
        }), [
          h("span", jd, v(V.endpoint.title), 1),
          h("span", Fd, [
            U(v(C(V)), 1),
            k(V) ? (r(), d(R, { key: 0 }, [
              U(" · Unavailable")
            ], 64)) : w("", !0)
          ])
        ], 16, Pd))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Wd, v(e.empty), 1)) : w("", !0),
        A(In, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: F.value,
          onMore: G
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, qd)) : w("", !0);
  }
}, zd = /* @__PURE__ */ H(Hd, [["__scopeId", "data-v-3b23de37"]]), Ud = (e, t, n) => Math.max(t, Math.min(n, e)), Vd = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, xi = /* @__PURE__ */ new WeakMap(), Gd = (e, t) => xi.set(e, t);
function Kd(e, t) {
  for (let n = t; n; n = xi.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Si(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Kd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Tt = 8, Yd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    // a spot on the screen instead of an element: {x, y}, and flipX when it opens leftward from there (a submenu opens beside its item)
    point: { type: Object, default: null },
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
    const a = e, s = E(null), o = (x) => x ? `${x}px` : void 0, l = _(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = E({ w: 0, h: 0 }), u = (x) => ({ left: x.x, right: x.flipX ?? x.x, top: x.y, bottom: x.y }), c = E(a.anchor ? a.anchor.getBoundingClientRect() : a.point ? u(a.point) : null), f = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), m = (x) => ({
      left: Math.max(0, x.left),
      top: Math.max(0, x.top),
      right: Math.min(window.innerWidth, x.right),
      bottom: Math.min(window.innerHeight, x.bottom)
    }), p = (x) => {
      const T = x.closest(".pane, .float-window");
      return T ? m(T.getBoundingClientRect()) : f();
    }, b = (x, T) => `${Math.max(0, x ? Math.min(x, T) : T)}px`;
    function $(x, T) {
      return {
        below: x.bottom - T.bottom - a.gap - Tt,
        above: T.top - x.top - a.gap - Tt,
        across: x.right - x.left - 2 * Tt
      };
    }
    function y(x) {
      if (!a.anchor) return f();
      const T = p(a.anchor), L = $(T, x);
      return i.value.w <= L.across && i.value.h <= Math.max(L.below, L.above) ? T : f();
    }
    const k = _(() => {
      if (!c.value) return l.value;
      const x = c.value, T = y(x), L = $(T, x), { w: W, h: Y } = i.value, Z = a.point ? x.left + W > T.right - Tt : a.align === "auto" ? x.left + x.right > T.left + T.right : a.align === "right", le = Ud(Z ? x.right - W : x.left, T.left + Tt, Math.max(T.left + Tt, T.right - W - Tt)), $e = Y > L.below && L.above > L.below ? { bottom: `${window.innerHeight - x.top + a.gap}px`, maxHeight: b(a.maxHeight, L.above) } : { top: `${x.bottom + a.gap}px`, maxHeight: b(a.maxHeight, L.below) };
      return { ...l.value, ...$e, left: `${le}px`, maxWidth: b(a.maxWidth, L.across) };
    }), S = n, C = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function N(x) {
      const T = C(), L = T.indexOf(document.activeElement);
      T[(L + x + T.length) % T.length].focus();
    }
    const D = { ArrowDown: () => N(1), ArrowUp: () => N(-1), Escape: () => S("close") }, I = (x) => D[x.key] && (x.preventDefault(), D[x.key]()), G = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let F = 0;
    const B = new ResizeObserver(() => {
      cancelAnimationFrame(F), F = requestAnimationFrame(G);
    });
    Si(s, (x) => a.anchor && !a.anchor.contains(x.target) && S("close"));
    const j = (x, T) => ["top", "left", "right", "bottom"].some((L) => Math.abs(x[L] - T[L]) > 1), V = (x) => x.bottom < 0 || x.top > window.innerHeight;
    let M = 0;
    function g() {
      if (a.anchor) {
        const x = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || V(x)) return S("close");
        j(x, c.value) && (c.value = x);
      }
      M = requestAnimationFrame(g);
    }
    return Ce(() => {
      a.anchor && s.value && Gd(s.value, a.anchor), G(), s.value && B.observe(s.value), !a.plain && C()[0] && C()[0].focus(), g();
    }), Be(() => {
      B.disconnect(), cancelAnimationFrame(M), cancelAnimationFrame(F);
    }), t({ element: s }), (x, T) => (r(), P(Tn, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      h("div", De({
        ref_key: "panel",
        ref: s
      }, x.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: k.value,
        onKeydown: I
      }), [
        ne(x.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Wt = /* @__PURE__ */ H(Yd, [["__scopeId", "data-v-8094ec27"]]), Qd = { class: "split-button" }, Xd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = E(null), s = E(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", Qd, [
      A(re, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: q(() => [
          ne(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      h("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        A(re, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: q(() => [
            A(ae, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), P(Wt, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: q(() => [
          ne(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : w("", !0)
    ]));
  }
}, Jd = /* @__PURE__ */ H(Xd, [["__scopeId", "data-v-c258494d"]]), Zd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ef = {
  key: 1,
  class: "menu-item-text"
}, tf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: K(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", Zd, v(e.checked ? "✓" : ""), 1)) : w("", !0),
      e.description ? (r(), d("span", ef, [
        h("span", null, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, v(e.description), 1)
      ])) : ne(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, He = /* @__PURE__ */ H(tf, [["__scopeId", "data-v-fec99974"]]), nf = ["aria-expanded"], af = { class: "drop-label" }, sf = ["value"], of = {
  key: 1,
  class: "drop-lead"
}, lf = { class: "drop-item-text" }, rf = {
  key: 2,
  class: "drop-note"
}, uf = {
  key: 1,
  class: "drop-none"
}, cf = {
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
      class: K(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      h("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: K(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: f[0] || (f[0] = (m) => s.value = !s.value)
      }, [
        e.icon ? (r(), P(ae, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : w("", !0),
        h("span", af, v(e.label), 1),
        A(ae, {
          name: "down",
          size: 11
        })
      ], 10, nf),
      s.value ? (r(), P(Wt, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (m) => s.value = !1)
      }, {
        default: q(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (m) => l.value = m.target.value)
          }, null, 40, sf)) : w("", !0),
          (r(!0), d(R, null, X(i.value, (m) => (r(), P(He, {
            key: m.key,
            on: m.key === e.picked,
            "data-drop-item": m.key,
            onClick: (p) => u(m)
          }, {
            default: q(() => [
              m.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: K(["drop-dot", { live: m.running }])
              }, null, 2)) : w("", !0),
              m.lead ? (r(), d("span", of, v(m.lead), 1)) : w("", !0),
              h("span", lf, v(m.label), 1),
              m.note ? (r(), d("span", rf, v(m.note), 1)) : w("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? w("", !0) : (r(), d("p", uf, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : w("", !0)
    ], 2));
  }
}, io = /* @__PURE__ */ H(cf, [["__scopeId", "data-v-29dfcce5"]]), df = 0, ff = "/api/lines", mf = "/api/line", el = 5e3, tl = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), nl = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ua = (e) => JSON.stringify(e.line), al = () => new DOMException("cancelled", "AbortError");
class hf {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ua(t))) {
        Oe.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Vt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Oe.whenFree(() => this.send()), df));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(al())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(al()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Oe.sent(ff, tl({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => nl(i.body, ut)), el);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Oe.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, ut), Date.now() - n < el ? this.slow.delete(Ua(t.body)) : this.slow.add(Ua(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Oe.sent(mf, tl(t.body, t.signal), [nl(t.body, n)], n === ut ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Mi = new hf(), pf = "/api/window";
function vf(e, t, n, a, s) {
  const o = Object.fromEntries(Object.entries(a).filter(([, f]) => f !== "" && f !== null && f !== void 0)), l = new URLSearchParams({ environment: t, ...o }), i = `${pf}?${l}`, u = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, c = (f) => Oe.whenFree(async () => {
    const m = await Oe.sent(i, { signal: f, headers: u }, [{ window: e, line: i, kind: ut }]);
    if (!m.ok) throw new Error((await m.json()).error);
    return m.json();
  });
  return Oe.joined(`${e} ${n.join(",")} ${l}`, c, s);
}
const _i = /* @__PURE__ */ new Map();
class gf {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = lt({ buttons: [], missing: {} }), this.loading = lt(!1), this.loaded = lt(!1), this.failed = lt(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Oe.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function aA(e, t) {
  const n = new gf(e, t);
  return _i.set(e, n), n.load().catch(() => {
  }), n;
}
const ro = (e) => _i.get(e);
function yf(e, t, n) {
  const a = ro(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function bf(e, t) {
  if (!e) return !0;
  const n = ro(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const kf = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Ci = {};
async function sA(e = (t) => Oe.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Ci = (await t.json()).states);
}
const uo = (e, t) => {
  var n;
  return (n = Ci[e]) == null ? void 0 : n[t];
}, kn = (e, t) => {
  var n;
  return ((n = uo(e, t)) == null ? void 0 : n.label) ?? kf(t);
}, co = (e, t) => {
  var n;
  return ((n = uo(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, wf = (e, t) => {
  var n;
  return ((n = uo(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, $f = Symbol("pane-page"), Ta = Symbol("inspector-host"), Ei = { 1: "refused", 2: "usage", 3: "fault" }, xf = 100, Sf = 50, Mf = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, _f = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Cf({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = E({}), declared: c = [], page: f = null, setOption: m = () => {
}, autoScroll: p = "", tabs: b = [], sources: $ = [], links: y = {}, search: k = {}, readOnly: S = !1, shared: C = null }) {
  const N = /* @__PURE__ */ new Map(), D = (Y, Z) => l.follow(e, Y, (le) => {
    N.clear(), Z(le);
  }, a), I = new AbortController(), G = E(!1), F = performance.now();
  let B = 0, j = 0, V = () => {
  };
  const M = new Promise((Y) => V = Y);
  I.signal.addEventListener("abort", V, { once: !0 });
  const g = () => {
    clearTimeout(j), j = setTimeout(() => {
      B === 0 && ao(F, () => {
        G.value = !0, V();
      });
    }, Sf);
  }, x = (Y, Z) => (B += 1, Nt(e, Y, t, I.signal, Z).finally(() => {
    B -= 1, g();
  })), T = (Y, Z) => (g(), M.then(() => I.signal.aborted ? pt : Nt(e, Y, t, I.signal, Z))), L = ({ only: Y = [], state: Z = {} } = {}) => (B += 1, Af(() => vf(e, t, Y, Z, I.signal), I.signal).finally(() => {
    B -= 1, g();
  })), W = (Y, { unbatched: Z = !1, deferred: le = !1 } = {}) => {
    const de = N.get(Y);
    if (de && performance.now() - de.at < xf) return de.answer;
    const $e = le && !G.value ? T(Y, Z) : x(Y, Z);
    return N.set(Y, { answer: $e, at: performance.now() }), $e;
  };
  return {
    answered: G,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: _(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: b,
    sources: $,
    links: y,
    search: k,
    readOnly: S,
    shared: C,
    read: W,
    readKeys: L,
    waitForServer: () => oo() ? yi() : null,
    run: (Y) => Nt(e, Y, t, I.signal),
    upload: (Y) => Tf(Y, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (Y, Z) => D([Y].flat().filter((le) => o.some((de) => lo(de, le))), Z),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: D,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (Y) => _(() => {
      var Z;
      return u.value[Y] ?? ((Z = c.find((le) => le.key === Y)) == null ? void 0 : Z.default);
    }),
    setting: async (Y, Z) => {
      const le = await W(`window setting ${e} ${Y}`);
      return le.ok ? le.value.value : Z;
    },
    setOption: m,
    keep: (Y, Z) => Nt(e, ["window", "save-setting", e, Y, JSON.stringify(Z)], t, I.signal)
  };
}
function Ai(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const pt = { ok: !1, failure: "cancelled", error: "" }, fo = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Oi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? pt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Ei[n.code] || "fault", error: Ai(n.error) };
  } catch {
    return t != null && t.aborted ? pt : { ok: !1, failure: "unreachable", error: fo };
  }
}
const Ef = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Ei[e.code] || "fault", error: Ai(e.error) };
async function Af(e, t) {
  try {
    const n = await e();
    return t.aborted ? pt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Ef(s)])) } };
  } catch {
    return t.aborted ? pt : { ok: !1, failure: "unreachable", error: fo };
  }
}
async function Ti(e, t, n) {
  const a = await Oi(() => Mi.read(e, t, n), t);
  return a.failure !== "unreachable" || !oo() ? a : (await yi(), t.aborted ? pt : Ti(e, t, n));
}
function Nt(e, t, n, a = void 0, s = !1) {
  return Oe.held(() => Of(e, t, n, a, s), Oe.knownRead(Array.isArray(t) ? t : mo(t)));
}
async function Of(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : mo(t), environment: n };
  return await Oe.isRead(o.line) ? Oe.joined(JSON.stringify(o), (l, i) => Ti({ ...o, attribution: i }, l, s), a, o).catch(() => pt) : Oi(() => Mi.write({ ...o, attribution: {
    client_id: Oe.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Tf(e, t, n = void 0) {
  try {
    const a = await Oe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? pt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? pt : { ok: !1, failure: "unreachable", error: fo };
  }
}
function mo(e) {
  return [...e.matchAll(Mf)].map(([t]) => t.replace(_f, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const If = (e) => `show-${e}`, oA = (e, t, n) => e.filter((a) => {
  var s;
  return n(If((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ho = "messages.chat", oa = "main", Ii = "Main agent", Bf = { main: Ii, worker: "Worker", helper: "Helper" }, Rf = "journal-", po = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Lf = (e) => po(e.replace(Rf, "").replaceAll("-", " ")), Nf = (e) => `${e.role} ${e.number}`, qf = (e) => e.role === oa ? Ii : `${po(e.role)} ${e.number}`;
function Jt(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === oa || !n ? Bf[e.role] ?? po(e.role) : Lf(n), s = e.role === oa ? "" : Nf(e), o = e.role === oa ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: qf(e) };
}
const Df = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, Pf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E([]), o = E(""), l = _(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Jt(c).title, note: Jt(c).subtext }))), i = _(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await Nt(ho, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(R, null, [
      A(io, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (m) => a("pick", m.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", Df, v(o.value), 1)) : w("", !0)
    ], 64));
  }
}, jf = /* @__PURE__ */ H(Pf, [["__scopeId", "data-v-d2ea58f1"]]), Ff = {
  key: 0,
  class: "template-brief"
}, Wf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Hf = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E([]), o = E(""), l = _(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = _(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Nt(ho, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), m = s.value.find((p) => p.title === f);
      m && a("pick", String(m.id));
    }
    return u(), (c, f) => (r(), d(R, null, [
      A(_t, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (m) => a("pick", m))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", Ff, v(i.value.brief), 1)) : w("", !0),
      o.value ? (r(), d("p", Wf, v(o.value), 1)) : w("", !0)
    ], 64));
  }
}, zf = /* @__PURE__ */ H(Hf, [["__scopeId", "data-v-14be8a5c"]]), Uf = { class: "info-tip" }, Vf = ["aria-label"], Gf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Kf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Uf, [
      h("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(ae, {
          name: "info",
          size: 13
        })
      ], 8, Vf),
      h("span", Gf, [
        (r(!0), d(R, null, X(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, Bi = /* @__PURE__ */ H(Kf, [["__scopeId", "data-v-a2fe5ff1"]]), Yf = { class: "form-field" }, Qf = { class: "form-field-head" }, Xf = ["for"], Jf = {
  key: 1,
  class: "form-field-aside"
}, Zf = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Yf, [
      h("div", Qf, [
        h("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Xf),
        e.help ? (r(), P(Bi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : w("", !0),
        t.$slots.aside ? (r(), d("span", Jf, [
          ne(t.$slots, "aside", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Ri = /* @__PURE__ */ H(Zf, [["__scopeId", "data-v-302c40bf"]]), Ts = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, em = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Ca(), n = _(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => ke((r(), d("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [O(Ts), O(t).value]
    ]);
  }
}), Li = /* @__PURE__ */ H(em, [["__scopeId", "data-v-e130a5b9"]]), tm = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Zs(), o = _(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), P(Ri, {
      label: e.field.label,
      for: O(s),
      "data-button-field": e.field.name
    }, {
      default: q(() => [
        A(Ft, { value: o.value }, {
          choice: q(() => [
            A(_t, {
              id: O(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: q(() => [
            A(zf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: q(() => [
            A(jf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: q(() => [
            A(Li, {
              id: O(s),
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
}, Ia = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), P(re, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: q(() => [
        A(ae, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function nm(e, t, n, a = () => window) {
  Ce(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const am = (e, t = () => !0) => nm("keydown", (n) => n.key === "Escape" && t() && e());
function Ni(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = E(!1), s = _(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return am(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const sm = 80, Ut = nn([]);
function qi(e) {
  const t = Symbol("layer"), n = () => Ut.includes(t) && Ut.splice(Ut.indexOf(t), 1);
  return fe(
    e,
    (a) => {
      a && !Ut.includes(t) && Ut.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), _(() => sm + Math.max(0, Ut.indexOf(t)));
}
let Di = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Di = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const om = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function lm(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(om)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Ce(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Di, document.addEventListener("keydown", s), Ne(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const im = ["aria-modal", "aria-label", "aria-labelledby"], rm = {
  key: 0,
  class: "dialog-head"
}, um = ["id", "tabindex"], cm = {
  key: 1,
  class: "dialog-foot"
}, dm = 500, fm = 400, mm = {
  __name: "Dialog",
  props: {
    title: { type: String, default: "" },
    follow: { type: Boolean, default: !1 },
    fits: Boolean,
    wide: Boolean,
    huge: Boolean,
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ni(a, n), i = qi(s), u = E(null), c = E(null), f = E(null), m = Zs(), p = E(!1), b = Date.now();
    n.modal && lm(c, () => a("escape"), f);
    function $() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, fm);
    }
    function y(C) {
      !n.modal || Date.now() - b >= dm || ![" ", "Enter"].includes(C.key) || (C.preventDefault(), C.stopPropagation());
    }
    const k = () => u.value && (u.value.scrollTop = u.value.scrollHeight), S = new MutationObserver(k);
    return fe(u, (C) => {
      S.disconnect(), C && n.follow && (S.observe(C, { childList: !0, subtree: !0, characterData: !0 }), k());
    }), Be(() => S.disconnect()), (C, N) => (r(), P(Tn, { to: "body" }, [
      A(an, {
        name: "dialog",
        appear: "",
        onAfterLeave: O(l)
      }, {
        default: q(() => [
          O(s) ? (r(), d("div", {
            key: 0,
            class: K(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ye({ zIndex: O(i) }),
            onClick: ge($, ["self"])
          }, [
            h("section", {
              ref_key: "panel",
              ref: c,
              class: K(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, huge: e.huge, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? O(m) : void 0,
              onKeydownCapture: y
            }, [
              e.bare ? w("", !0) : (r(), d("header", rm, [
                h("h3", {
                  id: O(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, um),
                e.closable ? (r(), P(Ia, {
                  key: 0,
                  onClick: O(o)
                }, null, 8, ["onClick"])) : w("", !0)
              ])),
              h("div", {
                ref_key: "body",
                ref: u,
                class: K(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ne(C.$slots, "default", {}, void 0, !0)
              ], 2),
              C.$slots.foot ? (r(), d("footer", cm, [
                ne(C.$slots, "foot", {}, void 0, !0)
              ])) : w("", !0)
            ], 42, im)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Bn = /* @__PURE__ */ H(mm, [["__scopeId", "data-v-089c42bc"]]), hm = {
  class: "action-output",
  "data-action-output": ""
}, pm = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), P(Bn, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: q(() => [
        h("pre", hm, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, vm = /* @__PURE__ */ H(pm, [["__scopeId", "data-v-b32f94a4"]]);
function gm(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Uu(vm, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const ym = (e, t, n = {}) => mo(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function Rn(e, t, n, a = {}) {
  var s;
  try {
    if (!await bf(e.module, n)) return { ok: !1, error: "" };
    const o = await Nt(ho, ym(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && gm(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const bm = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Va = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], xe = (e, t, n, a = {}) => ({
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
}), Ln = {
  messages: xe("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: xe("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: xe("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: Va
  }),
  tasks: xe("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Va
  }),
  reports: xe("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: xe("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: xe("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: xe("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: xe("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: xe("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: xe("Pin", "band", "One line pinned to the chat while it matters", { filters: Va }),
  reactions: xe("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: xe("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: xe("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: xe("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: xe("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: xe("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: xe("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: xe("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: xe("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: xe("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: xe("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: xe("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: xe("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: xe("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: xe("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: xe("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: xe("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, km = ["secrets", "plugins"], Pi = Object.keys(Ln).filter((e) => !(fi && km.includes(e)));
_(() => Pi.map((e) => ({ name: e, ...Ln[e] })));
const sn = (e) => Ln[e], ji = new Map(Pi.flatMap((e) => [e, e.replace(/s$/, ""), Ln[e].title.toLowerCase()].map((t) => [t, e]))), ft = (e) => ji.get(String(e).toLowerCase()) || "", lA = (e) => {
  var t;
  return ((t = Ln[ft(e)]) == null ? void 0 : t.title) || String(e).charAt(0).toUpperCase() + String(e).slice(1);
}, Fi = [...ji.keys()].sort((e, t) => t.length - e.length).join("|"), wm = {
  class: "button-form",
  "data-button-form": ""
}, $m = {
  key: 0,
  class: "button-form-title"
}, xm = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Sm = { class: "button-form-actions" }, Mm = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = E(!1), l = E(""), i = _(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = _(() => {
      var m;
      if (!n.row) return n.button.label;
      const f = ((m = sn(ft(n.row.term))) == null ? void 0 : m.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await Rn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, m) => (r(), P(Bn, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: m[1] || (m[1] = (p) => a("close"))
    }, {
      default: q(() => {
        var p;
        return [
          h("div", wm, [
            (p = e.row) != null && p.title ? (r(), d("p", $m, v(e.row.title), 1)) : w("", !0),
            (r(!0), d(R, null, X(e.button.fields, (b) => (r(), P(tm, {
              key: b.name,
              field: b,
              value: s.value[b.name],
              environment: e.environment,
              onPick: ($) => s.value[b.name] = $
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", xm, v(l.value), 1)) : w("", !0),
            h("div", Sm, [
              A(re, {
                small: "",
                onClick: m[0] || (m[0] = (b) => a("close"))
              }, {
                default: q(() => [...m[2] || (m[2] = [
                  U("Cancel", -1)
                ])]),
                _: 1
              }),
              A(re, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: q(() => [...m[3] || (m[3] = [
                  U("Send", -1)
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
}, _m = /* @__PURE__ */ H(Mm, [["__scopeId", "data-v-e3f0d786"]]), Cm = ["aria-busy"], Em = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Am = { class: "button-slot-confirm-text" }, Om = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Tm = {
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
    const n = e, a = t, s = _(() => ro(n.environment)), o = _(
      () => {
        var S;
        return !n.readOnly && ((S = s.value) == null ? void 0 : S.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = _(() => {
      var S;
      return !n.readOnly && ((S = s.value) == null ? void 0 : S.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = _(() => n.readOnly ? [] : yf(n.environment, n.name, n.row)), c = E(null), f = E(null), m = E(""), p = E(!1), b = (S) => [S.from ? `From ${S.from}` : "", S.tip, S.warning].filter(Boolean).join(" · "), $ = (S) => S.icon || (S.warning ? "dot" : "");
    function y(S) {
      if (!(p.value || n.readOnly)) {
        if (S.fields.length) {
          c.value = S;
          return;
        }
        if (S.confirm) {
          f.value = S;
          return;
        }
        return k(S);
      }
    }
    async function k(S) {
      f.value = null, m.value = "", a("failure", ""), p.value = !0;
      const C = await Rn(S, n.row, n.environment);
      p.value = !1, m.value = C.ok ? "" : C.error;
      const N = S.label.toLowerCase() + (n.objectName && !S.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", C.ok ? "" : `Could not ${N}: ${C.error}`), C.ok && a("done");
    }
    return (S, C) => (r(), d("span", {
      class: K(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(R, { key: 0 }, [
        C[5] || (C[5] = h("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(re, {
          small: "",
          onClick: i
        }, {
          default: q(() => [...C[4] || (C[4] = [
            U("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", Em, [
        h("span", Am, v(f.value.confirm), 1),
        A(re, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: K({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: C[0] || (C[0] = (N) => k(f.value))
        }, {
          default: q(() => [
            U(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(re, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: C[1] || (C[1] = (N) => f.value = null)
        }, {
          default: q(() => [...C[6] || (C[6] = [
            U("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? w("", !0) : (r(), d(R, { key: 2 }, [
        (r(!0), d(R, null, X(u.value, (N) => (r(), d(R, {
          key: N.name
        }, [
          N.menu.length ? (r(), P(Jd, {
            key: 0,
            small: "",
            variant: N.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": N.menu_label || "More ways",
            title: b(N),
            "data-button": N.name,
            onMain: (D) => y(N)
          }, {
            menu: q(({ close: D }) => [
              (r(!0), d(R, null, X(N.menu, (I) => (r(), P(He, {
                key: I.label,
                description: I.description,
                onClick: (G) => (D(), y({ ...N, ...I, menu: [] }))
              }, {
                default: q(() => [
                  U(v(I.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: q(() => [
              U(v(N.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), P(re, {
            key: 1,
            small: "",
            variant: N.primary ? "primary" : "ghost",
            bordered: !N.primary,
            class: K({ danger: N.danger }),
            icon: $(N),
            disabled: p.value,
            title: b(N),
            "data-button": N.name,
            onClick: (D) => y(N)
          }, {
            default: q(() => [
              U(v(N.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        m.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Om, v(m.value), 1)) : w("", !0),
        c.value && !e.readOnly ? (r(), P(_m, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: C[2] || (C[2] = (N) => c.value = null),
          onDone: C[3] || (C[3] = (N) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : w("", !0)
      ], 64))
    ], 10, Cm));
  }
}, vo = /* @__PURE__ */ H(Tm, [["__scopeId", "data-v-a4b6f174"]]), Im = {
  class: "running",
  "data-running-command": ""
}, Bm = ["title"], Rm = {
  key: "idle",
  class: "running-idle"
}, Lm = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Im, [
      A(an, {
        name: "roll",
        mode: "out-in"
      }, {
        default: q(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Bm)) : (r(), d("span", Rm, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, iA = /* @__PURE__ */ H(Lm, [["__scopeId", "data-v-d3240219"]]), Nm = ["aria-checked", "disabled", "aria-label", "title"], qm = {
  key: 0,
  class: "switch-inner"
}, Dm = {
  key: 0,
  class: "switch-word"
}, Pm = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean, disabled: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("button", {
      type: "button",
      class: K(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      disabled: e.disabled,
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      h("span", {
        class: K(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", qm, v(e.word), 1)) : w("", !0),
        s[1] || (s[1] = h("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", Dm, v(e.word), 1)) : w("", !0)
    ], 10, Nm));
  }
}, rA = /* @__PURE__ */ H(Pm, [["__scopeId", "data-v-92ae7767"]]), jm = { class: "notice-text" }, Fm = {
  key: 1,
  class: "notice-actions"
}, Wm = {
  __name: "Notice",
  props: {
    tone: { type: String, default: "muted" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = ["brief", "report", "wait", "danger", "info", "need", "ask"];
    return (n, a) => (r(), d("div", {
      class: K(["notice", [`notice-${e.tone}`, { "notice-band": t.includes(e.tone) }]])
    }, [
      e.icon ? (r(), P(ae, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : w("", !0),
      h("span", jm, [
        ne(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", Fm, [
        ne(n.$slots, "actions", {}, void 0, !0)
      ])) : w("", !0)
    ], 2));
  }
}, uA = /* @__PURE__ */ H(Wm, [["__scopeId", "data-v-445bd8a6"]]);
function Wi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function fa(e, t) {
  return Wi(() => localStorage, e, t);
}
function Hi(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function go(e, t) {
  return Hi(() => localStorage, e, t);
}
function zi(e, t) {
  fe(t, (n) => go(e, n), { deep: !0 });
}
function Hm(e, t) {
  return Wi(() => sessionStorage, e, t);
}
function zm(e, t) {
  return Hi(() => sessionStorage, e, t);
}
const ma = "journal.environment", Ui = E(Hm(ma, fa(ma, "")));
function Um(e) {
  Ui.value = e, zm(ma, e), go(ma, e);
}
const ha = E(location.hash), sl = lt(null), ol = { integrations: "mcp", library: "team" };
function Vm() {
  if (!sl.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (ol[n]) {
    location.replace(`#/${[ol[n], ...a].join("/")}${t ? `?${t}` : ""}`), ha.value = location.hash;
    return;
  }
  !n || sl.value(n) || (Um(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), ha.value = location.hash);
}
window.addEventListener("hashchange", () => {
  ha.value = location.hash, Vm();
});
const yo = "file", pa = _(() => {
  const [e, t = ""] = ha.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", m = ""] = i.split(":");
    return { table: c, id: c === yo ? decodeURIComponent(f) : Number(f), comment: Number(m) || 0, env: u };
  });
  return {
    env: Ui.value,
    page: n,
    n: a ? /^\d+$/.test(a) ? Number(a) : a : 0,
    q: s.get("q") || "",
    sub: s.get("sub") || "",
    tab: s.get("tab") || "",
    row: s.get("row") || "",
    plugin: s.get("plugin") || "",
    install: s.get("install") || "",
    line: Number(s.get("line") || 0),
    at: s.get("at") || "",
    stack: o,
    open: o[o.length - 1] || null
  };
}), Ba = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ba.page(e)}?open=${t}`
};
function Gm(e = "", t = 0, n = "") {
  location.hash = Ba.page(e, t, n);
}
function Km(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Ym = (e) => `${e.table}:${e.table === yo ? encodeURIComponent(e.id) : e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Vi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Ym).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
function Qm(e) {
  const [t, n = ""] = location.hash.replace(/^#/, "").split("?"), a = new URLSearchParams(n);
  a.set("row", String(e)), location.replace(`#${t}?${a}`);
}
const Yt = {};
function cA(e, t) {
  return Yt[e] = t, () => Yt[e] === t && delete Yt[e];
}
function it(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Yt[e]) != null && l.call(Yt, t))) return;
  const s = pa.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Vi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
const Xm = (e = "") => it(yo, e);
function Jm(e, t, n, a = 0, s = "") {
  if (e === pa.value.env) return it(t, n, a, s);
  const o = pa.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Vi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Fe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Jm(a, s, Number(o), 0, t) : it(s, Number(o), 0, t);
}
function Zm(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Kt(e) {
  const t = Zm(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function dA(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const eh = { class: "inspector-part" }, th = { class: "inspector-part-title" }, nh = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", eh, [
      h("h4", th, v(e.title), 1),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, fA = /* @__PURE__ */ H(nh, [["__scopeId", "data-v-5175e4a3"]]), ll = /* @__PURE__ */ new Map(), ah = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = E(null), a = E(!1), s = E(t.name && ll.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && ll.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Ce(() => n.value && i.observe(n.value.firstElementChild || n.value)), Be(() => i.disconnect()), (u, c) => (r(), d(R, null, [
      h("div", {
        ref_key: "body",
        ref: n,
        class: K(["folded-body", { folded: a.value && !s.value }]),
        style: ye(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ne(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = ge((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : w("", !0)
    ], 64));
  }
}, Gi = /* @__PURE__ */ H(ah, [["__scopeId", "data-v-4d2235ba"]]), sh = ["aria-valuenow", "aria-valuemax"], oh = {
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
      class: K(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      h("span", {
        class: "fill",
        style: ye({ width: n.value })
      }, null, 4)
    ], 10, sh));
  }
}, Ki = /* @__PURE__ */ H(oh, [["__scopeId", "data-v-9eba6a85"]]), lh = { processes: "process", memories: "memory", replies: "reply" }, va = (e) => (lh[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), Is = [], ih = 2e3, bt = /* @__PURE__ */ new Map(), rh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, uh = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Ht(e, { first: t = !1 } = {}) {
  t ? Is.unshift(e) : Is.push(e), bt.clear();
}
function Yi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const ch = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, dh = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function mt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function fh(e, t) {
  const n = [{ type: "text", text: mt(e).replace(/\r\n/g, `
`) }];
  for (const a of Is)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function wn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return mh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function mh(e) {
  return e.split(uh).map((t, n) => n % 2 ? t : t.replace(rh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function il(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const hh = 24;
function ph(e) {
  const [t, , ...n] = e, a = il(t), s = n.map(il), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > hh) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${wn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${wn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Qi = /^\s*(?:[-*+]|\d+[.)])\s+/, Bs = /^\s*(\d+)[.)]\s/, rl = (e) => e.match(/^\s*/)[0].length;
function Xi(e) {
  const t = e[0].match(Bs), n = rl(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && rl(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${wn(o.text)}${o.nested.length ? Xi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function vh(e, t) {
  const n = Bs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Qi.test(e[s]) && Bs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const ul = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ji(e) {
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
      n.push(`<h${i}>${wn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (ul(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(ph(t.slice(a, i))), a = i;
      continue;
    }
    if (Qi.test(s)) {
      const i = vh(t, a);
      n.push(Xi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Ji(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !ul(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${wn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const gh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, yh = (e) => e.type !== "text" && !gh.test(e.html);
function bh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Ji(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : yh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function bo(e, t = { env: "" }) {
  const n = dh(e, t), a = bt.get(n);
  if (bt.delete(n), a && a.source === t.source && a.reads.every((l) => ch(l, t)))
    return bt.set(n, a), a.html;
  const s = [], o = bh(fh(e, { ...t, reads: s }));
  return bt.set(n, { html: o, reads: s, source: t.source }), bt.size > ih && bt.delete(bt.keys().next().value), o;
}
const Ga = /* @__PURE__ */ new WeakMap();
function kh(e) {
  if (Ga.has(e)) return Ga.get(e);
  const t = Vu(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const m = s(c, f), p = e.read(`${va(c)} show ${f}`);
    n.set(m, p), p.then((b) => {
      n.get(m) === p && (n.delete(m), t.set(m, b.ok ? { ...b.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${va(c).replace(/-/g, "_")}.*`], (f) => {
      const m = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(m)) continue;
        const b = Number(p.slice(m.length));
        (!f.row_id || f.row_id === b) && o(c, b);
      }
    }));
  }
  function i(c, f) {
    l(c);
    const m = s(c, f);
    return !t.has(m) && !n.has(m) && o(c, f), t.get(m);
  }
  const u = { id: Symbol("window text rows"), row: i };
  return Ga.set(e, u), u;
}
function Zi() {
  const e = Se(Le, null), t = e ? kh(e) : null;
  return (n, a = {}) => bo(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const er = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Nn = (e) => String(e || "").replace(er, (t, n, a, s) => s), wh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Yn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, $h = /^Traceback \(most recent call last\):/m, xh = 8;
function tr(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, xh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Sh(e) {
  const t = [...e.matchAll(wh)].map((a) => a.index);
  if (Yn.lastIndex = 0, !t.length || !Yn.test(e)) return null;
  Yn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Yn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: tr(n), tail: "" } : null;
}
function Mh(e) {
  const t = $h.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: tr([o]), tail: n.slice(s).join(`
`) };
}
Ht((e) => {
  const t = Nn(e), n = Mh(t) || Sh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ga = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, nr = (e) => `${e.table}:${e.id}`, Rs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ka = 80;
function cl(e) {
  return e.length <= Ka ? e : `${e.slice(0, Ka + 1).replace(/\s+\S*$/, "") || e.slice(0, Ka)}…`;
}
const dl = {
  messages: (e) => cl(Rs(e.text)),
  comments: (e) => cl(Rs(e.text)),
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
}, _h = (e) => (dl[e.table] ? dl[e.table](e) : e.title || "") || "", jt = (e) => ga(e.created_at), Ch = (e) => ga(e.updated_at) || jt(e), Eh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Ah = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Oh(e) {
  const t = Eh.exec(e);
  if (t && ft(t[1])) return { at: t.index, length: t[0].length, table: ft(t[1]), id: Number(t[2]), label: t[3] };
  const n = Ah.exec(e), a = n && ft(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Th(e, t, n, a) {
  const s = Yi(a, e, t), o = Nn(s ? _h(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${mt(sn(e).title)} ${t}</span><span class="row-card-title">${mt(o)}</span></a>`;
}
Ht(
  (e, t) => {
    const n = Oh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Th(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ih = /\.(png|jpe?g|gif|webp|svg)$/i, Bh = (e) => Ih.test(e), Rh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Lh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Nh(e, t) {
  const n = Rh.exec(e), [, a, s, o, l, i] = n || [], u = n && ft(a || o), c = u && Yi(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, m = `${sn(u).title} ${c.id} · ${mt(i)}`, p = Bh(i) ? `<img class="file-card-image" src="${f}" alt="${mt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${mt(i)}">${p}<span class="file-card-name">${m}</span></a>` };
}
function qh(e) {
  const t = Lh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${mt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Ht(
  (e, t) => {
    if (t.inline) return null;
    const n = Nh(e, t) || qh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Dh = /`([^`\n]+)`/g;
Ht((e) => e.replace(Dh, (t, n) => `<code>${n}</code>`));
const fl = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ba.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Ht(
  (e, t) => e.replace(er, (n, a, s, o) => fl[a] ? fl[a](s, o, t) : o)
);
const Ph = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, ar = new RegExp(`\\b(${Fi}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), sr = new RegExp(`\\b(${Fi}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), jh = new RegExp(`<code>((?:${ar.source}|${sr.source}))</code>`, "gi"), Fh = (e) => e.replace(jh, "$1"), Wh = (e, t) => `<a class="row-pill" href="#" data-peek="${ft(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Hh = (e) => e.replace(sr, (t, n, a) => a.replace(/\d+/g, (s) => Wh(n.replace(/s$/i, ""), s))), zh = (e) => Hh(e).replace(
  ar,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ft(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Ht(
  (e, t) => t.rowNames === !1 ? e : Fh(e).split(Ph).map((n, a) => a % 2 ? n : zh(n)).join("")
);
const Uh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Vh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Gh = /[\w\]]\(/, Kh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Yh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Qh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Xh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Jh = /[[({,]$/, Zh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, ep = /^(\t|\s{2,})\S/, tp = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, np = /`[^`]+`/, ap = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, sp = /[{}()[\];=<>$&|*\\@+^~%]/g, or = /^\s*(?:[-*+]|\d+[.)])\s/, op = /^\s*>/, lp = /^\s*\|/, ip = 0.6, rp = 0.4, up = 5, cp = 0.03, lr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= up && t.every((n) => ap.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(sp) ?? []).length / e.length < cp;
}, Ya = (e) => {
  const t = e.trim();
  return np.test(t) ? !1 : [Uh, Vh, Gh, Kh, Yh, Qh, Xh, Jh, Zh].some((n) => n.test(t)) || /[;{}]$/.test(t) || ep.test(e) && !or.test(e) && !lr(e);
};
function dp(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || or.test(t[0]) || t.every((o) => op.test(o) || lp.test(o))) return "text";
  const n = t.filter((o) => !tp.test(o.trim()));
  if (t.length === 1) return !n.length || Ya(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ya).length, s = n.filter((o) => !Ya(o) && lr(o)).length;
  return a >= n.length * ip && s <= n.length * rp ? "code" : "text";
}
const Ls = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", fp = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", mp = `${Ls} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, hp = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", pp = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", ml = {
  js: { keywords: Ls, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: fp, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: mp, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ls, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: hp, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: pp, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, vp = {
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
function hl(e, t, n) {
  return n && e.startsWith(n, t);
}
function gp(e, t) {
  const n = ml[vp[t] ?? t] || ml.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (hl(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && hl(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? f.toLowerCase() : f, p = n.property && /^\s*:/.test(e.slice(o + f.length));
      l(a.has(m) ? "keyword" : p ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function yp(e, t) {
  const n = [""];
  for (const { type: a, value: s } of gp(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? mt(l) : `<span class="tok-${a}">${mt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function ir(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const bp = 1500, pl = /* @__PURE__ */ new WeakMap();
async function kp(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await ir(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(pl.get(t)), pl.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, bp)
  )));
}
typeof document < "u" && document.addEventListener("click", kp, !0);
const wp = /\n\s*\n/, $p = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, xp = /^\s*(`{3,}|~{3,})\s*$/, Sp = /^\s{4,}\S/, Mp = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ns = /^\s*(?:[-*+]|\d+[.)])\s/, rr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, _p = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ko(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Cp(e) {
  const t = ko(e.join(`
`));
  return (_p.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Ep = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && rr.test(t) && !Ns.test(t);
}, Ap = (e, t) => Ns.test(t) || Ns.test([...e].reverse().find((n) => n.trim()) || "");
function wo(e, t) {
  const n = t || Cp(e), a = yp(ko(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Op(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && xp.test(s));
  return a < 0 ? e.length : a;
}
function Tp(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return wo(a.map(Nn), n ? n.toLowerCase() : "");
}
function Ip(e) {
  const t = e.split(wp).map((l) => ({ paragraph: l, type: dp(ko(l).split(`
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
      s(), n.push(wo(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(Nn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Bp(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Ip(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match($p);
    if (i) {
      const c = Op(n, l, i[2]);
      o(), a.push(Tp(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = Ep(s) ? Mp : Sp;
    if (!t && u.test(n[l]) && !Ap(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && rr.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(wo([...f, ...n.slice(l, c)].map(Nn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Ht((e, t) => Bp(e, t.document), { first: !0 });
const Rp = ["innerHTML"], Lp = ["innerHTML"], Np = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Zi(), a = _(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => O(Kt) && O(Kt)(...l)),
      innerHTML: a.value
    }, null, 8, Rp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => O(Kt) && O(Kt)(...l)),
      innerHTML: a.value
    }, null, 8, Lp));
  }
}, ct = /* @__PURE__ */ H(Np, [["__scopeId", "data-v-d8e75741"]]), mA = (e) => [...new Set(e.agents.map((t) => t.name))], Qa = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, qp = "main agent", $o = (e, t) => t ? qp : e, Dp = ["data-agent-main"], Pp = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, jp = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Fp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean, chip: Boolean },
  setup(e) {
    const t = e, n = _(() => $o(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: K(["agent-badge", { main: e.main, chip: e.chip }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Pp, [...s[0] || (s[0] = [
        h("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        h("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), P(ae, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? w("", !0) : (r(), d("span", jp, v(n.value), 1))
    ], 10, Dp));
  }
}, Qt = /* @__PURE__ */ H(Fp, [["__scopeId", "data-v-f8a38025"]]), Wp = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], ur = { danger: "failed", warn: "waiting" }, Hp = (e) => Wp.includes(ur[e] ?? e), cr = (e) => Hp(e) ? ["badge", ur[e] ?? e] : ["badge-quiet"], zp = ["aria-expanded"], Up = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Vp = {
  key: 0,
  class: "tip-failure"
}, Gp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Se(Le, null), a = _(() => wf(t.type, t.state)), s = _(() => cr(co(t.type, t.state))), o = E(!1), l = E([]), i = E("");
    async function u() {
      o.value = !0;
      const m = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      i.value = m.ok ? "" : m.error, m.ok && (l.value = m.value.lines ?? []);
    }
    const c = () => o.value = !1, f = () => o.value ? c() : u();
    return (m, p) => a.value ? (r(), d("span", {
      key: 0,
      class: K(["state-badge", ...s.value]),
      tabindex: "0",
      role: "button",
      "aria-expanded": o.value,
      "data-state-badge": "",
      onMouseenter: u,
      onMouseleave: c,
      onFocus: u,
      onBlur: c,
      onClick: f,
      onKeydown: Ve(c, ["escape"])
    }, [
      U(v(O(kn)(e.type, e.state)) + " ", 1),
      o.value ? (r(), d("span", Up, [
        i.value ? (r(), d("span", Vp, v(i.value), 1)) : w("", !0),
        (r(!0), d(R, null, X(l.value, (b) => (r(), d("span", {
          key: b,
          class: "tip-line"
        }, v(b), 1))), 128))
      ])) : w("", !0)
    ], 42, zp)) : (r(), d("span", {
      key: 1,
      class: K(s.value)
    }, v(O(kn)(e.type, e.state)), 3));
  }
}, Kp = /* @__PURE__ */ H(Gp, [["__scopeId", "data-v-d276694c"]]), Yp = {
  class: "plan-details",
  "data-plan-details": ""
}, Qp = { class: "state-line" }, Xp = {
  key: 0,
  class: "phase-count"
}, Jp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Zp = { class: "text" }, e1 = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, t1 = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, n1 = { class: "overall" }, a1 = { class: "overall-figure" }, s1 = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, o1 = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, l1 = {
  key: 5,
  class: "part"
}, i1 = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", Yp, [
        h("div", Qp, [
          A(Kp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: K(["status", O(co)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", Xp, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : w("", !0)
        ]),
        e.plan.reason ? (r(), d("section", Jp, [
          h("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          h("p", Zp, v(e.plan.reason), 1)
        ])) : w("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", e1, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : w("", !0),
        e.plan.total ? (r(), d("section", t1, [
          n[0] || (n[0] = h("h4", null, "Progress", -1)),
          h("div", n1, [
            A(Ki, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            h("span", a1, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : w("", !0),
        e.plan.assignee ? (r(), d("p", s1, [
          A(Qt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", o1, [
          O(Qa)(e.plan) ? (r(), P(Qt, {
            key: 0,
            name: O(Qa)(e.plan).name,
            main: O(Qa)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(R, { key: 1 }, [
            U(" Delegated ")
          ], 64))
        ])) : w("", !0),
        e.plan.brief ? (r(), d("section", l1, [
          n[1] || (n[1] = h("h4", null, "The brief", -1)),
          A(Gi, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: q(() => [
              A(ct, {
                class: "text",
                "data-resource-text": "",
                text: e.plan.brief
              }, null, 8, ["text"])
            ]),
            _: 1
          }, 8, ["name"])
        ])) : w("", !0)
      ]);
    };
  }
}, hA = /* @__PURE__ */ H(i1, [["__scopeId", "data-v-52683b11"]]), r1 = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), P(Ze(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: q(() => [
        ne(t.$slots, "default", {}, void 0, !0),
        h("span", {
          class: K(["tip", e.place]),
          role: "tooltip"
        }, [
          ne(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, u1 = /* @__PURE__ */ H(r1, [["__scopeId", "data-v-683e1839"]]), dr = (e) => `row:${e}`, c1 = 5e3, d1 = "cancelled", Xa = /* @__PURE__ */ new Map();
async function f1(e, t) {
  const n = `${e.environment}:${t}`, a = Xa.get(n);
  if (a && performance.now() - a.at < c1) {
    const o = await a.answer;
    if (o.failure !== d1) return o;
    Xa.delete(n);
  }
  const s = e.read(`agent tip ${dr(t)}`);
  return Xa.set(n, { answer: s, at: performance.now() }), s;
}
function m1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function on(e, t = Date.now()) {
  const n = m1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const h1 = 36e5;
function p1(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / h1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function qs(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function fr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Zt(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ja = (e) => String(e).padStart(2, "0");
function mr(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ja(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ja(Math.floor(t % 3600 / 60))}m ${Ja(t % 60)}s`;
}
const v1 = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, g1 = { state: "retired", words: "Retired" }, y1 = (e) => e.retired ? g1 : v1[e.activity], b1 = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), k1 = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${on(e, t)}` : "", w1 = (e, t) => e ? `Seen: ${on(e, t)}` : "", $1 = {
  class: "line head",
  "data-agent-tip-head": ""
}, x1 = { key: 0 }, S1 = {
  class: "line",
  "data-agent-tip-identity": ""
}, M1 = {
  class: "line status",
  "data-agent-tip-status": ""
}, _1 = ["data-state"], C1 = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, E1 = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, A1 = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, O1 = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, T1 = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Se(Le, null), a = E(!1), s = E(null), o = E(""), l = E(Date.now()), i = _(() => y1(s.value)), u = _(() => k1(s.value.since, l.value)), c = _(() => w1(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const m = await f1(n, t.agentId);
      o.value = m.ok ? "" : m.error, m.ok && (l.value = Date.now(), s.value = m.value);
    }
    return (m, p) => (r(), P(u1, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Ea({
      default: q(() => [
        ne(m.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: q(() => [
          s.value ? (r(), d(R, { key: 0 }, [
            h("span", $1, [
              h("b", null, v(s.value.title), 1),
              p[0] || (p[0] = U()),
              s.value.name ? (r(), d("span", x1, v(s.value.name), 1)) : w("", !0)
            ]),
            h("span", S1, v(O(b1)(s.value)), 1),
            h("span", M1, [
              h("i", {
                "data-state": i.value.state
              }, null, 8, _1),
              U(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", C1, v(u.value), 1)) : w("", !0),
            c.value ? (r(), d("span", E1, v(c.value), 1)) : w("", !0)
          ], 64)) : (r(), d("b", A1, v(e.label), 1)),
          o.value ? (r(), d("span", O1, v(o.value), 1)) : w("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, $n = /* @__PURE__ */ H(T1, [["__scopeId", "data-v-71d17663"]]), I1 = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, B1 = { class: "agent-word" }, R1 = {
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
    return (o, l) => s.value.length ? (r(), d("div", I1, [
      (r(!0), d(R, null, X(s.value, (i) => (r(), P($n, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: O($o)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => O(Fe)(`agents:${i.id}`)
      }, {
        default: q(() => [
          h("span", {
            class: K(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Qt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          h("span", B1, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : w("", !0);
  }
}, L1 = /* @__PURE__ */ H(R1, [["__scopeId", "data-v-619caeed"]]), N1 = { class: "phases" }, q1 = { class: "phead" }, D1 = { class: "mark" }, P1 = { class: "ptitle" }, j1 = { class: "phead-end" }, F1 = {
  key: 0,
  class: "checkpoint"
}, W1 = { class: "progress" }, H1 = {
  key: 0,
  class: "when"
}, z1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", N1, [
      (r(!0), d(R, null, X(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: K(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        h("div", q1, [
          h("span", D1, [
            A(ae, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", P1, v(i + 1) + ". " + v(l.title), 1),
          h("span", j1, [
            l.checkpoint ? (r(), d("span", F1, "checkpoint")) : w("", !0),
            h("span", W1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", H1, v(l.goal), 1)) : w("", !0),
        A(L1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(R, null, X(l.tasks, (u) => ne(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, pA = /* @__PURE__ */ H(z1, [["__scopeId", "data-v-05aaa685"]]), U1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, V1 = { ...U1, done: "Completed" }, G1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), K1 = (e) => G1.has(e), xn = (e) => K1(e) ? "done" : e, Y1 = { class: "task-status-icon" }, Q1 = ["width", "height", "aria-label"], X1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = _(() => co("task", xn(t.status))), a = _(() => n.value === "testing" ? "started" : n.value), s = _(() => V1[t.status] ?? kn("task", t.status));
    return (o, l) => (r(), d("span", Y1, [
      A(an, {
        name: "turn",
        mode: "out-in"
      }, {
        default: q(() => [
          (r(), d("svg", {
            key: n.value,
            class: K(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            A(Ft, { value: a.value }, {
              blocked: q(() => [...l[0] || (l[0] = [
                h("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                h("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: q(() => [...l[1] || (l[1] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                h("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: q(() => [...l[2] || (l[2] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: q(() => [...l[3] || (l[3] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                h("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: q(() => [...l[4] || (l[4] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                h("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: q(() => [...l[5] || (l[5] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: q(() => [...l[6] || (l[6] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Q1))
        ]),
        _: 1
      })
    ]));
  }
}, Ra = /* @__PURE__ */ H(X1, [["__scopeId", "data-v-ae24a63f"]]), J1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, Z1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, ev = {
  key: 2,
  class: "empty"
}, tv = { class: "day" }, nv = { class: "events" }, av = { class: "mark" }, sv = { class: "what" }, ov = { class: "head" }, lv = { class: "word" }, iv = ["title", "onClick"], rv = { class: "at" }, uv = {
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
      for (const m of o.value ?? []) {
        const p = new Date(m.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        f.set(p, [...f.get(p) ?? [], m]);
      }
      return [...f].map(([m, p]) => ({ day: m, items: p }));
    }), u = (f) => new Date(f).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function c() {
      const f = await a.read(["plan", "timeline", String(a.id)]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.events : [];
    }
    return fe(() => a.id, c, { immediate: !0 }), (f, m) => (r(), d("section", J1, [
      l.value ? (r(), d("p", Z1, v(l.value), 1)) : o.value === null ? (r(), P(nt, { key: 1 })) : o.value.length ? w("", !0) : (r(), d("p", ev, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(R, null, X(i.value, (p) => (r(), d(R, {
        key: p.day
      }, [
        h("h3", tv, v(p.day), 1),
        h("ol", nv, [
          (r(!0), d(R, null, X(p.items, (b) => (r(), d("li", {
            key: `${b.time}-${b.event_type}-${b.task_id}`,
            class: K(["event", b.event_type]),
            "data-plan-event": ""
          }, [
            h("span", av, [
              n[b.event_type].state ? (r(), P(Ra, {
                key: 0,
                status: n[b.event_type].state
              }, null, 8, ["status"])) : (r(), P(ae, {
                key: 1,
                name: n[b.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            h("div", sv, [
              h("div", ov, [
                h("span", lv, v(n[b.event_type].word), 1),
                h("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${b.task_id}`,
                  onClick: ($) => s("select", b.task_id)
                }, "#" + v(b.task_id) + " " + v(b.title), 9, iv),
                h("span", rv, v(u(b.time)), 1)
              ]),
              b.text ? (r(), P(ct, {
                key: 0,
                class: "text",
                text: b.text
              }, null, 8, ["text"])) : w("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, vA = /* @__PURE__ */ H(uv, [["__scopeId", "data-v-9e511133"]]), cv = 1e3;
function hr() {
  const e = E(Date.now()), t = setInterval(() => e.value = Date.now(), cv);
  return tt(() => clearInterval(t)), e;
}
const dv = Symbol("resource-subscriptions");
function fv() {
  const e = Se(dv, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = Se(Le, null);
  if (t != null && t.subscriptions) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new bi();
  return (a, s) => n.follow("resources", a, s);
}
function qn(e, t, n = () => !0) {
  const a = Oa(t, 100), s = fv()(e, (o) => {
    n(o) && a();
  });
  Aa(() => {
    s(), a.cancel();
  });
}
function mv(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const pr = { compact: "Compaction", clear: "Clear" }, hv = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, pv = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function vv(e) {
  return e != null && e.is_open ? `${pr[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function gv(e) {
  if (!e) return [];
  const t = [["Last context change", `${pr[e.change]}: ${pv[e.state]}`], ["Asked by", hv[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const yv = "Not known", bv = 80, kv = 1e3, wv = "worker", $v = "main", xv = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), Sv = (e) => e.ok ? e.value.rows : [], Mv = (e, t) => e.ended_at ? "ended" : e.paused_at || xv.has(t == null ? void 0 : t.state) ? "waiting" : "running", vr = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function _v({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / kv, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: mr(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > bv }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? yv : `$${t.cost_dollars.toFixed(2)}` }), e.role === wv && l.push({ key: "pace", label: "Tasks an hour", value: String(p1(vr(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === $v && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Cv(e) {
  const t = vr(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Ev(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", qs(e.created_at)]), e.ended_at && a.push(["Ended", qs(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...gv(n)), a;
}
const Av = { class: "band" }, Ov = { key: 0 }, Tv = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", Av, [
      A(ae, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ne(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", Ov, v(e.count), 1)) : w("", !0)
    ]));
  }
}, Ct = /* @__PURE__ */ H(Tv, [["__scopeId", "data-v-1758914f"]]), Iv = { class: "number" }, Bv = { class: "text" }, Rv = 150, Lv = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = E(!1), a = _(() => t.text.length > Rv), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(R, null, [
      e.text ? (r(), d(R, { key: 0 }, [
        A(Ct, { icon: "file" }, {
          default: q(() => [
            U(v(e.label), 1)
          ]),
          _: 1
        }),
        h("div", {
          class: K(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : w("", !0)
      ], 64)) : w("", !0),
      e.points.length ? (r(), d(R, { key: 1 }, [
        A(Ct, { icon: "points" }, {
          default: q(() => [...l[1] || (l[1] = [
            U("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(R, null, X(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            h("span", Iv, v(i.id), 1),
            h("span", Bv, [
              U(v(i.text), 1),
              h("span", {
                class: K(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : w("", !0)
    ], 64));
  }
}, Nv = /* @__PURE__ */ H(Lv, [["__scopeId", "data-v-c99de22c"]]), qv = ["aria-expanded"], Dv = { class: "count" }, Pv = {
  key: 0,
  "data-agent-fold-body": ""
}, jv = {
  __name: "AgentFold",
  props: /* @__PURE__ */ ht({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = Dt(e, "open");
    return (n, a) => (r(), d(R, null, [
      h("button", {
        type: "button",
        class: K(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        A(ae, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        U(v(e.label), 1),
        h("span", Dv, v(e.count), 1),
        A(ae, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, qv),
      t.value ? (r(), d("div", Pv, [
        ne(n.$slots, "default", {}, void 0, !0)
      ])) : w("", !0)
    ], 64));
  }
}, Za = /* @__PURE__ */ H(jv, [["__scopeId", "data-v-7f93d8d9"]]), Fv = ["onClick"], Wv = { class: "text" }, Hv = { class: "aside" }, zv = {
  key: 0,
  class: "none"
}, Uv = {
  class: "skills",
  "data-agent-skills": ""
}, Vv = {
  key: 0,
  class: "none-inline"
}, Gv = { class: "label" }, Kv = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = nn({ helpers: !1, skills: !1 }), a = E([]), s = E([]), o = async (l) => Sv(await t.read(l));
    return fe(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), fe(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(R, null, [
      A(Za, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: q(() => [
          (r(!0), d(R, null, X(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => O(it)("agents", u.id)
          }, [
            h("span", Wv, v(O(Jt)(u).title), 1),
            h("span", Hv, v(O(Jt)(u).subtext), 1)
          ], 8, Fv))), 128)),
          a.value.length ? w("", !0) : (r(), d("p", zv, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Za, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: q(() => [
          h("p", Uv, [
            (r(!0), d(R, null, X(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? w("", !0) : (r(), d("span", Vv, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Za, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: q(() => [
          (r(!0), d(R, null, X(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            h("span", Gv, v(u) + ":", 1),
            h("span", {
              class: K(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, Yv = /* @__PURE__ */ H(Kv, [["__scopeId", "data-v-1281605f"]]), Qv = ["datetime", "title"], Xe = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = hr(), a = _(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(O(on)(e.at, O(n))), 9, Qv));
  }
}, Xv = {
  class: "now",
  "data-agent-now": ""
}, Jv = {
  key: 1,
  class: "muted"
}, Zv = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, eg = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, tg = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, ng = { class: "line" }, ag = { class: "detail" }, sg = { class: "bar" }, og = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = _(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = _(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(R, null, [
      A(Ct, { icon: "play" }, {
        default: q(() => [...o[2] || (o[2] = [
          U("Doing now", -1)
        ])]),
        _: 1
      }),
      h("div", Xv, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => O(it)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", Jv, v(e.nothing), 1)),
        n.value ? (r(), d("span", Zv, v(n.value), 1)) : w("", !0),
        e.inspection.last_activity ? (r(), d("span", eg, [
          o[3] || (o[3] = U("Seen: ", -1)),
          A(Xe, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : w("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", tg, [
        h("div", ng, [
          h("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          h("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => O(it)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        h("span", ag, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        h("div", sg, [
          h("i", {
            style: ye({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : w("", !0)
    ], 64));
  }
}, lg = /* @__PURE__ */ H(og, [["__scopeId", "data-v-ff25c609"]]), ig = ["onClick"], rg = { class: "text" }, ug = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, cg = { class: "text" }, dg = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, fg = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(R, null, [
      A(Ct, { icon: "clock" }, {
        default: q(() => [...n[0] || (n[0] = [
          U("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(R, null, X(e.moves, (a) => (r(), d(R, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => O(it)(a.table, a.id)
        }, [
          h("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          h("span", rg, v(a.text), 1),
          A(Xe, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, ig)) : (r(), d("div", ug, [
          h("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          h("span", cg, v(a.text), 1),
          A(Xe, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? w("", !0) : (r(), d("p", dg, "Nothing yet."))
    ], 64));
  }
}, mg = /* @__PURE__ */ H(fg, [["__scopeId", "data-v-58f0db57"]]), hg = ["title"], pg = { class: "name" }, vg = { class: "tier" }, gg = {
  __name: "AgentStates",
  props: { states: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => e.states.length ? (r(), d(R, { key: 0 }, [
      A(Ct, { icon: "clock" }, {
        default: q(() => [...n[0] || (n[0] = [
          U("States", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(R, null, X(e.states, (a) => (r(), d("div", {
        key: a.name,
        class: "state",
        "data-agent-open-state": "",
        title: `${a.name} (${a.tier}): ${a.rows.join(", ")}`
      }, [
        h("span", pg, v(a.name), 1),
        h("span", vg, v(a.tier), 1),
        A(Xe, {
          class: "since",
          at: a.since
        }, null, 8, ["at"])
      ], 8, hg))), 128))
    ], 64)) : w("", !0);
  }
}, yg = /* @__PURE__ */ H(gg, [["__scopeId", "data-v-13371b39"]]), bg = {
  class: "strip",
  "data-agent-strip": ""
}, kg = ["data-agent-cell"], wg = {
  key: 0,
  class: "meter"
}, $g = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", bg, [
      (r(!0), d(R, null, X(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        h("small", null, v(a.label), 1),
        h("b", {
          class: K({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", wg, [
          h("i", {
            class: K({ high: a.high }),
            style: ye({ width: `${a.meter}%` })
          }, null, 6)
        ])) : w("", !0)
      ], 8, kg))), 128))
    ]));
  }
}, xg = /* @__PURE__ */ H($g, [["__scopeId", "data-v-b6657ab7"]]), Sg = {}, Mg = { class: "menu-label" };
function _g(e, t) {
  return r(), d("span", Mg, [
    ne(e.$slots, "default", {}, void 0, !0)
  ]);
}
const xt = /* @__PURE__ */ H(Sg, [["render", _g], ["__scopeId", "data-v-aa955b3e"]]), Cg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Eg = {
  key: 0,
  class: "skills-none"
}, Ag = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => n.skills.filter((l) => l.state === "loaded")), o = _(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", Cg, [
      A(xt, null, {
        default: q(() => [...i[1] || (i[1] = [
          U("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? w("", !0) : (r(), d("p", Eg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(R, null, X(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(ae, {
          name: "book",
          size: 12
        }),
        U(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(R, { key: 1 }, [
        A(xt, null, {
          default: q(() => [...i[2] || (i[2] = [
            U("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(R, null, X(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          A(ae, {
            name: "book",
            size: 12
          }),
          U(v(u.skill), 1)
        ]))), 128))
      ], 64)) : w("", !0),
      A(He, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: q(() => [...i[3] || (i[3] = [
          U("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Og = /* @__PURE__ */ H(Ag, [["__scopeId", "data-v-be514d47"]]), Tg = ["disabled", "title"], Ig = { class: "gauge usage" }, Bg = {
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
      onClick: f[0] || (f[0] = (m) => a("open", m.currentTarget))
    }, [
      A(ae, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = U()),
      h("span", Ig, [
        h("span", {
          style: ye({ width: `${o.value}%` })
        }, null, 4)
      ]),
      U(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, Tg)) : w("", !0);
  }
}, Rg = /* @__PURE__ */ H(Bg, [["__scopeId", "data-v-a36f09dc"]]), Lg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: K(O(cr)(e.tone))
    }, v(e.text), 3));
  }
}, xo = /* @__PURE__ */ H(Lg, [["__scopeId", "data-v-b7a33f3d"]]);
function Ng(e, t, n, { groups: a, programs: s }) {
  const o = E({}), l = E(""), i = E(!1), u = _(() => !!e.value && !e.value.ended_at), c = _(() => u.value && !!e.value.paused_at);
  async function f($, y = null) {
    l.value = "";
    const k = await ci(y, $, t);
    return l.value = k.ok ? "" : k.error, n(), k;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: ($, y) => f(["agent", "control", String(e.value.number), $, y.value], { target: o, fields: { value: { ...o.value, [$]: y.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: ($) => f(["agent", "launch", $.name]) };
}
const qg = ["disabled", "title"], Dg = ["disabled", "title"], Pg = { class: "gauge" }, jg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Fg = ["disabled", "title"], Wg = ["disabled"], Hg = ["disabled"], zg = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ug = ["title"], Vg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Gg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Kg = { class: "gauge" }, Yg = { class: "context-used" }, Qg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Xg = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Jg = 75, Zg = {
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
    const n = e, a = t, s = Ng(Fa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Fa(n, "controlGroups"), programs: Fa(n, "agentPrograms") }), o = E(null), l = E(""), i = _(() => s.groups.value.find((F) => F.key === l.value));
    function u(F, B) {
      o.value = F.currentTarget, l.value = B;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = _(() => n.skills.filter((F) => F.state === "loaded"));
    function m(F) {
      u(F, "skills"), a("skills");
    }
    const p = (F) => s.groups.value.some((B) => B.key === F), b = _(() => {
      var F;
      return s.chosen.value.model ?? ((F = y.value) == null ? void 0 : F.model) ?? "";
    }), $ = _(() => {
      var F;
      return s.chosen.value.effort ?? ((F = y.value) == null ? void 0 : F.effort) ?? "";
    });
    _(() => !!n.agent && !n.agent.ended_at);
    const y = _(() => {
      var F;
      return ((F = n.usage.agents) == null ? void 0 : F.find((B) => {
        var j;
        return B.id === ((j = n.agent) == null ? void 0 : j.id);
      })) ?? null;
    }), k = _(() => {
      var F;
      return ((F = y.value) == null ? void 0 : F.context_percent) == null ? null : Math.round(y.value.context_percent);
    }), S = _(() => {
      var F;
      return vv(((F = y.value) == null ? void 0 : F.context_change) ?? null);
    }), C = (F) => `${Math.round(F / 1e3)}k`, N = _(() => {
      var F;
      return !!((F = y.value) != null && F.context_limit_tokens);
    }), D = _(() => {
      var F, B;
      return ((F = y.value) == null ? void 0 : F.context_limit_tokens) || ((B = y.value) == null ? void 0 : B.context_window_tokens) || 0;
    }), I = _(() => D.value ? `${C(y.value.context_tokens ?? 0)} of ${C(D.value)}` : ""), G = _(() => {
      var F;
      return (F = y.value) != null && F.cost_dollars ? `$${y.value.cost_dollars.toFixed(2)}` : "";
    });
    return (F, B) => {
      var j, V;
      return r(), d("div", {
        class: K(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(R, { key: 0 }, [
          h("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: B[0] || (B[0] = (M) => u(M, "agent"))
          }, [
            A(ae, {
              name: "agents",
              size: 12
            }),
            U(" " + v(((j = e.agentPrograms.find((M) => M.name === e.agent.program)) == null ? void 0 : j.title) || e.agent.program), 1)
          ], 8, qg),
          A(Rg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: B[1] || (B[1] = (M) => a("open", "usage", M))
          }, null, 8, ["windows", "disabled"]),
          k.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${k.value}% full: clear or compact it`,
            onClick: B[2] || (B[2] = (M) => p("context") ? u(M, "context") : a("open", "context", M.currentTarget))
          }, [
            A(ae, {
              name: "gauge",
              size: 12
            }),
            B[14] || (B[14] = U()),
            h("span", Pg, [
              h("span", {
                style: ye({ width: `${k.value}%` })
              }, null, 4)
            ]),
            U(" " + v(k.value) + "% ", 1)
          ], 8, Dg)) : (V = y.value) != null && V.context_unknown ? (r(), d("span", jg, [
            A(ae, {
              name: "gauge",
              size: 12
            }),
            B[15] || (B[15] = U(" Context: unknown", -1))
          ])) : w("", !0),
          b.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${b.value}: change the model`,
            onClick: B[3] || (B[3] = (M) => p("model") ? u(M, "model") : null)
          }, [
            A(ae, {
              name: "model",
              size: 12
            }),
            U(" " + v(b.value), 1)
          ], 8, Fg)) : w("", !0),
          p("effort") || e.card && $.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: B[4] || (B[4] = (M) => u(M, "effort"))
          }, [
            A(ae, {
              name: "bolt",
              size: 12
            }),
            U(" " + v($.value), 1)
          ], 8, Wg)) : w("", !0),
          G.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: B[5] || (B[5] = (M) => a("open", "cost", M.currentTarget))
          }, v(G.value), 9, Hg)) : w("", !0),
          e.branch ? (r(), d("span", zg, [
            A(ae, {
              name: "branch",
              size: 12
            }),
            U(" " + v(e.branch), 1)
          ])) : w("", !0),
          e.card ? w("", !0) : (r(), d("button", {
            key: 6,
            type: "button",
            class: K(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: B[6] || (B[6] = (M) => a("open", "jobs", M.currentTarget))
          }, [
            A(ae, {
              name: "clock",
              size: 12
            }),
            U(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: m
          }, [
            A(ae, {
              name: "book",
              size: 12
            }),
            U(" " + v(f.value.length), 1)
          ])) : w("", !0),
          e.fitness ? (r(), d(R, { key: 8 }, [
            h("button", {
              type: "button",
              class: K(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Jg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: B[7] || (B[7] = (M) => a("open", "fitness", M.currentTarget))
            }, [
              A(ae, {
                name: "heart",
                size: 12
              }),
              U(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
              type: "button",
              class: K(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: B[8] || (B[8] = (M) => a("open", "load", M.currentTarget))
            }, [
              A(ae, {
                name: "weight",
                size: 12
              }),
              U(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : w("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: B[9] || (B[9] = (M) => u(M, "start"))
        }, [
          A(ae, {
            name: "agents",
            size: 12
          }),
          B[16] || (B[16] = U(" Start an agent", -1))
        ])) : w("", !0),
        B[22] || (B[22] = h("span", { class: "space" }, null, -1)),
        O(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: O(s).failure.value
        }, v(O(s).failure.value), 9, Ug)) : w("", !0),
        ne(F.$slots, "default", {}, void 0, !0),
        o.value ? (r(), P(Wt, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: q(() => {
            var M;
            return [
              l.value === "agent" ? (r(), d(R, { key: 0 }, [
                O(s).asking.value ? (r(), d(R, { key: 0 }, [
                  A(xt, { "data-agent-stop-ask": "" }, {
                    default: q(() => [...B[17] || (B[17] = [
                      U("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(He, {
                    "data-agent-stop-confirm": "",
                    onClick: B[10] || (B[10] = (g) => (c(), O(s).stop()))
                  }, {
                    default: q(() => [...B[18] || (B[18] = [
                      U("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(He, {
                    onClick: B[11] || (B[11] = (g) => O(s).asking.value = !1)
                  }, {
                    default: q(() => [...B[19] || (B[19] = [
                      U("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), P(He, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: B[12] || (B[12] = (g) => O(s).asking.value = !0)
                }, {
                  default: q(() => [...B[20] || (B[20] = [
                    U("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(R, { key: 1 }, [
                A(xt, null, {
                  default: q(() => [...B[21] || (B[21] = [
                    U("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(R, null, X(O(s).programs.value, (g) => (r(), P(He, {
                  key: g.name,
                  "data-agent-program": g.name,
                  onClick: (x) => (c(), O(s).start(g))
                }, {
                  default: q(() => [
                    U(v(g.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), P(Og, {
                key: 2,
                skills: e.skills,
                onBrowse: B[13] || (B[13] = (g) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(R, { key: 3 }, [
                A(xt, null, {
                  default: q(() => [
                    U(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(R, { key: 0 }, [
                  h("p", Vg, v(O(mv)(((M = y.value) == null ? void 0 : M.last_compaction) ?? null)), 1),
                  h("div", Gg, [
                    h("span", Kg, [
                      h("span", {
                        style: ye({ width: `${k.value}%` })
                      }, null, 4)
                    ]),
                    h("span", Yg, v(k.value) + "%", 1)
                  ]),
                  I.value ? (r(), d("p", Qg, [
                    U(v(I.value) + " ", 1),
                    N.value ? (r(), P(xo, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : w("", !0)
                  ])) : w("", !0)
                ], 64)) : w("", !0),
                l.value === "context" && S.value ? (r(), d("p", Xg, v(S.value), 1)) : (r(!0), d(R, { key: 2 }, X(i.value.choices, (g) => (r(), P(He, {
                  key: g.value,
                  "data-agent-choice": g.value,
                  onClick: (x) => (O(s).choose(i.value.key, g), c())
                }, {
                  default: q(() => [
                    U(v(g.label), 1)
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
}, ey = /* @__PURE__ */ H(Zg, [["__scopeId", "data-v-d7113347"]]), ty = {
  class: "who",
  "data-agent-who": ""
}, ny = { class: "name" }, ay = ["data-agent-state"], sy = {
  class: "sub",
  "data-agent-started-by": ""
}, oy = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", ty, [
      h("h2", ny, [
        h("i", {
          class: K(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, ay),
        U(v(e.name), 1)
      ]),
      A(ey, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      h("p", sy, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, ly = /* @__PURE__ */ H(oy, [["__scopeId", "data-v-83bd4a9d"]]), iy = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, ry = { class: "scroll" }, uy = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, cy = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, dy = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = hr(), a = E(null), s = E(null), o = E(null), l = E(null), i = E({}), u = E({ helpers: 0, skills: 0 }), c = E(0), f = E([]), m = E([]), p = E([]), b = E("");
    let $ = 0;
    const y = _(() => {
      var N;
      return a.value.ended_at ? Cv(s.value) : `It has no task.${(N = s.value) != null && N.instruction ? " It was given an instruction." : ""}`;
    });
    async function k() {
      const N = ++$, D = await t.read(["usage", "inspector", dr(t.id), "--environment", t.environment]);
      N === $ && (b.value = D.ok ? "" : D.error, D.ok && (a.value = D.value.agent, s.value = D.value.facts, o.value = D.value.inspection, l.value = D.value.compaction ?? null, i.value = D.value.tool, u.value = { helpers: D.value.helpers, skills: D.value.skills }, f.value = D.value.points, m.value = D.value.programs, p.value = D.value.states ?? [], c.value += 1));
    }
    const S = _(() => /* @__PURE__ */ new Set([t.id])), C = {
      agent: (N) => ki(N, S.value),
      hook_call: (N) => sd(N, "session_agent_id", S.value)
    };
    return qn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], k, (N) => {
      var D;
      return ((D = C[N.event.split(".")[0]]) == null ? void 0 : D.call(C, N)) ?? !0;
    }), Ce(k), (N, D) => {
      var I, G;
      return r(), d("article", iy, [
        h("div", ry, [
          b.value ? (r(), d("p", uy, v(b.value), 1)) : a.value && o.value ? (r(), d(R, { key: 1 }, [
            A(ly, {
              name: O(Jt)(a.value, s.value).text,
              state: O(Mv)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: m.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((I = s.value) == null ? void 0 : I.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(xg, {
              cells: O(_v)({ row: a.value, facts: s.value, inspection: o.value, now: O(n) })
            }, null, 8, ["cells"]),
            A(lg, {
              inspection: o.value,
              tool: i.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(Nv, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((G = s.value) == null ? void 0 : G.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            A(yg, { states: p.value }, null, 8, ["states"]),
            A(mg, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(Yv, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: O(Ev)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", cy, "Ended " + v(O(on)(a.value.ended_at, O(n))) + ". It takes no more actions.", 1)) : w("", !0)
          ], 64)) : (r(), P(nt, { key: 2 }))
        ])
      ]);
    };
  }
}, gA = /* @__PURE__ */ H(dy, [["__scopeId", "data-v-0d31bed5"]]);
function fy(e) {
  const t = E(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Ce(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), tt(() => n.disconnect()), t;
}
const my = ["data-comment-id"], hy = {
  key: 0,
  class: "comment-top"
}, py = { class: "comment-mark" }, vy = {
  class: "comment-body",
  "data-comment": ""
}, gy = { class: "comment-foot" }, yy = {
  key: 1,
  "data-comment-lost": ""
}, by = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (r(), d("article", {
      class: K(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (r(), d("div", hy, [
        h("span", py, v(e.comment.number), 1),
        h("span", {
          class: K(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : w("", !0),
      h("p", vy, v(e.comment.body), 1),
      h("div", gy, [
        e.comment.created_at ? (r(), P(Xe, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : w("", !0),
        e.lost ? (r(), d("span", yy, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : w("", !0)
      ])
    ], 10, my));
  }
}, gr = /* @__PURE__ */ H(by, [["__scopeId", "data-v-a37d4507"]]);
var oi;
/Mac|iPhone|iPad/.test(((oi = navigator.userAgentData) == null ? void 0 : oi.platform) || navigator.platform);
function yr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const ky = {
  class: "comment-box",
  "data-comment-box": ""
}, wy = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, $y = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, xy = { class: "comment-row" }, Sy = ["placeholder"], My = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ ht({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ ht(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Dt(e, "draft"), l = E(""), i = E(!1), u = E(null), c = _(() => {
      var b;
      return ((b = a.selection) == null ? void 0 : b.selection_type) === "code";
    }), f = _(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function m() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const b = o.value.trim();
      if (!(!b || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(b), o.value = "", await Ne(), m();
        } catch ($) {
          l.value = $.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (b, $) => (r(), d("div", ky, [
      e.selection ? (r(), d("div", wy, [
        $[3] || ($[3] = h("span", { class: "comment-on-label" }, "On this selection", -1)),
        h("span", {
          class: K(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        A(Ia, {
          title: "Comment on the whole document instead",
          onClick: $[0] || ($[0] = (y) => s("clear"))
        })
      ])) : w("", !0),
      l.value ? (r(), d("p", $y, v(l.value), 1)) : w("", !0),
      h("div", xy, [
        ke(h("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": $[1] || ($[1] = (y) => o.value = y),
          rows: "1",
          maxlength: "2000",
          class: K({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: m,
          onKeydown: $[2] || ($[2] = Ve((y) => O(yr)(y, p), ["enter"]))
        }, null, 42, Sy), [
          [Ue, o.value]
        ]),
        A(re, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: q(() => [...$[4] || ($[4] = [
            U("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, _y = /* @__PURE__ */ H(My, [["__scopeId", "data-v-41d2081c"]]), Qn = (e) => e ? e.split(", ") : [];
function Cy({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Ey(e, t) {
  return {
    reads: Qn(e.reads_allowed),
    runs: Qn(e.runs_allowed),
    missing: [...Qn(e.reads_missing), ...Qn(e.runs_missing)],
    ask: t
  };
}
const Ay = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = li("SkeletonParts", !0);
      return r(!0), d(R, null, X(e.parts, (u, c) => (r(), d(R, { key: c }, [
        (r(!0), d(R, null, X(u.count, (f) => (r(), P(Ft, {
          key: f,
          value: u.shape
        }, {
          line: q(() => [
            A(hn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ye({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: q(() => [
            A(hn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ye({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: q(() => [
            A(hn, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ye({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: q(() => [...l[0] || (l[0] = [
            h("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: q(() => [
            h("div", {
              class: "skeleton-row",
              style: ye(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: q(() => [
            h("div", {
              class: "skeleton-stack",
              style: ye(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: q(() => [
            h("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ye(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: q(() => [
            h("div", {
              class: "skeleton-grid",
              style: ye(s(u))
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
}), Oy = /* @__PURE__ */ H(Ay, [["__scopeId", "data-v-fa8baeaf"]]), Ty = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Iy = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", Ty, [
      A(Oy, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, So = /* @__PURE__ */ H(Iy, [["__scopeId", "data-v-52f66b64"]]), Mo = {
  runningTool: 500,
  agentCommand: 500,
  planCard: 3e3,
  openPanel: 5e3,
  documentWithNoEvents: 6e4,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4,
  systemLogs: 5e3
}, By = { class: "bars" }, Ry = { class: "bar-name" }, Ly = { class: "bar-value" }, Ny = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = _(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", By, [
      (r(!0), d(R, null, X(e.items, (u, c) => (r(), P(Ze(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: K(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: q(() => [
          h("span", Ry, v(u.label), 1),
          A(Ki, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          h("span", Ly, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, qy = /* @__PURE__ */ H(Ny, [["__scopeId", "data-v-663427f4"]]), Dy = { class: "bars" }, Py = {
  key: 0,
  class: "bars-title"
}, jy = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Dy, [
      e.node.title ? (r(), d("span", Py, v(e.node.title), 1)) : w("", !0),
      A(qy, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Fy = /* @__PURE__ */ H(jy, [["__scopeId", "data-v-7135bb11"]]), Wy = {
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
      class: K([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ye(o.value)
    }, [
      (r(!0), d(R, null, X(e.node.children || [], (u, c) => (r(), P(wr, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, br = /* @__PURE__ */ H(Wy, [["__scopeId", "data-v-d142a3f4"]]), Hy = {
  key: 0,
  class: "card-head"
}, zy = { class: "card-title" }, Uy = {
  key: 0,
  class: "card-note"
}, Vy = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: K(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", Hy, [
        h("span", zy, v(e.node.title), 1),
        e.node.note ? (r(), d("span", Uy, v(e.node.note), 1)) : w("", !0)
      ])) : w("", !0),
      A(br, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Gy = /* @__PURE__ */ H(Vy, [["__scopeId", "data-v-67b72d40"]]), Ky = { class: "fact" }, Yy = { class: "fact-label" }, Qy = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Ky, [
      h("span", Yy, v(e.label), 1),
      A(ct, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Xy = /* @__PURE__ */ H(Qy, [["__scopeId", "data-v-3a88ecf8"]]), Jy = { class: "list" }, Zy = { class: "list-label" }, e0 = {
  key: 1,
  class: "list-note"
}, t0 = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Jy, [
      (r(!0), d(R, null, X(e.items, (o, l) => (r(), P(Ze(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: K(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: q(() => [
          h("span", Zy, v(o.label), 1),
          o.badge ? (r(), P(xo, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : w("", !0),
          o.note ? (r(), d("span", e0, v(o.note), 1)) : w("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, n0 = /* @__PURE__ */ H(t0, [["__scopeId", "data-v-ebe2ae0a"]]), Sn = (e, t = 40) => e.length > t ? `${e.slice(0, t - 1)}…` : e;
async function en(e, t, n) {
  n(await ir(e) ? `Copied ${t || Sn(e)}` : "The browser did not allow copying");
}
function yA({ word: e = "Delete", name: t, remove: n, restore: a = null, erase: s = !1 }) {
  return {
    label: e,
    danger: !0,
    armedLabel: s ? "Click again: the value is erased for good" : `${e}: click again`,
    run: async ({ say: o }) => {
      const l = await n();
      if (!l.ok) return o(l.error);
      if (s) return o(`Deleted ${t}. The value is erased.`);
      o(`${e}d ${t}`, a ? { line: a } : null);
    }
  };
}
const es = Symbol.for("journal.context-place"), Et = {
  mounted(e, t) {
    e[es] = t.value;
  },
  updated(e, t) {
    e[es] = t.value;
  },
  unmounted(e) {
    delete e[es];
  }
}, a0 = { class: "table" }, s0 = {
  key: 0,
  class: "table-row empty"
}, o0 = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" }, widths: { type: Array, default: () => [] } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => ({ gridTemplateColumns: n.widths.length ? n.widths.join(" ") : `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` })), o = (l) => {
      const i = l.cells.join(" ").replace(/\s+/g, " ").trim();
      return {
        head: Sn(i, 40),
        items: [
          { label: "Open", group: "open", disabled: !l.open, reason: "Nothing to open", run: () => a("open", l.open) },
          { label: "Copy number", group: "copy", run: ({ say: u }) => en(String(l.cells[0] ?? ""), "", u) },
          { label: "Copy line", group: "copy", run: ({ say: u }) => en(i, "the line", u) }
        ]
      };
    };
    return (l, i) => (r(), d("div", a0, [
      h("div", {
        class: "table-row head",
        style: ye(s.value)
      }, [
        (r(!0), d(R, null, X(e.columns, (u) => (r(), d("span", {
          key: u,
          class: "cell"
        }, v(u), 1))), 128))
      ], 4),
      (r(!0), d(R, null, X(e.rows, (u, c) => ke((r(), P(Ze(u.open ? "button" : "div"), {
        key: c,
        type: u.open ? "button" : void 0,
        class: K(["table-row", u.tone, { opens: u.open, active: u.active }]),
        style: ye(s.value),
        "data-table-row": u.mark,
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: q(() => [
          (r(!0), d(R, null, X(u.cells, (f, m) => (r(), d("span", {
            key: m,
            class: "cell"
          }, v(f), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "data-table-row", "onClick"])), [
        [O(Et), () => o(u)]
      ])), 128)),
      !e.rows.length && e.empty ? (r(), d("div", s0, v(e.empty), 1)) : w("", !0)
    ]));
  }
}, kr = /* @__PURE__ */ H(o0, [["__scopeId", "data-v-8d66b77f"]]), l0 = { class: "stat-value" }, i0 = { class: "stat-label" }, r0 = {
  key: 0,
  class: "stat-note"
}, u0 = {
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
    return (a, s) => (r(), P(Ze(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: K(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: q(() => [
        h("span", l0, v(e.value), 1),
        h("span", i0, v(e.label), 1),
        e.note ? (r(), d("span", r0, v(e.note), 1)) : w("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, c0 = /* @__PURE__ */ H(u0, [["__scopeId", "data-v-ad0db6d6"]]), d0 = { class: "code" }, f0 = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = _(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), P(Ft, { value: s.value }, {
      group: q(() => [
        A(br, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: q(() => [
        A(Gy, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      heading: q(() => [
        h("h3", {
          class: K(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: q(() => [...c[2] || (c[2] = [
        h("hr", { class: "divider" }, null, -1)
      ])]),
      stat: q(() => [
        A(c0, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: q(() => [
        A(Fy, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: q(() => [
        A(kr, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: q(() => [
        A(n0, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: q(() => [
        A(ct, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: q(() => [
        A(Xy, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: q(() => [
        A(xo, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: q(() => [
        h("pre", d0, [
          h("code", null, v(e.node.text), 1)
        ])
      ]),
      file: q(() => [
        h("button", {
          type: "button",
          class: "file",
          onClick: c[1] || (c[1] = (f) => i(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), wr = /* @__PURE__ */ H(f0, [["__scopeId", "data-v-b9156b43"]]), m0 = { class: "dashboard" }, h0 = { class: "trail" }, p0 = ["onClick"], v0 = {
  key: 0,
  class: "gone",
  role: "status"
}, g0 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = E(!!n.page && !s(n.page)), l = E(n.page && !o.value ? [n.page] : []), i = _(() => l.value.at(-1) || n.document.start), u = _(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, m = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return fe(
      () => n.document.start,
      () => l.value = []
    ), (p, b) => (r(), d("div", m0, [
      e.document.broken ? (r(), P(Mt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: q(() => [
          U(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), P(Mt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: q(() => [
          U(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(R, { key: 2 }, [
        h("nav", h0, [
          h("button", {
            type: "button",
            class: K(["step", { current: !l.value.length }]),
            onClick: b[0] || (b[0] = ($) => m(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(R, null, X(l.value, ($, y) => (r(), d(R, {
            key: `${y}-${$}`
          }, [
            b[2] || (b[2] = h("span", { class: "sep" }, "/", -1)),
            h("button", {
              type: "button",
              class: K(["step", { current: y === l.value.length - 1 }]),
              onClick: (k) => m(y + 1)
            }, v(c($)), 11, p0)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", v0, "What you opened is no longer in this dashboard. Here is its start page.")) : w("", !0),
        A(an, {
          name: "page",
          mode: "out-in"
        }, {
          default: q(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              A(wr, {
                node: u.value.view,
                onOpen: f,
                onFile: b[1] || (b[1] = ($) => a("file", $))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : w("", !0)
    ]));
  }
}, y0 = /* @__PURE__ */ H(g0, [["__scopeId", "data-v-fbe83734"]]);
function b0(e, t) {
  const n = at(), a = Oa(e, Mo.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Ce(e), tt(() => {
    s(), a.cancel();
  });
}
const k0 = {
  key: 0,
  class: "window-failure"
}, w0 = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = at(), o = E(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? b0(l, n.events) : so(l, () => !0, Mo.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", k0, v(o.value.error), 1)) : o.value ? (r(), P(y0, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : w("", !0);
  }
}, $0 = 1e4;
class x0 {
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
    return this.heardAt !== null && t - this.heardAt > $0;
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
const S0 = {
  key: 0,
  class: "frame-note"
}, M0 = {
  key: 0,
  class: "frame-note"
}, _0 = ["src", "title"], C0 = 1e3, E0 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = at(), a = E(null), s = E(!1), o = E(!1);
    let l = null, i = 0;
    return Ce(() => {
      l = new x0(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, C0);
    }), Be(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", S0, "This window was closed because it stopped answering.")) : (r(), d(R, { key: 1 }, [
      s.value ? (r(), d("div", M0, [
        c[2] || (c[2] = h("p", null, "This window has not answered for ten seconds.", -1)),
        A(re, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: q(() => [...c[1] || (c[1] = [
            U("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : w("", !0),
      h("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: O(n).window
      }, null, 8, _0)
    ], 64));
  }
}, A0 = /* @__PURE__ */ H(E0, [["__scopeId", "data-v-32a49046"]]), O0 = {
  class: "allowance-prompt",
  role: "dialog"
}, T0 = { class: "allowance-prompt-text" }, I0 = { class: "allowance-prompt-buttons" }, B0 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", O0, [
      h("p", T0, v(O(Cy)(e.request)), 1),
      h("div", I0, [
        A(re, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            U("Allow", -1)
          ])]),
          _: 1
        }),
        A(re, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            U("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, R0 = /* @__PURE__ */ H(B0, [["__scopeId", "data-v-cad69fe2"]]), ts = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), P(Mt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: q(() => [
        U(v(e.reason) + " ", 1),
        e.retry ? (r(), P(re, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            U("Retry", -1)
          ])]),
          _: 1
        })) : w("", !0),
        e.removable ? (r(), P(re, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            U("Remove tab", -1)
          ])]),
          _: 1
        })) : w("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, L0 = ["data-window", "data-agent"], N0 = {
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
    const i = Se(pd, null), u = Cf({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: _(() => n.options),
      declared: n.declared,
      page: Se($f, null),
      setOption: (m, p) => a("option", m, p),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (m, p) => {
        a("open", m, p), i == null || i(m, p);
      }
    });
    eo(Le, u), fe(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ce(u.settle), Be(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), Gu((m) => (console.error(`window ${n.name} failed`, m), s.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const c = () => _a(n.component), f = () => {
      var m, p;
      return ((p = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), P(R0, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (b) => e.prompts.answer(b))
      }, null, 8, ["request"])) : w("", !0),
      e.unavailableReason ? (r(), P(ts, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), P(ts, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(R, { key: 4 }, [
        (r(), P(c, { key: o.value })),
        e.skeleton.length && !O(u).answered.value ? (r(), P(So, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : w("", !0)
      ], 64)) : (r(), P(ts, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (b) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, L0));
  }
}, pn = /* @__PURE__ */ H(N0, [["__scopeId", "data-v-ec294108"]]), $r = {
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
    const n = e, a = t, s = { render: () => _a(A0, { src: n.entry.entry_url }) };
    return (o, l) => (r(), P(pn, {
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
}, q0 = ["data-window"], xr = {
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
    const n = e, a = t, s = lt(null), o = E("");
    return fe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Tc();
          } catch (i) {
            if (Ac(i) && Oc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(So, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, q0)) : (r(), P(pn, {
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
}, Sr = {
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
    const n = t, a = e, s = _(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = _(() => s.value && { render: () => _a(w0, { line: s.value.line, events: s.value.events }) }), l = E(null), i = _(() => {
      var p, b;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((b = l.value) != null && b.component_trusted);
    }), u = _(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = _(
      () => {
        var p, b;
        return l.value ? Ey(l.value, m) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((b = s.value) == null ? void 0 : b.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function f() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const p = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = p.ok ? p.value : null;
    }
    async function m() {
      const p = await a.prompts.ask(s.value.title, l.value);
      return await f(), p;
    }
    return fe(
      () => {
        var p, b;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((b = s.value) == null ? void 0 : b.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && m();
      },
      { immediate: !0 }
    ), (p, b) => {
      var $, y;
      return !s.value && (($ = e.catalogue.loaded) == null ? void 0 : $.value) === !1 ? (r(), P(So, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((y = s.value) == null ? void 0 : y.shows) === "one-agent" && e.agent === null ? (r(), P(Mt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), P(pn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), P(xr, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: b[0] || (b[0] = (k, S) => n("option", k, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), P($r, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: b[1] || (b[1] = (k, S) => n("option", k, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), P(pn, {
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
        onOption: b[2] || (b[2] = (k, S) => n("option", k, S))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), P(pn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: b[3] || (b[3] = (k) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, D0 = ["data-section"], P0 = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, j0 = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Se(Ta, null), a = _(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = _(() => ({ row: t.row }));
    return (o, l) => O(n) ? (r(!0), d(R, { key: 0 }, X(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), P(Sr, {
        key: 0,
        name: i.name,
        catalogue: O(n).catalogue,
        subscriptions: O(n).subscriptions,
        environment: O(n).environment,
        prompts: O(n).prompts,
        "shell-read": O(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", P0, v(i.name) + " is not available", 1))
    ], 8, D0))), 128)) : w("", !0);
  }
}, Ds = /* @__PURE__ */ H(j0, [["__scopeId", "data-v-a47d36b7"]]), F0 = { class: "rail-head" }, W0 = { key: 0 }, H0 = {
  key: 1,
  class: "rail-none"
}, z0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: K(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", F0, [
        n[0] || (n[0] = h("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", W0, v(e.total || e.comments.length), 1)) : w("", !0)
      ]),
      e.comments.length ? (r(!0), d(R, { key: 0 }, X(e.comments, (a) => (r(), P(gr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", H0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, U0 = /* @__PURE__ */ H(z0, [["__scopeId", "data-v-4d684649"]]), V0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, G0 = ["aria-pressed"], K0 = ["aria-pressed"], Y0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Q0 = {
  key: 0,
  role: "alert"
}, X0 = {
  key: 1,
  class: "sidebar-none"
}, J0 = ["data-question-id"], Z0 = { class: "question-state" }, eb = ["data-question-show", "onClick"], tb = {
  key: 0,
  class: "sidebar-none"
}, nb = {
  key: 1,
  class: "question-answer"
}, ab = {
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
    const t = Se(Ta, null);
    return (n, a) => (r(), d("div", {
      class: K(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      h("nav", V0, [
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, G0),
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, K0)
      ]),
      e.mode === "comments" ? (r(), d(R, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), P(U0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : w("", !0),
        A(In, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", Y0, [
        e.failure ? (r(), d("p", Q0, v(e.failure), 1)) : e.questions.length ? w("", !0) : (r(), d("p", X0, "No questions about this text yet.")),
        (r(!0), d(R, null, X(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: K(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            h("span", Z0, v(O(kn)("question", s.state)), 1),
            h("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, eb),
            s.quote ? (r(), d(R, { key: 0 }, [
              h("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", tb, "The quoted text has changed.")) : w("", !0)
            ], 64)) : w("", !0),
            s.answer ? (r(), d("p", nb, "Answered: " + v(s.answer), 1)) : w("", !0),
            A(Ds, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(vo, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = O(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, J0);
        }), 128))
      ]))
    ], 2));
  }
}, vl = /* @__PURE__ */ H(ab, [["__scopeId", "data-v-660e5c85"]]), sb = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, ob = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = nn({ abstract: n.row.abstract, body: n.row.body }), o = E("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), P(Bn, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: q(() => [
        h("span", sb, v(o.value), 1),
        A(re, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: q(() => [...u[6] || (u[6] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }),
        A(re, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: q(() => [...u[7] || (u[7] = [
            U("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: q(() => [
        h("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: ge(l, ["prevent"])
        }, [
          h("label", null, [
            u[4] || (u[4] = h("span", null, "Abstract", -1)),
            ke(h("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Ue, s.abstract]
            ])
          ]),
          h("label", null, [
            u[5] || (u[5] = h("span", null, "Text", -1)),
            ke(h("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Ue, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, lb = /* @__PURE__ */ H(ob, [["__scopeId", "data-v-464d77a8"]]);
function Mr(e, t) {
  const n = E([]), a = E(!1), s = E(null), o = E(0), l = E(!1), i = E("");
  let u = 0, c = 0;
  const f = ($) => {
    if (typeof $.body == "string") return $.body;
    const { term: y, id: k, title: S } = e(), C = `On ${y} ${k}, ${S}: `;
    return $.text.startsWith(C) ? $.text.slice(C.length) : $.text;
  };
  async function m($ = 1) {
    const { term: y, id: k } = e();
    if (!k) return;
    const S = ++c;
    l.value = !0, i.value = "";
    try {
      const C = await t([y, "comments", String(k), "--page", String($), "--page-size", "25"]);
      if (S !== c) return;
      if (!C.ok) {
        i.value = C.error;
        return;
      }
      const N = C.value.rows ?? [], D = $ === 1 ? N : [...n.value, ...N];
      n.value = [...new Map(D.map((I) => [I.id, I])).values()], o.value = C.value.total ?? n.value.length, s.value = C.value.next_page ?? null;
    } catch (C) {
      S === c && (i.value = C.message);
    } finally {
      S === c && (l.value = !1);
    }
  }
  async function p($) {
    var I;
    const { term: y, id: k } = e(), S = `${y}:${k}`, C = { id: `sending-${++u}`, text: $ };
    n.value = [...n.value, C], o.value++, a.value = !0;
    const N = await t([y, "comment", String(k), $]);
    if (S !== `${e().term}:${e().id}`) return;
    if (!N.ok)
      throw n.value = n.value.filter((G) => G.id !== C.id), o.value = Math.max(0, o.value - 1), new Error(N.error);
    await m();
    const D = (I = N.value) == null ? void 0 : I.id;
    D && !n.value.some((G) => G.id === D) && (n.value = [...n.value, { ...C, id: D }]);
  }
  const b = () => !l.value && s.value && m(s.value);
  return fe(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, m();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: m, loadMore: b, nextPage: s, total: o, loading: l, failure: i };
}
function ib(e, t) {
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
const rb = {
  class: "document-tab",
  "data-document-revisions": ""
}, ub = ["datetime"], cb = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, db = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, fb = {
  key: 2,
  class: "document-none"
}, mb = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(""), l = _(() => s.value ? ib(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", rb, [
      e.editing ? (r(), P(re, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (m) => a("close-revision"))
      }, {
        default: q(() => [...f[1] || (f[1] = [
          U("Close the open revision", -1)
        ])]),
        _: 1
      })) : w("", !0),
      e.revisions.length ? (r(), d(R, { key: 1 }, [
        (r(!0), d(R, null, X(e.revisions, (m) => (r(), P(re, {
          key: m.number,
          variant: "text",
          "data-text-revision": m.number,
          onClick: (p) => i(m)
        }, {
          default: q(() => [
            U("Revision " + v(m.number) + ": " + v(m.change) + " · " + v(m.author_name) + " · ", 1),
            h("time", {
              datetime: m.created_at
            }, v(m.created_at.slice(0, 16).replace("T", " ")), 9, ub)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", cb, v(o.value), 1)) : w("", !0),
        s.value ? (r(), d(R, { key: 1 }, [
          A(re, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: q(() => [...f[2] || (f[2] = [
              U("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          h("div", db, [
            (r(!0), d(R, null, X(l.value, (m) => (r(), d("div", {
              key: m.key,
              class: K(["revision-line", m.type])
            }, v(m.text || " "), 3))), 128))
          ])
        ], 64)) : w("", !0)
      ], 64)) : (r(), d("p", fb, "No revisions"))
    ]));
  }
}, hb = /* @__PURE__ */ H(mb, [["__scopeId", "data-v-3a381aa4"]]), pb = "button, [data-comment-number]", vb = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function _r(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(pb) || n.push(t.currentNode);
  return n;
}
function gl(e, t, n) {
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
const gb = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function yb(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = _r(e), s = a.map((c) => c.data).join(""), o = gl(a, n.startContainer, n.startOffset), l = s.slice(o, gl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: gb(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function bb(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function kb(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function ns(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function wb({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function $b(e, t) {
  const n = _r(e), a = bb(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = kb(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(wb).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(ns(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(ns(t.number, t.id, t.label)) : l.at(-1).append(ns(t.number, t.id, t.label))), !0;
}
function xb(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !$b(e, a) && a.id && n.push(a.id);
  return n;
}
const Sb = (e) => e.closest(vb) ?? e;
function yl(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const Mb = {
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
      const y = a.comments.filter((N) => N.quote).map((N) => ({ ...N, label: a.annotationLabel, hot: N.id === a.hot })), k = xb(l.value, a.pending ? [...y, { ...a.pending, pending: !0 }] : y);
      s("lost", k);
      const S = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!S) {
        c.value = null;
        return;
      }
      const C = document.createElement("div");
      C.className = "inline-comment", Sb(S).after(C), c.value = C;
    }
    function m() {
      if (!l.value) return;
      const y = yb(l.value);
      if (u.value = !!y, !y) {
        i.value = null;
        return;
      }
      const k = window.getSelection().getRangeAt(0).getBoundingClientRect(), S = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(k.left - S.left, 0)}px`, top: `${k.top - S.top + o.value.scrollTop}px` }, s("select", y);
    }
    function p(y) {
      const k = y.target.closest("[data-comment-number]");
      k ? s("number", Number(k.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function b(y) {
      var k;
      (k = l.value.querySelector(`[data-comment="${y}"]`)) == null || k.scrollIntoView({ block: "center" });
    }
    function $(y) {
      var k;
      (k = l.value.querySelectorAll("h3, h4, h5, h6")[y]) == null || k.scrollIntoView({ block: "start" });
    }
    return fe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Ce(() => {
      f(), document.addEventListener("selectionchange", m);
    }), tt(() => document.removeEventListener("selectionchange", m)), t({ show: b, showHeading: $, nextTick: Ne }), (y, k) => (r(), d("div", {
      ref_key: "box",
      ref: o,
      class: "document-text"
    }, [
      h("div", {
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
        style: ye(i.value),
        "data-comment-pill": "",
        onMousedown: k[0] || (k[0] = ge(() => {
        }, ["prevent"])),
        onClick: k[1] || (k[1] = (S) => s("write"))
      }, [
        A(ae, {
          name: "chat",
          size: 13
        }),
        k[2] || (k[2] = U("Comment on this", -1))
      ], 36)) : w("", !0),
      c.value ? (r(), P(Tn, {
        key: 1,
        to: c.value
      }, [
        ne(y.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : w("", !0),
      ne(y.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, _b = /* @__PURE__ */ H(Mb, [["__scopeId", "data-v-a92386e6"]]), Cb = { class: "document-tabs" }, Eb = ["aria-pressed"], Ab = { class: "document-body" }, Ob = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, Tb = {
  key: 1,
  class: "document-loading"
}, Ib = {
  class: "document-details",
  "data-resource-fields": ""
}, Bb = 760, Rb = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = Se($i, E(null)), a = E(null), s = fy(a), o = _(() => s.value !== null && s.value < Bb), l = E(null), i = E(""), u = E([]), c = E([]), f = E(""), m = E("comments"), p = E("text"), b = E(0), $ = E(!1), y = E(0), k = E([]), S = E(null), C = E(""), N = E(!1), D = E(null), I = E(null);
    let G = 0;
    const F = Mr(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (pe) => t.read(pe)), B = _(() => yl(F.comments.value)), j = _(() => m.value === "questions" ? yl(c.value) : B.value), V = _(() => m.value === "questions" ? j.value.length : F.total.value), M = _(() => {
      var pe;
      return (pe = l.value) != null && pe.body ? bo(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), g = _(() => {
      var pe;
      return (((pe = l.value) == null ? void 0 : pe.body) ?? "").split(`
`).filter((ie) => /^#{1,4} /.test(ie)).map((ie, se) => ({ key: String(se), value: se, label: ie.replace(/^#+ /, "") }));
    }), x = _(() => B.value.find((pe) => pe.id === y.value)), T = _(() => {
      var pe;
      return (pe = l.value) != null && pe.close_reason ? "Closed" : "Open";
    }), L = _(() => p.value === "comments" && !o.value ? "text" : p.value), W = (pe) => pe.ok ? pe.value.rows ?? [] : [];
    async function Y() {
      const pe = ++G, ie = await t.read([t.term, "inspect", String(t.id)]);
      if (pe !== G) return;
      i.value = ie.ok ? "" : ie.error, l.value = ie.ok ? ie.value : null;
      const se = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), be = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      pe === G && (c.value = W(se), f.value = se.ok ? "" : se.error, u.value = be ? W(be) : []);
    }
    async function Z(pe) {
      const ie = S.value ? ["--quote", S.value.quote, "--position", String(S.value.position), "--selection-type", S.value.selection_type] : [], se = await t.read([t.term, "comment", String(t.id), ...ie, "--", pe]);
      if (!se.ok) throw new Error(se.error);
      S.value = null, await Promise.all([Y(), F.load()]);
    }
    async function le() {
      const pe = await t.read(["doc", "close", String(t.id)]);
      i.value = pe.ok ? "" : pe.error, pe.ok && await Y();
    }
    function de() {
      C.value.trim() || (S.value = null);
    }
    async function $e(pe) {
      var ie;
      if (b.value = pe, o.value && m.value === "questions") {
        p.value = "comments";
        return;
      }
      if (o.value) {
        y.value = y.value === pe ? 0 : pe;
        return;
      }
      $.value = !0, await Ne(), (ie = a.value.querySelector(m.value === "questions" ? `[data-question-id="${pe}"]` : `[data-comment-id="${pe}"]`)) == null || ie.scrollIntoView({ block: "nearest" });
    }
    async function Ee(pe) {
      var ie, se;
      p.value = "text", b.value = pe, await ((ie = D.value) == null ? void 0 : ie.nextTick()), (se = D.value) == null || se.show(pe);
    }
    function ze() {
      N.value = !1, Y();
    }
    return fe(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", $.value = !1, b.value = 0, y.value = 0, S.value = null, c.value = [], f.value = "", Y();
    }, { immediate: !0 }), fe(m, () => {
      b.value = 0, y.value = 0;
    }), (pe, ie) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), P(Tn, {
        key: 0,
        to: O(n),
        disabled: !O(n)
      }, [
        h("span", {
          class: K(["document-actions", { placed: O(n) }]),
          "data-document-actions": ""
        }, [
          A(re, {
            bordered: "",
            "data-text-edit": "",
            onClick: ie[0] || (ie[0] = (se) => N.value = !0)
          }, {
            default: q(() => [...ie[15] || (ie[15] = [
              U("Edit", -1)
            ])]),
            _: 1
          }),
          L.value === "text" && g.value.length > 1 ? (r(), P(io, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: g.value,
            "data-text-chapters": "",
            onPick: ie[1] || (ie[1] = (se) => {
              var be;
              return (be = D.value) == null ? void 0 : be.showHeading(se.value);
            })
          }, null, 8, ["label", "items"])) : w("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : w("", !0),
      h("nav", Cb, [
        h("button", {
          type: "button",
          class: K(["document-tab-button", { on: L.value === "text" }]),
          "data-document-tab": "text",
          onClick: ie[2] || (ie[2] = (se) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: K(["document-tab-button", { on: L.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: ie[3] || (ie[3] = (se) => p.value = "comments")
        }, [
          U(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(V.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: K(["document-tab-button", { on: $.value }]),
          "aria-pressed": $.value,
          "data-document-notes-toggle": "",
          onClick: ie[4] || (ie[4] = (se) => $.value = !$.value)
        }, [
          U(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(V.value || ""), 1)
        ], 10, Eb)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: K(["document-tab-button", { on: L.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: ie[5] || (ie[5] = (se) => p.value = "revisions")
        }, [
          ie[16] || (ie[16] = U("Revisions ", -1)),
          h("em", null, v(u.value.length || ""), 1)
        ], 2)) : w("", !0)
      ]),
      h("div", Ab, [
        i.value ? (r(), d("p", Ob, v(i.value), 1)) : l.value ? L.value === "revisions" ? (r(), P(hb, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: le,
          onRestored: Y
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : L.value === "comments" ? (r(), P(vl, {
          key: 3,
          mode: m.value,
          "onUpdate:mode": ie[6] || (ie[6] = (se) => m.value = se),
          tab: "",
          comments: B.value,
          questions: c.value,
          hot: b.value,
          lost: k.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!O(F).nextPage.value,
          "comment-loading": O(F).loading.value,
          "comment-failure": O(F).failure.value,
          "comment-total": O(F).total.value,
          onMore: O(F).loadMore,
          onShow: Ee,
          onChanged: Y
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(R, { key: 4 }, [
          A(_b, {
            ref_key: "words",
            ref: D,
            html: M.value,
            comments: j.value,
            "annotation-label": m.value === "questions" ? "Question" : "Comment",
            hot: b.value,
            pending: S.value,
            inline: y.value,
            onSelect: ie[8] || (ie[8] = (se) => S.value = se),
            onClear: de,
            onNumber: $e,
            onWrite: ie[9] || (ie[9] = (se) => {
              var be;
              return (be = I.value) == null ? void 0 : be.focus();
            }),
            onLost: ie[10] || (ie[10] = (se) => k.value = se)
          }, {
            inline: q(() => [
              x.value ? (r(), P(gr, {
                key: 0,
                comment: x.value,
                hot: "",
                onShow: ie[7] || (ie[7] = (se) => Ee(x.value.id))
              }, null, 8, ["comment"])) : w("", !0)
            ]),
            default: q(() => [
              h("dl", Ib, [
                ie[18] || (ie[18] = h("h4", null, "Details", -1)),
                ie[19] || (ie[19] = h("dt", null, "State", -1)),
                h("dd", null, v(T.value), 1),
                l.value.close_reason ? (r(), d(R, { key: 0 }, [
                  ie[17] || (ie[17] = h("dt", null, "Why closed", -1)),
                  h("dd", null, v(l.value.close_reason), 1)
                ], 64)) : w("", !0),
                ie[20] || (ie[20] = h("dt", null, "Created", -1)),
                h("dd", null, [
                  A(Xe, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                ie[21] || (ie[21] = h("dt", null, "Updated", -1)),
                h("dd", null, [
                  A(Xe, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && $.value ? (r(), P(vl, {
            key: 0,
            mode: m.value,
            "onUpdate:mode": ie[11] || (ie[11] = (se) => m.value = se),
            comments: B.value,
            questions: c.value,
            hot: b.value,
            lost: k.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!O(F).nextPage.value,
            "comment-loading": O(F).loading.value,
            "comment-failure": O(F).failure.value,
            "comment-total": O(F).total.value,
            onMore: O(F).loadMore,
            onShow: Ee,
            onChanged: Y
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : w("", !0)
        ], 64)) : (r(), d("div", Tb, [
          A(nt)
        ]))
      ]),
      l.value ? (r(), P(_y, {
        key: 1,
        ref_key: "composer",
        ref: I,
        draft: C.value,
        "onUpdate:draft": ie[12] || (ie[12] = (se) => C.value = se),
        selection: S.value,
        send: Z,
        narrow: o.value,
        onClear: ie[13] || (ie[13] = (se) => S.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : w("", !0),
      N.value ? (r(), P(lb, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: ie[14] || (ie[14] = (se) => N.value = !1),
        onSaved: ze
      }, null, 8, ["term", "id", "row", "read"])) : w("", !0)
    ], 512));
  }
}, bA = /* @__PURE__ */ H(Rb, [["__scopeId", "data-v-f9bd78a7"]]), Lb = {
  key: 1,
  class: "row-list-failure"
}, Nb = ["data-row"], qb = {
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
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), P(nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", Lb, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), P(Mt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: q(() => [
        U(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(R, { key: 3 }, [
      (r(), P(Ze(e.arrival || e.moves ? to : "ul"), De(n.value, { class: "row-list" }), {
        default: q(() => [
          (r(!0), d(R, null, X(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ne(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Nb))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : w("", !0)
    ], 64));
  }
}, Db = /* @__PURE__ */ H(qb, [["__scopeId", "data-v-e9f251f3"]]), Pb = {
  class: "agent-rows",
  "data-agent-rows": ""
}, jb = {
  key: 1,
  class: "agent-rows-note"
}, Fb = {
  key: 2,
  class: "agent-rows-note"
}, Wb = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Hb = ["data-agent-row", "onClick"], zb = { class: "agent-row-name" }, Ub = { class: "agent-row-state" }, Vb = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = _(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = _(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", Pb, [
      e.loaded ? e.failure ? (r(), d("p", jb, v(e.failure), 1)) : e.rows.length ? (r(), d(R, { key: 3 }, [
        h("p", Wb, v(a.value) + " running", 1),
        (r(!0), d(R, null, X(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => O(Fe)(`agents:${l.id}`)
        }, [
          h("span", zb, "#" + v(l.id) + " " + v(l.session), 1),
          h("span", Ub, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Hb))), 128))
      ], 64)) : (r(), d("p", Fb, v(e.none), 1)) : (r(), P(nt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, kA = /* @__PURE__ */ H(Vb, [["__scopeId", "data-v-a01e5a17"]]), yt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ye = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Gb = 6;
function _o(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Kb = (e) => {
  const t = _o(e, yt.lineChars), n = Math.max(yt.minWidth, Math.max(...t.map((a) => a.length)) * yt.charWidth + yt.padX * 2);
  return { name: e, lines: t, line: yt.line, padY: yt.padY, width: n, height: t.length * yt.line + yt.padY * 2 };
};
function Yb(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Qb(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Xb(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, u) => [i, u]))), o = (l, i) => {
    const u = s(), c = (f) => {
      const m = i(f).map((p) => u.get(p));
      return m.length ? m.reduce((p, b) => p + b, 0) / m.length : u.get(f);
    };
    return [...l].sort((f, m) => c(f) - c(m));
  };
  for (let l = 0; l < Gb; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (m) => t.filter((p) => p[i ? 1 : 0] === m).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function Jb(e, t) {
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
function Zb(e) {
  const t = [...new Set(e.flatMap(([D, I]) => [D, I]))], n = new Set(e.map(([, D]) => D)), a = t.filter((D) => !n.has(D)), s = Yb(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((D, I) => !s.has(I)), l = Qb(t, o), i = Xb(t, o, l), u = new Map(t.map((D) => [D, Kb(D)])), c = i.map((D) => D.reduce((I, G) => I + u.get(G).width, 0) + Ye.across * (D.length - 1)), f = Math.max(...c) + Ye.margin * 2, m = tk(e, l, i.length), p = /* @__PURE__ */ new Map();
  let b = Ye.margin;
  i.forEach((D, I) => {
    let G = (f - c[I]) / 2;
    const F = Math.max(...D.map((B) => u.get(B).height));
    D.forEach((B) => {
      const j = u.get(B);
      p.set(B, { ...j, x: G, y: b + (F - j.height) / 2 }), G += j.width + Ye.across;
    }), b += F + (m[I] ?? Ye.down);
  });
  const $ = e.map(([D, I, G], F) => ({ from: D, to: I, label: G || "", back: s.has(F) || l.get(I) <= l.get(D) }));
  Jb($, p);
  const y = $.map((D) => nk(D, p.get(D.from), p.get(D.to))), k = [...p.values()], S = lk(y, k), C = Math.max(b - Ye.down, ...S.filter((D) => D.label).map((D) => D.label.y + D.label.height));
  return { width: Math.max(f - Ye.margin, ...S.filter((D) => D.label).map((D) => D.label.x + D.label.width)) + Ye.margin, height: C + Ye.margin, nodes: k, arrows: S };
}
const ek = (e) => e ? _o(e, Qe.lineChars).length * Qe.line + Qe.pad * 2 : 0;
function tk(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ye.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += ek(l) + Ye.labelSpace);
  }), a.map((s) => Math.max(Ye.down, s));
}
function nk(e, t, n) {
  const a = e.label ? _o(e.label, Qe.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Qe.charWidth + Qe.pad * 2 : 0, o = a.length * Qe.line + (a.length ? Qe.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, m = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: m, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const ak = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, sk = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], ok = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Qe.line);
function lk(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = ak(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = ok.flatMap((u) => sk.map((c) => s(c, u))).find((u) => !n.some((c) => bl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => bl(i, u)); ) i.y += Qe.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Qe.line, pad: Qe.pad } };
  });
}
const bl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, ik = { class: "flowchart-tools" }, rk = ["width", "height", "viewBox", "aria-label"], uk = ["d"], ck = ["x", "y", "width", "height"], dk = ["x", "y"], fk = ["x", "dy"], mk = {
  key: 0,
  class: "flowchart-label"
}, hk = ["x", "y", "width", "height"], pk = ["x", "y"], vk = ["x", "dy"], gk = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => Zb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = E(null), i = E({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var S;
      const y = (S = l.value) == null ? void 0 : S.getBoundingClientRect();
      if (!(y != null && y.width)) return;
      const k = Math.min(y.width / s.value.width, y.height / s.value.height, 1.5);
      i.value = { zoom: k, x: (y.width - s.value.width * k) / 2, y: (y.height - s.value.height * k) / 2 };
    }
    function f(y, k, S) {
      const { zoom: C, x: N, y: D } = i.value, I = Math.min(o.most, Math.max(o.least, C * y));
      i.value = { zoom: I, x: k - (k - N) * I / C, y: S - (S - D) * I / C };
    }
    function m(y) {
      const k = l.value.getBoundingClientRect();
      f(y, k.width / 2, k.height / 2);
    }
    function p(y) {
      const k = l.value.getBoundingClientRect();
      y.ctrlKey || y.metaKey ? f(y.deltaY < 0 ? o.step : 1 / o.step, y.clientX - k.left, y.clientY - k.top) : i.value = { ...i.value, x: i.value.x - y.deltaX, y: i.value.y - y.deltaY };
    }
    function b(y) {
      var k, S, C;
      y.preventDefault(), (k = window.getSelection()) == null || k.removeAllRanges(), u = { x: y.clientX - i.value.x, y: y.clientY - i.value.y }, (C = (S = l.value).setPointerCapture) == null || C.call(S, y.pointerId);
    }
    function $(y) {
      u && (i.value = { ...i.value, x: y.clientX - u.x, y: y.clientY - u.y });
    }
    return Ce(c), (y, k) => (r(), P(Bn, {
      padded: "",
      title: e.title,
      large: "",
      onClose: k[4] || (k[4] = (S) => a("close"))
    }, {
      default: q(() => [
        h("div", ik, [
          A(re, {
            small: "",
            onClick: k[0] || (k[0] = (S) => m(o.step))
          }, {
            default: q(() => [...k[5] || (k[5] = [
              U("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(re, {
            small: "",
            onClick: k[1] || (k[1] = (S) => m(1 / o.step))
          }, {
            default: q(() => [...k[6] || (k[6] = [
              U("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(re, {
            small: "",
            onClick: c
          }, {
            default: q(() => [...k[7] || (k[7] = [
              U("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        h("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: ge(p, ["prevent"]),
          onPointerdown: b,
          onPointermove: $,
          onPointerup: k[2] || (k[2] = (S) => zo(u) ? u.value = null : u = null),
          onPointercancel: k[3] || (k[3] = (S) => zo(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ye({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            k[8] || (k[8] = h("defs", null, [
              h("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                h("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (r(!0), d(R, null, X(s.value.arrows, (S, C) => (r(), d("path", {
              key: `arrow-${C}`,
              class: "flowchart-arrow",
              d: S.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, uk))), 128)),
            (r(!0), d(R, null, X(s.value.nodes, (S) => (r(), d("g", {
              key: S.name,
              class: "flowchart-node"
            }, [
              h("rect", {
                x: S.x,
                y: S.y,
                width: S.width,
                height: S.height,
                rx: "8"
              }, null, 8, ck),
              h("text", {
                x: S.x + S.width / 2,
                y: S.y + S.padY + S.line / 2
              }, [
                (r(!0), d(R, null, X(S.lines, (C, N) => (r(), d("tspan", {
                  key: N,
                  x: S.x + S.width / 2,
                  dy: N ? S.line : 0
                }, v(C), 9, fk))), 128))
              ], 8, dk)
            ]))), 128)),
            (r(!0), d(R, null, X(s.value.arrows, (S, C) => (r(), d(R, {
              key: `label-${C}`
            }, [
              S.label ? (r(), d("g", mk, [
                h("rect", {
                  x: S.label.x,
                  y: S.label.y,
                  width: S.label.width,
                  height: S.label.height,
                  rx: "4"
                }, null, 8, hk),
                h("text", {
                  x: S.label.x + S.label.width / 2,
                  y: S.label.y + S.label.pad + S.label.line / 2
                }, [
                  (r(!0), d(R, null, X(S.label.lines, (N, D) => (r(), d("tspan", {
                    key: D,
                    x: S.label.x + S.label.width / 2,
                    dy: D ? S.label.line : 0
                  }, v(N), 9, vk))), 128))
                ], 8, pk)
              ])) : w("", !0)
            ], 64))), 128))
          ], 12, rk))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, yk = /* @__PURE__ */ H(gk, [["__scopeId", "data-v-e98799dc"]]), bk = ["innerHTML"], kk = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = _(() => Zo[t.name] || Zo.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, bk));
  }
}, At = /* @__PURE__ */ H(kk, [["__scopeId", "data-v-beb5935c"]]), wk = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: K(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(At, { name: "fold" })
    ], 2));
  }
}, ln = /* @__PURE__ */ H(wk, [["__scopeId", "data-v-d03899bb"]]), $k = ["data-tip", "aria-label"], xk = {
  key: 0,
  class: "mact-word"
}, Sk = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: K(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(At, { name: "open" }),
      e.open ? (r(), d("span", xk, v(e.label), 1)) : w("", !0),
      n[0] || (n[0] = h("span", { class: "hit" }, null, -1))
    ], 10, $k));
  }
}, Cr = /* @__PURE__ */ H(Sk, [["__scopeId", "data-v-3b292e09"]]), Er = 120, la = 280, Ar = 160, Mk = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, _k = ["leaving", "resizing", "entering"];
function Ps(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Ck(e) {
  const t = _k.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Ps(e);
  return e.classList.add(...t), n;
}
function Or(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = E(t()), s = E("");
  let o = 0;
  const l = (m, p) => Object.assign(m.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (m) => Object.assign(m.style, { width: "", height: "", transition: "" });
  function u(m, p) {
    i(m);
    const b = Ck(m);
    l(m, p), m.offsetWidth, m.style.transition = `width ${la}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${la}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(m, b);
  }
  function c(m) {
    const p = m.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let b = p.offsetHeight;
    const $ = new ResizeObserver(() => {
      p.offsetHeight !== b && (b = p.offsetHeight, u(m, Ps(m)));
    });
    return $.observe(p), $;
  }
  async function f(m) {
    const p = e.value, b = ++o;
    if (!p || !p.offsetWidth || Mk()) {
      a.value = m;
      return;
    }
    const $ = Ps(p);
    if (l(p, $), s.value = "leaving", await n(Er), b !== o) return;
    a.value = m, s.value = "resizing", await Ne(), u(p, $);
    const y = c(p);
    await n(la), y == null || y.disconnect(), b === o && (i(p), s.value = "entering", await n(Ar), b === o && (s.value = ""));
  }
  return fe(t, (m) => f(m)), tt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Ek = { class: "growing-card-top" }, Ak = ["aria-expanded"], Ok = { class: "growing-card-avatar" }, Tk = { class: "growing-card-title" }, Ik = { class: "growing-card-more" }, Bk = { class: "growing-card-body" }, Rk = {
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
    const n = e, a = t, s = E(!1), o = E(null), { folded: l, phase: i } = Or(o, () => !s.value), u = _(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = _(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: K(["growing-card-wrap", O(i), { open: !O(l), bad: e.bad, incoming: e.incoming }])
    }, [
      h("div", Ek, [
        h("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, [
          h("span", Ok, [
            e.bad ? (r(), P(At, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(R, { key: 1 }, [
              U(v(u.value), 1)
            ], 64)) : (r(), P(ae, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          h("span", Tk, v(e.title), 1),
          A(ln, { open: s.value }, null, 8, ["open"])
        ], 8, Ak),
        e.action ? (r(), P(Cr, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: m[1] || (m[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : w("", !0),
        e.commentable ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: m[2] || (m[2] = (p) => a("comment"))
        }, [
          A(ae, {
            name: "bubble",
            size: 13
          })
        ])) : w("", !0)
      ]),
      h("div", Ik, [
        h("div", Bk, [
          (r(!0), d(R, null, X(c.value, (p, b) => (r(), d("p", {
            key: b,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Lk = /* @__PURE__ */ H(Rk, [["__scopeId", "data-v-f2b4930d"]]), Nk = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, qk = { class: "md inline" }, Dk = ["disabled", "title", "onClick"], Pk = {
  key: 1,
  class: "message-links-many"
}, jk = ["aria-expanded"], Fk = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Wk = ["disabled", "onClick"], Hk = { class: "row-pill message-links-chip" }, zk = { class: "message-links-title" }, Uk = { key: 0 }, as = 3, Vk = "task", Gk = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => n.total || n.links.length), o = _(() => n.links.every((p) => p.endpoint.model === Vk) ? "tasks" : "items"), l = E(!1), i = E(null);
    Si(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function m(p) {
      c(p) || (l.value = !1, Fe(p.endpoint.open_ref));
    }
    return (p, b) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: K(["message-links", { many: s.value > as, three: s.value === as, open: l.value }]),
      "data-message-links": ""
    }, [
      A(At, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", Nk, [
        h("span", qk, [
          b[1] || (b[1] = U("Linked: ", -1)),
          (r(!0), d(R, null, X(e.links, ($) => (r(), d("button", {
            key: `${$.endpoint.model}:${$.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c($),
            title: $.endpoint.title,
            onClick: (y) => m($)
          }, [
            U(v($.endpoint.model.replaceAll("_", " ")) + " " + v($.endpoint.id), 1),
            f($) ? (r(), d(R, { key: 0 }, [
              U(" (" + v(f($)) + ")", 1)
            ], 64)) : w("", !0),
            c($) ? (r(), d(R, { key: 1 }, [
              U(" (unavailable)")
            ], 64)) : w("", !0)
          ], 8, Dk))), 128))
        ])
      ])) : w("", !0),
      s.value >= as ? (r(), d("span", Pk, [
        h("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          U(v(s.value) + " linked " + v(o.value) + " ", 1),
          A(ln, { open: l.value }, null, 8, ["open"])
        ], 8, jk)
      ])) : w("", !0),
      l.value ? (r(), d("div", Fk, [
        (r(!0), d(R, null, X(e.links, ($) => (r(), d("button", {
          key: `${$.endpoint.model}:${$.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c($),
          onClick: (y) => m($)
        }, [
          h("span", Hk, v($.endpoint.model.replaceAll("_", " ")) + " " + v($.endpoint.id), 1),
          h("span", zk, v($.endpoint.title), 1),
          h("span", null, v(f($)), 1),
          c($) ? (r(), d("span", Uk, "Unavailable")) : w("", !0)
        ], 8, Wk))), 128))
      ])) : w("", !0),
      A(In, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: b[0] || (b[0] = ($) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Kk = /* @__PURE__ */ H(Gk, [["__scopeId", "data-v-843fc3bd"]]), Yk = ["title", "aria-label"], Qk = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Xk = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Jk = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = _(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: K(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", Qk, [
        o[0] || (o[0] = h("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Xk)) : w("", !0)
      ]))
    ], 10, Yk));
  }
}, Zk = /* @__PURE__ */ H(Jk, [["__scopeId", "data-v-6dc92808"]]), ew = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, tw = (e) => e.worker_id != null ? "report" : "message", nw = (e) => ew[tw(e)], aw = "img,pre,table";
function sw(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function ow(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function lw(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(aw)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = sw(ow(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function iw(e, t) {
  let n = null;
  const a = () => e.value && lw(e.value);
  Ce(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), fe(t, a, { flush: "post" });
}
const kl = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function rw(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Xn = /* @__PURE__ */ new WeakMap(), Pe = "work", ot = "sent", uw = 50, wl = 50, $l = () => ({ rows: E([]), total: E(0), next: E(null), loading: E(!1), failure: E(""), version: 0 });
function cw(e) {
  var y;
  if (Xn.has(e)) return Xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (k) => {
    var S;
    return ((S = e.visible) == null ? void 0 : S.value) !== !1 && [...k.views].some((C) => C.visible);
  };
  function o(k, S) {
    const C = k[S], N = ++C.version;
    return C.loading.value = !0, C.failure.value = "", N;
  }
  function l(k, S, C, N, D) {
    const I = k[S];
    if (t.get(k.id) !== k || I.version !== C) return;
    if (I.loading.value = !1, !D.ok) {
      I.failure.value = D.error;
      return;
    }
    const G = S === Pe ? D.value.counterparts ?? [] : D.value.rows ?? [], F = N === 1 ? G : [...I.rows.value, ...G], B = S === Pe ? (j) => `${j.endpoint.model}:${j.endpoint.id}` : (j) => j.id ?? j.target_id;
    I.rows.value = [...new Map(F.map((j) => [B(j), j])).values()], I.total.value = D.value.total ?? I.rows.value.length, I.next.value = D.value.next_page ?? null;
  }
  function i(k, S, C, N) {
    const D = k[S];
    D.version === C && (D.failure.value = N.message, D.loading.value = !1);
  }
  async function u(k, S, C) {
    const N = o(k, S), D = S === Pe ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(k, S, N, C, await e.read(`link list --source message:${k.id} ${D} --page ${C} --page-size ${S === Pe ? 10 : 25}`));
    } catch (I) {
      i(k, S, N, I);
    }
  }
  async function c(k) {
    const S = k.map((C) => ({ [Pe]: o(C, Pe), [ot]: o(C, ot) }));
    try {
      const C = await e.read(`link receipts --messages ${k.map((N) => N.id).join(",")}`);
      k.forEach((N, D) => {
        const I = C.ok ? C.value.messages[String(N.id)] : null;
        l(N, Pe, S[D][Pe], 1, C.ok ? { ok: !0, value: I.named } : C), l(N, ot, S[D][ot], 1, C.ok ? { ok: !0, value: I.sent } : C);
      });
    } catch (C) {
      k.forEach((N, D) => [Pe, ot].forEach((I) => i(N, I, S[D][I], C)));
    }
  }
  function f() {
    a = null;
    const k = [...n].map((S) => t.get(S)).filter((S) => S && s(S));
    n.clear(), k.forEach((S) => S.dirty.clear());
    for (let S = 0; S < k.length; S += wl) c(k.slice(S, S + wl));
  }
  function m(k, S = [Pe, ot]) {
    for (const C of S) k.dirty.add(C);
    s(k) && (n.add(k.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(k) {
    const S = k.sources ?? (k.source_model && Number.isInteger(k.source_id) ? [{ model: k.source_model, id: k.source_id }] : []), C = k.link_types ?? (k.link_type ? [k.link_type] : []), N = C.length ? [Pe, ot].filter((I) => I === Pe ? C.some((G) => ["about", "edited"].includes(G)) : C.includes("sent_to")) : [Pe, ot];
    if (!N.length) return;
    const D = S.length ? [...new Set(S.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, uw);
    for (const I of D) m(I, N);
  }
  const b = (y = e.follow) == null ? void 0 : y.call(e, ["link.*"], p), $ = {
    attach(k, S) {
      let C = t.get(k);
      return C || (C = { id: k, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Pe, ot]), work: $l(), sent: $l() }, t.set(k, C)), C.views.add(S), C.dirty.size && m(C, [...C.dirty]), C;
    },
    shown(k) {
      k.dirty.size && m(k, [...k.dirty]);
    },
    detach(k, S) {
      k.views.delete(S), k.views.size || t.delete(k.id), t.size || (clearTimeout(a), b == null || b(), Xn.delete(e));
    },
    more(k, S) {
      const C = k == null ? void 0 : k[S];
      if (C != null && C.next.value && !C.loading.value) return u(k, S, C.next.value);
    }
  };
  return Xn.set(e, $), $;
}
function dw(e, t, n) {
  const a = lt(null);
  let s = null;
  const o = fe(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = cw(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const m = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((b) => {
      c.visible = b.some(($) => $.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = fe(n, (b) => {
      m == null || m.disconnect(), b && (m == null || m.observe(b));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), m == null || m.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return Aa(o), {
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Pe),
    loadSent: () => s == null ? void 0 : s.more(a.value, ot)
  };
}
const fw = ["data-incoming", "data-ref"], mw = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], hw = { class: "message-body" }, pw = ["title"], vw = ["innerHTML"], gw = ["innerHTML"], yw = {
  class: "message-faces",
  "data-message-faces": ""
}, bw = ["title", "data-face", "onClick"], kw = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, ww = ["title", "data-reaction", "onClick"], $w = {
  key: 0,
  class: "message-reaction-count"
}, xw = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Sw = ["href", "title"], Mw = ["src", "alt"], _w = ["href"], Cw = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Ew = { class: "message-foot" }, Aw = { class: "message-time" }, Ow = {
  class: "message-id",
  "data-message-id": ""
}, Tw = 1500, Iw = "An earlier message", Bw = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E(null), l = _(() => ["user", "comment"].includes(n.message.type)), i = _(() => {
      const [se, be] = (n.message.commented_row || ":").split(":"), z = ft(se);
      return z ? { ref: `${z}:${be}`, label: `${sn(z).title.toLowerCase()} ${be}` } : null;
    }), u = _(() => n.message.worker_id ?? null), c = _(() => nw(n.message)), f = _(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var se;
      await ((se = navigator.clipboard) == null ? void 0 : se.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Tw);
    }
    const p = Zi(), b = _(() => p(n.message.text ?? "")), $ = _(() => JSON.parse(n.message.flowchart_edges || "[]")), y = E(!1), k = _(() => Rs(n.quote)), S = _(() => p(k.value || Iw));
    function C() {
      const se = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      se ? se.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    iw(o, () => `${n.message.text} ${k.value}`);
    const N = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, D = (se) => `/api/files/message/${n.message.id}/${encodeURIComponent(se)}`, I = _(() => JSON.parse(n.message.captions || "{}")), G = _(() => (n.message.files ?? []).map((se) => ({ name: se, address: D(se), isImage: N.test(se), title: I.value[se] || se }))), F = _(() => fr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), B = Se(Le, null), { links: j, total: V, more: M, loading: g, failure: x, sentTo: T, sentMore: L, sentLoading: W, sentFailure: Y, loadMore: Z, loadSent: le } = dw(B, () => l.value && !n.message.local ? n.message.id : null, o), de = E(!1), $e = _(() => rw(n.message.reactions)), Ee = _(() => Number.isInteger(n.message.id)), ze = () => `${location.href.split("#")[0]}#open=messages:${n.message.id}`, pe = () => ({
      head: Sn(n.message.text ?? "", 40),
      items: [
        { label: "Reply", group: "open", disabled: !Ee.value, reason: "Not sent yet", run: () => a("reply", n.message) },
        { label: "React", group: "open", disabled: !Ee.value, reason: "Not sent yet", children: kl.map((se) => ({ label: se, run: () => a("react", n.message, se) })) },
        { label: "Copy text", group: "copy", run: ({ say: se }) => en(n.message.text ?? "", "the message", se) },
        { label: "Copy link", group: "copy", disabled: !Ee.value, reason: "Not sent yet", run: ({ say: se }) => en(ze(), "the link", se) },
        { label: "Pin to the top of the chat", disabled: !Ee.value || !B, reason: "Not sent yet", run: async ({ say: se }) => {
          const be = await B.run(["pin", "make", Sn(n.message.text ?? "", 60) || `Message ${n.message.id}`, "--link", `messages:${n.message.id}`]);
          se(be.ok ? "Pinned" : be.error);
        } }
      ]
    });
    function ie(se) {
      de.value = !1, a("react", n.message, se);
    }
    return (se, be) => e.message.peer || e.message.recipient ? ke((r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(Lk, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: be[0] || (be[0] = (z) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, fw)), [
      [O(Et), pe]
    ]) : ke((r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      h("div", hw, [
        h("div", {
          ref_key: "bubble",
          ref: o,
          class: K(["message-card", "md", { comment: i.value }]),
          onClick: be[5] || (be[5] = (...z) => O(Kt) && O(Kt)(...z))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: be[1] || (be[1] = ge((z) => O(Fe)(i.value.ref), ["stop"]))
          }, [
            A(ae, {
              name: "bubble",
              size: 12
            }),
            h("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, pw)) : w("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: ge(C, ["stop"]),
            innerHTML: S.value
          }, null, 8, vw)) : w("", !0),
          u.value !== null ? (r(), P($n, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: be[2] || (be[2] = ge((z) => O(Fe)(`agents:${u.value}`), ["stop"]))
          }, {
            default: q(() => [
              U("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : w("", !0),
          A(Gi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: q(() => [
              h("div", {
                "data-message-text": "",
                innerHTML: b.value
              }, null, 8, gw)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          $.value.length ? (r(), d(R, { key: 3 }, [
            h("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: be[3] || (be[3] = (z) => y.value = !0)
            }, "Open the flowchart"),
            y.value ? (r(), P(yk, {
              key: 0,
              title: e.message.text,
              edges: $.value,
              onClose: be[4] || (be[4] = (z) => y.value = !1)
            }, null, 8, ["title", "edges"])) : w("", !0)
          ], 64)) : w("", !0)
        ], 2),
        h("div", {
          class: K(["message-tools", { picking: de.value }]),
          "data-message-tools": ""
        }, [
          de.value ? (r(), d(R, { key: 0 }, [
            h("div", yw, [
              (r(!0), d(R, null, X(O(kl), (z) => (r(), d("button", {
                key: z,
                type: "button",
                class: "message-face",
                title: `React ${z}`,
                "data-face": z,
                onClick: (J) => ie(z)
              }, v(z), 9, bw))), 128))
            ]),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: be[6] || (be[6] = (z) => de.value = !1)
            }, [
              A(ae, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(R, { key: 1 }, [
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: be[7] || (be[7] = (z) => de.value = !0)
            }, "React"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: be[8] || (be[8] = (z) => a("reply", e.message))
            }, "Reply"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, v(s.value ? "Copied" : "Copy"), 1),
            f.value ? (r(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: be[9] || (be[9] = (z) => a("delete", e.message))
            }, "Delete")) : w("", !0)
          ], 64))
        ], 2)
      ]),
      $e.value.length ? (r(), d("div", kw, [
        (r(!0), d(R, null, X($e.value, (z) => (r(), d("button", {
          key: z.emoji,
          type: "button",
          class: K(["message-reaction", { mine: z.mine }]),
          title: z.title,
          "data-reaction": z.emoji,
          onClick: (J) => a("react", e.message, z.emoji)
        }, [
          U(v(z.emoji) + " ", 1),
          z.count > 1 ? (r(), d("span", $w, v(z.count), 1)) : w("", !0)
        ], 10, ww))), 128))
      ])) : w("", !0),
      G.value.length ? (r(), d("div", xw, [
        (r(!0), d(R, null, X(G.value, (z) => (r(), d(R, {
          key: z.name
        }, [
          z.isImage ? (r(), d("a", {
            key: 0,
            href: z.address,
            target: "_blank",
            class: "message-image",
            title: z.title
          }, [
            h("img", {
              src: z.address,
              alt: z.name,
              "data-figure-picture": ""
            }, null, 8, Mw)
          ], 8, Sw)) : (r(), d("a", {
            key: 1,
            href: z.address,
            target: "_blank",
            class: "message-file"
          }, v(z.name), 9, _w))
        ], 64))), 128))
      ])) : w("", !0),
      O(T).length ? (r(), d("div", Cw, [
        A(ae, {
          name: "send",
          size: 12
        }),
        (r(!0), d(R, null, X(O(T), (z) => (r(), P($n, {
          key: z.id,
          as: "button",
          "agent-id": z.id,
          label: `Worker ${z.id}`,
          class: "message-sent-worker",
          disabled: z.unavailable || !z.open_ref,
          "data-sent-worker": z.id,
          onClick: ge((J) => z.open_ref && O(Fe)(z.open_ref), ["stop"])
        }, {
          default: q(() => [
            U("Also sent to worker " + v(z.id), 1),
            z.unavailable ? (r(), d(R, { key: 0 }, [
              U(" (unavailable)")
            ], 64)) : w("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : w("", !0),
      A(In, {
        more: O(L),
        loading: O(W),
        failure: O(Y),
        label: "More recipients",
        onMore: O(le)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      h("div", Ew, [
        h("time", Aw, v(F.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(R, { key: 0 }, [
          be[10] || (be[10] = h("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          h("span", Ow, "message " + v(e.message.id), 1)
        ], 64)) : w("", !0),
        l.value ? (r(), P(Zk, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : w("", !0)
      ]),
      O(j).length || O(x) ? (r(), P(Kk, {
        key: 3,
        links: O(j),
        total: O(V),
        more: O(M),
        loading: O(g),
        failure: O(x),
        onMore: O(Z)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : w("", !0)
    ], 8, mw)), [
      [O(Et), pe]
    ]);
  }
}, wA = /* @__PURE__ */ H(Bw, [["__scopeId", "data-v-7241010f"]]), ya = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ss = 200, Tr = (e) => {
  var t;
  return ((t = ya.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ya[0].key;
}, $A = (e) => {
  var t;
  return ((t = ya.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Rw = ["aria-label"], Lw = 300, xl = 400, Nw = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ss } },
  setup(e) {
    const t = e, n = _(() => Tr(t.value)), a = _(() => n.value < ss ? [1, 0.25, 0.25] : n.value === ss ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: K(["ico", "prio", { hot: n.value >= xl, high: n.value >= Lw && n.value < xl }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      h("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ye({ opacity: a.value[0] })
      }, null, 4),
      h("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ye({ opacity: a.value[1] })
      }, null, 4),
      h("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ye({ opacity: a.value[2] })
      }, null, 4)
    ], 10, Rw));
  }
}, xA = /* @__PURE__ */ H(Nw, [["__scopeId", "data-v-b10e610f"]]), Ir = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], SA = (e) => {
  const t = Ir[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, qw = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Sl = (e) => qw[e.card.state] || "idle", Dw = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Ml = { working: 0, waiting: 1, idle: 2, stopped: 3 }, _l = (e, t) => Ml[Sl(e)] - Ml[Sl(t)], Cl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, MA = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => _l(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Dw(a, s)) : [...e].sort((a, s) => _l(a, s) || (Cl[t] || Cl.state)(a, s)), Pw = { class: "list-row" }, jw = {
  key: 0,
  class: "list-row-type"
}, Fw = { class: "list-row-main" }, Ww = {
  key: 0,
  class: "list-row-title"
}, Hw = { class: "list-row-body" }, zw = {
  key: 1,
  class: "list-row-end"
}, Uw = {
  key: 1,
  class: "list-row-line"
}, Vw = {
  key: 2,
  class: "list-row-text"
}, Gw = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Pw, [
      e.type ? (r(), d("span", jw, v(e.type), 1)) : w("", !0),
      h("div", Fw, [
        e.title ? (r(), d("span", Ww, v(e.title), 1)) : w("", !0),
        h("div", Hw, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", zw, [
          ne(t.$slots, "end", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      t.$slots.text ? (r(), d("div", Uw, [
        ne(t.$slots, "text", {}, void 0, !0)
      ])) : e.text ? (r(), d("span", Vw, v(e.text), 1)) : w("", !0)
    ]));
  }
}, Kw = /* @__PURE__ */ H(Gw, [["__scopeId", "data-v-f1b2d4cf"]]), _A = {
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
    return (l, i) => (r(), P(io, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Yw = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: K(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, js = /* @__PURE__ */ H(Yw, [["__scopeId", "data-v-978e0921"]]), Qw = ["aria-label"], Xw = { class: "head" }, Jw = { class: "names" }, Zw = { class: "body" }, e2 = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ni(a, n), i = qi(s);
    return (u, c) => (r(), P(Tn, { to: "body" }, [
      A(an, {
        name: "side",
        appear: "",
        onAfterLeave: O(l)
      }, {
        default: q(() => [
          O(s) ? (r(), d("div", {
            key: 0,
            class: K(["veil", { over: e.over, under: e.depth }]),
            style: ye({ "--depth": e.depth, zIndex: O(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = ge((...f) => O(o) && O(o)(...f), ["self"]))
          }, [
            h("aside", {
              class: K(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(R, { key: 0 }, [
                h("header", Xw, [
                  h("div", Jw, [
                    h("h2", null, v(e.title), 1),
                    e.abstract ? (r(), P(ct, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : w("", !0),
                    ne(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ne(u.$slots, "actions", {}, void 0, !0),
                  A(Ia, {
                    title: e.closeLabel,
                    onClick: O(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), P(js, { key: 0 }, {
                  default: q(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : w("", !0),
                h("div", Zw, [
                  ne(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), P(js, {
                  key: 1,
                  class: "below"
                }, {
                  default: q(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : w("", !0)
              ], 64)) : ne(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, Qw)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, CA = /* @__PURE__ */ H(e2, [["__scopeId", "data-v-d0a677ef"]]), t2 = {
  key: 1,
  class: "text-field-label"
}, n2 = {
  key: 2,
  class: "text-field-end"
}, a2 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ ht({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Dt(e, "modelValue"), a = Ca(), s = "onUpdate:modelValue" in (((f = Ku()) == null ? void 0 : f.vnode.props) || {}), o = _(() => s ? n.value : a.value), l = (m) => s && (n.value = m.target.value), i = _(
      () => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), u = _(() => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "value"))), c = E(null);
    return t({ focus: () => c.value && c.value.focus() }), (m, p) => e.label || e.icon || m.$slots.end ? (r(), d("label", {
      key: 0,
      class: K(["text-field", { large: e.large, ended: m.$slots.end }, O(a).class]),
      style: ye(O(a).style)
    }, [
      e.icon ? (r(), P(ae, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : w("", !0),
      e.label ? (r(), d("span", t2, v(e.label), 1)) : w("", !0),
      ke(h("input", De({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [O(Ts), o.value]
      ]),
      m.$slots.end ? (r(), d("span", n2, [
        ne(m.$slots, "end", {}, void 0, !0)
      ])) : w("", !0)
    ], 6)) : ke((r(), d("input", De({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [O(Ts), o.value]
    ]);
  }
}), s2 = /* @__PURE__ */ H(a2, [["__scopeId", "data-v-d9c38ca8"]]), o2 = {
  class: "page-header",
  "data-page-header": ""
}, l2 = { class: "page-title" }, i2 = {
  key: 0,
  class: "page-count",
  "data-page-count": ""
}, r2 = { class: "page-header-end" }, u2 = {
  __name: "PageHeader",
  props: { title: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("header", o2, [
      h("h1", l2, [
        U(v(e.title), 1),
        e.count !== null ? (r(), d("span", i2, v(e.count), 1)) : w("", !0)
      ]),
      h("span", r2, [
        ne(t.$slots, "primary", {}, void 0, !0),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, c2 = /* @__PURE__ */ H(u2, [["__scopeId", "data-v-923fbadc"]]);
function Br(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
function EA(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const AA = () => ({}), ba = (e) => Object.fromEntries(e.filter((t) => {
  var n;
  return (n = t.default) == null ? void 0 : n.length;
}).map((t) => [t.key, { not: !1, values: [...t.default] }])), Rr = (e, t) => {
  const n = (t == null ? void 0 : t.values) ?? [], a = e.default ?? [];
  return !(t != null && t.not) && n.length === a.length && a.every((s) => n.includes(s));
}, Lr = (e) => !!(e != null && e.values.length), OA = (e, t, n = (a) => a) => [...new Set(e.flatMap((a) => [].concat(t(a))).filter((a) => a != null && a !== ""))].map((a) => [a, n(a)]), d2 = (e, t, n) => t.filter((a) => [].concat(e.get(a)).includes(n)).length;
function Nr(e, t, n, a = "", s = []) {
  return e.filter((o) => t.every((l) => f2(o, l, n[l.key])) && (!a.trim() || Br(o, a, s)));
}
function f2(e, t, n) {
  if (!Lr(n)) return !0;
  const a = [].concat(t.get(e)), s = n.values.some((o) => a.includes(o));
  return n.not ? !s : s;
}
const m2 = { class: "filter-ways" }, h2 = { class: "filter-count" }, p2 = {
  __name: "FilterChoices",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = [
      { key: "is", label: "is" },
      { key: "not", label: "is not" }
    ], o = () => n.modelValue ?? { not: !1, values: [] }, l = (c) => a("update:modelValue", c.values.length ? c : null), i = (c) => l({ ...o(), not: c === "not" }), u = (c) => l({ ...o(), values: o().values.includes(c) ? o().values.filter((f) => f !== c) : [...o().values, c] });
    return (c, f) => (r(), d(R, null, [
      h("div", m2, [
        A(_t, {
          options: s,
          value: o().not ? "not" : "is",
          onPick: i
        }, null, 8, ["value"])
      ]),
      (r(!0), d(R, null, X(e.field.options, ([m, p]) => (r(), P(He, {
        key: m,
        checked: o().values.includes(m),
        "data-filter-option": m,
        onClick: (b) => u(m)
      }, {
        default: q(() => [
          U(v(p) + " ", 1),
          h("span", h2, v(O(d2)(e.field, e.rows, m)), 1)
        ]),
        _: 2
      }, 1032, ["checked", "data-filter-option", "onClick"]))), 128))
    ], 64));
  }
}, qr = /* @__PURE__ */ H(p2, [["__scopeId", "data-v-4e84eb6e"]]), v2 = ["data-filter-chip"], g2 = ["aria-expanded"], y2 = {
  key: 0,
  "data-filter-value": ""
}, b2 = ["aria-label"], k2 = {
  __name: "FilterChip",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = _(() => Lr(n.modelValue)), l = _(() => !Rr(n.field, n.modelValue)), i = _(() => n.modelValue.values.map((f) => {
      var m;
      return ((m = n.field.options.find(([p]) => p === f)) == null ? void 0 : m[1]) ?? f;
    }).join(", ")), u = () => {
      var f;
      return a("update:modelValue", (f = n.field.default) != null && f.length ? { not: !1, values: [...n.field.default] } : null);
    }, c = (f) => s.value = s.value ? null : f.currentTarget;
    return (f, m) => (r(), d("span", {
      class: K(["filter-chip", { on: o.value }]),
      "data-filter-chip": e.field.key
    }, [
      h("button", {
        type: "button",
        class: "filter-chip-main",
        "aria-haspopup": "menu",
        "aria-expanded": !!s.value,
        onClick: c
      }, [
        h("span", null, v(e.field.label), 1),
        o.value ? (r(), d("b", y2, v(e.modelValue.not ? "is not " : ": ") + v(i.value), 1)) : w("", !0),
        A(ae, {
          name: "caret",
          size: 10
        })
      ], 8, g2),
      o.value && l.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "filter-chip-clear",
        "data-filter-clear": "",
        "aria-label": `Clear ${e.field.label}`,
        onClick: u
      }, [
        A(ae, {
          name: "close",
          size: 9
        })
      ], 8, b2)) : w("", !0),
      s.value ? (r(), P(Wt, {
        key: 1,
        anchor: s.value,
        align: "start",
        "min-width": 240,
        "max-width": 320,
        onClick: m[1] || (m[1] = ge(() => {
        }, ["stop"])),
        onClose: m[2] || (m[2] = (p) => s.value = null)
      }, {
        default: q(() => [
          A(qr, {
            field: e.field,
            rows: e.rows,
            "model-value": e.modelValue,
            "onUpdate:modelValue": m[0] || (m[0] = (p) => a("update:modelValue", p))
          }, null, 8, ["field", "rows", "model-value"])
        ]),
        _: 1
      }, 8, ["anchor"])) : w("", !0)
    ], 10, v2));
  }
}, w2 = /* @__PURE__ */ H(k2, [["__scopeId", "data-v-0cc7efe6"]]), $2 = {
  class: "search-bar",
  "data-search-bar": ""
}, x2 = { class: "search-bar-control" }, S2 = ["value", "placeholder", "aria-label"], M2 = ["aria-expanded"], _2 = {
  key: 0,
  "data-menu-count": ""
}, C2 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var S;
    const a = e, s = n, o = Yu(), l = ((S = Se(Le, null)) == null ? void 0 : S.search) ?? {}, i = _(() => l.placeholder || a.placeholder), u = l.context ?? [], c = E(null), f = E(null), m = E([]), p = _(() => m.value.length ? m.value[m.value.length - 1].next : u), b = _(() => !!o.menu || u.length > 0), $ = (C) => {
      m.value = [], f.value = f.value ? null : C.currentTarget;
    };
    function y(C) {
      if (C.next.length) {
        m.value = [...m.value, C];
        return;
      }
      f.value = null, s("pick", C.click);
    }
    function k() {
      var C;
      s("update:modelValue", ""), (C = c.value) == null || C.focus();
    }
    return t({ focus: () => {
      var C;
      return (C = c.value) == null ? void 0 : C.focus();
    } }), (C, N) => {
      var D;
      return r(), d("div", $2, [
        h("div", x2, [
          A(ae, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          h("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: N[0] || (N[0] = (I) => s("update:modelValue", I.target.value)),
            onKeydown: Ve(k, ["esc"])
          }, null, 40, S2),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: k
          }, [
            A(ae, {
              name: "close",
              size: 12
            })
          ])) : w("", !0),
          b.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: $
          }, [
            e.menuCount ? (r(), d("span", _2, v(e.menuCount), 1)) : w("", !0),
            A(ae, {
              name: "caret",
              size: 12
            })
          ], 8, M2)) : w("", !0)
        ]),
        (D = O(l).button) != null && D.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: N[1] || (N[1] = (I) => s("pick", O(l).button.click))
        }, v(O(l).button.title), 1)) : w("", !0),
        ne(C.$slots, "default", {}, void 0, !0),
        f.value ? (r(), P(Wt, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: N[3] || (N[3] = ge(() => {
          }, ["stop"])),
          onClose: N[4] || (N[4] = (I) => f.value = null)
        }, {
          default: q(() => [
            m.value.length ? (r(), P(He, {
              key: 0,
              "data-search-back": "",
              onClick: N[2] || (N[2] = (I) => m.value = m.value.slice(0, -1))
            }, {
              default: q(() => [
                U("‹ " + v(m.value[m.value.length - 1].title), 1)
              ]),
              _: 1
            })) : w("", !0),
            (r(!0), d(R, null, X(p.value, (I) => (r(), P(He, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (G) => y(I)
            }, {
              default: q(() => [
                U(v(I.title) + v(I.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            m.value.length ? w("", !0) : ne(C.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : w("", !0)
      ]);
    };
  }
}, Dr = /* @__PURE__ */ H(C2, [["__scopeId", "data-v-45374bed"]]), E2 = ["aria-expanded"], A2 = {
  key: 0,
  class: "filter-count",
  "data-filter-count": ""
}, O2 = 72, T2 = {
  __name: "FilterBar",
  props: {
    fields: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    modelValue: { type: Object, required: !0 },
    words: { type: String, default: "" },
    shown: { type: Number, default: null },
    placeholder: { type: String, default: "Search" }
  },
  emits: ["update:modelValue", "update:words"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(null), l = E([]), i = _(() => n.fields.filter((b) => l.value.includes(b.key))), u = _(() => n.fields.some((b) => !Rr(b, n.modelValue[b.key])) || !!n.words.trim()), c = (b, $) => a("update:modelValue", { ...n.modelValue, [b]: $ }), f = () => {
      a("update:modelValue", ba(n.fields)), a("update:words", "");
    };
    async function m() {
      if (!s.value) return;
      l.value = [], await Ne();
      const b = s.value.clientWidth;
      b && (l.value = [...s.value.querySelectorAll("[data-filter-chip]")].filter(($) => $.offsetLeft + $.offsetWidth > b - O2).map(($) => $.dataset.filterChip));
    }
    let p = null;
    return Ce(() => {
      m(), p = new ResizeObserver(m), p.observe(s.value);
    }), Be(() => p == null ? void 0 : p.disconnect()), fe(() => [n.fields.length, n.modelValue], () => m(), { flush: "post" }), (b, $) => (r(), P(Dr, {
      "model-value": e.words,
      class: "filter-bar",
      placeholder: e.placeholder,
      "data-filter-bar": "",
      "onUpdate:modelValue": $[3] || ($[3] = (y) => a("update:words", y))
    }, {
      default: q(() => [
        h("div", {
          ref_key: "chips",
          ref: s,
          class: "filter-chips"
        }, [
          (r(!0), d(R, null, X(e.fields, (y) => ke((r(), P(w2, {
            key: y.key,
            field: y,
            rows: e.rows,
            "model-value": e.modelValue[y.key] ?? null,
            "onUpdate:modelValue": (k) => c(y.key, k)
          }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])), [
            [no, !l.value.includes(y.key)]
          ])), 128))
        ], 512),
        i.value.length ? (r(), d(R, { key: 0 }, [
          h("button", {
            type: "button",
            class: "filter-more",
            "data-filter-more": "",
            "aria-haspopup": "menu",
            "aria-expanded": !!o.value,
            onClick: $[0] || ($[0] = (y) => o.value = o.value ? null : y.currentTarget)
          }, "More", 8, E2),
          o.value ? (r(), P(Wt, {
            key: 0,
            anchor: o.value,
            align: "end",
            "min-width": 240,
            "max-width": 320,
            onClick: $[1] || ($[1] = ge(() => {
            }, ["stop"])),
            onClose: $[2] || ($[2] = (y) => o.value = null)
          }, {
            default: q(() => [
              (r(!0), d(R, null, X(i.value, (y) => (r(), d(R, {
                key: y.key
              }, [
                A(xt, null, {
                  default: q(() => [
                    U(v(y.label), 1)
                  ]),
                  _: 2
                }, 1024),
                A(qr, {
                  field: y,
                  rows: e.rows,
                  "model-value": e.modelValue[y.key] ?? null,
                  "onUpdate:modelValue": (k) => c(y.key, k)
                }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])
              ], 64))), 128))
            ]),
            _: 1
          }, 8, ["anchor"])) : w("", !0)
        ], 64)) : w("", !0),
        u.value ? (r(), d(R, { key: 1 }, [
          e.shown !== null ? (r(), d("span", A2, v(e.shown) + " of " + v(e.rows.length), 1)) : w("", !0),
          h("button", {
            type: "button",
            class: "filter-clear",
            "data-filter-clear-all": "",
            onClick: f
          }, "Clear")
        ], 64)) : w("", !0)
      ]),
      _: 1
    }, 8, ["model-value", "placeholder"]));
  }
}, Pr = /* @__PURE__ */ H(T2, [["__scopeId", "data-v-c20a74ef"]]), I2 = { class: "title" }, B2 = { class: "state" }, R2 = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ms(t.line, t.events);
    return (o, l) => (r(), P(Db, {
      rows: O(n),
      failure: O(a),
      loaded: O(s),
      empty: e.empty
    }, {
      default: q(({ row: i }) => [
        h("span", I2, v(i.title), 1),
        h("span", B2, v(O(kn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, TA = /* @__PURE__ */ H(R2, [["__scopeId", "data-v-6be0c59e"]]);
function L2(e = 1e3, t = null) {
  const n = E(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? fe(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const os = E(Date.now() / 1e3);
let El = 0, Jn = 0;
function Co() {
  return Jn || (os.value = Date.now() / 1e3, El = setInterval(() => os.value = Date.now() / 1e3, 1e3)), Jn += 1, ii() && Aa(() => {
    Jn -= 1, Jn || clearInterval(El);
  }), os;
}
const N2 = 200, q2 = Er + la + Ar + N2, D2 = 300, Zn = /* @__PURE__ */ new WeakMap();
function P2(e, t) {
  const n = Zn.get(e) ?? [];
  Zn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Zn.get(e);
    Zn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, D2);
}
function un(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function j2(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: un(e),
    top: un(e.querySelector(".top")),
    title: un(e.querySelector(".title")),
    contents: un(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: un(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function F2(e, t, n, a) {
  fe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(j2(o, l, n.value)), performance.now() - l < q2) return void requestAnimationFrame(u);
        P2(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const W2 = ["title", "data-figure-mark", "data-folded", "data-open"], H2 = {
  key: 2,
  class: "worker"
}, z2 = { class: "head" }, U2 = { key: 0 }, V2 = {
  key: 3,
  class: "status"
}, G2 = {
  key: 0,
  class: "figure"
}, K2 = {
  key: 1,
  class: "ran-for"
}, Y2 = { key: 2 }, Q2 = {
  key: 3,
  class: "news"
}, X2 = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, J2 = {
  key: 6,
  class: "settled"
}, Z2 = {
  key: 1,
  class: "bar"
}, e$ = {
  key: 3,
  class: "detail body"
}, t$ = {
  key: 0,
  class: "body-label"
}, n$ = ["title"], a$ = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Ca(), a = ["onClick", "onAct"], s = _(() => Object.fromEntries(Object.entries(n).filter(([de]) => !a.includes(de)))), o = E(!1), l = _(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = _(() => t.open !== void 0), u = _(() => i.value || l.value), c = _(() => i.value ? t.open : o.value), f = _(() => i.value ? !t.open : l.value && !o.value), m = _(() => !!(t.mark.action && n.onAct)), p = _(() => u.value || m.value || !!n.onClick), b = E(null), $ = E(null), { folded: y, phase: k } = Or(b, () => f.value);
    F2(b, f, k, Se(Le, null));
    function S(de) {
      var $e, Ee;
      if (!(de.target !== b.value && !$.value.contains(de.target))) {
        if (i.value) return ($e = n.onClick) == null ? void 0 : $e.call(n, de);
        if (l.value) return void (o.value = !o.value);
        (Ee = n.onAct || n.onClick) == null || Ee(de);
      }
    }
    const C = (de) => n.onAct(de), N = ["failed", "unfinished"], D = _(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? N.includes(t.mark.state) ? "danger" : "good" : ""), I = _(() => t.mark.color ? t.mark.color : D.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : D.value ? `var(--tone-${D.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), G = _(() => I.value || "var(--tone-work)"), F = _(() => !t.mark.ending && !t.mark.ended && D.value !== "stopped"), B = Co(), j = _(
      () => t.mark.began_at && F.value && !t.mark.figure && !t.mark.counting ? mr(B.value - t.mark.began_at) : ""
    ), V = _(() => {
      const { started: de, ended: $e } = t.mark;
      return de ? $e ? `ran ${Zt($e - de, !0)}` : Zt(B.value - de, !0) : j.value;
    }), M = ["bad", "danger", "warn"], g = _(() => M.includes(D.value) || t.mark.asks ? "attention" : F.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), x = ["bad", "danger"], T = _(() => x.includes(D.value)), L = _(() => g.value === "process" ? "running" : T.value ? "cross" : D.value === "stopped" ? "stopped" : D.value === "good" ? "tick" : ""), W = _(
      () => !!(t.mark.figure || V.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), Y = _(() => t.mark.markIcon ? { component: At, props: { class: "ico", name: t.mark.markIcon } } : { component: ae, props: { name: t.mark.icon || "dot" } }), Z = _(() => [t.mark.title, t.mark.time ? fr(t.mark.time) : ""].filter(Boolean).join(" · ")), le = _(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (de, $e) => (r(), d("div", De(s.value, {
      ref_key: "root",
      ref: b,
      class: [
        "mark",
        `w-${g.value}`,
        O(k),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: I.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: le.value,
      title: Z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": O(y) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: S
    }), [
      (r(), P(Ze(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: $,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: q(() => [
          e.mark.agentId ? (r(), P($n, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: q(() => [
              (r(), P(Ze(Y.value.component), kt(ri(Y.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), P(Ze(Y.value.component), kt(De({ key: 1 }, Y.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", H2, v(e.mark.worker), 1)) : w("", !0),
          h("span", z2, [
            A(ct, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", U2, v(e.mark.name), 1)) : w("", !0),
            u.value ? (r(), P(ln, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : w("", !0)
          ]),
          W.value ? (r(), d("span", V2, [
            e.mark.figure ? (r(), d("span", G2, v(e.mark.figure), 1)) : w("", !0),
            V.value ? (r(), d("span", K2, v(V.value), 1)) : w("", !0),
            e.mark.stopping ? (r(), d("span", Y2, "Stopping")) : w("", !0),
            e.mark.news ? (r(), d("span", Q2, v(e.mark.news), 1)) : w("", !0),
            L.value === "running" ? (r(), d("span", X2)) : L.value ? (r(), P(At, {
              key: 5,
              class: K(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : w("", !0),
            e.mark.settled ? (r(), d("span", J2, v(e.mark.settled), 1)) : w("", !0)
          ])) : w("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (r(), P(Cr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: ge(C, ["stop"])
      }, null, 8, ["label", "open"])) : w("", !0),
      (e.mark.figure || e.mark.counting) && F.value ? (r(), d("span", Z2, [
        h("span", {
          class: "progress",
          style: ye({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: G.value })
        }, null, 4)
      ])) : w("", !0),
      e.mark.detail && !O(y) ? (r(), P(ct, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      e.mark.body && !O(y) ? (r(), d("div", e$, [
        e.mark.bodyLabel ? (r(), d("p", t$, v(e.mark.bodyLabel), 1)) : w("", !0),
        A(ct, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : w("", !0),
      e.mark.command && !O(y) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, n$)) : w("", !0),
      e.mark.card ? (r(), P(ct, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      ne(de.$slots, "default", {
        shown: !O(y)
      }, void 0, !0)
    ], 16, W2));
  }
}), jr = /* @__PURE__ */ H(a$, [["__scopeId", "data-v-6e839007"]]), s$ = 8, o$ = 40, l$ = [];
class Eo {
  constructor(t, n, { top: a = s$, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && l$.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new Eo(t, {
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
    n > o$ && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await Ne(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await Ne();
  }
}
const i$ = 60, r$ = 300, Fr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Wr(e, t) {
  const n = E([]), a = E(0);
  let s = -1, o = 0;
  async function l() {
    const m = await e(["output", "page", String(t())]);
    return m.ok && (n.value = m.value.lines, a.value = m.value.first_byte, s = m.value.last_byte, o = m.value.cut_bytes), m;
  }
  async function i() {
    if (s < 0) return l();
    const m = await e(["output", "page", String(t()), "--after", String(s)]);
    return m.ok ? m.value.cut_bytes !== o || m.value.total < s ? l() : (m.value.lines.length && (n.value = [...n.value, ...m.value.lines]), s = m.value.last_byte, m) : m;
  }
  async function u() {
    const m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return m.ok ? (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, !0) : !1;
  }
  const c = new Eo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => r$, more: () => a.value > 0, previous: u }, { top: i$ });
  return { lines: n, newest: l, follow: i, loadEarlier: (m) => c.reachTop(m), feed: c };
}
const u$ = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Hr(e) {
  var n;
  const t = u$[e] || ((n = sn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const c$ = (e) => Hr(String(e).split(":")[0]), d$ = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), f$ = "agents", m$ = { passed: "good", failed: "danger", warned: "warn", running: "" }, h$ = { good: "good", warn: "warn", danger: "danger" }, Al = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Gm(e.target_model, e.target_id || 0)
}, p$ = { "open row": (e) => c$(e.target_model), "open page": () => Hr("pages") };
function v$(e, t) {
  const n = t || {}, a = Al[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? m$[e.outcome] || "" : h$[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === f$ ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? p$[a](e) : "",
    handlers: a ? { onAct: () => Al[a](e) } : {}
  };
}
const g$ = 24, y$ = 1e3, Ol = 2e3, b$ = 0.25, k$ = 5e3;
function w$(e, t = g$, n = () => !0) {
  const a = E(!1), s = E(0), o = E(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const D = c();
    return D ? D.scrollHeight - D.scrollTop - D.clientHeight : 0;
  }, m = () => !c() || f() <= t;
  function p(D) {
    if (clearTimeout(l), !D) {
      o.value = !1, u = Date.now();
      return;
    }
    const I = Date.now() - u < Ol ? Ol : y$;
    l = setTimeout(() => o.value = a.value, I);
  }
  function b() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function $(D = !1) {
    const I = c();
    I && D && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), b();
  }
  function y() {
    S(), !a.value && (a.value = !0, p(!0));
  }
  const k = () => !!c() && f() <= c().clientHeight * b$;
  function S() {
    clearTimeout(i), k() && (i = setTimeout(() => a.value && k() && n() && $(!0), k$));
  }
  function C() {
    m() ? b() : y();
  }
  function N(D = 1, I = !1) {
    a.value ? s.value += Math.max(0, D) : $(I);
  }
  return ii() && Aa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: m, follow: b, toBottom: $, left: y, scrolled: C, arrived: N };
}
const $$ = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, x$ = (e) => String(e ?? "").replace($$, ""), S$ = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), { away: o, scrolled: l, arrived: i, toBottom: u } = w$(s);
    fe(
      () => [n.lines, n.lines.length],
      () => Ne(() => {
        var f;
        i(), s.value && ((f = n.feed) == null || f.drawn(s.value));
      }),
      { immediate: !0 }
    );
    function c(f) {
      l(), a("older", f.target);
    }
    return (f, m) => (r(), d("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      U(v(O(x$)(e.lines.join(`
`)) || e.empty), 1),
      O(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (p) => O(u)(!0))
      }, "Follow")) : w("", !0)
    ], 544));
  }
}, M$ = /* @__PURE__ */ H(S$, [["__scopeId", "data-v-89621acd"]]), _$ = "*.*", C$ = {
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
    const t = e, n = Se(Le, null), a = new bi();
    fe(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const m = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (b) => a.dispatch(b));
        f(() => m == null ? void 0 : m());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = _(() => !!(t.declaration.shipped || t.declaration.trusted)), i = _(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the user trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [_$] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), P(xr, {
      key: 0,
      entry: i.value,
      subscriptions: O(a),
      environment: O(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), P($r, {
      key: 1,
      entry: i.value,
      subscriptions: O(a),
      environment: O(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, E$ = { class: "mark-more-inner" }, A$ = {
  class: "mark-lines",
  "data-mark-reason": ""
}, O$ = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, T$ = {
  key: 3,
  class: "mark-lines"
}, I$ = "process", Tl = "task", B$ = {
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
    ), s = _(() => d$.has(t.mark.variant) && t.mark.detail || ""), o = _(() => t.mark.target_model === Tl ? t.mark.target_id : 0), l = Wr(
      Fr(n),
      () => t.mark.target_id
    ), i = l.lines, u = E(!1), c = E(""), f = _(() => !t.declaration.body_url && t.mark.target_model === I$ && !!t.mark.target_id);
    async function m(b = l.follow) {
      const $ = await b();
      u.value = !0, c.value = $.ok ? "" : $.error;
    }
    const p = _(() => t.shown && f.value);
    return fe(p, (b) => b && m()), so(() => p.value && m(), () => p.value && !t.mark.ended_at), fe(
      () => t.mark.ended_at,
      (b) => b && p.value && m(l.newest)
    ), (b, $) => (r(), d("div", {
      class: K(["mark-more", { open: e.shown }]),
      onClick: $[1] || ($[1] = ge(() => {
      }, ["stop"]))
    }, [
      h("div", E$, [
        e.declaration.body_url ? (r(), P(C$, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(R, { key: 1 }, [
          s.value ? (r(), d(R, { key: 0 }, [
            $[2] || ($[2] = h("p", { class: "mark-label" }, "Why it stopped", -1)),
            h("p", A$, v(s.value), 1)
          ], 64)) : w("", !0),
          f.value && c.value ? (r(), d("p", O$, v(c.value), 1)) : f.value && u.value ? (r(), d(R, { key: 2 }, [
            $[3] || ($[3] = h("p", { class: "mark-label" }, "Output", -1)),
            A(M$, {
              class: "mark-terminal",
              lines: O(i),
              feed: O(l).feed,
              onOlder: O(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", T$, v(a.value.join(`
`)), 1)) : w("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: $[0] || ($[0] = ge((y) => O(Fe)(`${Tl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : w("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Fs = /* @__PURE__ */ H(B$, [["__scopeId", "data-v-df71b15a"]]), R$ = ["title", "aria-label", "onClick"], L$ = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, N$ = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = _(() => bm(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = E(""), s = Se(Le);
    async function o(l) {
      const i = await Rn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(R, null, [
      (r(!0), d(R, null, X(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: ge((c) => o(u), ["stop"])
      }, [
        A(At, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, R$))), 128)),
      a.value ? (r(), d("span", L$, v(a.value), 1)) : w("", !0)
    ], 64));
  }
}, q$ = /* @__PURE__ */ H(N$, [["__scopeId", "data-v-7a62c88e"]]);
function zr(e, t) {
  const n = lt(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Oe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Ur = zr("/api/marks", "marks"), IA = Ur.fetchAll, D$ = Ur.find, P$ = ["data-ref"], j$ = ["data-ref"], F$ = { class: "mark-row" }, W$ = "dock add", H$ = "questions.answer", z$ = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = _(() => D$(a.mark.type)), o = _(() => v$(a.mark, s.value)), l = _(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = _(() => l.value || !!o.value.handlers.onAct), u = _(() => a.mark.type === H$), c = E(!1);
    function f() {
      c.value = !c.value;
    }
    const m = _(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((b) => {
        var $;
        return !a.docked || !(($ = b.runs) != null && $.startsWith(W$));
      }).map((b) => ({ ...b, module: s.value.module }));
    });
    return (p, b) => {
      var $, y;
      return ($ = s.value) != null && $.card ? (r(), d("div", {
        key: 0,
        class: K(["thread-turn", "card", "whole-card", { "user-side": O(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(Fs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, P$)) : (r(), d("div", {
        key: 1,
        class: K(["thread-turn", "card", { "full-width": (y = s.value) == null ? void 0 : y.full_width, docked: e.docked, "user-side": O(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        h("span", F$, [
          A(jr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Ea({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: q(({ shown: k }) => [
                A(Fs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: k
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A(q$, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, j$));
    };
  }
}, U$ = /* @__PURE__ */ H(z$, [["__scopeId", "data-v-424ddb61"]]), V$ = ["data-ref"], G$ = ["inert"], K$ = { class: "group-fold" }, Y$ = { class: "thread-group" }, Q$ = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = E(!1), a = E(!1), s = E(!1), o = E(null);
    fe(n, async (i) => {
      var u;
      a.value = !0, await Ne(), (u = o.value) == null || u.offsetHeight, s.value = i;
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
      A(jr, {
        mark: l.value,
        open: n.value,
        onClick: u[0] || (u[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (r(), d("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: K(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        h("div", K$, [
          h("div", Y$, [
            (r(!0), d(R, null, X(e.group.marks, (c) => (r(), P(U$, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, G$)) : w("", !0)
    ], 8, V$));
  }
}, BA = /* @__PURE__ */ H(Q$, [["__scopeId", "data-v-45b58b9b"]]);
function X$(e) {
  const t = E(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ce(() => n.observe(e.value)), tt(() => n.disconnect()), t;
}
const J$ = { class: "chat-dock-fold" }, Z$ = ["aria-label"], e5 = { class: "chat-dock-head" }, t5 = { class: "chat-dock-inner" }, n5 = { class: "chat-dock-foot" }, Vr = 700, a5 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = E(null), a = E(null), s = X$(a), o = E(!1);
    let l = 0;
    return Ce(() => l = setTimeout(() => o.value = !0, Vr)), tt(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: K(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      h("div", J$, [
        h("section", {
          ref_key: "card",
          ref: n,
          class: K(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ne(i.$slots, "edge", {}, void 0, !0),
          h("header", e5, [
            ne(i.$slots, "head", {}, void 0, !0)
          ]),
          h("div", {
            class: K(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            h("div", t5, [
              h("div", {
                class: K(["chat-dock-grow", { settled: o.value }]),
                style: ye(O(s) === null ? null : { height: `${O(s)}px` })
              }, [
                h("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ne(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ne(i.$slots, "still", {}, void 0, !0),
          h("footer", n5, [
            ne(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Z$)
      ])
    ], 2));
  }
}, s5 = /* @__PURE__ */ H(a5, [["__scopeId", "data-v-cc05fdac"]]), o5 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ls = 5, l5 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ls, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ls}s`, animationDelay: `${(n - ls).toFixed(2)}s` };
    return (s, o) => (r(), d("span", o5, [
      h("i", { style: a })
    ]));
  }
}, i5 = /* @__PURE__ */ H(l5, [["__scopeId", "data-v-2a7bc150"]]), r5 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Ws = (e) => e.charAt(0).toUpperCase() + e.slice(1), u5 = (e) => Ws(e.replace(/_at$/, "").replaceAll("_", " ")), c5 = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, d5 = (e, t, n) => [Ws(`${e} ${n}`), (t == null ? void 0 : t.state) && Ws(t.state)].filter(Boolean).join(" · "), Gr = (e) => Jt(e).text, f5 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? Gr(t) : (e == null ? void 0 : e.name) ?? "", m5 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? Gr(t) : "", h5 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !r5.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: u5(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], p5 = { reviewing: "Under review" }, v5 = (e, t) => e || p5[t == null ? void 0 : t.state] || "", Kr = zr("/api/docks", "docks"), RA = Kr.fetchAll, Gt = Kr.find, g5 = 6, is = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Ao = (e) => Date.parse(e.leaves_at) / 1e3, dn = (e) => !!(e.leaves_at && !e.kept), y5 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!dn(e) || t < Ao(e) || n.has(e.id)), b5 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => y5(a, t, n)).sort((a, s) => a.id - s.id);
function k5(e, t, n = g5) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Ao(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const w5 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Hs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), $5 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), x5 = (e) => ({ ...e.kept ? Hs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Hs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), S5 = ["keep", "unkeep", "open", "undock"], M5 = (e) => ({ ...e, iconOnly: S5.includes(e.action) });
function _5(e, t) {
  var n;
  return [
    ...$5(e, t) ? [x5(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || sn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Hs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(M5);
}
function Yr(e, t) {
  const n = _5(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: w5(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const C5 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || Yr(e, t).title, E5 = { class: "dock-text" }, A5 = ["title"], O5 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, T5 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, I5 = {
  key: 1,
  "data-dock-row": ""
}, B5 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = _(() => Gt(a.item.type)), o = Co(), l = _(() => on(a.item.created_at, o.value * 1e3)), i = E(null), u = E(null), c = E(null), f = E(null), m = _(() => Yr(a.item, s.value)), p = at(), b = _(() => `dock.${a.item.id}`), $ = _(() => p.props[b.value].data.value), y = _(() => C5(a.item, s.value, $.value)), k = _(() => va(a.item.target_model ?? "")), S = _(() => {
      var g;
      return ((g = s.value) == null ? void 0 : g.word) ?? "";
    }), C = _(() => ({ ...$.value, id: a.item.target_id, term: k.value })), N = () => {
      var g, x;
      return ((x = (g = s.value) == null ? void 0 : g.reads) == null ? void 0 : x.length) && p.reload(b.value);
    };
    gd(eo, { data: $, reload: N, readOutput: Fr(p) }), fe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (g, x, T) => {
        var W;
        N();
        const L = (W = p.followUndeclared) == null ? void 0 : W.call(p, [`${k.value.replaceAll("-", "_")}.*`], (Y) => {
          (!Y.row_id || Y.row_id === a.item.target_id) && N();
        });
        T(() => L == null ? void 0 : L());
      },
      { immediate: !0 }
    );
    const D = E(/* @__PURE__ */ new Set()), I = E("");
    async function G(g) {
      if (g.action === "undock") return n("undock", g);
      if (g.action === "open") return Fe(`${a.item.target_model}:${a.item.target_id}`);
      g.action === "declared" && (D.value = /* @__PURE__ */ new Set([...D.value, g.label])), I.value = "";
      const T = await Rn(g, { id: a.item.target_id }, p.environment);
      (T == null ? void 0 : T.ok) === !1 && (D.value = new Set([...D.value].filter((L) => L !== g.label)), I.value = `Could not ${g.label.toLowerCase()}: ${T.error}`);
    }
    const F = _(() => m.value.actions.filter((g) => !D.value.has(g.label))), B = _(() => {
      var g;
      return v5((g = s.value) == null ? void 0 : g.badge, C.value);
    }), j = _(() => m.value.controls), V = _(() => {
      var g;
      return !((g = s.value) != null && g.folds && a.folded);
    }), M = _(() => {
      var g;
      return !!((g = s.value) != null && g.draws_head) && !a.collapsed;
    });
    return (g, x) => {
      var T, L, W, Y;
      return r(), P(s5, {
        label: m.value.title + ((T = s.value) != null && T.needs_user ? ", waiting for you" : ""),
        type: (L = s.value) != null && L.needs_user ? "waiting" : "",
        folded: !!((W = s.value) != null && W.folds) && e.folded,
        body: !!((Y = s.value) != null && Y.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: x[4] || (x[4] = (Z) => e.collapsed && n("open"))
      }, {
        edge: q(() => [
          e.leaving && !e.item.kept ? (r(), P(i5, {
            key: 0,
            "ends-at": O(Ao)(e.item)
          }, null, 8, ["ends-at"])) : w("", !0)
        ]),
        head: q(() => {
          var Z;
          return [
            M.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(R, { key: 1 }, [
              A(ae, {
                name: m.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              h("span", E5, [
                h("span", {
                  class: K(["dock-title", { strip: e.collapsed }]),
                  title: y.value
                }, v(y.value), 11, A5)
              ])
            ], 64)),
            h("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (Z = s.value) != null && Z.leaves_after_seconds ? w("", !0) : (r(), d(R, { key: 0 }, [
                U(v(l.value), 1)
              ], 64))
            ], 512),
            j.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: x[0] || (x[0] = ge(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(R, null, X(j.value, (le) => {
                var de, $e;
                return r(), d(R, {
                  key: le.action + le.runs
                }, [
                  !D.value.has(le.label) && (!((de = le.variants) != null && de.length) || !(($e = C.value) != null && $e.state) || le.variants.includes(C.value.state)) ? (r(), P(re, {
                    key: 0,
                    variant: "icon",
                    class: K({ kept: le.pressed }),
                    "aria-pressed": le.pressed,
                    "aria-label": le.label,
                    title: le.label,
                    "data-dock-action": le.action,
                    onClick: (Ee) => G(le)
                  }, {
                    default: q(() => [
                      A(ae, {
                        name: le.icon,
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
        still: q(() => [
          I.value || e.refusal ? (r(), d("p", O5, v(I.value || e.refusal), 1)) : w("", !0)
        ]),
        foot: q(() => {
          var Z;
          return [
            h("span", T5, [
              B.value ? (r(), d("span", {
                key: 0,
                class: K(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(B.value), 3)) : w("", !0),
              S.value ? (r(), d("span", I5, v(S.value) + " " + v(e.item.target_id), 1)) : w("", !0),
              h("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (Z = s.value) != null && Z.folds ? (r(), P(re, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: x[1] || (x[1] = (le) => n("fold"))
            }, {
              default: q(() => [
                U(v(s.value.folds) + " ", 1),
                A(ln, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : w("", !0),
            h("span", {
              class: "dock-acts",
              onClick: x[3] || (x[3] = ge(() => {
              }, ["stop"]))
            }, [
              h("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              V.value ? (r(), d(R, { key: 0 }, [
                A(vo, {
                  name: `dock.${e.item.type}`,
                  row: C.value,
                  environment: O(p).environment,
                  "read-only": O(p).readOnly,
                  "object-name": O(va)(e.item.target_model),
                  "external-failure": "",
                  onFailure: x[2] || (x[2] = (le) => I.value = le),
                  onDone: g.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(R, null, X(F.value, (le) => (r(), P(re, {
                  key: le.action + le.runs,
                  small: "",
                  variant: le.primary ? "primary" : "ghost",
                  bordered: !le.primary,
                  "data-dock-action": le.action,
                  onClick: (de) => G(le)
                }, {
                  default: q(() => [
                    U(v(le.label), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
              ], 64)) : w("", !0)
            ])
          ];
        }),
        default: q(() => {
          var Z;
          return [
            (Z = s.value) != null && Z.body_url ? (r(), P(Fs, {
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
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : w("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Il = /* @__PURE__ */ H(B5, [["__scopeId", "data-v-4d692a2f"]]), R5 = 24, L5 = 8, LA = 420;
function NA({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= R5 ? !0 : e < t && s > L5 ? !1 : null;
}
const N5 = (e, t) => e === void 0 ? t : e, q5 = { me: 1, people: [] }, ka = nn({
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
  people: q5,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: fa("journal.activity", !0),
  wide: !1,
  sideMini: fa("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
zi("journal.activity", () => ka.activity);
zi("journal.side.mini", () => ka.sideMini);
const Qr = "journal.viewer.";
function D5(e, t, n) {
  try {
    const a = n.getItem(Qr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function P5(e, t, n) {
  try {
    n.setItem(Qr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Bl(e, t, n = window.localStorage) {
  const a = E(D5(e, t, n));
  return fe(a, (s) => P5(e, s, n), { deep: !0 }), a;
}
const j5 = {
  key: "dock-all",
  class: "dock-all"
}, F5 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var M, g;
    const t = e, n = L2(500), a = E(/* @__PURE__ */ new Set()), s = Se(Le), o = E(/* @__PURE__ */ new Set()), l = E({});
    async function i(x, T) {
      l.value = { ...l.value, [x.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, x.id]);
      const L = await Rn(T, { id: x.target_id }, s.environment);
      (L == null ? void 0 : L.ok) === !1 && (o.value = new Set([...o.value].filter((W) => W !== x.id)), l.value = { ...l.value, [x.id]: `Could not dismiss this card: ${L.error}` });
    }
    const u = _(
      () => b5(
        t.items.filter((x) => !o.value.has(x.id)),
        n.value,
        a.value
      )
    ), c = _(
      () => k5(
        u.value.filter((x) => is(x, Gt)),
        n.value
      )
    ), f = _(() => u.value.filter((x) => !c.value.includes(x) && !is(x, Gt))), m = Bl(`dock-size:${((M = ka.identity) == null ? void 0 : M.root) || location.host}`, null), p = (x) => {
      var T;
      return !!((T = Gt(x.type)) != null && T.needs_user);
    }, b = E(/* @__PURE__ */ new Set()), $ = E(/* @__PURE__ */ new Set()), y = _(() => u.value.length === 1), k = (x) => p(x) || y.value, S = (x) => k(x) ? b.value.has(x.id) || $.value.has(x.id) : m.value ? m.value.collapsed && !m.value.opened.includes(x.id) : t.collapsed, C = _(() => u.value.some(S));
    fe(() => t.collapsed, (x) => {
      $.value = new Set(x ? u.value.filter(p).map((T) => T.id) : []);
    });
    function N() {
      const x = !C.value;
      m.value = { collapsed: x, opened: [] }, b.value = new Set(x ? u.value.filter(p).map((T) => T.id) : []), $.value = /* @__PURE__ */ new Set();
    }
    function D(x) {
      var L;
      if (!S(x)) return;
      if (k(x)) {
        b.value = new Set([...b.value].filter((W) => W !== x.id)), $.value = new Set([...$.value].filter((W) => W !== x.id));
        return;
      }
      const T = (L = m.value) != null && L.collapsed ? m.value.opened : [];
      m.value = { collapsed: !0, opened: [...T, x.id] };
    }
    const I = Bl(`dock-folded:${((g = ka.identity) == null ? void 0 : g.root) || location.host}`, {}), G = (x) => {
      var T;
      return !!((T = Gt(x.type)) != null && T.folds) && (t.insidesFolded || N5(I.value[x.id], is(x, Gt) || t.folded));
    };
    function F(x) {
      G(x) && B(x), I.value = { ...I.value, [x.id]: !G(x) };
    }
    function B(x) {
      var T;
      !((T = m.value) != null && T.collapsed) || m.value.opened.includes(x.id) || (m.value = { collapsed: !0, opened: [...m.value.opened, x.id] });
    }
    function j(x) {
      a.value = /* @__PURE__ */ new Set([...a.value, x.id]);
    }
    function V(x) {
      a.value = new Set([...a.value].filter((T) => T !== x.id));
    }
    return (x, T) => (r(), P(to, {
      tag: "div",
      name: "dock",
      duration: O(Vr),
      class: "dock-stack"
    }, {
      default: q(() => [
        u.value.length > 1 ? (r(), d("div", j5, [
          A(re, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": C.value ? "Open all" : "Collapse all",
            onClick: N
          }, {
            default: q(() => [
              A(ln, {
                open: !C.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : w("", !0),
        (r(!0), d(R, null, X(f.value, (L) => (r(), P(Il, {
          key: L.id,
          item: L,
          class: K({ timed: O(dn)(L) }),
          leaving: O(dn)(L) && !a.value.has(L.id),
          folded: G(L),
          collapsed: S(L),
          refusal: l.value[L.id],
          onOpen: (W) => D(L),
          onFold: (W) => F(L),
          onUndock: (W) => i(L, W),
          onMouseenter: (W) => j(L),
          onMouseleave: (W) => V(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(R, null, X(c.value, (L) => (r(), P(Il, {
          key: L.id,
          item: L,
          class: K({ timed: O(dn)(L) }),
          leaving: O(dn)(L) && !a.value.has(L.id),
          folded: G(L),
          collapsed: S(L),
          refusal: l.value[L.id],
          onOpen: (W) => D(L),
          onFold: (W) => F(L),
          onUndock: (W) => i(L, W),
          onMouseenter: (W) => j(L),
          onMouseleave: (W) => V(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, qA = /* @__PURE__ */ H(F5, [["__scopeId", "data-v-ab76ae18"]]), qt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, ia = (e) => Math.min(Math.max(e, 0), 1), W5 = (e) => {
  const t = ia(e);
  return t * t * (3 - 2 * t);
}, It = (e, t, n) => W5((e - t) / (n - t));
function DA(e) {
  const t = ia(e), n = ia((t - 0.12) / 0.76) * qt.shuffles, a = Math.min(Math.floor(n), qt.shuffles - 1), s = n - a, o = It(s, 0.26, 0.38) * (1 - It(s, 0.76, 0.96)), l = It(s, 0.38, 0.76), i = It(t, 0, 0.12) * (1 - It(t, 0.88, 1)), u = It(s, 0.2, 0.34) * (1 - It(s, 0.84, 1)), c = Math.sin(Math.PI * ia((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / qt.shuffles, lift: qt.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function PA(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Rl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, jA = (e) => Rl[e] ?? Rl.butler, Oo = 2400, H5 = 0.05;
function z5({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, H5), l = Math.min(t + Oo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function FA(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function U5(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function WA(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const HA = (e, t) => ({ ...e, stretch: t.stretch }), zA = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Xr = (e, t) => t >= (e.least ?? 0);
function UA(e, t, n) {
  if (!Xr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const VA = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), V5 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Ll = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), G5 = (e) => e.right > e.left && e.bottom > e.top;
function GA(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(V5)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = Ll(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = Ll(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), G5(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function Jr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, m, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const b = t[f] - e[f];
      if (Math.abs(b) < 1e-9)
        (e[f] < o[m] || e[f] > o[p]) && (i = -1);
      else {
        const $ = (o[m] - e[f]) / b, y = (o[p] - e[f]) / b;
        l = Math.max(l, Math.min($, y)), i = Math.min(i, Math.max($, y));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const u = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: u, y: c, on: "surface", surface: s.id, dx: u - s.left, dy: c - s.top };
  }
  return a;
}
const Ie = {
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
}, Mn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), K5 = (e) => e * e * (3 - 2 * e), Re = (e, [t, n]) => K5(Mn(e, t, n)), Y5 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], $t = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, ea = ([e, t], n) => e + n() * (t - e);
function Q5(e) {
  return Y5.map(() => {
    const t = ea($t.speed, e), n = ea($t.angle, e) * Math.PI / 180, a = ea($t.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [ea($t.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const X5 = Q5(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function J5(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * $t.gravity * (t[2] - $t.floor))) / $t.gravity;
}
function KA(e, t, n = X5) {
  const a = Ie.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = J5(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, m) => f + o.velocity[m] * u);
  return c[2] -= $t.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const YA = (e, t) => e && Ie[e.name] ? { name: e.name, u: t / e.frames } : null;
function QA(e, t) {
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
const XA = () => Array.from({ length: Ie.pogo.count }, (e, t) => Ie.pogo.bounce * (t + 1) / Ie.pogo.count), Xt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function JA(e, t, n) {
  const { away: a, side: s } = Ie.bug_smash, o = s * a * n, [l, i] = [t.left + Xt.margin * n, t.right - Xt.margin * n], u = Math.min(Math.max(e + o + s * Xt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function ZA(e, t, n) {
  const a = Ie.bug_smash, s = Re(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Xt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Xt.tall * n * (1 - Re(t, a.emerge)),
      turn: 90 * (1 - Re(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Re(t, a.gone)
    }
  };
}
function eO(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Xt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = z5({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const We = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function tO(e) {
  const t = We.least + Math.floor(e() * (We.most - We.least + 1));
  return Array.from({ length: t }, () => ({
    wall: We.walls[Math.floor(e() * We.walls.length)],
    along: We.margin + e() * (1 - 2 * We.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function zs(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * We.margin, l = ((e.along - We.margin + e.way * We.speed * n / a) / s % 2 + 2) % 2, i = We.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + We.inset, turn: 180 } : { x: e.wall === "left" ? t.left + We.inset : t.right - We.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function Z5(e, t) {
  const n = Ie.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = U5(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function nO(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ie.bug_shot, { frame: l, bug: i, shot: u } = Z5(n, e.length), c = e.map((S, C) => ({ ...zs(S, t, Math.min(n / o.fps, ra(C).shot)), shot: C < u })), f = Re(l / o.frames, o.aim), [m, p] = [c[Math.max(i - 1, 0)], c[i]], b = e.map((S, C) => ({ bug: S, index: C, seconds: n / o.fps - ra(C).shot, spot: zs(S, t, ra(C).shot) })).filter((S) => S.seconds >= 0), $ = b.flatMap((S) => {
    const C = (s == null ? void 0 : s.get(S.index)) ?? s4(S.bug, t, S.spot, s ? [] : a);
    return s == null || s.set(S.index, C), s && o4(C, S.seconds, a), l4(C, S.seconds, a);
  }), y = b.filter((S) => n4(S.bug)).map((S) => ({ seconds: S.seconds, from: S.spot })), k = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: m.x + (p.x - m.x) * f, y: m.y + (p.y - m.y) * f, back: k }, slush: $, camera: y };
}
function ra(e) {
  const t = Ie.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function aO(e, t, n, a) {
  const { limit: s, margin: o } = Ie.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const m = ra(f), p = zs(c, t, m.shot), b = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), $ = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), y = Math.abs(p.x - u) >= b ? u : p.x + $ * b, k = $ > 0 ? Math.max(u, Math.min(y, i)) : Math.min(u, Math.max(y, l)), S = { from: u, to: k, begin: m.walk, end: m.aim };
    return u = k, S;
  });
}
function sO(e, t, n) {
  var o;
  const a = Ie.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Re(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Ae = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, e4 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function t4(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const n4 = (e) => e.along * 97 % 1 < Ae.camera, _n = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ae.gravity * t * t });
function a4(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ae.gravity * (t.bottom - e.from.y))) / Ae.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ae.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ae.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ae.step) {
    const f = Math.min(c + Ae.step, l.t), m = _n(e, f), p = Jr(i, m, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = m;
  }
  const u = _n(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function s4(e, t, n, a = []) {
  const s = t4(e.along + 1), [o, l] = e4[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ae.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ae.spread * Math.PI / 180), c = Ae.speed[0] + s() * (Ae.speed[1] - Ae.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ae.radius[0] + s() * (Ae.radius[1] - Ae.radius[0]) };
    return { ...f, ...a4(f, t, a) };
  });
}
function o4(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ae.step) {
      const l = Math.min(o + Ae.step, s), i = Jr(_n(a, o), _n(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function l4(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ..._n(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ae.hold) / Ae.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function oO(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Ie.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, m = Re(e, [0, c]), p = Re(e, [c, c + f]);
  return l.map((b) => {
    const $ = { x: a.x + b.at[0] * t, y: a.y + b.at[1] * t };
    return {
      x: n.x + ($.x - n.x) * m,
      y: n.y + ($.y - n.y) * m,
      r: b.size * t * (0.15 + 0.85 * m * m),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: m >= 1
    };
  });
}
function lO(e, t, n, a, s) {
  const { sway: o, above: l } = Ie.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], m = (y) => {
    const [k, S] = [y.x - e.at.x, y.y - e.at.y];
    return { x: i.x + k * c - S * f, y: i.y + k * f + S * c };
  }, [p, b] = [...n].sort((y, k) => y.x - k.x), $ = e.ends.map(m);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: $.map((y, k) => ({ from: y, to: k < $.length / 2 ? p : b })) };
}
const iO = (e, t) => Re(t, e.grows) * (1 - Re(t, e.sinks));
function wa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: Mn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: Mn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function rO(e, t) {
  const n = Ie[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = wa(n, t), l = 1 - (1 - n.small) * Re(a, n.shrinks) * (1 - Re(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = wa(n, t), o = n.flat * Re(a, n.squashes) * (1 - Re(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * Mn(s, ...n.springs)) * (1 - Mn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const uO = (e) => e === "pack_box";
function cO(e) {
  const { into: t, out: n } = wa(Ie.rope_swing, e);
  return 1 - Re(t, [0, 1]) * (1 - Re(n, [0, 1]));
}
function dO(e) {
  const t = Ie.rope_swing, { into: n, out: a } = wa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Re(n, [0, 1]) * (1 - Re(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const i4 = { after: 3 }, To = 10, r4 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, u4 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, c4 = { weight: 19 }, Zr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, d4 = { every: 120 }, eu = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, tu = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, f4 = {
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
}, Dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: To }), ue = (e, t, n = {}) => Dn(e, "clip", t, n), rs = (e, t, n = {}) => Dn(e, "look", t, n), Nl = (e, t, n = {}) => Dn(e, "gaze", t, n), we = (e, t, n = {}, a = {}) => ({ ...Dn(e, "pick", t, n), ...a }), Me = (e) => Dn("nothing", "nothing", e, {}), m4 = 120, h4 = 300, us = (e, t) => ({ ...ue(e, t), cooldown: h4 }), he = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), p4 = () => [ue("joy", 2)], Bt = (e, t, n, a, s = {}) => ({ ...ue(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), Rt = (e) => ({ ...e, cooldown: r4[e.name] }), cn = (e) => ({ ...e, shenanigan: !0, lasts: u4[e.name] }), La = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...he("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ue("nod", 2), Me(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...he("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...Rt(ue("bug_shot", 3)), toward: "", onto: !1 },
    { ...Rt(ue("bug_smash", 2)), toward: "", onto: !1 },
    ue("nod", 2)
  ]),
  ...he("tests_failed", { cooldown: 20, toward: "card" }, [ue("startled", 2), ue("dismay", 1), ue("tantrum", 3), Me(1)]),
  ...he("committed", { cooldown: 30, toward: "card", onto: !0 }, [ue("nod", 2), Me(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...he("sin_fixed", { cooldown: 300 }, [ue("halo", 1), Me(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...he("sin_committed", { cooldown: 300 }, [ue("repent", 1), Me(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...he("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ue("nod", 4), ue("hand_rub", 4), Me(7)]),
  ...he("question_asked", { cooldown: 60 }, [ue("ask_sign", 9), ue("look_up", 3), Me(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...he("reported", { cooldown: 90 }, [Nl("read", 3), ue("nod", 1), Me(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...he("read_message", { cooldown: 30 }, [Nl("read", 3), Me(1)]),
  ...he("fact_filed", { cooldown: 120 }, [ue("file_card", 3), ue("nod", 1), Me(6)]),
  ...he("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ue("nod", 2), Me(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...he("bar_done", { holds: !0 }, p4()),
  ...he("bar_failed", { holds: !0 }, [ue("fume", 1), ue("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...he("standing", { cooldown: 12 }, [ue("look_left", 2), ue("look_right", 2), ue("look_up", 1), Me(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...he("launched", { cooldown: 300 }, [ue("tumble", 3), Me(47)]),
  // a break from the hammering now and then
  ...he("building", { cooldown: 30 }, [ue("wipe_brow", 4), ue("look_left", 1), ue("look_right", 1), Me(69)]),
  ...he("failed", { cooldown: 20, toward: "card" }, [ue("shake", 3), ue("tantrum", 2), Me(2)]),
  ...he("refused", { cooldown: 20 }, [ue("shake", 1), Me(1)]),
  ...he("work_done", { cooldown: 120 }, [ue("stretch", 2), Me(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...he("pondering", { cooldown: [30, 60] }, [we("ponder", 1)]),
  ...he("thought_cloud", { cooldown: 90 }, [we("cloud", 1)]),
  ...he("light_bulb", { cooldown: 150 }, [we("bulb", 1)]),
  ...he("answered", { cooldown: 15 }, [rs("amused", 3), Me(2)]),
  ...he("heard", { cooldown: 30 }, [
    ue("bow", 1, { voices: ["butler"] }),
    ue("salute", 1, { voices: ["squire"] }),
    ue("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    Me(1)
  ]),
  ...he("long_walk", { cooldown: 90 }, [ue("stumble", 3), Me(22)]),
  ...he("card_arrived", { cooldown: 20, toward: "card" }, [ue("glance", 7), Me(13)]),
  ...he("typing", { cooldown: 60 }, [rs("reading", 1), Me(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(f4).flatMap(([e, t]) => he(`reacted:${e}`, {}, [rs(t, 1)])),
  ...Object.entries(eu).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => he(`agent_reacted:${n}`, {}, [ue(a, 1, { voices: [e] })])[0])),
  ...Object.entries(tu).flatMap(([e, t]) => he(`agent_reacted:${e}`, {}, [ue(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...he("pastime", {}, [
    Bt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    Bt("rest", 3, 180, 120),
    Bt("yawn", 2, 60, 60),
    Bt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    Bt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    Bt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    Bt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...cn(Rt(ue("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    cn(Rt(ue("disco", 2, { ball: "bubble" }))),
    Me(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...he("held:search", { cooldown: m4 }, [us("search", 3), { ...us("binoculars", 2), when: { home: !0 } }, { ...us("glass_bubble", 2), when: { bubble: !0 } }]),
  ...he("held:type", {}, [ue("type", 3), ue("type_ponder", 1)]),
  ...he("held:compacting", {}, [ue("pack_box", 3), ue("vacuum", 2), ue("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...he("spell", {}, [we("writing", 12, { state: "writing" }), we("reading", 12, { state: "reading" }), we("searching", 12, { state: "searching" }), Me(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...he("tickled", {}, [{ ...Rt(ue("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...he("eager", {}, [ue("eager", 2, { slow: !0 }), Me(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...he("jump", {}, [cn(Rt(ue("backflip", 7, { high: !0 }))), ue("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...he("climb", {}, [we("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...he("unit", { cooldown: Zr.build.cooldown }, [we("unit", c4.weight), Me(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...he("progress_jump", { cooldown: 6 }, [ue("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...he("perch", {}, [{ ...we("hang", 1, { hands: !0, free: !0 }), cooldown: d4.every }, we("stand", 5)]),
  // a digit a blow's dust lets out
  ...he("digit", {}, [we("0", 1), we("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...he("roam", {}, [
    we("rest", 35, {}, { stay: [25, 60] }),
    we("seat", 15, {}, { stay: [15, 40] }),
    we("edge", 25, {}, { stay: [8, 20] }),
    cn(we("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    we("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    we("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    we("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    we("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    we("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    cn(Rt(we("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...he("laptop", {}, [we("seat", 6, {}, { stay: [60, 150] }), we("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...he("ledge_at", {}, [we("middle", 2, {}, { along: 1 / 2 }), we("third", 1, {}, { along: 1 / 3 }), we("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...he("composed_as", {}, [
    we("facing", 4, {}, { turn: 0, leans: 0 }),
    we("turned_left", 1, {}, { turn: 335, leans: 0 }),
    we("turned_right", 1, {}, { turn: 25, leans: 0 }),
    we("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    we("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], nu = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), au = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), v4 = (e) => Array.isArray(e) ? e[0] : e, g4 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, y4 = (e) => La.some((t) => t.when.moment === e);
function b4(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || au(f).every(([m, p]) => n(m) >= v4(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = La.filter((f) => nu(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= i4.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var m;
    return f.type === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function et(e, t) {
  const n = b4(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (su(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function su(e, t, n) {
  var a;
  for (const [s, o] of au(t)) (a = e.memory) == null || a.set(s, e.now + g4(o, n));
}
function fO(e, t, n) {
  su(e, La.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const mO = (e) => Object.values(Zr).find((t) => nu(t.when, e)) ?? null, k4 = (e, t, n) => n - t <= (e.lifetime ?? To), hO = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Xr(e.clip, t));
class ou {
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
const Us = {
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
}, pO = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), lu = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), vO = {
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
}, gO = 120, w4 = 20, yO = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < w4), $4 = (e) => Us[e] || Us.idle, bO = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, iu = "airborne", x4 = "landing", S4 = "travelling", ru = "grounded", kO = ({ airborne: e, landing: t, trip: n }) => e ? iu : t ? x4 : n != null && n.started ? S4 : ru;
function wO(e, t) {
  var s;
  const n = M4(e, t);
  return e.mode === ru && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function M4(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: m = 0, readingFacing: p = null } = e;
  if (n === iu && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ..._4(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const b = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: b ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : $4(c), facing: b ? p : i.posture === "sit" ? i.face : m };
}
function _4(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Vs = (e) => e.outcome, C4 = /^plugin:[^:]+:sins:/, ql = (e) => e.type === "plugins.card" && C4.test(e.markKey), E4 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => ql(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => ql(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], $O = (e, t) => e.filter((n) => n.author === "user" && ga(n.read_at) > t).map((n) => ({ beat: "read_message", time: ga(n.read_at), card: nr(n) })).sort((n, a) => n.time - a.time), Dl = { user: "reacted", agent: "agent_reacted" };
function xO(e, t) {
  return e.filter((n) => Dl[n.author] && jt(n) > t).map((n) => ({ beat: `${Dl[n.author]}:${n.emoji}`, time: jt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const A4 = [.../* @__PURE__ */ new Set([...Object.values(eu).flatMap((e) => Object.keys(e)), ...Object.keys(tu)])];
function SO(e, t) {
  return e.filter((n) => n.author === "agent" && jt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = A4.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: jt(n), card: nr(n) })).sort((n, a) => n.time - a.time);
}
const O4 = (e) => new ou(e).isTest(), $a = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Vs(e)] || "";
}, T4 = 1800, I4 = (e, t) => {
  if ($a(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && $a(n) !== "finished" && Number(e.time) - Number(n.time) <= T4 ? "tests_fixed" : "tests_passed";
};
function MO(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(O4), s = a.filter((i) => $a(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, $a(i))), o.map((i) => ({ beat: I4(i, s), time: Number(i.time), card: i.key }));
}
function _O(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Vs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Vs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const CO = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: jt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function EO(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function AO(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function OO(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = E4.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function Io(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Pl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function B4(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Io(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function TO(e, t, n, a = {}) {
  const s = et({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : y4(`held:${e}`) ? "idle" : e;
}
const je = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function IO(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < je.ahead * n ? 180 : Math.sign(a) * je.turn;
}
const jl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function BO(e, t) {
  const n = Math.min(je.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(je.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(je.lines, Math.floor((e.bottom - e.top - 2 * a) / je.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / je.sweep) % s, i = o % je.sweep, u = je.sweep - je.returnSeconds, c = jl((i - u) / je.returnSeconds), f = i <= u ? jl(i / u) : 1 - c, m = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + m * je.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Fl = 3, uu = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Wl = 12, RO = (e, t) => ({ mood: e, began: t, seen: 0 });
function LO(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!uu(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Fl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Wl) / Wl, lasts: Fl } };
}
const NO = (e) => e.posture === "hang" && !uu(e.face), R4 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), L4 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function qO(e, t, n) {
  return R4.has(e) ? 1 / 0 : !L4.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(cu(n - t.began, t.share) - dt.lead, 0);
}
const N4 = 5;
function DO(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= N4 ? { beat: "long_walk", time: n } : null };
}
const q4 = 30, ta = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function PO(e, t, n, a, s = null) {
  if (t && n < t.until || !ta.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = et({ moment: "spell", state: e, tally: s }, a), [l, i] = ta.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + ta.every } : { state: e, began: 0, until: 0, next: n + ta.every };
}
const jO = (e, t, n) => t && n < t.until && lu.has(e.state) ? { state: t.state, since: t.began } : e, dt = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, cu = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function FO(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = cu(o, e.share);
  return s ? { eager: D4(t, l), moment: null } : l > dt.lead ? { eager: t, moment: null } : l < dt.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > dt.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < dt.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = et({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function D4(e, t) {
  return e.on && t > dt.lead + dt.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= dt.lead && t >= dt.least ? { ...e, on: !0, calm: !1 } : e;
}
const P4 = 1, j4 = { look: "look", gaze: "gaze" };
function F4(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = et({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [j4[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const W4 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => et({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), H4 = (e, t, n, a, s, o = 0) => et({ moment: "jump", high: e > P4 * t, memory: a, now: s, room: o }, n).name === "backflip", z4 = { work: ["building"], idle: ["standing"] };
function WO(e, t, n, a) {
  const s = Us[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(z4[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), lu.has(e) ? { moments: o, began: n || a } : (n && a - n >= q4 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function U4(e, t, n) {
  return !et({ moment: "pondering", memory: e, now: t }, n) || !et({ moment: "thought_cloud", memory: e, now: t }, n) ? null : et({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Hl = { pondering: U4 };
function HO(e, t, n, a, s, o) {
  if (Hl[e.beat]) {
    const i = Hl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = F4(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== To && { lifetime: l.lifetime } } } : null;
}
function zO(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = W4(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const UO = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function VO(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function GO(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const KO = (e, t) => !!(e != null && e.watches) && !t.once, YO = 10, QO = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || k4(a, a.queuedAt, n)), XO = (e, t) => t ? null : e[0] ?? null;
function JO(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const ZO = (e, t) => !t.during || !e.some((n) => n.during === t.during), V4 = 2 * Math.PI, G4 = 500;
function eT(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / G4, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, m = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = V4 * l / 1e3, b = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, y = (c ? b : t != null && t.behind && t.mood === "reading" ? { ...t } : t && b && !u ? s && !t.behind && !b.behind ? Y4(b, t, n, p, s) : X4(b, t, n, p) : t) ?? b, k = y != null && y.behind && y.mood === "reading" ? K4(e.point, y, n, l, s) : y;
  return { point: k ?? null, toward: k ? { x: k.x - n.x, y: k.y - n.y } : null, amount: m, at: a };
}
function K4(e, t, n, a, s) {
  const o = (j) => j * 180 / Math.PI, l = (j) => o(Math.atan2(Math.sin(j * Math.PI / 180), Math.cos(j * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), m = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = m ? l(e.readingFacing - i) : 0, b = m ? e.readingYaw + p : f, $ = b + l(c - b), y = Math.min(Math.max(a / 1e3, 0), 0.1), k = je.turnSpeed * y, S = m ? b + Math.min(Math.max($ - b, -k), k) : $, C = m ? e.readingFollow + p : S, N = C + (S - C) * (1 - Math.exp(-y / je.followSeconds)), D = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(Io(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), G = Math.min(Math.max(I, -D.up), D.down), F = je.tipSpeed * y, B = m ? e.readingPitch + Math.min(Math.max(G - e.readingPitch, -F), F) : G;
  return { ...t, readingYaw: S, readingFollow: N, readingPitch: B, readingFacing: i };
}
function Y4(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (C) => {
    const { yaw: N, pitch: D } = Io(C.x - n.x, s, n.y - C.y, o);
    return { yaw: N, pitch: Math.min(Math.max(D, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [Pl(i(e)), Pl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const m = a / f, [p, b] = [Math.sin((1 - m) * f) / Math.sin(f), Math.sin(m * f) / Math.sin(f)], [$, y, k] = u.map((C, N) => p * C + b * c[N]), S = s * $ / y;
  return { ...t, x: n.x + S, y: n.y - B4(S, s, -Math.asin(Math.min(Math.max(k, -1), 1)), o) };
}
const Q4 = 0.15;
function tT(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Q4;
}
function X4(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const J4 = (e) => !(e != null && e.on);
function nT(e, t, n) {
  if (J4(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const Cn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, rt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, cs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), zl = (e) => e * e * (3 - 2 * e);
function Z4(e) {
  if (e < 0 || e >= rt.seconds) return null;
  const t = cs(e, ...rt.flicker), n = Math.floor(t * rt.flickers * 2) % 2 === 0, a = e < rt.flicker[1] ? n ? 0.35 + 0.5 * t : rt.dim : 1;
  return { strength: 1 - zl(cs(e, ...rt.fade)), lit: a, white: e < rt.flash[0] ? 0 : 1 - zl(cs(e, ...rt.flash)) };
}
const aT = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function sT(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Z4(t - e.at);
  return a && { colour: Cn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: rt.signs[e.tone], ...a } };
}
function oT(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function lT(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= Cn.looks || a === null && n - e.since >= Cn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function iT(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const wt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, rT = { behind: 39, figure: 40, ahead: 41 }, ex = "[data-figure-pile]", tx = { amber: [1, 0.69, 0.125], good: Cn.colours.good, bad: Cn.colours.bad }, ua = { phases: 4, ms: 230, dim: 0.25 }, uT = (e, t, n) => e !== "amber" || (t + n) % ua.phases < ua.phases / 2 ? 1 : ua.dim, cT = (e) => e === "amber" ? ua.phases : 1;
function dT(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const fT = Object.keys(tx), st = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, fn = ([e, t], n) => e + n() * (t - e);
function mT(e) {
  const t = st.least + Math.floor(e() * (st.most - st.least + 1));
  return Array.from({ length: Math.min(t, st.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * st.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = fn(st.start, e), l = fn(st.reach, e);
    return {
      text: et({ moment: "digit" }, e).name,
      x: a * o,
      y: st.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(fn(st.moveMs, e)),
      fadeMs: Math.round(fn(st.fadeMs, e))
    };
  });
}
const ds = { high: 3, gap: 1 };
function hT(e) {
  const t = Math.floor(e / ds.high);
  return { left: -(wt.inside + wt.width / 2 + t * (wt.width + ds.gap)), up: e % ds.high * (wt.height - wt.top) };
}
const nx = (e, t, n) => et({ moment: "unit", memory: e, now: t }, n) !== null, ax = { after: 5 }, sx = (e) => e.filter((t) => t.active && (t.process || t.watch) && new ou(t).isBuild());
function pT(e, t, n) {
  const a = sx(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= ax.after ? s : null;
}
function vT(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: nx(n, a, s) } : null;
}
const Ul = { ahead: 140, up: 70 };
function gT(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Ul.ahead, y: a - Ul.up } } : o ? { at: { x: n(o), y: a - o.up - wt.height } } : t ? { at: null } : null;
}
const fs = { least: 4e3, most: 1e4 }, ox = (e) => fs.least + e() * (fs.most - fs.least), Lt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function yT(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = ox(t);
    if (n.length >= Lt.most || t() >= Lt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (Lt.at[0] + t() * (Lt.at[1] - Lt.at[0]));
    n.push({ from: o, to: o + Lt.ms }), a = o + Lt.ms;
  }
}
const bT = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), kT = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), du = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), wT = new Set(La.filter((e) => du.has(e.when.moment) && e.type === "clip").map((e) => e.name)), lx = (e) => e.some((t) => t.state === "built"), $T = (e, t) => lx(t) ? e.filter((n) => !du.has(n.beat)) : e, St = { reach: 40, room: 6 }, ix = (e, t) => t <= e - St.reach + 2, xT = (e, t, n) => ix(e, n) ? t - St.reach : e - St.reach - St.room, ST = (e, t, n, a) => a > 0 && t < e && t + St.reach >= e - 2 ? Math.min(n, Math.max(e, t + St.reach)) : e, ms = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, MT = (e) => fn(e() < ms.longShare ? ms.long : ms.short, e), rx = 2 * wt.width;
function _T(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= rx ? o : e + (o - e + s / 2) % s;
}
const ux = 60, CT = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= ux, Vl = "[data-figure-home]", Pn = () => {
  var t;
  const e = document.querySelector(Vl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Vl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, cx = "[data-figure-docked-bars]", dx = "[data-figure-chat-foot]", fx = [0.85, 0.6, 0.35, 0.15], mx = ["question", "waiting", "suggestion"], ET = (e, t) => mx.find((n) => e[n] > 0 && t[n] === "behind") || null;
function AT() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const hx = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", px = "[data-figure-newest]";
function fu() {
  var a, s;
  const e = (a = Pn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(px), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Bo(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function En(e, t, n = fu()) {
  if (!e || !n) return !0;
  const a = vt(e, t), s = qa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + qe.top * t.size, bottom: a.top + qe.bottom * t.size }, l = qt.gap;
  return !Na(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function OT(e, t, n, a = fu()) {
  if (!a || En(t, e, a)) return null;
  const s = qa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = zt(), u = t.posture === "stand" ? Lo * e.size : ku * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - qt.gap - l, a.right + qt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && En(p, e, a) && zx(p, e)).sort((p, b) => Math.abs(p.x - t.x) - Math.abs(b.x - t.x))[0] ?? null;
}
const hs = 0.26, mu = 0.54, vx = 1.25 / 5.4, jn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: hs, travels: "stand" },
  lounge: { drop: hs, travels: "stand" },
  composed: { drop: hs, travels: "stand" },
  hang: { drop: mu, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, TT = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * vx * Math.cos(t * Math.PI / 180),
  y: 1 - n - mu
}), vn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), gx = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), IT = (e, t) => (e === "sit" ? gx.has(t) : vn.has(e)) ? e : "stand";
function BT(e, t) {
  return e.facing === t.facing || !vn.has(e.posture) && !vn.has(t.posture) ? t : { posture: "stand", facing: vn.has(e.posture) ? e.facing : t.facing };
}
const RT = 0.25, LT = (e, t) => vn.has(e) && jn[t].drop === 0, hu = 2, yx = 90, bx = 180, kx = 140, wx = 280, $x = 420, xx = 0.25, Sx = 290, Mx = 600, _x = "cubic-bezier(0.2, 0.7, 0.4, 1)", Cx = "cubic-bezier(0.55, 0, 0.9, 0.6)", ps = 5;
function xa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ps) return null;
  (l || i) && (o = Math.max(o, hu));
  const b = o > 1, $ = Math.abs(t.x - e.x), y = $ < ps ? 0 : $ / (yx * o) * 1e3, k = Math.min(y, b ? kx : bx), S = Math.abs(t.y - e.y), C = t.y < e.y, N = C && !p && H4(S, n, u, c, f, m), D = C ? $x + Math.min(S, 400) * xx : Math.sqrt(2 * S / Oo) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: S > ps ? N ? Mx : D : 0,
    lead: N ? Sx : C ? wx : 0,
    easing: C ? _x : Cx,
    hopping: !0,
    clip: N ? "backflip" : C ? "jump" : "fall"
  }, G = { x: t.x, y: t.y, ms: y + k, lead: 0, easing: "linear", ramp: k, ...b ? { clip: "run" } : {} }, F = p ? Ex(t, n) : I, B = C && !a ? [{ ...G, y: e.y }, F] : [{ ...I, x: e.x }, G];
  return { way: Math.sign(t.x - e.x) || 1, legs: B, lands: !s, pace: o, running: b };
}
const Ex = (e, t) => ({ x: e.x, y: e.y, ms: Ie.pogo.frames / Ie.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Ax = (e, t) => e.postures.includes(t) ? t : e.postures[0], NT = (e, t, n) => e.posture === "walk" && n ? "walk" : Ax(e.clip, t), vt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - jn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Na = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Bo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function zt() {
  var t;
  const e = (t = Pn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const na = 0.5, Gl = 20;
function qT(e, t, n = zt()) {
  const a = vt(e, t);
  return a.left >= n.left + Gl && a.right <= n.right - Gl;
}
function Ro(e, t, n = zt()) {
  const a = vt(e, t), s = a.right - a.left, o = qa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - na && i <= n.right + na && a.top >= n.top - na && u <= n.bottom + na;
}
const Sa = [0.35, 0.5, 0.65], Ma = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], qe = { left: Sa[0], right: Sa.at(-1), top: Ma[0], bottom: Ma.at(-1) }, Ox = 0.24;
function qa(e) {
  if (e.posture === "stand") return { left: qe.left, right: qe.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Ox * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(qe.left, t), right: Math.max(qe.right, t) };
}
function Tx(e, { size: t }, n = zt()) {
  const a = qa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Lo = (qe.right - qe.left) / 2 + 0.08;
function DT(e, t) {
  return e === "hang" ? qe : { ...qe, bottom: Math.min(qe.bottom, 1 - t - jn[e].drop) };
}
const Ix = "[data-figure-agent]";
function pu(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Bo(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const vu = (e) => Ma.flatMap(
  (t) => Sa.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function No(e, t, n = "") {
  if (!En(e, t)) return Sa.length * Ma.length;
  const a = vt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(hx)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && Na(s, u) && Bo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return vu(s).filter(([i, u]) => l(i, u) || pu(i, u, n)).length;
}
function Bx(e, t) {
  const n = vt(e, t);
  return vu({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => pu(a, s, "", Ix)).length;
}
const Kl = 4;
function PT(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Kl; o <= s; o += Kl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!Bx(i, e) && En(i, e)) return i;
    }
  return null;
}
function An(e, t, n) {
  const a = zt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Ro(l, t, a) && En(l, t)).map((l) => ({ spot: l, covered: No(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const gu = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Rx = [0.5, 0.25, 0.75], Lx = (e) => gu(e.getBoundingClientRect(), Rx), yu = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Nx = Lo, qx = (e, t, { size: n }, a = Nx) => bu(e, yu[t], a * n, "stand");
function bu(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Dx = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, ku = 0.1, Px = (e, t, { size: n }) => bu(e, Dx[t], ku * n, "sit"), jx = (e) => ((e + 180) % 360 + 360) % 360 - 180, vs = 60;
function jT(e, t) {
  const n = jx(t);
  return !e.aside || Math.abs(n) >= vs ? t : n < 0 ? 360 - vs : vs;
}
const gn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Fx = (e) => [.../* @__PURE__ */ new Set([e, ...gn.turns.map((t) => (t + 360) % 360)])];
function FT(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Fx(t), l = gn.every[0] + a() * (gn.every[1] - gn.every[0]);
  return { face: t, from: s ? Wx(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function Wx(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / gn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function WT(e, t) {
  const { element: n, edge: a } = Da(), s = ["left", "right"].map((i) => Fn(Px(a, i, e), e)).filter((i) => n && Ro(i, e) && !No(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function HT(e, t, { size: n }) {
  const a = (qe.right - qe.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - wu } : e;
}
const wu = 7;
function $u() {
  const e = [...document.querySelectorAll(ex)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Hx(e, t) {
  const n = vt(e, t), a = n.right - n.left;
  return { left: n.left + qe.left * a, right: n.left + qe.right * a, top: n.top + qe.top * a, bottom: n.bottom };
}
function zx(e, t) {
  const n = $u();
  return !n || !Na(Hx(e, t), n);
}
const Ux = 4;
function Da() {
  const e = Wn(), t = $u(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Ux || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - wu - n, 0) } };
}
const zT = ({ size: e, below: t }) => (1 - t) * e;
function Fn(e, t) {
  const n = zt(), { size: a, below: s } = t, o = jn[e.posture].drop * a;
  return { ...Tx(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Gs = (e, t) => Object.keys(yu).map((n) => Fn(qx(e, n, t), t)), qo = (e, t) => gu(e, fx).map((n) => Fn(n, t)), xu = (e, t, n) => An(e, t, n) ?? e[0];
function UT(e, t) {
  const { element: n, edge: a } = Da();
  return { ...xu(Gs(a, e), e, t), view: null, on: n };
}
function VT(e, t, n, a) {
  const { element: s, edge: o } = Da(), l = (a ? Gs(o, t) : [...Gs(o, t), ...qo(o, t)]).filter(
    (c) => !Na(vt(c, t), e)
  ), i = An(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !No(i, t) ? i : An(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Wn() {
  var a;
  const e = Pn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(cx);
  if (!t) return { ...Pa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Yl = { within: 2 };
function GT(e) {
  const { element: t, docked: n, edge: a } = Wn();
  if (!n || e.on !== t) return !0;
  const s = Pa().edge;
  return a.left > s.left + Yl.within || a.left + a.width < s.left + s.width - Yl.within;
}
const Vx = "[data-figure-closing]";
function KT() {
  var n;
  const { element: e, docked: t } = Wn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Vx));
}
const Su = "[data-figure-progress]";
function YT(e) {
  const t = e.querySelector(Su);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function QT(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Gx = { across: 300, above: 380, below: 60 };
function XT(e) {
  const { across: t, above: n, below: a } = Gx;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Kx(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Kx = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Mu = "[data-figure-bar]", Ks = { back: 144, along: 0.4 };
function JT(e) {
  const { element: t, docked: n, edge: a } = Wn(), s = n ? t.querySelector(Mu) : null;
  if (!(s != null && s.querySelector(Su))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Fn({ x: o - Ks.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function ZT(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ks.along * a.size ? t.x + Ks.along * a.size : e.x, y: e.y, behind: !0 };
}
function eI(e) {
  const t = e.querySelector(Mu), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Pa() {
  const e = Pn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function tI(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Pa(), u = n === null ? Yx(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Fn({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function Yx(e, t, n, a, s) {
  const o = qo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + wt.width < s && u.x + a - St.reach - St.room >= l);
  return An(i.length ? i : o, t, n);
}
const Qx = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function nI(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, hu));
  const b = (N) => {
    const D = vt(N, n, jn[N.posture].travels);
    return { x: D.left, y: D.top };
  }, $ = t.ladder ?? e.ladder;
  if ($ && !(t.ladder && e.ladder)) return Xx(b(e), b(t), b({ ...$.foot, posture: "stand" }), $.way, !!t.ladder, n, s);
  const [y, ...k] = [e, ...u, t].map(b), S = xa(y, k[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: m, pogo: p }), C = k.slice(1).map((N, D) => {
    var I;
    return (I = xa(k[D], N, n.size, { random: i, memory: c, now: f, room: m })) == null ? void 0 : I.legs.find((G) => G.hopping);
  });
  return S && { ...S, legs: [...S.legs, ...C.filter(Boolean)] };
}
function Xx(e, t, n, a, s, o, l) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / Qx.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? xa(e, n, o.size, { pace: l }) : xa(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function aI(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function sI(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && An(Lx(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Da();
  return { ...xu(qo(s, t), t, n), view: null, on: a };
}
const Jx = "[data-figure-bubble]", Zx = 250;
let yn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), _u = 0;
const rn = () => yn, gs = /* @__PURE__ */ new WeakMap();
let e8 = 0;
function Do(e) {
  return gs.has(e) || gs.set(e, `floor-${++e8}`), gs.get(e);
}
const t8 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, n8 = () => {
  var e, t;
  return ((t = (e = Pn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function a8(e, t) {
  var a;
  const n = (a = e.querySelector(dx)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function s8(e, t) {
  const n = e && a8(e, t), a = e ? [...e.querySelectorAll(Jx)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || t8(l, n))).map(({ element: o, type: l, box: i }) => ({ id: Do(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const o8 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Zx ? (t.top - a.top) / s * 1e3 : 0;
};
function Cu(e = yn, t = performance.now()) {
  const n = zt(), a = n8(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Wn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Pa();
  return c.element && u.push({ id: Do(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...s8(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: o8(e, f, t) }))) });
}
const Ys = /* @__PURE__ */ new Set();
function l8(e) {
  return Ys.add(e), () => Ys.delete(e);
}
function i8() {
  Eu();
  const e = () => {
    _u = requestAnimationFrame(e), !document.hidden && (yn = Cu(yn), Ys.forEach((t) => t(yn)));
  };
  e();
}
function Eu() {
  cancelAnimationFrame(_u);
}
const Po = 5, r8 = 56, u8 = { share: 0.6 }, c8 = (e) => -Math.sqrt(2 * Oo * u8.share * e), tn = (e, t) => e.find((n) => n.id === t) ?? null;
function oI(e, t = Cu().floors) {
  const n = tn(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Do(e.on) : null, o = s && tn(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Au({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = rn().floors) {
  const c = tn(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || d8(c, f, o)) && f8(f, i, u) ? { x: f.x, y: f.y } : null;
}
const jo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, d8 = (e, t, n) => !jo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function lI(e, t = rn().floors) {
  if (!jo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Po && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function f8(e, t, n = rn().floors) {
  const a = tn(n, "home");
  return e.posture === "hang" && a && vt(e, t).bottom >= a.top ? !1 : Ro(e, t);
}
function iI(e, t, n, a = rn().floors) {
  const s = Au(e, n, a);
  if (!e.home) return m8(e, t, s, a);
  if (!s) return null;
  const o = tn(a, "home"), l = s.y - t.y, i = l > Po ? "dropping" : -l > r8 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function m8(e, t, n, a) {
  const s = n ? tn(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: c8(e.risen) };
  if (!n) return null;
  if (jo(t) && n.y - t.y > Po) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function rI(e, t, n) {
  const a = Lo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function uI(e, t, n, a = rn().floors) {
  const s = t && Au(t, n, a);
  return s ? { ...e, ...s } : e;
}
const h8 = ["data-type"], p8 = { class: "figure-floor-name" }, v8 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ye({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      h("span", p8, v(e.floor.type), 1)
    ], 12, h8));
  }
}, g8 = /* @__PURE__ */ H(v8, [["__scopeId", "data-v-4e0f1e2e"]]), y8 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, b8 = {
  __name: "FigureFloors",
  setup(e) {
    const t = lt(rn().floors);
    let n = () => {
    };
    return Ce(() => {
      n = l8((a) => t.value = a.floors), i8();
    }), Be(() => {
      n(), Eu();
    }), (a, s) => (r(), d("div", y8, [
      (r(!0), d(R, null, X(t.value, (o) => (r(), P(g8, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, cI = /* @__PURE__ */ H(b8, [["__scopeId", "data-v-e519168b"]]), k8 = 5e3;
function dI(e, { chosen: t, held: n = () => !1 }) {
  const a = (N) => {
    var D;
    return (D = e.props[N].data.value) == null ? void 0 : D.value;
  }, s = E(""), o = E(""), l = E(!1), i = E(!1), u = E(Date.now() / 1e3), c = _(() => e.props["voice-profile"].loaded.value ? { profile: a("voice-profile"), avatar: a("voice-avatar"), avatar_shown: a("voice-avatar-shown") } : null), f = () => {
    var N;
    return !((N = c.value) != null && N.avatar) || c.value.avatar_shown === "never" || c.value.avatar_shown === "working" && !s.value ? "" : c.value.profile;
  }, m = _(() => {
    const N = t();
    return N === "voice" ? f() : N && N !== "none" ? N : "";
  }), p = _(() => !!m.value && !n()), b = E("");
  fe(m, (N) => {
    N && (b.value = N);
  }, { immediate: !0 });
  const $ = E(!1), y = E(!1);
  let k = 0;
  const { data: S, failure: C } = e.props.tool;
  return fe([S, C], () => {
    const N = C.value ? {} : S.value ?? {};
    ((N.tool ?? "") !== s.value || !!N.running !== $.value) && (clearTimeout(k), y.value = !!N.tool, N.tool && !N.running && (k = setTimeout(() => {
      y.value = !1;
    }, k8))), $.value = !!N.running, s.value = N.tool ?? "", o.value = N.wait_target ?? "", l.value = !!N.thinking, i.value = !!N.asking;
  }), u.value = Date.now() / 1e3, e.follow(["hook_call.*", "dock_item.*", "process_part.*"], Oa(() => {
    u.value = Date.now() / 1e3, e.reload("tool");
  }, Mo.runningTool)), { figureVoice: m, figureHere: p, shownVoice: b, runningTool: s, waitingFor: o, thinking: l, asking: i, heardAt: u, toolRunning: $, commandShown: y };
}
const Qs = E(0), fI = _(() => Qs.value > 0);
function mI() {
  Qs.value += 1, Be(() => {
    Qs.value -= 1;
  });
}
const bn = (e) => typeof e == "number" ? e : Date.parse(e);
function hI(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: bn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => bn(s.row.created_at) - bn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Ql = 20;
async function pI(e, t, n) {
  for (let a = 0; a < Ql; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || bn(o.created_at) <= bn(s.created_at) || !await n()) return a;
  }
  return Ql;
}
const w8 = 3, ys = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function $8(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ys[n.grouping]) == null ? void 0 : a.call(ys, e.row, n)) || "";
}
function x8(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function vI(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= w8 ? [x8(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = $8(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const gI = (e) => (t) => t.filter((n) => n.id !== e), yI = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), bI = (e) => (t) => [...t, e], kI = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function wI(e, t = {}) {
  const n = at(), a = E(null), s = E("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function $I(e) {
  const t = at(), n = E("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const aa = /* @__PURE__ */ new Map();
function S8(e, t) {
  if (aa.has(e)) return aa.get(e);
  const n = t().finally(() => aa.delete(e));
  return aa.set(e, n), n;
}
function xI() {
  const e = at(), t = E(null), n = E("");
  async function a() {
    const s = await S8(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const M8 = { class: "cards-page" }, _8 = { class: "cards-bar" }, C8 = { class: "cards-count" }, E8 = { class: "cards" }, A8 = {
  key: 1,
  class: "cards-note"
}, O8 = {
  key: 2,
  class: "cards-note"
}, T8 = ["data-row", "onClick"], I8 = { class: "card-head" }, B8 = { class: "card-title" }, R8 = { class: "card-foot" }, L8 = {
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
    return (a, s) => (r(), d("div", M8, [
      h("div", _8, [
        h("span", C8, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(re, De({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: q(() => [
            A(ae, {
              name: "plus",
              size: 12
            }),
            U(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      h("div", E8, [
        e.loaded ? e.failure ? (r(), d("p", A8, v(e.failure), 1)) : e.rows.length ? w("", !0) : (r(), d("p", O8, "No " + v(e.term) + "s yet", 1)) : (r(), P(nt, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(R, null, X(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          h("span", I8, [
            A(ae, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            U(" " + v(e.head(o)), 1),
            A(Xe, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          h("span", B8, v(e.title(o)), 1),
          h("span", R8, v(e.foot(o)), 1)
        ], 8, T8))), 128))
      ]),
      ne(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, SI = /* @__PURE__ */ H(L8, [["__scopeId", "data-v-b39fea5d"]]), Xl = "newest";
function MI(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Se(Le, null)) == null ? void 0 : c.search, s = E(""), o = E(Xl), l = E("all"), i = _(() => {
    const f = s.value.trim().toLowerCase(), m = e.value.filter((p) => Br(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Xl ? m : [...m].sort((p, b) => t(p).localeCompare(t(b)));
  }), u = _(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const N8 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, q8 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, D8 = 40, P8 = "top", j8 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Se(Le, null)) == null ? void 0 : p.autoScroll, s = _(() => a === P8), o = E(null), l = E(!1), i = (b) => s.value ? b.scrollTop : b.scrollHeight - b.scrollTop - b.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var b;
      l.value = i(o.value) >= D8, s.value || (b = n.feed) == null || b.reachTop(o.value);
    }
    fe(() => {
      var b;
      return [n.rowCount, (b = n.feed) == null ? void 0 : b.isLoaded()];
    }, async () => {
      await Ne(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let m = null;
    return Ce(() => {
      typeof MutationObserver > "u" || (m = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), m.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), tt(() => m == null ? void 0 : m.disconnect()), t({ pane: o }), (b, $) => (r(), d("div", N8, [
      h("div", {
        ref_key: "pane",
        ref: o,
        class: K(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ne(b.$slots, "default", {}, void 0, !0)
      ], 34),
      h("div", q8, [
        A(an, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: q(() => [
            ke(h("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              A(ae, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              $[0] || ($[0] = U(" Newest ", -1))
            ], 512), [
              [no, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, _I = /* @__PURE__ */ H(j8, [["__scopeId", "data-v-d704d7e3"]]), F8 = ["aria-selected", "data-tab", "onClick"], W8 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, H8 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Se(Le, null), o = _(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = E(null), i = E({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var $;
      const b = ($ = l.value) == null ? void 0 : $.querySelector(".inner-tab.on");
      if (!b) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: b.offsetLeft, width: b.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, b.offsetLeft - 12));
    }
    const f = () => Ne(() => c(!0));
    let m = null;
    return Ce(() => {
      var p;
      c(!1), m = new ResizeObserver(() => c(!1)), m.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Be(() => m == null ? void 0 : m.disconnect()), fe(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), fe(() => n.answer, f, { deep: !0 }), (p, b) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(R, null, X(o.value, ($) => {
        var y, k;
        return r(), d("button", {
          key: $.key,
          type: "button",
          role: "tab",
          class: K(["inner-tab", { on: ((y = e.active) == null ? void 0 : y.key) === $.key }]),
          "aria-selected": ((k = e.active) == null ? void 0 : k.key) === $.key,
          "data-tab": $.key,
          onClick: (S) => a("choose", $)
        }, [
          U(v($.label) + " ", 1),
          u($) ? (r(), d("span", W8, v(e.answer[$.count_field]), 1)) : w("", !0)
        ], 10, F8);
      }), 128)),
      h("i", {
        class: K(["inner-tabs-line", { slides: i.value.slides }]),
        style: ye({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, z8 = /* @__PURE__ */ H(H8, [["__scopeId", "data-v-63fcd326"]]), U8 = { class: "task-bar" }, V8 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", U8, [
      h("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: ye({ width: `${n(e.done)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: ye({ width: `${n(e.testing)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-started",
        "data-task-bar-started": "",
        style: ye({ width: `${n(e.started)}%` })
      }, null, 4)
    ]));
  }
}, CI = /* @__PURE__ */ H(V8, [["__scopeId", "data-v-eafa73d4"]]), G8 = {
  class: "tab-body",
  "data-tab-body": ""
}, K8 = { "data-tab-content": "" }, Y8 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = E(!1);
    let a = 0;
    return fe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ao(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", G8, [
      n.value ? (r(), P(nt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : w("", !0),
      ke(h("div", K8, [
        ne(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [no, !n.value]
      ])
    ]));
  }
}, Q8 = /* @__PURE__ */ H(Y8, [["__scopeId", "data-v-63876533"]]), X8 = {
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
    return (o, l) => (r(), P(Dr, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: q(() => [
        A(xt, null, {
          default: q(() => [...l[2] || (l[2] = [
            U("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(R, null, X(a, (i) => A(He, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: q(() => [
            U(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(R, { key: 0 }, [
          A(xt, null, {
            default: q(() => [...l[3] || (l[3] = [
              U("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(R, null, X(s, (i) => A(He, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: q(() => [
              U(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : w("", !0)
      ]),
      default: q(() => [
        ne(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, EI = /* @__PURE__ */ H(X8, [["__scopeId", "data-v-dab0064d"]]);
function AI() {
  const e = E(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const OI = (e) => import(
  /* @vite-ignore */
  e
), J8 = 86400, Xs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Z8(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Xs(t) - Xs(e)) / J8);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function TI(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Xs(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Z8(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const bs = 280, ks = 240, ws = 120, e3 = 6, t3 = 14, On = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function n3(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Ou(e, t) {
  const n = Math.max(0, n3(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function a3(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${t3}px)` }), e.offsetHeight, e.style.transition = `height ${bs}ms ${On}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, m = () => {
    if (c) return;
    n() && (t.scrollTop = Ou(t, e));
    const p = s() - i;
    if (!u && p >= bs && (u = !0, e.style.transition = `opacity ${ks}ms ease-out, transform ${ks}ms ${On}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < bs + ks) return a(m);
    f();
  };
  return a(m), f;
}
function II(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${e3}px)` }), e.offsetHeight, e.style.transition = `opacity ${ws}ms ease-out, transform ${ws}ms ${On}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Ou(t, e)), s() - l < ws) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const s3 = 140, sa = 220, Jl = 5;
function BI({ gap: e = s3, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, m) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), m();
    });
  }
  function u() {
    const f = n.splice(0, Jl);
    if (s = f.length > 0, !s) return;
    let m = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        m -= 1, m || (o = t(u, e));
      });
  }
  const c = (f, m, p, b = a3) => {
    if (l || !m.pane || !m.follows()) return p();
    const $ = { el: f, options: m, done: p, arrival: b, display: f.style.display || "" };
    if (!s)
      return s = !0, i($, () => o = t(u, e));
    f.style.display = "none", n.push($), n.length >= Jl && c.flush();
  };
  return c.flush = () => {
    var f;
    l = !0, queueMicrotask(() => l = !1);
    for (const m of [...a]) (f = m.cancel) == null || f.call(m);
    clearTimeout(o), s = !1;
    for (const m of n.splice(0))
      m.el.style.display = m.display, m.done();
  }, c;
}
function RI(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${sa}ms ${On}, opacity ${sa}ms ease-in, margin ${sa}ms ${On}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, sa);
}
const Tu = "chat.pins.minimised", ca = E(fa(Tu, !1));
function Zl(e) {
  ca.value = e, go(Tu, e);
}
function o3(e) {
  const t = _(() => e()), n = _(() => ca.value ? [] : e()), a = () => Zl(!ca.value), s = Date.now() / 1e3;
  return fe(
    () => t.value.filter((o) => jt(o) > s).length,
    (o, l) => o > l && Zl(!1)
  ), { pins: t, visible: n, minimised: ca, toggle: a };
}
const l3 = ["title"], i3 = {
  key: 0,
  class: "pins-count"
}, r3 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = o3(() => t.pinRows);
    return (o, l) => O(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: K(["pins-toggle", { minimised: O(a), inline: e.inline }]),
      title: O(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = ge((...i) => O(s) && O(s)(...i), ["stop"]))
    }, [
      A(ae, {
        name: O(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      O(a) ? (r(), d("span", i3, v(O(n).length), 1)) : w("", !0)
    ], 10, l3)) : w("", !0);
  }
}, LI = /* @__PURE__ */ H(r3, [["__scopeId", "data-v-d073c504"]]), u3 = ["title"], c3 = ["title"], d3 = { class: "diff-card-dir" }, f3 = { class: "diff-card-name" }, m3 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, h3 = ["title"], p3 = ["title"], v3 = {
  key: 0,
  class: "diff-card-note"
}, g3 = ["href"], y3 = ["src", "alt"], b3 = { class: "diff-card-rows" }, k3 = { class: "diff-row-num" }, w3 = { class: "diff-row-sign" }, $3 = { class: "diff-row-code" }, x3 = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    change: { type: String, required: !0 },
    from: { type: String, default: "" },
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
    const l = () => ({
      head: n.path,
      items: [
        { label: "Open file", group: "open", disabled: p.value, reason: "Deleted", run: () => location.hash = Ba.file(n.path) },
        { label: n.folded ? "Unfold" : "Fold", group: "open", disabled: p.value, reason: "Deleted", run: () => a("fold") },
        { label: "Copy path", group: "copy", run: ({ say: M }) => en(n.path, "the path", M) }
      ]
    }), i = { new: "created", deleted: "deleted", moved: "moved" }, u = { add: "+", del: "−" }, c = _(() => n.path.lastIndexOf("/") + 1), f = _(() => n.path.slice(0, c.value)), m = _(() => n.path.slice(c.value)), p = _(() => n.change === "deleted"), b = _(() => i[n.change]), $ = _(() => new Set(n.rows.filter((M) => M.line_type === "add").map((M) => M.line))), y = E("after"), k = _(() => y.value === "before" ? n.whole.old : n.whole.text), S = _(() => n.whole && n.whole.text !== void 0 ? k.value.split(`
`).map((M, g) => ({ line_type: y.value === "after" && $.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: M })) : n.rows.filter(
      (M) => !(n.editsOnly && ["ctx", "fold"].includes(M.line_type)) && !(n.hideRemovals && M.line_type === "del")
    )), C = E(!1), N = _(() => n.lines && !C.value && !n.whole), D = _(() => N.value ? S.value.slice(0, n.lines) : S.value), I = _(() => S.value.length - D.value.length), G = (M) => M.line === null || M.line_type === "del" ? "" : M.line, F = (M) => M.line_type === "fold" ? M.hidden ? `⋯ ${M.hidden} lines` : "⋯" : M.text, B = E(null), j = E(null);
    let V = null;
    return Ce(() => {
      if (!j.value) return;
      let M = !0;
      V = new ResizeObserver(() => {
        !B.value || !j.value || (B.value.style.transition = M ? "none" : "", B.value.style.height = `${j.value.offsetHeight}px`, M = !1);
      }), V.observe(j.value);
    }), Be(() => V && V.disconnect()), (M, g) => (r(), d("section", {
      class: K(["diff-card", { half: e.half, gone: p.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      ke((r(), d("header", {
        class: "diff-card-head",
        title: p.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: g[3] || (g[3] = (x) => !p.value && a("fold"))
      }, [
        h("span", {
          class: "diff-card-path",
          title: `${e.path} · ${O(s)}-click to open it`,
          onClick: o
        }, [
          h("span", d3, v(f.value), 1),
          h("span", f3, v(m.value), 1),
          b.value ? (r(), d("span", {
            key: 0,
            class: K(["diff-card-badge", e.change])
          }, v(b.value), 3)) : w("", !0),
          e.from ? (r(), d("span", m3, "from " + v(e.from), 1)) : w("", !0)
        ], 8, c3),
        h("span", {
          class: K(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        h("span", {
          class: K(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        A(Xe, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        h("button", {
          type: "button",
          class: "diff-card-open",
          title: "Open in the inspector",
          "aria-label": "Open in the inspector",
          "data-diff-open": "",
          onClick: g[0] || (g[0] = ge((x) => O(Xm)(e.path), ["stop"]))
        }, [
          A(ae, {
            name: "open",
            size: 13
          })
        ]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[1] || (g[1] = ge((x) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, v(y.value === "after" ? "After" : "Before"), 9, h3)) : w("", !0),
        p.value ? w("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: K(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[2] || (g[2] = ge((x) => a("whole"), ["stop"]))
        }, [
          A(ae, {
            name: "file",
            size: 12
          })
        ], 10, p3))
      ], 8, u3)), [
        [O(Et), l]
      ]),
      e.whole && e.whole.error ? (r(), d("p", v3, v(e.whole.error), 1)) : w("", !0),
      !p.value && !e.folded ? (r(), d(R, { key: 1 }, [
        e.picture ? (r(), d("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          h("img", {
            src: e.picture,
            alt: m.value,
            loading: "lazy"
          }, null, 8, y3)
        ], 8, g3)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: B,
          class: "diff-card-grow"
        }, [
          h("div", {
            ref_key: "body",
            ref: j,
            class: "diff-card-diff"
          }, [
            h("div", b3, [
              (r(!0), d(R, null, X(D.value, (x, T) => (r(), d("div", {
                key: T,
                class: K(["diff-row", x.line_type, { fresh: e.fresh && x.edit === e.fresh }])
              }, [
                h("span", k3, v(G(x)), 1),
                h("span", w3, v(u[x.line_type]), 1),
                h("span", $3, v(F(x)), 1)
              ], 2))), 128)),
              I.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[4] || (g[4] = ge((x) => C.value = !0, ["stop"]))
              }, v(I.value) + " more " + v(I.value === 1 ? "line" : "lines"), 1)) : w("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : w("", !0)
    ], 2));
  }
}, NI = /* @__PURE__ */ H(x3, [["__scopeId", "data-v-543e1e74"]]), S3 = {
  instant: "Hooks, journal commands and viewer requests. Each takes 1 slot.",
  short: "Reads, searches, edits and git. Each takes 1 slot.",
  long: "Tests, builds, checks, installs and plugins. A test, a build or a check takes 4 slots, an install 2."
}, M3 = { "test run": "test", "version control": "git", package: "install", "background job": "job" }, Iu = (e) => `${e[0].toUpperCase()}${e.slice(1)}`, Bu = (e) => `${Iu(e.lane)} lane`, Ru = (e) => M3[e] || e.split(" ").at(-1), Js = (e) => e === 0 ? "no slot" : e === 1 ? "1 slot" : `${e} slots`, mn = (e) => e.halt_type === "command", _3 = {
  class: "tiles",
  "data-queue-controls": ""
}, C3 = ["data-queue-tile", "onClick"], E3 = {
  key: 0,
  class: "chip"
}, A3 = {
  key: 1,
  class: "chip"
}, O3 = { "data-queue-tile-use": "" }, T3 = {
  __name: "ProcessQueueControls",
  props: { lanes: { type: Array, required: !0 } },
  setup(e) {
    function t(n, a) {
      n.currentTarget.closest("[data-test-queue]").querySelector(`[data-lane="${a.lane}"]`).scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return (n, a) => (r(), d("div", _3, [
      (r(!0), d(R, null, X(e.lanes, (s) => (r(), d("button", {
        key: s.lane,
        type: "button",
        class: "tile",
        "data-queue-tile": s.lane,
        onClick: (o) => t(o, s)
      }, [
        h("small", null, [
          U(v(O(Iu)(s.lane)), 1),
          O(mn)(s) ? (r(), d("span", E3, "Paused")) : s.halted ? (r(), d("span", A3, "Held")) : w("", !0)
        ]),
        h("b", O3, [
          U(v(s.used), 1),
          h("span", null, " of " + v(s.capacity), 1)
        ]),
        h("span", {
          class: K(["meter", { warn: s.halted, bad: !s.halted && s.over_capacity }])
        }, [
          h("i", {
            style: ye({ width: `${Math.min(100, s.used / s.capacity * 100)}%` })
          }, null, 4)
        ], 2),
        h("span", {
          class: K(["sub", { on: s.waiting.length }]),
          "data-queue-tile-waiting": ""
        }, v(s.waiting.length ? `${s.waiting.length} waiting` : "Nothing waits"), 3)
      ], 8, C3))), 128))
    ]));
  }
}, I3 = /* @__PURE__ */ H(T3, [["__scopeId", "data-v-b55ad746"]]), B3 = ["data-queue-row", "data-queue-process"], R3 = ["aria-expanded"], L3 = { class: "run-line" }, N3 = { class: "leading" }, q3 = {
  key: 0,
  "data-queue-position": ""
}, D3 = ["title"], P3 = { class: "command" }, j3 = {
  class: "time",
  "data-queue-time": ""
}, F3 = { class: "details" }, W3 = { "data-queue-lane": "" }, H3 = { "data-queue-type": "" }, z3 = { class: "failed" }, U3 = { class: "drop-inner" }, V3 = { class: "output" }, G3 = { class: "output-heading" }, K3 = ["title"], Y3 = ["title"], Q3 = ["href"], X3 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(), o = Wr((y) => n.read([...y, "--limit", "50"]), () => n.run.id), l = o.lines, i = Co(), u = _(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = _(() => {
      const y = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!y) return "";
      const k = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, S = Math.max(0, Math.floor((k - new Date(y).getTime()) / 1e3));
      return S < 60 ? `${S} s` : S < 3600 ? `${Math.floor(S / 60)} m ${S % 60} s` : `${Math.floor(S / 3600)} h ${String(Math.floor(S / 60) % 60).padStart(2, "0")} m`;
    }), f = _(() => n.run.section === "waiting" || !n.run.started_at ? "" : on(n.run.started_at, i.value * 1e3)), m = _(() => n.run.section === "waiting" ? "Waiting for" : n.run.ended_at ? "Ran for" : "Running for");
    async function p() {
      if (!n.expanded) return;
      const y = s.value, k = y.scrollHeight - y.scrollTop - y.clientHeight < 2;
      await o.follow(), await Ne(), n.expanded && k && (y.scrollTop = y.scrollHeight);
    }
    async function b() {
      n.expanded && (await o.newest(), await Ne(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    const $ = () => ({
      head: Sn(n.run.line, 40),
      items: [
        { label: n.expanded ? "Hide output" : "Show output", group: "open", run: () => a("toggle") },
        { label: "Copy command", group: "copy", run: ({ say: y }) => en(n.run.line, "the command", y) },
        { label: "Open its task", group: "copy", disabled: !n.run.task_id, reason: "No task", run: () => it("tasks", n.run.task_id) }
      ]
    });
    return fe(() => n.expanded, b, { immediate: !0 }), qn(["output.*"], p, (y) => ki(y, /* @__PURE__ */ new Set([n.run.id]))), (y, k) => ke((r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      h("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: k[2] || (k[2] = (S) => a("toggle")),
        onKeydown: [
          k[3] || (k[3] = Ve(ge((S) => a("toggle"), ["prevent"]), ["enter"])),
          k[4] || (k[4] = Ve(ge((S) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        h("div", L3, [
          h("span", N3, [
            e.run.section === "waiting" ? (r(), d("span", q3, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: K(["dot", { passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, D3))
          ]),
          h("code", P3, v(e.run.line), 1),
          h("span", j3, v(c.value), 1),
          A(ae, {
            class: K(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        h("div", F3, [
          e.run.lane ? (r(), d(R, { key: 0 }, [
            h("span", W3, v(O(Bu)(e.run)), 1),
            k[6] || (k[6] = h("span", { class: "separator" }, "·", -1))
          ], 64)) : w("", !0),
          h("span", H3, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(R, { key: 1 }, [
            k[7] || (k[7] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: k[0] || (k[0] = ge((S) => O(it)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(R, { key: 2 }, [
            k[8] || (k[8] = h("span", { class: "separator" }, "·", -1)),
            k[9] || (k[9] = h("span", null, "Main agent", -1))
          ], 64)) : w("", !0),
          e.run.task_id ? (r(), d(R, { key: 3 }, [
            k[10] || (k[10] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: k[1] || (k[1] = ge((S) => O(it)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : w("", !0),
          e.run.state === "failed" ? (r(), d(R, { key: 4 }, [
            k[11] || (k[11] = h("span", { class: "separator" }, "·", -1)),
            h("span", z3, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : w("", !0)
        ])
      ], 40, R3),
      h("div", {
        class: K(["drop", { open: e.expanded }])
      }, [
        h("div", U3, [
          h("div", V3, [
            h("div", G3, [
              h("span", null, [
                U("Output " + v(e.run.id), 1),
                e.run.task_id ? (r(), d(R, { key: 0 }, [
                  U(" · Task " + v(e.run.task_id), 1)
                ], 64)) : w("", !0),
                f.value ? (r(), d(R, { key: 1 }, [
                  k[12] || (k[12] = U(" · ", -1)),
                  h("span", {
                    class: "started",
                    "data-queue-started": "",
                    title: O(qs)(e.run.started_at)
                  }, "Started " + v(f.value), 9, K3)
                ], 64)) : w("", !0),
                c.value ? (r(), d(R, { key: 2 }, [
                  k[13] || (k[13] = U(" · ", -1)),
                  h("span", {
                    title: m.value,
                    "data-queue-duration": ""
                  }, v(c.value), 9, Y3)
                ], 64)) : w("", !0)
              ]),
              h("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Q3)
            ]),
            h("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: k[5] || (k[5] = (S) => e.expanded && O(o).loadEarlier(S.target))
            }, [
              k[14] || (k[14] = h("span", { class: "prompt" }, "$ ", -1)),
              U(v(e.run.line), 1),
              O(l).length ? (r(), d(R, { key: 0 }, [
                U(v(`
` + O(l).join(`
`)), 1)
              ], 64)) : w("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, B3)), [
      [O(Et), $]
    ]);
  }
}, J3 = /* @__PURE__ */ H(X3, [["__scopeId", "data-v-f528b4c6"]]), Lu = ["instant", "short", "long"], Nu = ["background", "normal", "agent", "reserved", "immediate"], Z3 = [
  { name: "small", title: "Small machine" },
  { name: "medium", title: "Medium machine" },
  { name: "large", title: "Large machine" }
];
function qu(e) {
  return ["--lane", e.lane, "--cost", String(e.cost), "--priority", e.priority, "--limit", String(e.limit)];
}
const eS = ["data-class-row"], tS = { scope: "row" }, nS = { key: 0 }, aS = ["value"], sS = ["value"], oS = { class: "actions" }, lS = ["disabled"], iS = ["disabled"], rS = { class: "actions" }, uS = ["disabled"], cS = ["disabled"], dS = ["disabled"], fS = {
  __name: "ExecutionClassRow",
  props: { entry: { type: Object, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E({}), l = { "built-in": "Built in", changed: "Changed", "your own": "Your own" };
    function i() {
      o.value = { ...n.entry }, s.value = !0;
    }
    function u() {
      a("send", ["queue-class", "set", n.entry.name, ...qu(o.value)], () => s.value = !1);
    }
    return (c, f) => (r(), d("tr", {
      "data-class-row": e.entry.name
    }, [
      h("th", tS, [
        U(v(e.entry.name), 1),
        e.entry.pattern || e.entry.plugin ? (r(), d("small", nS, v(e.entry.pattern || `plugin ${e.entry.plugin}`), 1)) : w("", !0)
      ]),
      s.value ? (r(), d(R, { key: 0 }, [
        h("td", null, [
          ke(h("select", {
            "onUpdate:modelValue": f[0] || (f[0] = (m) => o.value.lane = m),
            "aria-label": "Lane",
            "data-class-lane": ""
          }, [
            (r(!0), d(R, null, X(O(Lu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, aS))), 128))
          ], 512), [
            [Pt, o.value.lane]
          ])
        ]),
        h("td", null, [
          ke(h("input", {
            "onUpdate:modelValue": f[1] || (f[1] = (m) => o.value.cost = m),
            type: "number",
            min: "0",
            "aria-label": "Slots",
            "data-class-cost": ""
          }, null, 512), [
            [
              Ue,
              o.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", null, [
          ke(h("select", {
            "onUpdate:modelValue": f[2] || (f[2] = (m) => o.value.priority = m),
            "aria-label": "Priority",
            "data-class-priority": ""
          }, [
            (r(!0), d(R, null, X(O(Nu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, sS))), 128))
          ], 512), [
            [Pt, o.value.priority]
          ])
        ]),
        h("td", null, [
          ke(h("input", {
            "onUpdate:modelValue": f[3] || (f[3] = (m) => o.value.limit = m),
            type: "number",
            min: "0",
            "aria-label": "At once, 0 for no limit",
            "data-class-limit": ""
          }, null, 512), [
            [
              Ue,
              o.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", oS, [
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-save": "",
            onClick: u
          }, "Save", 8, lS),
          h("button", {
            type: "button",
            disabled: e.saving,
            onClick: f[4] || (f[4] = (m) => s.value = !1)
          }, "Cancel", 8, iS)
        ])
      ], 64)) : (r(), d(R, { key: 1 }, [
        h("td", null, v(e.entry.lane), 1),
        h("td", null, v(e.entry.cost), 1),
        h("td", null, v(e.entry.priority), 1),
        h("td", null, v(e.entry.limit || "no limit"), 1),
        h("td", rS, [
          h("span", {
            class: K(["origin", { own: e.entry.origin !== "built-in" }])
          }, v(l[e.entry.origin]), 3),
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-edit": "",
            onClick: i
          }, "Edit", 8, uS),
          e.entry.origin === "changed" ? (r(), d("button", {
            key: 0,
            type: "button",
            disabled: e.saving,
            "data-class-reset": "",
            onClick: f[5] || (f[5] = (m) => a("send", ["queue-class", "reset", e.entry.name]))
          }, "Reset", 8, cS)) : w("", !0),
          e.entry.origin === "your own" ? (r(), d("button", {
            key: 1,
            type: "button",
            disabled: e.saving,
            "data-class-remove": "",
            onClick: f[6] || (f[6] = (m) => a("send", ["queue-class", "remove", e.entry.name]))
          }, "Remove", 8, dS)) : w("", !0)
        ])
      ], 64))
    ], 8, eS));
  }
}, mS = /* @__PURE__ */ H(fS, [["__scopeId", "data-v-20ea89e6"]]), hS = { class: "fields" }, pS = ["disabled"], vS = ["disabled"], gS = ["value"], yS = ["value"], bS = { class: "buttons" }, kS = ["disabled"], wS = ["disabled"], $S = {
  key: 0,
  class: "preview",
  "data-class-preview-lines": ""
}, xS = { key: 1 }, SS = {
  key: 1,
  class: "hint"
}, MS = {
  key: 2,
  class: "failure",
  role: "alert"
}, _S = {
  __name: "ExecutionClassForm",
  props: { read: { type: Function, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E({ name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0 }), o = E(null), l = E(""), i = _(() => s.value.pattern ? ["--pattern", s.value.pattern] : s.value.plugin ? ["--plugin", s.value.plugin] : []);
    fe(() => [s.value.pattern, s.value.plugin], () => o.value = null);
    async function u() {
      const f = await n.read(["queue-class", "preview", ...i.value]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.lines : null;
    }
    function c() {
      a("send", ["queue-class", "add", s.value.name, ...i.value, ...qu(s.value)], () => {
        s.value = { ...s.value, name: "", pattern: "", plugin: "" };
      });
    }
    return (f, m) => (r(), d("form", {
      class: "add",
      "data-class-form": "",
      onSubmit: ge(c, ["prevent"])
    }, [
      h("div", hS, [
        h("label", null, [
          m[7] || (m[7] = U("Name", -1)),
          ke(h("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (p) => s.value.name = p),
            required: "",
            "data-class-name": ""
          }, null, 512), [
            [
              Ue,
              s.value.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[8] || (m[8] = U("Line pattern", -1)),
          ke(h("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (p) => s.value.pattern = p),
            placeholder: "for example ^npm run e2e",
            disabled: !!s.value.plugin,
            "data-class-pattern": ""
          }, null, 8, pS), [
            [Ue, s.value.pattern]
          ])
        ]),
        h("label", null, [
          m[9] || (m[9] = U("Or plugin", -1)),
          ke(h("input", {
            "onUpdate:modelValue": m[2] || (m[2] = (p) => s.value.plugin = p),
            disabled: !!s.value.pattern,
            "data-class-plugin": ""
          }, null, 8, vS), [
            [
              Ue,
              s.value.plugin,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[10] || (m[10] = U("Lane", -1)),
          ke(h("select", {
            "onUpdate:modelValue": m[3] || (m[3] = (p) => s.value.lane = p)
          }, [
            (r(!0), d(R, null, X(O(Lu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, gS))), 128))
          ], 512), [
            [Pt, s.value.lane]
          ])
        ]),
        h("label", null, [
          m[11] || (m[11] = U("Slots", -1)),
          ke(h("input", {
            "onUpdate:modelValue": m[4] || (m[4] = (p) => s.value.cost = p),
            type: "number",
            min: "0"
          }, null, 512), [
            [
              Ue,
              s.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[12] || (m[12] = U("Priority", -1)),
          ke(h("select", {
            "onUpdate:modelValue": m[5] || (m[5] = (p) => s.value.priority = p)
          }, [
            (r(!0), d(R, null, X(O(Nu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, yS))), 128))
          ], 512), [
            [Pt, s.value.priority]
          ])
        ]),
        h("label", null, [
          m[13] || (m[13] = U("At once", -1)),
          ke(h("input", {
            "onUpdate:modelValue": m[6] || (m[6] = (p) => s.value.limit = p),
            type: "number",
            min: "0",
            title: "0 for no limit"
          }, null, 512), [
            [
              Ue,
              s.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      h("div", bS, [
        h("button", {
          type: "button",
          disabled: !i.value.length,
          "data-class-preview": "",
          onClick: u
        }, "Show matching lines", 8, kS),
        h("button", {
          type: "submit",
          disabled: e.saving || o.value === null || !s.value.name,
          "data-class-add": ""
        }, "Add class", 8, wS)
      ]),
      o.value !== null ? (r(), d("div", $S, [
        o.value.length ? (r(), d(R, { key: 0 }, [
          h("p", null, v(o.value.length) + " recent lines would have matched:", 1),
          (r(!0), d(R, null, X(o.value, (p) => (r(), d("code", { key: p }, v(p), 1))), 128))
        ], 64)) : (r(), d("p", xS, "No recent line would have matched."))
      ])) : i.value.length ? (r(), d("p", SS, "See which recent lines the class would match before you add it.")) : w("", !0),
      l.value ? (r(), d("p", MS, v(l.value), 1)) : w("", !0)
    ], 32));
  }
}, CS = /* @__PURE__ */ H(_S, [["__scopeId", "data-v-6e42f7c8"]]), ES = { "data-execution-classes": "" }, AS = ["id"], OS = ["aria-labelledby"], TS = ["disabled", "onClick"], IS = ["data-lane-setting"], BS = ["disabled", "onClick"], RS = { class: "control presets" }, LS = ["disabled", "data-class-preset", "onClick"], NS = { class: "scroll" }, qS = { "data-class-table": "" }, DS = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-class-failure": ""
}, PS = {
  __name: "ExecutionClasses",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = E(null), a = E(""), s = E(!1);
    async function o() {
      const i = await t.read(["queue-class", "list"]);
      i.ok ? n.value = i.value : a.value = i.error;
    }
    async function l(i, u = () => {
    }) {
      if (s.value) return;
      s.value = !0;
      const c = await t.read(i);
      a.value = c.ok ? "" : c.error, s.value = !1, c.ok && (u(), await o());
    }
    return Ce(o), (i, u) => (r(), d("section", ES, [
      A(Ct, { icon: "gauge" }, {
        default: q(() => [...u[0] || (u[0] = [
          U("Execution classes", -1)
        ])]),
        _: 1
      }),
      u[3] || (u[3] = h("p", { class: "lead" }, "Each run the journal starts belongs to a class, which says its lane, how many slots it takes and its priority.", -1)),
      n.value ? (r(), d(R, { key: 0 }, [
        (r(!0), d(R, null, X(n.value.settings, (c) => (r(), d("div", {
          key: c.key,
          class: "control"
        }, [
          h("div", null, [
            h("label", {
              id: c.key
            }, v(c.title), 9, AS),
            h("p", null, v(c.description), 1)
          ]),
          h("div", {
            class: "stepper",
            role: "group",
            "aria-labelledby": c.key
          }, [
            h("button", {
              type: "button",
              "aria-label": "One fewer",
              disabled: s.value || c.value <= 1,
              onClick: (f) => l(["setting", "set", c.key, String(c.value - 1)])
            }, "−", 8, TS),
            h("output", {
              "data-lane-setting": c.key
            }, v(c.value), 9, IS),
            h("button", {
              type: "button",
              "aria-label": "One more",
              disabled: s.value,
              onClick: (f) => l(["setting", "set", c.key, String(c.value + 1)])
            }, "+", 8, BS)
          ], 8, OS)
        ]))), 128)),
        h("div", RS, [
          u[1] || (u[1] = h("div", null, [
            h("label", null, "Size for this machine"),
            h("p", null, "Sets every lane's capacity from the number of processor cores.")
          ], -1)),
          (r(!0), d(R, null, X(O(Z3), (c) => (r(), d("button", {
            key: c.name,
            type: "button",
            disabled: s.value,
            "data-class-preset": c.name,
            onClick: (f) => l(["queue-class", "preset", c.name])
          }, v(c.title), 9, LS))), 128))
        ]),
        h("div", NS, [
          h("table", qS, [
            u[2] || (u[2] = h("thead", null, [
              h("tr", null, [
                h("th", { scope: "col" }, "Class"),
                h("th", { scope: "col" }, "Lane"),
                h("th", { scope: "col" }, "Slots"),
                h("th", { scope: "col" }, "Priority"),
                h("th", { scope: "col" }, "At once"),
                h("th", { scope: "col" }, [
                  h("span", { class: "hidden" }, "Actions")
                ])
              ])
            ], -1)),
            h("tbody", null, [
              (r(!0), d(R, null, X(n.value.classes, (c) => (r(), P(mS, {
                key: c.name,
                entry: c,
                saving: s.value,
                onSend: l
              }, null, 8, ["entry", "saving"]))), 128))
            ])
          ])
        ]),
        A(CS, {
          read: e.read,
          saving: s.value,
          onSend: l
        }, null, 8, ["read", "saving"])
      ], 64)) : w("", !0),
      a.value ? (r(), d("p", DS, v(a.value), 1)) : w("", !0)
    ]));
  }
}, jS = /* @__PURE__ */ H(PS, [["__scopeId", "data-v-bd3e5ac3"]]), FS = { "data-queue-settings": "" }, WS = ["for"], HS = ["id", "value", "disabled", "onChange"], zS = {
  key: 0,
  class: "failure",
  role: "alert"
}, US = {
  __name: "ProcessQueueSettings",
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
    return (i, u) => (r(), d("div", FS, [
      (r(!0), d(R, null, X(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        h("div", null, [
          h("label", {
            for: c.key
          }, v(c.title), 9, WS),
          h("p", null, v(c.description), 1)
        ]),
        h("input", {
          id: c.key,
          class: "limit",
          type: "number",
          min: "0",
          value: c.value,
          disabled: s.value,
          "data-queue-suite-limit": "",
          onChange: (f) => l(c.key, f.target.value)
        }, null, 40, HS)
      ]))), 128)),
      o.value ? (r(), d("p", zS, v(o.value), 1)) : w("", !0),
      A(jS, { read: e.read }, null, 8, ["read"])
    ]));
  }
}, VS = /* @__PURE__ */ H(US, [["__scopeId", "data-v-1b1c7570"]]), GS = ["data-lane-entry"], KS = ["aria-expanded"], YS = { class: "lead" }, QS = {
  key: 0,
  "data-lane-position": ""
}, XS = ["title"], JS = {
  class: "kind",
  "data-lane-kind": ""
}, ZS = { class: "command" }, e6 = { class: "text" }, t6 = ["title"], n6 = {
  key: 1,
  title: "Waits for a reader"
}, a6 = ["title"], s6 = {
  class: "cost",
  "data-lane-takes": ""
}, o6 = { class: "who" }, l6 = { class: "time" }, i6 = {
  key: 0,
  class: "facts",
  "data-lane-facts": ""
}, r6 = ["href"], u6 = {
  __name: "ExecutionLaneRow",
  props: {
    entry: { type: Object, required: !0 },
    waiting: Boolean,
    position: { type: Number, required: !0 },
    waitCount: { type: Number, required: !0 },
    why: { type: String, required: !0 },
    laneName: { type: String, required: !0 },
    environment: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, n = E(!1), a = _(() => t.entry.reason === "waits for a reader"), s = _(() => [
      ["Class", t.entry.class],
      ["Priority", t.entry.raised_from ? `${t.entry.priority}, moved up from ${t.entry.raised_from} after a long wait` : t.entry.priority],
      ["Started by", t.entry.starter],
      [t.waiting ? "Waiting for" : "Running for", Zt(t.entry.seconds, !0)],
      ["Takes", Js(t.entry.slot_cost)],
      ...t.waiting ? [["Place", `${t.position} of ${t.waitCount} in the ${t.laneName.toLowerCase()}`], ["Why it waits", a.value ? "Waits for a reader" : t.why]] : [],
      ...t.entry.parent_line ? [["For", t.entry.parent_line]] : []
    ]);
    return (o, l) => (r(), d("div", {
      class: K(["run", { open: n.value }]),
      "data-lane-entry": e.waiting ? "waiting" : "running"
    }, [
      h("button", {
        type: "button",
        class: "line",
        "aria-expanded": n.value,
        onClick: l[0] || (l[0] = (i) => n.value = !n.value)
      }, [
        h("span", YS, [
          e.waiting ? (r(), d("span", QS, v(e.position), 1)) : (r(), d("span", {
            key: 1,
            class: K(["dot", { free: !e.entry.slot_cost }]),
            title: e.entry.slot_cost ? "In a slot" : "Without a slot"
          }, null, 10, XS))
        ]),
        h("span", JS, v(O(Ru)(e.entry.kind)), 1),
        h("span", ZS, [
          h("span", e6, v(e.entry.line), 1),
          e.waiting && e.entry.raised_from ? (r(), d("em", {
            key: 0,
            class: "up",
            title: `Moved up from ${e.entry.raised_from} after a long wait`
          }, "moved up", 8, t6)) : w("", !0),
          a.value ? (r(), d("em", n6, "reader")) : w("", !0),
          e.entry.parent_line ? (r(), d("em", {
            key: 2,
            title: `Runs for ${e.entry.parent_line}`
          }, "for " + v(e.entry.parent_line), 9, a6)) : w("", !0)
        ]),
        h("span", s6, v(O(Js)(e.entry.slot_cost)), 1),
        h("span", o6, v(e.entry.starter), 1),
        h("span", l6, v(O(Zt)(e.entry.seconds, !0)), 1),
        A(ae, {
          class: "chevron",
          name: "chevronRight",
          facing: "down",
          size: 11
        })
      ], 8, KS),
      n.value ? (r(), d("div", i6, [
        h("dl", null, [
          (r(!0), d(R, null, X(s.value, ([i, u]) => (r(), d(R, { key: i }, [
            h("dt", null, v(i), 1),
            h("dd", null, v(u), 1)
          ], 64))), 128))
        ]),
        e.entry.run_id ? (r(), d("a", {
          key: 0,
          class: "output",
          href: `?page=processes.output&output=${e.entry.run_id}&environment=${encodeURIComponent(e.environment)}`,
          target: "_blank",
          rel: "noopener",
          "data-lane-output": ""
        }, "Open its output", 8, r6)) : w("", !0)
      ])) : w("", !0)
    ], 10, GS));
  }
}, ei = /* @__PURE__ */ H(u6, [["__scopeId", "data-v-287a0ae3"]]), c6 = ["data-lane", "aria-label"], d6 = { class: "head" }, f6 = {
  class: "use",
  "data-lane-use": ""
}, m6 = {
  key: 0,
  class: "chip warn",
  "data-lane-state": ""
}, h6 = {
  key: 1,
  class: "chip warn",
  "data-lane-state": ""
}, p6 = {
  key: 2,
  class: "chip bad",
  "data-lane-state": ""
}, v6 = { class: "contents" }, g6 = {
  key: 1,
  class: "note",
  role: "status",
  "data-lane-note": ""
}, y6 = ["aria-label"], b6 = ["title", "data-lane-cell"], k6 = {
  key: 2,
  class: "empty",
  "data-lane-empty": ""
}, w6 = { class: "sub" }, $6 = {
  key: 0,
  class: "empty"
}, x6 = { class: "sub" }, S6 = {
  class: "why",
  "data-lane-why": ""
}, M6 = {
  key: 0,
  class: "empty"
}, _6 = {
  __name: "ExecutionLane",
  props: { lane: { type: Object, required: !0 }, kept: { type: Function, required: !0 }, environment: { type: String, required: !0 }, pausable: Boolean },
  emits: ["pause", "resume"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E(""), l = _(() => Bu(n.lane)), i = _(() => Math.max(0, n.lane.used - n.lane.capacity)), u = _(() => mn(n.lane) ? "The lane is paused" : n.lane.halted ? n.lane.halt_type === "update" ? "The lane is held for an update" : "The lane is held for a restart" : `No room: ${n.lane.used} of ${n.lane.capacity} slots in use`), c = _(() => mn(n.lane) ? "Paused" : n.lane.halted ? "Held" : u.value), f = _(() => n.lane.running.filter(n.kept)), m = _(() => n.lane.waiting.map(($, y) => ({ entry: $, position: y + 1 })).filter(({ entry: $ }) => n.kept($))), p = _(() => {
      let $ = 0;
      return [...n.lane.running.filter((k) => k.slot_cost > 0).map((k, S) => ($ += k.slot_cost, { key: `run:${S}`, cost: k.slot_cost, over: $ > n.lane.capacity, label: k.slot_cost >= 3 ? Ru(k.kind) : "", title: `${k.line} · ${Js(k.slot_cost)}` })), ...Array.from({ length: Math.max(0, n.lane.capacity - $) }, (k, S) => ({ key: `free:${S}`, cost: 1, free: !0, label: "", title: "Free" }))];
    });
    function b() {
      a("pause", o.value.trim()), s.value = !1, o.value = "";
    }
    return ($, y) => (r(), d("section", {
      class: K(["lane", { stopped: e.lane.halted }]),
      "data-lane": e.lane.lane,
      "aria-label": l.value
    }, [
      h("h3", d6, [
        U(v(l.value) + " ", 1),
        h("span", f6, [
          h("b", null, v(e.lane.used), 1),
          U(" of " + v(e.lane.capacity) + " slots", 1),
          e.lane.waiting.length ? (r(), d(R, { key: 0 }, [
            U(" · " + v(e.lane.waiting.length) + " waiting", 1)
          ], 64)) : w("", !0)
        ]),
        O(mn)(e.lane) ? (r(), d("span", m6, "Paused")) : e.lane.halted ? (r(), d("span", h6, "Held")) : i.value ? (r(), d("span", p6, v(i.value) + " over", 1)) : w("", !0),
        y[6] || (y[6] = h("span", { class: "grow" }, null, -1)),
        e.pausable && O(mn)(e.lane) ? (r(), P(re, {
          key: 3,
          small: "",
          variant: "primary",
          "data-lane-resume": "",
          onClick: y[0] || (y[0] = (k) => a("resume"))
        }, {
          default: q(() => [...y[4] || (y[4] = [
            U("Resume", -1)
          ])]),
          _: 1
        })) : w("", !0),
        e.pausable && !e.lane.halted && !s.value ? (r(), P(re, {
          key: 4,
          small: "",
          icon: "pause",
          "data-lane-pause": "",
          onClick: y[1] || (y[1] = (k) => s.value = !0)
        }, {
          default: q(() => [...y[5] || (y[5] = [
            U("Pause", -1)
          ])]),
          _: 1
        })) : w("", !0)
      ]),
      h("p", v6, v(O(S3)[e.lane.lane]), 1),
      s.value && !e.lane.halted ? (r(), d("form", {
        key: 0,
        class: "note",
        "data-lane-pause-form": "",
        onSubmit: ge(b, ["prevent"])
      }, [
        A(ae, {
          name: "pause",
          size: 13
        }),
        ke(h("input", {
          "onUpdate:modelValue": y[2] || (y[2] = (k) => o.value = k),
          class: "reason",
          required: "",
          placeholder: "Why is it paused?",
          "aria-label": "Reason"
        }, null, 512), [
          [Ue, o.value]
        ]),
        A(re, {
          small: "",
          variant: "primary",
          type: "submit"
        }, {
          default: q(() => [...y[7] || (y[7] = [
            U("Pause", -1)
          ])]),
          _: 1
        }),
        A(re, {
          small: "",
          onClick: y[3] || (y[3] = (k) => s.value = !1)
        }, {
          default: q(() => [...y[8] || (y[8] = [
            U("Cancel", -1)
          ])]),
          _: 1
        })
      ], 32)) : w("", !0),
      e.lane.halted ? (r(), d("div", g6, [
        A(ae, {
          name: "pause",
          size: 13
        }),
        A(Ft, {
          value: e.lane.halt_type
        }, {
          command: q(() => [
            h("span", null, [
              y[9] || (y[9] = h("b", null, "Paused", -1)),
              e.lane.halt_reason ? (r(), d(R, { key: 0 }, [
                U(" · " + v(e.lane.halt_reason), 1)
              ], 64)) : w("", !0),
              y[10] || (y[10] = U(". No waiting run starts here until it is resumed; what runs goes on.", -1))
            ])
          ]),
          update: q(() => [
            h("span", null, [
              y[11] || (y[11] = h("b", null, "Held for an update.", -1)),
              U(" The update waits for the running commands to end. Nothing new starts here until it is done; " + v(e.lane.waiting.length ? `the ${e.lane.waiting.length} waiting keep their place` : "nothing waits") + ".", 1)
            ])
          ]),
          restart: q(() => [
            h("span", null, [
              y[12] || (y[12] = h("b", null, "Held for a restart.", -1)),
              U(" The server is restarting. " + v(e.lane.waiting.length ? `The ${e.lane.waiting.length} waiting keep their place and start once it is back` : "Nothing waits") + ".", 1)
            ])
          ]),
          _: 1
        }, 8, ["value"])
      ])) : w("", !0),
      h("div", {
        class: K(["strip", { fine: e.lane.capacity > 16 }]),
        role: "img",
        "aria-label": `${e.lane.used} of ${e.lane.capacity} slots in use`,
        "data-lane-strip": ""
      }, [
        (r(!0), d(R, null, X(p.value, (k) => (r(), d("i", {
          key: k.key,
          class: K(["cell", { on: !k.free, over: k.over }]),
          style: ye({ flex: k.cost }),
          title: k.title,
          "data-lane-cell": k.free ? "free" : "run"
        }, v(k.label), 15, b6))), 128))
      ], 10, y6),
      !e.lane.running.length && !e.lane.waiting.length ? (r(), d("p", k6, "Nothing runs or waits here")) : (r(), d(R, { key: 3 }, [
        h("h4", w6, [
          y[13] || (y[13] = U("Running ", -1)),
          h("span", null, v(e.lane.running.length), 1)
        ]),
        (r(!0), d(R, null, X(f.value, (k, S) => (r(), P(ei, {
          key: `run:${S}:${k.line}`,
          entry: k,
          position: S + 1,
          "wait-count": e.lane.waiting.length,
          why: u.value,
          "lane-name": l.value,
          environment: e.environment
        }, null, 8, ["entry", "position", "wait-count", "why", "lane-name", "environment"]))), 128)),
        f.value.length ? w("", !0) : (r(), d("p", $6, v(e.lane.running.length ? "None match the filter" : "Nothing runs"), 1)),
        e.lane.waiting.length ? (r(), d(R, { key: 1 }, [
          h("h4", x6, [
            y[14] || (y[14] = U("Waiting, in the order they start ", -1)),
            h("span", null, v(e.lane.waiting.length), 1),
            h("span", S6, v(c.value), 1)
          ]),
          (r(!0), d(R, null, X(m.value, (k) => (r(), P(ei, {
            key: `wait:${k.position}:${k.entry.line}`,
            entry: k.entry,
            waiting: "",
            position: k.position,
            "wait-count": e.lane.waiting.length,
            why: u.value,
            "lane-name": l.value,
            environment: e.environment
          }, null, 8, ["entry", "position", "wait-count", "why", "lane-name", "environment"]))), 128)),
          m.value.length ? w("", !0) : (r(), d("p", M6, "None match the filter"))
        ], 64)) : w("", !0)
      ], 64))
    ], 10, c6));
  }
}, C6 = /* @__PURE__ */ H(_6, [["__scopeId", "data-v-ea40d0f6"]]), E6 = {
  class: "lanes",
  "data-execution-lanes": ""
}, A6 = { class: "tools" }, O6 = {
  class: "sum",
  "data-lanes-count": ""
}, T6 = ["value"], I6 = ["value"], B6 = { "data-lanes-waits": "" }, R6 = {
  key: 0,
  class: "empty"
}, L6 = {
  key: 1,
  class: "waits"
}, N6 = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 }, environment: { type: String, required: !0 }, pausable: Boolean },
  emits: ["pause", "resume"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(""), o = E(""), l = _(() => n.execution.lanes.flatMap((b) => [...b.running, ...b.waiting])), i = _(() => n.execution.lanes.reduce((b, $) => b + $.running.length, 0)), u = _(() => [...new Set(l.value.map((b) => b.class))].sort()), c = _(() => [...new Set(l.value.map((b) => b.starter))].sort()), f = (b) => (!s.value || b.class === s.value) && (!o.value || b.starter === o.value), m = _(() => l.value.filter(f).length), p = _(() => n.execution.waits.filter((b) => b.runs));
    return (b, $) => (r(), d("section", E6, [
      h("div", A6, [
        h("span", O6, [
          U(v(i.value) + " running · " + v(l.value.length - i.value) + " waiting", 1),
          s.value || o.value ? (r(), d(R, { key: 0 }, [
            U(" · showing " + v(m.value) + " of " + v(l.value.length), 1)
          ], 64)) : w("", !0)
        ]),
        h("label", null, [
          $[5] || ($[5] = U("Class ", -1)),
          ke(h("select", {
            "onUpdate:modelValue": $[0] || ($[0] = (y) => s.value = y),
            "data-lanes-class": ""
          }, [
            $[4] || ($[4] = h("option", { value: "" }, "Every class", -1)),
            (r(!0), d(R, null, X(u.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, T6))), 128))
          ], 512), [
            [Pt, s.value]
          ])
        ]),
        h("label", null, [
          $[7] || ($[7] = U("Started by ", -1)),
          ke(h("select", {
            "onUpdate:modelValue": $[1] || ($[1] = (y) => o.value = y),
            "data-lanes-starter": ""
          }, [
            $[6] || ($[6] = h("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(R, null, X(c.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, I6))), 128))
          ], 512), [
            [Pt, o.value]
          ])
        ])
      ]),
      (r(!0), d(R, null, X(e.execution.lanes, (y) => (r(), P(C6, {
        key: y.lane,
        lane: y,
        kept: f,
        environment: e.environment,
        pausable: e.pausable && y.lane === "long",
        onPause: $[2] || ($[2] = (k) => a("pause", k)),
        onResume: $[3] || ($[3] = (k) => a("resume"))
      }, null, 8, ["lane", "environment", "pausable"]))), 128)),
      h("div", B6, [
        A(Ct, { icon: "clock" }, {
          default: q(() => [...$[8] || ($[8] = [
            U("Waits, last hour", -1)
          ])]),
          _: 1
        }),
        p.value.length ? (r(), d("table", L6, [
          $[9] || ($[9] = h("thead", null, [
            h("tr", null, [
              h("th", { scope: "col" }, "Priority"),
              h("th", { scope: "col" }, "Started"),
              h("th", { scope: "col" }, "Longest wait"),
              h("th", { scope: "col" }, "Average wait")
            ])
          ], -1)),
          h("tbody", null, [
            (r(!0), d(R, null, X(p.value, (y) => (r(), d("tr", {
              key: y.priority
            }, [
              h("td", null, v(y.priority), 1),
              h("td", null, v(y.runs), 1),
              h("td", null, v(O(Zt)(y.longest_seconds, !0)), 1),
              h("td", null, v(O(Zt)(y.average_seconds, !0)), 1)
            ]))), 128))
          ])
        ])) : (r(), d("p", R6, "No run started in the last hour."))
      ])
    ]));
  }
}, q6 = /* @__PURE__ */ H(N6, [["__scopeId", "data-v-112283a4"]]), D6 = {
  class: "process-queue",
  "data-test-queue": ""
}, P6 = {
  key: 0,
  class: "lead"
}, j6 = { class: "scroll" }, F6 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, W6 = {
  key: 0,
  class: "tabs"
}, H6 = ["data-queue-empty"], $s = 20, z6 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = [{ key: "queue", label: "Queue" }, { key: "settings", label: "Settings" }], n = e, a = _(() => n.agent ? ["--agent", `row:${n.agent}`] : []), s = E(null), o = E(""), l = E([]), i = E($s), u = E("queue"), c = _(() => {
      var k, S;
      return (((k = s.value) == null ? void 0 : k.recent_total) ?? 0) > (((S = s.value) == null ? void 0 : S.recent.length) ?? 0);
    });
    let f = 0;
    const m = _(() => {
      if (!s.value) return [];
      const k = { type: "recent", heading: n.agent ? "Finished" : "Finished lately", icon: "check", rows: s.value.recent, empty: "None" };
      return (n.agent ? [
        { type: "running", heading: "Running", icon: "start", rows: s.value.running, empty: "None" },
        { type: "waiting", heading: "Waiting", icon: "clock", rows: s.value.waiting, empty: "None" },
        k
      ] : [k]).flatMap((C) => [
        { key: `band:${C.type}`, section: C },
        ...C.rows.length ? C.rows.map((N, D) => ({ key: `run:${N.id}`, run: N, position: D + 1 })) : [{ key: `none:${C.type}`, section: C, empty: !0 }]
      ]);
    });
    function p(k) {
      l.value = l.value.includes(k) ? l.value.filter((S) => S !== k) : [...l.value, k];
    }
    async function b() {
      const k = ++f, S = await n.read([...i.value === $s ? ["queue", "list"] : ["queue", "list", "--recent", String(i.value)], ...a.value]);
      k === f && (o.value = S.ok ? "" : S.error, S.ok && (s.value = S.value));
    }
    async function $(k) {
      const S = await n.read(k);
      o.value = S.ok ? "" : S.error, S.ok && b();
    }
    function y() {
      i.value += $s, b();
    }
    return qn(["process.*", "setting.*"], b), Ce(b), (k, S) => (r(), d("article", D6, [
      e.agent ? w("", !0) : (r(), d("p", P6, "Commands from workers wait here for a free slot. Reading and editing never wait.")),
      h("div", j6, [
        o.value ? (r(), d("p", F6, v(o.value), 1)) : w("", !0),
        s.value ? (r(), d(R, { key: 1 }, [
          e.agent ? w("", !0) : (r(), d("div", W6, [
            A(_t, {
              options: t,
              value: u.value,
              "data-queue-tabs": "",
              onPick: S[0] || (S[0] = (C) => u.value = C)
            }, null, 8, ["value"])
          ])),
          !e.agent && u.value === "settings" ? (r(), P(VS, {
            key: 1,
            queue: s.value,
            read: e.read,
            onSaved: b
          }, null, 8, ["queue", "read"])) : (r(), d(R, { key: 2 }, [
            e.agent ? w("", !0) : (r(), P(I3, {
              key: 0,
              lanes: s.value.execution.lanes
            }, null, 8, ["lanes"])),
            e.agent ? w("", !0) : (r(), P(q6, {
              key: 1,
              execution: s.value.execution,
              environment: s.value.environment_name,
              pausable: "",
              onPause: S[1] || (S[1] = (C) => $(["queue", "halt", C])),
              onResume: S[2] || (S[2] = (C) => $(["queue", "resume"]))
            }, null, 8, ["execution", "environment"])),
            A(to, {
              name: "queue",
              tag: "div",
              class: "queue-list"
            }, {
              default: q(() => [
                (r(!0), d(R, null, X(m.value, (C) => (r(), d(R, {
                  key: C.key
                }, [
                  C.run ? (r(), P(J3, {
                    key: 0,
                    run: C.run,
                    environment: s.value.environment_name,
                    position: C.position,
                    read: e.read,
                    expanded: l.value.includes(C.run.id),
                    onToggle: (N) => p(C.run.id)
                  }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : C.empty ? (r(), d("p", {
                    key: 1,
                    class: "empty",
                    "data-queue-empty": C.section.type
                  }, v(C.section.empty), 9, H6)) : (r(), P(Ct, {
                    key: 2,
                    class: "sticky-band",
                    icon: C.section.icon,
                    count: C.section.rows.length,
                    "data-queue-heading": C.section.type
                  }, {
                    default: q(() => [
                      U(v(C.section.heading), 1)
                    ]),
                    _: 2
                  }, 1032, ["icon", "count", "data-queue-heading"]))
                ], 64))), 128))
              ]),
              _: 1
            }),
            c.value ? (r(), d("button", {
              key: 2,
              type: "button",
              class: "older",
              "data-queue-older": "",
              onClick: y
            }, "Show older commands")) : w("", !0)
          ], 64))
        ], 64)) : o.value ? w("", !0) : (r(), P(nt, { key: 2 }))
      ])
    ]));
  }
}, qI = /* @__PURE__ */ H(z6, [["__scopeId", "data-v-f12b6e25"]]), U6 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, V6 = ["aria-expanded"], G6 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, K6 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, Y6 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, Q6 = {
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
    return fe(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), qn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(R, null, [
      a.value ? (r(), d("section", U6, [
        h("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = h("span", { class: "links-label" }, "Links", -1)),
          h("span", G6, v(a.value), 1),
          A(ln, { open: n.value }, null, 8, ["open"])
        ], 8, V6),
        h("div", {
          class: K(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", K6, [
            A(zd, {
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
          ])) : w("", !0)
        ], 2)
      ])) : w("", !0),
      o.value ? (r(), d("p", Y6, v(o.value), 1)) : w("", !0)
    ], 64));
  }
}, Du = /* @__PURE__ */ H(Q6, [["__scopeId", "data-v-a4550728"]]), X6 = ["placeholder"], J6 = { class: "actions" }, Z6 = { class: "error" }, eM = {
  key: 1,
  class: "card closed"
}, tM = { class: "mark" }, nM = { class: "prompt" }, aM = {
  key: 0,
  class: "draft"
}, sM = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ ht({
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
  emits: /* @__PURE__ */ ht(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Dt(e, "draft"), l = Dt(e, "error"), i = E(!!l.value), u = E(!1), c = E(!1), f = E(null);
    async function m() {
      var $, y;
      i.value = !0, u.value = !1, await Ne(), (y = (($ = f.value) == null ? void 0 : $.querySelector("input")) || f.value) == null || y.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function b() {
      const $ = o.value.trim();
      if (!(!$ || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send($), i.value = !1, u.value = !0;
        } catch (y) {
          o.value = $, l.value = y.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: m }), ($, y) => (r(), d("div", {
      class: K(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: ge(b, ["prevent"]),
        onKeydown: Ve(p, ["esc"])
      }, [
        ne($.$slots, "who", {}, void 0, !0),
        ke(h("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (k) => o.value = k),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: y[1] || (y[1] = Ve((k) => O(yr)(k, b), ["enter"]))
        }, null, 40, X6), [
          [Ue, o.value]
        ]),
        h("div", J6, [
          h("span", Z6, v(l.value), 1),
          A(re, {
            small: "",
            onClick: p
          }, {
            default: q(() => [...y[3] || (y[3] = [
              U("Cancel", -1)
            ])]),
            _: 1
          }),
          A(re, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: b
          }, {
            default: q(() => [...y[4] || (y[4] = [
              U("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", eM, [
        h("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          h("span", tM, [
            A(ae, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", nM, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", aM, "Draft kept")) : w("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[2] || (y[2] = (k) => s("show"))
        }, [
          h("span", null, v(O(Vd)(e.count, "comment")), 1),
          A(ae, {
            name: "down",
            size: 12
          })
        ])) : w("", !0)
      ]))
    ], 2));
  }
}, oM = /* @__PURE__ */ H(sM, [["__scopeId", "data-v-b68baddd"]]), lM = { wide: 1120 }, iM = /\{([A-Za-z_]\w*)\}/g;
function da(e, t, n = {}) {
  return e.replace(iM, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const rM = (e, t, n, a) => da(e.label, n, { row_id: a, id: a }) || d5(t, n, a), uM = { class: "comment-side-head" }, cM = {
  key: 0,
  class: "comment-none"
}, dM = { key: 0 }, fM = {
  key: 1,
  class: "comment-none"
}, mM = {
  class: "comment",
  "data-comment": ""
}, hM = {
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
      class: K(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      h("header", uM, [
        n[2] || (n[2] = h("h3", null, "Comments", -1)),
        A(Ia, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", cM, "No comments yet")) : w("", !0),
      (r(!0), d(R, null, X(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", dM, v(a.quote), 1)) : w("", !0),
        a.revision ? (r(), d("span", fM, "Revision " + v(a.revision), 1)) : w("", !0),
        h("p", mM, v(e.words(a)), 1)
      ]))), 128)),
      A(In, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, ti = /* @__PURE__ */ H(hM, [["__scopeId", "data-v-276284a3"]]), pM = {
  __name: "InspectorBack",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), P(re, {
      variant: "icon",
      title: "Back",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: q(() => [
        A(ae, {
          name: "back",
          size: 13
        })
      ]),
      _: 1
    }));
  }
}, vM = { class: "resource-heading" }, gM = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, yM = {
  key: 1,
  class: "resource-abstract"
}, bM = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", vM, [
      e.title ? (r(), d("h2", gM, v(e.title), 1)) : w("", !0),
      e.abstract ? (r(), d("p", yM, v(e.abstract), 1)) : w("", !0)
    ]));
  }
}, Pu = /* @__PURE__ */ H(bM, [["__scopeId", "data-v-172f09ac"]]), kM = {
  class: "inspector-head",
  "data-inspector-head": ""
}, wM = { class: "inspector-icons" }, $M = { class: "inspector-icons-start" }, xM = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, SM = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, MM = { class: "inspector-icons-end" }, _M = ["href"], CM = {
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
    const n = e, a = t, s = _(() => `${n.opened.table}:${n.opened.id}`), o = _(() => n.shareable && !n.readOnly), l = _(() => !n.label && !!n.title), i = _(() => n.backed ? "Close all rows" : "Close");
    return (u, c) => (r(), d("header", kM, [
      h("div", wM, [
        h("span", $M, [
          e.backed ? (r(), P(pM, {
            key: 0,
            onBack: c[0] || (c[0] = (f) => a("back"))
          })) : w("", !0),
          e.stepped ? (r(), d(R, { key: 1 }, [
            A(re, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: q(() => [
                A(ae, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            A(re, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: q(() => [
                A(ae, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : w("", !0)
        ]),
        l.value ? (r(), d("h2", xM, v(e.title), 1)) : (r(), d("p", SM, v(e.label), 1)),
        h("span", MM, [
          e.embedded ? (r(), P(re, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => O(Fe)(s.value))
          }, {
            default: q(() => [
              A(ae, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : w("", !0),
          o.value ? (r(), d("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this link",
            "aria-label": "Share this link",
            "data-resource-share": "",
            href: O(Km)(s.value)
          }, [
            A(ae, {
              name: "share",
              size: 13
            })
          ], 8, _M)) : w("", !0),
          e.embedded ? w("", !0) : (r(), P(re, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: q(() => [
              A(ae, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(Pu, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, EM = /* @__PURE__ */ H(CM, [["__scopeId", "data-v-48e6812e"]]), AM = {
  class: "section field-grid",
  "data-resource-fields": ""
}, OM = { class: "field-name" }, TM = {
  key: 1,
  class: "field-value"
}, IM = ["onClick"], BM = {
  key: 2,
  class: "field-value"
}, RM = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", AM, [
      (r(!0), d(R, null, X(e.fields, (o) => (r(), d(R, {
        key: o.name
      }, [
        h("p", OM, v(o.label), 1),
        o.isTime ? (r(), P(Xe, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", TM, [
          h("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, IM)
        ])) : (r(), d("p", BM, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, ju = /* @__PURE__ */ H(RM, [["__scopeId", "data-v-7e45afb5"]]);
async function LM(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: f5(s.value.actor, s.value.creator_agent), owner: a.length ? m5(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const NM = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, qM = {
  key: 1,
  class: "inspector-wait"
}, DM = { class: "inspector-main" }, PM = { class: "inspector-column" }, jM = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, FM = {
  class: "inspector-body",
  "data-inspector-body": ""
}, WM = { class: "inspector-text" }, HM = ["innerHTML"], zM = {
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
    eo($i, _(() => {
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
    }), i = E(null), u = E(""), c = E(""), f = E(""), m = E("details"), p = E(null), b = E(0);
    let $ = 0;
    const y = _(() => ({ row_id: n.id, id: n.id })), k = _(() => i.value ? da(l.value.title, i.value, y.value) || c5(n.term, i.value, n.id) : ""), S = _(() => i.value ? rM(l.value, n.term, i.value, n.id) : ""), C = _(() => S.value === k.value ? "" : S.value), N = _(() => i.value ? da(l.value.description, i.value, y.value) : ""), D = _(() => {
      var W, Y, Z;
      return ((W = i.value) == null ? void 0 : W.body) || ((Y = i.value) == null ? void 0 : Y.brief) || (o.has(n.term) ? (Z = i.value) == null ? void 0 : Z.text : "") || "";
    }), I = _(() => D.value ? bo(D.value, { env: "", rowNames: !1 }) : ""), G = _(() => h5(i.value, D.value, u.value, c.value)), F = _(() => l.value.comments && b.value >= lM.wide), B = _(() => l.value.comments && !F.value), j = (W) => l.value.components.filter((Y) => (Y.tab || "") === W).map((Y) => Y.window), V = _(() => [...new Set(l.value.components.map((W) => W.tab).filter(Boolean))]), M = _(() => V.value.length || B.value ? [{ key: "details", label: "Details" }, ...V.value.map((W) => ({ key: W, label: W })), ...B.value ? [{ key: "comments", label: "Comments" }] : []] : []), g = _(() => {
      const W = l.value.links;
      return W ? { categories: W.categories, open: W.open, outsidePlan: W.excludes_plan, pageSize: W.page_size } : null;
    }), x = Mr(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (W) => n.read(W));
    async function T() {
      const W = ++$, Y = await n.read(da(l.value.reads, null, y.value).split(/\s+/).filter(Boolean));
      if (W !== $ || (f.value = Y.ok ? "" : Y.error, !Y.ok)) return;
      i.value = Y.value;
      const Z = await LM(n.read, i.value);
      W === $ && (u.value = Z.creator, c.value = Z.owner);
    }
    fe(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", m.value = "details", T();
    }, { immediate: !0 }), qn(l.value.events, T), fe(x.open, (W) => W && B.value && (m.value = "comments"));
    let L = null;
    return Ce(() => {
      var W;
      b.value = ((W = p.value) == null ? void 0 : W.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (L = new ResizeObserver(() => b.value = p.value.clientWidth), L.observe(p.value));
    }), Be(() => L == null ? void 0 : L.disconnect()), (W, Y) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(EM, {
        label: C.value,
        title: k.value,
        description: N.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: Y[0] || (Y[0] = (Z) => a("close")),
        onBack: Y[1] || (Y[1] = (Z) => a("back")),
        onStep: Y[2] || (Y[2] = (Z) => a("step", Z))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", NM, v(f.value), 1)) : i.value ? (r(), d(R, { key: 2 }, [
        A(js, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: q(() => [
            A(vo, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: T
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        h("div", DM, [
          h("div", PM, [
            M.value.length ? (r(), d("div", jM, [
              A(_t, {
                options: M.value,
                value: m.value,
                onPick: Y[3] || (Y[3] = (Z) => m.value = Z)
              }, null, 8, ["options", "value"])
            ])) : w("", !0),
            h("div", FM, [
              A(Ft, { value: m.value }, {
                details: q(() => [
                  h("div", WM, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, HM)) : w("", !0),
                    l.value.lists_fields ? (r(), P(ju, {
                      key: 1,
                      fields: G.value,
                      onPeek: Y[4] || (Y[4] = (Z) => a("open", Z))
                    }, null, 8, ["fields"])) : w("", !0)
                  ]),
                  A(Ds, {
                    "slot-name": `inspector.${e.term}`,
                    names: j(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: q(() => [
                  A(ti, {
                    below: "",
                    comments: O(x).comments.value,
                    words: O(x).words,
                    more: !!O(x).nextPage.value,
                    loading: O(x).loading.value,
                    failure: O(x).failure.value,
                    onMore: O(x).loadMore,
                    onClose: Y[5] || (Y[5] = (Z) => m.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: q(() => [
                  A(Ds, {
                    names: j(m.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              g.value ? (r(), P(Du, De({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, g.value, {
                onOpen: Y[6] || (Y[6] = (Z) => a("open", Z))
              }), null, 16, ["model", "id", "read"])) : w("", !0)
            ]),
            l.value.comments ? (r(), P(oM, {
              key: 1,
              send: O(x).send,
              count: O(x).total.value,
              onShow: Y[7] || (Y[7] = (Z) => B.value && (m.value = "comments"))
            }, null, 8, ["send", "count"])) : w("", !0)
          ]),
          F.value ? (r(), P(ti, {
            key: 0,
            comments: O(x).comments.value,
            words: O(x).words,
            more: !!O(x).nextPage.value,
            loading: O(x).loading.value,
            failure: O(x).failure.value,
            onMore: O(x).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : w("", !0)
        ])
      ], 64)) : (r(), d("div", qM, [
        A(nt)
      ]))
    ], 512));
  }
}, UM = /* @__PURE__ */ H(zM, [["__scopeId", "data-v-60363e95"]]), DI = {
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
    const t = Se(Ta);
    return (n, a) => (r(), P(UM, De(n.$props, {
      catalogue: O(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, VM = { class: "facts" }, GM = { class: "fact wide" }, KM = ["title"], YM = {
  key: 1,
  class: "fact-value"
}, QM = {
  key: 0,
  class: "fact"
}, XM = { class: "fact-value" }, JM = { class: "fact" }, ZM = { class: "fact-label" }, e_ = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, t_ = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, n_ = {
  key: 2,
  class: "fact"
}, a_ = { class: "fact-value" }, s_ = { class: "fact wide" }, o_ = { class: "fact-label" }, l_ = { class: "fact wide" }, i_ = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, r_ = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ya.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", VM, [
        h("div", GM, [
          i[4] || (i[4] = h("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => O(Fe)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, KM)) : (r(), d("span", YM, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", QM, [
          i[5] || (i[5] = h("span", { class: "fact-label" }, "Phase", -1)),
          h("span", XM, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : w("", !0),
        e.task.helper_id ? (r(), d(R, { key: 1 }, [
          h("div", JM, [
            h("span", ZM, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A($n, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: O($o)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => O(Fe)(`agents:${e.task.helper_id}`))
            }, {
              default: q(() => [
                A(Qt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          O(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", e_, [
            A(Qt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = U(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", t_, [
            A(Qt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = U(" takes it after the task it is on.", -1))
          ])) : w("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", n_, [
          i[8] || (i[8] = h("span", { class: "fact-label" }, "Assigned to", -1)),
          h("span", a_, "Agent " + v(e.task.holder_id), 1)
        ])) : w("", !0),
        h("div", s_, [
          h("span", o_, [
            i[9] || (i[9] = U(" Complexity ", -1)),
            A(Bi, {
              lines: O(Ir).map((f, m) => `${m + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(_t, {
            options: O(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        h("div", l_, [
          i[10] || (i[10] = h("span", { class: "fact-label" }, "Priority", -1)),
          A(_t, {
            options: O(n),
            value: String(O(Tr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", i_, v(e.refusal), 1)) : w("", !0)
        ])
      ]);
    };
  }
}, u_ = /* @__PURE__ */ H(r_, [["__scopeId", "data-v-4bf27961"]]);
function c_(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const d_ = { class: "number" }, f_ = { class: "title" }, m_ = { class: "word" }, h_ = {
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
    return (a, s) => (r(), P(Ze(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: K(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: q(() => [
        A(Ra, { status: e.status }, null, 8, ["status"]),
        h("span", d_, v(e.number), 1),
        h("span", f_, v(e.title), 1),
        h("span", m_, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, xs = /* @__PURE__ */ H(h_, [["__scopeId", "data-v-f6417ae8"]]), p_ = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, v_ = { class: "level" }, g_ = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1);
    fe(() => n.task.id, () => s.value = !1);
    const o = _(() => c_(n.task.id, n.graph)), l = _(() => s.value ? o.value.above : o.value.above.slice(-1)), i = _(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = _(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (m) => m.slice(0, 1).toUpperCase() + m.slice(1), f = (m, p = !1) => ({ status: xn(m.state), number: m.id, title: m.title, word: p ? "This task" : c(m.state), current: p });
    return (m, p) => o.value.above.length || o.value.below.length ? (r(), d("section", p_, [
      p[5] || (p[5] = h("h4", null, "What waits on what", -1)),
      (r(!0), d(R, null, X(l.value, (b) => (r(), d(R, {
        key: b.map(($) => $.id).join()
      }, [
        h("div", v_, [
          (r(!0), d(R, null, X(b, ($) => (r(), P(xs, De({
            key: $.id,
            ref_for: !0
          }, f($), {
            onSelect: p[0] || (p[0] = (y) => a("select", y))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = h("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(xs, kt(ri(f(e.task, !0))), null, 16),
      (r(!0), d(R, null, X(i.value, (b) => (r(), d(R, {
        key: b.id
      }, [
        p[4] || (p[4] = h("div", { class: "waits" }, "↓ waits on", -1)),
        A(xs, De({ ref_for: !0 }, f(b), {
          onSelect: p[1] || (p[1] = ($) => a("select", $))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (b) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : w("", !0)
    ])) : w("", !0);
  }
}, y_ = /* @__PURE__ */ H(g_, [["__scopeId", "data-v-79c52417"]]), b_ = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, k_ = ["datetime"], w_ = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", b_, [
      n[0] || (n[0] = h("h3", null, "Block history", -1)),
      (r(!0), d(R, null, X(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        h("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, k_),
        h("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : w("", !0);
  }
}, $_ = /* @__PURE__ */ H(w_, [["__scopeId", "data-v-b41f213b"]]), x_ = {
  class: "part",
  "data-resource-waits": ""
}, S_ = ["onClick"], M_ = { class: "wait-id" }, __ = { class: "wait-title" }, C_ = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", x_, [
      h("h4", null, v(e.title), 1),
      (r(!0), d(R, null, X(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(Ra, {
          status: O(xn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        h("span", M_, v(o.id), 1),
        h("span", __, v(o.title), 1)
      ], 8, S_))), 128))
    ]));
  }
}, ni = /* @__PURE__ */ H(C_, [["__scopeId", "data-v-8fb2e251"]]), E_ = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, A_ = { class: "text" }, O_ = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, T_ = 180, I_ = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = E(!1), l = _(() => a.task.waits.filter((u) => !n.has(u.state))), i = _(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(R, null, [
      l.value.length ? (r(), P(ni, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : w("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", E_, [
        c[3] || (c[3] = h("h4", null, "How it was done", -1)),
        h("p", A_, v(e.task.outcome), 1)
      ])) : w("", !0),
      e.task.brief ? (r(), d("section", O_, [
        c[4] || (c[4] = h("h4", null, "The brief", -1)),
        h("p", {
          class: K(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > T_ && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : w("", !0)
      ])) : w("", !0),
      i.value.length ? (r(), P(ni, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : w("", !0)
    ], 64));
  }
}, B_ = /* @__PURE__ */ H(I_, [["__scopeId", "data-v-4a3f1e79"]]), R_ = {
  class: "task-details",
  "data-task-details": ""
}, L_ = { class: "since" }, N_ = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, q_ = { class: "text" }, D_ = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, P_ = {
  key: 1,
  class: "note"
}, j_ = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, F_ = { class: "text" }, W_ = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", R_, [
        h("div", {
          class: K(["state-line", O(xn)(e.task.state)])
        }, [
          h("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(Ra, {
              status: O(xn)(e.task.state)
            }, null, 8, ["status"]),
            U(" " + v(a(e.task.state)), 1)
          ]),
          h("span", L_, [
            o[5] || (o[5] = U(" since ", -1)),
            A(Xe, {
              at: O(Ch)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", N_, [
          o[6] || (o[6] = h("span", { class: "label" }, "Blocked, waiting on", -1)),
          h("p", q_, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", D_, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", P_, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", j_, [
          o[7] || (o[7] = h("span", { class: "label" }, "Why it was cancelled", -1)),
          h("p", F_, v(e.task.reason), 1)
        ])) : w("", !0),
        e.graph ? (r(), P(y_, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : w("", !0),
        A(u_, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(B_, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A($_, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, PI = /* @__PURE__ */ H(W_, [["__scopeId", "data-v-7e73fa21"]]), H_ = 50, z_ = { messages: 25 }, U_ = (e) => z_[e] || H_, V_ = {
  class: "task-log",
  "aria-label": "Task log"
}, G_ = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, K_ = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Y_ = { class: "entries" }, Q_ = ["data-task-log-important"], X_ = ["datetime"], J_ = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Z_ = {
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
      const m = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(U_("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = m.ok ? "" : m.error, m.ok && (n.value = m.value.rows, s.value = m.value.is_last_page));
    }
    return fe(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), tt(() => {
      i += 1;
    }), (c, f) => (r(), d("section", V_, [
      o.value ? (r(), P(nt, { key: 0 })) : l.value ? (r(), d(R, { key: 1 }, [
        h("p", G_, v(l.value), 1),
        A(re, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (m) => u(a.value))
        }, {
          default: q(() => [...f[3] || (f[3] = [
            U("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(R, { key: 2 }, [
        n.value.length ? w("", !0) : (r(), d("p", K_, "No log entries yet.")),
        h("ol", Y_, [
          (r(!0), d(R, null, X(n.value, (m) => (r(), d("li", {
            key: m.id,
            class: K(["entry", { important: m.important }]),
            "data-task-log": "",
            "data-task-log-important": m.important ? "" : null
          }, [
            h("time", {
              datetime: m.created_at
            }, v(new Date(m.created_at).toLocaleString()), 9, X_),
            h("p", null, v(m.line), 1)
          ], 10, Q_))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", J_, [
          A(re, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (m) => u(a.value - 1))
          }, {
            default: q(() => [...f[4] || (f[4] = [
              U("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          h("span", null, "Page " + v(a.value), 1),
          A(re, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (m) => u(a.value + 1))
          }, {
            default: q(() => [...f[5] || (f[5] = [
              U("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : w("", !0)
      ], 64))
    ]));
  }
}, jI = /* @__PURE__ */ H(Z_, [["__scopeId", "data-v-cfa43bf1"]]);
function eC(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ss = { exports: {} }, ai;
function tC() {
  return ai || (ai = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, G) {
        var F = 236, B = 17, j = I, V = o[G], M = null, g = 0, x = null, T = [], L = {}, W = function(z, J) {
          g = j * 4 + 17, M = (function(Q) {
            for (var ee = new Array(Q), te = 0; te < Q; te += 1) {
              ee[te] = new Array(Q);
              for (var oe = 0; oe < Q; oe += 1)
                ee[te][oe] = null;
            }
            return ee;
          })(g), Y(0, 0), Y(g - 7, 0), Y(0, g - 7), de(), le(), Ee(z, J), j >= 7 && $e(z), x == null && (x = ie(j, V, T)), ze(x, J);
        }, Y = function(z, J) {
          for (var Q = -1; Q <= 7; Q += 1)
            if (!(z + Q <= -1 || g <= z + Q))
              for (var ee = -1; ee <= 7; ee += 1)
                J + ee <= -1 || g <= J + ee || (0 <= Q && Q <= 6 && (ee == 0 || ee == 6) || 0 <= ee && ee <= 6 && (Q == 0 || Q == 6) || 2 <= Q && Q <= 4 && 2 <= ee && ee <= 4 ? M[z + Q][J + ee] = !0 : M[z + Q][J + ee] = !1);
        }, Z = function() {
          for (var z = 0, J = 0, Q = 0; Q < 8; Q += 1) {
            W(!0, Q);
            var ee = i.getLostPoint(L);
            (Q == 0 || z > ee) && (z = ee, J = Q);
          }
          return J;
        }, le = function() {
          for (var z = 8; z < g - 8; z += 1)
            M[z][6] == null && (M[z][6] = z % 2 == 0);
          for (var J = 8; J < g - 8; J += 1)
            M[6][J] == null && (M[6][J] = J % 2 == 0);
        }, de = function() {
          for (var z = i.getPatternPosition(j), J = 0; J < z.length; J += 1)
            for (var Q = 0; Q < z.length; Q += 1) {
              var ee = z[J], te = z[Q];
              if (M[ee][te] == null)
                for (var oe = -2; oe <= 2; oe += 1)
                  for (var me = -2; me <= 2; me += 1)
                    oe == -2 || oe == 2 || me == -2 || me == 2 || oe == 0 && me == 0 ? M[ee + oe][te + me] = !0 : M[ee + oe][te + me] = !1;
            }
        }, $e = function(z) {
          for (var J = i.getBCHTypeNumber(j), Q = 0; Q < 18; Q += 1) {
            var ee = !z && (J >> Q & 1) == 1;
            M[Math.floor(Q / 3)][Q % 3 + g - 8 - 3] = ee;
          }
          for (var Q = 0; Q < 18; Q += 1) {
            var ee = !z && (J >> Q & 1) == 1;
            M[Q % 3 + g - 8 - 3][Math.floor(Q / 3)] = ee;
          }
        }, Ee = function(z, J) {
          for (var Q = V << 3 | J, ee = i.getBCHTypeInfo(Q), te = 0; te < 15; te += 1) {
            var oe = !z && (ee >> te & 1) == 1;
            te < 6 ? M[te][8] = oe : te < 8 ? M[te + 1][8] = oe : M[g - 15 + te][8] = oe;
          }
          for (var te = 0; te < 15; te += 1) {
            var oe = !z && (ee >> te & 1) == 1;
            te < 8 ? M[8][g - te - 1] = oe : te < 9 ? M[8][15 - te - 1 + 1] = oe : M[8][15 - te - 1] = oe;
          }
          M[g - 8][8] = !z;
        }, ze = function(z, J) {
          for (var Q = -1, ee = g - 1, te = 7, oe = 0, me = i.getMaskFunction(J), ce = g - 1; ce > 0; ce -= 2)
            for (ce == 6 && (ce -= 1); ; ) {
              for (var _e = 0; _e < 2; _e += 1)
                if (M[ee][ce - _e] == null) {
                  var Te = !1;
                  oe < z.length && (Te = (z[oe] >>> te & 1) == 1);
                  var ve = me(ee, ce - _e);
                  ve && (Te = !Te), M[ee][ce - _e] = Te, te -= 1, te == -1 && (oe += 1, te = 7);
                }
              if (ee += Q, ee < 0 || g <= ee) {
                ee -= Q, Q = -Q;
                break;
              }
            }
        }, pe = function(z, J) {
          for (var Q = 0, ee = 0, te = 0, oe = new Array(J.length), me = new Array(J.length), ce = 0; ce < J.length; ce += 1) {
            var _e = J[ce].dataCount, Te = J[ce].totalCount - _e;
            ee = Math.max(ee, _e), te = Math.max(te, Te), oe[ce] = new Array(_e);
            for (var ve = 0; ve < oe[ce].length; ve += 1)
              oe[ce][ve] = 255 & z.getBuffer()[ve + Q];
            Q += _e;
            var Ge = i.getErrorCorrectPolynomial(Te), Ke = c(oe[ce], Ge.getLength() - 1), Fo = Ke.mod(Ge);
            me[ce] = new Array(Ge.getLength() - 1);
            for (var ve = 0; ve < me[ce].length; ve += 1) {
              var Wo = ve + Fo.getLength() - me[ce].length;
              me[ce][ve] = Wo >= 0 ? Fo.getAt(Wo) : 0;
            }
          }
          for (var Ho = 0, ve = 0; ve < J.length; ve += 1)
            Ho += J[ve].totalCount;
          for (var ja = new Array(Ho), Hn = 0, ve = 0; ve < ee; ve += 1)
            for (var ce = 0; ce < J.length; ce += 1)
              ve < oe[ce].length && (ja[Hn] = oe[ce][ve], Hn += 1);
          for (var ve = 0; ve < te; ve += 1)
            for (var ce = 0; ce < J.length; ce += 1)
              ve < me[ce].length && (ja[Hn] = me[ce][ve], Hn += 1);
          return ja;
        }, ie = function(z, J, Q) {
          for (var ee = f.getRSBlocks(z, J), te = m(), oe = 0; oe < Q.length; oe += 1) {
            var me = Q[oe];
            te.put(me.getMode(), 4), te.put(me.getLength(), i.getLengthInBits(me.getMode(), z)), me.write(te);
          }
          for (var ce = 0, oe = 0; oe < ee.length; oe += 1)
            ce += ee[oe].dataCount;
          if (te.getLengthInBits() > ce * 8)
            throw "code length overflow. (" + te.getLengthInBits() + ">" + ce * 8 + ")";
          for (te.getLengthInBits() + 4 <= ce * 8 && te.put(0, 4); te.getLengthInBits() % 8 != 0; )
            te.putBit(!1);
          for (; !(te.getLengthInBits() >= ce * 8 || (te.put(F, 8), te.getLengthInBits() >= ce * 8)); )
            te.put(B, 8);
          return pe(te, ee);
        };
        L.addData = function(z, J) {
          J = J || "Byte";
          var Q = null;
          switch (J) {
            case "Numeric":
              Q = p(z);
              break;
            case "Alphanumeric":
              Q = b(z);
              break;
            case "Byte":
              Q = $(z);
              break;
            case "Kanji":
              Q = y(z);
              break;
            default:
              throw "mode:" + J;
          }
          T.push(Q), x = null;
        }, L.isDark = function(z, J) {
          if (z < 0 || g <= z || J < 0 || g <= J)
            throw z + "," + J;
          return M[z][J];
        }, L.getModuleCount = function() {
          return g;
        }, L.make = function() {
          if (j < 1) {
            for (var z = 1; z < 40; z++) {
              for (var J = f.getRSBlocks(z, V), Q = m(), ee = 0; ee < T.length; ee++) {
                var te = T[ee];
                Q.put(te.getMode(), 4), Q.put(te.getLength(), i.getLengthInBits(te.getMode(), z)), te.write(Q);
              }
              for (var oe = 0, ee = 0; ee < J.length; ee++)
                oe += J[ee].dataCount;
              if (Q.getLengthInBits() <= oe * 8)
                break;
            }
            j = z;
          }
          W(!1, Z());
        }, L.createTableTag = function(z, J) {
          z = z || 2, J = typeof J > "u" ? z * 4 : J;
          var Q = "";
          Q += '<table style="', Q += " border-width: 0px; border-style: none;", Q += " border-collapse: collapse;", Q += " padding: 0px; margin: " + J + "px;", Q += '">', Q += "<tbody>";
          for (var ee = 0; ee < L.getModuleCount(); ee += 1) {
            Q += "<tr>";
            for (var te = 0; te < L.getModuleCount(); te += 1)
              Q += '<td style="', Q += " border-width: 0px; border-style: none;", Q += " border-collapse: collapse;", Q += " padding: 0px; margin: 0px;", Q += " width: " + z + "px;", Q += " height: " + z + "px;", Q += " background-color: ", Q += L.isDark(ee, te) ? "#000000" : "#ffffff", Q += ";", Q += '"/>';
            Q += "</tr>";
          }
          return Q += "</tbody>", Q += "</table>", Q;
        }, L.createSvgTag = function(z, J, Q, ee) {
          var te = {};
          typeof arguments[0] == "object" && (te = arguments[0], z = te.cellSize, J = te.margin, Q = te.alt, ee = te.title), z = z || 2, J = typeof J > "u" ? z * 4 : J, Q = typeof Q == "string" ? { text: Q } : Q || {}, Q.text = Q.text || null, Q.id = Q.text ? Q.id || "qrcode-description" : null, ee = typeof ee == "string" ? { text: ee } : ee || {}, ee.text = ee.text || null, ee.id = ee.text ? ee.id || "qrcode-title" : null;
          var oe = L.getModuleCount() * z + J * 2, me, ce, _e, Te, ve = "", Ge;
          for (Ge = "l" + z + ",0 0," + z + " -" + z + ",0 0,-" + z + "z ", ve += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ve += te.scalable ? "" : ' width="' + oe + 'px" height="' + oe + 'px"', ve += ' viewBox="0 0 ' + oe + " " + oe + '" ', ve += ' preserveAspectRatio="xMinYMin meet"', ve += ee.text || Q.text ? ' role="img" aria-labelledby="' + se([ee.id, Q.id].join(" ").trim()) + '"' : "", ve += ">", ve += ee.text ? '<title id="' + se(ee.id) + '">' + se(ee.text) + "</title>" : "", ve += Q.text ? '<description id="' + se(Q.id) + '">' + se(Q.text) + "</description>" : "", ve += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ve += '<path d="', _e = 0; _e < L.getModuleCount(); _e += 1)
            for (Te = _e * z + J, me = 0; me < L.getModuleCount(); me += 1)
              L.isDark(_e, me) && (ce = me * z + J, ve += "M" + ce + "," + Te + Ge);
          return ve += '" stroke="transparent" fill="black"/>', ve += "</svg>", ve;
        }, L.createDataURL = function(z, J) {
          z = z || 2, J = typeof J > "u" ? z * 4 : J;
          var Q = L.getModuleCount() * z + J * 2, ee = J, te = Q - J;
          return D(Q, Q, function(oe, me) {
            if (ee <= oe && oe < te && ee <= me && me < te) {
              var ce = Math.floor((oe - ee) / z), _e = Math.floor((me - ee) / z);
              return L.isDark(_e, ce) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(z, J, Q) {
          z = z || 2, J = typeof J > "u" ? z * 4 : J;
          var ee = L.getModuleCount() * z + J * 2, te = "";
          return te += "<img", te += ' src="', te += L.createDataURL(z, J), te += '"', te += ' width="', te += ee, te += '"', te += ' height="', te += ee, te += '"', Q && (te += ' alt="', te += se(Q), te += '"'), te += "/>", te;
        };
        var se = function(z) {
          for (var J = "", Q = 0; Q < z.length; Q += 1) {
            var ee = z.charAt(Q);
            switch (ee) {
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
                J += ee;
                break;
            }
          }
          return J;
        }, be = function(z) {
          var J = 1;
          z = typeof z > "u" ? J * 2 : z;
          var Q = L.getModuleCount() * J + z * 2, ee = z, te = Q - z, oe, me, ce, _e, Te, ve = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ge = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ke = "";
          for (oe = 0; oe < Q; oe += 2) {
            for (ce = Math.floor((oe - ee) / J), _e = Math.floor((oe + 1 - ee) / J), me = 0; me < Q; me += 1)
              Te = "█", ee <= me && me < te && ee <= oe && oe < te && L.isDark(ce, Math.floor((me - ee) / J)) && (Te = " "), ee <= me && me < te && ee <= oe + 1 && oe + 1 < te && L.isDark(_e, Math.floor((me - ee) / J)) ? Te += " " : Te += "█", Ke += z < 1 && oe + 1 >= te ? Ge[Te] : ve[Te];
            Ke += `
`;
          }
          return Q % 2 && z > 0 ? Ke.substring(0, Ke.length - Q - 1) + Array(Q + 1).join("▀") : Ke.substring(0, Ke.length - 1);
        };
        return L.createASCII = function(z, J) {
          if (z = z || 1, z < 2)
            return be(J);
          z -= 1, J = typeof J > "u" ? z * 2 : J;
          var Q = L.getModuleCount() * z + J * 2, ee = J, te = Q - J, oe, me, ce, _e, Te = Array(z + 1).join("██"), ve = Array(z + 1).join("  "), Ge = "", Ke = "";
          for (oe = 0; oe < Q; oe += 1) {
            for (ce = Math.floor((oe - ee) / z), Ke = "", me = 0; me < Q; me += 1)
              _e = 1, ee <= me && me < te && ee <= oe && oe < te && L.isDark(ce, Math.floor((me - ee) / z)) && (_e = 0), Ke += _e ? Te : ve;
            for (ce = 0; ce < z; ce += 1)
              Ge += Ke + `
`;
          }
          return Ge.substring(0, Ge.length - 1);
        }, L.renderTo2dContext = function(z, J) {
          J = J || 2;
          for (var Q = L.getModuleCount(), ee = 0; ee < Q; ee++)
            for (var te = 0; te < Q; te++)
              z.fillStyle = L.isDark(ee, te) ? "black" : "white", z.fillRect(ee * J, te * J, J, J);
        }, L;
      };
      a.stringToBytesFuncs = {
        default: function(I) {
          for (var G = [], F = 0; F < I.length; F += 1) {
            var B = I.charCodeAt(F);
            G.push(B & 255);
          }
          return G;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(I, G) {
        var F = (function() {
          for (var j = C(I), V = function() {
            var le = j.read();
            if (le == -1) throw "eof";
            return le;
          }, M = 0, g = {}; ; ) {
            var x = j.read();
            if (x == -1) break;
            var T = V(), L = V(), W = V(), Y = String.fromCharCode(x << 8 | T), Z = L << 8 | W;
            g[Y] = Z, M += 1;
          }
          if (M != G)
            throw M + " != " + G;
          return g;
        })(), B = 63;
        return function(j) {
          for (var V = [], M = 0; M < j.length; M += 1) {
            var g = j.charCodeAt(M);
            if (g < 128)
              V.push(g);
            else {
              var x = F[j.charAt(M)];
              typeof x == "number" ? (x & 255) == x ? V.push(x) : (V.push(x >>> 8), V.push(x & 255)) : V.push(B);
            }
          }
          return V;
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
        ], G = 1335, F = 7973, B = 21522, j = {}, V = function(M) {
          for (var g = 0; M != 0; )
            g += 1, M >>>= 1;
          return g;
        };
        return j.getBCHTypeInfo = function(M) {
          for (var g = M << 10; V(g) - V(G) >= 0; )
            g ^= G << V(g) - V(G);
          return (M << 10 | g) ^ B;
        }, j.getBCHTypeNumber = function(M) {
          for (var g = M << 12; V(g) - V(F) >= 0; )
            g ^= F << V(g) - V(F);
          return M << 12 | g;
        }, j.getPatternPosition = function(M) {
          return I[M - 1];
        }, j.getMaskFunction = function(M) {
          switch (M) {
            case l.PATTERN000:
              return function(g, x) {
                return (g + x) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, x) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, x) {
                return x % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, x) {
                return (g + x) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, x) {
                return (Math.floor(g / 2) + Math.floor(x / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, x) {
                return g * x % 2 + g * x % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, x) {
                return (g * x % 2 + g * x % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, x) {
                return (g * x % 3 + (g + x) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + M;
          }
        }, j.getErrorCorrectPolynomial = function(M) {
          for (var g = c([1], 0), x = 0; x < M; x += 1)
            g = g.multiply(c([1, u.gexp(x)], 0));
          return g;
        }, j.getLengthInBits = function(M, g) {
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
        }, j.getLostPoint = function(M) {
          for (var g = M.getModuleCount(), x = 0, T = 0; T < g; T += 1)
            for (var L = 0; L < g; L += 1) {
              for (var W = 0, Y = M.isDark(T, L), Z = -1; Z <= 1; Z += 1)
                if (!(T + Z < 0 || g <= T + Z))
                  for (var le = -1; le <= 1; le += 1)
                    L + le < 0 || g <= L + le || Z == 0 && le == 0 || Y == M.isDark(T + Z, L + le) && (W += 1);
              W > 5 && (x += 3 + W - 5);
            }
          for (var T = 0; T < g - 1; T += 1)
            for (var L = 0; L < g - 1; L += 1) {
              var de = 0;
              M.isDark(T, L) && (de += 1), M.isDark(T + 1, L) && (de += 1), M.isDark(T, L + 1) && (de += 1), M.isDark(T + 1, L + 1) && (de += 1), (de == 0 || de == 4) && (x += 3);
            }
          for (var T = 0; T < g; T += 1)
            for (var L = 0; L < g - 6; L += 1)
              M.isDark(T, L) && !M.isDark(T, L + 1) && M.isDark(T, L + 2) && M.isDark(T, L + 3) && M.isDark(T, L + 4) && !M.isDark(T, L + 5) && M.isDark(T, L + 6) && (x += 40);
          for (var L = 0; L < g; L += 1)
            for (var T = 0; T < g - 6; T += 1)
              M.isDark(T, L) && !M.isDark(T + 1, L) && M.isDark(T + 2, L) && M.isDark(T + 3, L) && M.isDark(T + 4, L) && !M.isDark(T + 5, L) && M.isDark(T + 6, L) && (x += 40);
          for (var $e = 0, L = 0; L < g; L += 1)
            for (var T = 0; T < g; T += 1)
              M.isDark(T, L) && ($e += 1);
          var Ee = Math.abs(100 * $e / g / g - 50) / 5;
          return x += Ee * 10, x;
        }, j;
      })(), u = (function() {
        for (var I = new Array(256), G = new Array(256), F = 0; F < 8; F += 1)
          I[F] = 1 << F;
        for (var F = 8; F < 256; F += 1)
          I[F] = I[F - 4] ^ I[F - 5] ^ I[F - 6] ^ I[F - 8];
        for (var F = 0; F < 255; F += 1)
          G[I[F]] = F;
        var B = {};
        return B.glog = function(j) {
          if (j < 1)
            throw "glog(" + j + ")";
          return G[j];
        }, B.gexp = function(j) {
          for (; j < 0; )
            j += 255;
          for (; j >= 256; )
            j -= 255;
          return I[j];
        }, B;
      })();
      function c(I, G) {
        if (typeof I.length > "u")
          throw I.length + "/" + G;
        var F = (function() {
          for (var j = 0; j < I.length && I[j] == 0; )
            j += 1;
          for (var V = new Array(I.length - j + G), M = 0; M < I.length - j; M += 1)
            V[M] = I[M + j];
          return V;
        })(), B = {};
        return B.getAt = function(j) {
          return F[j];
        }, B.getLength = function() {
          return F.length;
        }, B.multiply = function(j) {
          for (var V = new Array(B.getLength() + j.getLength() - 1), M = 0; M < B.getLength(); M += 1)
            for (var g = 0; g < j.getLength(); g += 1)
              V[M + g] ^= u.gexp(u.glog(B.getAt(M)) + u.glog(j.getAt(g)));
          return c(V, 0);
        }, B.mod = function(j) {
          if (B.getLength() - j.getLength() < 0)
            return B;
          for (var V = u.glog(B.getAt(0)) - u.glog(j.getAt(0)), M = new Array(B.getLength()), g = 0; g < B.getLength(); g += 1)
            M[g] = B.getAt(g);
          for (var g = 0; g < j.getLength(); g += 1)
            M[g] ^= u.gexp(u.glog(j.getAt(g)) + V);
          return c(M, 0).mod(j);
        }, B;
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
        ], G = function(j, V) {
          var M = {};
          return M.totalCount = j, M.dataCount = V, M;
        }, F = {}, B = function(j, V) {
          switch (V) {
            case o.L:
              return I[(j - 1) * 4 + 0];
            case o.M:
              return I[(j - 1) * 4 + 1];
            case o.Q:
              return I[(j - 1) * 4 + 2];
            case o.H:
              return I[(j - 1) * 4 + 3];
            default:
              return;
          }
        };
        return F.getRSBlocks = function(j, V) {
          var M = B(j, V);
          if (typeof M > "u")
            throw "bad rs block @ typeNumber:" + j + "/errorCorrectionLevel:" + V;
          for (var g = M.length / 3, x = [], T = 0; T < g; T += 1)
            for (var L = M[T * 3 + 0], W = M[T * 3 + 1], Y = M[T * 3 + 2], Z = 0; Z < L; Z += 1)
              x.push(G(W, Y));
          return x;
        }, F;
      })(), m = function() {
        var I = [], G = 0, F = {};
        return F.getBuffer = function() {
          return I;
        }, F.getAt = function(B) {
          var j = Math.floor(B / 8);
          return (I[j] >>> 7 - B % 8 & 1) == 1;
        }, F.put = function(B, j) {
          for (var V = 0; V < j; V += 1)
            F.putBit((B >>> j - V - 1 & 1) == 1);
        }, F.getLengthInBits = function() {
          return G;
        }, F.putBit = function(B) {
          var j = Math.floor(G / 8);
          I.length <= j && I.push(0), B && (I[j] |= 128 >>> G % 8), G += 1;
        }, F;
      }, p = function(I) {
        var G = s.MODE_NUMBER, F = I, B = {};
        B.getMode = function() {
          return G;
        }, B.getLength = function(M) {
          return F.length;
        }, B.write = function(M) {
          for (var g = F, x = 0; x + 2 < g.length; )
            M.put(j(g.substring(x, x + 3)), 10), x += 3;
          x < g.length && (g.length - x == 1 ? M.put(j(g.substring(x, x + 1)), 4) : g.length - x == 2 && M.put(j(g.substring(x, x + 2)), 7));
        };
        var j = function(M) {
          for (var g = 0, x = 0; x < M.length; x += 1)
            g = g * 10 + V(M.charAt(x));
          return g;
        }, V = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          throw "illegal char :" + M;
        };
        return B;
      }, b = function(I) {
        var G = s.MODE_ALPHA_NUM, F = I, B = {};
        B.getMode = function() {
          return G;
        }, B.getLength = function(V) {
          return F.length;
        }, B.write = function(V) {
          for (var M = F, g = 0; g + 1 < M.length; )
            V.put(
              j(M.charAt(g)) * 45 + j(M.charAt(g + 1)),
              11
            ), g += 2;
          g < M.length && V.put(j(M.charAt(g)), 6);
        };
        var j = function(V) {
          if ("0" <= V && V <= "9")
            return V.charCodeAt(0) - 48;
          if ("A" <= V && V <= "Z")
            return V.charCodeAt(0) - 65 + 10;
          switch (V) {
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
              throw "illegal char :" + V;
          }
        };
        return B;
      }, $ = function(I) {
        var G = s.MODE_8BIT_BYTE, F = a.stringToBytes(I), B = {};
        return B.getMode = function() {
          return G;
        }, B.getLength = function(j) {
          return F.length;
        }, B.write = function(j) {
          for (var V = 0; V < F.length; V += 1)
            j.put(F[V], 8);
        }, B;
      }, y = function(I) {
        var G = s.MODE_KANJI, F = a.stringToBytesFuncs.SJIS;
        if (!F)
          throw "sjis not supported.";
        (function(V, M) {
          var g = F(V);
          if (g.length != 2 || (g[0] << 8 | g[1]) != M)
            throw "sjis not supported.";
        })("友", 38726);
        var B = F(I), j = {};
        return j.getMode = function() {
          return G;
        }, j.getLength = function(V) {
          return ~~(B.length / 2);
        }, j.write = function(V) {
          for (var M = B, g = 0; g + 1 < M.length; ) {
            var x = (255 & M[g]) << 8 | 255 & M[g + 1];
            if (33088 <= x && x <= 40956)
              x -= 33088;
            else if (57408 <= x && x <= 60351)
              x -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + x;
            x = (x >>> 8 & 255) * 192 + (x & 255), V.put(x, 13), g += 2;
          }
          if (g < M.length)
            throw "illegal char at " + (g + 1);
        }, j;
      }, k = function() {
        var I = [], G = {};
        return G.writeByte = function(F) {
          I.push(F & 255);
        }, G.writeShort = function(F) {
          G.writeByte(F), G.writeByte(F >>> 8);
        }, G.writeBytes = function(F, B, j) {
          B = B || 0, j = j || F.length;
          for (var V = 0; V < j; V += 1)
            G.writeByte(F[V + B]);
        }, G.writeString = function(F) {
          for (var B = 0; B < F.length; B += 1)
            G.writeByte(F.charCodeAt(B));
        }, G.toByteArray = function() {
          return I;
        }, G.toString = function() {
          var F = "";
          F += "[";
          for (var B = 0; B < I.length; B += 1)
            B > 0 && (F += ","), F += I[B];
          return F += "]", F;
        }, G;
      }, S = function() {
        var I = 0, G = 0, F = 0, B = "", j = {}, V = function(g) {
          B += String.fromCharCode(M(g & 63));
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
        return j.writeByte = function(g) {
          for (I = I << 8 | g & 255, G += 8, F += 1; G >= 6; )
            V(I >>> G - 6), G -= 6;
        }, j.flush = function() {
          if (G > 0 && (V(I << 6 - G), I = 0, G = 0), F % 3 != 0)
            for (var g = 3 - F % 3, x = 0; x < g; x += 1)
              B += "=";
        }, j.toString = function() {
          return B;
        }, j;
      }, C = function(I) {
        var G = I, F = 0, B = 0, j = 0, V = {};
        V.read = function() {
          for (; j < 8; ) {
            if (F >= G.length) {
              if (j == 0)
                return -1;
              throw "unexpected end of file./" + j;
            }
            var g = G.charAt(F);
            if (F += 1, g == "=")
              return j = 0, -1;
            if (g.match(/^\s$/))
              continue;
            B = B << 6 | M(g.charCodeAt(0)), j += 6;
          }
          var x = B >>> j - 8 & 255;
          return j -= 8, x;
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
        return V;
      }, N = function(I, G) {
        var F = I, B = G, j = new Array(I * G), V = {};
        V.setPixel = function(T, L, W) {
          j[L * F + T] = W;
        }, V.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(F), T.writeShort(B), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(F), T.writeShort(B), T.writeByte(0);
          var L = 2, W = g(L);
          T.writeByte(L);
          for (var Y = 0; W.length - Y > 255; )
            T.writeByte(255), T.writeBytes(W, Y, 255), Y += 255;
          T.writeByte(W.length - Y), T.writeBytes(W, Y, W.length - Y), T.writeByte(0), T.writeString(";");
        };
        var M = function(T) {
          var L = T, W = 0, Y = 0, Z = {};
          return Z.write = function(le, de) {
            if (le >>> de)
              throw "length over";
            for (; W + de >= 8; )
              L.writeByte(255 & (le << W | Y)), de -= 8 - W, le >>>= 8 - W, Y = 0, W = 0;
            Y = le << W | Y, W = W + de;
          }, Z.flush = function() {
            W > 0 && L.writeByte(Y);
          }, Z;
        }, g = function(T) {
          for (var L = 1 << T, W = (1 << T) + 1, Y = T + 1, Z = x(), le = 0; le < L; le += 1)
            Z.add(String.fromCharCode(le));
          Z.add(String.fromCharCode(L)), Z.add(String.fromCharCode(W));
          var de = k(), $e = M(de);
          $e.write(L, Y);
          var Ee = 0, ze = String.fromCharCode(j[Ee]);
          for (Ee += 1; Ee < j.length; ) {
            var pe = String.fromCharCode(j[Ee]);
            Ee += 1, Z.contains(ze + pe) ? ze = ze + pe : ($e.write(Z.indexOf(ze), Y), Z.size() < 4095 && (Z.size() == 1 << Y && (Y += 1), Z.add(ze + pe)), ze = pe);
          }
          return $e.write(Z.indexOf(ze), Y), $e.write(W, Y), $e.flush(), de.toByteArray();
        }, x = function() {
          var T = {}, L = 0, W = {};
          return W.add = function(Y) {
            if (W.contains(Y))
              throw "dup key:" + Y;
            T[Y] = L, L += 1;
          }, W.size = function() {
            return L;
          }, W.indexOf = function(Y) {
            return T[Y];
          }, W.contains = function(Y) {
            return typeof T[Y] < "u";
          }, W;
        };
        return V;
      }, D = function(I, G, F) {
        for (var B = N(I, G), j = 0; j < G; j += 1)
          for (var V = 0; V < I; V += 1)
            B.setPixel(V, j, F(V, j));
        var M = k();
        B.write(M);
        for (var g = S(), x = M.toByteArray(), T = 0; T < x.length; T += 1)
          g.writeByte(x[T]);
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
  })(Ss)), Ss.exports;
}
var nC = tC();
const aC = /* @__PURE__ */ eC(nC), sC = ["width", "height", "viewBox"], oC = ["width", "height"], lC = ["d"], iC = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = _(() => {
      const a = aC(0, "M");
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
      h("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, oC),
      h("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, lC)
    ], 8, sC));
  }
}, FI = /* @__PURE__ */ H(iC, [["__scopeId", "data-v-489f0852"]]), rC = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ye({ padding: e.padding })
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, WI = /* @__PURE__ */ H(rC, [["__scopeId", "data-v-47e67f04"]]), uC = {
  class: "list-reader",
  "data-list-reader": ""
}, cC = { class: "list-reader-body" }, dC = {
  key: 0,
  class: "list-reader-group"
}, fC = ["title", "aria-current", "data-row", "onClick"], mC = {
  class: "list-reader-reader",
  "data-reader-pane": ""
}, hC = {
  __name: "ListReaderLayout",
  props: /* @__PURE__ */ ht({
    items: { type: Array, required: !0 },
    listWidth: { type: Number, default: 360 },
    emptyTitle: { type: String, default: "Nothing here yet" },
    pickLine: { type: String, default: "No row chosen" },
    place: { type: Function, default: null },
    // a page that wants its first row read at once, with no row named by the address
    openFirst: { type: Boolean, default: !1 }
  }, {
    chosen: { type: [String, Number], default: null },
    chosenModifiers: {}
  }),
  emits: ["update:chosen"],
  setup(e) {
    const t = e, n = Dt(e, "chosen"), a = _(() => t.items.find((f) => f.id === n.value) ?? null), s = _(() => [...new Set(t.items.map((f) => f.group || ""))]), o = (f) => t.items.filter((m) => (m.group || "") === f);
    function l(f) {
      n.value = f.id, Qm(f.id);
    }
    function i(f) {
      const m = t.items.findIndex((b) => b.id === n.value), p = t.items[Math.min(t.items.length - 1, Math.max(0, m + f))];
      p && l(p);
    }
    const u = { ArrowDown: 1, ArrowUp: -1 };
    function c(f) {
      /^(INPUT|TEXTAREA|SELECT)$/.test(f.target.tagName) || !u[f.key] || (f.preventDefault(), i(u[f.key]));
    }
    return fe(() => t.items.length, () => {
      if (n.value !== null) return;
      const f = t.items.find((m) => String(m.id) === pa.value.row) ?? (t.openFirst ? t.items[0] : void 0);
      f && (n.value = f.id);
    }, { immediate: !0 }), (f, m) => (r(), d("div", uC, [
      ne(f.$slots, "top", {}, void 0, !0),
      h("div", cC, [
        h("div", {
          class: "list-reader-list",
          style: ye({ width: `${e.listWidth}px` }),
          tabindex: "0",
          "aria-label": "List",
          "data-reader-list": "",
          onKeydown: c
        }, [
          e.items.length ? w("", !0) : (r(), P(Mt, {
            key: 0,
            title: e.emptyTitle
          }, {
            default: q(() => [
              ne(f.$slots, "empty", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["title"])),
          (r(!0), d(R, null, X(s.value, (p) => (r(), d(R, { key: p }, [
            p ? (r(), d("p", dC, v(p), 1)) : w("", !0),
            (r(!0), d(R, null, X(o(p), (b) => ke((r(), d("button", {
              key: b.id,
              type: "button",
              class: K(["list-reader-row", { on: b.id === n.value }]),
              title: b.title,
              "aria-current": b.id === n.value,
              "data-reader-row": "",
              "data-row": b.id,
              onClick: ($) => l(b)
            }, [
              A(Kw, {
                title: b.title,
                text: b.desc || ""
              }, Ea({ _: 2 }, [
                f.$slots.meta ? {
                  name: "end",
                  fn: q(() => [
                    ne(f.$slots, "meta", { item: b }, void 0, !0)
                  ]),
                  key: "0"
                } : void 0,
                f.$slots.line ? {
                  name: "text",
                  fn: q(() => [
                    ne(f.$slots, "line", { item: b }, void 0, !0)
                  ]),
                  key: "1"
                } : void 0
              ]), 1032, ["title", "text"])
            ], 10, fC)), [
              [O(Et), e.place ? () => e.place(b) : null]
            ])), 128))
          ], 64))), 128))
        ], 36),
        h("div", mC, [
          a.value ? ne(f.$slots, "reader", { item: a.value }, void 0, !0, 0) : e.items.length ? (r(), P(Mt, {
            key: 1,
            title: e.pickLine
          }, null, 8, ["title"])) : w("", !0)
        ])
      ])
    ]));
  }
}, HI = /* @__PURE__ */ H(hC, [["__scopeId", "data-v-998be0de"]]), pC = {
  class: "reader",
  "data-reader": ""
}, vC = {
  class: "reader-head",
  "data-reader-head": ""
}, gC = { class: "reader-meta" }, yC = {
  key: 0,
  class: "reader-number",
  "data-reader-number": ""
}, bC = { class: "reader-title-line" }, kC = { class: "reader-buttons" }, wC = { class: "reader-body" }, $C = {
  __name: "Reader",
  props: /* @__PURE__ */ ht({
    title: { type: String, required: !0 },
    number: { type: String, default: "" },
    abstract: { type: String, default: "" },
    tabs: { type: Array, default: () => [] },
    facts: { type: Array, default: () => [] }
  }, {
    tab: { type: String, default: "" },
    tabModifiers: {}
  }),
  emits: /* @__PURE__ */ ht(["peek"], ["update:tab"]),
  setup(e, { emit: t }) {
    var u;
    const n = e, a = t, s = Dt(e, "tab");
    s.value || (s.value = ((u = n.tabs[0]) == null ? void 0 : u.key) ?? ""), fe(() => n.tabs.map((c) => c.key).join(), () => {
      var c;
      n.tabs.some((f) => f.key === s.value) || (s.value = ((c = n.tabs[0]) == null ? void 0 : c.key) ?? "");
    });
    const o = _(() => n.tabs.map((c) => ({ key: c.key, label: c.label, count_field: c.count != null ? `count_${c.key}` : "" }))), l = _(() => o.value.find((c) => c.key === s.value) ?? null), i = _(() => Object.fromEntries(n.tabs.filter((c) => c.count != null).map((c) => [`count_${c.key}`, c.count])));
    return (c, f) => (r(), d("article", pC, [
      h("header", vC, [
        h("div", gC, [
          e.number ? (r(), d("span", yC, v(e.number), 1)) : w("", !0),
          ne(c.$slots, "agent", {}, void 0, !0)
        ]),
        h("div", bC, [
          A(Pu, {
            title: e.title,
            abstract: e.abstract
          }, null, 8, ["title", "abstract"]),
          h("span", kC, [
            ne(c.$slots, "primary", {}, void 0, !0),
            ne(c.$slots, "actions", {}, void 0, !0)
          ])
        ])
      ]),
      e.tabs.length ? (r(), P(z8, {
        key: 0,
        tabs: o.value,
        active: l.value,
        answer: i.value,
        onChoose: f[0] || (f[0] = (m) => s.value = m.key)
      }, null, 8, ["tabs", "active", "answer"])) : w("", !0),
      h("div", wC, [
        e.facts.length ? (r(), P(ju, {
          key: 0,
          fields: e.facts,
          onPeek: f[1] || (f[1] = (m) => a("peek", m))
        }, null, 8, ["fields"])) : w("", !0),
        A(Q8, { tab: l.value }, {
          default: q(() => [
            ne(c.$slots, "default", { tab: s.value }, void 0, !0)
          ]),
          _: 3
        }, 8, ["tab"])
      ])
    ]));
  }
}, zI = /* @__PURE__ */ H($C, [["__scopeId", "data-v-4511759f"]]), xC = {
  class: "reader-section",
  "data-reader-section": ""
}, SC = { class: "reader-section-title" }, MC = { class: "reader-section-name" }, _C = {
  __name: "ReaderSection",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", xC, [
      h("h4", SC, [
        h("span", MC, v(e.title), 1),
        ne(t.$slots, "end", {}, void 0, !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, UI = /* @__PURE__ */ H(_C, [["__scopeId", "data-v-ab40cbe5"]]), CC = {
  class: "reader-timeline",
  "data-reader-timeline": ""
}, EC = { class: "reader-timeline-who" }, AC = { class: "reader-timeline-text" }, OC = {
  key: 0,
  class: "reader-timeline-none"
}, TC = {
  __name: "ReaderTimeline",
  props: { entries: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("ol", CC, [
      (r(!0), d(R, null, X(e.entries, (a) => (r(), d("li", {
        key: a.id,
        class: "reader-timeline-entry"
      }, [
        h("span", EC, v(a.by), 1),
        A(Xe, {
          class: "reader-timeline-at",
          at: a.at
        }, null, 8, ["at"]),
        h("span", AC, v(a.text), 1)
      ]))), 128)),
      e.entries.length ? w("", !0) : (r(), d("li", OC, "None"))
    ]));
  }
}, VI = /* @__PURE__ */ H(TC, [["__scopeId", "data-v-312caab5"]]), GI = {
  __name: "ReaderLinks",
  props: { model: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["open"],
  setup(e) {
    const t = Se(Le);
    return (n, a) => (r(), P(Du, {
      model: e.model,
      id: e.id,
      read: O(t).read,
      open: "",
      onOpen: a[0] || (a[0] = (s) => n.$emit("open", s))
    }, null, 8, ["model", "id", "read"]));
  }
}, IC = {
  class: "page-card",
  "data-page-card": ""
}, BC = { class: "page-card-head" }, RC = {
  key: 0,
  class: "page-card-mark",
  "aria-hidden": "true"
}, LC = { class: "page-card-names" }, NC = ["title"], qC = {
  class: "page-card-state",
  "data-card-state": ""
}, DC = {
  key: 1,
  class: "page-card-corner",
  "data-card-corner": ""
}, PC = ["title"], jC = {
  key: 0,
  class: "page-card-fault",
  role: "alert",
  "data-card-fault": ""
}, FC = {
  class: "page-card-foot",
  "data-card-foot": ""
}, WC = {
  __name: "PageCard",
  props: {
    title: { type: String, required: !0 },
    icon: { type: String, default: "" },
    state: { type: String, default: "" },
    line: { type: String, default: "" },
    fault: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("article", IC, [
      h("header", BC, [
        e.icon ? (r(), d("span", RC, [
          A(ae, {
            name: e.icon,
            size: 16
          }, null, 8, ["name"])
        ])) : w("", !0),
        h("span", LC, [
          h("h3", {
            class: "page-card-title",
            title: e.title
          }, v(e.title), 9, NC),
          h("p", qC, v(e.state || "—"), 1)
        ]),
        t.$slots.corner ? (r(), d("span", DC, [
          ne(t.$slots, "corner", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      h("p", {
        class: "page-card-line",
        "data-card-line": "",
        title: e.line
      }, v(e.line || "—"), 9, PC),
      ne(t.$slots, "default", {}, void 0, !0),
      e.fault ? (r(), d("p", jC, v(e.fault), 1)) : w("", !0),
      h("footer", FC, [
        ne(t.$slots, "foot", {}, void 0, !0),
        n[0] || (n[0] = h("span", { class: "page-card-grow" }, null, -1)),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, HC = /* @__PURE__ */ H(WC, [["__scopeId", "data-v-5fb37604"]]), zC = {
  class: "card-page",
  "data-card-page": ""
}, UC = { class: "card-page-body" }, VC = {
  key: 0,
  class: "card-page-group"
}, GC = { class: "card-page-grid" }, KC = {
  __name: "CardPage",
  props: {
    title: { type: String, required: !0 },
    items: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    emptyTitle: { type: String, default: "Nothing here yet" },
    place: { type: Function, default: null }
  },
  setup(e) {
    const t = e, n = E(ba(t.fields)), a = E(""), s = _(() => Nr(t.items, t.fields, n.value, a.value, ["title", "line"])), o = _(() => [...new Set(s.value.map((u) => u.group || ""))]), l = (u) => s.value.filter((c) => (c.group || "") === u), i = () => {
      n.value = ba(t.fields), a.value = "";
    };
    return (u, c) => (r(), d("div", zC, [
      A(c2, {
        title: e.title,
        count: e.items.length
      }, {
        primary: q(() => [
          ne(u.$slots, "primary", {}, void 0, !0)
        ]),
        actions: q(() => [
          ne(u.$slots, "actions", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["title", "count"]),
      A(Pr, {
        modelValue: n.value,
        "onUpdate:modelValue": c[0] || (c[0] = (f) => n.value = f),
        words: a.value,
        "onUpdate:words": c[1] || (c[1] = (f) => a.value = f),
        fields: e.fields,
        rows: e.items,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", UC, [
        s.value.length ? w("", !0) : (r(), P(Mt, {
          key: 0,
          title: e.items.length ? "No match" : e.emptyTitle
        }, {
          default: q(() => [
            e.items.length ? (r(), P(re, {
              key: 0,
              small: "",
              onClick: i
            }, {
              default: q(() => [...c[2] || (c[2] = [
                U("Clear", -1)
              ])]),
              _: 1
            })) : ne(u.$slots, "empty", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["title"])),
        (r(!0), d(R, null, X(o.value, (f) => (r(), d(R, { key: f }, [
          f ? (r(), d("p", VC, v(f), 1)) : w("", !0),
          h("div", GC, [
            (r(!0), d(R, null, X(l(f), (m) => ke((r(), P(HC, {
              key: m.id,
              title: m.title,
              icon: m.icon,
              state: m.state,
              line: m.line,
              fault: m.fault,
              "data-row": m.id
            }, Ea({
              default: q(() => [
                ne(u.$slots, "card", { item: m }, void 0, !0)
              ]),
              _: 2
            }, [
              u.$slots.corner ? {
                name: "corner",
                fn: q(() => [
                  ne(u.$slots, "corner", { item: m }, void 0, !0)
                ]),
                key: "0"
              } : void 0,
              u.$slots.foot ? {
                name: "foot",
                fn: q(() => [
                  ne(u.$slots, "foot", { item: m }, void 0, !0)
                ]),
                key: "1"
              } : void 0,
              u.$slots["card-actions"] ? {
                name: "actions",
                fn: q(() => [
                  ne(u.$slots, "card-actions", { item: m }, void 0, !0)
                ]),
                key: "2"
              } : void 0
            ]), 1032, ["title", "icon", "state", "line", "fault", "data-row"])), [
              [O(Et), e.place ? () => e.place(m) : null]
            ])), 128))
          ])
        ], 64))), 128))
      ])
    ]));
  }
}, KI = /* @__PURE__ */ H(KC, [["__scopeId", "data-v-803a0502"]]), YC = {
  class: "table-layout",
  "data-table-layout": ""
}, QC = { class: "table-layout-body" }, XC = {
  __name: "TableLayout",
  props: {
    columns: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    empty: { type: String, default: "No match" },
    pick: { type: Function, default: null },
    active: { type: [String, Number], default: "" }
  },
  setup(e) {
    const t = e, n = E(ba(t.fields)), a = E(""), s = _(() => Nr(t.rows, t.fields, n.value, a.value, t.columns.map((f) => f.key))), o = _(() => t.columns.map((f) => f.label)), l = _(() => t.columns.some((f) => f.width) ? t.columns.map((f) => f.width ?? "1fr") : []), i = (f) => f.ref ?? (t.pick && f.mark !== void 0 ? String(f.mark) : ""), u = _(() => s.value.map((f) => ({ cells: t.columns.map((m) => f[m.key] ?? ""), open: i(f), tone: f.tone ?? "", mark: f.mark, active: t.active !== "" && f.mark === t.active }))), c = (f) => t.pick ? t.pick(f) : Fe(f);
    return (f, m) => (r(), d("div", YC, [
      A(Pr, {
        modelValue: n.value,
        "onUpdate:modelValue": m[0] || (m[0] = (p) => n.value = p),
        words: a.value,
        "onUpdate:words": m[1] || (m[1] = (p) => a.value = p),
        fields: e.fields,
        rows: e.rows,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", QC, [
        A(kr, {
          columns: o.value,
          widths: l.value,
          rows: u.value,
          empty: e.empty,
          onOpen: c
        }, null, 8, ["columns", "widths", "rows", "empty"])
      ])
    ]));
  }
}, YI = /* @__PURE__ */ H(XC, [["__scopeId", "data-v-ee2fbabd"]]), JC = ["id", "onUpdate:modelValue", "data-field"], ZC = ["value"], eE = ["data-refused"], tE = {
  class: "create-command",
  "data-command-preview": ""
}, nE = {
  key: 0,
  class: "create-refusal",
  role: "alert",
  "data-create-failure": ""
}, aE = { class: "create-actions" }, sE = {
  __name: "CreateDialog",
  props: {
    title: { type: String, required: !0 },
    fields: { type: Array, required: !0 },
    submit: { type: String, default: "Make" },
    // the command line for the values typed so far, shown under the fields
    command: { type: Function, required: !0 },
    // {key: refusal} for the values typed, or nothing when they pass; a refused field keeps its value and says why under it
    check: { type: Function, default: () => ({}) },
    // sends the values; the answer is {ok} or {ok: false, error}
    run: { type: Function, required: !0 }
  },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (b) => b.value ?? (b.kind === "select" ? b.options[0][0] : ""), o = E(Object.fromEntries(n.fields.map((b) => [b.key, s(b)]))), l = E({}), i = E(""), u = E(!1), c = _(() => n.fields.filter((b) => !b.when || b.when(o.value))), f = _(() => c.value.every((b) => !b.required || String(o.value[b.key]).trim())), m = _(() => n.command(o.value));
    async function p() {
      if (u.value || !f.value || (l.value = n.check(o.value) ?? {}, Object.keys(l.value).length)) return;
      u.value = !0;
      const b = await n.run(o.value);
      u.value = !1, i.value = b.ok ? "" : b.error, b.ok && (a("done", o.value), a("close"));
    }
    return (b, $) => (r(), P(Bn, {
      padded: "",
      title: e.title,
      fits: "",
      small: "",
      sheet: "",
      onClose: $[1] || ($[1] = (y) => a("close"))
    }, {
      default: q(() => [
        h("form", {
          class: "create-dialog",
          "data-create-dialog": "",
          onSubmit: ge(p, ["prevent"])
        }, [
          (r(!0), d(R, null, X(c.value, (y) => (r(), P(Ri, {
            key: y.key,
            label: y.label,
            help: y.help,
            for: `create-${y.key}`
          }, {
            default: q(() => [
              y.kind === "select" ? ke((r(), d("select", {
                key: 0,
                id: `create-${y.key}`,
                "onUpdate:modelValue": (k) => o.value[y.key] = k,
                "data-field": y.key
              }, [
                (r(!0), d(R, null, X(y.options, ([k, S]) => (r(), d("option", {
                  key: k,
                  value: k
                }, v(S), 9, ZC))), 128))
              ], 8, JC)), [
                [Pt, o.value[y.key]]
              ]) : y.kind === "slot" ? ne(b.$slots, y.key, {
                value: o.value[y.key],
                values: o.value,
                set: (k) => o.value[y.key] = k
              }, void 0, !0, 1) : y.kind === "area" ? (r(), P(Li, {
                key: 2,
                id: `create-${y.key}`,
                value: o.value[y.key],
                placeholder: y.placeholder,
                "data-field": y.key,
                onInput: (k) => o.value[y.key] = k.target.value
              }, null, 8, ["id", "value", "placeholder", "data-field", "onInput"])) : (r(), P(s2, {
                key: 3,
                id: `create-${y.key}`,
                type: y.kind === "password" ? "password" : y.kind === "number" ? "number" : "text",
                "model-value": String(o.value[y.key]),
                placeholder: y.placeholder,
                "data-field": y.key,
                "onUpdate:modelValue": (k) => o.value[y.key] = k
              }, null, 8, ["id", "type", "model-value", "placeholder", "data-field", "onUpdate:modelValue"])),
              l.value[y.key] ? (r(), d("p", {
                key: 4,
                class: "create-refusal",
                role: "alert",
                "data-refused": y.key
              }, v(l.value[y.key]), 9, eE)) : w("", !0)
            ]),
            _: 2
          }, 1032, ["label", "help", "for"]))), 128)),
          h("code", tE, v(m.value), 1),
          i.value ? (r(), d("p", nE, v(i.value), 1)) : w("", !0),
          h("div", aE, [
            A(re, {
              small: "",
              onClick: $[0] || ($[0] = (y) => a("close"))
            }, {
              default: q(() => [...$[2] || ($[2] = [
                U("Cancel", -1)
              ])]),
              _: 1
            }),
            A(re, {
              variant: "primary",
              small: "",
              type: "submit",
              disabled: !f.value || u.value,
              busy: u.value,
              "data-create-send": ""
            }, {
              default: q(() => [
                U(v(e.submit), 1)
              ]),
              _: 1
            }, 8, ["disabled", "busy"])
          ])
        ], 32)
      ]),
      _: 3
    }, 8, ["title"]));
  }
}, QI = /* @__PURE__ */ H(sE, [["__scopeId", "data-v-550764d3"]]), oE = Symbol.for("journal.toast"), lE = Symbol.for("journal.page-toasts");
function XI() {
  const e = Se(oE, null);
  if (!e) throw new Error("useToast is called only inside a page that shows toasts");
  return e.raise;
}
const iE = ["aria-selected", "data-tab", "onPointerdown", "onAuxclick", "onKeydown"], rE = { class: "pane-tab-label" }, uE = ["aria-label", "onClick"], cE = 1, dE = {
  __name: "EditorTabs",
  props: { tabs: { type: Array, required: !0 }, insertAt: { type: Number, default: -1 }, extra: { type: Function, default: () => [] } },
  emits: ["pick", "close", "grab"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(!1);
    let l = null;
    async function i() {
      o.value = !1, await Ne(), s.value && (o.value = s.value.scrollWidth > s.value.clientWidth);
    }
    const u = (f) => f.forEach((m) => a("close", m.key)), c = (f, m) => ({
      head: f.title,
      items: [
        { label: "Close", group: "open", keys: "Del", run: () => a("close", f.key) },
        { label: "Close others", group: "open", disabled: n.tabs.length < 2, reason: "Only tab", run: () => u(n.tabs.filter((p) => p !== f)) },
        { label: "Close to the right", group: "open", disabled: m === n.tabs.length - 1, reason: "None", run: () => u(n.tabs.slice(m + 1)) },
        { label: "Close all", group: "open", run: () => u(n.tabs) },
        ...n.extra(f)
      ]
    });
    return fe(() => n.tabs.map((f) => `${f.title}:${f.count ?? ""}`).join("|"), i), Ce(() => {
      i(), !(typeof ResizeObserver > "u") && (l = new ResizeObserver(i), l.observe(s.value));
    }), tt(() => l == null ? void 0 : l.disconnect()), (f, m) => (r(), d("div", {
      class: K(["pane-tabs", { compact: o.value }])
    }, [
      h("div", {
        ref_key: "row",
        ref: s,
        class: "pane-tabs-row",
        role: "tablist"
      }, [
        (r(!0), d(R, null, X(e.tabs, (p, b) => ke((r(), d("div", {
          key: p.key,
          role: "tab",
          tabindex: "0",
          "aria-selected": p.on,
          class: K([
            "pane-tab",
            {
              on: p.on,
              lifting: p.lifting,
              gone: p.gone,
              "insert-before": e.insertAt === b,
              "insert-after": e.insertAt === e.tabs.length && b === e.tabs.length - 1
            }
          ]),
          "data-tab": p.key,
          onPointerdown: ($) => a("grab", $, p.key),
          onMousedown: m[1] || (m[1] = ge(() => {
          }, ["middle", "prevent"])),
          onAuxclick: ($) => $.button === cE && (a("close", p.key), $.preventDefault()),
          onKeydown: [
            Ve(ge(($) => a("pick", p.key), ["prevent"]), ["enter"]),
            Ve(ge(($) => a("pick", p.key), ["prevent"]), ["space"]),
            Ve(ge(($) => a("close", p.key), ["prevent"]), ["delete"])
          ]
        }, [
          A(At, {
            name: p.icon
          }, null, 8, ["name"]),
          h("span", rE, v(p.title), 1),
          p.count !== void 0 ? (r(), d("span", {
            key: 0,
            class: K(["pane-tab-n", { hot: p.hot }])
          }, v(p.count), 3)) : w("", !0),
          h("button", {
            type: "button",
            class: "pane-tab-x",
            tabindex: "-1",
            "aria-label": `Close ${p.title}`,
            onPointerdown: m[0] || (m[0] = ge(() => {
            }, ["stop"])),
            onClick: ge(($) => a("close", p.key), ["stop"])
          }, [
            A(ae, {
              name: "x",
              size: 10
            })
          ], 40, uE)
        ], 42, iE)), [
          [O(Et), () => c(p, b)]
        ])), 128))
      ], 512),
      ne(f.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, JI = /* @__PURE__ */ H(dE, [["__scopeId", "data-v-6b328f63"]]), fE = ["open", "copy", "own", "delete"], mE = (e) => e.danger ? "delete" : e.group ?? "own";
function hE(e) {
  return fE.map((n) => e.filter((a) => mE(a) === n)).filter((n) => n.length).flatMap((n, a) => [
    ...a ? [{ separator: !0, key: `separator-${a}` }] : [],
    ...n.map((s, o) => ({ ...s, key: `${a}-${o}` }))
  ]);
}
function pE() {
  const e = E(null);
  let t = null;
  const n = (l, i, u, c, f = c) => {
    t = f, e.value = { at: l, head: i, items: u, target: c };
  };
  function a(l, i, u) {
    l.preventDefault(), n({ x: l.clientX, y: l.clientY }, i, u, l.currentTarget);
  }
  function s(l, i, u) {
    if (l.key !== "ContextMenu" && !(l.shiftKey && l.key === "F10")) return;
    l.preventDefault();
    const c = l.target.getBoundingClientRect();
    n({ x: Math.max(8, c.left + 8), y: Math.min(window.innerHeight - 8, c.bottom + 2) }, i, u, l.currentTarget);
  }
  function o() {
    e.value = null, t != null && t.isConnected && t.focus({ preventScroll: !0 });
  }
  return { menu: e, show: n, open: a, openFromKey: s, close: o };
}
const vE = {
  key: 0,
  class: "context-head",
  "data-context-head": ""
}, gE = {
  key: 0,
  class: "context-separator",
  role: "separator",
  "data-context-separator": ""
}, yE = { class: "context-label" }, bE = {
  key: 0,
  class: "context-note",
  "data-context-reason": ""
}, kE = {
  key: 1,
  class: "context-note",
  "aria-hidden": "true"
}, wE = {
  key: 2,
  class: "context-note"
}, $E = ".context-menu", xE = {
  __name: "ContextMenu",
  props: {
    at: { type: Object, required: !0 },
    head: { type: String, default: "" },
    items: { type: Array, required: !0 },
    // the element the menu belongs to; it wears an accent ring while the menu is open
    target: { type: Object, default: null },
    depth: { type: Number, default: 0 }
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(() => hE(n.items)), o = E(null), l = E(""), i = (C) => [...C.querySelectorAll("[data-menu-item]:not(:disabled)")], u = (C, N) => {
      var D;
      return (D = N(i(C))) == null ? void 0 : D.focus();
    }, c = (C) => s.value.find((N) => N.key === (C == null ? void 0 : C.dataset.menuItem));
    function f(C, N) {
      if (!C.disabled) {
        if (C.children) {
          const D = N.getBoundingClientRect();
          o.value = { items: C.children, at: { x: D.right + 2, y: D.top - 4, flipX: D.left - 2 }, opener: N };
          return;
        }
        if (C.danger && l.value !== C.key) {
          l.value = C.key;
          return;
        }
        a("close", !0), C.run && setTimeout(C.run, 0);
      }
    }
    function m(C, N) {
      if (N.focus(), C.children && !C.disabled) return f(C, N);
      o.value = null;
    }
    function p(C, N) {
      var G;
      const D = i(C);
      (G = D.slice(D.indexOf(document.activeElement) + 1).concat(D).find((F) => c(F).label.toLowerCase().startsWith(N.toLowerCase()))) == null || G.focus();
    }
    const b = {
      Home: (C) => u(C, (N) => N[0]),
      End: (C) => u(C, (N) => N[N.length - 1]),
      Enter: () => document.activeElement.click(),
      " ": () => document.activeElement.click(),
      ArrowRight: (C) => {
        var N;
        return ((N = c(document.activeElement)) == null ? void 0 : N.children) && document.activeElement.click();
      },
      ArrowLeft: () => n.depth && a("close", !1),
      Tab: () => a("close", !1)
    };
    function $(C) {
      const N = C.currentTarget, D = N.contains(document.activeElement) && document.activeElement.dataset.menuItem !== void 0;
      b[C.key] && (D || !["Enter", " ", "ArrowRight"].includes(C.key)) ? (C.preventDefault(), b[C.key](N)) : C.key.length === 1 && !C.ctrlKey && !C.metaKey && !C.altKey && p(N, C.key);
    }
    function y(C) {
      var N, D;
      (D = (N = C.target).closest) != null && D.call(N, $E) || a("close", !1);
    }
    const k = () => a("close", !1), S = (C) => {
      const N = o.value.opener;
      o.value = null, C ? a("close", !0) : N.focus();
    };
    return Ce(() => {
      var C;
      (C = n.target) == null || C.classList.add("menu-target"), !n.depth && (window.addEventListener("pointerdown", y, !0), window.addEventListener("scroll", y, !0), window.addEventListener("blur", k), window.addEventListener("resize", k));
    }), Be(() => {
      var C;
      (C = n.target) == null || C.classList.remove("menu-target"), window.removeEventListener("pointerdown", y, !0), window.removeEventListener("scroll", y, !0), window.removeEventListener("blur", k), window.removeEventListener("resize", k);
    }), (C, N) => {
      const D = li("ContextMenu", !0);
      return r(), P(Wt, {
        class: "context-menu",
        role: "menu",
        "data-context-menu": "",
        point: e.at,
        gap: 0,
        "min-width": 196,
        "max-width": 320,
        "aria-label": e.head,
        onClose: N[0] || (N[0] = (I) => a("close", !1)),
        onKeydown: $,
        onContextmenu: N[1] || (N[1] = ge(() => {
        }, ["prevent"]))
      }, {
        default: q(() => [
          e.head && !e.depth ? (r(), d("p", vE, v(e.head), 1)) : w("", !0),
          (r(!0), d(R, null, X(s.value, (I) => (r(), d(R, {
            key: I.key
          }, [
            I.separator ? (r(), d("hr", gE)) : (r(), P(He, {
              key: 1,
              role: "menuitem",
              class: K({ "context-danger": I.danger, "context-armed": l.value === I.key }),
              disabled: I.disabled,
              "aria-haspopup": I.children ? "menu" : void 0,
              title: I.disabled ? I.reason : void 0,
              "data-menu-item": I.key,
              onClick: (G) => f(I, G.currentTarget),
              onMouseenter: (G) => m(I, G.currentTarget)
            }, {
              default: q(() => [
                h("span", yE, v(l.value === I.key ? I.armedLabel ?? `${I.label}: click again` : I.label), 1),
                I.disabled ? (r(), d("span", bE, v(I.reason), 1)) : I.children ? (r(), d("span", kE, "›")) : I.keys ? (r(), d("kbd", wE, v(I.keys), 1)) : w("", !0)
              ]),
              _: 2
            }, 1032, ["class", "disabled", "aria-haspopup", "title", "data-menu-item", "onClick", "onMouseenter"]))
          ], 64))), 128)),
          o.value ? (r(), P(D, {
            key: 1,
            depth: e.depth + 1,
            at: o.value.at,
            items: o.value.items,
            onClose: S
          }, null, 8, ["depth", "at", "items"])) : w("", !0)
        ]),
        _: 1
      }, 8, ["point", "aria-label"]);
    };
  }
}, SE = /* @__PURE__ */ H(xE, [["__scopeId", "data-v-92b4e261"]]), ZI = {
  __name: "ActionsMenu",
  props: { items: { type: Array, required: !0 }, head: { type: String, default: "" }, label: { type: String, default: "Actions" } },
  setup(e) {
    const t = e, { menu: n, show: a, close: s } = pE(), o = (u, c = null) => {
      var f;
      return (f = globalThis[lE]) == null ? void 0 : f.raise(u, c);
    }, l = (u) => u.map((c) => ({ ...c, run: c.run && (() => c.run({ say: o })), children: c.children && l(c.children) }));
    function i(u) {
      const c = u.currentTarget.getBoundingClientRect();
      a({ x: c.left, y: c.bottom + 2, flipX: c.right }, t.head, l(t.items), u.currentTarget);
    }
    return (u, c) => (r(), d(R, null, [
      A(re, {
        small: "",
        "aria-haspopup": "menu",
        "aria-expanded": !!O(n),
        "data-actions-menu": "",
        onClick: i
      }, {
        default: q(() => [
          U(v(e.label), 1),
          A(ae, {
            name: "chevronRight",
            size: 11,
            facing: "down"
          })
        ]),
        _: 1
      }, 8, ["aria-expanded"]),
      O(n) ? (r(), P(SE, De({ key: 0 }, O(n), { onClose: O(s) }), null, 16, ["onClose"])) : w("", !0)
    ], 64));
  }
}, ME = { class: "text-list" }, _E = { class: "text-number" }, CE = ["value", "aria-label", "placeholder", "onInput"], EE = { class: "text-moves" }, AE = {
  __name: "TextList",
  props: {
    items: { type: Array, required: !0 },
    kind: { type: String, default: "item" },
    noun: { type: String, default: "Item" },
    placeholder: { type: String, default: "" },
    addLabel: { type: String, default: "Add one" },
    // the last one cannot be removed while the list must not be empty
    keepOne: { type: Boolean, default: !0 }
  },
  emits: ["items"],
  setup(e, { emit: t }) {
    const n = e, a = t;
    function s(i, u) {
      a("items", n.items.map((c, f) => f === i ? u : c));
    }
    function o(i, u) {
      const c = [...n.items], [f] = c.splice(i, 1);
      c.splice(i + u, 0, f), a("items", c);
    }
    const l = (i) => a("items", n.items.filter((u, c) => c !== i));
    return (i, u) => (r(), d(R, null, [
      h("ol", ME, [
        (r(!0), d(R, null, X(e.items, (c, f) => (r(), d("li", {
          key: f,
          class: "text-card"
        }, [
          h("span", _E, v(f + 1), 1),
          h("textarea", kt({
            value: c,
            rows: "2",
            "aria-label": `${e.noun} ${f + 1}`,
            placeholder: e.placeholder,
            [`data-${e.kind}-text` || ""]: "",
            onInput: (m) => s(f, m.target.value)
          }), null, 16, CE),
          h("div", EE, [
            A(re, kt({
              small: "",
              disabled: f === 0,
              "aria-label": `Move ${e.noun.toLowerCase()} ${f + 1} up`,
              [`data-${e.kind}-up` || ""]: "",
              onClick: (m) => o(f, -1)
            }), {
              default: q(() => [
                A(ae, {
                  name: "up",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"]),
            A(re, kt({
              small: "",
              disabled: f === e.items.length - 1,
              "aria-label": `Move ${e.noun.toLowerCase()} ${f + 1} down`,
              [`data-${e.kind}-down` || ""]: "",
              onClick: (m) => o(f, 1)
            }), {
              default: q(() => [
                A(ae, {
                  name: "down",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"]),
            A(re, kt({
              small: "",
              disabled: e.keepOne && e.items.length === 1,
              "aria-label": `Remove ${e.noun.toLowerCase()} ${f + 1}`,
              [`data-${e.kind}-remove` || ""]: "",
              onClick: (m) => l(f)
            }), {
              default: q(() => [
                A(ae, {
                  name: "trash",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"])
          ])
        ]))), 128))
      ]),
      A(re, kt({
        small: "",
        bordered: "",
        [`data-${e.kind}-add` || ""]: "",
        onClick: u[0] || (u[0] = (c) => a("items", [...e.items, ""]))
      }), {
        default: q(() => [
          U(v(e.addLabel), 1)
        ]),
        _: 1
      }, 16)
    ], 64));
  }
}, eB = /* @__PURE__ */ H(AE, [["__scopeId", "data-v-432edb9d"]]), tB = {
  __name: "HostedWindow",
  props: { name: { type: String, required: !0 }, options: { type: Object, default: () => ({}) } },
  setup(e) {
    const t = Se(Ta, null), n = at();
    return (a, s) => O(t) ? (r(), P(Sr, {
      key: 0,
      name: e.name,
      catalogue: O(t).catalogue,
      subscriptions: O(t).subscriptions,
      environment: O(n).environment,
      prompts: O(t).prompts,
      "shell-read": O(t).shellRead,
      options: e.options
    }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : w("", !0);
  }
}, OE = ["data-comment"], TE = { class: "comment-who" }, IE = { key: 0 }, BE = {
  key: 1,
  class: "badge-quiet",
  "data-comment-outdated": ""
}, RE = { key: 0 }, LE = { class: "comment-text" }, NE = {
  key: 1,
  class: "comment-who comment-reply"
}, qE = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: K(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment": e.comment.id,
      onClick: n[0] || (n[0] = (a) => t.$emit("show"))
    }, [
      h("div", TE, [
        h("span", {
          class: K(["comment-by", { agent: e.comment.agent }])
        }, v(e.comment.by), 3),
        e.comment.at ? (r(), d("span", IE, v(e.comment.at), 1)) : w("", !0),
        e.comment.outdated ? (r(), d("span", BE, "Lines changed")) : w("", !0)
      ]),
      e.comment.quote ? (r(), d("blockquote", RE, v(e.comment.quote), 1)) : w("", !0),
      h("p", LE, v(e.comment.text), 1),
      e.comment.reply ? (r(), d("div", NE, [
        h("span", null, [
          h("b", null, v(e.comment.reply.by), 1),
          U(": " + v(e.comment.reply.text), 1)
        ])
      ])) : w("", !0)
    ], 10, OE));
  }
}, DE = /* @__PURE__ */ H(qE, [["__scopeId", "data-v-390d0c5e"]]), PE = { class: "rail-head" }, jE = { class: "rail-count" }, FE = { class: "rail-list" }, WE = {
  key: 0,
  class: "rail-empty"
}, HE = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, floating: Boolean, empty: { type: String, default: "No comments" } },
  emits: ["show", "close"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: K(["comment-rail", { floating: e.floating }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", PE, [
        n[1] || (n[1] = h("h3", null, "Comments", -1)),
        h("span", jE, v(e.comments.length), 1),
        n[2] || (n[2] = h("span", { class: "rail-grow" }, null, -1)),
        A(re, {
          small: "",
          title: "Hide",
          "aria-label": "Hide the comments",
          "data-rail-close": "",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        }, {
          default: q(() => [
            A(ae, {
              name: "close",
              size: 12
            })
          ]),
          _: 1
        })
      ]),
      h("div", FE, [
        e.comments.length ? w("", !0) : (r(), d("p", WE, v(e.empty), 1)),
        (r(!0), d(R, null, X(e.comments, (a) => (r(), P(DE, {
          key: a.id,
          comment: a,
          hot: e.hot === a.id,
          onShow: (s) => t.$emit("show", a.id)
        }, null, 8, ["comment", "hot", "onShow"]))), 128))
      ])
    ], 2));
  }
}, nB = /* @__PURE__ */ H(HE, [["__scopeId", "data-v-1c625f14"]]), zE = {
  class: "comment-dock",
  "data-comment-box": ""
}, UE = { class: "comment-box" }, VE = ["onKeydown"], GE = {
  key: 0,
  class: "box-quote",
  "data-box-quote": ""
}, KE = { class: "box-quote-words" }, YE = { class: "box-actions" }, QE = {
  key: 1,
  class: "box-closed"
}, XE = {
  __name: "CommentBox",
  props: { count: { type: Number, default: 0 }, quote: { type: String, default: "" }, placeholder: { type: String, default: "Comment on this file, or pick lines first" }, sending: Boolean },
  emits: ["send", "show", "clear-quote"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = E(!1), l = E(""), i = E(null);
    fe(() => a.quote, (f) => f && u());
    async function u() {
      var f;
      o.value = !0, await Ne(), (f = i.value) == null || f.focus();
    }
    t({ openBox: u });
    function c() {
      const f = l.value.trim();
      !f || a.sending || (s("send", f), l.value = "", o.value = !1);
    }
    return (f, m) => (r(), d("div", zE, [
      h("div", UE, [
        o.value ? (r(), d("form", {
          key: 0,
          class: "box-form",
          onSubmit: ge(c, ["prevent"]),
          onKeydown: [
            m[3] || (m[3] = Ve(ge((p) => o.value = !1, ["stop"]), ["esc"])),
            Ve(ge(c, ["meta", "prevent"]), ["enter"]),
            Ve(ge(c, ["ctrl", "prevent"]), ["enter"])
          ]
        }, [
          e.quote ? (r(), d("div", GE, [
            m[5] || (m[5] = h("b", null, "On", -1)),
            h("span", KE, v(e.quote), 1),
            h("button", {
              type: "button",
              class: "box-quote-clear",
              title: "Whole file",
              "aria-label": "Whole file",
              onClick: m[0] || (m[0] = (p) => s("clear-quote"))
            }, [
              A(ae, {
                name: "close",
                size: 10
              })
            ])
          ])) : w("", !0),
          ke(h("textarea", {
            ref_key: "field",
            ref: i,
            "onUpdate:modelValue": m[1] || (m[1] = (p) => l.value = p),
            placeholder: "Comment",
            "aria-label": "Comment",
            "data-box-field": ""
          }, null, 512), [
            [Ue, l.value]
          ]),
          h("div", YE, [
            A(re, {
              small: "",
              onClick: m[2] || (m[2] = (p) => o.value = !1)
            }, {
              default: q(() => [...m[6] || (m[6] = [
                U("Cancel", -1)
              ])]),
              _: 1
            }),
            A(re, {
              small: "",
              variant: "primary",
              disabled: !l.value.trim() || e.sending,
              "data-box-send": "",
              onClick: c
            }, {
              default: q(() => [...m[7] || (m[7] = [
                U("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ], 40, VE)) : (r(), d("div", QE, [
          h("button", {
            type: "button",
            class: "box-open",
            "data-box-open": "",
            onClick: u
          }, [
            A(ae, {
              name: "chat",
              size: 13
            }),
            h("span", null, v(e.placeholder), 1)
          ]),
          e.count > 0 ? (r(), P(re, {
            key: 0,
            small: "",
            title: "Comments",
            "aria-label": "Show the comments",
            "data-box-count": "",
            onClick: m[4] || (m[4] = (p) => s("show"))
          }, {
            default: q(() => [
              A(ae, {
                name: "chat",
                size: 13
              }),
              U(v(e.count), 1)
            ]),
            _: 1
          })) : w("", !0)
        ]))
      ])
    ]));
  }
}, aB = /* @__PURE__ */ H(XE, [["__scopeId", "data-v-b494c444"]]), sB = Qu(() => import("./VoiceFigure-rpvwxvvx.js").then((e) => e.V)), oB = "1.2.0", lB = "3.5";
export {
  zm as $,
  Ie as A,
  qe as B,
  Na as C,
  vt as D,
  VT as E,
  qx as F,
  NO as G,
  WT as H,
  gx as I,
  zx as J,
  zt as K,
  tA as L,
  Lo as M,
  Qx as N,
  Hx as O,
  La as P,
  rT as Q,
  pO as R,
  ua as S,
  mT as T,
  iO as U,
  Re as V,
  wa as W,
  lO as X,
  oO as Y,
  Hm as Z,
  H as _,
  XA as a,
  OT as a$,
  Kx as a0,
  vO as a1,
  gO as a2,
  Le as a3,
  EO as a4,
  CO as a5,
  jt as a6,
  yO as a7,
  jO as a8,
  jA as a9,
  $T as aA,
  oT as aB,
  lx as aC,
  zO as aD,
  UO as aE,
  GT as aF,
  hu as aG,
  fT as aH,
  Pn as aI,
  VA as aJ,
  HA as aK,
  NT as aL,
  jn as aM,
  jT as aN,
  LO as aO,
  lT as aP,
  iT as aQ,
  sT as aR,
  Cn as aS,
  qt as aT,
  FA as aU,
  Q5 as aV,
  nT as aW,
  mO as aX,
  fu as aY,
  tn as aZ,
  rn as a_,
  TT as aa,
  DT as ab,
  YA as ac,
  rO as ad,
  uO as ae,
  MO as af,
  _O as ag,
  AO as ah,
  tO as ai,
  Vl as aj,
  bO as ak,
  PO as al,
  XT as am,
  JO as an,
  QO as ao,
  YO as ap,
  OO as aq,
  xO as ar,
  $O as as,
  SO as at,
  dT as au,
  DO as av,
  FO as aw,
  eI as ax,
  vn as ay,
  WO as az,
  i8 as b,
  ZT as b$,
  Bx as b0,
  PT as b1,
  vT as b2,
  pT as b3,
  k4 as b4,
  Zr as b5,
  CT as b6,
  qO as b7,
  Pa as b8,
  wt as b9,
  yT as bA,
  ST as bB,
  St as bC,
  hT as bD,
  MT as bE,
  HO as bF,
  ZO as bG,
  VO as bH,
  je as bI,
  RO as bJ,
  _T as bK,
  rI as bL,
  uI as bM,
  DA as bN,
  Z5 as bO,
  IO as bP,
  bT as bQ,
  JA as bR,
  QT as bS,
  gT as bT,
  kT as bU,
  wT as bV,
  TO as bW,
  ix as bX,
  BO as bY,
  KO as bZ,
  YT as b_,
  xT as ba,
  ds as bb,
  nr as bc,
  nI as bd,
  oI as be,
  cT as bf,
  LT as bg,
  PA as bh,
  XO as bi,
  aI as bj,
  kO as bk,
  wO as bl,
  aO as bm,
  hO as bn,
  UA as bo,
  BT as bp,
  ZA as bq,
  eO as br,
  sO as bs,
  tT as bt,
  U5 as bu,
  FT as bv,
  Wx as bw,
  nO as bx,
  GA as by,
  eT as bz,
  b4 as c,
  EI as c$,
  zA as c0,
  WA as c1,
  GO as c2,
  lI as c3,
  jo as c4,
  iI as c5,
  Au as c6,
  RT as c7,
  dO as c8,
  cO as c9,
  NI as cA,
  qA as cB,
  bA as cC,
  w0 as cD,
  io as cE,
  JI as cF,
  Mt as cG,
  q6 as cH,
  Eo as cI,
  cI as cJ,
  Pr as cK,
  w2 as cL,
  ZE as cM,
  ln as cN,
  Ri as cO,
  DI as cP,
  tB as cQ,
  u1 as cR,
  $i as cS,
  ae as cT,
  Bi as cU,
  z8 as cV,
  fA as cW,
  oB as cX,
  lB as cY,
  HI as cZ,
  Kw as c_,
  Y5 as ca,
  KA as cb,
  jx as cc,
  aT as cd,
  Io as ce,
  tx as cf,
  uT as cg,
  gn as ch,
  Xt as ci,
  ZI as cj,
  Qt as ck,
  gA as cl,
  kA as cm,
  $n as cn,
  _I as co,
  re as cp,
  _m as cq,
  vo as cr,
  KI as cs,
  Ia as ct,
  aB as cu,
  DE as cv,
  nB as cw,
  QI as cx,
  y0 as cy,
  Bn as cz,
  et as d,
  Nf as d$,
  Fs as d0,
  BA as d1,
  U$ as d2,
  ct as d3,
  He as d4,
  xt as d5,
  Wt as d6,
  wA as d7,
  _A as d8,
  uA as d9,
  nt as dA,
  Ot as dB,
  Oy as dC,
  Jd as dD,
  Kp as dE,
  TA as dF,
  rA as dG,
  Ft as dH,
  Q8 as dI,
  YI as dJ,
  CI as dK,
  y_ as dL,
  PI as dM,
  jI as dN,
  Ra as dO,
  Li as dP,
  s2 as dQ,
  eB as dR,
  Xe as dS,
  sB as dT,
  WI as dU,
  So as dV,
  bI as dW,
  ao as dX,
  m1 as dY,
  $o as dZ,
  mA as d_,
  pd as da,
  M$ as db,
  ya as dc,
  HC as dd,
  c2 as de,
  LI as df,
  hA as dg,
  pA as dh,
  vA as di,
  xA as dj,
  qI as dk,
  FI as dl,
  Mo as dm,
  zI as dn,
  GI as dp,
  UI as dq,
  VI as dr,
  zd as ds,
  SI as dt,
  Db as du,
  iA as dv,
  LA as dw,
  Dr as dx,
  _t as dy,
  CA as dz,
  fO as e,
  eA as e$,
  dr as e0,
  Jt as e1,
  on as e2,
  bf as e3,
  Nr as e4,
  BI as e5,
  II as e6,
  fI as e7,
  ro as e8,
  yf as e9,
  MA as eA,
  yI as eB,
  kI as eC,
  Fe as eD,
  p1 as eE,
  $A as eF,
  gd as eG,
  pI as eH,
  Fr as eI,
  gI as eJ,
  ci as eK,
  SA as eL,
  w1 as eM,
  Sn as eN,
  oA as eO,
  k1 as eP,
  Qa as eQ,
  aA as eR,
  kn as eS,
  co as eT,
  wf as eU,
  dA as eV,
  ft as eW,
  lA as eX,
  EA as eY,
  S8 as eZ,
  dI as e_,
  Oa as ea,
  en as eb,
  qs as ec,
  ba as ed,
  yA as ee,
  RI as ef,
  NA as eg,
  AA as eh,
  ki as ei,
  sd as ej,
  od as ek,
  l$ as el,
  RA as em,
  IA as en,
  vI as eo,
  yp as ep,
  mI as eq,
  hI as er,
  sA as es,
  OI as et,
  D$ as eu,
  Br as ev,
  Tr as ew,
  Xm as ex,
  cA as ey,
  OA as ez,
  z5 as f,
  nA as f0,
  MI as f1,
  hr as f2,
  AI as f3,
  Wr as f4,
  Si as f5,
  o3 as f6,
  so as f7,
  wI as f8,
  Ms as f9,
  $I as fa,
  XI as fb,
  xI as fc,
  at as fd,
  Et as fe,
  TI as ff,
  kf as fg,
  tI as g,
  En as h,
  HT as i,
  sI as j,
  zT as k,
  IT as l,
  f8 as m,
  No as n,
  qT as o,
  QA as p,
  UT as q,
  Cu as r,
  Eu as s,
  Oe as t,
  $4 as u,
  ET as v,
  JT as w,
  AT as x,
  Wn as y,
  KT as z
};
