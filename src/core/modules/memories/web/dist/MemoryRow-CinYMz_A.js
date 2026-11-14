import { openBlock as h, createBlock as g, unref as d } from "vue";
import { useWindow as x, CreateDialog as b, peekRef as $, copying as k, short as f, deleteItem as v } from "@journal/window-kit";
const u = 400, T = {
  __name: "MemoryEdit",
  props: { row: { type: Object, required: !0 } },
  emits: ["close"],
  setup(t, { emit: n }) {
    const s = t, l = n, c = x(), o = [{ key: "text", label: "What the memory says", kind: "area", required: !0, value: s.row.text }], i = (r) => r.text.trim().length > u ? { text: `A memory is at most ${u} characters.` } : {}, a = (r) => `journal memory edit ${s.row.id} --text "${r.text.trim().slice(0, 40)}${r.text.trim().length > 40 ? "…" : ""}"`;
    return (r, e) => (h(), g(d(b), {
      title: `Edit memory ${t.row.id}`,
      submit: "Save the memory",
      fields: o,
      command: a,
      check: i,
      run: (m) => d(c).run(["memory", "edit", String(t.row.id), "--text", m.text.trim()]),
      onClose: e[0] || (e[0] = (m) => l("close"))
    }, null, 8, ["title", "run"]));
  }
}, w = [["9", "owed work"], ["7", "later today"], ["5", "work in hand"]], I = Array.from({ length: 10 }, (t, n) => [String(n + 1), ""]);
function S(t, { run: n, ask: s, weights: l = w, openLabel: c = "Open" }) {
  const o = String(t.id), i = t.state === "removed", a = ["memory", "restore", o], r = (e, m, y) => async ({ say: p }) => p((await n(e)).ok ? m : y);
  return [
    { label: c, group: "open", run: () => $(`memories:${t.id}`) },
    { label: "Weigh", group: "open", disabled: i, reason: "Removed", children: l.map(([e, m]) => ({
      label: m ? `${e}: ${m}` : e,
      run: r(["memory", "weigh", o, e], `Memory ${o} weighs ${e}`, "The journal refused the weight")
    })) },
    { label: "Copy text", group: "copy", run: ({ say: e }) => k(t.text, f(t.text, 30), e) },
    { label: "Edit", group: "own", disabled: i, reason: "Removed", run: s },
    i ? { label: "Bring it back", group: "own", run: r(a, `Memory ${o} is back`, "The journal could not restore it") } : v({ word: "Remove", name: `memory ${o}`, remove: () => n(["memory", "remove", o, "--reason", "Removed from the memory list"]), restore: a })
  ];
}
export {
  I as R,
  T as _,
  S as m
};
