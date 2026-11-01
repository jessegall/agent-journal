/* @code-commandments-generated */
if (!document.getElementById("window-styles-f46ed033d328")) { const style = document.createElement("style"); style.id = "window-styles-f46ed033d328"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-96697dd8]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-96697dd8]{flex:1;min-height:0;overflow-y:auto}.history[data-v-96697dd8] .row-list-row{padding:1px 8px}.history[data-v-96697dd8] .mark.w-event{color:var(--text-3)}.notices[data-v-96697dd8]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-96697dd8]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-96697dd8]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-96697dd8]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-96697dd8]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-96697dd8]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-96697dd8]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-96697dd8]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-96697dd8]{background:var(--text-4)}.chat-day[data-v-96697dd8]{margin:0;padding:4px 0;color:var(--text-4);font-size:10.5px;text-align:center}.jump-holder[data-v-96697dd8]{position:relative;flex:none;height:0}.jump[data-v-96697dd8]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-96697dd8]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-96697dd8]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-96697dd8]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-96697dd8],.rise-leave-to[data-v-96697dd8]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-96697dd8]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-96697dd8]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-96697dd8]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-96697dd8]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-96697dd8]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-96697dd8]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-96697dd8]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-96697dd8]{border-color:var(--accent)}.attached[data-v-96697dd8]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-96697dd8]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-96697dd8]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-96697dd8]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-96697dd8]{color:var(--text-3)}.composer-send[data-v-96697dd8]{margin-left:auto}.composer-failure[data-v-96697dd8]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as s, createElementBlock as p, withModifiers as F, withDirectives as ie, createElementVNode as n, vModelText as De, toDisplayString as y, createCommentVNode as w, createVNode as k, unref as l, withCtx as $, createTextVNode as R, computed as q, onMounted as Ye, onUnmounted as be, nextTick as re, watch as z, Fragment as Ce, renderList as xe, createBlock as S, Transition as Je, vShow as Ze, normalizeClass as ue, withKeys as G } from "vue";
import { Btn as B, useRows as Q, shownMarks as et, markDeclaration as tt, withDayLines as at, interleaved as lt, usePins as ot, fetchMarkDeclarations as nt, fetchDockDeclarations as st, SHORT_CHAT as rt, arrivalQueue as ut, Icon as X, PinsToggle as it, Skeleton as ct, RowList as dt, MarkHost as vt, MessageCard as pt, RunningCommand as mt, DockStack as ft, dockOpening as gt, depart as kt, arriveAtOnce as ht } from "@journal/window-kit";
const Se = (I, _) => {
  const C = I.__vccOpts || I;
  for (const [T, h] of _)
    C[T] = h;
  return C;
}, yt = {
  key: 0,
  class: "dump-files"
}, _t = { class: "dump-row" }, wt = {
  key: 1,
  class: "dump-failure"
}, Tt = 60, bt = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(I, { emit: _ }) {
    const C = _, T = I, h = o(""), b = o([]), c = o(""), A = () => [...h.value.split(/\n\s*\n/).map((d) => d.trim()).filter(Boolean), ...b.value.map((d) => `${d.name}: ${d.text.trim()}`)], W = () => (A()[0] ?? "").replace(/\s+/g, " ").slice(0, Tt);
    async function Y(d) {
      var v;
      const i = [...((v = d.dataTransfer) == null ? void 0 : v.files) ?? []];
      b.value = [...b.value, ...await Promise.all(i.map(async (K) => ({ name: K.name, text: await K.text() })))];
    }
    async function L() {
      const d = await T.run(["dump", "make", W(), "--parts", A().join(" | ")]);
      c.value = d.ok ? "" : d.error, d.ok && (h.value = "", b.value = [], C("made"));
    }
    return (d, i) => (s(), p("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: F(L, ["prevent"]),
      onDragover: i[2] || (i[2] = F(() => {
      }, ["prevent"])),
      onDrop: F(Y, ["prevent"])
    }, [
      ie(n("textarea", {
        "onUpdate:modelValue": i[0] || (i[0] = (v) => h.value = v),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [De, h.value]
      ]),
      b.value.length ? (s(), p("p", yt, y(b.value.map((v) => v.name).join(", ")), 1)) : w("", !0),
      n("div", _t, [
        k(l(B), {
          kind: "primary",
          small: "",
          disabled: !A().length,
          "data-dump-make": "",
          onClick: L
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
      c.value ? (s(), p("p", wt, y(c.value), 1)) : w("", !0)
    ], 32));
  }
}, Ct = /* @__PURE__ */ Se(bt, [["__scopeId", "data-v-d2c5a833"]]), xt = {
  "data-notices": "",
  class: "notices"
}, Dt = { class: "notice-text" }, St = ["href", "target"], $t = ["onClick"], Et = {
  key: 0,
  class: "chat-day",
  "data-day-line": ""
}, Mt = { class: "jump-holder" }, Ot = ["title"], Rt = { class: "running-strip" }, Ft = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, It = { class: "composer-quote-text" }, At = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, Lt = ["title"], Ht = {
  key: 0,
  class: "attached-wait"
}, Pt = ["onClick"], Nt = { class: "composer-row" }, qt = {
  key: 2,
  class: "composer-failure"
}, Bt = 180, Kt = 2e3, jt = 40, Ut = 1500, Vt = {
  __name: "Chat",
  setup(I) {
    const { rows: _, failure: C, loaded: T, load: h, older: b, context: c } = Q("message feed", ["message.*"], { incremental: !0 }), { rows: A, older: W } = Q("chat-mark main", ["chat_mark.*"], { incremental: !0 }), { rows: Y } = Q("dock-item list", ["dock_item.*"]), { rows: L, act: d } = Q("notice list", ["notice.*"]), i = q(() => et(A.value, tt, (e) => c.option(e).value)), v = o([]), K = q(() => v.value.filter((e) => !_.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - Kt))), J = q(() => at(lt([..._.value, ...K.value], i.value))), { visible: $e } = ot(() => L.value), Ee = (e) => {
      var t;
      return ((t = _.value.find((a) => a.id === e.parent_id)) == null ? void 0 : t.text) ?? "";
    }, Z = o("");
    async function ce() {
      const e = await c.read("usage tool");
      Z.value = e.ok ? e.value.tool : "";
    }
    c.follow(["hook_call.*"], ce), ce();
    const ee = o(null), te = o(!0), de = o(!1);
    let ve = 0, x = !0, ae = 0, H = null;
    Ye(() => {
      P(), Promise.all([nt(), st()]), ee.value && typeof ResizeObserver < "u" && (H = new ResizeObserver(([e]) => de.value = e.contentRect.height < rt), H.observe(ee.value));
    }), be(() => {
      H == null || H.disconnect(), clearTimeout(ae);
    });
    const m = o(""), E = o(""), r = o(null), pe = o(!0), me = o(!1), M = o(0), O = o(!1), u = o([]), fe = o(null), ge = o(null), P = () => re(() => {
      var e;
      return (e = ge.value) == null ? void 0 : e.focus();
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
    const Me = (e) => {
      le([...e.target.files]), e.target.value = "";
    }, Oe = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), le(t));
    }, Re = (e) => {
      var t;
      j.value = !1, le([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Fe = (e) => u.value = u.value.filter((t) => t !== e), oe = q(() => (m.value.trim() || u.value.length) && u.value.every((e) => e.pending)), D = o(null), Ie = q(() => {
      var e;
      return g.value ? `Editing message ${g.value.id}` : `Reply to: ${(e = D.value) == null ? void 0 : e.text}`;
    }), g = o(null);
    function Ae(e) {
      g.value = null, D.value = e, P();
    }
    async function Le(e) {
      const t = await c.run(["message", "delete", String(e.id)]);
      E.value = t.ok ? "" : t.error, h();
    }
    const ke = () => _.value.find((e) => e.type === "user" && !e.read_at);
    function He(e) {
      m.value || !ke() || (e.preventDefault(), g.value = ke(), D.value = null, m.value = g.value.text);
    }
    function U() {
      g.value && (g.value = null, m.value = "");
    }
    async function Pe() {
      const e = await c.run(["message", "edit", String(g.value.id), "--text", m.value]);
      E.value = e.ok ? "" : e.error, e.ok && U(), h();
    }
    async function ne() {
      if (g.value) return Pe();
      const e = { text: m.value, attached: u.value }, t = e.attached.flatMap((N) => ["--file", N.pending]), a = e.text || e.attached.map((N) => N.name).join(", "), f = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      v.value = [...v.value, f], m.value = "", u.value = [], E.value = "", P();
      const we = D.value;
      D.value = null;
      const Te = await c.run(we && !t.length ? ["message", "reply", String(we.id), a] : ["message", "send", a, ...t]);
      Te.ok || (E.value = Te.error, m.value = e.text, u.value = e.attached), v.value = v.value.filter((N) => N !== f), await h();
    }
    const Ne = (e) => !e.shiftKey && !e.isComposing && (e.preventDefault(), oe.value && ne()), qe = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
    function he(e) {
      var t, a;
      e.key !== "/" || e.metaKey || e.ctrlKey || qe.has((t = e.target) == null ? void 0 : t.tagName) || (a = e.target) != null && a.isContentEditable || (e.preventDefault(), P());
    }
    window.addEventListener("keydown", he), be(() => window.removeEventListener("keydown", he));
    const se = `journal.draft.${c.environment}`;
    function Be() {
      try {
        return localStorage.getItem(se) ?? "";
      } catch {
        return "";
      }
    }
    function Ke(e) {
      try {
        e ? localStorage.setItem(se, e) : localStorage.removeItem(se);
      } catch {
        return;
      }
    }
    m.value = Be(), z(m, (e) => !g.value && Ke(e));
    const V = o(!1);
    async function je() {
      if (V.value || !T.value) return;
      V.value = !0;
      const e = r.value.scrollHeight, [t, a] = await Promise.all([b(), W()]);
      (t || a) && (await re(), r.value.scrollTop += r.value.scrollHeight - e), V.value = !1;
    }
    function Ue() {
      if (pe.value = !r.value || r.value.scrollTop < 8, pe.value && r.value && je(), !r.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = r.value;
      x = t - e - a < jt, me.value = !x, x && (M.value = 0);
      const f = gt({ top: e, before: ve, height: t, shown: a });
      ve = e, f !== null && (clearTimeout(ae), f ? te.value = !0 : ae = setTimeout(() => te.value = !1, Bt));
    }
    z(() => {
      var e;
      return (e = _.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !x && (M.value += 1);
    }), z([J, T], async () => {
      await re(), x && r.value && (r.value.scrollTop = r.value.scrollHeight);
    });
    let ye = !1;
    z(T, () => setTimeout(() => ye = !0, Ut));
    const Ve = ut(), _e = () => ({ pane: r.value, follows: () => ye && x }), ze = (e) => {
      var t;
      return (t = J.value.find((a) => a.id === e.dataset.row)) == null ? void 0 : t.row;
    }, Ge = (e) => !!(e != null && e.local), Qe = {
      enter: (e, t) => {
        const a = ze(e);
        return Ge(a) ? ht(e, _e(), t) : (a == null ? void 0 : a.type) === "user" ? t() : Ve(e, _e(), t);
      },
      leave: (e, t) => !x || !e.querySelector("[data-message]") ? t() : kt(e, t)
    }, Xe = () => {
      var e;
      return (e = r.value) == null ? void 0 : e.scrollTo({ top: r.value.scrollHeight, behavior: "smooth" });
    }, We = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (s(), p("div", {
      ref_key: "chat",
      ref: ee,
      class: "chat"
    }, [
      n("div", xt, [
        (s(!0), p(Ce, null, xe(l($e), (a) => (s(), p("div", {
          key: a.id,
          class: "notice"
        }, [
          t[9] || (t[9] = n("span", { class: "notice-dot" }, null, -1)),
          n("span", Dt, y(a.title), 1),
          n("a", {
            class: "notice-link",
            href: We(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, y(a.label), 9, St),
          n("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (f) => l(d)(["notice", "close", String(a.id)])
          }, [
            k(l(X), {
              name: "close",
              size: 12
            })
          ], 8, $t)
        ]))), 128)),
        k(l(it), { notices: l(L) }, null, 8, ["notices"])
      ]),
      n("div", {
        ref_key: "scroller",
        ref: r,
        class: "history",
        onScroll: Ue
      }, [
        V.value ? (s(), S(l(ct), {
          key: 0,
          shape: "older",
          label: "Loading older messages"
        })) : w("", !0),
        k(l(dt), {
          rows: J.value,
          failure: l(C),
          loaded: l(T),
          arrival: Qe,
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: $(({ row: a }) => [
            a.kind === "day" ? (s(), p("p", Et, y(a.title), 1)) : a.kind === "mark" ? (s(), S(l(vt), {
              key: 1,
              mark: a.row
            }, null, 8, ["mark"])) : (s(), S(l(pt), {
              key: 2,
              message: a.row,
              quote: Ee(a.row),
              onReply: Ae,
              onDelete: Le
            }, null, 8, ["message", "quote"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      n("div", Mt, [
        k(Je, { name: "rise" }, {
          default: $(() => [
            ie(n("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: M.value ? `${M.value} arrived while you were reading` : "Back to the newest",
              onClick: Xe
            }, [
              k(l(X), { name: "down" }),
              R(" " + y(M.value ? `${M.value} new` : "Newest"), 1)
            ], 8, Ot), [
              [Ze, me.value]
            ])
          ]),
          _: 1
        })
      ]),
      n("p", Rt, [
        n("span", {
          class: ue(["running-dot", { idle: !Z.value }])
        }, null, 2),
        k(l(mt), {
          text: Z.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      k(l(ft), {
        items: l(Y),
        folded: de.value || !te.value
      }, null, 8, ["items", "folded"]),
      O.value ? (s(), S(Ct, {
        key: 0,
        run: l(c).run,
        onMade: t[0] || (t[0] = (a) => O.value = !1),
        onClose: t[1] || (t[1] = (a) => O.value = !1)
      }, null, 8, ["run"])) : w("", !0),
      D.value || g.value ? (s(), p("p", Ft, [
        n("span", It, y(Ie.value), 1),
        n("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (D.value = null, U()))
        }, "×")
      ])) : w("", !0),
      n("form", {
        class: ue(["composer", { dragging: j.value }]),
        onSubmit: F(ne, ["prevent"]),
        onDragover: t[7] || (t[7] = F((a) => j.value = !0, ["prevent"])),
        onDragleave: t[8] || (t[8] = (a) => j.value = !1),
        onDrop: F(Re, ["prevent"])
      }, [
        u.value.length ? (s(), p("ul", At, [
          (s(!0), p(Ce, null, xe(u.value, (a) => (s(), p("li", {
            key: a.name + a.pending,
            class: ue(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            n("span", null, y(a.name), 1),
            !a.pending && !a.failure ? (s(), p("span", Ht, "sending")) : w("", !0),
            n("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (f) => Fe(a)
            }, [
              k(l(X), {
                name: "close",
                size: 10
              })
            ], 8, Pt)
          ], 10, Lt))), 128))
        ])) : w("", !0),
        ie(n("textarea", {
          ref_key: "composerInput",
          ref: ge,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => m.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            G(Ne, ["enter"]),
            G(He, ["up"]),
            G(U, ["down"]),
            G(U, ["esc"])
          ],
          onPaste: Oe
        }, null, 544), [
          [De, m.value]
        ]),
        n("div", Nt, [
          n("input", {
            ref_key: "picker",
            ref: fe,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: Me
          }, null, 544),
          n("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: t[4] || (t[4] = (a) => fe.value.click())
          }, [
            k(l(X), {
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
      E.value ? (s(), p("p", qt, y(E.value), 1)) : w("", !0)
    ], 512));
  }
}, Qt = /* @__PURE__ */ Se(Vt, [["__scopeId", "data-v-96697dd8"]]);
export {
  Qt as default
};
