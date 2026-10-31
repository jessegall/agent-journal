/* @code-commandments-generated */
if (!document.getElementById("window-styles-06d4f2c6482b")) { const style = document.createElement("style"); style.id = "window-styles-06d4f2c6482b"; style.textContent = ".chat[data-v-c92732e9]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-c92732e9]{flex:1;min-height:0;overflow-y:auto}.history[data-v-c92732e9] .row-list-row{padding:1px 8px}.history[data-v-c92732e9] .mark.w-event{color:var(--text-3)}.notices[data-v-c92732e9]{display:flex;flex-direction:column}.notice[data-v-c92732e9]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-c92732e9]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-c92732e9]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-c92732e9]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-c92732e9]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-c92732e9]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-c92732e9]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-c92732e9]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-c92732e9]{visibility:hidden}.composer[data-v-c92732e9]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-c92732e9]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-c92732e9]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-c92732e9]{border:0;background:none;color:var(--text-3)}.composer-send[data-v-c92732e9]{margin-left:auto}.composer-failure[data-v-c92732e9]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as w, onMounted as W, ref as m, openBlock as a, createElementBlock as i, createElementVNode as s, Fragment as $, renderList as H, unref as t, toDisplayString as p, createVNode as n, withCtx as y, createBlock as T, createTextVNode as b, createCommentVNode as N, normalizeClass as P, withModifiers as U, withDirectives as j, withKeys as q, vModelText as G } from "vue";
import { useRows as c, shownMarks as J, markDeclaration as Q, interleaved as X, fetchMarkDeclarations as Y, fetchDockDeclarations as Z, Icon as C, DockStack as ee, RowList as te, MarkHost as oe, MessageCard as se, Btn as V } from "@journal/window-kit";
const le = (k, v) => {
  const d = k.__vccOpts || k;
  for (const [f, h] of v)
    d[f] = h;
  return d;
}, ae = { class: "chat" }, ne = {
  "data-notices": "",
  class: "notices"
}, re = { class: "notice-text" }, ie = ["href", "target"], ce = ["onClick"], de = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, ue = { class: "composer-row" }, me = {
  type: "button",
  "data-attach": "",
  class: "composer-attach",
  disabled: "",
  title: "Attaching files waits for the dumps module",
  "aria-label": "Attach a file"
}, pe = {
  key: 0,
  class: "composer-failure"
}, ke = {
  __name: "Chat",
  setup(k) {
    const { rows: v, failure: d, loaded: f, load: h, context: x } = c("message list", ["message.*"]), { rows: z } = c("chat-mark list", ["chat_mark.*"]), { rows: B } = c("dock-item list", ["dock_item.*"]), { rows: E, act: K } = c("notice list", ["notice.*"]), { rows: D } = c("hook-call list --limit 1", ["hook_call.*"]), O = w(() => J(z.value, Q, (e) => x.option(e).value)), A = w(() => X(v.value, O.value)), M = w(() => {
      var e;
      return ((e = D.value[0]) == null ? void 0 : e.hook) === "pre_tool_use" ? D.value[0].tool : "";
    });
    W(() => Promise.all([Y(), Z()]));
    const r = m(""), _ = m(""), u = m(null), S = m(!0);
    async function g() {
      const e = await x.run(["message", "send", r.value]);
      _.value = e.ok ? "" : e.error, e.ok && (r.value = ""), h();
    }
    const F = (e) => !e.shiftKey && (e.preventDefault(), r.value.trim() && g()), I = () => S.value = !u.value || u.value.scrollTop < 8, L = () => {
      var e;
      return (e = u.value) == null ? void 0 : e.scrollTo({ top: 0, behavior: "smooth" });
    }, R = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, l) => (a(), i("div", ae, [
      s("div", ne, [
        (a(!0), i($, null, H(t(E), (o) => (a(), i("div", {
          key: o.id,
          class: "notice"
        }, [
          l[1] || (l[1] = s("span", { class: "notice-dot" }, null, -1)),
          s("span", re, p(o.title), 1),
          s("a", {
            class: "notice-link",
            href: R(o),
            target: o.link.startsWith("http") ? "_blank" : void 0
          }, p(o.label), 9, ie),
          s("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (ve) => t(K)(["notice", "close", String(o.id)])
          }, [
            n(t(C), {
              name: "close",
              size: 12
            })
          ], 8, ce)
        ]))), 128))
      ]),
      n(t(ee), { items: t(B) }, null, 8, ["items"]),
      s("div", {
        ref_key: "scroller",
        ref: u,
        class: "history",
        onScroll: I
      }, [
        n(t(te), {
          rows: A.value,
          failure: t(d),
          loaded: t(f),
          empty: "No messages yet"
        }, {
          default: y(({ row: o }) => [
            o.kind === "mark" ? (a(), T(t(oe), {
              key: 0,
              mark: o.row
            }, null, 8, ["mark"])) : (a(), T(t(se), {
              key: 1,
              message: o.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        M.value ? (a(), i("p", de, [
          l[2] || (l[2] = s("span", { class: "running-dot" }, null, -1)),
          b(p(M.value), 1)
        ])) : N("", !0)
      ], 544),
      s("button", {
        type: "button",
        "data-scroll-top": "",
        class: P(["scroll-top", { hidden: S.value }]),
        "aria-label": "Scroll to the top",
        onClick: L
      }, [
        n(t(C), {
          name: "up",
          size: 14
        })
      ], 2),
      s("form", {
        class: "composer",
        onSubmit: U(g, ["prevent"])
      }, [
        j(s("textarea", {
          "onUpdate:modelValue": l[0] || (l[0] = (o) => r.value = o),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: q(F, ["enter"])
        }, null, 544), [
          [G, r.value]
        ]),
        s("div", ue, [
          s("button", me, [
            n(t(C), {
              name: "clip",
              size: 16
            })
          ]),
          n(t(V), {
            small: "",
            disabled: "",
            title: "Dumping files waits for the dumps module"
          }, {
            default: y(() => [...l[3] || (l[3] = [
              b("Dump files", -1)
            ])]),
            _: 1
          }),
          n(t(V), {
            kind: "primary",
            small: "",
            class: "composer-send",
            disabled: !r.value.trim(),
            onClick: g
          }, {
            default: y(() => [...l[4] || (l[4] = [
              b("Send", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32),
      _.value ? (a(), i("p", pe, p(_.value), 1)) : N("", !0)
    ]));
  }
}, _e = /* @__PURE__ */ le(ke, [["__scopeId", "data-v-c92732e9"]]);
export {
  _e as default
};
