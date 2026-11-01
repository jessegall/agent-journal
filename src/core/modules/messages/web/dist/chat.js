/* @code-commandments-generated */
if (!document.getElementById("window-styles-2f32030a1854")) { const style = document.createElement("style"); style.id = "window-styles-2f32030a1854"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-4d553cde]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-4d553cde]{flex:1;min-height:0;overflow-y:auto}.history[data-v-4d553cde] .row-list-row{padding:1px 8px}.history[data-v-4d553cde] .mark.w-event{color:var(--text-3)}.notices[data-v-4d553cde]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-4d553cde]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-4d553cde]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-4d553cde]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-4d553cde]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-4d553cde]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-4d553cde]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-4d553cde]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-4d553cde]{background:var(--text-4)}.chat-day[data-v-4d553cde]{margin:0;padding:4px 0;color:var(--text-4);font-size:10.5px;text-align:center}.jump-holder[data-v-4d553cde]{position:relative;flex:none;height:0}.jump[data-v-4d553cde]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-4d553cde]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-4d553cde]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-4d553cde]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-4d553cde],.rise-leave-to[data-v-4d553cde]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-4d553cde]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-4d553cde]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-4d553cde]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-4d553cde]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-4d553cde]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-4d553cde]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-4d553cde]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-4d553cde]{border-color:var(--accent)}.attached[data-v-4d553cde]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-4d553cde]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-4d553cde]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-4d553cde]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-4d553cde]{color:var(--text-3)}.composer-send[data-v-4d553cde]{margin-left:auto}.composer-failure[data-v-4d553cde]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as s, createElementBlock as p, withModifiers as F, withDirectives as ce, createElementVNode as n, vModelText as $e, toDisplayString as y, createCommentVNode as _, createVNode as k, unref as l, withCtx as E, createTextVNode as O, computed as q, onMounted as Ze, onUnmounted as re, nextTick as ue, watch as z, Fragment as De, renderList as Se, createBlock as $, Transition as et, vShow as tt, normalizeClass as ie, withKeys as W } from "vue";
import { Btn as B, useRows as G, shownMarks as at, markDeclaration as lt, withDayLines as ot, interleaved as nt, usePins as st, fetchMarkDeclarations as rt, fetchDockDeclarations as ut, SHORT_CHAT as it, arrivalQueue as ct, Icon as Q, PinsToggle as dt, Skeleton as vt, RowList as pt, MarkHost as mt, MessageCard as ft, RunningCommand as gt, DockStack as kt, dockOpening as ht, depart as yt, arriveAtOnce as wt } from "@journal/window-kit";
const Ee = (L, w) => {
  const C = L.__vccOpts || L;
  for (const [b, h] of w)
    C[b] = h;
  return C;
}, _t = {
  key: 0,
  class: "dump-files"
}, bt = { class: "dump-row" }, Tt = {
  key: 1,
  class: "dump-failure"
}, Ct = 60, xt = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(L, { emit: w }) {
    const C = w, b = L, h = o(""), T = o([]), i = o(""), I = () => [...h.value.split(/\n\s*\n/).map((d) => d.trim()).filter(Boolean), ...T.value.map((d) => `${d.name}: ${d.text.trim()}`)], X = () => (I()[0] ?? "").replace(/\s+/g, " ").slice(0, Ct);
    async function Y(d) {
      var v;
      const c = [...((v = d.dataTransfer) == null ? void 0 : v.files) ?? []];
      T.value = [...T.value, ...await Promise.all(c.map(async (K) => ({ name: K.name, text: await K.text() })))];
    }
    async function A() {
      const d = await b.run(["dump", "make", X(), "--parts", I().join(" | ")]);
      i.value = d.ok ? "" : d.error, d.ok && (h.value = "", T.value = [], C("made"));
    }
    return (d, c) => (s(), p("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: F(A, ["prevent"]),
      onDragover: c[2] || (c[2] = F(() => {
      }, ["prevent"])),
      onDrop: F(Y, ["prevent"])
    }, [
      ce(n("textarea", {
        "onUpdate:modelValue": c[0] || (c[0] = (v) => h.value = v),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [$e, h.value]
      ]),
      T.value.length ? (s(), p("p", _t, y(T.value.map((v) => v.name).join(", ")), 1)) : _("", !0),
      n("div", bt, [
        k(l(B), {
          kind: "primary",
          small: "",
          disabled: !I().length,
          "data-dump-make": "",
          onClick: A
        }, {
          default: E(() => [...c[3] || (c[3] = [
            O("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(l(B), {
          small: "",
          onClick: c[1] || (c[1] = (v) => C("close"))
        }, {
          default: E(() => [...c[4] || (c[4] = [
            O("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      i.value ? (s(), p("p", Tt, y(i.value), 1)) : _("", !0)
    ], 32));
  }
}, Dt = /* @__PURE__ */ Ee(xt, [["__scopeId", "data-v-d2c5a833"]]), St = {
  "data-notices": "",
  class: "notices"
}, $t = { class: "notice-text" }, Et = ["href", "target"], Mt = ["onClick"], Rt = {
  key: 0,
  class: "chat-day",
  "data-day-line": ""
}, Ot = { class: "jump-holder" }, Ft = ["title"], Lt = { class: "running-strip" }, It = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, At = { class: "composer-quote-text" }, Ht = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, Pt = ["title"], Nt = {
  key: 0,
  class: "attached-wait"
}, qt = ["onClick"], Bt = { class: "composer-row" }, Kt = {
  key: 2,
  class: "composer-failure"
}, jt = 180, Ut = 2e3, Vt = 40, zt = 1500, Wt = {
  __name: "Chat",
  setup(L) {
    const { rows: w, failure: C, loaded: b, load: h, older: T, context: i } = G("message feed", ["message.*"], { incremental: !0 }), { rows: I, older: X } = G("chat-mark main", ["chat_mark.*"], { incremental: !0 }), { rows: Y } = G("dock-item list", ["dock_item.*"]), { rows: A, act: d } = G("notice list", ["notice.*"]), c = q(() => at(I.value, lt, (e) => i.option(e).value)), v = o([]), K = q(() => v.value.filter((e) => !w.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - Ut))), J = q(() => ot(nt([...w.value, ...K.value], c.value))), { visible: Me } = st(() => A.value), Re = (e) => {
      var t;
      return ((t = w.value.find((a) => a.id === e.parent_id)) == null ? void 0 : t.text) ?? "";
    }, Z = o("");
    async function de() {
      const e = await i.read("usage tool");
      Z.value = e.ok ? e.value.tool : "";
    }
    i.follow(["hook_call.*"], de), de();
    const ee = o(null), te = o(!0), ve = o(!1);
    let pe = 0, x = !0, ae = 0, H = null;
    Ze(() => {
      P(), Promise.all([rt(), ut()]), ee.value && typeof ResizeObserver < "u" && (H = new ResizeObserver(([e]) => ve.value = e.contentRect.height < it), H.observe(ee.value));
    }), re(() => {
      H == null || H.disconnect(), clearTimeout(ae);
    });
    const m = o(""), D = o(""), r = o(null), me = o(!0), fe = o(!1), M = o(0), R = o(!1), u = o([]), ge = o(null), ke = o(null), P = () => ue(() => {
      var e;
      return (e = ke.value) == null ? void 0 : e.focus();
    }), j = o(!1);
    async function le(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        u.value = [...u.value, a];
        const f = await i.upload(t);
        a.pending = f.ok ? f.value : "", a.failure = f.ok ? "" : f.error, u.value = [...u.value];
      }
      P();
    }
    const Oe = (e) => {
      le([...e.target.files]), e.target.value = "";
    }, Fe = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), le(t));
    }, Le = (e) => {
      var t;
      j.value = !1, le([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Ie = (e) => u.value = u.value.filter((t) => t !== e), oe = q(() => (m.value.trim() || u.value.length) && u.value.every((e) => e.pending)), S = o(null), Ae = q(() => {
      var e;
      return g.value ? `Editing message ${g.value.id}` : `Reply to: ${(e = S.value) == null ? void 0 : e.text}`;
    }), g = o(null);
    function He(e) {
      g.value = null, S.value = e, P();
    }
    async function Pe(e, t) {
      const a = await i.run(["message", "react", String(e.id), t]);
      D.value = a.ok ? "" : a.error;
    }
    async function Ne(e) {
      const t = await i.run(["message", "delete", String(e.id)]);
      D.value = t.ok ? "" : t.error, h();
    }
    const he = () => w.value.find((e) => e.type === "user" && !e.read_at);
    function qe(e) {
      m.value || !he() || (e.preventDefault(), g.value = he(), S.value = null, m.value = g.value.text);
    }
    function U() {
      g.value && (g.value = null, m.value = "");
    }
    async function Be() {
      const e = await i.run(["message", "edit", String(g.value.id), "--text", m.value]);
      D.value = e.ok ? "" : e.error, e.ok && U(), h();
    }
    async function ne() {
      if (g.value) return Be();
      const e = { text: m.value, attached: u.value }, t = e.attached.flatMap((N) => ["--file", N.pending]), a = e.text || e.attached.map((N) => N.name).join(", "), f = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      v.value = [...v.value, f], m.value = "", u.value = [], D.value = "", P();
      const Ce = S.value;
      S.value = null;
      const xe = await i.run(Ce && !t.length ? ["message", "reply", String(Ce.id), a] : ["message", "send", a, ...t]);
      xe.ok || (D.value = xe.error, m.value = e.text, u.value = e.attached), v.value = v.value.filter((N) => N !== f), await h();
    }
    const Ke = (e) => !e.shiftKey && !e.isComposing && (e.preventDefault(), oe.value && ne()), je = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
    function ye(e) {
      var t, a;
      e.key !== "/" || e.metaKey || e.ctrlKey || je.has((t = e.target) == null ? void 0 : t.tagName) || (a = e.target) != null && a.isContentEditable || (e.preventDefault(), P());
    }
    window.addEventListener("keydown", ye), re(() => window.removeEventListener("keydown", ye));
    const se = `journal.draft.${i.environment}`;
    function Ue() {
      try {
        return localStorage.getItem(se) ?? "";
      } catch {
        return "";
      }
    }
    function Ve(e) {
      try {
        e ? localStorage.setItem(se, e) : localStorage.removeItem(se);
      } catch {
        return;
      }
    }
    m.value = Ue(), z(m, (e) => !g.value && Ve(e));
    const V = o(!1);
    async function ze() {
      if (V.value || !b.value) return;
      V.value = !0;
      const e = r.value.scrollHeight, [t, a] = await Promise.all([T(), X()]);
      (t || a) && (await ue(), r.value.scrollTop += r.value.scrollHeight - e), V.value = !1;
    }
    function We() {
      if (me.value = !r.value || r.value.scrollTop < 8, me.value && r.value && ze(), !r.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = r.value;
      x = t - e - a < Vt, fe.value = !x, x && (M.value = 0);
      const f = ht({ top: e, before: pe, height: t, shown: a });
      pe = e, f !== null && (clearTimeout(ae), f ? te.value = !0 : ae = setTimeout(() => te.value = !1, jt));
    }
    z(() => {
      var e;
      return (e = w.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !x && (M.value += 1);
    }), z([J, b], async () => {
      await ue(), x && r.value && (r.value.scrollTop = r.value.scrollHeight);
    });
    let we = !1;
    z(b, () => setTimeout(() => we = !0, zt));
    const _e = ct(), be = () => ({ pane: r.value, follows: () => we && x && !document.hidden }), Ge = (e) => {
      var t;
      return (t = J.value.find((a) => a.id === e.dataset.row)) == null ? void 0 : t.row;
    }, Qe = (e) => !!(e != null && e.local), Xe = {
      enter: (e, t) => {
        const a = Ge(e);
        return Qe(a) ? wt(e, be(), t) : (a == null ? void 0 : a.type) === "user" ? t() : _e(e, be(), t);
      },
      leave: (e, t) => !x || !e.querySelector("[data-message]") || e.dataset.row.startsWith("message:sending-") ? t() : yt(e, t)
    }, Te = () => document.hidden && _e.flush();
    document.addEventListener("visibilitychange", Te), re(() => document.removeEventListener("visibilitychange", Te));
    const Ye = () => {
      var e;
      return (e = r.value) == null ? void 0 : e.scrollTo({ top: r.value.scrollHeight, behavior: "smooth" });
    }, Je = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (s(), p("div", {
      ref_key: "chat",
      ref: ee,
      class: "chat"
    }, [
      n("div", St, [
        (s(!0), p(De, null, Se(l(Me), (a) => (s(), p("div", {
          key: a.id,
          class: "notice"
        }, [
          t[9] || (t[9] = n("span", { class: "notice-dot" }, null, -1)),
          n("span", $t, y(a.title), 1),
          n("a", {
            class: "notice-link",
            href: Je(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, y(a.label), 9, Et),
          n("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (f) => l(d)(["notice", "close", String(a.id)])
          }, [
            k(l(Q), {
              name: "close",
              size: 12
            })
          ], 8, Mt)
        ]))), 128)),
        k(l(dt), { notices: l(A) }, null, 8, ["notices"])
      ]),
      n("div", {
        ref_key: "scroller",
        ref: r,
        class: "history",
        onScroll: We
      }, [
        V.value ? (s(), $(l(vt), {
          key: 0,
          shape: "older",
          label: "Loading older messages"
        })) : _("", !0),
        k(l(pt), {
          rows: J.value,
          failure: l(C),
          loaded: l(b),
          arrival: Xe,
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: E(({ row: a }) => [
            a.kind === "day" ? (s(), p("p", Rt, y(a.title), 1)) : a.kind === "mark" ? (s(), $(l(mt), {
              key: 1,
              mark: a.row
            }, null, 8, ["mark"])) : (s(), $(l(ft), {
              key: 2,
              message: a.row,
              quote: Re(a.row),
              onReply: He,
              onDelete: Ne,
              onReact: Pe
            }, null, 8, ["message", "quote"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      n("div", Ot, [
        k(et, { name: "rise" }, {
          default: E(() => [
            ce(n("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: M.value ? `${M.value} arrived while you were reading` : "Back to the newest",
              onClick: Ye
            }, [
              k(l(Q), { name: "down" }),
              O(" " + y(M.value ? `${M.value} new` : "Newest"), 1)
            ], 8, Ft), [
              [tt, fe.value]
            ])
          ]),
          _: 1
        })
      ]),
      n("p", Lt, [
        n("span", {
          class: ie(["running-dot", { idle: !Z.value }])
        }, null, 2),
        k(l(gt), {
          text: Z.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      k(l(kt), {
        items: l(Y),
        folded: ve.value || !te.value
      }, null, 8, ["items", "folded"]),
      R.value ? (s(), $(Dt, {
        key: 0,
        run: l(i).run,
        onMade: t[0] || (t[0] = (a) => R.value = !1),
        onClose: t[1] || (t[1] = (a) => R.value = !1)
      }, null, 8, ["run"])) : _("", !0),
      S.value || g.value ? (s(), p("p", It, [
        n("span", At, y(Ae.value), 1),
        n("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (S.value = null, U()))
        }, "×")
      ])) : _("", !0),
      n("form", {
        class: ie(["composer", { dragging: j.value }]),
        onSubmit: F(ne, ["prevent"]),
        onDragover: t[7] || (t[7] = F((a) => j.value = !0, ["prevent"])),
        onDragleave: t[8] || (t[8] = (a) => j.value = !1),
        onDrop: F(Le, ["prevent"])
      }, [
        u.value.length ? (s(), p("ul", Ht, [
          (s(!0), p(De, null, Se(u.value, (a) => (s(), p("li", {
            key: a.name + a.pending,
            class: ie(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            n("span", null, y(a.name), 1),
            !a.pending && !a.failure ? (s(), p("span", Nt, "sending")) : _("", !0),
            n("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (f) => Ie(a)
            }, [
              k(l(Q), {
                name: "close",
                size: 10
              })
            ], 8, qt)
          ], 10, Pt))), 128))
        ])) : _("", !0),
        ce(n("textarea", {
          ref_key: "composerInput",
          ref: ke,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => m.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            W(Ke, ["enter"]),
            W(qe, ["up"]),
            W(U, ["down"]),
            W(U, ["esc"])
          ],
          onPaste: Fe
        }, null, 544), [
          [$e, m.value]
        ]),
        n("div", Bt, [
          n("input", {
            ref_key: "picker",
            ref: ge,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: Oe
          }, null, 544),
          n("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: t[4] || (t[4] = (a) => ge.value.click())
          }, [
            k(l(Q), {
              name: "clip",
              size: 16
            })
          ]),
          oe.value ? (s(), $(l(B), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: ne
          }, {
            default: E(() => [...t[10] || (t[10] = [
              O("Send", -1)
            ])]),
            _: 1
          })) : (s(), $(l(B), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => R.value = !R.value)
          }, {
            default: E(() => [...t[11] || (t[11] = [
              O("Dump files", -1)
            ])]),
            _: 1
          })),
          oe.value && u.value.length > 1 ? (s(), $(l(B), {
            key: 2,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-offer": "",
            onClick: t[6] || (t[6] = (a) => R.value = !0)
          }, {
            default: E(() => [
              O("Dump " + y(u.value.length) + " files", 1)
            ]),
            _: 1
          })) : _("", !0)
        ])
      ], 34),
      D.value ? (s(), p("p", Kt, y(D.value), 1)) : _("", !0)
    ], 512));
  }
}, Xt = /* @__PURE__ */ Ee(Wt, [["__scopeId", "data-v-4d553cde"]]);
export {
  Xt as default
};
