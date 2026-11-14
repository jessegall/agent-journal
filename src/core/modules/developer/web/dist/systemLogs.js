if (!document.getElementById("window-styles-d1802ce5b006")) { const style = document.createElement("style"); style.id = "window-styles-d1802ce5b006"; style.textContent = ".inspector[data-v-7f374e1d]{display:flex;flex-direction:column;min-height:0;height:100%;overflow-y:auto;background:var(--bg)}header[data-v-7f374e1d]{display:flex;align-items:center;gap:8px;padding:14px;border-bottom:1px solid var(--border)}header h1[data-v-7f374e1d]{flex:1;margin:0;font-size:14px}.empty[data-v-7f374e1d]{margin:0;padding:14px;color:var(--text-3);font-size:12px}.detail-head[data-v-360e14b0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-360e14b0]{margin:0;color:var(--text);font-size:14px}.slow[data-v-360e14b0]{color:#c58b35}.refused[data-v-360e14b0]{color:#d76b6b}.heading[data-v-360e14b0]{margin:0 0 8px;font-size:12px}pre[data-v-360e14b0]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}.note[data-v-360e14b0]{margin:0;color:var(--text-3);font-size:12px}.message[data-v-360e14b0]{padding:16px;line-height:1.6}.toolbar[data-v-cd8cfab4]{display:flex;justify-content:space-between;padding:8px 12px}.queue-veil[data-v-cd8cfab4]{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;justify-content:flex-end;background:#0005;z-index:3}.queue-veil[data-v-cd8cfab4]>*{width:min(560px,100%);box-shadow:0 0 24px #0003}.requests[data-v-cd8cfab4]{position:relative;display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-cd8cfab4]{display:flex;flex-direction:column;min-height:0;min-width:0}.note[data-v-cd8cfab4]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-cd8cfab4]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-cd8cfab4]{background:var(--border)}.message[data-v-cd8cfab4]{padding:16px;line-height:1.6}.detail-head[data-v-cd8cfab4]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-cd8cfab4]{margin:0;color:var(--text);font-size:14px}.heading[data-v-cd8cfab4]{margin:0 0 8px;font-size:12px}pre[data-v-cd8cfab4]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.queue-button[data-v-cd8cfab4]{align-self:flex-end;margin:8px 12px}.queue-veil[data-v-cd8cfab4]{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;justify-content:flex-end;background:#0005;z-index:3}.queue-veil[data-v-cd8cfab4]>*{width:min(560px,100%);box-shadow:0 0 24px #0003}.requests[data-v-cd8cfab4]{position:relative;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-c16f7101]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-c16f7101]{margin:0;color:var(--text-3);font-size:12.5px}.logs[data-v-8c85e7dc]{display:flex;flex-direction:column;height:100%;min-height:0}.toolbar[data-v-8c85e7dc],nav[data-v-8c85e7dc]{display:flex;align-items:center;gap:12px;padding:10px 12px;flex:none}.toolbar[data-v-8c85e7dc]{border-bottom:1px solid var(--border)}.toolbar label[data-v-8c85e7dc]{display:flex;align-items:center;gap:6px}.toolbar button[data-v-8c85e7dc]{margin-left:auto}.scroll[data-v-8c85e7dc]{flex:1;min-height:0}.picked[data-v-8c85e7dc]{flex:none;max-height:40%;overflow:auto;margin:0;padding:10px 12px;border-top:1px solid var(--border);white-space:pre-wrap;word-break:break-word;font:12px var(--mono, monospace)}nav[data-v-8c85e7dc]{justify-content:center;border-top:1px solid var(--border)}\n"; document.head.appendChild(style); }
import { ref as v, computed as S, watch as R, openBlock as L, createBlock as F, unref as a, withCtx as b, createElementVNode as i, createTextVNode as c, createVNode as u, toDisplayString as m, createElementBlock as T, createCommentVNode as V } from "vue";
import { useWindow as U, dated as W, usePoll as h, READ_RATES as j, WindowRoom as I, DropList as A, Btn as x, TableLayout as q, wordLabel as G } from "@journal/window-kit";
import { u as H, t as J } from "./usePausedProp-C5dSctRP.js";
import { _ as K } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Q = {
  class: "logs",
  "data-system-logs": "",
  "aria-label": "System logs"
}, X = { class: "toolbar" }, Y = { class: "field" }, Z = { class: "field" }, ee = {
  key: 0,
  role: "alert"
}, le = {
  key: 1,
  class: "picked",
  "data-log-line": ""
}, ae = { "aria-label": "Log pages" }, se = {
  __name: "SystemLogs",
  setup(te) {
    const P = (l, e) => [{ key: "", label: l }, ...e.map((s) => ({ key: s, label: G(s) }))], y = P("All sources", ["server", "journal", "bypass"]), w = P("All levels", ["debug", "info", "warning", "error", "critical"]), p = (l, e) => l.find((s) => s.key === e).label, r = U(), n = v(""), d = v(""), t = v(1), o = v(!1), { data: g, failure: _, loaded: B, reload: M } = H(r, "logs", o, { rows: [], total: 0, size: 50 }), O = [{ key: "time", label: "Time", width: "11rem" }, { key: "source", label: "Source", width: "6rem" }, { key: "level", label: "Level", width: "6rem" }, { key: "message", label: "Message", width: "1fr" }], $ = { error: "danger", critical: "danger", warning: "warn" }, D = S(() => g.value.rows.map((l) => ({ mark: l.id, time: W(l.recorded_at), source: p(y, l.source), level: p(w, l.level), message: l.text, tone: $[l.level] ?? "" }))), E = v(""), f = S(() => g.value.rows.find((l) => String(l.id) === E.value) ?? null), N = S(() => Math.max(1, Math.ceil(g.value.total / g.value.size)));
    function C() {
      r.state["logs.page"] = String(t.value);
      for (const [l, e] of [["source", n.value], ["level", d.value]])
        e ? r.state[`logs.${l}`] = e : delete r.state[`logs.${l}`];
    }
    C();
    async function k() {
      C(), await M();
    }
    R([n, d], () => {
      if (t.value !== 1) {
        t.value = 1;
        return;
      }
      o.value || k();
    }), R(t, () => {
      o.value || k();
    });
    function z() {
      J(o, k);
    }
    return h(() => B.value && k(), () => !o.value && r.visible.value, j.systemLogs), (l, e) => (L(), F(a(I), { padding: "0" }, {
      default: b(() => [
        i("section", Q, [
          i("div", X, [
            i("span", Y, [
              e[4] || (e[4] = c("Source ", -1)),
              u(a(A), {
                label: p(a(y), n.value),
                items: a(y),
                picked: n.value,
                "data-log-source": "",
                onPick: e[0] || (e[0] = (s) => n.value = s.key)
              }, null, 8, ["label", "items", "picked"])
            ]),
            i("span", Z, [
              e[5] || (e[5] = c("Level ", -1)),
              u(a(A), {
                label: p(a(w), d.value),
                items: a(w),
                picked: d.value,
                "data-log-level": "",
                onPick: e[1] || (e[1] = (s) => d.value = s.key)
              }, null, 8, ["label", "items", "picked"])
            ]),
            u(a(x), {
              small: "",
              "data-log-pause": "",
              "aria-pressed": o.value,
              onClick: z
            }, {
              default: b(() => [
                c(m(o.value ? "Resume" : "Pause"), 1)
              ]),
              _: 1
            }, 8, ["aria-pressed"])
          ]),
          a(_) ? (L(), T("p", ee, m(a(_)), 1)) : V("", !0),
          u(a(q), {
            class: "scroll",
            columns: O,
            rows: D.value,
            empty: a(_) ? "" : "No log lines found.",
            pick: (s) => E.value = s,
            active: f.value ? f.value.id : "",
            "data-log-table": ""
          }, null, 8, ["rows", "empty", "pick", "active"]),
          f.value ? (L(), T("pre", le, m(f.value.text), 1)) : V("", !0),
          i("nav", ae, [
            u(a(x), {
              small: "",
              "data-log-previous": "",
              disabled: t.value <= 1 || o.value,
              onClick: e[2] || (e[2] = (s) => t.value--)
            }, {
              default: b(() => [...e[6] || (e[6] = [
                c("Previous", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            i("span", null, "Page " + m(t.value) + " of " + m(N.value), 1),
            u(a(x), {
              small: "",
              "data-log-next": "",
              disabled: t.value >= N.value || o.value,
              onClick: e[3] || (e[3] = (s) => t.value++)
            }, {
              default: b(() => [...e[7] || (e[7] = [
                c("Next", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ne = /* @__PURE__ */ K(se, [["__scopeId", "data-v-8c85e7dc"]]);
export {
  ne as default
};
