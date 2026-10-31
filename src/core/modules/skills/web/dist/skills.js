/* @code-commandments-generated */
if (!document.getElementById("window-styles-3beb632489b2")) { const style = document.createElement("style"); style.id = "window-styles-3beb632489b2"; style.textContent = ".skills[data-v-20887a9e]{display:flex;flex-direction:column;gap:8px}.skills-note[data-v-20887a9e]{margin:0;font-size:12px;color:var(--text-3)}.skill-row[data-v-20887a9e]{display:flex;gap:8px;align-items:center;width:100%;text-align:left}.skills-catalogue[data-v-0c3947df]{margin:0;padding:0;list-style:none}.skill-entry[data-v-0c3947df]{display:flex;gap:8px;align-items:baseline;width:100%;text-align:left}.skill-description[data-v-0c3947df]{color:var(--text-3);font-size:12px}.skills-title[data-v-b646e030]{margin:0;font-size:13px}.skills-text[data-v-b646e030]{margin:0;white-space:pre-wrap;font-size:12px}\n"; document.head.appendChild(style); }
import { computed as b, openBlock as c, createElementBlock as k, createElementVNode as t, createVNode as x, unref as $, withCtx as C, createTextVNode as B, toDisplayString as p, Fragment as S, renderList as L, ref as v, createBlock as N, resolveDynamicComponent as O, normalizeProps as R, guardReactiveProps as q } from "vue";
import { RowList as I, useWindow as T, useRows as V } from "@journal/window-kit";
const _ = (e, l) => {
  const o = e.__vccOpts || e;
  for (const [i, n] of l)
    o[i] = n;
  return o;
}, z = { class: "skills" }, A = ["onClick"], D = {
  __name: "LoadedSkills",
  props: { rows: { type: Array, required: !0 }, failure: { type: String, default: "" }, answered: { type: Boolean, required: !0 } },
  emits: ["open", "browse"],
  setup(e, { emit: l }) {
    const o = e, i = l, n = b(() => [...o.rows].reverse());
    return (s, a) => (c(), k("div", z, [
      a[2] || (a[2] = t("p", { class: "skills-note" }, "Loaded in this window, newest last. Compacting the conversation empties it.", -1)),
      x($(I), {
        rows: n.value,
        failure: e.failure,
        loaded: e.answered,
        empty: "No skill is loaded in this conversation."
      }, {
        default: C(({ row: r }) => [
          t("button", {
            type: "button",
            class: "skill-row",
            onClick: (w) => i("open", r.skill)
          }, [
            a[1] || (a[1] = t("svg", {
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
            B(" " + p(r.skill), 1)
          ], 8, A)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      t("button", {
        type: "button",
        class: "skills-browse",
        onClick: a[0] || (a[0] = (r) => i("browse"))
      }, "Browse every skill")
    ]));
  }
}, E = /* @__PURE__ */ _(D, [["__scopeId", "data-v-20887a9e"]]), F = { class: "skills" }, M = { class: "skills-catalogue" }, P = ["onClick"], j = { class: "skill-name" }, H = { class: "skill-description" }, W = {
  __name: "SkillCatalogue",
  props: { rows: { type: Array, required: !0 } },
  emits: ["open", "back"],
  setup(e, { emit: l }) {
    const o = l;
    return (i, n) => (c(), k("div", F, [
      t("button", {
        type: "button",
        class: "skills-back",
        onClick: n[0] || (n[0] = (s) => o("back"))
      }, "Back"),
      t("ul", M, [
        (c(!0), k(S, null, L(e.rows, (s) => (c(), k("li", {
          key: s.folder
        }, [
          t("button", {
            type: "button",
            class: "skill-entry",
            onClick: (a) => o("open", s.folder)
          }, [
            t("span", j, p(s.folder), 1),
            t("span", H, p(s.description), 1)
          ], 8, P)
        ]))), 128))
      ])
    ]));
  }
}, G = /* @__PURE__ */ _(W, [["__scopeId", "data-v-0c3947df"]]), J = { class: "skills" }, K = { class: "skills-title" }, Q = { class: "skills-text" }, U = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" } },
  emits: ["back"],
  setup(e, { emit: l }) {
    const o = l;
    return (i, n) => (c(), k("div", J, [
      t("button", {
        type: "button",
        class: "skills-back",
        onClick: n[0] || (n[0] = (s) => o("back"))
      }, "Back"),
      t("h3", K, p(e.skill ? e.skill.folder : ""), 1),
      t("pre", Q, p(e.skill ? e.skill.text : e.failure), 1)
    ]));
  }
}, X = /* @__PURE__ */ _(U, [["__scopeId", "data-v-b646e030"]]), ee = {
  __name: "SkillRows",
  setup(e) {
    const l = T(), { rows: o, failure: i, loaded: n } = V(`agent-skill list --agent ${l.agent}`, ["agent_skill.*"]), s = v("loaded"), a = v([]), r = v(null), w = v(""), y = { loaded: E, catalogue: G, text: X }, g = b(() => ({
      loaded: { rows: o.value, failure: i.value, answered: n.value, onOpen: m, onBrowse: h },
      catalogue: { rows: a.value, onOpen: m, onBack: f },
      text: { skill: r.value, failure: w.value, onBack: f }
    })[s.value]);
    function f() {
      s.value = "loaded";
    }
    async function h() {
      const u = await l.read("skill list");
      a.value = u.ok ? u.value.rows : [], s.value = "catalogue";
    }
    async function m(u) {
      const d = await l.read(`skill show ${u}`);
      w.value = d.ok ? "" : d.error, r.value = d.ok ? d.value : null, s.value = "text";
    }
    return (u, d) => (c(), N(O(y[s.value]), R(q(g.value)), null, 16));
  }
};
export {
  ee as default
};
