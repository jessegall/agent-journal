/* @code-commandments-generated */
if (!document.getElementById("window-styles-c68952f1f1fd")) { const style = document.createElement("style"); style.id = "window-styles-c68952f1f1fd"; style.textContent = ".skills[data-v-20887a9e]{display:flex;flex-direction:column;gap:8px}.skills-note[data-v-20887a9e]{margin:0;font-size:12px;color:var(--text-3)}.skill-row[data-v-20887a9e]{display:flex;gap:8px;align-items:center;width:100%;text-align:left}.skills-catalogue[data-v-8edafd71]{margin:0;padding:0;list-style:none}.skill-entry[data-v-8edafd71]{display:flex;gap:8px;align-items:baseline;width:100%;text-align:left}.skill-description[data-v-8edafd71]{color:var(--text-3);font-size:12px}.skills-title[data-v-b646e030]{margin:0;font-size:13px}.skills-text[data-v-b646e030]{margin:0;white-space:pre-wrap;font-size:12px}\n"; document.head.appendChild(style); }
import { computed as h, openBlock as c, createElementBlock as k, createElementVNode as t, createVNode as g, unref as _, withCtx as C, createTextVNode as B, toDisplayString as p, toRef as S, Fragment as L, renderList as R, ref as w, createBlock as T, resolveDynamicComponent as N, normalizeProps as O, guardReactiveProps as q } from "vue";
import { RowList as I, useListTools as V, ListTools as z, useWindow as A, useRows as D } from "@journal/window-kit";
const f = (e, s) => {
  const a = e.__vccOpts || e;
  for (const [i, n] of s)
    a[i] = n;
  return a;
}, E = { class: "skills" }, F = ["onClick"], M = {
  __name: "LoadedSkills",
  props: { rows: { type: Array, required: !0 }, failure: { type: String, default: "" }, answered: { type: Boolean, required: !0 } },
  emits: ["open", "browse"],
  setup(e, { emit: s }) {
    const a = e, i = s, n = h(() => [...a.rows].reverse());
    return (r, l) => (c(), k("div", E, [
      l[2] || (l[2] = t("p", { class: "skills-note" }, "Loaded in this window, newest last. Compacting the conversation empties it.", -1)),
      g(_(I), {
        rows: n.value,
        failure: e.failure,
        loaded: e.answered,
        empty: "No skill is loaded in this conversation."
      }, {
        default: C(({ row: o }) => [
          t("button", {
            type: "button",
            class: "skill-row",
            onClick: (v) => i("open", o.skill)
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
            B(" " + p(o.skill), 1)
          ], 8, F)
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
}, P = /* @__PURE__ */ f(M, [["__scopeId", "data-v-20887a9e"]]), j = { class: "skills" }, H = { class: "skills-catalogue" }, W = ["onClick"], G = { class: "skill-name" }, J = { class: "skill-description" }, K = {
  __name: "SkillCatalogue",
  props: { rows: { type: Array, required: !0 } },
  emits: ["open", "back"],
  setup(e, { emit: s }) {
    const a = e, i = s, n = V(S(a, "rows"), { title: (r) => r.folder });
    return (r, l) => (c(), k("div", j, [
      t("button", {
        type: "button",
        class: "skills-back",
        onClick: l[0] || (l[0] = (o) => i("back"))
      }, "Back"),
      g(_(z), {
        tools: _(n),
        placeholder: "Search the skills"
      }, null, 8, ["tools"]),
      t("ul", H, [
        (c(!0), k(L, null, R(_(n).shown.value, (o) => (c(), k("li", {
          key: o.folder
        }, [
          t("button", {
            type: "button",
            class: "skill-entry",
            onClick: (v) => i("open", o.folder)
          }, [
            t("span", G, p(o.folder), 1),
            t("span", J, p(o.description), 1)
          ], 8, W)
        ]))), 128))
      ])
    ]));
  }
}, Q = /* @__PURE__ */ f(K, [["__scopeId", "data-v-8edafd71"]]), U = { class: "skills" }, X = { class: "skills-title" }, Y = { class: "skills-text" }, Z = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" } },
  emits: ["back"],
  setup(e, { emit: s }) {
    const a = s;
    return (i, n) => (c(), k("div", U, [
      t("button", {
        type: "button",
        class: "skills-back",
        onClick: n[0] || (n[0] = (r) => a("back"))
      }, "Back"),
      t("h3", X, p(e.skill ? e.skill.folder : ""), 1),
      t("pre", Y, p(e.skill ? e.skill.text : e.failure), 1)
    ]));
  }
}, ee = /* @__PURE__ */ f(Z, [["__scopeId", "data-v-b646e030"]]), le = {
  __name: "SkillRows",
  setup(e) {
    const s = A(), { rows: a, failure: i, loaded: n } = D(s.agent ? `agent-skill list --agent ${s.agent}` : "agent-skill list", ["agent_skill.*"]), r = w("loaded"), l = w([]), o = w(null), v = w(""), y = { loaded: P, catalogue: Q, text: ee }, x = h(() => ({
      loaded: { rows: a.value, failure: i.value, answered: n.value, onOpen: b, onBrowse: $ },
      catalogue: { rows: l.value, onOpen: b, onBack: m },
      text: { skill: o.value, failure: v.value, onBack: m }
    })[r.value]);
    function m() {
      r.value = "loaded";
    }
    async function $() {
      const u = await s.read("skill list");
      l.value = u.ok ? u.value.rows : [], r.value = "catalogue";
    }
    async function b(u) {
      const d = await s.read(`skill show ${u}`);
      v.value = d.ok ? "" : d.error, o.value = d.ok ? d.value : null, r.value = "text";
    }
    return (u, d) => (c(), T(N(y[r.value]), O(q(x.value)), null, 16));
  }
};
export {
  le as default
};
