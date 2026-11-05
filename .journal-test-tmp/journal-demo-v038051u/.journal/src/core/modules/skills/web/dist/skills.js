/* @code-commandments-generated */
if (!document.getElementById("window-styles-e145bbb1d7fa")) { const style = document.createElement("style"); style.id = "window-styles-e145bbb1d7fa"; style.textContent = ".skills[data-v-56fe8f79]{display:flex;flex-direction:column;gap:8px}.skills-note[data-v-56fe8f79]{margin:0;font-size:12px;color:var(--text-3)}.skill-row[data-v-56fe8f79]{display:flex;gap:8px;align-items:center;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:6px;background:transparent;color:var(--text-2);font:inherit;cursor:pointer}.skill-row[data-v-56fe8f79]:hover{background:var(--hover);color:var(--text)}h2[data-v-56fe8f79]{margin:0;font-size:13px;font-weight:600}.skills-catalogue[data-v-31eac374]{margin:0;padding:0;list-style:none}.skill-entry[data-v-31eac374]{display:flex;gap:8px;align-items:baseline;width:100%;text-align:left;padding:9px 10px;border:0;border-bottom:1px solid var(--border);background:transparent;color:var(--text-2);font:inherit;cursor:pointer}.skill-entry[data-v-31eac374]:hover{background:var(--hover);color:var(--text)}h2[data-v-31eac374]{margin:0 0 8px;font-size:13px;font-weight:600}.skill-description[data-v-31eac374]{color:var(--text-3);font-size:12px}.skills-title[data-v-47961cf4]{margin:0;font-size:13px}.skills-back[data-v-47961cf4]{padding:5px 8px;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--text-2);font:inherit;cursor:pointer}.skills-text[data-v-47961cf4]{margin:0;white-space:pre-wrap;font-size:12px}.skills-page[data-v-27d00a9d]{display:flex;flex-direction:column;gap:24px}\n"; document.head.appendChild(style); }
import { computed as B, openBlock as c, createElementBlock as p, createElementVNode as t, createVNode as w, unref as _, withCtx as x, createTextVNode as L, toDisplayString as m, toRef as T, Fragment as I, renderList as N, createCommentVNode as R, ref as v, createBlock as $ } from "vue";
import { RowList as O, useListTools as V, ListTools as q, useWindow as A, WindowRoom as E } from "@journal/window-kit";
const h = (e, l) => {
  const s = e.__vccOpts || e;
  for (const [u, o] of l)
    s[u] = o;
  return s;
}, F = {
  class: "skills",
  "data-skills-loaded": ""
}, M = ["onClick"], W = {
  __name: "LoadedSkills",
  props: { rows: { type: Array, required: !0 }, failure: { type: String, default: "" }, answered: { type: Boolean, required: !0 } },
  emits: ["open"],
  setup(e, { emit: l }) {
    const s = e, u = l, o = B(() => [...s.rows].reverse());
    return (d, a) => (c(), p("div", F, [
      a[1] || (a[1] = t("h2", null, "Loaded by the main agent", -1)),
      a[2] || (a[2] = t("p", { class: "skills-note" }, "The skills the main agent has read in this conversation.", -1)),
      w(_(O), {
        rows: o.value,
        failure: e.failure,
        loaded: e.answered,
        empty: "No skill is loaded in this conversation.",
        hint: "Skills appear here with the time the agent read them."
      }, {
        default: x(({ row: n }) => [
          t("button", {
            type: "button",
            class: "skill-row",
            onClick: (k) => u("open", n.skill)
          }, [
            a[0] || (a[0] = t("svg", {
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
            L(" " + m(n.skill), 1)
          ], 8, M)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, j = /* @__PURE__ */ h(W, [["__scopeId", "data-v-56fe8f79"]]), z = {
  class: "skills",
  "data-skills-catalogue": ""
}, D = { class: "skills-catalogue" }, H = ["onClick"], P = { class: "skill-name" }, G = { class: "skill-description" }, J = {
  __name: "SkillCatalogue",
  props: { rows: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: l }) {
    const s = e, u = l, o = V(T(s, "rows"), { title: (d) => d.folder });
    return (d, a) => (c(), p("div", z, [
      a[0] || (a[0] = t("h2", null, "All skills", -1)),
      w(_(q), { tools: _(o) }, null, 8, ["tools"]),
      t("ul", D, [
        (c(!0), p(I, null, N(_(o).shown.value, (n) => (c(), p("li", {
          key: n.folder
        }, [
          t("button", {
            type: "button",
            class: "skill-entry",
            onClick: (k) => u("open", n.folder)
          }, [
            t("span", P, m(n.folder), 1),
            t("span", G, m(n.description), 1)
          ], 8, H)
        ]))), 128))
      ])
    ]));
  }
}, K = /* @__PURE__ */ h(J, [["__scopeId", "data-v-31eac374"]]), Q = { class: "skills" }, U = { class: "skills-title" }, X = {
  class: "skills-text",
  "data-skill-text": ""
}, Y = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" }, back: { type: Boolean, default: !0 } },
  emits: ["back"],
  setup(e, { emit: l }) {
    const s = l;
    return (u, o) => (c(), p("div", Q, [
      e.back ? (c(), p("button", {
        key: 0,
        type: "button",
        class: "skills-back",
        onClick: o[0] || (o[0] = (d) => s("back"))
      }, "Back to skills")) : R("", !0),
      t("h3", U, m(e.skill ? e.skill.folder : ""), 1),
      t("pre", X, m(e.skill ? e.skill.text : e.failure), 1)
    ]));
  }
}, Z = /* @__PURE__ */ h(Y, [["__scopeId", "data-v-47961cf4"]]), ee = {
  key: 1,
  class: "skills-page"
}, le = {
  __name: "SkillRows",
  setup(e) {
    const l = A(), s = l.option("row"), u = v([]), o = v(""), d = v(!1), a = v([]), n = v(null), k = v("");
    async function y() {
      const [r, i] = await Promise.all([l.read("agent main"), l.read("skill list")]);
      a.value = i.ok ? i.value.rows : [];
      const b = r.ok && r.value.id, f = b ? await l.read(`agent-skill list --agent ${b} --limit 100`) : null;
      u.value = f != null && f.ok ? f.value.rows.filter((C) => C.state === "loaded") : [], o.value = f && !f.ok ? f.error : i.ok ? "" : i.error, d.value = !0;
    }
    l.follow(["agent.*", "agent_skill.*"], y), s.value ? l.read(`agent-skill show ${s.value.skillId}`).then((r) => {
      r.ok ? g(r.value.skill) : k.value = r.error;
    }) : y();
    function S() {
      n.value = null, k.value = "";
    }
    async function g(r) {
      const i = await l.read(`skill show ${r}`);
      k.value = i.ok ? "" : i.failure === "refused" ? `The skill ${r} is no longer available.` : i.error, n.value = i.ok ? i.value : null;
    }
    return (r, i) => (c(), $(_(E), null, {
      default: x(() => [
        n.value || k.value ? (c(), $(Z, {
          key: 0,
          skill: n.value,
          failure: k.value,
          back: !_(s),
          onBack: S
        }, null, 8, ["skill", "failure", "back"])) : (c(), p("div", ee, [
          w(j, {
            rows: u.value,
            failure: o.value,
            answered: d.value,
            onOpen: g
          }, null, 8, ["rows", "failure", "answered"]),
          w(K, {
            rows: a.value,
            onOpen: g
          }, null, 8, ["rows"])
        ]))
      ]),
      _: 1
    }));
  }
}, oe = /* @__PURE__ */ h(le, [["__scopeId", "data-v-27d00a9d"]]);
export {
  oe as default
};
