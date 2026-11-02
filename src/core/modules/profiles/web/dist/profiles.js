/* @code-commandments-generated */
if (!document.getElementById("window-styles-6aa3409759e9")) { const style = document.createElement("style"); style.id = "window-styles-6aa3409759e9"; style.textContent = ".bar[data-v-3b81dbc6]{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px;margin-bottom:8px}.count[data-v-3b81dbc6],.subject[data-v-3b81dbc6]{color:var(--text-3);font-size:12px}.failure[data-v-3b81dbc6]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.profile[data-v-3b81dbc6]{display:flex;flex-direction:column;gap:2px;width:100%;padding:8px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.title[data-v-3b81dbc6]{font-weight:600}.form[data-v-3b81dbc6]{display:flex;flex-direction:column;gap:12px}.field[data-v-3b81dbc6]{display:flex;flex-direction:column;gap:4px;color:var(--text-2);font-size:12px}.field input[data-v-3b81dbc6],.field textarea[data-v-3b81dbc6]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}\n"; document.head.appendChild(style); }
import { ref as V, reactive as D, computed as S, openBlock as r, createElementBlock as c, Fragment as E, createElementVNode as l, createVNode as b, unref as n, withCtx as _, createTextVNode as i, toDisplayString as a, createCommentVNode as v, createBlock as I, withModifiers as P, withDirectives as u, vModelText as p } from "vue";
import { useRows as W, useListTools as B, Btn as T, ListTools as F, RowList as G, Dialog as L, Segmented as O, ago as z } from "@journal/window-kit";
const Y = (y, k) => {
  const m = y.__vccOpts || y;
  for (const [f, x] of k)
    m[f] = x;
  return m;
}, q = { class: "bar" }, A = { class: "count" }, H = {
  key: 0,
  class: "count",
  "data-profile-notice": ""
}, J = {
  key: 0,
  class: "failure"
}, K = ["data-profile", "onClick"], Q = { class: "title" }, X = { class: "subject" }, Z = { class: "subject" }, ee = { class: "subject" }, te = {
  key: 0,
  class: "field"
}, oe = { class: "field" }, le = { class: "field" }, se = { class: "field" }, ne = { class: "field" }, ae = { class: "field" }, ie = { class: "field" }, de = {
  key: 1,
  class: "count"
}, re = {
  __name: "ProfileRows",
  setup(y) {
    const k = [
      { key: "subagent", label: "Subagent" },
      { key: "worker", label: "Worker" }
    ], m = { name: "", description: "", tools: "Read, Grep, Glob", profile_type: "subagent", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1 }, { rows: f, failure: x, loaded: h, act: R, actionFailure: C } = W("profile list", []), $ = B(f, { title: (s) => `${s.name} ${s.description} ${s.profile_type} ${s.model} ${s.codex_model}` }), d = V(null), t = D({ ...m }), g = V(""), M = S(() => /^[a-z0-9_-]+$/i.test(t.name)), U = S(() => M.value && t.description.trim()), j = (s) => s.uses ? `Dispatched ${s.uses} ${s.uses === 1 ? "time" : "times"}, last ${z(new Date(s.last_used * 1e3).toISOString())}` : "Never dispatched here";
    function N(s) {
      d.value = s, Object.assign(t, s);
    }
    async function w() {
      (await R(["profile", "save", t.name, "--description", t.description, "--tools", t.tools, "--type", t.profile_type, "--model", t.model, "--codex-model", t.codex_model, "--body", t.body])).ok && (g.value = `${t.name} saved; the agent reads it at its next dispatch.`, d.value = null);
    }
    return (s, e) => (r(), c(E, null, [
      l("div", q, [
        b(n(T), {
          small: "",
          "data-profile-new": "",
          onClick: e[0] || (e[0] = (o) => N(m))
        }, {
          default: _(() => [...e[9] || (e[9] = [
            i("New profile", -1)
          ])]),
          _: 1
        }),
        l("span", A, a(n(f).length) + " " + a(n(f).length === 1 ? "profile" : "profiles") + " in .claude/agents", 1),
        g.value ? (r(), c("span", H, a(g.value), 1)) : v("", !0)
      ]),
      n(C) ? (r(), c("p", J, a(n(C)), 1)) : v("", !0),
      b(n(F), {
        tools: n($),
        placeholder: "Find a profile"
      }, null, 8, ["tools"]),
      b(n(G), {
        rows: n($).shown.value,
        failure: n(x),
        loaded: n(h),
        empty: "No profiles yet",
        "row-key": "name"
      }, {
        default: _(({ row: o }) => [
          l("button", {
            type: "button",
            class: "profile",
            "data-profile": o.name,
            onClick: (ue) => N(o)
          }, [
            l("span", Q, a(o.name), 1),
            l("span", X, a(o.description), 1),
            l("span", Z, a(o.profile_type) + " · " + a(o.model || "the agent's model") + " on Claude · " + a(o.codex_model || "the agent's model") + " on Codex", 1),
            l("span", ee, a(j(o)), 1)
          ], 8, K)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      d.value ? (r(), I(n(L), {
        key: 1,
        title: d.value.name || "New profile",
        onClose: e[8] || (e[8] = (o) => d.value = null)
      }, {
        default: _(() => [
          l("form", {
            class: "form",
            "data-profile-form": "",
            onSubmit: P(w, ["prevent"])
          }, [
            d.value.name ? v("", !0) : (r(), c("label", te, [
              e[10] || (e[10] = i("Name", -1)),
              u(l("input", {
                "onUpdate:modelValue": e[1] || (e[1] = (o) => t.name = o),
                placeholder: "critic",
                "aria-label": "Name"
              }, null, 512), [
                [
                  p,
                  t.name,
                  void 0,
                  { trim: !0 }
                ]
              ])
            ])),
            l("label", oe, [
              e[11] || (e[11] = i("When it is used", -1)),
              u(l("textarea", {
                "onUpdate:modelValue": e[2] || (e[2] = (o) => t.description = o),
                rows: "3",
                "aria-label": "When it is used"
              }, null, 512), [
                [p, t.description]
              ])
            ]),
            l("label", le, [
              e[12] || (e[12] = i("Tools", -1)),
              u(l("input", {
                "onUpdate:modelValue": e[3] || (e[3] = (o) => t.tools = o),
                placeholder: "Read, Grep, Glob",
                "aria-label": "Tools"
              }, null, 512), [
                [p, t.tools]
              ])
            ]),
            l("div", se, [
              e[13] || (e[13] = i("Type", -1)),
              b(n(O), {
                options: k,
                value: t.profile_type,
                onPick: e[4] || (e[4] = (o) => t.profile_type = o)
              }, null, 8, ["value"])
            ]),
            l("label", ne, [
              e[14] || (e[14] = i("Model on Claude Code", -1)),
              u(l("input", {
                "onUpdate:modelValue": e[5] || (e[5] = (o) => t.model = o),
                "aria-label": "Model on Claude Code"
              }, null, 512), [
                [p, t.model]
              ])
            ]),
            l("label", ae, [
              e[15] || (e[15] = i("Model on Codex", -1)),
              u(l("input", {
                "onUpdate:modelValue": e[6] || (e[6] = (o) => t.codex_model = o),
                "aria-label": "Model on Codex"
              }, null, 512), [
                [p, t.codex_model]
              ])
            ]),
            l("label", ie, [
              e[16] || (e[16] = i("Instructions", -1)),
              u(l("textarea", {
                "onUpdate:modelValue": e[7] || (e[7] = (o) => t.body = o),
                rows: "12",
                "aria-label": "Instructions"
              }, null, 512), [
                [p, t.body]
              ])
            ]),
            d.value.shipped ? (r(), c("p", de, "The journal ships this profile; the next start puts it back as shipped.")) : v("", !0),
            b(n(T), {
              small: "",
              kind: "primary",
              type: "submit",
              disabled: !U.value
            }, {
              default: _(() => [...e[17] || (e[17] = [
                i("Save", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32)
        ]),
        _: 1
      }, 8, ["title"])) : v("", !0)
    ], 64));
  }
}, fe = /* @__PURE__ */ Y(re, [["__scopeId", "data-v-3b81dbc6"]]);
export {
  fe as default
};
