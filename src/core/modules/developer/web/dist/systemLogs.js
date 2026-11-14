if (!document.getElementById("window-styles-0b4ecba2d0cc")) { const style = document.createElement("style"); style.id = "window-styles-0b4ecba2d0cc"; style.textContent = ".inspector[data-v-7f374e1d]{display:flex;flex-direction:column;min-height:0;height:100%;overflow-y:auto;background:var(--bg)}header[data-v-7f374e1d]{display:flex;align-items:center;gap:8px;padding:14px;border-bottom:1px solid var(--border)}header h1[data-v-7f374e1d]{flex:1;margin:0;font-size:14px}.empty[data-v-7f374e1d]{margin:0;padding:14px;color:var(--text-3);font-size:12px}.detail-head[data-v-360e14b0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-360e14b0]{margin:0;color:var(--text);font-size:14px}.slow[data-v-360e14b0]{color:#c58b35}.refused[data-v-360e14b0]{color:#d76b6b}.heading[data-v-360e14b0]{margin:0 0 8px;font-size:12px}pre[data-v-360e14b0]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}.note[data-v-360e14b0]{margin:0;color:var(--text-3);font-size:12px}.message[data-v-360e14b0]{padding:16px;line-height:1.6}.toolbar[data-v-c0c54f64]{display:flex;justify-content:space-between;padding:8px 12px}.queue-veil[data-v-c0c54f64]{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;justify-content:flex-end;background:#0005;z-index:3}.queue-veil[data-v-c0c54f64]>*{width:min(560px,100%);box-shadow:0 0 24px #0003}.requests[data-v-c0c54f64]{position:relative;display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-c0c54f64]{display:flex;flex-direction:column;min-height:0;min-width:0}.note[data-v-c0c54f64]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-c0c54f64]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-c0c54f64]{background:var(--border)}.message[data-v-c0c54f64]{padding:16px;line-height:1.6}.detail-head[data-v-c0c54f64]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-c0c54f64]{margin:0;color:var(--text);font-size:14px}.heading[data-v-c0c54f64]{margin:0 0 8px;font-size:12px}pre[data-v-c0c54f64]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.queue-button[data-v-c0c54f64]{align-self:flex-end;margin:8px 12px}.queue-veil[data-v-c0c54f64]{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;justify-content:flex-end;background:#0005;z-index:3}.queue-veil[data-v-c0c54f64]>*{width:min(560px,100%);box-shadow:0 0 24px #0003}.requests[data-v-c0c54f64]{position:relative;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-23ad5fa1]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-23ad5fa1]{margin:0;color:var(--text-3);font-size:12.5px}.logs[data-v-25c9b82f]{display:flex;flex-direction:column;height:100%;min-height:0}.toolbar[data-v-25c9b82f],nav[data-v-25c9b82f]{display:flex;align-items:center;gap:12px;padding:10px 12px;flex:none}.toolbar[data-v-25c9b82f]{border-bottom:1px solid var(--border)}.toolbar label[data-v-25c9b82f]{display:flex;align-items:center;gap:6px}.toolbar button[data-v-25c9b82f]{margin-left:auto}.scroll[data-v-25c9b82f]{flex:1;min-height:0}nav[data-v-25c9b82f]{justify-content:center;border-top:1px solid var(--border)}\n"; document.head.appendChild(style); }
import { ref as g, computed as x, watch as E, openBlock as N, createBlock as O, unref as a, withCtx as p, createElementVNode as u, createTextVNode as v, createVNode as r, toDisplayString as f, createElementBlock as $, createCommentVNode as D } from "vue";
import { useWindow as z, dated as F, usePoll as U, READ_RATES as W, WindowRoom as j, DropList as C, Btn as w, TableLayout as I, wordLabel as q } from "@journal/window-kit";
import { u as G, t as H } from "./usePausedProp-C5dSctRP.js";
import { _ as J } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const K = {
  class: "logs",
  "data-system-logs": "",
  "aria-label": "System logs"
}, Q = { class: "toolbar" }, X = { class: "field" }, Y = { class: "field" }, Z = {
  key: 0,
  role: "alert"
}, h = { "aria-label": "Log pages" }, ee = {
  __name: "SystemLogs",
  setup(le) {
    const S = (l, e) => [{ key: "", label: l }, ...e.map((s) => ({ key: s, label: q(s) }))], b = S("All sources", ["server", "journal", "bypass"]), k = S("All levels", ["debug", "info", "warning", "error", "critical"]), c = (l, e) => l.find((s) => s.key === e).label, n = z(), i = g(""), d = g(""), o = g(1), t = g(!1), { data: y, failure: _, loaded: R, reload: T } = G(n, "logs", t, { rows: [], total: 0, size: 50 }), V = [{ key: "time", label: "Time" }, { key: "source", label: "Source" }, { key: "level", label: "Level" }, { key: "message", label: "Message" }], A = { error: "danger", critical: "danger", warning: "warn" }, B = x(() => y.value.rows.map((l) => ({ mark: l.id, time: F(l.recorded_at), source: c(b, l.source), level: c(k, l.level), message: l.text, tone: A[l.level] ?? "" }))), L = x(() => Math.max(1, Math.ceil(y.value.total / y.value.size)));
    function P() {
      n.state["logs.page"] = String(o.value);
      for (const [l, e] of [["source", i.value], ["level", d.value]])
        e ? n.state[`logs.${l}`] = e : delete n.state[`logs.${l}`];
    }
    P();
    async function m() {
      P(), await T();
    }
    E([i, d], () => {
      if (o.value !== 1) {
        o.value = 1;
        return;
      }
      t.value || m();
    }), E(o, () => {
      t.value || m();
    });
    function M() {
      H(t, m);
    }
    return U(() => R.value && m(), () => !t.value && n.visible.value, W.systemLogs), (l, e) => (N(), O(a(j), { padding: "0" }, {
      default: p(() => [
        u("section", K, [
          u("div", Q, [
            u("span", X, [
              e[4] || (e[4] = v("Source ", -1)),
              r(a(C), {
                label: c(a(b), i.value),
                items: a(b),
                picked: i.value,
                "data-log-source": "",
                onPick: e[0] || (e[0] = (s) => i.value = s.key)
              }, null, 8, ["label", "items", "picked"])
            ]),
            u("span", Y, [
              e[5] || (e[5] = v("Level ", -1)),
              r(a(C), {
                label: c(a(k), d.value),
                items: a(k),
                picked: d.value,
                "data-log-level": "",
                onPick: e[1] || (e[1] = (s) => d.value = s.key)
              }, null, 8, ["label", "items", "picked"])
            ]),
            r(a(w), {
              small: "",
              "data-log-pause": "",
              "aria-pressed": t.value,
              onClick: M
            }, {
              default: p(() => [
                v(f(t.value ? "Resume" : "Pause"), 1)
              ]),
              _: 1
            }, 8, ["aria-pressed"])
          ]),
          a(_) ? (N(), $("p", Z, f(a(_)), 1)) : D("", !0),
          r(a(I), {
            class: "scroll",
            columns: V,
            rows: B.value,
            empty: a(_) ? "" : "No log lines found.",
            "data-log-table": ""
          }, null, 8, ["rows", "empty"]),
          u("nav", h, [
            r(a(w), {
              small: "",
              "data-log-previous": "",
              disabled: o.value <= 1 || t.value,
              onClick: e[2] || (e[2] = (s) => o.value--)
            }, {
              default: p(() => [...e[6] || (e[6] = [
                v("Previous", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            u("span", null, "Page " + f(o.value) + " of " + f(L.value), 1),
            r(a(w), {
              small: "",
              "data-log-next": "",
              disabled: o.value >= L.value || t.value,
              onClick: e[3] || (e[3] = (s) => o.value++)
            }, {
              default: p(() => [...e[7] || (e[7] = [
                v("Next", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ue = /* @__PURE__ */ J(ee, [["__scopeId", "data-v-25c9b82f"]]);
export {
  ue as default
};
