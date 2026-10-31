/* @code-commandments-generated */
if (!document.getElementById("window-styles-403b7b06f6c1")) { const style = document.createElement("style"); style.id = "window-styles-403b7b06f6c1"; style.textContent = ".skills[data-v-e0d1d692]{display:flex;flex-direction:column;gap:8px}.skills-note[data-v-e0d1d692]{margin:0;font-size:12px;color:var(--text-3)}.skill-row[data-v-e0d1d692]{display:flex;gap:8px;align-items:center;width:100%;text-align:left}.skills-catalogue[data-v-0c3947df]{margin:0;padding:0;list-style:none}.skill-entry[data-v-0c3947df]{display:flex;gap:8px;align-items:baseline;width:100%;text-align:left}.skill-description[data-v-0c3947df]{color:var(--text-3);font-size:12px}.skills-title[data-v-b646e030]{margin:0;font-size:13px}.skills-text[data-v-b646e030]{margin:0;white-space:pre-wrap;font-size:12px}\n"; document.head.appendChild(style); }
import { computed as b, openBlock as c, createElementBlock as k, createElementVNode as s, createVNode as h, unref as x, withCtx as $, createTextVNode as C, toDisplayString as p, Fragment as B, renderList as S, ref as v, createBlock as L, resolveDynamicComponent as N, normalizeProps as O, guardReactiveProps as R } from "vue";
import { RowList as I, useWindow as T, useRows as V } from "@journal/window-kit";
const _ = (t, o) => {
  const l = t.__vccOpts || t;
  for (const [i, e] of o)
    l[i] = e;
  return l;
}, q = { class: "skills" }, z = ["onClick"], A = {
  __name: "LoadedSkills",
  props: { rows: { type: Array, required: !0 }, failure: { type: String, default: "" } },
  emits: ["open", "browse"],
  setup(t, { emit: o }) {
    const l = t, i = o, e = b(() => [...l.rows].reverse());
    return (n, a) => (c(), k("div", q, [
      a[2] || (a[2] = s("p", { class: "skills-note" }, "Loaded in this window, newest last. Compacting the conversation empties it.", -1)),
      h(x(I), {
        rows: e.value,
        failure: t.failure,
        empty: "No skill is loaded in this conversation."
      }, {
        default: $(({ row: r }) => [
          s("button", {
            type: "button",
            class: "skill-row",
            onClick: (f) => i("open", r.skill)
          }, [
            a[1] || (a[1] = s("svg", {
              class: "skill-book",
              viewBox: "0 0 16 16",
              width: "14",
              height: "14",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.4",
              "aria-hidden": "true"
            }, [
              s("path", { d: "M3 2.5h7a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2z" }),
              s("path", { d: "M3 11.5a2 2 0 0 1 2-2h7" })
            ], -1)),
            C(" " + p(r.skill), 1)
          ], 8, z)
        ]),
        _: 1
      }, 8, ["rows", "failure"]),
      s("button", {
        type: "button",
        class: "skills-browse",
        onClick: a[0] || (a[0] = (r) => i("browse"))
      }, "Browse every skill")
    ]));
  }
}, D = /* @__PURE__ */ _(A, [["__scopeId", "data-v-e0d1d692"]]), E = { class: "skills" }, F = { class: "skills-catalogue" }, M = ["onClick"], P = { class: "skill-name" }, j = { class: "skill-description" }, H = {
  __name: "SkillCatalogue",
  props: { rows: { type: Array, required: !0 } },
  emits: ["open", "back"],
  setup(t, { emit: o }) {
    const l = o;
    return (i, e) => (c(), k("div", E, [
      s("button", {
        type: "button",
        class: "skills-back",
        onClick: e[0] || (e[0] = (n) => l("back"))
      }, "Back"),
      s("ul", F, [
        (c(!0), k(B, null, S(t.rows, (n) => (c(), k("li", {
          key: n.folder
        }, [
          s("button", {
            type: "button",
            class: "skill-entry",
            onClick: (a) => l("open", n.folder)
          }, [
            s("span", P, p(n.folder), 1),
            s("span", j, p(n.description), 1)
          ], 8, M)
        ]))), 128))
      ])
    ]));
  }
}, W = /* @__PURE__ */ _(H, [["__scopeId", "data-v-0c3947df"]]), G = { class: "skills" }, J = { class: "skills-title" }, K = { class: "skills-text" }, Q = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" } },
  emits: ["back"],
  setup(t, { emit: o }) {
    const l = o;
    return (i, e) => (c(), k("div", G, [
      s("button", {
        type: "button",
        class: "skills-back",
        onClick: e[0] || (e[0] = (n) => l("back"))
      }, "Back"),
      s("h3", J, p(t.skill ? t.skill.folder : ""), 1),
      s("pre", K, p(t.skill ? t.skill.text : t.failure), 1)
    ]));
  }
}, U = /* @__PURE__ */ _(Q, [["__scopeId", "data-v-b646e030"]]), Z = {
  __name: "SkillRows",
  setup(t) {
    const o = T(), { rows: l, failure: i } = V(`agent-skill list --agent ${o.agent}`, ["agent_skill.*"]), e = v("loaded"), n = v([]), a = v(null), r = v(""), f = { loaded: D, catalogue: W, text: U }, y = b(() => ({
      loaded: { rows: l.value, failure: i.value, onOpen: w, onBrowse: g },
      catalogue: { rows: n.value, onOpen: w, onBack: m },
      text: { skill: a.value, failure: r.value, onBack: m }
    })[e.value]);
    function m() {
      e.value = "loaded";
    }
    async function g() {
      const u = await o.read("skill list");
      n.value = u.ok ? u.value.rows : [], e.value = "catalogue";
    }
    async function w(u) {
      const d = await o.read(`skill show ${u}`);
      r.value = d.ok ? "" : d.error, a.value = d.ok ? d.value : null, e.value = "text";
    }
    return (u, d) => (c(), L(N(f[e.value]), O(R(y.value)), null, 16));
  }
};
export {
  Z as default
};
