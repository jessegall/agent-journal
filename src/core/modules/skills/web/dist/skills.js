/* @code-commandments-generated */
if (!document.getElementById("window-styles-018c5c472096")) { const style = document.createElement("style"); style.id = "window-styles-018c5c472096"; style.textContent = ".skills[data-v-2178931f]{display:flex;flex-direction:column;gap:8px}.skills-note[data-v-2178931f]{margin:0;font-size:12px;color:var(--text-3)}.skill-row[data-v-2178931f]{display:flex;gap:8px;align-items:center;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:6px;background:transparent;color:var(--text-2);font:inherit;cursor:pointer}.skill-row[data-v-2178931f]:hover{background:var(--hover);color:var(--text)}h2[data-v-2178931f]{margin:0;font-size:13px;font-weight:600}.skills-catalogue[data-v-31eac374]{margin:0;padding:0;list-style:none}.skill-entry[data-v-31eac374]{display:flex;gap:8px;align-items:baseline;width:100%;text-align:left;padding:9px 10px;border:0;border-bottom:1px solid var(--border);background:transparent;color:var(--text-2);font:inherit;cursor:pointer}.skill-entry[data-v-31eac374]:hover{background:var(--hover);color:var(--text)}h2[data-v-31eac374]{margin:0 0 8px;font-size:13px;font-weight:600}.skill-description[data-v-31eac374]{color:var(--text-3);font-size:12px}.skills-title[data-v-4b73864f]{margin:0;font-size:13px}.skills-back[data-v-4b73864f]{padding:5px 8px;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--text-2);font:inherit;cursor:pointer}.skills-text[data-v-4b73864f]{margin:0;white-space:pre-wrap;font-size:12px}.skills-page[data-v-0ee5e5e4]{display:flex;flex-direction:column;gap:24px}\n"; document.head.appendChild(style); }
import { computed as C, openBlock as u, createElementBlock as p, createElementVNode as l, createVNode as m, unref as v, withCtx as b, createTextVNode as L, toDisplayString as _, toRef as B, Fragment as T, renderList as R, ref as k, createBlock as x } from "vue";
import { RowList as A, useListTools as I, ListTools as N, useWindow as O, WindowRoom as q } from "@journal/window-kit";
const h = (e, s) => {
  const n = e.__vccOpts || e;
  for (const [r, o] of s)
    n[r] = o;
  return n;
}, V = {
  class: "skills",
  "data-skills-loaded": ""
}, E = ["onClick"], F = {
  __name: "LoadedSkills",
  props: { rows: { type: Array, required: !0 }, failure: { type: String, default: "" }, answered: { type: Boolean, required: !0 } },
  emits: ["open"],
  setup(e, { emit: s }) {
    const n = e, r = s, o = C(() => [...n.rows].reverse());
    return (c, t) => (u(), p("div", V, [
      t[1] || (t[1] = l("h2", null, "Loaded by the main agent", -1)),
      t[2] || (t[2] = l("p", { class: "skills-note" }, "The skills the main agent has read in this conversation.", -1)),
      m(v(A), {
        rows: o.value,
        failure: e.failure,
        loaded: e.answered,
        empty: "No skill is loaded in this conversation.",
        hint: "A skill the agent reads shows here with when it read it."
      }, {
        default: b(({ row: a }) => [
          l("button", {
            type: "button",
            class: "skill-row",
            onClick: (w) => r("open", a.skill)
          }, [
            t[0] || (t[0] = l("svg", {
              class: "skill-book",
              viewBox: "0 0 16 16",
              width: "14",
              height: "14",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.4",
              "aria-hidden": "true"
            }, [
              l("path", { d: "M3 2.5h7a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2z" }),
              l("path", { d: "M3 11.5a2 2 0 0 1 2-2h7" })
            ], -1)),
            L(" " + _(a.skill), 1)
          ], 8, E)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, M = /* @__PURE__ */ h(F, [["__scopeId", "data-v-2178931f"]]), W = {
  class: "skills",
  "data-skills-catalogue": ""
}, j = { class: "skills-catalogue" }, z = ["onClick"], D = { class: "skill-name" }, H = { class: "skill-description" }, P = {
  __name: "SkillCatalogue",
  props: { rows: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: s }) {
    const n = e, r = s, o = I(B(n, "rows"), { title: (c) => c.folder });
    return (c, t) => (u(), p("div", W, [
      t[0] || (t[0] = l("h2", null, "All skills", -1)),
      m(v(N), { tools: v(o) }, null, 8, ["tools"]),
      l("ul", j, [
        (u(!0), p(T, null, R(v(o).shown.value, (a) => (u(), p("li", {
          key: a.folder
        }, [
          l("button", {
            type: "button",
            class: "skill-entry",
            onClick: (w) => r("open", a.folder)
          }, [
            l("span", D, _(a.folder), 1),
            l("span", H, _(a.description), 1)
          ], 8, z)
        ]))), 128))
      ])
    ]));
  }
}, G = /* @__PURE__ */ h(P, [["__scopeId", "data-v-31eac374"]]), J = { class: "skills" }, K = { class: "skills-title" }, Q = {
  class: "skills-text",
  "data-skill-text": ""
}, U = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" } },
  emits: ["back"],
  setup(e, { emit: s }) {
    const n = s;
    return (r, o) => (u(), p("div", J, [
      l("button", {
        type: "button",
        class: "skills-back",
        onClick: o[0] || (o[0] = (c) => n("back"))
      }, "Back to skills"),
      l("h3", K, _(e.skill ? e.skill.folder : ""), 1),
      l("pre", Q, _(e.skill ? e.skill.text : e.failure), 1)
    ]));
  }
}, X = /* @__PURE__ */ h(U, [["__scopeId", "data-v-4b73864f"]]), Y = {
  key: 1,
  class: "skills-page"
}, Z = {
  __name: "SkillRows",
  setup(e) {
    const s = O(), n = k([]), r = k(""), o = k(!1), c = k([]), t = k(null), a = k("");
    async function w() {
      const [f, i] = await Promise.all([s.read("agent main"), s.read("skill list")]);
      c.value = i.ok ? i.value.rows : [];
      const y = f.ok && f.value.id, d = y ? await s.read(`agent-skill list --agent ${y} --limit 100`) : null;
      n.value = d != null && d.ok ? d.value.rows.filter((S) => S.state === "loaded") : [], r.value = d && !d.ok ? d.error : i.ok ? "" : i.error, o.value = !0;
    }
    s.follow(["agent.*", "agent_skill.*"], w), w();
    function $() {
      t.value = null, a.value = "";
    }
    async function g(f) {
      const i = await s.read(`skill show ${f}`);
      a.value = i.ok ? "" : i.error, t.value = i.ok ? i.value : null;
    }
    return (f, i) => (u(), x(v(q), null, {
      default: b(() => [
        t.value || a.value ? (u(), x(X, {
          key: 0,
          skill: t.value,
          failure: a.value,
          onBack: $
        }, null, 8, ["skill", "failure"])) : (u(), p("div", Y, [
          m(M, {
            rows: n.value,
            failure: r.value,
            answered: o.value,
            onOpen: g
          }, null, 8, ["rows", "failure", "answered"]),
          m(G, {
            rows: c.value,
            onOpen: g
          }, null, 8, ["rows"])
        ]))
      ]),
      _: 1
    }));
  }
}, le = /* @__PURE__ */ h(Z, [["__scopeId", "data-v-0ee5e5e4"]]);
export {
  le as default
};
