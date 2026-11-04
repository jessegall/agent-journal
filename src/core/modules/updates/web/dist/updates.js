/* @code-commandments-generated */
if (!document.getElementById("window-styles-55ff6ff58bf4")) { const style = document.createElement("style"); style.id = "window-styles-55ff6ff58bf4"; style.textContent = ".releases[data-v-67ddca71]{position:relative;min-height:100px}.failure[data-v-67ddca71]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-67ddca71]{margin-bottom:8px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.arrived[data-v-67ddca71]{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}.note[data-v-67ddca71]{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;font-size:13px}.standing[data-v-67ddca71],.release[data-v-67ddca71]{display:flex;align-items:baseline;gap:10px;font-size:13px}.line[data-v-67ddca71],.title[data-v-67ddca71]{flex:1}.heading[data-v-67ddca71]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.detail[data-v-67ddca71]{color:var(--text-3);font-size:12px}button[data-v-67ddca71]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as i, computed as U, openBlock as o, createBlock as N, unref as r, withCtx as _, createElementBlock as u, createCommentVNode as v, createElementVNode as t, createVNode as y, createTextVNode as R, toDisplayString as d, Fragment as B, renderList as I } from "vue";
import { useRows as P, WindowRoom as S, Btn as D, RowList as T, TextDisplay as V } from "@journal/window-kit";
const $ = (h, l) => {
  const a = h.__vccOpts || h;
  for (const [c, p] of l)
    a[c] = p;
  return a;
}, E = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, W = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, j = {
  key: 2,
  class: "failure"
}, O = { class: "standing" }, q = { class: "line" }, z = { class: "releases" }, A = ["data-row"], G = { class: "title" }, H = { class: "detail" }, J = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, K = { class: "release" }, M = { class: "title" }, Q = { class: "detail" }, X = {
  __name: "UpdatesPanel",
  setup(h) {
    const l = P("release list", ["release.*"]), a = i(null), c = i(""), p = i(!1), m = i(!1), k = i([]), w = i(1), x = i(!0), f = i(""), F = U(() => a.value ? a.value.line : c.value ? "Release unavailable" : "Checking for a newer release");
    async function g() {
      c.value = "";
      const s = await l.context.read("update check");
      a.value = s.ok ? s.value : null, c.value = s.ok ? "" : s.error;
    }
    async function C() {
      p.value = !0;
      const s = await l.act(["update", "install"]);
      p.value = !1, s.ok && (await g(), m.value = !0);
    }
    async function b(s) {
      const e = await l.context.read(`update notes --page ${s}`);
      f.value = e.ok ? "" : e.error, e.ok && (k.value = [...k.value, ...e.value.notes], w.value = s, x.value = e.value.is_last_page);
    }
    const L = () => window.location.reload();
    return g(), b(1), (s, e) => (o(), N(r(S), null, {
      default: _(() => [
        p.value ? (o(), u("div", E, "Updating the journal. This takes a short while.")) : v("", !0),
        m.value ? (o(), u("div", W, [
          e[2] || (e[2] = t("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
          y(r(D), {
            small: "",
            kind: "primary",
            "data-update-reload": "",
            onClick: L
          }, {
            default: _(() => [...e[1] || (e[1] = [
              R("Reload", -1)
            ])]),
            _: 1
          })
        ])) : v("", !0),
        c.value || r(l).actionFailure.value ? (o(), u("p", j, d(c.value || r(l).actionFailure.value), 1)) : v("", !0),
        t("div", O, [
          t("span", q, d(F.value), 1),
          t("button", {
            type: "button",
            onClick: g
          }, "Check again"),
          a.value && !a.value.is_current ? (o(), N(r(D), {
            key: 0,
            small: "",
            kind: "primary",
            "data-update-install": "",
            onClick: C
          }, {
            default: _(() => [
              R(d(a.value.tag ? `Update to ${a.value.tag}` : "Update to the latest"), 1)
            ]),
            _: 1
          })) : a.value ? (o(), u("button", {
            key: 1,
            type: "button",
            "data-update-force": "",
            onClick: C
          }, "Install it again")) : v("", !0)
        ]),
        e[3] || (e[3] = t("h3", { class: "heading" }, "Installed releases", -1)),
        t("div", z, [
          y(r(T), {
            rows: r(l).rows.value,
            failure: r(l).failure.value,
            loaded: r(l).loaded.value,
            empty: "No installation history yet",
            hint: "Installed releases appear here with their installation dates."
          }, {
            default: _(({ row: n }) => [
              t("div", {
                class: "release",
                "data-row": n.id
              }, [
                t("span", G, d(n.tag || n.checksum.slice(0, 12)), 1),
                t("span", H, d(new Date(n.created_at).toLocaleString()), 1)
              ], 8, A)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        e[4] || (e[4] = t("h3", { class: "heading" }, "What changed", -1)),
        f.value ? (o(), u("p", J, d(f.value), 1)) : v("", !0),
        (o(!0), u(B, null, I(k.value, (n) => (o(), u("article", {
          key: n.tag,
          class: "note",
          "data-update-note": ""
        }, [
          t("div", K, [
            t("span", M, d(n.tag), 1),
            t("span", Q, d(new Date(n.published_at).toLocaleDateString()), 1)
          ]),
          y(r(V), {
            text: n.text
          }, null, 8, ["text"])
        ]))), 128)),
        x.value ? v("", !0) : (o(), u("button", {
          key: 4,
          type: "button",
          "data-update-older": "",
          onClick: e[0] || (e[0] = (n) => b(w.value + 1))
        }, "Show older releases"))
      ]),
      _: 1
    }));
  }
}, ee = /* @__PURE__ */ $(X, [["__scopeId", "data-v-67ddca71"]]);
export {
  ee as default
};
