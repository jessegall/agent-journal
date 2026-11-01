/* @code-commandments-generated */
if (!document.getElementById("window-styles-810b7fdc62c2")) { const style = document.createElement("style"); style.id = "window-styles-810b7fdc62c2"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-71c0e9bf]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-71c0e9bf]{flex:1;min-height:0;overflow-y:auto}.history[data-v-71c0e9bf] .row-list-row{padding:1px 8px}.history[data-v-71c0e9bf] .mark.w-event{color:var(--text-3)}.notices[data-v-71c0e9bf]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-71c0e9bf]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-71c0e9bf]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-71c0e9bf]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-71c0e9bf]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-71c0e9bf]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-71c0e9bf]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-71c0e9bf]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-71c0e9bf]{background:var(--text-4)}.chat-day[data-v-71c0e9bf]{margin:0;padding:4px 0;color:var(--text-4);font-size:10.5px;text-align:center}.jump-holder[data-v-71c0e9bf]{position:relative;flex:none;height:0}.jump[data-v-71c0e9bf]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-71c0e9bf]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-71c0e9bf]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-71c0e9bf]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-71c0e9bf],.rise-leave-to[data-v-71c0e9bf]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-71c0e9bf]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-71c0e9bf]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-71c0e9bf]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-71c0e9bf]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-71c0e9bf]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-71c0e9bf]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-71c0e9bf]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-71c0e9bf]{border-color:var(--accent)}.attached[data-v-71c0e9bf]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-71c0e9bf]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-71c0e9bf]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-71c0e9bf]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-71c0e9bf]{color:var(--text-3)}.composer-send[data-v-71c0e9bf]{margin-left:auto}.composer-failure[data-v-71c0e9bf]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as s, createElementBlock as p, withModifiers as F, withDirectives as ce, createElementVNode as n, vModelText as $e, toDisplayString as y, createCommentVNode as w, createVNode as k, unref as l, withCtx as $, createTextVNode as R, computed as q, onMounted as Je, onUnmounted as re, nextTick as ue, watch as z, Fragment as De, renderList as Se, createBlock as S, Transition as Ze, vShow as et, normalizeClass as ie, withKeys as W } from "vue";
import { Btn as B, useRows as G, shownMarks as tt, markDeclaration as at, withDayLines as lt, interleaved as ot, usePins as nt, fetchMarkDeclarations as st, fetchDockDeclarations as rt, SHORT_CHAT as ut, arrivalQueue as it, Icon as Q, PinsToggle as ct, Skeleton as dt, RowList as vt, MarkHost as pt, MessageCard as mt, RunningCommand as ft, DockStack as gt, dockOpening as kt, depart as ht, arriveAtOnce as yt } from "@journal/window-kit";
const Ee = (L, _) => {
  const C = L.__vccOpts || L;
  for (const [b, h] of _)
    C[b] = h;
  return C;
}, _t = {
  key: 0,
  class: "dump-files"
}, wt = { class: "dump-row" }, bt = {
  key: 1,
  class: "dump-failure"
}, Tt = 60, Ct = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(L, { emit: _ }) {
    const C = _, b = L, h = o(""), T = o([]), c = o(""), I = () => [...h.value.split(/\n\s*\n/).map((d) => d.trim()).filter(Boolean), ...T.value.map((d) => `${d.name}: ${d.text.trim()}`)], X = () => (I()[0] ?? "").replace(/\s+/g, " ").slice(0, Tt);
    async function Y(d) {
      var v;
      const i = [...((v = d.dataTransfer) == null ? void 0 : v.files) ?? []];
      T.value = [...T.value, ...await Promise.all(i.map(async (K) => ({ name: K.name, text: await K.text() })))];
    }
    async function A() {
      const d = await b.run(["dump", "make", X(), "--parts", I().join(" | ")]);
      c.value = d.ok ? "" : d.error, d.ok && (h.value = "", T.value = [], C("made"));
    }
    return (d, i) => (s(), p("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: F(A, ["prevent"]),
      onDragover: i[2] || (i[2] = F(() => {
      }, ["prevent"])),
      onDrop: F(Y, ["prevent"])
    }, [
      ce(n("textarea", {
        "onUpdate:modelValue": i[0] || (i[0] = (v) => h.value = v),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [$e, h.value]
      ]),
      T.value.length ? (s(), p("p", _t, y(T.value.map((v) => v.name).join(", ")), 1)) : w("", !0),
      n("div", wt, [
        k(l(B), {
          kind: "primary",
          small: "",
          disabled: !I().length,
          "data-dump-make": "",
          onClick: A
        }, {
          default: $(() => [...i[3] || (i[3] = [
            R("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(l(B), {
          small: "",
          onClick: i[1] || (i[1] = (v) => C("close"))
        }, {
          default: $(() => [...i[4] || (i[4] = [
            R("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      c.value ? (s(), p("p", bt, y(c.value), 1)) : w("", !0)
    ], 32));
  }
}, xt = /* @__PURE__ */ Ee(Ct, [["__scopeId", "data-v-d2c5a833"]]), Dt = {
  "data-notices": "",
  class: "notices"
}, St = { class: "notice-text" }, $t = ["href", "target"], Et = ["onClick"], Mt = {
  key: 0,
  class: "chat-day",
  "data-day-line": ""
}, Ot = { class: "jump-holder" }, Rt = ["title"], Ft = { class: "running-strip" }, Lt = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, It = { class: "composer-quote-text" }, At = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, Ht = ["title"], Pt = {
  key: 0,
  class: "attached-wait"
}, Nt = ["onClick"], qt = { class: "composer-row" }, Bt = {
  key: 2,
  class: "composer-failure"
}, Kt = 180, jt = 2e3, Ut = 40, Vt = 1500, zt = {
  __name: "Chat",
  setup(L) {
    const { rows: _, failure: C, loaded: b, load: h, older: T, context: c } = G("message feed", ["message.*"], { incremental: !0 }), { rows: I, older: X } = G("chat-mark main", ["chat_mark.*"], { incremental: !0 }), { rows: Y } = G("dock-item list", ["dock_item.*"]), { rows: A, act: d } = G("notice list", ["notice.*"]), i = q(() => tt(I.value, at, (e) => c.option(e).value)), v = o([]), K = q(() => v.value.filter((e) => !_.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - jt))), J = q(() => lt(ot([..._.value, ...K.value], i.value))), { visible: Me } = nt(() => A.value), Oe = (e) => {
      var t;
      return ((t = _.value.find((a) => a.id === e.parent_id)) == null ? void 0 : t.text) ?? "";
    }, Z = o("");
    async function de() {
      const e = await c.read("usage tool");
      Z.value = e.ok ? e.value.tool : "";
    }
    c.follow(["hook_call.*"], de), de();
    const ee = o(null), te = o(!0), ve = o(!1);
    let pe = 0, x = !0, ae = 0, H = null;
    Je(() => {
      P(), Promise.all([st(), rt()]), ee.value && typeof ResizeObserver < "u" && (H = new ResizeObserver(([e]) => ve.value = e.contentRect.height < ut), H.observe(ee.value));
    }), re(() => {
      H == null || H.disconnect(), clearTimeout(ae);
    });
    const m = o(""), E = o(""), r = o(null), me = o(!0), fe = o(!1), M = o(0), O = o(!1), u = o([]), ge = o(null), ke = o(null), P = () => ue(() => {
      var e;
      return (e = ke.value) == null ? void 0 : e.focus();
    }), j = o(!1);
    async function le(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        u.value = [...u.value, a];
        const f = await c.upload(t);
        a.pending = f.ok ? f.value : "", a.failure = f.ok ? "" : f.error, u.value = [...u.value];
      }
      P();
    }
    const Re = (e) => {
      le([...e.target.files]), e.target.value = "";
    }, Fe = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), le(t));
    }, Le = (e) => {
      var t;
      j.value = !1, le([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Ie = (e) => u.value = u.value.filter((t) => t !== e), oe = q(() => (m.value.trim() || u.value.length) && u.value.every((e) => e.pending)), D = o(null), Ae = q(() => {
      var e;
      return g.value ? `Editing message ${g.value.id}` : `Reply to: ${(e = D.value) == null ? void 0 : e.text}`;
    }), g = o(null);
    function He(e) {
      g.value = null, D.value = e, P();
    }
    async function Pe(e) {
      const t = await c.run(["message", "delete", String(e.id)]);
      E.value = t.ok ? "" : t.error, h();
    }
    const he = () => _.value.find((e) => e.type === "user" && !e.read_at);
    function Ne(e) {
      m.value || !he() || (e.preventDefault(), g.value = he(), D.value = null, m.value = g.value.text);
    }
    function U() {
      g.value && (g.value = null, m.value = "");
    }
    async function qe() {
      const e = await c.run(["message", "edit", String(g.value.id), "--text", m.value]);
      E.value = e.ok ? "" : e.error, e.ok && U(), h();
    }
    async function ne() {
      if (g.value) return qe();
      const e = { text: m.value, attached: u.value }, t = e.attached.flatMap((N) => ["--file", N.pending]), a = e.text || e.attached.map((N) => N.name).join(", "), f = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      v.value = [...v.value, f], m.value = "", u.value = [], E.value = "", P();
      const Ce = D.value;
      D.value = null;
      const xe = await c.run(Ce && !t.length ? ["message", "reply", String(Ce.id), a] : ["message", "send", a, ...t]);
      xe.ok || (E.value = xe.error, m.value = e.text, u.value = e.attached), v.value = v.value.filter((N) => N !== f), await h();
    }
    const Be = (e) => !e.shiftKey && !e.isComposing && (e.preventDefault(), oe.value && ne()), Ke = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
    function ye(e) {
      var t, a;
      e.key !== "/" || e.metaKey || e.ctrlKey || Ke.has((t = e.target) == null ? void 0 : t.tagName) || (a = e.target) != null && a.isContentEditable || (e.preventDefault(), P());
    }
    window.addEventListener("keydown", ye), re(() => window.removeEventListener("keydown", ye));
    const se = `journal.draft.${c.environment}`;
    function je() {
      try {
        return localStorage.getItem(se) ?? "";
      } catch {
        return "";
      }
    }
    function Ue(e) {
      try {
        e ? localStorage.setItem(se, e) : localStorage.removeItem(se);
      } catch {
        return;
      }
    }
    m.value = je(), z(m, (e) => !g.value && Ue(e));
    const V = o(!1);
    async function Ve() {
      if (V.value || !b.value) return;
      V.value = !0;
      const e = r.value.scrollHeight, [t, a] = await Promise.all([T(), X()]);
      (t || a) && (await ue(), r.value.scrollTop += r.value.scrollHeight - e), V.value = !1;
    }
    function ze() {
      if (me.value = !r.value || r.value.scrollTop < 8, me.value && r.value && Ve(), !r.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = r.value;
      x = t - e - a < Ut, fe.value = !x, x && (M.value = 0);
      const f = kt({ top: e, before: pe, height: t, shown: a });
      pe = e, f !== null && (clearTimeout(ae), f ? te.value = !0 : ae = setTimeout(() => te.value = !1, Kt));
    }
    z(() => {
      var e;
      return (e = _.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !x && (M.value += 1);
    }), z([J, b], async () => {
      await ue(), x && r.value && (r.value.scrollTop = r.value.scrollHeight);
    });
    let _e = !1;
    z(b, () => setTimeout(() => _e = !0, Vt));
    const we = it(), be = () => ({ pane: r.value, follows: () => _e && x && !document.hidden }), We = (e) => {
      var t;
      return (t = J.value.find((a) => a.id === e.dataset.row)) == null ? void 0 : t.row;
    }, Ge = (e) => !!(e != null && e.local), Qe = {
      enter: (e, t) => {
        const a = We(e);
        return Ge(a) ? yt(e, be(), t) : (a == null ? void 0 : a.type) === "user" ? t() : we(e, be(), t);
      },
      leave: (e, t) => !x || !e.querySelector("[data-message]") || e.dataset.row.startsWith("message:sending-") ? t() : ht(e, t)
    }, Te = () => document.hidden && we.flush();
    document.addEventListener("visibilitychange", Te), re(() => document.removeEventListener("visibilitychange", Te));
    const Xe = () => {
      var e;
      return (e = r.value) == null ? void 0 : e.scrollTo({ top: r.value.scrollHeight, behavior: "smooth" });
    }, Ye = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (s(), p("div", {
      ref_key: "chat",
      ref: ee,
      class: "chat"
    }, [
      n("div", Dt, [
        (s(!0), p(De, null, Se(l(Me), (a) => (s(), p("div", {
          key: a.id,
          class: "notice"
        }, [
          t[9] || (t[9] = n("span", { class: "notice-dot" }, null, -1)),
          n("span", St, y(a.title), 1),
          n("a", {
            class: "notice-link",
            href: Ye(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, y(a.label), 9, $t),
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
          ], 8, Et)
        ]))), 128)),
        k(l(ct), { notices: l(A) }, null, 8, ["notices"])
      ]),
      n("div", {
        ref_key: "scroller",
        ref: r,
        class: "history",
        onScroll: ze
      }, [
        V.value ? (s(), S(l(dt), {
          key: 0,
          shape: "older",
          label: "Loading older messages"
        })) : w("", !0),
        k(l(vt), {
          rows: J.value,
          failure: l(C),
          loaded: l(b),
          arrival: Qe,
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: $(({ row: a }) => [
            a.kind === "day" ? (s(), p("p", Mt, y(a.title), 1)) : a.kind === "mark" ? (s(), S(l(pt), {
              key: 1,
              mark: a.row
            }, null, 8, ["mark"])) : (s(), S(l(mt), {
              key: 2,
              message: a.row,
              quote: Oe(a.row),
              onReply: He,
              onDelete: Pe
            }, null, 8, ["message", "quote"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      n("div", Ot, [
        k(Ze, { name: "rise" }, {
          default: $(() => [
            ce(n("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: M.value ? `${M.value} arrived while you were reading` : "Back to the newest",
              onClick: Xe
            }, [
              k(l(Q), { name: "down" }),
              R(" " + y(M.value ? `${M.value} new` : "Newest"), 1)
            ], 8, Rt), [
              [et, fe.value]
            ])
          ]),
          _: 1
        })
      ]),
      n("p", Ft, [
        n("span", {
          class: ie(["running-dot", { idle: !Z.value }])
        }, null, 2),
        k(l(ft), {
          text: Z.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      k(l(gt), {
        items: l(Y),
        folded: ve.value || !te.value
      }, null, 8, ["items", "folded"]),
      O.value ? (s(), S(xt, {
        key: 0,
        run: l(c).run,
        onMade: t[0] || (t[0] = (a) => O.value = !1),
        onClose: t[1] || (t[1] = (a) => O.value = !1)
      }, null, 8, ["run"])) : w("", !0),
      D.value || g.value ? (s(), p("p", Lt, [
        n("span", It, y(Ae.value), 1),
        n("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (D.value = null, U()))
        }, "×")
      ])) : w("", !0),
      n("form", {
        class: ie(["composer", { dragging: j.value }]),
        onSubmit: F(ne, ["prevent"]),
        onDragover: t[7] || (t[7] = F((a) => j.value = !0, ["prevent"])),
        onDragleave: t[8] || (t[8] = (a) => j.value = !1),
        onDrop: F(Le, ["prevent"])
      }, [
        u.value.length ? (s(), p("ul", At, [
          (s(!0), p(De, null, Se(u.value, (a) => (s(), p("li", {
            key: a.name + a.pending,
            class: ie(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            n("span", null, y(a.name), 1),
            !a.pending && !a.failure ? (s(), p("span", Pt, "sending")) : w("", !0),
            n("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (f) => Ie(a)
            }, [
              k(l(Q), {
                name: "close",
                size: 10
              })
            ], 8, Nt)
          ], 10, Ht))), 128))
        ])) : w("", !0),
        ce(n("textarea", {
          ref_key: "composerInput",
          ref: ke,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => m.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            W(Be, ["enter"]),
            W(Ne, ["up"]),
            W(U, ["down"]),
            W(U, ["esc"])
          ],
          onPaste: Fe
        }, null, 544), [
          [$e, m.value]
        ]),
        n("div", qt, [
          n("input", {
            ref_key: "picker",
            ref: ge,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: Re
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
          oe.value ? (s(), S(l(B), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: ne
          }, {
            default: $(() => [...t[10] || (t[10] = [
              R("Send", -1)
            ])]),
            _: 1
          })) : (s(), S(l(B), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => O.value = !O.value)
          }, {
            default: $(() => [...t[11] || (t[11] = [
              R("Dump files", -1)
            ])]),
            _: 1
          })),
          oe.value && u.value.length > 1 ? (s(), S(l(B), {
            key: 2,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-offer": "",
            onClick: t[6] || (t[6] = (a) => O.value = !0)
          }, {
            default: $(() => [
              R("Dump " + y(u.value.length) + " files", 1)
            ]),
            _: 1
          })) : w("", !0)
        ])
      ], 34),
      E.value ? (s(), p("p", Bt, y(E.value), 1)) : w("", !0)
    ], 512));
  }
}, Qt = /* @__PURE__ */ Ee(zt, [["__scopeId", "data-v-71c0e9bf"]]);
export {
  Qt as default
};
