/* @code-commandments-generated */
if (!document.getElementById("window-styles-09e02680d3ae")) { const style = document.createElement("style"); style.id = "window-styles-09e02680d3ae"; style.textContent = ".skills[data-v-949528d6]{display:flex;flex-direction:column;gap:8px}.skills-note[data-v-949528d6]{margin:0;font-size:12px;color:var(--text-3)}.skill-row[data-v-949528d6]{display:flex;gap:8px;align-items:center;width:100%;text-align:left}.skills-catalogue[data-v-8edafd71]{margin:0;padding:0;list-style:none}.skill-entry[data-v-8edafd71]{display:flex;gap:8px;align-items:baseline;width:100%;text-align:left}.skill-description[data-v-8edafd71]{color:var(--text-3);font-size:12px}.skills-title[data-v-b646e030]{margin:0;font-size:13px}.skills-text[data-v-b646e030]{margin:0;white-space:pre-wrap;font-size:12px}\n"; document.head.appendChild(style); }
import { computed as g, openBlock as c, createElementBlock as k, createElementVNode as t, createVNode as y, unref as p, withCtx as x, createTextVNode as S, toDisplayString as v, toRef as L, Fragment as R, renderList as T, ref as _, createBlock as b, resolveDynamicComponent as N, normalizeProps as O, guardReactiveProps as q } from "vue";
import { RowList as A, useListTools as I, ListTools as V, useWindow as z, useRows as D, WindowRoom as E } from "@journal/window-kit";
const f = (e, s) => {
  const a = e.__vccOpts || e;
  for (const [i, n] of s)
    a[i] = n;
  return a;
}, F = { class: "skills" }, M = ["onClick"], P = {
  __name: "LoadedSkills",
  props: { rows: { type: Array, required: !0 }, failure: { type: String, default: "" }, answered: { type: Boolean, required: !0 } },
  emits: ["open", "browse"],
  setup(e, { emit: s }) {
    const a = e, i = s, n = g(() => [...a.rows].reverse());
    return (r, l) => (c(), k("div", F, [
      l[2] || (l[2] = t("p", { class: "skills-note" }, "Loaded in this window, newest last. Compacting the conversation empties it.", -1)),
      y(p(A), {
        rows: n.value,
        failure: e.failure,
        loaded: e.answered,
        empty: "No skill is loaded in this conversation.",
        hint: "A skill the agent reads shows here with when it read it."
      }, {
        default: x(({ row: o }) => [
          t("button", {
            type: "button",
            class: "skill-row",
            onClick: (w) => i("open", o.skill)
          }, [
            l[1] || (l[1] = t("svg", {
              class: "skill-book",
              viewBox: "0 0 16 16",
              width: "14",
              height: "14",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "1.4",
              "aria-hidden": "true"
            }, [
              t("path", { d: "M3 2.5h7a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2z" }),
              t("path", { d: "M3 11.5a2 2 0 0 1 2-2h7" })
            ], -1)),
            S(" " + v(o.skill), 1)
          ], 8, M)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      t("button", {
        type: "button",
        class: "skills-browse",
        onClick: l[0] || (l[0] = (o) => i("browse"))
      }, "Browse every skill")
    ]));
  }
}, W = /* @__PURE__ */ f(P, [["__scopeId", "data-v-949528d6"]]), j = { class: "skills" }, H = { class: "skills-catalogue" }, G = ["onClick"], J = { class: "skill-name" }, K = { class: "skill-description" }, Q = {
  __name: "SkillCatalogue",
  props: { rows: { type: Array, required: !0 } },
  emits: ["open", "back"],
  setup(e, { emit: s }) {
    const a = e, i = s, n = I(L(a, "rows"), { title: (r) => r.folder });
    return (r, l) => (c(), k("div", j, [
      t("button", {
        type: "button",
        class: "skills-back",
        onClick: l[0] || (l[0] = (o) => i("back"))
      }, "Back"),
      y(p(V), {
        tools: p(n),
        placeholder: "Search the skills"
      }, null, 8, ["tools"]),
      t("ul", H, [
        (c(!0), k(R, null, T(p(n).shown.value, (o) => (c(), k("li", {
          key: o.folder
        }, [
          t("button", {
            type: "button",
            class: "skill-entry",
            onClick: (w) => i("open", o.folder)
          }, [
            t("span", J, v(o.folder), 1),
            t("span", K, v(o.description), 1)
          ], 8, G)
        ]))), 128))
      ])
    ]));
  }
}, U = /* @__PURE__ */ f(Q, [["__scopeId", "data-v-8edafd71"]]), X = { class: "skills" }, Y = { class: "skills-title" }, Z = { class: "skills-text" }, ee = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" } },
  emits: ["back"],
  setup(e, { emit: s }) {
    const a = s;
    return (i, n) => (c(), k("div", X, [
      t("button", {
        type: "button",
        class: "skills-back",
        onClick: n[0] || (n[0] = (r) => a("back"))
      }, "Back"),
      t("h3", Y, v(e.skill ? e.skill.folder : ""), 1),
      t("pre", Z, v(e.skill ? e.skill.text : e.failure), 1)
    ]));
  }
}, te = /* @__PURE__ */ f(ee, [["__scopeId", "data-v-b646e030"]]), oe = {
  __name: "SkillRows",
  setup(e) {
    const s = z(), { rows: a, failure: i, loaded: n } = D(s.agent ? `agent-skill list --agent ${s.agent}` : "agent-skill list", ["agent_skill.*"]), r = _("loaded"), l = _([]), o = _(null), w = _(""), $ = { loaded: W, catalogue: U, text: te }, C = g(() => ({
      loaded: { rows: a.value, failure: i.value, answered: n.value, onOpen: h, onBrowse: B },
      catalogue: { rows: l.value, onOpen: h, onBack: m },
      text: { skill: o.value, failure: w.value, onBack: m }
    })[r.value]);
    function m() {
      r.value = "loaded";
    }
    async function B() {
      const u = await s.read("skill list");
      l.value = u.ok ? u.value.rows : [], r.value = "catalogue";
    }
    async function h(u) {
      const d = await s.read(`skill show ${u}`);
      w.value = d.ok ? "" : d.error, o.value = d.ok ? d.value : null, r.value = "text";
    }
    return (u, d) => (c(), b(p(E), null, {
      default: x(() => [
        (c(), b(N($[r.value]), O(q(C.value)), null, 16))
      ]),
      _: 1
    }));
  }
};
export {
  oe as default
};
