/* @code-commandments-generated */
if (!document.getElementById("window-styles-26397f214e16")) { const style = document.createElement("style"); style.id = "window-styles-26397f214e16"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-edb5c7d0]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-edb5c7d0]{flex:1;min-height:0;overflow-y:auto}.history[data-v-edb5c7d0] .row-list-row{padding:1px 8px}.history[data-v-edb5c7d0] .mark.w-event{color:var(--text-3)}.notices[data-v-edb5c7d0]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-edb5c7d0]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-edb5c7d0]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-edb5c7d0]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-edb5c7d0]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-edb5c7d0]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-edb5c7d0]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-edb5c7d0]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-edb5c7d0]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-edb5c7d0]{visibility:hidden}.composer[data-v-edb5c7d0]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-edb5c7d0]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-edb5c7d0]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-edb5c7d0]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-edb5c7d0]{border-color:var(--accent)}.attached[data-v-edb5c7d0]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-edb5c7d0]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-edb5c7d0]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-edb5c7d0]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-edb5c7d0]{color:var(--text-3)}.composer-send[data-v-edb5c7d0]{margin-left:auto}.composer-failure[data-v-edb5c7d0]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as r, openBlock as s, createElementBlock as c, withModifiers as b, withDirectives as te, createElementVNode as o, vModelText as le, toDisplayString as h, createCommentVNode as _, createVNode as k, unref as a, withCtx as A, createTextVNode as E, computed as z, onMounted as pe, onUnmounted as me, watch as ve, nextTick as fe, Fragment as Z, renderList as ee, createBlock as R, normalizeClass as q, withKeys as ke } from "vue";
import { Btn as N, useRows as F, shownMarks as ge, markDeclaration as he, interleaved as _e, fetchMarkDeclarations as ye, fetchDockDeclarations as we, SHORT_CHAT as be, Icon as B, RowList as Ce, MarkHost as Te, MessageCard as De, DockStack as xe, dockOpening as $e } from "@journal/window-kit";
const ae = (C, T) => {
  const g = C.__vccOpts || C;
  for (const [y, f] of T)
    g[y] = f;
  return g;
}, Me = {
  key: 0,
  class: "dump-files"
}, Se = { class: "dump-row" }, Oe = {
  key: 1,
  class: "dump-failure"
}, Re = 60, Fe = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(C, { emit: T }) {
    const g = T, y = C, f = r(""), d = r([]), D = r(""), x = () => [...f.value.split(/\n\s*\n/).map((i) => i.trim()).filter(Boolean), ...d.value.map((i) => `${i.name}: ${i.text.trim()}`)], V = () => (x()[0] ?? "").replace(/\s+/g, " ").slice(0, Re);
    async function I(i) {
      var p;
      const n = [...((p = i.dataTransfer) == null ? void 0 : p.files) ?? []];
      d.value = [...d.value, ...await Promise.all(n.map(async (w) => ({ name: w.name, text: await w.text() })))];
    }
    async function $() {
      const i = await y.run(["dump", "make", V(), "--parts", x().join(" | ")]);
      D.value = i.ok ? "" : i.error, i.ok && (f.value = "", d.value = [], g("made"));
    }
    return (i, n) => (s(), c("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: b($, ["prevent"]),
      onDragover: n[2] || (n[2] = b(() => {
      }, ["prevent"])),
      onDrop: b(I, ["prevent"])
    }, [
      te(o("textarea", {
        "onUpdate:modelValue": n[0] || (n[0] = (p) => f.value = p),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [le, f.value]
      ]),
      d.value.length ? (s(), c("p", Me, h(d.value.map((p) => p.name).join(", ")), 1)) : _("", !0),
      o("div", Se, [
        k(a(N), {
          kind: "primary",
          small: "",
          disabled: !x().length,
          "data-dump-make": "",
          onClick: $
        }, {
          default: A(() => [...n[3] || (n[3] = [
            E("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(a(N), {
          small: "",
          onClick: n[1] || (n[1] = (p) => g("close"))
        }, {
          default: A(() => [...n[4] || (n[4] = [
            E("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      D.value ? (s(), c("p", Oe, h(D.value), 1)) : _("", !0)
    ], 32));
  }
}, Ae = /* @__PURE__ */ ae(Fe, [["__scopeId", "data-v-d2c5a833"]]), Ee = {
  "data-notices": "",
  class: "notices"
}, He = { class: "notice-text" }, ze = ["href", "target"], Be = ["onClick"], Ne = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, Ve = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, Ie = ["title"], Pe = {
  key: 0,
  class: "attached-wait"
}, Le = ["onClick"], je = { class: "composer-row" }, Ke = {
  key: 1,
  class: "composer-failure"
}, Ue = 180, qe = 40, We = {
  __name: "Chat",
  setup(C) {
    const { rows: T, failure: g, loaded: y, load: f, context: d } = F("message list", ["message.*"]), { rows: D } = F("chat-mark list", ["chat_mark.*"]), { rows: x } = F("dock-item list", ["dock_item.*"]), { rows: V, act: I } = F("notice list", ["notice.*"]), { rows: $ } = F("hook-call list --limit 1", ["hook_call.*"]), i = z(() => ge(D.value, he, (l) => d.option(l).value)), n = z(() => _e(T.value, i.value)), p = z(() => {
      var l;
      return ((l = $.value[0]) == null ? void 0 : l.hook) === "pre_tool_use" ? $.value[0].tool : "";
    }), w = r(null), P = r(!0), W = r(!1);
    let X = 0, G = !0, L = 0, M = null;
    pe(() => {
      Promise.all([ye(), we()]), w.value && typeof ResizeObserver < "u" && (M = new ResizeObserver(([l]) => W.value = l.contentRect.height < be), M.observe(w.value));
    }), me(() => {
      M == null || M.disconnect(), clearTimeout(L);
    });
    const S = r(""), j = r(""), m = r(null), J = r(!0), O = r(!1), u = r([]), Q = r(null), H = r(!1);
    async function K(l) {
      for (const t of l) {
        const e = { name: t.name, pending: "", failure: "" };
        u.value = [...u.value, e];
        const v = await d.upload(t);
        e.pending = v.ok ? v.value : "", e.failure = v.ok ? "" : v.error, u.value = [...u.value];
      }
    }
    const oe = (l) => {
      K([...l.target.files]), l.target.value = "";
    }, se = (l) => {
      var e;
      const t = [...((e = l.clipboardData) == null ? void 0 : e.files) ?? []];
      t.length && (l.preventDefault(), K(t));
    }, ne = (l) => {
      var t;
      H.value = !1, K([...((t = l.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, re = (l) => u.value = u.value.filter((t) => t !== l), Y = z(() => (S.value.trim() || u.value.length) && u.value.every((l) => l.pending));
    async function U() {
      const l = u.value.flatMap((e) => ["--file", e.pending]), t = await d.run(["message", "send", S.value || u.value.map((e) => e.name).join(", "), ...l]);
      j.value = t.ok ? "" : t.error, t.ok && (S.value = "", u.value = []), f();
    }
    const ie = (l) => !l.shiftKey && (l.preventDefault(), Y.value && U());
    function ue() {
      if (J.value = !m.value || m.value.scrollTop < 8, !m.value) return;
      const { scrollTop: l, scrollHeight: t, clientHeight: e } = m.value;
      G = t - l - e < qe;
      const v = $e({ top: l, before: X, height: t, shown: e });
      X = l, v !== null && (clearTimeout(L), v ? P.value = !0 : L = setTimeout(() => P.value = !1, Ue));
    }
    ve([n, y], async () => {
      await fe(), G && m.value && (m.value.scrollTop = m.value.scrollHeight);
    });
    const ce = () => {
      var l;
      return (l = m.value) == null ? void 0 : l.scrollTo({ top: 0, behavior: "smooth" });
    }, de = (l) => l.link.startsWith("http") ? l.link : `#open=${l.link}`;
    return (l, t) => (s(), c("div", {
      ref_key: "chat",
      ref: w,
      class: "chat"
    }, [
      o("div", Ee, [
        (s(!0), c(Z, null, ee(a(V), (e) => (s(), c("div", {
          key: e.id,
          class: "notice"
        }, [
          t[7] || (t[7] = o("span", { class: "notice-dot" }, null, -1)),
          o("span", He, h(e.title), 1),
          o("a", {
            class: "notice-link",
            href: de(e),
            target: e.link.startsWith("http") ? "_blank" : void 0
          }, h(e.label), 9, ze),
          o("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (v) => a(I)(["notice", "close", String(e.id)])
          }, [
            k(a(B), {
              name: "close",
              size: 12
            })
          ], 8, Be)
        ]))), 128))
      ]),
      o("div", {
        ref_key: "scroller",
        ref: m,
        class: "history",
        onScroll: ue
      }, [
        k(a(Ce), {
          rows: n.value,
          failure: a(g),
          loaded: a(y),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: A(({ row: e }) => [
            e.kind === "mark" ? (s(), R(a(Te), {
              key: 0,
              mark: e.row
            }, null, 8, ["mark"])) : (s(), R(a(De), {
              key: 1,
              message: e.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        p.value ? (s(), c("p", Ne, [
          t[8] || (t[8] = o("span", { class: "running-dot" }, null, -1)),
          E(h(p.value), 1)
        ])) : _("", !0)
      ], 544),
      o("button", {
        type: "button",
        "data-scroll-top": "",
        class: q(["scroll-top", { hidden: J.value }]),
        "aria-label": "Scroll to the top",
        onClick: ce
      }, [
        k(a(B), {
          name: "up",
          size: 14
        })
      ], 2),
      k(a(xe), {
        items: a(x),
        folded: W.value || !P.value
      }, null, 8, ["items", "folded"]),
      O.value ? (s(), R(Ae, {
        key: 0,
        run: a(d).run,
        onMade: t[0] || (t[0] = (e) => O.value = !1),
        onClose: t[1] || (t[1] = (e) => O.value = !1)
      }, null, 8, ["run"])) : _("", !0),
      o("form", {
        class: q(["composer", { dragging: H.value }]),
        onSubmit: b(U, ["prevent"]),
        onDragover: t[5] || (t[5] = b((e) => H.value = !0, ["prevent"])),
        onDragleave: t[6] || (t[6] = (e) => H.value = !1),
        onDrop: b(ne, ["prevent"])
      }, [
        u.value.length ? (s(), c("ul", Ve, [
          (s(!0), c(Z, null, ee(u.value, (e) => (s(), c("li", {
            key: e.name + e.pending,
            class: q(["attached-file", { failed: e.failure }]),
            title: e.failure
          }, [
            o("span", null, h(e.name), 1),
            !e.pending && !e.failure ? (s(), c("span", Pe, "sending")) : _("", !0),
            o("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (v) => re(e)
            }, [
              k(a(B), {
                name: "close",
                size: 10
              })
            ], 8, Le)
          ], 10, Ie))), 128))
        ])) : _("", !0),
        te(o("textarea", {
          "onUpdate:modelValue": t[2] || (t[2] = (e) => S.value = e),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: ke(ie, ["enter"]),
          onPaste: se
        }, null, 544), [
          [le, S.value]
        ]),
        o("div", je, [
          o("input", {
            ref_key: "picker",
            ref: Q,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: oe
          }, null, 544),
          o("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: t[3] || (t[3] = (e) => Q.value.click())
          }, [
            k(a(B), {
              name: "clip",
              size: 16
            })
          ]),
          Y.value ? (s(), R(a(N), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: U
          }, {
            default: A(() => [...t[9] || (t[9] = [
              E("Send", -1)
            ])]),
            _: 1
          })) : (s(), R(a(N), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[4] || (t[4] = (e) => O.value = !O.value)
          }, {
            default: A(() => [...t[10] || (t[10] = [
              E("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      j.value ? (s(), c("p", Ke, h(j.value), 1)) : _("", !0)
    ], 512));
  }
}, Je = /* @__PURE__ */ ae(We, [["__scopeId", "data-v-edb5c7d0"]]);
export {
  Je as default
};
