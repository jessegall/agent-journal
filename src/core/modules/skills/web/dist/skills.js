/* @code-commandments-generated */
if (!document.getElementById("window-styles-0b455a1fbcb8")) { const style = document.createElement("style"); style.id = "window-styles-0b455a1fbcb8"; style.textContent = ".skills[data-v-066e41ac]{display:flex;flex-direction:column;gap:8px}.skills-note[data-v-066e41ac]{margin:0;font-size:12px;color:var(--text-3)}.skill-row[data-v-066e41ac],.skill-entry[data-v-066e41ac]{display:flex;gap:8px;align-items:center;width:100%;text-align:left}.skill-description[data-v-066e41ac]{color:var(--text-3);font-size:12px}.skills-text[data-v-066e41ac]{white-space:pre-wrap;font-size:12px}.skills-catalogue[data-v-066e41ac]{margin:0;padding:0;list-style:none}\n"; document.head.appendChild(style); }
import { computed as m, ref as k, openBlock as l, createElementBlock as o, Fragment as c, createElementVNode as e, toDisplayString as i, renderList as x, createVNode as C, unref as h, withCtx as B, createTextVNode as $ } from "vue";
import { useWindow as L, useRows as N, RowList as R } from "@journal/window-kit";
const S = (v, r) => {
  const u = v.__vccOpts || v;
  for (const [p, _] of r)
    u[p] = _;
  return u;
}, V = { class: "skills" }, E = { class: "skills-title" }, F = { class: "skills-text" }, M = {
  key: 1,
  class: "skills-failure"
}, z = { class: "skills-catalogue" }, D = ["onClick"], H = { class: "skill-name" }, I = { class: "skill-description" }, O = ["onClick"], T = {
  __name: "SkillRows",
  setup(v) {
    const r = L(), { rows: u, failure: p } = N(`agent-skill list --agent ${r.agent}`, ["agent_skill.*"]), _ = m(() => [...u.value].reverse()), a = k("loaded"), f = k([]), d = k(null), w = k("");
    async function b() {
      const n = await r.read("skill list");
      f.value = n.ok ? n.value.rows : [], w.value = n.ok ? "" : n.error, a.value = "catalogue";
    }
    async function y(n) {
      const t = await r.read(`skill show ${n}`);
      w.value = t.ok ? "" : t.error, d.value = t.ok ? t.value : null, a.value = "text";
    }
    return (n, t) => (l(), o("div", V, [
      a.value === "text" ? (l(), o(c, { key: 0 }, [
        e("button", {
          type: "button",
          class: "skills-back",
          onClick: t[0] || (t[0] = (s) => a.value = "loaded")
        }, "Back"),
        d.value ? (l(), o(c, { key: 0 }, [
          e("h3", E, i(d.value.folder), 1),
          e("pre", F, i(d.value.text), 1)
        ], 64)) : (l(), o("p", M, i(w.value), 1))
      ], 64)) : a.value === "catalogue" ? (l(), o(c, { key: 1 }, [
        e("button", {
          type: "button",
          class: "skills-back",
          onClick: t[1] || (t[1] = (s) => a.value = "loaded")
        }, "Back"),
        e("ul", z, [
          (l(!0), o(c, null, x(f.value, (s) => (l(), o("li", {
            key: s.folder
          }, [
            e("button", {
              type: "button",
              class: "skill-entry",
              onClick: (g) => y(s.folder)
            }, [
              e("span", H, i(s.folder), 1),
              e("span", I, i(s.description), 1)
            ], 8, D)
          ]))), 128))
        ])
      ], 64)) : (l(), o(c, { key: 2 }, [
        t[3] || (t[3] = e("p", { class: "skills-note" }, "Loaded in this window, newest last. Compacting the conversation empties it.", -1)),
        C(h(R), {
          rows: _.value,
          failure: h(p),
          empty: "No skill is loaded in this conversation."
        }, {
          default: B(({ row: s }) => [
            e("button", {
              type: "button",
              class: "skill-row",
              onClick: (g) => y(s.skill)
            }, [
              t[2] || (t[2] = e("svg", {
                class: "skill-book",
                viewBox: "0 0 16 16",
                width: "14",
                height: "14",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.4",
                "aria-hidden": "true"
              }, [
                e("path", { d: "M3 2.5h7a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2z" }),
                e("path", { d: "M3 11.5a2 2 0 0 1 2-2h7" })
              ], -1)),
              $(" " + i(s.skill), 1)
            ], 8, O)
          ]),
          _: 1
        }, 8, ["rows", "failure"]),
        e("button", {
          type: "button",
          class: "skills-browse",
          onClick: b
        }, "Browse every skill")
      ], 64))
    ]));
  }
}, q = /* @__PURE__ */ S(T, [["__scopeId", "data-v-066e41ac"]]);
export {
  q as default
};
