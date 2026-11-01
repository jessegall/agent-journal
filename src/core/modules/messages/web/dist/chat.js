/* @code-commandments-generated */
if (!document.getElementById("window-styles-f6d0e4988150")) { const style = document.createElement("style"); style.id = "window-styles-f6d0e4988150"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-1533c87a]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-1533c87a]{flex:1;min-height:0;overflow-y:auto}.history[data-v-1533c87a] .row-list-row{padding:1px 8px}.history[data-v-1533c87a] .mark.w-event{color:var(--text-3)}.notices[data-v-1533c87a]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-1533c87a]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-1533c87a]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-1533c87a]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-1533c87a]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-1533c87a]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-1533c87a]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-1533c87a]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-1533c87a]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-1533c87a]{visibility:hidden}.composer[data-v-1533c87a]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-1533c87a]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-1533c87a]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-1533c87a]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-1533c87a]{border-color:var(--accent)}.attached[data-v-1533c87a]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-1533c87a]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-1533c87a]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-1533c87a]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-1533c87a]{color:var(--text-3)}.composer-send[data-v-1533c87a]{margin-left:auto}.composer-failure[data-v-1533c87a]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as r, openBlock as s, createElementBlock as c, withModifiers as b, withDirectives as oe, createElementVNode as o, vModelText as se, toDisplayString as h, createCommentVNode as _, createVNode as k, unref as a, withCtx as A, createTextVNode as E, computed as I, onMounted as fe, onUnmounted as ke, nextTick as te, watch as ge, Fragment as le, renderList as ae, createBlock as R, normalizeClass as W, withKeys as he } from "vue";
import { Btn as B, useRows as F, shownMarks as _e, markDeclaration as ye, interleaved as we, fetchMarkDeclarations as be, fetchDockDeclarations as Ce, SHORT_CHAT as Te, Icon as z, RowList as De, MarkHost as xe, MessageCard as $e, DockStack as Me, dockOpening as Se } from "@journal/window-kit";
const ne = (C, T) => {
  const g = C.__vccOpts || C;
  for (const [y, f] of T)
    g[y] = f;
  return g;
}, Oe = {
  key: 0,
  class: "dump-files"
}, Re = { class: "dump-row" }, Fe = {
  key: 1,
  class: "dump-failure"
}, Ae = 60, Ee = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(C, { emit: T }) {
    const g = T, y = C, f = r(""), d = r([]), D = r(""), x = () => [...f.value.split(/\n\s*\n/).map((i) => i.trim()).filter(Boolean), ...d.value.map((i) => `${i.name}: ${i.text.trim()}`)], N = () => (x()[0] ?? "").replace(/\s+/g, " ").slice(0, Ae);
    async function V(i) {
      var p;
      const n = [...((p = i.dataTransfer) == null ? void 0 : p.files) ?? []];
      d.value = [...d.value, ...await Promise.all(n.map(async (w) => ({ name: w.name, text: await w.text() })))];
    }
    async function $() {
      const i = await y.run(["dump", "make", N(), "--parts", x().join(" | ")]);
      D.value = i.ok ? "" : i.error, i.ok && (f.value = "", d.value = [], g("made"));
    }
    return (i, n) => (s(), c("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: b($, ["prevent"]),
      onDragover: n[2] || (n[2] = b(() => {
      }, ["prevent"])),
      onDrop: b(V, ["prevent"])
    }, [
      oe(o("textarea", {
        "onUpdate:modelValue": n[0] || (n[0] = (p) => f.value = p),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [se, f.value]
      ]),
      d.value.length ? (s(), c("p", Oe, h(d.value.map((p) => p.name).join(", ")), 1)) : _("", !0),
      o("div", Re, [
        k(a(B), {
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
        k(a(B), {
          small: "",
          onClick: n[1] || (n[1] = (p) => g("close"))
        }, {
          default: A(() => [...n[4] || (n[4] = [
            E("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      D.value ? (s(), c("p", Fe, h(D.value), 1)) : _("", !0)
    ], 32));
  }
}, He = /* @__PURE__ */ ne(Ee, [["__scopeId", "data-v-d2c5a833"]]), Ie = {
  "data-notices": "",
  class: "notices"
}, ze = { class: "notice-text" }, Be = ["href", "target"], Ne = ["onClick"], Ve = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, Pe = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, Le = ["title"], je = {
  key: 0,
  class: "attached-wait"
}, Ke = ["onClick"], Ue = { class: "composer-row" }, qe = {
  key: 1,
  class: "composer-failure"
}, We = 180, Xe = 40, Ge = {
  __name: "Chat",
  setup(C) {
    const { rows: T, failure: g, loaded: y, load: f, context: d } = F("message list", ["message.*"]), { rows: D } = F("chat-mark list", ["chat_mark.*"]), { rows: x } = F("dock-item list", ["dock_item.*"]), { rows: N, act: V } = F("notice list", ["notice.*"]), { rows: $ } = F("hook-call list --limit 1", ["hook_call.*"]), i = I(() => _e(D.value, ye, (t) => d.option(t).value)), n = I(() => we(T.value, i.value)), p = I(() => {
      var t;
      return ((t = $.value[0]) == null ? void 0 : t.hook) === "pre_tool_use" ? $.value[0].tool : "";
    }), w = r(null), P = r(!0), X = r(!1);
    let G = 0, J = !0, L = 0, M = null;
    fe(() => {
      K(), Promise.all([be(), Ce()]), w.value && typeof ResizeObserver < "u" && (M = new ResizeObserver(([t]) => X.value = t.contentRect.height < Te), M.observe(w.value));
    }), ke(() => {
      M == null || M.disconnect(), clearTimeout(L);
    });
    const S = r(""), j = r(""), m = r(null), Q = r(!0), O = r(!1), u = r([]), Y = r(null), Z = r(null), K = () => te(() => {
      var t;
      return (t = Z.value) == null ? void 0 : t.focus();
    }), H = r(!1);
    async function U(t) {
      for (const l of t) {
        const e = { name: l.name, pending: "", failure: "" };
        u.value = [...u.value, e];
        const v = await d.upload(l);
        e.pending = v.ok ? v.value : "", e.failure = v.ok ? "" : v.error, u.value = [...u.value];
      }
      K();
    }
    const re = (t) => {
      U([...t.target.files]), t.target.value = "";
    }, ie = (t) => {
      var e;
      const l = [...((e = t.clipboardData) == null ? void 0 : e.files) ?? []];
      l.length && (t.preventDefault(), U(l));
    }, ue = (t) => {
      var l;
      H.value = !1, U([...((l = t.dataTransfer) == null ? void 0 : l.files) ?? []]);
    }, ce = (t) => u.value = u.value.filter((l) => l !== t), ee = I(() => (S.value.trim() || u.value.length) && u.value.every((t) => t.pending));
    async function q() {
      const t = u.value.flatMap((e) => ["--file", e.pending]), l = await d.run(["message", "send", S.value || u.value.map((e) => e.name).join(", "), ...t]);
      j.value = l.ok ? "" : l.error, l.ok && (S.value = "", u.value = []), f(), K();
    }
    const de = (t) => !t.shiftKey && (t.preventDefault(), ee.value && q());
    function pe() {
      if (Q.value = !m.value || m.value.scrollTop < 8, !m.value) return;
      const { scrollTop: t, scrollHeight: l, clientHeight: e } = m.value;
      J = l - t - e < Xe;
      const v = Se({ top: t, before: G, height: l, shown: e });
      G = t, v !== null && (clearTimeout(L), v ? P.value = !0 : L = setTimeout(() => P.value = !1, We));
    }
    ge([n, y], async () => {
      await te(), J && m.value && (m.value.scrollTop = m.value.scrollHeight);
    });
    const me = () => {
      var t;
      return (t = m.value) == null ? void 0 : t.scrollTo({ top: 0, behavior: "smooth" });
    }, ve = (t) => t.link.startsWith("http") ? t.link : `#open=${t.link}`;
    return (t, l) => (s(), c("div", {
      ref_key: "chat",
      ref: w,
      class: "chat"
    }, [
      o("div", Ie, [
        (s(!0), c(le, null, ae(a(N), (e) => (s(), c("div", {
          key: e.id,
          class: "notice"
        }, [
          l[7] || (l[7] = o("span", { class: "notice-dot" }, null, -1)),
          o("span", ze, h(e.title), 1),
          o("a", {
            class: "notice-link",
            href: ve(e),
            target: e.link.startsWith("http") ? "_blank" : void 0
          }, h(e.label), 9, Be),
          o("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (v) => a(V)(["notice", "close", String(e.id)])
          }, [
            k(a(z), {
              name: "close",
              size: 12
            })
          ], 8, Ne)
        ]))), 128))
      ]),
      o("div", {
        ref_key: "scroller",
        ref: m,
        class: "history",
        onScroll: pe
      }, [
        k(a(De), {
          rows: n.value,
          failure: a(g),
          loaded: a(y),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: A(({ row: e }) => [
            e.kind === "mark" ? (s(), R(a(xe), {
              key: 0,
              mark: e.row
            }, null, 8, ["mark"])) : (s(), R(a($e), {
              key: 1,
              message: e.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        p.value ? (s(), c("p", Ve, [
          l[8] || (l[8] = o("span", { class: "running-dot" }, null, -1)),
          E(h(p.value), 1)
        ])) : _("", !0)
      ], 544),
      o("button", {
        type: "button",
        "data-scroll-top": "",
        class: W(["scroll-top", { hidden: Q.value }]),
        "aria-label": "Scroll to the top",
        onClick: me
      }, [
        k(a(z), {
          name: "up",
          size: 14
        })
      ], 2),
      k(a(Me), {
        items: a(x),
        folded: X.value || !P.value
      }, null, 8, ["items", "folded"]),
      O.value ? (s(), R(He, {
        key: 0,
        run: a(d).run,
        onMade: l[0] || (l[0] = (e) => O.value = !1),
        onClose: l[1] || (l[1] = (e) => O.value = !1)
      }, null, 8, ["run"])) : _("", !0),
      o("form", {
        class: W(["composer", { dragging: H.value }]),
        onSubmit: b(q, ["prevent"]),
        onDragover: l[5] || (l[5] = b((e) => H.value = !0, ["prevent"])),
        onDragleave: l[6] || (l[6] = (e) => H.value = !1),
        onDrop: b(ue, ["prevent"])
      }, [
        u.value.length ? (s(), c("ul", Pe, [
          (s(!0), c(le, null, ae(u.value, (e) => (s(), c("li", {
            key: e.name + e.pending,
            class: W(["attached-file", { failed: e.failure }]),
            title: e.failure
          }, [
            o("span", null, h(e.name), 1),
            !e.pending && !e.failure ? (s(), c("span", je, "sending")) : _("", !0),
            o("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (v) => ce(e)
            }, [
              k(a(z), {
                name: "close",
                size: 10
              })
            ], 8, Ke)
          ], 10, Le))), 128))
        ])) : _("", !0),
        oe(o("textarea", {
          ref_key: "composerInput",
          ref: Z,
          "onUpdate:modelValue": l[2] || (l[2] = (e) => S.value = e),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: he(de, ["enter"]),
          onPaste: ie
        }, null, 544), [
          [se, S.value]
        ]),
        o("div", Ue, [
          o("input", {
            ref_key: "picker",
            ref: Y,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: re
          }, null, 544),
          o("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: l[3] || (l[3] = (e) => Y.value.click())
          }, [
            k(a(z), {
              name: "clip",
              size: 16
            })
          ]),
          ee.value ? (s(), R(a(B), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: q
          }, {
            default: A(() => [...l[9] || (l[9] = [
              E("Send", -1)
            ])]),
            _: 1
          })) : (s(), R(a(B), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: l[4] || (l[4] = (e) => O.value = !O.value)
          }, {
            default: A(() => [...l[10] || (l[10] = [
              E("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      j.value ? (s(), c("p", qe, h(j.value), 1)) : _("", !0)
    ], 512));
  }
}, Ye = /* @__PURE__ */ ne(Ge, [["__scopeId", "data-v-1533c87a"]]);
export {
  Ye as default
};
