import { ref as f, watch as p, onUnmounted as h } from "vue";
const m = (t, o) => {
  const e = t.__vccOpts || t;
  for (const [r, a] of o)
    e[r] = a;
  return e;
}, g = 1440 * 60 * 1e3, _ = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function w(t, o) {
  const e = o.trim().toLowerCase();
  return e ? t.filter((r) => `${r.title} ${r.abstract}`.toLowerCase().includes(e)) : t;
}
function L(t, o) {
  const e = [...t];
  return o === "title" ? e.sort((r, a) => r.title.localeCompare(a.title)) : e.sort((r, a) => String(a.updated_at).localeCompare(String(r.updated_at)));
}
function S(t, o, e = Date.now()) {
  if (o === "title") return t.length ? [{ key: "all", title: "", rows: t }] : [];
  const r = _.map((a) => ({ ...a, rows: [] }));
  for (const a of t) {
    const n = (e - Date.parse(a.updated_at)) / g;
    r.find((s) => n < s.days).rows.push(a);
  }
  return r.filter((a) => a.rows.length);
}
function C(t, o, e) {
  const r = t.props.library, a = f([]), n = f(0), { failure: s, loaded: d } = r;
  t.state["library.type"] = o.value, t.state["library.state"] = e.value, p(r.data, (l) => {
    a.value = l.rows, n.value = l.total;
  }, { once: !0 });
  async function i() {
    const l = o.value, u = e.value;
    t.state["library.type"] = l, t.state["library.state"] = u, delete t.state["library.before"];
    const c = await t.reload("library");
    l !== o.value || u !== e.value || (a.value = c && !s.value ? r.data.value.rows : [], n.value = c && !s.value ? r.data.value.total : 0, d.value = !0);
  }
  async function v() {
    const l = o.value, u = e.value;
    t.state["library.before"] = String(Math.min(...a.value.map((b) => b.id)));
    const c = await t.reload("library");
    delete t.state["library.before"], !(!c || s.value) && l === o.value && u === e.value && (a.value = [...a.value, ...r.data.value.rows]);
  }
  p([o, e], () => {
    a.value = [], d.value = !1, i();
  });
  const y = t.follow(["doc.*", "report.*"], i);
  return h(() => y == null ? void 0 : y()), { rows: a, total: n, failure: s, loaded: d, load: i, more: v };
}
export {
  m as _,
  w as a,
  S as g,
  L as s,
  C as u
};
