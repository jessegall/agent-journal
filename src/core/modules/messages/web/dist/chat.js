/* @code-commandments-generated */
if (!document.getElementById("window-styles-7df1ec7ea343")) { const style = document.createElement("style"); style.id = "window-styles-7df1ec7ea343"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-19a67b52]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-19a67b52]{flex:1;min-height:0;overflow-y:auto}.history[data-v-19a67b52] .row-list-row{padding:1px 8px}.history[data-v-19a67b52] .mark.w-event{color:var(--text-3)}.notices[data-v-19a67b52]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-19a67b52]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-19a67b52]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-19a67b52]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-19a67b52]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-19a67b52]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-19a67b52]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-19a67b52]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-19a67b52]{background:var(--text-4)}.chat-day[data-v-19a67b52]{margin:0;padding:4px 0;color:var(--text-4);font-size:10.5px;text-align:center}.jump-holder[data-v-19a67b52]{position:relative;flex:none;height:0}.jump[data-v-19a67b52]{position:absolute;z-index:3;bottom:6px;left:50%;display:inline-flex;gap:5px;align-items:center;padding:4px 11px;border:1px solid var(--text);border-radius:99px;background:var(--text);color:#0d0e10;font-size:11.5px;font-weight:500;cursor:pointer;box-shadow:0 6px 18px #00000073;transform:translate(-50%)}.jump[data-v-19a67b52]:hover{border-color:#fff;background:#fff;color:#000}.rise-enter-active[data-v-19a67b52]{transition:opacity .22s ease-out,transform .22s cubic-bezier(.2,.8,.2,1)}.rise-leave-active[data-v-19a67b52]{transition:opacity .16s ease-in,transform .16s ease-in}.rise-enter-from[data-v-19a67b52],.rise-leave-to[data-v-19a67b52]{opacity:0;transform:translate(-50%,8px)}.composer-quote[data-v-19a67b52]{display:flex;flex:none;gap:8px;align-items:center;margin:0 0 6px;padding:4px 10px;border-left:2px solid var(--accent);color:var(--text-3);font-size:12.5px}.composer-quote-text[data-v-19a67b52]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.composer-quote-drop[data-v-19a67b52]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.composer[data-v-19a67b52]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-19a67b52]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-19a67b52]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-19a67b52]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-19a67b52]{border-color:var(--accent)}.attached[data-v-19a67b52]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-19a67b52]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-19a67b52]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-19a67b52]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-19a67b52]{color:var(--text-3)}.composer-send[data-v-19a67b52]{margin-left:auto}.composer-failure[data-v-19a67b52]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as o, openBlock as n, createElementBlock as p, withModifiers as F, withDirectives as ie, createElementVNode as s, vModelText as xe, toDisplayString as y, createCommentVNode as _, createVNode as k, unref as l, withCtx as $, createTextVNode as O, computed as B, onMounted as We, onUnmounted as Te, nextTick as re, watch as z, Fragment as Ce, renderList as De, createBlock as S, Transition as Ye, vShow as Je, normalizeClass as ue, withKeys as G } from "vue";
import { Btn as K, useRows as Q, shownMarks as Ze, markDeclaration as et, withDayLines as tt, interleaved as at, usePins as lt, fetchMarkDeclarations as ot, fetchDockDeclarations as st, SHORT_CHAT as nt, arrivalQueue as rt, Icon as X, PinsToggle as ut, Skeleton as it, RowList as ct, MarkHost as dt, MessageCard as vt, RunningCommand as pt, DockStack as mt, dockOpening as ft, depart as gt, arriveAtOnce as kt } from "@journal/window-kit";
const Se = (I, w) => {
  const C = I.__vccOpts || I;
  for (const [b, h] of w)
    C[b] = h;
  return C;
}, ht = {
  key: 0,
  class: "dump-files"
}, yt = { class: "dump-row" }, _t = {
  key: 1,
  class: "dump-failure"
}, wt = 60, bt = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(I, { emit: w }) {
    const C = w, b = I, h = o(""), T = o([]), c = o(""), A = () => [...h.value.split(/\n\s*\n/).map((d) => d.trim()).filter(Boolean), ...T.value.map((d) => `${d.name}: ${d.text.trim()}`)], W = () => (A()[0] ?? "").replace(/\s+/g, " ").slice(0, wt);
    async function Y(d) {
      var v;
      const i = [...((v = d.dataTransfer) == null ? void 0 : v.files) ?? []];
      T.value = [...T.value, ...await Promise.all(i.map(async (j) => ({ name: j.name, text: await j.text() })))];
    }
    async function L() {
      const d = await b.run(["dump", "make", W(), "--parts", A().join(" | ")]);
      c.value = d.ok ? "" : d.error, d.ok && (h.value = "", T.value = [], C("made"));
    }
    return (d, i) => (n(), p("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: F(L, ["prevent"]),
      onDragover: i[2] || (i[2] = F(() => {
      }, ["prevent"])),
      onDrop: F(Y, ["prevent"])
    }, [
      ie(s("textarea", {
        "onUpdate:modelValue": i[0] || (i[0] = (v) => h.value = v),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [xe, h.value]
      ]),
      T.value.length ? (n(), p("p", ht, y(T.value.map((v) => v.name).join(", ")), 1)) : _("", !0),
      s("div", yt, [
        k(l(K), {
          kind: "primary",
          small: "",
          disabled: !A().length,
          "data-dump-make": "",
          onClick: L
        }, {
          default: $(() => [...i[3] || (i[3] = [
            O("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(l(K), {
          small: "",
          onClick: i[1] || (i[1] = (v) => C("close"))
        }, {
          default: $(() => [...i[4] || (i[4] = [
            O("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      c.value ? (n(), p("p", _t, y(c.value), 1)) : _("", !0)
    ], 32));
  }
}, Tt = /* @__PURE__ */ Se(bt, [["__scopeId", "data-v-d2c5a833"]]), Ct = {
  "data-notices": "",
  class: "notices"
}, Dt = { class: "notice-text" }, xt = ["href", "target"], St = ["onClick"], $t = {
  key: 0,
  class: "chat-day",
  "data-day-line": ""
}, Et = { class: "jump-holder" }, Mt = ["title"], Rt = { class: "running-strip" }, Ot = {
  key: 1,
  class: "composer-quote",
  "data-composer-quote": ""
}, Ft = { class: "composer-quote-text" }, It = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, At = ["title"], Lt = {
  key: 0,
  class: "attached-wait"
}, Ht = ["onClick"], Pt = { class: "composer-row" }, Nt = {
  key: 2,
  class: "composer-failure"
}, Bt = 180, Kt = 2e3, jt = 40, qt = 1500, Ut = {
  __name: "Chat",
  setup(I) {
    const { rows: w, failure: C, loaded: b, load: h, older: T, context: c } = Q("message list", ["message.*"], { incremental: !0 }), { rows: A, older: W } = Q("chat-mark list", ["chat_mark.*"], { incremental: !0 }), { rows: Y } = Q("dock-item list", ["dock_item.*"]), { rows: L, act: d } = Q("notice list", ["notice.*"]), i = B(() => Ze(A.value, et, (e) => c.option(e).value)), v = o([]), j = B(() => v.value.filter((e) => !w.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - Kt))), J = B(() => tt(at([...w.value, ...j.value], i.value))), { visible: $e } = lt(() => L.value), Z = o("");
    async function ce() {
      const e = await c.read("usage tool");
      Z.value = e.ok ? e.value.tool : "";
    }
    c.follow(["hook_call.*"], ce), ce();
    const ee = o(null), te = o(!0), de = o(!1);
    let ve = 0, D = !0, ae = 0, H = null;
    We(() => {
      P(), Promise.all([ot(), st()]), ee.value && typeof ResizeObserver < "u" && (H = new ResizeObserver(([e]) => de.value = e.contentRect.height < nt), H.observe(ee.value));
    }), Te(() => {
      H == null || H.disconnect(), clearTimeout(ae);
    });
    const m = o(""), E = o(""), r = o(null), pe = o(!0), me = o(!1), M = o(0), R = o(!1), u = o([]), fe = o(null), ge = o(null), P = () => re(() => {
      var e;
      return (e = ge.value) == null ? void 0 : e.focus();
    }), q = o(!1);
    async function le(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        u.value = [...u.value, a];
        const f = await c.upload(t);
        a.pending = f.ok ? f.value : "", a.failure = f.ok ? "" : f.error, u.value = [...u.value];
      }
      P();
    }
    const Ee = (e) => {
      le([...e.target.files]), e.target.value = "";
    }, Me = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), le(t));
    }, Re = (e) => {
      var t;
      q.value = !1, le([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, Oe = (e) => u.value = u.value.filter((t) => t !== e), oe = B(() => (m.value.trim() || u.value.length) && u.value.every((e) => e.pending)), x = o(null), Fe = B(() => {
      var e;
      return g.value ? `Editing message ${g.value.id}` : `Reply to: ${(e = x.value) == null ? void 0 : e.text}`;
    }), g = o(null);
    function Ie(e) {
      g.value = null, x.value = e, P();
    }
    async function Ae(e) {
      const t = await c.run(["message", "delete", String(e.id)]);
      E.value = t.ok ? "" : t.error, h();
    }
    const ke = () => w.value.find((e) => e.type === "user" && !e.read_at);
    function Le(e) {
      m.value || !ke() || (e.preventDefault(), g.value = ke(), x.value = null, m.value = g.value.text);
    }
    function U() {
      g.value && (g.value = null, m.value = "");
    }
    async function He() {
      const e = await c.run(["message", "edit", String(g.value.id), "--text", m.value]);
      E.value = e.ok ? "" : e.error, e.ok && U(), h();
    }
    async function se() {
      if (g.value) return He();
      const e = { text: m.value, attached: u.value }, t = e.attached.flatMap((N) => ["--file", N.pending]), a = e.text || e.attached.map((N) => N.name).join(", "), f = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      v.value = [...v.value, f], m.value = "", u.value = [], E.value = "", P();
      const we = x.value;
      x.value = null;
      const be = await c.run(we && !t.length ? ["message", "reply", String(we.id), a] : ["message", "send", a, ...t]);
      be.ok || (E.value = be.error, m.value = e.text, u.value = e.attached), v.value = v.value.filter((N) => N !== f), await h();
    }
    const Pe = (e) => !e.shiftKey && !e.isComposing && (e.preventDefault(), oe.value && se()), Ne = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
    function he(e) {
      var t, a;
      e.key !== "/" || e.metaKey || e.ctrlKey || Ne.has((t = e.target) == null ? void 0 : t.tagName) || (a = e.target) != null && a.isContentEditable || (e.preventDefault(), P());
    }
    window.addEventListener("keydown", he), Te(() => window.removeEventListener("keydown", he));
    const ne = `journal.draft.${c.environment}`;
    function Be() {
      try {
        return localStorage.getItem(ne) ?? "";
      } catch {
        return "";
      }
    }
    function Ke(e) {
      try {
        e ? localStorage.setItem(ne, e) : localStorage.removeItem(ne);
      } catch {
        return;
      }
    }
    m.value = Be(), z(m, (e) => !g.value && Ke(e));
    const V = o(!1);
    async function je() {
      if (V.value || !b.value) return;
      V.value = !0;
      const e = r.value.scrollHeight, [t, a] = await Promise.all([T(), W()]);
      (t || a) && (await re(), r.value.scrollTop += r.value.scrollHeight - e), V.value = !1;
    }
    function qe() {
      if (pe.value = !r.value || r.value.scrollTop < 8, pe.value && r.value && je(), !r.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = r.value;
      D = t - e - a < jt, me.value = !D, D && (M.value = 0);
      const f = ft({ top: e, before: ve, height: t, shown: a });
      ve = e, f !== null && (clearTimeout(ae), f ? te.value = !0 : ae = setTimeout(() => te.value = !1, Bt));
    }
    z(() => {
      var e;
      return (e = w.value[0]) == null ? void 0 : e.id;
    }, (e, t) => {
      t && e > t && !D && (M.value += 1);
    }), z([J, b], async () => {
      await re(), D && r.value && (r.value.scrollTop = r.value.scrollHeight);
    });
    let ye = !1;
    z(b, () => setTimeout(() => ye = !0, qt));
    const Ue = rt(), _e = () => ({ pane: r.value, follows: () => ye && D }), Ve = (e) => {
      var t;
      return (t = J.value.find((a) => a.id === e.dataset.row)) == null ? void 0 : t.row;
    }, ze = (e) => !!(e != null && e.local), Ge = {
      enter: (e, t) => {
        const a = Ve(e);
        return ze(a) ? kt(e, _e(), t) : (a == null ? void 0 : a.type) === "user" ? t() : Ue(e, _e(), t);
      },
      leave: (e, t) => !D || !e.querySelector("[data-message]") ? t() : gt(e, t)
    }, Qe = () => {
      var e;
      return (e = r.value) == null ? void 0 : e.scrollTo({ top: r.value.scrollHeight, behavior: "smooth" });
    }, Xe = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (n(), p("div", {
      ref_key: "chat",
      ref: ee,
      class: "chat"
    }, [
      s("div", Ct, [
        (n(!0), p(Ce, null, De(l($e), (a) => (n(), p("div", {
          key: a.id,
          class: "notice"
        }, [
          t[9] || (t[9] = s("span", { class: "notice-dot" }, null, -1)),
          s("span", Dt, y(a.title), 1),
          s("a", {
            class: "notice-link",
            href: Xe(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, y(a.label), 9, xt),
          s("button", {
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
          ], 8, St)
        ]))), 128)),
        k(l(ut), { notices: l(L) }, null, 8, ["notices"])
      ]),
      s("div", {
        ref_key: "scroller",
        ref: r,
        class: "history",
        onScroll: qe
      }, [
        V.value ? (n(), S(l(it), {
          key: 0,
          shape: "older",
          label: "Loading older messages"
        })) : _("", !0),
        k(l(ct), {
          rows: J.value,
          failure: l(C),
          loaded: l(b),
          arrival: Ge,
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: $(({ row: a }) => [
            a.kind === "day" ? (n(), p("p", $t, y(a.title), 1)) : a.kind === "mark" ? (n(), S(l(dt), {
              key: 1,
              mark: a.row
            }, null, 8, ["mark"])) : (n(), S(l(vt), {
              key: 2,
              message: a.row,
              onReply: Ie,
              onDelete: Ae
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      s("div", Et, [
        k(Ye, { name: "rise" }, {
          default: $(() => [
            ie(s("button", {
              type: "button",
              "data-scroll-foot": "",
              class: "jump",
              title: M.value ? `${M.value} arrived while you were reading` : "Back to the newest",
              onClick: Qe
            }, [
              k(l(X), { name: "down" }),
              O(" " + y(M.value ? `${M.value} new` : "Newest"), 1)
            ], 8, Mt), [
              [Je, me.value]
            ])
          ]),
          _: 1
        })
      ]),
      s("p", Rt, [
        s("span", {
          class: ue(["running-dot", { idle: !Z.value }])
        }, null, 2),
        k(l(pt), {
          text: Z.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      k(l(mt), {
        items: l(Y),
        folded: de.value || !te.value
      }, null, 8, ["items", "folded"]),
      R.value ? (n(), S(Tt, {
        key: 0,
        run: l(c).run,
        onMade: t[0] || (t[0] = (a) => R.value = !1),
        onClose: t[1] || (t[1] = (a) => R.value = !1)
      }, null, 8, ["run"])) : _("", !0),
      x.value || g.value ? (n(), p("p", Ot, [
        s("span", Ft, y(Fe.value), 1),
        s("button", {
          type: "button",
          class: "composer-quote-drop",
          "aria-label": "Leave it",
          onClick: t[2] || (t[2] = (a) => (x.value = null, U()))
        }, "×")
      ])) : _("", !0),
      s("form", {
        class: ue(["composer", { dragging: q.value }]),
        onSubmit: F(se, ["prevent"]),
        onDragover: t[7] || (t[7] = F((a) => q.value = !0, ["prevent"])),
        onDragleave: t[8] || (t[8] = (a) => q.value = !1),
        onDrop: F(Re, ["prevent"])
      }, [
        u.value.length ? (n(), p("ul", It, [
          (n(!0), p(Ce, null, De(u.value, (a) => (n(), p("li", {
            key: a.name + a.pending,
            class: ue(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            s("span", null, y(a.name), 1),
            !a.pending && !a.failure ? (n(), p("span", Lt, "sending")) : _("", !0),
            s("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (f) => Oe(a)
            }, [
              k(l(X), {
                name: "close",
                size: 10
              })
            ], 8, Ht)
          ], 10, At))), 128))
        ])) : _("", !0),
        ie(s("textarea", {
          ref_key: "composerInput",
          ref: ge,
          "onUpdate:modelValue": t[3] || (t[3] = (a) => m.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: [
            G(Pe, ["enter"]),
            G(Le, ["up"]),
            G(U, ["down"]),
            G(U, ["esc"])
          ],
          onPaste: Me
        }, null, 544), [
          [xe, m.value]
        ]),
        s("div", Pt, [
          s("input", {
            ref_key: "picker",
            ref: fe,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: Ee
          }, null, 544),
          s("button", {
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
          oe.value ? (n(), S(l(K), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: se
          }, {
            default: $(() => [...t[10] || (t[10] = [
              O("Send", -1)
            ])]),
            _: 1
          })) : (n(), S(l(K), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[5] || (t[5] = (a) => R.value = !R.value)
          }, {
            default: $(() => [...t[11] || (t[11] = [
              O("Dump files", -1)
            ])]),
            _: 1
          })),
          oe.value && u.value.length > 1 ? (n(), S(l(K), {
            key: 2,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-offer": "",
            onClick: t[6] || (t[6] = (a) => R.value = !0)
          }, {
            default: $(() => [
              O("Dump " + y(u.value.length) + " files", 1)
            ]),
            _: 1
          })) : _("", !0)
        ])
      ], 34),
      E.value ? (n(), p("p", Nt, y(E.value), 1)) : _("", !0)
    ], 512));
  }
}, Gt = /* @__PURE__ */ Se(Ut, [["__scopeId", "data-v-19a67b52"]]);
export {
  Gt as default
};
