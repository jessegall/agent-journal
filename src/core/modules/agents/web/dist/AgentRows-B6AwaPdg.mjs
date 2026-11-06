/* @code-commandments-generated */
import { openBlock as t, createElementBlock as i, normalizeStyle as de, normalizeClass as oe, toDisplayString as p, createCommentVNode as f, createElementVNode as v, renderSlot as xe, computed as x, createVNode as k, withCtx as S, createTextVNode as h, Fragment as V, renderList as te, onUnmounted as je, ref as C, onMounted as _e, createBlock as _, Teleport as Ze, mergeProps as Ge, watch as ce, toRef as Ye, unref as m, withModifiers as se, defineAsyncComponent as Qe, withKeys as Ve, createSlots as Xe, resolveDynamicComponent as et, withDirectives as tt, vShow as at, nextTick as Le } from "vue";
import { peekRef as Se, Icon as Ae, RunningCommand as nt, FoldGroup as Ee, TaskStatusIcon as lt, Btn as ne, TextArea as Ne, TextInput as ze, useWindow as Te, SwitchCase as qe, useNow as st, age as ot, perHour as it, loadWindowComponent as rt, coalesced as Fe, READ_RATES as We, TimeAgo as Oe, InnerTabs as ut, TabBody as dt, EmptyState as De, useRows as ct, useDeclaredRows as He, SearchBar as vt, Segmented as gt, MenuLabel as Re, MenuItem as $e, RowList as pt, toggleFilter as mt } from "@journal/window-kit";
import { _ as ae, T as ht } from "./TranscriptRows-DCpyNUhv.mjs";
const ft = ["stroke-width", "innerHTML"], ee = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const u = e, s = { right: 0, down: 90, left: 180, up: 270 }, d = {
      mail: "inbox",
      circle: "todos",
      play: "work",
      flag: "plan",
      file: "docs",
      report: "reports",
      pin: "pins",
      list: "rules",
      clock: "reminders",
      help: "questions",
      bubble: "inbox",
      wrench: "tools",
      brush: "style",
      band: "rules",
      smile: "smile",
      bot: "agents",
      panel: "activity",
      x: "close",
      check: "todos",
      clip: "paperclip",
      send: "arrow",
      more: "dots",
      chevron: "arrow"
    }, a = {
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      key: '<circle cx="5.5" cy="10.5" r="2.8"/><path d="M7.5 8.5 13 3M10.8 5.2l1.7 1.7M9.2 6.8l1.2 1.2"/>',
      terminal: '<path d="M2 3.5h12v9H2zM4.8 6.4 6.9 8l-2.1 1.6M8.4 10h3"/>',
      trash: '<path d="M3 4.5h10M6.4 4.5V3h3.2v1.5M4.4 4.5l.7 8.5h5.8l.7-8.5"/>',
      chat: '<path d="M2.5 3h11v7.5H8L5 13v-2.5H2.5z"/>',
      edits: '<path d="M8 3v6M5 6h6M5 12.5h6"/>',
      gauge: '<path d="M2.6 11.5a5.4 5.4 0 1 1 10.8 0"/><path d="M8 11.5 10.4 7.4"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/>',
      hook: '<path d="M8 2v7.6a2.9 2.9 0 1 1-2.9-2.9"/><circle cx="8" cy="2.6" r=".7" fill="currentColor"/>',
      request: '<path d="M3 5.2h9.4M10 2.9l2.4 2.3L10 7.5"/><path d="M13 10.8H3.6M6 8.5l-2.4 2.3L6 13.1"/>',
      heart: '<path d="M8 13.2 3.2 8.4a2.9 2.9 0 0 1 4.1-4.1L8 5l.7-.7a2.9 2.9 0 0 1 4.1 4.1z"/>',
      weight: '<path d="M2.5 13.5h11l-1.6-7.5H4.1zM6 6a2 2 0 1 1 4 0"/>',
      points: '<path d="M3 13.2V8.6M6.7 13.2V5.4M10.4 13.2V9.8M14 13.2V2.8" stroke-linecap="round"/>',
      bolt: '<path d="M9.2 2 4.2 8.8h3.6L6.8 14l5-6.8H8.2z"/>',
      bulb: '<path d="M5.4 9.9a4.3 4.3 0 1 1 5.2 0c-.45.35-.7.85-.7 1.4v.2H6.1v-.2c0-.55-.25-1.05-.7-1.4Z"/><path d="M6.3 13.5h3.4"/>',
      todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
      task: '<rect x="3.5" y="2.5" width="9" height="11.5" rx="1.4"/><path d="M6.2 2.5V1.6h3.6v.9M5.8 6.4h4.4M5.8 8.9h4.4M5.8 11.4h2.6"/>',
      pins: '<path d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>',
      style: '<path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>',
      warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
      book: '<path d="M8 4.4c-1.7-1.2-3.8-1.5-6-.9v9c2.2-.6 4.3-.3 6 .9 1.7-1.2 3.8-1.5 6-.9v-9c-2.2-.6-4.3-.3-6 .9Z"/><path d="M8 4.4v9"/>',
      auto: '<path d="M5 3.4 12.4 8 5 12.6z" fill="currentColor" stroke-width="1"/>',
      branch: '<circle cx="5" cy="3.6" r="1.6"/><circle cx="5" cy="12.4" r="1.6"/><circle cx="11.6" cy="5.4" r="1.6"/><path d="M5 5.2v5.6M11.6 7v.6a3.6 3.6 0 0 1-3.6 3.6H6.6"/>',
      scheme: '<circle cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" stroke="none"/>',
      wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
      narrow: '<path d="M2.6 6.2h3.6V2.6M13.4 6.2H9.8V2.6M2.6 9.8h3.6v3.6M13.4 9.8H9.8v3.6"/>',
      up: '<path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>',
      down: '<path d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>',
      board: '<rect x="1.8" y="2.5" width="12.4" height="11" rx="2"/><rect x="3.6" y="4.4" width="2.4" height="4" rx=".5" fill="currentColor" stroke="none"/><rect x="3.6" y="9.4" width="2.4" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="6.8" y="4.4" width="2.4" height="5.6" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="4.4" width="2.4" height="2.4" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="7.8" width="2.4" height="3.2" rx=".5" fill="currentColor" stroke="none"/>',
      ticket: '<path d="M2.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1.75a1.75 1.75 0 0 0 0 3.5v1.75a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V9.75a1.75 1.75 0 0 0 0-3.5z"/><path d="M6.5 5v1M6.5 7.5v1M6.5 10v1"/>',
      download: '<path d="M8 2.5v7.5M5 7l3 3 3-3"/><path d="M3 11v2h10v-2"/>',
      upload: '<path d="M8 10V2.5M5 5.5l3-3 3 3"/><path d="M3 11v2h10v-2"/>',
      open: '<path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/>',
      sidepanel: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/>',
      columns: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 3v10"/>',
      rows: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M2.5 8h11"/>',
      tab: '<path d="M2.5 5.5h11V13h-11zM2.5 5.5V3h5v2.5"/>',
      float: '<rect x="5.5" y="5.5" width="8" height="7.5" rx="1"/><path d="M2.5 10.5V3h8"/>',
      minimize: '<path d="M4 8h8"/>',
      chapters: '<path d="M2.5 4h6M2.5 8h11M2.5 12h8"/><path d="M11 2.2v3.6l1.2-.9 1.2.9V2.2"/>',
      reply: '<path d="M6.5 4.2 3 7.6l3.5 3.4"/><path d="M3.4 7.6h5.4a4 4 0 0 1 4 4v1.2"/>',
      copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 3.8V3.6A1.6 1.6 0 0 0 8.9 2H4.1A1.6 1.6 0 0 0 2.5 3.6v4.8A1.6 1.6 0 0 0 4.1 10h.2"/>',
      broadcast: '<circle cx="8" cy="8" r="1.3"/><path d="M5.4 5.2a4 4 0 0 0 0 5.6"/><path d="M10.6 5.2a4 4 0 0 1 0 5.6"/><path d="M3.2 2.9a7 7 0 0 0 0 10.2"/><path d="M12.8 2.9a7 7 0 0 1 0 10.2"/>',
      artboard: '<path d="M5 2.5v11M11 2.5v11M2.5 5h11M2.5 11h11"/>',
      webpage: '<rect x="2.5" y="3" width="11" height="10" rx="1.6"/><path d="M2.5 5.8h11M5 8.6h6M5 10.6h3.6"/>',
      pull: '<circle cx="4.5" cy="3.8" r="1.5"/><circle cx="4.5" cy="12.2" r="1.5"/><circle cx="11.5" cy="12.2" r="1.5"/><path d="M4.5 5.3v5.4M11.5 10.7V7.2a2.2 2.2 0 0 0-2.2-2.2H7.4M8.8 3.4 7.2 5l1.6 1.6"/>',
      window: '<rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/>',
      dock: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 5.5V10M5.8 7.8 8 10l2.2-2.2"/>',
      restore: '<path d="M3 8a5 5 0 1 0 1.5-3.55"/><path d="M3 2.75V5h2.25"/>',
      caret: '<path d="M5 6.5l3 3 3-3"/>',
      share: '<path d="M5.5 6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-1"/><path d="M8 9.5V2M5.75 4.25L8 2l2.25 2.25"/>',
      floppy: '<path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h6.4L13 5.1v6.4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z"/><path d="M5.5 3v3h4.5V3"/><rect x="5" y="8.5" width="6" height="4.5" rx="0.6"/>',
      saveinto: '<path d="M5.5 3H4a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 4 13h8a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12 3h-1.5"/><path d="M8 1.75v6.5M5.75 6l2.25 2.25L10.25 6"/><path d="M5 10.75h6"/>',
      tiles: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
      palette: '<path d="M8 2.5a5.5 5.5 0 1 0 0 11c.8 0 1.2-.5 1.2-1.1 0-.9-.8-1.2-.8-2 0-.6.5-1 1.1-1h1.6a2.4 2.4 0 0 0 2.4-2.4C13.5 4.6 11.1 2.5 8 2.5z"/><circle cx="5.3" cy="7.2" r=".6"/><circle cx="7.4" cy="5.1" r=".6"/><circle cx="10.2" cy="5.4" r=".6"/>',
      pause: '<path d="M5.8 4v8M10.2 4v8"/>',
      stop: '<path d="M4.5 4.5h7v7h-7z"/>',
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      resume: '<path d="M5.5 3.8v8.4L12.2 8z"/>',
      tick: '<path d="M3.8 8.3l2.6 2.6 5.8-6.1"/>',
      ring: '<circle cx="8" cy="8" r="5.25" stroke-width="2"/>',
      checkbox: '<rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2.5"/><path d="M5.4 8.1l1.8 1.8 3.5-3.7"/>',
      layout: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9 3v10M9 8h4.5"/>',
      info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
      bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
      activity: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
      arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
      chevronRight: '<path d="M6 3 11 8 6 13"/>',
      back: '<path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"/>',
      paperclip: '<path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/>',
      crosshair: '<circle cx="8" cy="8" r="4.2"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
      camera: '<path d="M2 5.5h2.6l1.2-1.8h4.4l1.2 1.8H14v7.5H2z"/><circle cx="8" cy="9" r="2.3"/>',
      wheel: '<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="1.6"/><path d="M8 2.4v4M8 9.6v4M2.4 8h4M9.6 8h4"/>',
      model: '<path d="M8 2.2c.5 2.9 2 4.4 4.9 4.9-2.9.5-4.4 2-4.9 4.9-.5-2.9-2-4.4-4.9-4.9 2.9-.5 4.4-2 4.9-4.9z"/><path d="M12.6 10.6c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9z"/>',
      agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
      reviewer: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/><path d="M5 7.1l1.4 1.4 2.6-2.8"/>',
      verifier: '<path d="M8 1.8v1.4"/><path d="M5.5 3.2h5"/><path d="M5 4.6h6v7.4H5z"/><path d="M4.5 13.6h7"/><path d="M8 6.9c.9.9 1.2 1.6 1.2 2.3a1.2 1.2 0 0 1-2.4 0c0-.7.3-1.4 1.2-2.3z"/>',
      reports: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/>',
      work: '<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>',
      reminders: '<path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/>',
      pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
      revisions: '<path d="M5.2 4.4h7v9.8h-7z"/><path d="M3.4 11.8V2.2h6.4"/><path d="M7 7.4h3.4M7 10h3.4"/>',
      docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
      rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
      folder: '<path d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>',
      inbox: '<path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/>',
      questions: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/>',
      home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
      close: '<path d="M4 4l8 8M12 4l-8 8"/>',
      plus: '<path d="M8 3.5v9M3.5 8h9"/>',
      minus: '<path d="M3.5 8h9"/>',
      power: '<path d="M8 2v6"/><path d="M4.5 4.2a5 5 0 1 0 7 0"/>',
      people: '<circle cx="6" cy="5.5" r="2.2"/><path d="M2.2 13c.4-2.2 1.9-3.5 3.8-3.5s3.4 1.3 3.8 3.5"/><circle cx="11.2" cy="6" r="1.8"/><path d="M11 9.6c1.6 0 2.8 1.1 3.1 3"/>',
      lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
      plug: '<path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/>',
      tools: '<path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/>',
      plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
      search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
      settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
      smile: '<circle cx="8" cy="8" r="5.5"/><path d="M5.8 9.5c1.2 1.2 3.2 1.2 4.4 0M6.2 6.5h.01M9.8 6.5h.01"/>',
      dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
      "dots-vertical": '<circle cx="8" cy="3.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (M, T) => (t(), i("svg", {
      class: "ico",
      style: de({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...u.facing === "right" ? {} : { transform: `rotate(${s[u.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: a[d[e.name] || e.name] || a.dot
    }, null, 12, ft));
  }
}, kt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, yt = {
  key: 1,
  class: "menu-item-text"
}, bt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (u, s) => (t(), i("button", {
      type: "button",
      class: oe(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), i("span", kt, p(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (t(), i("span", yt, [
        v("span", null, [
          xe(u.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, p(e.description), 1)
      ])) : xe(u.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, be = /* @__PURE__ */ ae(bt, [["__scopeId", "data-v-9c67fe37"]]), wt = {}, Mt = { class: "menu-label" };
function xt(e, u) {
  return t(), i("span", Mt, [
    xe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Me = /* @__PURE__ */ ae(wt, [["render", xt], ["__scopeId", "data-v-71c11156"]]), $t = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Ct = {
  key: 0,
  class: "skills-none"
}, St = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: u }) {
    const s = e, d = u, a = x(() => s.skills.filter((T) => T.state === "loaded")), M = x(() => s.skills.filter((T) => T.state !== "loaded"));
    return (T, A) => (t(), i("div", $t, [
      k(Me, null, {
        default: S(() => [...A[1] || (A[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? f("", !0) : (t(), i("p", Ct, "None yet. Compacting the conversation empties this list.")),
      (t(!0), i(V, null, te(a.value, (y) => (t(), i("p", {
        key: y.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        k(ee, {
          name: "book",
          size: 12
        }),
        h(p(y.skill), 1)
      ]))), 128)),
      M.value.length ? (t(), i(V, { key: 1 }, [
        k(Me, null, {
          default: S(() => [...A[2] || (A[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), i(V, null, te(M.value, (y) => (t(), i("p", {
          key: y.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          k(ee, {
            name: "book",
            size: 12
          }),
          h(p(y.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      k(be, {
        "data-agent-skills-browse": "",
        onClick: A[0] || (A[0] = (y) => d("browse"))
      }, {
        default: S(() => [...A[3] || (A[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, At = /* @__PURE__ */ ae(St, [["__scopeId", "data-v-27140adf"]]), jt = (e, u, s) => Math.max(u, Math.min(s, e)), Pe = /* @__PURE__ */ new WeakMap(), Tt = (e, u) => Pe.set(e, u);
function Rt(e, u) {
  for (let s = u; s; s = Pe.get(s) ?? s.parentElement) if (s === e) return !0;
  return !1;
}
function zt(e, u) {
  const s = (d) => {
    var M, T;
    const a = ((M = e.value) == null ? void 0 : M.element) || ((T = e.value) == null ? void 0 : T.$el) || e.value;
    a && !Rt(a, d.target) && u(d);
  };
  window.addEventListener("click", s), je(() => window.removeEventListener("click", s));
}
const ye = 8, Vt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    align: { type: String, default: "auto" },
    minWidth: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    gap: { type: Number, default: 4 },
    height: { type: Number, default: 0 },
    plain: Boolean
  },
  emits: ["close"],
  setup(e, { expose: u, emit: s }) {
    const d = e, a = C(null), M = (g) => g ? `${g}px` : void 0, T = x(() => ({
      minWidth: M(d.minWidth),
      maxWidth: M(d.maxWidth),
      maxHeight: M(d.maxHeight),
      height: M(d.height)
    })), A = C({ w: 0, h: 0 }), y = C(d.anchor ? d.anchor.getBoundingClientRect() : null), D = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), j = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), z = (g) => {
      const R = g.closest(".pane, .float-window");
      return R ? j(R.getBoundingClientRect()) : D();
    }, O = (g, R) => `${Math.max(0, g ? Math.min(g, R) : R)}px`;
    function N(g, R) {
      return {
        below: g.bottom - R.bottom - d.gap - ye,
        above: R.top - g.top - d.gap - ye,
        across: g.right - g.left - 2 * ye
      };
    }
    function U(g) {
      const R = z(d.anchor), P = N(R, g);
      return A.value.w <= P.across && A.value.h <= Math.max(P.below, P.above) ? R : D();
    }
    const H = x(() => {
      if (!y.value) return T.value;
      const g = y.value, R = U(g), P = N(R, g), { w: Y, h: Q } = A.value, X = d.align === "auto" ? g.left + g.right > R.left + R.right : d.align === "right", ie = jt(X ? g.right - Y : g.left, R.left + ye, Math.max(R.left + ye, R.right - Y - ye)), me = Q > P.below && P.above > P.below ? { bottom: `${window.innerHeight - g.top + d.gap}px`, maxHeight: O(d.maxHeight, P.above) } : { top: `${g.bottom + d.gap}px`, maxHeight: O(d.maxHeight, P.below) };
      return { ...T.value, ...me, left: `${ie}px`, maxWidth: O(d.maxWidth, P.across) };
    }), q = s, L = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function E(g) {
      const R = L(), P = R.indexOf(document.activeElement);
      R[(P + g + R.length) % R.length].focus();
    }
    const J = { ArrowDown: () => E(1), ArrowUp: () => E(-1), Escape: () => q("close") }, F = (g) => J[g.key] && (g.preventDefault(), J[g.key]()), W = () => a.value && (A.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let G = 0;
    const b = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(W);
    });
    zt(a, (g) => d.anchor && !d.anchor.contains(g.target) && q("close"));
    const n = (g, R) => ["top", "left", "right", "bottom"].some((P) => Math.abs(g[P] - R[P]) > 1), o = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let l = 0;
    function B() {
      if (d.anchor) {
        const g = d.anchor.getBoundingClientRect();
        if (!d.anchor.isConnected || o(g)) return q("close");
        n(g, y.value) && (y.value = g);
      }
      l = requestAnimationFrame(B);
    }
    return _e(() => {
      d.anchor && a.value && Tt(a.value, d.anchor), W(), a.value && b.observe(a.value), !d.plain && L()[0] && L()[0].focus(), B();
    }), je(() => {
      b.disconnect(), cancelAnimationFrame(l), cancelAnimationFrame(G);
    }), u({ element: a }), (g, R) => (t(), _(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ge({
        ref_key: "panel",
        ref: a
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: H.value,
        onKeydown: F
      }), [
        xe(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Lt = /* @__PURE__ */ ae(Vt, [["__scopeId", "data-v-7f046e0d"]]);
async function Ot(e, u, s) {
  if (!e) return s(u);
  const { target: d, fields: a } = e, M = Object.fromEntries(Object.keys(a).map((y) => [y, d[y]])), T = () => Object.assign(d, M);
  Object.assign(d, a);
  let A = !1;
  try {
    const y = await s(u);
    return A = y.ok, y;
  } finally {
    A || T();
  }
}
function Ht(e, u, s) {
  const d = C([]), a = C([]), M = C({}), T = C(""), A = C(!1), y = x(() => !!e.value && !e.value.ended_at), D = x(() => y.value && !!e.value.paused_at);
  async function j() {
    if (y.value) {
      const q = await u(["agent", "controls", String(e.value.id)]);
      d.value = q.ok ? q.value.groups : [];
      return;
    }
    const H = await u(["agent", "programs"]);
    a.value = H.ok ? H.value.rows : [];
  }
  async function z(H, q = null) {
    T.value = "";
    const L = await Ot(q, H, u);
    return T.value = L.ok ? "" : L.error, s(), L;
  }
  const O = (H, q) => z(["agent", "control", String(e.value.id), H, q.value], { target: M, fields: { value: { ...M.value, [H]: q.label } } }), N = () => (A.value = !1, z(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), U = (H) => z(["agent", "launch", H.name]);
  return _e(j), ce(y, j), { groups: d, programs: a, chosen: M, failure: T, asking: A, running: y, paused: D, choose: O, stop: N, start: U };
}
const Ue = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ue).map(([e, u]) => ({ key: e, label: u }));
function Bt(e, u = "agent") {
  return Ue[e] || u;
}
function It(e) {
  if (!e) return "Not compacted yet";
  const u = new Date(e.at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.from_percent === null ? `Last compacted ${u}` : e.to_percent === null ? `Last compacted ${u}, from ${e.from_percent}%` : `Last compacted ${u}, from ${e.from_percent}% to ${e.to_percent}%, ${e.from_percent - e.to_percent}% taken off`;
}
const _t = ["disabled", "title"], Et = ["title"], Nt = { class: "gauge usage" }, qt = ["disabled", "title"], Ft = { class: "gauge" }, Wt = ["disabled", "title"], Dt = ["disabled"], Pt = ["disabled"], Ut = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Jt = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Kt = ["title"], Zt = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Gt = { class: "gauge" }, Yt = { class: "context-used" }, Qt = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Xt = 75, ea = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    loading: Boolean,
    jobs: { type: Number, default: 0 },
    usage: { type: Object, default: () => ({ agents: [], windows: [] }) },
    branch: { type: String, default: "" },
    now: { type: Number, default: () => Date.now() },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed"],
  setup(e, { emit: u }) {
    const s = e, d = u, a = Ht(Ye(s, "agent"), s.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => d("changed")), M = C(null), T = C(""), A = x(() => a.groups.value.find((b) => b.key === T.value));
    function y(b, n) {
      M.value = b.currentTarget, T.value = n;
    }
    function D() {
      M.value = null, T.value = "", a.asking.value = !1;
    }
    const j = C([]), z = x(() => j.value.filter((b) => b.state === "loaded"));
    async function O() {
      const b = s.agent && s.run ? await s.run(["agent-skill", "list", "--agent", String(s.agent.id)]) : null;
      j.value = b != null && b.ok ? b.value.rows ?? [] : [];
    }
    function N(b) {
      y(b, "skills"), O();
    }
    ce(() => {
      var b;
      return (b = s.agent) == null ? void 0 : b.id;
    }, O, { immediate: !0 });
    const U = (b) => a.groups.value.some((n) => n.key === b), H = x(() => {
      var b;
      return a.chosen.value.model ?? ((b = L.value) == null ? void 0 : b.model) ?? "";
    }), q = x(() => {
      var b;
      return a.chosen.value.effort ?? ((b = L.value) == null ? void 0 : b.effort) ?? "";
    });
    x(() => !!s.agent && !s.agent.ended_at);
    const L = x(() => {
      var b;
      return ((b = s.usage.agents) == null ? void 0 : b.find((n) => {
        var o;
        return n.id === ((o = s.agent) == null ? void 0 : o.id);
      })) ?? null;
    }), E = x(() => {
      var b;
      return ((b = s.usage.windows) == null ? void 0 : b[0]) ?? null;
    }), J = x(() => E.value ? Math.max(0, Math.min(100, Math.round(E.value.used_percent))) : null), F = x(() => {
      var b;
      return ((b = L.value) == null ? void 0 : b.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), W = x(() => {
      var b;
      return (b = L.value) != null && b.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), G = x(() => {
      var o;
      const b = (o = s.agent) != null && o.process_started_at ? new Date(s.agent.process_started_at).getTime() : 0;
      if (!b) return "";
      const n = Math.max(0, Math.floor((s.now - b) / 6e4));
      return n >= 60 ? `${Math.floor(n / 60)}h ${n % 60}m` : `${n}m`;
    });
    return (b, n) => (t(), i("div", {
      class: oe(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (t(), i(V, { key: 0 }, [
        v("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: n[0] || (n[0] = (o) => y(o, "agent"))
        }, [
          k(ee, {
            name: "agents",
            size: 12
          }),
          h(" " + p(m(Bt)(e.agent.program)), 1)
        ], 8, _t),
        J.value !== null ? (t(), i("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${J.value}% of the plan's ${E.value.title} allowance used`,
          onClick: n[1] || (n[1] = (o) => d("open", "usage", o.currentTarget))
        }, [
          k(ee, {
            name: "clock",
            size: 12
          }),
          n[14] || (n[14] = h()),
          v("span", Nt, [
            v("span", {
              style: de({ width: `${J.value}%` })
            }, null, 4)
          ]),
          h(" " + p(J.value) + "% ", 1)
        ], 8, Et)) : f("", !0),
        F.value !== null ? (t(), i("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${F.value}% full: clear or compact it`,
          onClick: n[2] || (n[2] = (o) => U("context") ? y(o, "context") : d("open", "context", o.currentTarget))
        }, [
          k(ee, {
            name: "gauge",
            size: 12
          }),
          n[15] || (n[15] = h()),
          v("span", Ft, [
            v("span", {
              style: de({ width: `${F.value}%` })
            }, null, 4)
          ]),
          h(" " + p(F.value) + "% ", 1)
        ], 8, qt)) : f("", !0),
        H.value ? (t(), i("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${H.value}: change the model`,
          onClick: n[3] || (n[3] = (o) => U("model") ? y(o, "model") : null)
        }, [
          k(ee, {
            name: "model",
            size: 12
          }),
          h(" " + p(H.value), 1)
        ], 8, Wt)) : f("", !0),
        U("effort") || e.card && q.value ? (t(), i("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: n[4] || (n[4] = (o) => y(o, "effort"))
        }, [
          k(ee, {
            name: "bolt",
            size: 12
          }),
          h(" " + p(q.value), 1)
        ], 8, Dt)) : f("", !0),
        W.value ? (t(), i("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: n[5] || (n[5] = (o) => d("open", "cost", o.currentTarget))
        }, p(W.value), 9, Pt)) : f("", !0),
        G.value ? (t(), i("span", Ut, [
          k(ee, {
            name: "reminders",
            size: 12
          }),
          h(" " + p(G.value), 1)
        ])) : f("", !0),
        e.branch ? (t(), i("span", Jt, [
          k(ee, {
            name: "branch",
            size: 12
          }),
          h(" " + p(e.branch), 1)
        ])) : f("", !0),
        e.card ? f("", !0) : (t(), i("button", {
          key: 7,
          type: "button",
          class: oe(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: n[6] || (n[6] = (o) => d("open", "jobs", o.currentTarget))
        }, [
          k(ee, {
            name: "clock",
            size: 12
          }),
          h(" " + p(e.jobs), 1)
        ], 2)),
        e.run ? (t(), i("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: N
        }, [
          k(ee, {
            name: "book",
            size: 12
          }),
          h(" " + p(z.value.length), 1)
        ])) : f("", !0),
        e.fitness ? (t(), i(V, { key: 9 }, [
          v("button", {
            type: "button",
            class: oe(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Xt }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: n[7] || (n[7] = (o) => d("open", "fitness", o.currentTarget))
          }, [
            k(ee, {
              name: "heart",
              size: 12
            }),
            h(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          v("button", {
            type: "button",
            class: oe(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: n[8] || (n[8] = (o) => d("open", "load", o.currentTarget))
          }, [
            k(ee, {
              name: "weight",
              size: 12
            }),
            h(" " + p(e.fitness.workload), 1)
          ], 2)
        ], 64)) : f("", !0)
      ], 64)) : e.run && !e.loading ? (t(), i("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: n[9] || (n[9] = (o) => y(o, "start"))
      }, [
        k(ee, {
          name: "agents",
          size: 12
        }),
        n[16] || (n[16] = h(" Start an agent", -1))
      ])) : f("", !0),
      n[22] || (n[22] = v("span", { class: "space" }, null, -1)),
      m(a).failure.value ? (t(), i("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: m(a).failure.value
      }, p(m(a).failure.value), 9, Kt)) : f("", !0),
      xe(b.$slots, "default", {}, void 0, !0),
      M.value ? (t(), _(Lt, {
        key: 3,
        anchor: M.value,
        "min-width": 190,
        onClose: D
      }, {
        default: S(() => {
          var o;
          return [
            T.value === "agent" ? (t(), i(V, { key: 0 }, [
              m(a).asking.value ? (t(), i(V, { key: 0 }, [
                k(Me, { "data-agent-stop-ask": "" }, {
                  default: S(() => [...n[17] || (n[17] = [
                    h("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                k(be, {
                  "data-agent-stop-confirm": "",
                  onClick: n[10] || (n[10] = (l) => (D(), m(a).stop()))
                }, {
                  default: S(() => [...n[18] || (n[18] = [
                    h("Stop it", -1)
                  ])]),
                  _: 1
                }),
                k(be, {
                  onClick: n[11] || (n[11] = (l) => m(a).asking.value = !1)
                }, {
                  default: S(() => [...n[19] || (n[19] = [
                    h("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (t(), _(be, {
                key: 1,
                "data-agent-stop": "",
                onClick: n[12] || (n[12] = (l) => m(a).asking.value = !0)
              }, {
                default: S(() => [...n[20] || (n[20] = [
                  h("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : T.value === "start" ? (t(), i(V, { key: 1 }, [
              k(Me, null, {
                default: S(() => [...n[21] || (n[21] = [
                  h("Start an agent", -1)
                ])]),
                _: 1
              }),
              (t(!0), i(V, null, te(m(a).programs.value, (l) => (t(), _(be, {
                key: l.name,
                "data-agent-program": l.name,
                onClick: (B) => (D(), m(a).start(l))
              }, {
                default: S(() => [
                  h(p(l.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : T.value === "skills" ? (t(), _(At, {
              key: 2,
              skills: j.value,
              onBrowse: n[13] || (n[13] = (l) => (D(), d("open", "skills", null)))
            }, null, 8, ["skills"])) : A.value ? (t(), i(V, { key: 3 }, [
              k(Me, null, {
                default: S(() => [
                  h(p(A.value.label), 1)
                ]),
                _: 1
              }),
              T.value === "context" ? (t(), i(V, { key: 0 }, [
                v("div", Zt, [
                  v("span", Gt, [
                    v("span", {
                      style: de({ width: `${F.value}%` })
                    }, null, 4)
                  ]),
                  v("span", Yt, p(F.value) + "%", 1)
                ]),
                v("p", Qt, p(m(It)(((o = L.value) == null ? void 0 : o.last_compaction) ?? null)), 1)
              ], 64)) : f("", !0),
              (t(!0), i(V, null, te(A.value.choices, (l) => (t(), _(be, {
                key: l.value,
                "data-agent-choice": l.value,
                onClick: (B) => (m(a).choose(A.value.key, l), D())
              }, {
                default: S(() => [
                  h(p(l.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : f("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : f("", !0)
    ], 2));
  }
}, ta = /* @__PURE__ */ ae(ea, [["__scopeId", "data-v-d5933ce4"]]), aa = {
  class: "agent-command",
  "data-agent-command": ""
}, na = {
  key: 1,
  "data-agent-stopped": ""
}, la = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (u, s) => (t(), i("span", aa, [
      e.waitReason ? (t(), i("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: s[0] || (s[0] = se((d) => m(Se)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + p(e.waitReason) + " ", 1),
        k(m(Ae), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), i("span", na, "Waiting")) : (t(), _(m(nt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Be = /* @__PURE__ */ ae(la, [["__scopeId", "data-v-bb905922"]]), sa = ["data-agent-delegated", "onClick"], oa = { class: "agent-task-number" }, ia = { class: "agent-task-title" }, ra = ["title"], ua = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: u }) {
    const s = u;
    return (d, a) => (t(), _(m(Ee), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (M) => s("toggle"))
    }, {
      default: S(() => [
        (t(!0), i(V, null, te(e.section.tasks, (M) => (t(), i("button", {
          key: M.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": M.id,
          onClick: (T) => m(Se)(`tasks:${M.id}`)
        }, [
          k(m(lt), {
            status: M.state
          }, null, 8, ["status"]),
          v("span", oa, p(M.id), 1),
          v("span", ia, p(M.title), 1),
          M.plan_id ? (t(), i("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${M.plan_id}: ${M.plan_title}`
          }, "Plan " + p(M.plan_id) + ": " + p(M.plan_title), 9, ra)) : f("", !0)
        ], 8, sa))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, da = /* @__PURE__ */ ae(ua, [["__scopeId", "data-v-acc154a9"]]), ca = { class: "action-field" }, va = ["value", "disabled"], ga = ["value"], pa = { key: 1 }, ma = {
  key: 1,
  class: "action-field"
}, ha = { class: "action-buttons" }, fa = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (u, s) => (t(), i("form", {
      onSubmit: s[4] || (s[4] = se((d) => u.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), i(V, { key: 0 }, [
        v("label", ca, [
          s[6] || (s[6] = h("Task ", -1)),
          v("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: s[0] || (s[0] = (d) => u.$emit("update:task", d.target.value))
          }, [
            s[5] || (s[5] = v("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), i(V, null, te(e.tasks, (d) => (t(), i("option", {
              key: d.id,
              value: String(d.id)
            }, p(d.id) + ": " + p(d.title), 9, ga))), 128))
          ], 40, va)
        ]),
        e.moreTasks ? (t(), _(m(ne), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: s[1] || (s[1] = (d) => u.$emit("more"))
        }, {
          default: S(() => [...s[7] || (s[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), i("p", pa, "No open tasks.")) : f("", !0)
      ], 64)) : (t(), i("label", ma, [
        s[8] || (s[8] = h("Job", -1)),
        k(m(Ne), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: s[2] || (s[2] = (d) => u.$emit("update:text", d.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      v("div", ha, [
        k(m(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...s[9] || (s[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(m(ne), {
          small: "",
          disabled: e.pending,
          onClick: s[3] || (s[3] = (d) => u.$emit("cancel"))
        }, {
          default: S(() => [...s[10] || (s[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ka = /* @__PURE__ */ ae(fa, [["__scopeId", "data-v-356a2712"]]), ya = { class: "action-field" }, ba = { class: "action-buttons" }, wa = {
  __name: "AgentMessageForm",
  props: { text: String, pending: Boolean },
  emits: ["submit", "cancel", "update:text"],
  setup(e) {
    return (u, s) => (t(), i("form", {
      onSubmit: s[2] || (s[2] = se((d) => u.$emit("submit"), ["prevent"]))
    }, [
      v("label", ya, [
        s[3] || (s[3] = h("Message", -1)),
        k(m(Ne), {
          value: e.text,
          disabled: e.pending,
          "data-agent-message-text": "",
          onInput: s[0] || (s[0] = (d) => u.$emit("update:text", d.target.value))
        }, null, 8, ["value", "disabled"])
      ]),
      v("div", ba, [
        k(m(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.text.trim(),
          "data-agent-submit-message": ""
        }, {
          default: S(() => [...s[4] || (s[4] = [
            h("Send the message", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(m(ne), {
          small: "",
          disabled: e.pending,
          onClick: s[1] || (s[1] = (d) => u.$emit("cancel"))
        }, {
          default: S(() => [...s[5] || (s[5] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ma = /* @__PURE__ */ ae(wa, [["__scopeId", "data-v-a6a1f785"]]), xa = { class: "action-buttons" }, $a = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (u, s) => (t(), i("form", {
      "data-agent-retire-confirm": "",
      onSubmit: s[2] || (s[2] = se((d) => u.$emit("submit"), ["prevent"]))
    }, [
      s[5] || (s[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      k(m(ze), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": s[0] || (s[0] = (d) => u.$emit("update:reason", d))
      }, null, 8, ["model-value", "disabled"]),
      v("div", xa, [
        k(m(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...s[3] || (s[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(m(ne), {
          small: "",
          disabled: e.pending,
          onClick: s[1] || (s[1] = (d) => u.$emit("cancel"))
        }, {
          default: S(() => [...s[4] || (s[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ca = /* @__PURE__ */ ae($a, [["__scopeId", "data-v-bbe4e841"]]), Sa = { class: "action-buttons" }, Aa = {
  key: 0,
  role: "alert"
}, ja = {
  key: 1,
  role: "status"
}, Ta = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const u = e, s = Te(), d = C(""), a = C(""), M = C(""), T = C(""), A = C([]), y = C(0), D = C(!1), j = C(!1), z = C(!1), O = C(""), N = C(""), U = x(() => !!u.row.retired_at || u.row.state === "retired"), H = x(() => !U.value && !!u.row.ended_at), q = x(() => {
      var o;
      return H.value && ((o = u.row.job_command) == null ? void 0 : o.length) && !u.row.resume_reason;
    }), L = x(() => q.value && !j.value && (u.row.job_task_flag ? A.value.some((o) => String(o.id) === T.value) : !!a.value.trim()));
    function E(o) {
      d.value = o, a.value = "", M.value = "", T.value = "", O.value = "", N.value = "";
    }
    async function J() {
      E("job"), u.row.job_task_flag && (A.value = [], y.value = 0, D.value = !1, await F());
    }
    async function F() {
      if (!j.value) {
        j.value = !0;
        try {
          const o = await s.read(`task list --state open --limit 100 --page ${y.value + 1}`);
          O.value = o.ok ? "" : o.error, o.ok && (A.value = [...A.value, ...o.value.rows], y.value = o.value.page, D.value = o.value.page * o.value.size < o.value.total);
        } finally {
          j.value = !1;
        }
      }
    }
    async function W(o, l) {
      if (!z.value) {
        z.value = !0, O.value = "";
        try {
          const B = await s.run(o);
          O.value = B.ok ? "" : B.error, B.ok && (E(""), N.value = l);
        } finally {
          z.value = !1;
        }
      }
    }
    async function G() {
      if (!L.value) return;
      const o = u.row.job_task_flag ? [u.row.job_task_flag, T.value] : [a.value.trim()];
      await W([...u.row.job_command, String(u.row.id), ...o], "Job sent.");
    }
    async function b() {
      U.value || H.value || !a.value.trim() || await W(["message", "send", a.value.trim(), "--target-agent", String(u.row.id)], "Message sent.");
    }
    async function n() {
      !H.value || d.value !== "retire" || !M.value.trim() || await W(["agent", "retire", String(u.row.id), "--reason", M.value.trim()], "Agent retired permanently.");
    }
    return (o, l) => {
      var B;
      return U.value ? f("", !0) : (t(), i("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: l[9] || (l[9] = se(() => {
        }, ["stop"])),
        onKeydown: l[10] || (l[10] = se(() => {
        }, ["stop"]))
      }, [
        v("div", Sa, [
          H.value ? (t(), i(V, { key: 0 }, [
            (B = e.row.job_command) != null && B.length ? (t(), _(m(ne), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: z.value || j.value || !q.value,
              onClick: J
            }, {
              default: S(() => [...l[11] || (l[11] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (t(), _(m(ne), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: z.value || j.value,
              onClick: l[0] || (l[0] = (g) => E("retire"))
            }, {
              default: S(() => [...l[12] || (l[12] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : (t(), _(m(ne), {
            key: 1,
            small: "",
            "data-agent-send-message": "",
            disabled: z.value,
            onClick: l[1] || (l[1] = (g) => E("message"))
          }, {
            default: S(() => [...l[13] || (l[13] = [
              h("Send a message", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        k(m(qe), { value: d.value }, {
          job: S(() => [
            k(ka, {
              task: T.value,
              "onUpdate:task": l[2] || (l[2] = (g) => T.value = g),
              text: a.value,
              "onUpdate:text": l[3] || (l[3] = (g) => a.value = g),
              row: e.row,
              tasks: A.value,
              pending: z.value,
              loading: j.value,
              "more-tasks": D.value,
              failure: O.value,
              "job-ready": L.value,
              onSubmit: G,
              onMore: F,
              onCancel: l[4] || (l[4] = (g) => E(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          message: S(() => [
            k(Ma, {
              text: a.value,
              "onUpdate:text": l[5] || (l[5] = (g) => a.value = g),
              pending: z.value,
              onSubmit: b,
              onCancel: l[6] || (l[6] = (g) => E(""))
            }, null, 8, ["text", "pending"])
          ]),
          retire: S(() => [
            k(Ca, {
              reason: M.value,
              "onUpdate:reason": l[7] || (l[7] = (g) => M.value = g),
              pending: z.value,
              onSubmit: n,
              onCancel: l[8] || (l[8] = (g) => E(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        O.value ? (t(), i("p", Aa, p(O.value), 1)) : f("", !0),
        N.value ? (t(), i("p", ja, p(N.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, Ra = /* @__PURE__ */ ae(Ta, [["__scopeId", "data-v-b34af637"]]), za = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Va = { class: "agent-head" }, La = ["data-state"], Oa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Ha = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ba = { class: "agent-times" }, Ia = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, _a = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ea = { class: "agent-line" }, Na = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, qa = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Fa = {
  key: 0,
  class: "agent-line agent-work-start"
}, Wa = ["data-peek"], Da = ["title"], Pa = ["data-peek"], Ua = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Ja = {
  key: 2,
  class: "agent-summary",
  "data-agent-report": ""
}, Ka = {
  key: 3,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Za = {
  key: 4,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ga = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, Ya = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Qa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Xa = {
  key: 0,
  class: "agent-helper-brief"
}, en = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, tn = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, an = "It ended without a report", nn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: u }) {
    const s = { helper: "Helper", reviewer: "Reviewer" }, d = ["started", "blocked", "open", "completed"], a = e, M = u, T = st(), A = x(() => {
      var r, $;
      if ((r = a.facts) != null && r.profile_title) return a.facts.profile_title;
      if (($ = a.facts) != null && $.profile) return a.facts.profile;
      const c = s[a.row.role] || a.row.role;
      return c.slice(0, 1).toUpperCase() + c.slice(1);
    }), y = x(() => {
      var c;
      return ((c = a.facts) == null ? void 0 : c.tasks) ?? [];
    }), D = x(() => y.value.filter((c) => c.state === "open")), j = x(() => {
      const c = y.value.find((r) => {
        var $;
        return r.id === (($ = a.facts) == null ? void 0 : $.task_id);
      });
      return c != null && c.plan_id ? c : D.value.find((r) => r.plan_id);
    }), z = x(() => {
      var c, r, $, w, I;
      return a.row.role === "helper" ? ((c = a.facts) == null ? void 0 : c.helper_job) || "" : (r = a.facts) != null && r.job_enabled && ((($ = a.facts) == null ? void 0 : $.task_title) || ((w = D.value[0]) == null ? void 0 : w.title) || ((I = y.value.at(-1)) == null ? void 0 : I.title)) || "";
    }), O = x(() => {
      var c;
      return ((c = a.facts) == null ? void 0 : c.job_returned) || a.row.job_returned || "";
    }), N = x(() => {
      const c = z.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return c ? `${c[1].toLowerCase() === "plan" ? "plans" : "docs"}:${c[2]}` : "";
    }), U = x(() => {
      var c, r;
      return [a.row.program, (c = a.facts) == null ? void 0 : c.model, (r = a.facts) == null ? void 0 : r.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role, a.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), H = x(() => {
      var c, r;
      return a.row.ended_at && ((r = (c = a.facts) == null ? void 0 : c.job_returned) != null && r.startsWith(an)) ? a.facts.job_returned : "";
    }), q = x(() => ot(a.row.process_started_at || a.row.created_at, T.value)), L = /* @__PURE__ */ new Set(["open", "started", "testing"]), E = x(() => !!a.row.ended_at && a.row.role !== "main" && y.value.some((c) => L.has(c.state))), J = x(() => {
      var c;
      return a.waitReason || E.value ? "waiting" : a.row.state === "running" && ((c = a.facts) == null ? void 0 : c.state) || a.row.state;
    }), F = x(() => {
      var c;
      return ((c = a.progress) == null ? void 0 : c.completed_count) ?? y.value.filter((r) => r.state === "completed").length;
    }), W = x(() => {
      var c;
      return ((c = a.progress) == null ? void 0 : c.task_count) ?? y.value.length;
    }), G = x(() => `${F.value} of ${W.value} ${W.value === 1 ? "task" : "tasks"}`), b = x(() => {
      var r;
      const c = it(F.value, ((r = a.progress) == null ? void 0 : r.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, T.value);
      return a.row.role !== "main" && c ? `${c} per hour` : "";
    }), n = x(() => y.value.length ? d.map((c) => ({ state: c, label: c.slice(0, 1).toUpperCase() + c.slice(1), tasks: y.value.filter((r) => r.state === c || c === "started" && r.state === "testing" || c === "completed" && r.state === "cancelled") })) : []), o = /* @__PURE__ */ new Set(["completed"]), l = C({}), B = (c) => !(l.value[c] ?? o.has(c)), g = (c) => l.value = { ...l.value, [c]: B(c) }, R = Te(), P = x(() => a.row.access === "read-only"), Y = x(() => !!a.row.retired_at || a.row.state === "retired"), Q = x(() => Y.value ? R.tabs.filter((c) => c.key === "transcript") : P.value ? R.tabs.filter((c) => ["transcript", "terminal"].includes(c.key)) : R.tabs), X = C(Q.value[0]);
    ce(Q, (c) => {
      c.some((r) => {
        var $;
        return r.key === (($ = X.value) == null ? void 0 : $.key);
      }) || (X.value = c[0]);
    }), ce(() => a.open, (c) => {
      c && (X.value = Q.value[0]);
    });
    const ie = Object.fromEntries(R.tabs.filter((c) => c.component).map((c) => [c.key, Qe(() => rt(c.component))])), pe = x(() => a.row.role === "helper" && !a.row.ended_at), me = () => R.run(["helper", "stop", String(a.row.id)]), ue = C(!1), re = C(""), he = C(""), fe = x(() => a.row.role !== "main" && (!a.row.ended_at || E.value || a.waitReason));
    async function ke() {
      if (!fe.value) return;
      const c = await R.read(`usage tool --agent ${a.row.id}`, { deferred: !0 });
      re.value = c.ok ? c.value.tool : "", he.value = c.ok ? c.value.note : "";
    }
    const we = R.follow(["hook_call.*", "process_part.*"], Fe(ke, We.agentCommand));
    return je(() => we == null ? void 0 : we()), ke(), (c, r) => {
      var $, w, I, ve;
      return t(), i("div", {
        class: oe(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: r[6] || (r[6] = (K) => !e.open && M("toggle")),
        onKeydown: [
          r[7] || (r[7] = Ve(se((K) => !e.open && M("toggle"), ["self", "prevent"]), ["enter"])),
          r[8] || (r[8] = Ve(se((K) => !e.open && M("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        v("span", Va, [
          e.open ? (t(), i("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: r[0] || (r[0] = se((K) => M("toggle"), ["stop"]))
          }, [
            k(m(Ae), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : f("", !0),
          v("span", {
            class: "agent-dot",
            "data-state": J.value,
            "data-agent-motion": ""
          }, null, 8, La),
          v("span", Oa, p(A.value), 1),
          v("span", Ha, p((($ = e.facts) == null ? void 0 : $.given_name) || e.row.id), 1),
          e.open ? f("", !0) : (t(), _(m(Ae), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          v("span", Ba, [
            e.row.ended_at && !E.value ? (t(), _(m(Oe), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (t(), i("span", Ia, p(q.value), 1)),
            (w = e.facts) != null && w.last_activity ? (t(), i("span", _a, [
              r[9] || (r[9] = h("Last heard: ", -1)),
              k(m(Oe), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : f("", !0)
          ])
        ]),
        v("span", Ea, [
          v("span", Na, p(U.value), 1),
          W.value && !z.value ? (t(), i("span", qa, p(G.value), 1)) : f("", !0)
        ]),
        j.value ? (t(), i("span", Fa, [
          v("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${j.value.plan_id}`,
            onClick: r[1] || (r[1] = se((K) => m(Se)(`plans:${j.value.plan_id}`), ["stop"]))
          }, "Plan " + p(j.value.plan_id) + ": " + p(j.value.plan_title), 9, Wa)
        ])) : f("", !0),
        z.value ? (t(), i("span", {
          key: 1,
          class: oe(["agent-line", { "agent-work-start": !j.value }])
        }, [
          v("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: z.value
          }, [
            N.value ? (t(), i("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": N.value,
              onClick: r[2] || (r[2] = se((K) => m(Se)(N.value), ["stop"]))
            }, p(z.value), 9, Pa)) : (t(), i(V, { key: 1 }, [
              h(p(z.value), 1)
            ], 64))
          ], 8, Da),
          W.value ? (t(), i("span", Ua, p(G.value), 1)) : f("", !0)
        ], 2)) : f("", !0),
        O.value ? (t(), i("p", Ja, [
          r[10] || (r[10] = v("span", null, "Last report: ", -1)),
          h(p(O.value), 1)
        ])) : f("", !0),
        e.row.retirement_reason ? (t(), i("p", Ka, "Retirement reason: " + p(e.row.retirement_reason), 1)) : f("", !0),
        e.row.resume_reason ? (t(), i("p", Za, p(e.row.resume_reason), 1)) : f("", !0),
        k(Ra, { row: e.row }, null, 8, ["row"]),
        !e.open && (fe.value || W.value && b.value) ? (t(), i("span", {
          key: 5,
          class: oe(["agent-foot", { "agent-work-start": !z.value && !j.value }]),
          "data-agent-foot": ""
        }, [
          fe.value ? (t(), _(Be, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: E.value,
            command: re.value,
            note: he.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
          W.value && b.value ? (t(), i("span", Ga, p(b.value), 1)) : f("", !0)
        ], 2)) : f("", !0),
        e.open ? (t(), i("div", {
          key: 6,
          class: "agent-more",
          "data-agent-more": "",
          onClick: r[5] || (r[5] = se(() => {
          }, ["stop"]))
        }, [
          k(ta, {
            agent: e.row,
            branch: (I = e.progress) == null ? void 0 : I.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: S(() => [
              pe.value ? (t(), _(m(ne), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: me
              }, {
                default: S(() => [...r[11] || (r[11] = [
                  h("Stop", -1)
                ])]),
                _: 1
              })) : f("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          fe.value ? (t(), _(Be, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: E.value,
            command: re.value,
            note: he.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
          H.value ? (t(), i("p", Ya, p(H.value), 1)) : f("", !0),
          k(m(ut), {
            class: "agent-tabs",
            tabs: Q.value,
            active: X.value,
            answer: { tasks: y.value.length },
            onChoose: r[3] || (r[3] = (K) => X.value = K)
          }, null, 8, ["tabs", "active", "answer"]),
          k(m(dt), {
            class: "agent-tab-body",
            tab: X.value,
            "data-agent-tab-body": (ve = X.value) == null ? void 0 : ve.key
          }, {
            default: S(() => {
              var K;
              return [
                k(m(qe), {
                  value: (K = X.value) == null ? void 0 : K.key
                }, Xe({
                  tasks: S(() => {
                    var Z;
                    return [
                      y.value.length ? f("", !0) : (t(), _(m(De), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: S(() => [...r[12] || (r[12] = [
                          h("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (t(!0), i(V, null, te(n.value, (le) => (t(), _(da, {
                        key: le.state,
                        section: le,
                        open: B(le.state),
                        onToggle: (ge) => g(le.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (Z = e.facts) != null && Z.instruction ? (t(), i(V, { key: 1 }, [
                        r[13] || (r[13] = v("p", { class: "agent-label" }, "Instruction", -1)),
                        v("div", Qa, p(e.facts.instruction), 1)
                      ], 64)) : f("", !0)
                    ];
                  }),
                  transcript: S(() => {
                    var Z;
                    return [
                      P.value ? (t(), i(V, { key: 0 }, [
                        (Z = e.facts) != null && Z.instruction ? (t(), i("div", Xa, [
                          k(m(Ee), {
                            label: "Instruction",
                            open: ue.value,
                            "data-agent-section": "instruction",
                            onToggle: r[4] || (r[4] = (le) => ue.value = !ue.value)
                          }, {
                            default: S(() => [
                              v("div", en, p(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (t(), i("p", tn, "No job recorded")) : f("", !0)
                      ], 64)) : f("", !0),
                      k(ht, {
                        line: `agent transcript ${e.row.id}`,
                        padding: "0"
                      }, null, 8, ["line"])
                    ];
                  }),
                  _: 2
                }, [
                  te(m(ie), (Z, le) => ({
                    name: le,
                    fn: S(() => [
                      (t(), _(et(Z), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : f("", !0)
      ], 42, za);
    };
  }
}, ln = /* @__PURE__ */ ae(nn, [["__scopeId", "data-v-8e803cad"]]), sn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, on = ["aria-expanded"], rn = { key: 0 }, un = { key: 1 }, dn = { class: "limits-panel" }, cn = { class: "limits-head" }, vn = ["data-agent-limit-type", "data-agent-limit-profile"], gn = { class: "count" }, pn = { class: "bar" }, mn = { class: "count" }, hn = { class: "bar" }, fn = ["data-agent-limit-type"], kn = { class: "limit-field" }, yn = { class: "limit-field" }, bn = {
  key: 1,
  role: "alert"
}, wn = {
  key: 2,
  role: "status"
}, Mn = {
  __name: "AgentLimits",
  setup(e) {
    const u = Te(), s = C([]), d = C({}), a = C(!1), M = C(!1), T = C(!1), A = C(""), y = C(""), D = (n) => n === 0 ? "no limit" : String(n), j = (n, o) => o === 0 ? 0 : n > o ? 2 : n === o ? 1 : 0, z = x(() => s.value.flatMap((n) => n.per_profile && n.profiles.length ? n.profiles.map((o) => ({ ...o, label: o.title, type: n.key, key: `${n.key}:${o.profile}` })) : [n])), O = (n) => Math.max(j(n.running, n.run_limit), j(n.kept, n.kept_limit)), N = x(() => z.value.filter((n) => O(n)).sort((n, o) => O(o) - O(n))), U = x(() => s.value.reduce((n, o) => n + o.running, 0)), H = x(() => s.value.reduce((n, o) => n + o.kept, 0)), q = (n) => {
      const o = [n.run_limit ? n.running - n.run_limit : -1, n.kept_limit ? n.kept - n.kept_limit : -1], l = Math.max(...o);
      return l > 0 ? `Over by ${l}` : l === 0 ? "At limit" : "Within limits";
    }, L = (n, o) => o ? `${Math.min(n / Math.max(n, o) * 100, 100)}%` : "0%", E = (n, o) => o && n > o ? `${(n - o) / n * 100}%` : "0%";
    let J = 0;
    async function F() {
      const n = ++J, o = await u.read("agent limits");
      n === J && (s.value = o.ok ? o.value.rows : [], A.value = o.ok ? "" : o.error);
    }
    async function W(n) {
      const o = await Promise.all(s.value.flatMap((l) => [l.run_setting, l.kept_setting]).map(async (l) => {
        const B = await u.read(`setting show ${l}`);
        return [l, B.ok ? B.value.source : ""];
      }));
      n === J && (d.value = Object.fromEntries(o));
    }
    async function G() {
      M.value = !M.value, M.value && await W(J);
    }
    async function b(n, o, l, B) {
      if (T.value || u.readOnly) return;
      const g = Number(B.target.value);
      if (!Number.isInteger(g) || g < 0 || !B.target.value.trim()) {
        A.value = "Use a whole number of 0 or more.", B.target.value = String(l);
        return;
      }
      T.value = !0, y.value = "";
      try {
        const R = await u.run(["setting", "set", o, String(g), "--environment", u.environment]);
        if (A.value = R.ok ? "" : R.error, !R.ok) {
          B.target.value = String(l);
          return;
        }
        await F(), y.value = `${n.label} limits saved.`;
      } finally {
        T.value = !1;
      }
    }
    return u.follow(["agent.*", "setting.*"], F), F(), (n, o) => (t(), i("section", sn, [
      s.value.length ? (t(), i(V, { key: 0 }, [
        v("button", {
          class: "summary",
          type: "button",
          "aria-expanded": a.value,
          onClick: o[0] || (o[0] = (l) => a.value = !a.value)
        }, [
          N.value.length ? (t(), i(V, { key: 0 }, [
            (t(!0), i(V, null, te(N.value.slice(0, 2), (l) => (t(), i("span", {
              key: l.key,
              class: "summary-item"
            }, [
              v("span", {
                class: oe(["mark", { over: O(l) === 2 }])
              }, null, 2),
              h(p(l.label) + ": " + p(q(l)), 1)
            ]))), 128)),
            N.value.length > 2 ? (t(), i("span", rn, p(N.value.length - 2) + " more", 1)) : f("", !0)
          ], 64)) : (t(), i("span", un, "All within limits, " + p(U.value) + " running, " + p(H.value) + " kept", 1)),
          k(m(Ae), {
            name: "caret",
            size: 12
          })
        ], 8, on),
        tt(v("div", dn, [
          v("div", cn, [
            o[1] || (o[1] = v("strong", null, "Agent limits", -1)),
            k(m(ne), {
              small: "",
              disabled: T.value || m(u).readOnly,
              "data-agent-limits-edit": "",
              onClick: G
            }, {
              default: S(() => [
                h(p(M.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          M.value ? (t(), i(V, { key: 1 }, [
            (t(!0), i(V, null, te(s.value, (l) => (t(), i("div", {
              key: l.key,
              class: "edit-row",
              "data-agent-limit-type": l.key
            }, [
              v("strong", null, p(l.label), 1),
              v("label", kn, [
                v("span", null, [
                  o[3] || (o[3] = h("Running", -1)),
                  l.per_profile ? (t(), i(V, { key: 0 }, [
                    h(" per profile")
                  ], 64)) : f("", !0)
                ]),
                k(m(ze), {
                  type: "number",
                  min: "0",
                  value: String(l.run_limit),
                  disabled: T.value || m(u).readOnly,
                  "data-agent-run-limit": l.key,
                  onChange: (B) => b(l, l.run_setting, l.run_limit, B)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                v("small", null, p(d.value[l.run_setting]), 1)
              ]),
              v("label", yn, [
                v("span", null, [
                  o[4] || (o[4] = h("Kept", -1)),
                  l.per_profile ? (t(), i(V, { key: 0 }, [
                    h(" per profile")
                  ], 64)) : f("", !0)
                ]),
                k(m(ze), {
                  type: "number",
                  min: "0",
                  value: String(l.kept_limit),
                  disabled: T.value || m(u).readOnly,
                  "data-agent-kept-limit": l.key,
                  onChange: (B) => b(l, l.kept_setting, l.kept_limit, B)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                v("small", null, p(d.value[l.kept_setting]), 1)
              ])
            ], 8, fn))), 128)),
            v("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + p(m(u).environment) + ".", 1)
          ], 64)) : (t(), i(V, { key: 0 }, [
            o[2] || (o[2] = v("div", { class: "table-head" }, [
              v("span", null, "Agent"),
              v("span", null, "Running"),
              v("span", null, "Kept"),
              v("span", null, "Status")
            ], -1)),
            (t(!0), i(V, null, te(z.value, (l) => (t(), i("div", {
              key: l.key,
              class: "limit-row",
              "data-agent-limit-type": l.type || l.key,
              "data-agent-limit-profile": l.profile
            }, [
              v("strong", null, p(l.label), 1),
              v("div", gn, [
                v("span", null, p(l.run_limit ? `${l.running} of ${l.run_limit}` : `${l.running} · none may start`), 1),
                v("div", pn, [
                  v("span", {
                    style: de({ width: L(l.running, l.run_limit) })
                  }, null, 4),
                  v("i", {
                    style: de({ width: E(l.running, l.run_limit) })
                  }, null, 4)
                ])
              ]),
              v("div", mn, [
                v("span", null, p(l.kept) + " of " + p(D(l.kept_limit)), 1),
                v("div", hn, [
                  v("span", {
                    style: de({ width: L(l.kept, l.kept_limit) })
                  }, null, 4),
                  v("i", {
                    style: de({ width: E(l.kept, l.kept_limit) })
                  }, null, 4)
                ])
              ]),
              v("span", {
                class: oe(["status", { warning: O(l) === 1, danger: O(l) === 2 }])
              }, p(q(l)), 3)
            ], 8, vn))), 128))
          ], 64))
        ], 512), [
          [at, a.value]
        ])
      ], 64)) : f("", !0),
      A.value ? (t(), i("p", bn, p(A.value), 1)) : f("", !0),
      y.value ? (t(), i("p", wn, p(y.value), 1)) : f("", !0)
    ]));
  }
}, xn = /* @__PURE__ */ ae(Mn, [["__scopeId", "data-v-d42b4bd2"]]), $n = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Cn = ["data-agent-row"], Ie = "journal.agents.filters", Ce = "cubic-bezier(0.2, 0.9, 0.25, 1)", Sn = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const u = e, { rows: s } = ct("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: d } = He("waits"), { rows: a } = He("progress"), M = (r) => a.value.find(($) => $.agent_id === r.id) ?? null, T = (r) => {
      var $;
      return (($ = d.value.find((w) => w.agent_id === r.id)) == null ? void 0 : $.reason) ?? "";
    }, A = C("running"), y = C(""), D = JSON.parse(localStorage.getItem(Ie) || '{"roles":[],"profiles":[],"programs":[]}'), j = C(D), z = C({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), O = C([]), N = x(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), U = (r, $) => {
      j.value = mt(j.value, r, $);
    }, H = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, q = (r) => r.slice(0, 1).toUpperCase() + r.slice(1);
    ce(j, (r) => localStorage.setItem(Ie, JSON.stringify(r)));
    const L = Te();
    async function E() {
      const [r, $] = await Promise.all([L.read("agent cards --options"), L.read("agent programs")]);
      r.ok && (z.value = r.value), $.ok && (O.value = $.value.rows);
    }
    L.follow(["agent.*"], E), E();
    const J = C([]), F = C(""), W = C(!1), G = C(!1), b = C(25);
    let n = 0;
    async function o() {
      const r = ++n, $ = [
        ...j.value.roles.map((I) => `--role ${JSON.stringify(I)}`),
        ...j.value.profiles.map((I) => `--profile ${JSON.stringify(I)}`),
        ...j.value.programs.map((I) => `--program ${JSON.stringify(I)}`)
      ].join(" "), w = await L.read(`${u.line} --show ${A.value} --search ${JSON.stringify(y.value)} --limit ${b.value} ${$}`);
      r === n && (J.value = w.ok ? w.value.rows : [], F.value = w.ok ? "" : w.error, G.value = w.ok && w.value.page * w.value.size < w.value.total, W.value = !0);
    }
    async function l() {
      return b.value += 25, await o(), !0;
    }
    ce([A, y, j], () => {
      b.value = 25, o();
    }), L.follow(["agent.*", "task.*", ...L.sources.flatMap((r) => r.events)], Fe(o, We.pageOfAgents)), o();
    const B = (r) => s.value.find(($) => $.id === r.id) ?? r.facts ?? null, g = J, R = x(() => !!y.value.trim() || N.value > 0), P = x(() => u.texts[A.value] ?? { title: u.empty, hint: "" }), Y = C(null), Q = C(null), X = C(null), ie = x(() => g.value.find((r) => r.id === Y.value) ?? null), pe = x(() => ie.value ? [ie.value] : g.value), me = x(() => g.value.length - pe.value.length), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let re = !1, he = 0;
    async function fe(r) {
      if (re) return;
      re = !0, he = X.value.scrollTop;
      const $ = Q.value.querySelector(`[data-agent-open="${r.id}"]`);
      if (!ue()) {
        const K = [...Q.value.querySelectorAll(".agent-row")].filter((Z) => !Z.contains($));
        await Promise.all(K.map((Z) => Z.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const w = [...$.querySelectorAll(".agent-head, .agent-line")], I = [...w, ...$.querySelectorAll("[data-agent-motion]")], ve = I.map((K) => K.getBoundingClientRect());
      if (Y.value = r.id, await Le(), !ue()) {
        const K = I.map((Z) => Z.getBoundingClientRect());
        I.forEach((Z, le) => {
          const ge = w.indexOf(Z.parentElement), Je = ve[le].left - K[le].left - (ge < 0 ? 0 : ve[ge].left - K[ge].left), Ke = ve[le].top - K[le].top - (ge < 0 ? 0 : ve[ge].top - K[ge].top);
          Z.animate([{ transform: `translate(${Je}px, ${Ke}px)` }, { transform: "none" }], { duration: 280, easing: Ce });
        }), Q.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((Z) => {
          Z.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ce, fill: "backwards" });
        });
      }
      re = !1;
    }
    async function ke() {
      if (re || !ie.value) return;
      re = !0;
      const r = Q.value.querySelector(`[data-agent-open="${Y.value}"]`), $ = [...r.children, ...Q.value.querySelectorAll(".agents-held")], w = ue() ? [] : $.map((I) => I.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(w.map((I) => I.finished)), Y.value = null, await Le(), X.value.scrollTop = he, w.forEach((I) => I.cancel()), ue() || (r.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ce }), Q.value.querySelectorAll(".agent-row").forEach((I) => {
        I.contains(r) || I.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ce });
      })), re = !1;
    }
    const we = (r) => Y.value === r.id ? ke() : fe(r);
    ce(y, (r) => r.trim() && (Y.value = null)), ce(A, () => {
      Y.value = null;
    });
    const c = (r) => {
      r.key === "Escape" && ke();
    };
    return window.addEventListener("keydown", c), je(() => window.removeEventListener("keydown", c)), (r, $) => (t(), i("div", {
      ref_key: "agents",
      ref: Q,
      class: oe(["agents", { focused: ie.value }])
    }, [
      k(xn),
      k(m(vt), {
        modelValue: y.value,
        "onUpdate:modelValue": $[1] || ($[1] = (w) => y.value = w),
        placeholder: "Search agents",
        "menu-count": N.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          k(m(Re), null, {
            default: S(() => [...$[2] || ($[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), i(V, null, te(z.value.roles, (w) => (t(), _(m($e), {
            key: w,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(w),
            checked: j.value.roles.includes(w),
            "data-filter-role": w,
            onClick: (I) => U("roles", w)
          }, {
            default: S(() => [
              h(p(q(w)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          z.value.profiles.length ? (t(), _(m(Re), { key: 0 }, {
            default: S(() => [...$[3] || ($[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (t(!0), i(V, null, te(z.value.profiles, (w) => (t(), _(m($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(w.name),
            checked: j.value.profiles.includes(w.name),
            "data-filter-profile": w.name,
            onClick: (I) => U("profiles", w.name)
          }, {
            default: S(() => [
              h(p(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          k(m(Re), null, {
            default: S(() => [...$[4] || ($[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), i(V, null, te(O.value, (w) => (t(), _(m($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(w.name),
            checked: j.value.programs.includes(w.name),
            "data-filter-program": w.name,
            onClick: (I) => U("programs", w.name)
          }, {
            default: S(() => [
              h(p(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          N.value ? (t(), _(m($e), {
            key: 1,
            "data-filter-clear": "",
            onClick: H
          }, {
            default: S(() => [...$[5] || ($[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: S(() => [
          k(m(gt), {
            options: z.value.states,
            value: A.value,
            onPick: $[0] || ($[0] = (w) => A.value = w)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      A.value === "retired" && z.value.upgrade_retired ? (t(), i("p", $n, "Retired during the upgrade: " + p(z.value.upgrade_retired), 1)) : f("", !0),
      v("div", {
        ref_key: "list",
        ref: X,
        class: oe(["agents-view", { "agents-view-open": ie.value }])
      }, [
        W.value && !F.value && !pe.value.length && N.value ? (t(), _(m(De), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            k(m(ne), {
              small: "",
              "data-empty-clear": "",
              onClick: H
            }, {
              default: S(() => [...$[6] || ($[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), _(m(pt), {
          key: 1,
          rows: pe.value,
          failure: F.value,
          loaded: W.value,
          more: !ie.value && G.value,
          older: l,
          empty: P.value.title,
          hint: P.value.hint,
          searching: R.value
        }, {
          default: S(({ row: w }) => [
            v("div", {
              class: "agent-row",
              "data-agent-row": w.id
            }, [
              k(ln, {
                row: w,
                facts: B(w),
                progress: M(w),
                "wait-reason": T(w),
                open: w.id === Y.value,
                onToggle: (I) => we(w)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Cn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      ie.value && me.value ? (t(), i("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: ke
      }, p(me.value) + " more", 1)) : f("", !0)
    ], 2));
  }
}, Rn = /* @__PURE__ */ ae(Sn, [["__scopeId", "data-v-c7305f3d"]]);
export {
  Rn as A
};
