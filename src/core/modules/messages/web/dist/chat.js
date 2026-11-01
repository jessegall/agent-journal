/* @code-commandments-generated */
if (!document.getElementById("window-styles-9f8a7c839ec5")) { const style = document.createElement("style"); style.id = "window-styles-9f8a7c839ec5"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-eae961d3]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-eae961d3]{flex:1;min-height:0;overflow-y:auto}.history[data-v-eae961d3] .row-list-row{padding:1px 8px}.history[data-v-eae961d3] .mark.w-event{color:var(--text-3)}.notices[data-v-eae961d3]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-eae961d3]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-eae961d3]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-eae961d3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-eae961d3]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-eae961d3]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-eae961d3]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-eae961d3]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-eae961d3]{background:var(--text-4)}.jump-holder[data-v-eae961d3]{position:relative;flex:none;height:0}.jump[data-v-eae961d3]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-eae961d3]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-eae961d3]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-eae961d3]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-eae961d3],.rise-leave-to[data-v-eae961d3]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-eae961d3]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-eae961d3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-eae961d3]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-eae961d3]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-eae961d3]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-eae961d3]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-eae961d3]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-eae961d3]{border-color:var(--accent)}.attached[data-v-eae961d3]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-eae961d3]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-eae961d3]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-eae961d3]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-eae961d3]{color:var(--text-3)}.composer-send[data-v-eae961d3]{margin-left:auto}.composer-failure[data-v-eae961d3]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as s, createElementBlock as f, withModifiers as F, withDirectives as ue, createElementVNode as l, vModelText as Te, toDisplayString as y, createCommentVNode as C, createVNode as h, unref as n, withCtx as D, createTextVNode as R, computed as P, onMounted as Ue, onUnmounted as _e, nextTick as ne, watch as se, Fragment as Ce, renderList as be, createBlock as M, Transition as Ve, vShow as qe, normalizeClass as re, withKeys as q } from "vue";
import { Btn as B, useRows as z, shownMarks as ze, markDeclaration as Ge, interleaved as Xe, fetchMarkDeclarations as Qe, fetchDockDeclarations as We, SHORT_CHAT as Ye, Icon as G, RowList as Je, MarkHost as Ze, MessageCard as et, RunningCommand as tt, DockStack as at, dockOpening as lt } from "@journal/window-kit";
const xe = (O, w) => {
  const b = O.__vccOpts || O;
  for (const [T, k] of w)
    b[T] = k;
  return b;
}, ot = {
  key: 0,
  class: "dump-files"
}, nt = { class: "dump-row" }, st = {
  key: 1,
  class: "dump-failure"
}, rt = 60, ut = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(O, { emit: w }) {
    const b = w, T = O, k = o(""), _ = o([]), c = o(""), I = () => [...k.value.split(/\n\s*\n/).map((d) => d.trim()).filter(Boolean), ..._.value.map((d) => `${d.name}: ${d.text.trim()}`)], X = () => (I()[0] ?? "").replace(/\s+/g, " ").slice(0, rt);
    async function Q(d) {
      var v;
      const u = [...((v = d.dataTransfer) == null ? void 0 : v.files) ?? []];
      _.value = [..._.value, ...await Promise.all(u.map(async (j) => ({ name: j.name, text: await j.text() })))];
    }
    async function K() {
      const d = await T.run(["dump", "make", X(), "--parts", I().join(" | ")]);
      c.value = d.ok ? "" : d.error, d.ok && (k.value = "", _.value = [], b("made"));
    }
    return (d, u) => (s(), f("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: F(K, ["prevent"]),
      onDragover: u[2] || (u[2] = F(() => {
      }, ["prevent"])),
      onDrop: F(Q, ["prevent"])
    }, [
      ue(l("textarea", {
        "onUpdate:modelValue": u[0] || (u[0] = (v) => k.value = v),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [Te, k.value]
      ]),
      _.value.length ? (s(), f("p", ot, y(_.value.map((v) => v.name).join(", ")), 1)) : C("", !0),
      l("div", nt, [
        h(n(B), {
          kind: "primary",
          small: "",
          disabled: !I().length,
          "data-dump-make": "",
          onClick: K
        }, {
          default: D(() => [...u[3] || (u[3] = [
            R("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(n(B), {
          small: "",
          onClick: u[1] || (u[1] = (v) => b("close"))
        }, {
          default: D(() => [...u[4] || (u[4] = [
            R("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      c.value ? (s(), f("p", st, y(c.value), 1)) : C("", !0)
    ], 32));
  }
}, it = /* @__PURE__ */ xe(ut, [["__scopeId", "data-v-d2c5a833"]]), ct = {
  "data-notices": "",
  class: "notices"
}, dt = { class: "notice-text" }, vt = ["href", "target"], pt = ["onClick"], mt = { class: "jump-holder" }, ft = ["title"], gt = { class: "running-strip" }, kt = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, ht = { class: "composer-quote-text" }, yt = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, wt = ["title"], _t = {
  key: 0,
  class: "attached-wait"
}, Ct = ["onClick"], bt = { class: "composer-row" }, Tt = {
  key: 2,
  class: "composer-failure"
}, xt = 180, Dt = 2e3, St = 40, $t = {
  __name: "Chat",
  setup(O) {
    const { rows: w, failure: b, loaded: T, load: k, older: _, context: c } = z("message list", ["message.*"], { incremental: !0 }), { rows: I, older: X } = z("chat-mark list", ["chat_mark.*"], { incremental: !0 }), { rows: Q } = z("dock-item list", ["dock_item.*"]), { rows: K, act: d } = z("notice list", ["notice.*"]), u = P(() => ze(I.value, Ge, (e) => c.option(e).value)), v = o([]), j = P(() => v.value.filter((e) => !w.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - Dt))), ie = P(() => Xe([...w.value, ...j.value], u.value)), W = o("");
    async function ce() {
      const e = await c.read("usage tool");
      W.value = e.ok ? e.value.tool : "";
    }
    c.follow(["hook_call.*"], ce), ce();
    const Y = o(null), J = o(!0), de = o(!1);
    let ve = 0, A = !0, Z = 0, H = null;
    Ue(() => {
      N(), Promise.all([Qe(), We()]), Y.value && typeof ResizeObserver < "u" && (H = new ResizeObserver(([e]) => de.value = e.contentRect.height < Ye), H.observe(Y.value));
    }), _e(() => {
      H == null || H.disconnect(), clearTimeout(Z);
    });
    const p = o(""), S = o(""), i = o(null), pe = o(!0), me = o(!1), $ = o(0), E = o(!1), r = o([]), fe = o(null), ge = o(null), N = () => ne(() => {
      var e;
      return (e = ge.value) == null ? void 0 : e.focus();
    }), U = o(!1);
    async function ee(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        r.value = [...r.value, a];
        const m = await c.upload(t);
        a.pending = m.ok ? m.value : "", a.failure = m.ok ? "" : m.error, r.value = [...r.value];
      }
      N();
    }
    const De = (e) => {
      ee([...e.target.files]), e.target.value = "";
    }, Se = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), ee(t));
    }, $e = (e) => {
      var t;
      U.value = !1, ee([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Ee = (e) => r.value = r.value.filter((t) => t !== e), te = P(() => (p.value.trim() || r.value.length) && r.value.every((e) => e.pending)), x = o(null), Me = P(() => {
      var e;
      return g.value ? `Editing message ${g.value.id}` : `Reply to: ${(e = x.value) == null ? void 0 : e.text}`;
    }), g = o(null);
    function Re(e) {
      g.value = null, x.value = e, N();
    }
    async function Fe(e) {
      const t = await c.run(["message", "delete", String(e.id)]);
      S.value = t.ok ? "" : t.error, k();
    }
    const ke = () => w.value.find((e) => e.type === "user" && !e.read_at);
    function Oe(e) {
      p.value || !ke() || (e.preventDefault(), g.value = ke(), x.value = null, p.value = g.value.text);
    }
    function V() {
      g.value && (g.value = null, p.value = "");
    }
    async function Ie() {
      const e = await c.run(["message", "edit", String(g.value.id), "--text", p.value]);
      S.value = e.ok ? "" : e.error, e.ok && V(), k();
    }
    async function ae() {
      if (g.value) return Ie();
      const e = { text: p.value, attached: r.value }, t = e.attached.flatMap((L) => ["--file", L.pending]), a = e.text || e.attached.map((L) => L.name).join(", "), m = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      v.value = [...v.value, m], p.value = "", r.value = [], S.value = "", N();
      const ye = x.value;
      x.value = null;
      const we = await c.run(ye && !t.length ? ["message", "reply", String(ye.id), a] : ["message", "send", a, ...t]);
      we.ok || (S.value = we.error, p.value = e.text, r.value = e.attached), v.value = v.value.filter((L) => L !== m), await k();
    }
    const Ae = (e) => !e.shiftKey && !e.isComposing && (e.preventDefault(), te.value && ae()), He = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
    function he(e) {
      var t, a;
      e.key !== "/" || e.metaKey || e.ctrlKey || He.has((t = e.target) == null ? void 0 : t.tagName) || (a = e.target) != null && a.isContentEditable || (e.preventDefault(), N());
    }
    window.addEventListener("keydown", he), _e(() => window.removeEventListener("keydown", he));
    const le = `journal.draft.${c.environment}`;
    function Ne() {
      try {
        return localStorage.getItem(le) ?? "";
      } catch {
        return "";
      }
    }
    function Le(e) {
      try {
        e ? localStorage.setItem(le, e) : localStorage.removeItem(le);
      } catch {
        return;
      }
    }
    p.value = Ne(), se(p, (e) => !g.value && Le(e));
    let oe = !1;
    async function Pe() {
      if (oe || !T.value) return;
      oe = !0;
      const e = i.value.scrollHeight, [t, a] = await Promise.all([_(), X()]);
      (t || a) && (await ne(), i.value.scrollTop += i.value.scrollHeight - e), oe = !1;
    }
    function Be() {
      if (pe.value = !i.value || i.value.scrollTop < 8, pe.value && i.value && Pe(), !i.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = i.value;
      A = t - e - a < St, me.value = !A, A && ($.value = 0);
      const m = lt({ top: e, before: ve, height: t, shown: a });
      ve = e, m !== null && (clearTimeout(Z), m ? J.value = !0 : Z = setTimeout(() => J.value = !1, xt));
    }
    se(() => {
      var e;
      return (e = w.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !A && ($.value += 1);
    }), se([ie, T], async () => {
      await ne(), A && i.value && (i.value.scrollTop = i.value.scrollHeight);
    });
    const Ke = () => {
      var e;
      return (e = i.value) == null ? void 0 : e.scrollTo({ top: i.value.scrollHeight, behavior: "smooth" });
    }, je = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (s(), f("div", {
      ref_key: "chat",
      ref: Y,
      class: "chat"
    }, [
      l("div", ct, [
        (s(!0), f(Ce, null, be(n(K), (a) => (s(), f("div", {
          key: a.id,
          class: "notice"
        }, [
          t[9] || (t[9] = l("span", { class: "notice-dot" }, null, -1)),
          l("span", dt, y(a.title), 1),
          l("a", {
            class: "notice-link",
            href: je(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, y(a.label), 9, vt),
          l("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (m) => n(d)(["notice", "close", String(a.id)])
          }, [
            h(n(G), {
              name: "close",
              size: 12
            })
          ], 8, pt)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: i,
        class: "history",
        onScroll: Be
      }, [
        h(n(Je), {
          rows: ie.value,
          failure: n(b),
          loaded: n(T),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: D(({ row: a }) => [
            a.kind === "mark" ? (s(), M(n(Ze), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (s(), M(n(et), {
              key: 1,
              message: a.row,
              onReply: Re,
              onDelete: Fe
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      l("div", mt, [
        h(Ve, { name: "rise" }, {
          default: D(() => [
            ue(l("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: $.value ? `${$.value} arrived while you were reading` : "Back to the newest",
              onClick: Ke
            }, [
              h(n(G), { name: "down" }),
              R(" " + y($.value ? `${$.value} new` : "Newest"), 1)
            ], 8, ft), [
              [qe, me.value]
            ])
          ]),
          _: 1
        })
      ]),
      l("p", gt, [
        l("span", {
          class: re(["running-dot", { idle: !W.value }])
        }, null, 2),
        h(n(tt), {
          text: W.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      h(n(at), {
        items: n(Q),
        folded: de.value || !J.value
      }, null, 8, ["items", "folded"]),
      E.value ? (s(), M(it, {
        key: 0,
        run: n(c).run,
        onMade: t[0] || (t[0] = (a) => E.value = !1),
        onClose: t[1] || (t[1] = (a) => E.value = !1)
      }, null, 8, ["run"])) : C("", !0),
      x.value || g.value ? (s(), f("p", kt, [
        l("span", ht, y(Me.value), 1),
        l("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (x.value = null, V()))
        }, "×")
      ])) : C("", !0),
      l("form", {
        class: re(["composer", { dragging: U.value }]),
        onSubmit: F(ae, ["prevent"]),
        onDragover: t[7] || (t[7] = F((a) => U.value = !0, ["prevent"])),
        onDragleave: t[8] || (t[8] = (a) => U.value = !1),
        onDrop: F($e, ["prevent"])
      }, [
        r.value.length ? (s(), f("ul", yt, [
          (s(!0), f(Ce, null, be(r.value, (a) => (s(), f("li", {
            key: a.name + a.pending,
            class: re(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            l("span", null, y(a.name), 1),
            !a.pending && !a.failure ? (s(), f("span", _t, "sending")) : C("", !0),
            l("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (m) => Ee(a)
            }, [
              h(n(G), {
                name: "close",
                size: 10
              })
            ], 8, Ct)
          ], 10, wt))), 128))
        ])) : C("", !0),
        ue(l("textarea", {
          ref_key: "composerInput",
          ref: ge,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => p.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            q(Ae, ["enter"]),
            q(Oe, ["up"]),
            q(V, ["down"]),
            q(V, ["esc"])
          ],
          onPaste: Se
        }, null, 544), [
          [Te, p.value]
        ]),
        l("div", bt, [
          l("input", {
            ref_key: "picker",
            ref: fe,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: De
          }, null, 544),
          l("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: t[4] || (t[4] = (a) => fe.value.click())
          }, [
            h(n(G), {
              name: "clip",
              size: 16
            })
          ]),
          te.value ? (s(), M(n(B), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: ae
          }, {
            default: D(() => [...t[10] || (t[10] = [
              R("Send", -1)
            ])]),
            _: 1
          })) : (s(), M(n(B), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => E.value = !E.value)
          }, {
            default: D(() => [...t[11] || (t[11] = [
              R("Dump files", -1)
            ])]),
            _: 1
          })),
          te.value && r.value.length > 1 ? (s(), M(n(B), {
            key: 2,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-offer": "",
            onClick: t[6] || (t[6] = (a) => E.value = !0)
          }, {
            default: D(() => [
              R("Dump " + y(r.value.length) + " files", 1)
            ]),
            _: 1
          })) : C("", !0)
        ])
      ], 34),
      S.value ? (s(), f("p", Tt, y(S.value), 1)) : C("", !0)
    ], 512));
  }
}, Rt = /* @__PURE__ */ xe($t, [["__scopeId", "data-v-eae961d3"]]);
export {
  Rt as default
};
