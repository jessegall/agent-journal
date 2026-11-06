/* @code-commandments-generated */
import { openBlock as a, createElementBlock as r, normalizeStyle as ce, normalizeClass as oe, toDisplayString as p, createCommentVNode as y, createElementVNode as g, renderSlot as we, computed as x, createVNode as k, withCtx as C, createTextVNode as f, Fragment as z, renderList as X, onUnmounted as je, ref as $, onMounted as Ee, createBlock as _, Teleport as Ke, mergeProps as Ze, watch as de, toRef as Ge, unref as m, withModifiers as le, defineAsyncComponent as Ye, withKeys as Oe, createSlots as Qe, resolveDynamicComponent as Xe, withDirectives as et, vShow as tt, nextTick as He } from "vue";
import { peekRef as Se, Icon as Ae, RunningCommand as at, FoldGroup as Ne, TaskStatusIcon as nt, Btn as te, TextArea as _e, TextInput as Ve, useWindow as Re, SwitchCase as qe, useNow as lt, age as st, perHour as ot, loadWindowComponent as it, coalesced as We, READ_RATES as Fe, TimeAgo as Te, InnerTabs as rt, TabBody as ut, EmptyState as De, useRows as dt, useDeclaredRows as Be, SearchBar as ct, Segmented as gt, MenuLabel as ze, MenuItem as $e, RowList as vt, toggleFilter as pt } from "@journal/window-kit";
import { _ as ee, T as mt } from "./TranscriptRows-ByPSYos4.js";
const ht = ["stroke-width", "innerHTML"], Q = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const d = e, o = { right: 0, down: 90, left: 180, up: 270 }, c = {
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
    }, t = {
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
    return (M, A) => (a(), r("svg", {
      class: "ico",
      style: ce({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...d.facing === "right" ? {} : { transform: `rotate(${o[d.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[c[e.name] || e.name] || t.dot
    }, null, 12, ht));
  }
}, ft = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, kt = {
  key: 1,
  class: "menu-item-text"
}, yt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (d, o) => (a(), r("button", {
      type: "button",
      class: oe(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), r("span", ft, p(e.checked ? "✓" : ""), 1)) : y("", !0),
      e.description ? (a(), r("span", kt, [
        g("span", null, [
          we(d.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, p(e.description), 1)
      ])) : we(d.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ ee(yt, [["__scopeId", "data-v-fec99974"]]), bt = {}, wt = { class: "menu-label" };
function Mt(e, d) {
  return a(), r("span", wt, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const be = /* @__PURE__ */ ee(bt, [["render", Mt], ["__scopeId", "data-v-aa955b3e"]]), xt = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, $t = {
  key: 0,
  class: "skills-none"
}, Ct = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: d }) {
    const o = e, c = d, t = x(() => o.skills.filter((A) => A.state === "loaded")), M = x(() => o.skills.filter((A) => A.state !== "loaded"));
    return (A, S) => (a(), r("div", xt, [
      k(be, null, {
        default: C(() => [...S[1] || (S[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? y("", !0) : (a(), r("p", $t, "None yet. Compacting the conversation empties this list.")),
      (a(!0), r(z, null, X(t.value, (b) => (a(), r("p", {
        key: b.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        k(Q, {
          name: "book",
          size: 12
        }),
        f(p(b.skill), 1)
      ]))), 128)),
      M.value.length ? (a(), r(z, { key: 1 }, [
        k(be, null, {
          default: C(() => [...S[2] || (S[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), r(z, null, X(M.value, (b) => (a(), r("p", {
          key: b.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          k(Q, {
            name: "book",
            size: 12
          }),
          f(p(b.skill), 1)
        ]))), 128))
      ], 64)) : y("", !0),
      k(ke, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (b) => c("browse"))
      }, {
        default: C(() => [...S[3] || (S[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, St = /* @__PURE__ */ ee(Ct, [["__scopeId", "data-v-be514d47"]]), At = (e, d, o) => Math.max(d, Math.min(o, e)), Pe = /* @__PURE__ */ new WeakMap(), jt = (e, d) => Pe.set(e, d);
function Rt(e, d) {
  for (let o = d; o; o = Pe.get(o) ?? o.parentElement) if (o === e) return !0;
  return !1;
}
function Tt(e, d) {
  const o = (c) => {
    var M, A;
    const t = ((M = e.value) == null ? void 0 : M.element) || ((A = e.value) == null ? void 0 : A.$el) || e.value;
    t && !Rt(t, c.target) && d(c);
  };
  window.addEventListener("click", o), je(() => window.removeEventListener("click", o));
}
const fe = 8, zt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: d, emit: o }) {
    const c = e, t = $(null), M = (v) => v ? `${v}px` : void 0, A = x(() => ({
      minWidth: M(c.minWidth),
      maxWidth: M(c.maxWidth),
      maxHeight: M(c.maxHeight),
      height: M(c.height)
    })), S = $({ w: 0, h: 0 }), b = $(c.anchor ? c.anchor.getBoundingClientRect() : null), F = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), j = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), R = (v) => {
      const T = v.closest(".pane, .float-window");
      return T ? j(T.getBoundingClientRect()) : F();
    }, L = (v, T) => `${Math.max(0, v ? Math.min(v, T) : T)}px`;
    function N(v, T) {
      return {
        below: v.bottom - T.bottom - c.gap - fe,
        above: T.top - v.top - c.gap - fe,
        across: v.right - v.left - 2 * fe
      };
    }
    function P(v) {
      const T = R(c.anchor), E = N(T, v);
      return S.value.w <= E.across && S.value.h <= Math.max(E.below, E.above) ? T : F();
    }
    const H = x(() => {
      if (!b.value) return A.value;
      const v = b.value, T = P(v), E = N(T, v), { w: G, h: ae } = S.value, ie = c.align === "auto" ? v.left + v.right > T.left + T.right : c.align === "right", Z = At(ie ? v.right - G : v.left, T.left + fe, Math.max(T.left + fe, T.right - G - fe)), ve = ae > E.below && E.above > E.below ? { bottom: `${window.innerHeight - v.top + c.gap}px`, maxHeight: L(c.maxHeight, E.above) } : { top: `${v.bottom + c.gap}px`, maxHeight: L(c.maxHeight, E.below) };
      return { ...A.value, ...ve, left: `${Z}px`, maxWidth: L(c.maxWidth, E.across) };
    }), q = o, V = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function I(v) {
      const T = V(), E = T.indexOf(document.activeElement);
      T[(E + v + T.length) % T.length].focus();
    }
    const U = { ArrowDown: () => I(1), ArrowUp: () => I(-1), Escape: () => q("close") }, W = (v) => U[v.key] && (v.preventDefault(), U[v.key]()), K = () => t.value && (S.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let J = 0;
    const w = new ResizeObserver(() => {
      cancelAnimationFrame(J), J = requestAnimationFrame(K);
    });
    Tt(t, (v) => c.anchor && !c.anchor.contains(v.target) && q("close"));
    const l = (v, T) => ["top", "left", "right", "bottom"].some((E) => Math.abs(v[E] - T[E]) > 1), i = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let s = 0;
    function O() {
      if (c.anchor) {
        const v = c.anchor.getBoundingClientRect();
        if (!c.anchor.isConnected || i(v)) return q("close");
        l(v, b.value) && (b.value = v);
      }
      s = requestAnimationFrame(O);
    }
    return Ee(() => {
      c.anchor && t.value && jt(t.value, c.anchor), K(), t.value && w.observe(t.value), !c.plain && V()[0] && V()[0].focus(), O();
    }), je(() => {
      w.disconnect(), cancelAnimationFrame(s), cancelAnimationFrame(J);
    }), d({ element: t }), (v, T) => (a(), _(Ke, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ze({
        ref_key: "panel",
        ref: t
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: H.value,
        onKeydown: W
      }), [
        we(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Vt = /* @__PURE__ */ ee(zt, [["__scopeId", "data-v-3d203970"]]);
async function Lt(e, d, o) {
  if (!e) return o(d);
  const { target: c, fields: t } = e, M = Object.fromEntries(Object.keys(t).map((b) => [b, c[b]])), A = () => Object.assign(c, M);
  Object.assign(c, t);
  let S = !1;
  try {
    const b = await o(d);
    return S = b.ok, b;
  } finally {
    S || A();
  }
}
function Ot(e, d, o) {
  const c = $([]), t = $([]), M = $({}), A = $(""), S = $(!1), b = x(() => !!e.value && !e.value.ended_at), F = x(() => b.value && !!e.value.paused_at);
  async function j() {
    if (b.value) {
      const q = await d(["agent", "controls", String(e.value.id)]);
      c.value = q.ok ? q.value.groups : [];
      return;
    }
    const H = await d(["agent", "programs"]);
    t.value = H.ok ? H.value.rows : [];
  }
  async function R(H, q = null) {
    A.value = "";
    const V = await Lt(q, H, d);
    return A.value = V.ok ? "" : V.error, o(), V;
  }
  const L = (H, q) => R(["agent", "control", String(e.value.id), H, q.value], { target: M, fields: { value: { ...M.value, [H]: q.label } } }), N = () => (S.value = !1, R(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), P = (H) => R(["agent", "launch", H.name]);
  return Ee(j), de(b, j), { groups: c, programs: t, chosen: M, failure: A, asking: S, running: b, paused: F, choose: L, stop: N, start: P };
}
const Ue = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ue).map(([e, d]) => ({ key: e, label: d }));
function Ht(e, d = "agent") {
  return Ue[e] || d;
}
function Bt(e) {
  if (!e) return "Not compacted yet";
  const d = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${d}` : e.end_percent === null ? `Last compacted ${d}, from ${e.start_percent}%` : `Last compacted ${d}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const It = ["disabled", "title"], Et = ["title"], Nt = { class: "gauge usage" }, _t = ["disabled", "title"], qt = { class: "gauge" }, Wt = ["disabled", "title"], Ft = ["disabled"], Dt = ["disabled"], Pt = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Ut = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Jt = ["title"], Kt = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Zt = { class: "gauge" }, Gt = { class: "context-used" }, Yt = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Qt = 75, Xt = {
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
  setup(e, { emit: d }) {
    const o = e, c = d, t = Ot(Ge(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => c("changed")), M = $(null), A = $(""), S = x(() => t.groups.value.find((w) => w.key === A.value));
    function b(w, l) {
      M.value = w.currentTarget, A.value = l;
    }
    function F() {
      M.value = null, A.value = "", t.asking.value = !1;
    }
    const j = $([]), R = x(() => j.value.filter((w) => w.state === "loaded"));
    async function L() {
      const w = o.agent && o.run ? await o.run(["agent-skill", "list", "--agent", String(o.agent.id)]) : null;
      j.value = w != null && w.ok ? w.value.rows ?? [] : [];
    }
    function N(w) {
      b(w, "skills"), L();
    }
    de(() => {
      var w;
      return (w = o.agent) == null ? void 0 : w.id;
    }, L, { immediate: !0 });
    const P = (w) => t.groups.value.some((l) => l.key === w), H = x(() => {
      var w;
      return t.chosen.value.model ?? ((w = V.value) == null ? void 0 : w.model) ?? "";
    }), q = x(() => {
      var w;
      return t.chosen.value.effort ?? ((w = V.value) == null ? void 0 : w.effort) ?? "";
    });
    x(() => !!o.agent && !o.agent.ended_at);
    const V = x(() => {
      var w;
      return ((w = o.usage.agents) == null ? void 0 : w.find((l) => {
        var i;
        return l.id === ((i = o.agent) == null ? void 0 : i.id);
      })) ?? null;
    }), I = x(() => {
      var w;
      return ((w = o.usage.windows) == null ? void 0 : w[0]) ?? null;
    }), U = x(() => I.value ? Math.max(0, Math.min(100, Math.round(I.value.used_percent))) : null), W = x(() => {
      var w;
      return ((w = V.value) == null ? void 0 : w.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), K = x(() => {
      var w;
      return (w = V.value) != null && w.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    }), J = x(() => {
      var i;
      const w = (i = o.agent) != null && i.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!w) return "";
      const l = Math.max(0, Math.floor((o.now - w) / 6e4));
      return l >= 60 ? `${Math.floor(l / 60)}h ${l % 60}m` : `${l}m`;
    });
    return (w, l) => (a(), r("div", {
      class: oe(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), r(z, { key: 0 }, [
        g("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: l[0] || (l[0] = (i) => b(i, "agent"))
        }, [
          k(Q, {
            name: "agents",
            size: 12
          }),
          f(" " + p(m(Ht)(e.agent.program)), 1)
        ], 8, It),
        U.value !== null ? (a(), r("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${U.value}% of the plan's ${I.value.title} allowance used`,
          onClick: l[1] || (l[1] = (i) => c("open", "usage", i.currentTarget))
        }, [
          k(Q, {
            name: "clock",
            size: 12
          }),
          l[14] || (l[14] = f()),
          g("span", Nt, [
            g("span", {
              style: ce({ width: `${U.value}%` })
            }, null, 4)
          ]),
          f(" " + p(U.value) + "% ", 1)
        ], 8, Et)) : y("", !0),
        W.value !== null ? (a(), r("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${W.value}% full: clear or compact it`,
          onClick: l[2] || (l[2] = (i) => P("context") ? b(i, "context") : c("open", "context", i.currentTarget))
        }, [
          k(Q, {
            name: "gauge",
            size: 12
          }),
          l[15] || (l[15] = f()),
          g("span", qt, [
            g("span", {
              style: ce({ width: `${W.value}%` })
            }, null, 4)
          ]),
          f(" " + p(W.value) + "% ", 1)
        ], 8, _t)) : y("", !0),
        H.value ? (a(), r("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${H.value}: change the model`,
          onClick: l[3] || (l[3] = (i) => P("model") ? b(i, "model") : null)
        }, [
          k(Q, {
            name: "model",
            size: 12
          }),
          f(" " + p(H.value), 1)
        ], 8, Wt)) : y("", !0),
        P("effort") || e.card && q.value ? (a(), r("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: l[4] || (l[4] = (i) => b(i, "effort"))
        }, [
          k(Q, {
            name: "bolt",
            size: 12
          }),
          f(" " + p(q.value), 1)
        ], 8, Ft)) : y("", !0),
        K.value ? (a(), r("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: l[5] || (l[5] = (i) => c("open", "cost", i.currentTarget))
        }, p(K.value), 9, Dt)) : y("", !0),
        J.value ? (a(), r("span", Pt, [
          k(Q, {
            name: "reminders",
            size: 12
          }),
          f(" " + p(J.value), 1)
        ])) : y("", !0),
        e.branch ? (a(), r("span", Ut, [
          k(Q, {
            name: "branch",
            size: 12
          }),
          f(" " + p(e.branch), 1)
        ])) : y("", !0),
        e.card ? y("", !0) : (a(), r("button", {
          key: 7,
          type: "button",
          class: oe(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: l[6] || (l[6] = (i) => c("open", "jobs", i.currentTarget))
        }, [
          k(Q, {
            name: "clock",
            size: 12
          }),
          f(" " + p(e.jobs), 1)
        ], 2)),
        e.run ? (a(), r("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: N
        }, [
          k(Q, {
            name: "book",
            size: 12
          }),
          f(" " + p(R.value.length), 1)
        ])) : y("", !0),
        e.fitness ? (a(), r(z, { key: 9 }, [
          g("button", {
            type: "button",
            class: oe(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Qt }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: l[7] || (l[7] = (i) => c("open", "fitness", i.currentTarget))
          }, [
            k(Q, {
              name: "heart",
              size: 12
            }),
            f(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          g("button", {
            type: "button",
            class: oe(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: l[8] || (l[8] = (i) => c("open", "load", i.currentTarget))
          }, [
            k(Q, {
              name: "weight",
              size: 12
            }),
            f(" " + p(e.fitness.workload), 1)
          ], 2)
        ], 64)) : y("", !0)
      ], 64)) : e.run && !e.loading ? (a(), r("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: l[9] || (l[9] = (i) => b(i, "start"))
      }, [
        k(Q, {
          name: "agents",
          size: 12
        }),
        l[16] || (l[16] = f(" Start an agent", -1))
      ])) : y("", !0),
      l[22] || (l[22] = g("span", { class: "space" }, null, -1)),
      m(t).failure.value ? (a(), r("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: m(t).failure.value
      }, p(m(t).failure.value), 9, Jt)) : y("", !0),
      we(w.$slots, "default", {}, void 0, !0),
      M.value ? (a(), _(Vt, {
        key: 3,
        anchor: M.value,
        "min-width": 190,
        onClose: F
      }, {
        default: C(() => {
          var i;
          return [
            A.value === "agent" ? (a(), r(z, { key: 0 }, [
              m(t).asking.value ? (a(), r(z, { key: 0 }, [
                k(be, { "data-agent-stop-ask": "" }, {
                  default: C(() => [...l[17] || (l[17] = [
                    f("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                k(ke, {
                  "data-agent-stop-confirm": "",
                  onClick: l[10] || (l[10] = (s) => (F(), m(t).stop()))
                }, {
                  default: C(() => [...l[18] || (l[18] = [
                    f("Stop it", -1)
                  ])]),
                  _: 1
                }),
                k(ke, {
                  onClick: l[11] || (l[11] = (s) => m(t).asking.value = !1)
                }, {
                  default: C(() => [...l[19] || (l[19] = [
                    f("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (a(), _(ke, {
                key: 1,
                "data-agent-stop": "",
                onClick: l[12] || (l[12] = (s) => m(t).asking.value = !0)
              }, {
                default: C(() => [...l[20] || (l[20] = [
                  f("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : A.value === "start" ? (a(), r(z, { key: 1 }, [
              k(be, null, {
                default: C(() => [...l[21] || (l[21] = [
                  f("Start an agent", -1)
                ])]),
                _: 1
              }),
              (a(!0), r(z, null, X(m(t).programs.value, (s) => (a(), _(ke, {
                key: s.name,
                "data-agent-program": s.name,
                onClick: (O) => (F(), m(t).start(s))
              }, {
                default: C(() => [
                  f(p(s.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : A.value === "skills" ? (a(), _(St, {
              key: 2,
              skills: j.value,
              onBrowse: l[13] || (l[13] = (s) => (F(), c("open", "skills", null)))
            }, null, 8, ["skills"])) : S.value ? (a(), r(z, { key: 3 }, [
              k(be, null, {
                default: C(() => [
                  f(p(S.value.label), 1)
                ]),
                _: 1
              }),
              A.value === "context" ? (a(), r(z, { key: 0 }, [
                g("div", Kt, [
                  g("span", Zt, [
                    g("span", {
                      style: ce({ width: `${W.value}%` })
                    }, null, 4)
                  ]),
                  g("span", Gt, p(W.value) + "%", 1)
                ]),
                g("p", Yt, p(m(Bt)(((i = V.value) == null ? void 0 : i.last_compaction) ?? null)), 1)
              ], 64)) : y("", !0),
              (a(!0), r(z, null, X(S.value.choices, (s) => (a(), _(ke, {
                key: s.value,
                "data-agent-choice": s.value,
                onClick: (O) => (m(t).choose(S.value.key, s), F())
              }, {
                default: C(() => [
                  f(p(s.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : y("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : y("", !0)
    ], 2));
  }
}, ea = /* @__PURE__ */ ee(Xt, [["__scopeId", "data-v-58c7f8ed"]]), ta = {
  class: "agent-command",
  "data-agent-command": ""
}, aa = {
  key: 1,
  "data-agent-stopped": ""
}, na = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (d, o) => (a(), r("span", ta, [
      e.waitReason ? (a(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = le((c) => m(Se)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + p(e.waitReason) + " ", 1),
        k(m(Ae), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), r("span", aa, "Waiting")) : (a(), _(m(at), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, la = /* @__PURE__ */ ee(na, [["__scopeId", "data-v-1b371fb5"]]), sa = ["data-agent-delegated", "onClick"], oa = { class: "agent-task-number" }, ia = { class: "agent-task-title" }, ra = ["title"], ua = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: d }) {
    const o = d;
    return (c, t) => (a(), _(m(Ne), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (M) => o("toggle"))
    }, {
      default: C(() => [
        (a(!0), r(z, null, X(e.section.tasks, (M) => (a(), r("button", {
          key: M.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": M.id,
          onClick: (A) => m(Se)(`tasks:${M.id}`)
        }, [
          k(m(nt), {
            status: M.state
          }, null, 8, ["status"]),
          g("span", oa, p(M.id), 1),
          g("span", ia, p(M.title), 1),
          M.plan_id ? (a(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${M.plan_id}: ${M.plan_title}`
          }, "Plan " + p(M.plan_id) + ": " + p(M.plan_title), 9, ra)) : y("", !0)
        ], 8, sa))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, da = /* @__PURE__ */ ee(ua, [["__scopeId", "data-v-238ff959"]]), ca = { class: "action-field" }, ga = ["value", "disabled"], va = ["value"], pa = { key: 1 }, ma = {
  key: 1,
  class: "action-field"
}, ha = { class: "action-buttons" }, fa = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (d, o) => (a(), r("form", {
      onSubmit: o[4] || (o[4] = le((c) => d.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), r(z, { key: 0 }, [
        g("label", ca, [
          o[6] || (o[6] = f("Task ", -1)),
          g("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (c) => d.$emit("update:task", c.target.value))
          }, [
            o[5] || (o[5] = g("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), r(z, null, X(e.tasks, (c) => (a(), r("option", {
              key: c.id,
              value: String(c.id)
            }, p(c.id) + ": " + p(c.title), 9, va))), 128))
          ], 40, ga)
        ]),
        e.moreTasks ? (a(), _(m(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (c) => d.$emit("more"))
        }, {
          default: C(() => [...o[7] || (o[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : y("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), r("p", pa, "No open tasks.")) : y("", !0)
      ], 64)) : (a(), r("label", ma, [
        o[8] || (o[8] = f("Job", -1)),
        k(m(_e), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (c) => d.$emit("update:text", c.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      g("div", ha, [
        k(m(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: C(() => [...o[9] || (o[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(m(te), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (c) => d.$emit("cancel"))
        }, {
          default: C(() => [...o[10] || (o[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ka = /* @__PURE__ */ ee(fa, [["__scopeId", "data-v-adde4158"]]), ya = { class: "action-field" }, ba = { class: "action-buttons" }, wa = {
  __name: "AgentMessageForm",
  props: { text: String, pending: Boolean },
  emits: ["submit", "cancel", "update:text"],
  setup(e) {
    return (d, o) => (a(), r("form", {
      onSubmit: o[2] || (o[2] = le((c) => d.$emit("submit"), ["prevent"]))
    }, [
      g("label", ya, [
        o[3] || (o[3] = f("Message", -1)),
        k(m(_e), {
          value: e.text,
          disabled: e.pending,
          "data-agent-message-text": "",
          onInput: o[0] || (o[0] = (c) => d.$emit("update:text", c.target.value))
        }, null, 8, ["value", "disabled"])
      ]),
      g("div", ba, [
        k(m(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.text.trim(),
          "data-agent-submit-message": ""
        }, {
          default: C(() => [...o[4] || (o[4] = [
            f("Send the message", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(m(te), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (c) => d.$emit("cancel"))
        }, {
          default: C(() => [...o[5] || (o[5] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ma = /* @__PURE__ */ ee(wa, [["__scopeId", "data-v-5620d063"]]), xa = { class: "action-buttons" }, $a = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (d, o) => (a(), r("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = le((c) => d.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = g("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      k(m(Ve), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (c) => d.$emit("update:reason", c))
      }, null, 8, ["model-value", "disabled"]),
      g("div", xa, [
        k(m(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: C(() => [...o[3] || (o[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(m(te), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (c) => d.$emit("cancel"))
        }, {
          default: C(() => [...o[4] || (o[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ca = /* @__PURE__ */ ee($a, [["__scopeId", "data-v-23a905c0"]]), Sa = { class: "action-buttons" }, Aa = {
  key: 0,
  role: "alert"
}, ja = {
  key: 1,
  role: "status"
}, Ra = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const d = e, o = Re(), c = $(""), t = $(""), M = $(""), A = $(""), S = $([]), b = $(0), F = $(!1), j = $(!1), R = $(!1), L = $(""), N = $(""), P = x(() => !!d.row.retired_at || d.row.state === "retired"), H = x(() => !P.value && !!d.row.ended_at), q = x(() => {
      var i;
      return H.value && ((i = d.row.job_command) == null ? void 0 : i.length) && !d.row.resume_reason;
    }), V = x(() => q.value && !j.value && (d.row.job_task_flag ? S.value.some((i) => String(i.id) === A.value) : !!t.value.trim()));
    function I(i) {
      c.value = i, t.value = "", M.value = "", A.value = "", L.value = "", N.value = "";
    }
    async function U() {
      I("job"), d.row.job_task_flag && (S.value = [], b.value = 0, F.value = !1, await W());
    }
    async function W() {
      if (!j.value) {
        j.value = !0;
        try {
          const i = await o.read(`task list --state open --limit 100 --page ${b.value + 1}`);
          L.value = i.ok ? "" : i.error, i.ok && (S.value = [...S.value, ...i.value.rows], b.value = i.value.page, F.value = i.value.page * i.value.size < i.value.total);
        } finally {
          j.value = !1;
        }
      }
    }
    async function K(i, s) {
      if (!R.value) {
        R.value = !0, L.value = "";
        try {
          const O = await o.run(i);
          L.value = O.ok ? "" : O.error, O.ok && (I(""), N.value = s);
        } finally {
          R.value = !1;
        }
      }
    }
    async function J() {
      if (!V.value) return;
      const i = d.row.job_task_flag ? [d.row.job_task_flag, A.value] : [t.value.trim()];
      await K([...d.row.job_command, String(d.row.id), ...i], "Job sent.");
    }
    async function w() {
      P.value || H.value || !t.value.trim() || await K(["message", "send", t.value.trim(), "--target-agent", String(d.row.id)], "Message sent.");
    }
    async function l() {
      !H.value || c.value !== "retire" || !M.value.trim() || await K(["agent", "retire", String(d.row.id), "--reason", M.value.trim()], "Agent retired permanently.");
    }
    return (i, s) => {
      var O;
      return P.value ? y("", !0) : (a(), r("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: s[9] || (s[9] = le(() => {
        }, ["stop"])),
        onKeydown: s[10] || (s[10] = le(() => {
        }, ["stop"]))
      }, [
        g("div", Sa, [
          H.value ? (a(), r(z, { key: 0 }, [
            (O = e.row.job_command) != null && O.length ? (a(), _(m(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: R.value || j.value || !q.value,
              onClick: U
            }, {
              default: C(() => [...s[11] || (s[11] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0),
            e.row.role !== "main" ? (a(), _(m(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: R.value || j.value,
              onClick: s[0] || (s[0] = (v) => I("retire"))
            }, {
              default: C(() => [...s[12] || (s[12] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0)
          ], 64)) : (a(), _(m(te), {
            key: 1,
            small: "",
            "data-agent-send-message": "",
            disabled: R.value,
            onClick: s[1] || (s[1] = (v) => I("message"))
          }, {
            default: C(() => [...s[13] || (s[13] = [
              f("Send a message", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        k(m(qe), { value: c.value }, {
          job: C(() => [
            k(ka, {
              task: A.value,
              "onUpdate:task": s[2] || (s[2] = (v) => A.value = v),
              text: t.value,
              "onUpdate:text": s[3] || (s[3] = (v) => t.value = v),
              row: e.row,
              tasks: S.value,
              pending: R.value,
              loading: j.value,
              "more-tasks": F.value,
              failure: L.value,
              "job-ready": V.value,
              onSubmit: J,
              onMore: W,
              onCancel: s[4] || (s[4] = (v) => I(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          message: C(() => [
            k(Ma, {
              text: t.value,
              "onUpdate:text": s[5] || (s[5] = (v) => t.value = v),
              pending: R.value,
              onSubmit: w,
              onCancel: s[6] || (s[6] = (v) => I(""))
            }, null, 8, ["text", "pending"])
          ]),
          retire: C(() => [
            k(Ca, {
              reason: M.value,
              "onUpdate:reason": s[7] || (s[7] = (v) => M.value = v),
              pending: R.value,
              onSubmit: l,
              onCancel: s[8] || (s[8] = (v) => I(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        L.value ? (a(), r("p", Aa, p(L.value), 1)) : y("", !0),
        N.value ? (a(), r("p", ja, p(N.value), 1)) : y("", !0)
      ], 32));
    };
  }
}, Ta = /* @__PURE__ */ ee(Ra, [["__scopeId", "data-v-8e1cadf9"]]), za = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Va = { class: "agent-head" }, La = ["data-state"], Oa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Ha = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ba = { class: "agent-times" }, Ia = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Ea = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Na = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, _a = {
  key: 3,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, qa = {
  key: 0,
  class: "agent-line"
}, Wa = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Fa = {
  class: "agent-session",
  "data-agent-session": ""
}, Da = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Pa = {
  key: 1,
  class: "agent-line agent-work-start"
}, Ua = ["data-peek"], Ja = ["title"], Ka = ["data-peek"], Za = ["data-agent-waiting", "data-agent-stopped"], Ga = {
  key: 1,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Ya = {
  key: 0,
  class: "agent-summary",
  "data-agent-report": ""
}, Qa = {
  key: 1,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Xa = {
  key: 2,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, en = {
  key: 3,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, tn = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, an = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, nn = {
  key: 0,
  class: "agent-helper-brief"
}, ln = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, sn = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, on = "It ended without a report", rn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: d }) {
    const o = { helper: "Helper", reviewer: "Reviewer" }, c = ["started", "blocked", "open", "completed"], t = e, M = d, A = lt(), S = x(() => {
      var u, h;
      if ((u = t.facts) != null && u.profile_title) return t.facts.profile_title;
      if ((h = t.facts) != null && h.profile) return t.facts.profile;
      const n = o[t.row.role] || t.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), b = x(() => {
      var n;
      return ((n = t.facts) == null ? void 0 : n.tasks) ?? [];
    }), F = x(() => b.value.filter((n) => n.state === "open")), j = x(() => {
      const n = b.value.find((u) => {
        var h;
        return u.id === ((h = t.facts) == null ? void 0 : h.task_id);
      });
      return n != null && n.plan_id ? n : F.value.find((u) => u.plan_id);
    }), R = x(() => {
      var n, u, h, B, ue;
      return t.row.role === "helper" ? ((n = t.facts) == null ? void 0 : n.helper_job) || "" : (u = t.facts) != null && u.job_enabled && (((h = t.facts) == null ? void 0 : h.task_title) || ((B = F.value[0]) == null ? void 0 : B.title) || ((ue = b.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), L = x(() => {
      var n;
      return ((n = t.facts) == null ? void 0 : n.job_returned) || t.row.job_returned || "";
    }), N = x(() => {
      const n = R.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), P = x(() => {
      var n, u;
      return [t.row.program, (n = t.facts) == null ? void 0 : n.model, (u = t.facts) == null ? void 0 : u.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), H = x(() => {
      var n, u;
      return t.row.ended_at && ((u = (n = t.facts) == null ? void 0 : n.job_returned) != null && u.startsWith(on)) ? t.facts.job_returned : "";
    }), q = x(() => st(t.row.process_started_at || t.row.created_at, A.value)), V = /* @__PURE__ */ new Set(["open", "started", "testing"]), I = x(() => !!t.row.ended_at && t.row.role !== "main" && b.value.some((n) => V.has(n.state))), U = x(() => {
      var n;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : t.waitReason || I.value ? "waiting" : t.row.state === "running" && ((n = t.facts) == null ? void 0 : n.state) || t.row.state;
    }), W = x(() => t.waitReason ? `Waiting: ${t.waitReason}` : U.value === "blocked" ? "Blocked" : I.value ? "Stopped with work left" : ""), K = x(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.completed_count) ?? b.value.filter((u) => u.state === "completed").length;
    }), J = x(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.task_count) ?? b.value.length;
    }), w = x(() => `${K.value} of ${J.value} ${J.value === 1 ? "task" : "tasks"}`), l = x(() => {
      var u;
      const n = ot(K.value, ((u = t.progress) == null ? void 0 : u.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, A.value);
      return t.row.role !== "main" && n ? `${n} per hour` : "";
    }), i = x(() => b.value.length ? c.map((n) => ({ state: n, label: n.slice(0, 1).toUpperCase() + n.slice(1), tasks: b.value.filter((u) => u.state === n || n === "started" && u.state === "testing" || n === "completed" && u.state === "cancelled") })) : []), s = /* @__PURE__ */ new Set(["completed"]), O = $({}), v = (n) => !(O.value[n] ?? s.has(n)), T = (n) => O.value = { ...O.value, [n]: v(n) }, E = Re(), G = x(() => t.row.access === "read-only"), ae = x(() => !!t.row.retired_at || t.row.state === "retired"), ie = x(() => ae.value ? E.tabs.filter((n) => n.key === "transcript") : G.value ? E.tabs.filter((n) => ["transcript", "terminal"].includes(n.key)) : E.tabs), Z = $(ie.value[0]);
    de(ie, (n) => {
      n.some((u) => {
        var h;
        return u.key === ((h = Z.value) == null ? void 0 : h.key);
      }) || (Z.value = n[0]);
    }), de(() => t.open, (n) => {
      n && (Z.value = ie.value[0]);
    });
    const ge = Object.fromEntries(E.tabs.filter((n) => n.component).map((n) => [n.key, Ye(() => it(n.component))])), ve = x(() => t.row.role === "helper" && !t.row.ended_at), pe = () => E.run(["helper", "stop", String(t.row.id)]), re = $(!1), ye = $(""), Me = $(""), me = x(() => t.row.role !== "main" && (!t.row.ended_at || I.value || t.waitReason));
    async function xe() {
      if (!t.open || !me.value) return;
      const n = await E.read(`usage tool --agent ${t.row.id}`, { deferred: !0 });
      t.open && (ye.value = n.ok ? n.value.tool : "", Me.value = n.ok ? n.value.note : "");
    }
    const he = E.follow(["hook_call.*", "process_part.*"], We(xe, Fe.agentCommand));
    return je(() => he == null ? void 0 : he()), de(() => t.open, (n) => {
      n && xe();
    }, { immediate: !0 }), (n, u) => {
      var h, B, ue, se;
      return a(), r("div", {
        class: oe(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: P.value,
        onClick: u[6] || (u[6] = (D) => !e.open && M("toggle")),
        onKeydown: [
          u[7] || (u[7] = Oe(le((D) => !e.open && M("toggle"), ["self", "prevent"]), ["enter"])),
          u[8] || (u[8] = Oe(le((D) => !e.open && M("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        g("span", Va, [
          e.open ? (a(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: u[0] || (u[0] = le((D) => M("toggle"), ["stop"]))
          }, [
            k(m(Ae), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : y("", !0),
          g("span", {
            class: "agent-dot",
            "data-state": U.value,
            "data-agent-motion": ""
          }, null, 8, La),
          g("span", Oa, p(S.value), 1),
          g("span", Ha, p(((h = e.facts) == null ? void 0 : h.given_name) || e.row.id), 1),
          e.open ? y("", !0) : (a(), _(m(Ae), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          g("span", Ba, [
            ae.value ? (a(), r("span", Ia, [
              u[9] || (u[9] = f("Retired, ", -1)),
              k(m(Te), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (a(), r("span", Ea, [
              u[10] || (u[10] = f("Idle, ", -1)),
              k(m(Te), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (a(), r("span", Na, p(q.value), 1)),
            e.open && ((B = e.facts) != null && B.last_activity) ? (a(), r("span", _a, [
              u[11] || (u[11] = f("Last heard: ", -1)),
              k(m(Te), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : y("", !0)
          ])
        ]),
        e.open ? (a(), r("span", qa, [
          g("span", Wa, p(P.value), 1),
          g("span", Fa, "Session: " + p(e.row.session), 1),
          J.value && !R.value ? (a(), r("span", Da, p(w.value), 1)) : y("", !0)
        ])) : y("", !0),
        e.open && j.value ? (a(), r("span", Pa, [
          g("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${j.value.plan_id}`,
            onClick: u[1] || (u[1] = le((D) => m(Se)(`plans:${j.value.plan_id}`), ["stop"]))
          }, "Plan " + p(j.value.plan_id) + ": " + p(j.value.plan_title), 9, Ua)
        ])) : y("", !0),
        R.value || !e.open && W.value ? (a(), r("span", {
          key: 2,
          class: oe(["agent-line", { "agent-work-start": !j.value }])
        }, [
          g("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: R.value
          }, [
            e.open && N.value ? (a(), r("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": N.value,
              onClick: u[2] || (u[2] = le((D) => m(Se)(N.value), ["stop"]))
            }, p(R.value), 9, Ka)) : (a(), r(z, { key: 1 }, [
              f(p(R.value), 1)
            ], 64))
          ], 8, Ja),
          !e.open && W.value ? (a(), r("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": I.value && !e.waitReason ? "" : null
          }, p(W.value), 9, Za)) : y("", !0),
          e.open && J.value ? (a(), r("span", Ga, p(w.value), 1)) : y("", !0)
        ], 2)) : y("", !0),
        e.open ? (a(), r(z, { key: 3 }, [
          L.value ? (a(), r("p", Ya, [
            u[12] || (u[12] = g("span", null, "Last report: ", -1)),
            f(p(L.value), 1)
          ])) : y("", !0),
          e.row.retirement_reason ? (a(), r("p", Qa, "Retirement reason: " + p(e.row.retirement_reason), 1)) : y("", !0),
          e.row.resume_reason ? (a(), r("p", Xa, p(e.row.resume_reason), 1)) : y("", !0),
          k(Ta, { row: e.row }, null, 8, ["row"]),
          J.value && l.value ? (a(), r("span", en, p(l.value), 1)) : y("", !0),
          g("div", {
            class: "agent-more",
            "data-agent-more": "",
            onClick: u[5] || (u[5] = le(() => {
            }, ["stop"]))
          }, [
            k(ea, {
              agent: e.row,
              branch: (ue = e.progress) == null ? void 0 : ue.branch,
              usage: { agents: e.facts ? [e.facts] : [], windows: [] },
              card: ""
            }, {
              default: C(() => [
                ve.value ? (a(), _(m(te), {
                  key: 0,
                  variant: "ghost",
                  small: "",
                  "data-helper-stop": "",
                  onClick: pe
                }, {
                  default: C(() => [...u[13] || (u[13] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                })) : y("", !0)
              ]),
              _: 1
            }, 8, ["agent", "branch", "usage"]),
            me.value ? (a(), _(la, {
              key: 0,
              class: "agent-command",
              "wait-reason": e.waitReason,
              stopped: I.value,
              command: ye.value,
              note: Me.value
            }, null, 8, ["wait-reason", "stopped", "command", "note"])) : y("", !0),
            H.value ? (a(), r("p", tn, p(H.value), 1)) : y("", !0),
            k(m(rt), {
              class: "agent-tabs",
              tabs: ie.value,
              active: Z.value,
              answer: { tasks: b.value.length },
              onChoose: u[3] || (u[3] = (D) => Z.value = D)
            }, null, 8, ["tabs", "active", "answer"]),
            k(m(ut), {
              class: "agent-tab-body",
              tab: Z.value,
              "data-agent-tab-body": (se = Z.value) == null ? void 0 : se.key
            }, {
              default: C(() => {
                var D;
                return [
                  k(m(qe), {
                    value: (D = Z.value) == null ? void 0 : D.key
                  }, Qe({
                    tasks: C(() => {
                      var ne;
                      return [
                        b.value.length ? y("", !0) : (a(), _(m(De), {
                          key: 0,
                          title: "No tasks"
                        }, {
                          default: C(() => [...u[14] || (u[14] = [
                            f("No tasks have been assigned to this agent.", -1)
                          ])]),
                          _: 1
                        })),
                        (a(!0), r(z, null, X(i.value, (Y) => (a(), _(da, {
                          key: Y.state,
                          section: Y,
                          open: v(Y.state),
                          onToggle: (Le) => T(Y.state)
                        }, null, 8, ["section", "open", "onToggle"]))), 128)),
                        (ne = e.facts) != null && ne.instruction ? (a(), r(z, { key: 1 }, [
                          u[15] || (u[15] = g("p", { class: "agent-label" }, "Instruction", -1)),
                          g("div", an, p(e.facts.instruction), 1)
                        ], 64)) : y("", !0)
                      ];
                    }),
                    transcript: C(() => {
                      var ne;
                      return [
                        G.value ? (a(), r(z, { key: 0 }, [
                          (ne = e.facts) != null && ne.instruction ? (a(), r("div", nn, [
                            k(m(Ne), {
                              label: "Instruction",
                              open: re.value,
                              "data-agent-section": "instruction",
                              onToggle: u[4] || (u[4] = (Y) => re.value = !re.value)
                            }, {
                              default: C(() => [
                                g("div", ln, p(e.facts.instruction), 1)
                              ]),
                              _: 1
                            }, 8, ["open"])
                          ])) : e.facts && e.row.ended_at ? (a(), r("p", sn, "No job recorded")) : y("", !0)
                        ], 64)) : y("", !0),
                        k(mt, {
                          line: `agent transcript ${e.row.id}`,
                          padding: "0"
                        }, null, 8, ["line"])
                      ];
                    }),
                    _: 2
                  }, [
                    X(m(ge), (ne, Y) => ({
                      name: Y,
                      fn: C(() => [
                        (a(), _(Xe(ne), {
                          agent: e.row.id
                        }, null, 8, ["agent"]))
                      ])
                    }))
                  ]), 1032, ["value"])
                ];
              }),
              _: 1
            }, 8, ["tab", "data-agent-tab-body"])
          ])
        ], 64)) : y("", !0)
      ], 42, za);
    };
  }
}, un = /* @__PURE__ */ ee(rn, [["__scopeId", "data-v-82ba8013"]]), dn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, cn = ["aria-expanded"], gn = { key: 0 }, vn = { key: 1 }, pn = { class: "limits-panel" }, mn = { class: "limits-head" }, hn = ["data-agent-limit-type", "data-agent-limit-profile"], fn = { class: "count" }, kn = { class: "bar" }, yn = { class: "count" }, bn = { class: "bar" }, wn = ["data-agent-limit-type"], Mn = { class: "limit-field" }, xn = { class: "limit-field" }, $n = {
  key: 1,
  role: "alert"
}, Cn = {
  key: 2,
  role: "status"
}, Sn = {
  __name: "AgentLimits",
  setup(e) {
    const d = Re(), o = $([]), c = $({}), t = $(!1), M = $(!1), A = $(!1), S = $(""), b = $(""), F = (l) => l === 0 ? "no limit" : String(l), j = (l, i) => i === 0 ? 0 : l > i ? 2 : l === i ? 1 : 0, R = x(() => o.value.flatMap((l) => l.per_profile && l.profiles.length ? l.profiles.map((i) => ({ ...i, label: i.title, type: l.key, key: `${l.key}:${i.profile}` })) : [l])), L = (l) => Math.max(j(l.running, l.run_limit), j(l.kept, l.kept_limit)), N = x(() => R.value.filter((l) => L(l)).sort((l, i) => L(i) - L(l))), P = x(() => o.value.reduce((l, i) => l + i.running, 0)), H = x(() => o.value.reduce((l, i) => l + i.kept, 0)), q = (l) => {
      const i = [l.run_limit ? l.running - l.run_limit : -1, l.kept_limit ? l.kept - l.kept_limit : -1], s = Math.max(...i);
      return s > 0 ? `Over by ${s}` : s === 0 ? "At limit" : "Within limits";
    }, V = (l, i) => i ? `${Math.min(l / Math.max(l, i) * 100, 100)}%` : "0%", I = (l, i) => i && l > i ? `${(l - i) / l * 100}%` : "0%";
    let U = 0;
    async function W() {
      const l = ++U, i = await d.read("agent limits");
      l === U && (o.value = i.ok ? i.value.rows : [], S.value = i.ok ? "" : i.error);
    }
    async function K(l) {
      const i = await Promise.all(o.value.flatMap((s) => [s.run_setting, s.kept_setting]).map(async (s) => {
        const O = await d.read(`setting show ${s}`);
        return [s, O.ok ? O.value.source : ""];
      }));
      l === U && (c.value = Object.fromEntries(i));
    }
    async function J() {
      M.value = !M.value, M.value && await K(U);
    }
    async function w(l, i, s, O) {
      if (A.value || d.readOnly) return;
      const v = Number(O.target.value);
      if (!Number.isInteger(v) || v < 0 || !O.target.value.trim()) {
        S.value = "Use a whole number of 0 or more.", O.target.value = String(s);
        return;
      }
      A.value = !0, b.value = "";
      try {
        const T = await d.run(["setting", "set", i, String(v), "--environment", d.environment]);
        if (S.value = T.ok ? "" : T.error, !T.ok) {
          O.target.value = String(s);
          return;
        }
        await W(), b.value = `${l.label} limits saved.`;
      } finally {
        A.value = !1;
      }
    }
    return d.follow(["agent.*", "setting.*"], W), W(), (l, i) => (a(), r("section", dn, [
      o.value.length ? (a(), r(z, { key: 0 }, [
        g("button", {
          class: "summary",
          type: "button",
          "aria-expanded": t.value,
          onClick: i[0] || (i[0] = (s) => t.value = !t.value)
        }, [
          N.value.length ? (a(), r(z, { key: 0 }, [
            (a(!0), r(z, null, X(N.value.slice(0, 2), (s) => (a(), r("span", {
              key: s.key,
              class: "summary-item"
            }, [
              g("span", {
                class: oe(["mark", { over: L(s) === 2 }])
              }, null, 2),
              f(p(s.label) + ": " + p(q(s)), 1)
            ]))), 128)),
            N.value.length > 2 ? (a(), r("span", gn, p(N.value.length - 2) + " more", 1)) : y("", !0)
          ], 64)) : (a(), r("span", vn, "All within limits, " + p(P.value) + " running, " + p(H.value) + " kept", 1)),
          k(m(Ae), {
            name: "caret",
            size: 12
          })
        ], 8, cn),
        et(g("div", pn, [
          g("div", mn, [
            i[1] || (i[1] = g("strong", null, "Agent limits", -1)),
            k(m(te), {
              small: "",
              disabled: A.value || m(d).readOnly,
              "data-agent-limits-edit": "",
              onClick: J
            }, {
              default: C(() => [
                f(p(M.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          M.value ? (a(), r(z, { key: 1 }, [
            (a(!0), r(z, null, X(o.value, (s) => (a(), r("div", {
              key: s.key,
              class: "edit-row",
              "data-agent-limit-type": s.key
            }, [
              g("strong", null, p(s.label), 1),
              g("label", Mn, [
                g("span", null, [
                  i[3] || (i[3] = f("Running", -1)),
                  s.per_profile ? (a(), r(z, { key: 0 }, [
                    f(" per profile")
                  ], 64)) : y("", !0)
                ]),
                k(m(Ve), {
                  type: "number",
                  min: "0",
                  value: String(s.run_limit),
                  disabled: A.value || m(d).readOnly,
                  "data-agent-run-limit": s.key,
                  onChange: (O) => w(s, s.run_setting, s.run_limit, O)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                g("small", null, p(c.value[s.run_setting]), 1)
              ]),
              g("label", xn, [
                g("span", null, [
                  i[4] || (i[4] = f("Kept", -1)),
                  s.per_profile ? (a(), r(z, { key: 0 }, [
                    f(" per profile")
                  ], 64)) : y("", !0)
                ]),
                k(m(Ve), {
                  type: "number",
                  min: "0",
                  value: String(s.kept_limit),
                  disabled: A.value || m(d).readOnly,
                  "data-agent-kept-limit": s.key,
                  onChange: (O) => w(s, s.kept_setting, s.kept_limit, O)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                g("small", null, p(c.value[s.kept_setting]), 1)
              ])
            ], 8, wn))), 128)),
            g("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + p(m(d).environment) + ".", 1)
          ], 64)) : (a(), r(z, { key: 0 }, [
            i[2] || (i[2] = g("div", { class: "table-head" }, [
              g("span", null, "Agent"),
              g("span", null, "Running"),
              g("span", null, "Kept"),
              g("span", null, "Status")
            ], -1)),
            (a(!0), r(z, null, X(R.value, (s) => (a(), r("div", {
              key: s.key,
              class: "limit-row",
              "data-agent-limit-type": s.type || s.key,
              "data-agent-limit-profile": s.profile
            }, [
              g("strong", null, p(s.label), 1),
              g("div", fn, [
                g("span", null, p(s.run_limit ? `${s.running} of ${s.run_limit}` : `${s.running} · none may start`), 1),
                g("div", kn, [
                  g("span", {
                    style: ce({ width: V(s.running, s.run_limit) })
                  }, null, 4),
                  g("i", {
                    style: ce({ width: I(s.running, s.run_limit) })
                  }, null, 4)
                ])
              ]),
              g("div", yn, [
                g("span", null, p(s.kept) + " of " + p(F(s.kept_limit)), 1),
                g("div", bn, [
                  g("span", {
                    style: ce({ width: V(s.kept, s.kept_limit) })
                  }, null, 4),
                  g("i", {
                    style: ce({ width: I(s.kept, s.kept_limit) })
                  }, null, 4)
                ])
              ]),
              g("span", {
                class: oe(["status", { warning: L(s) === 1, danger: L(s) === 2 }])
              }, p(q(s)), 3)
            ], 8, hn))), 128))
          ], 64))
        ], 512), [
          [tt, t.value]
        ])
      ], 64)) : y("", !0),
      S.value ? (a(), r("p", $n, p(S.value), 1)) : y("", !0),
      b.value ? (a(), r("p", Cn, p(b.value), 1)) : y("", !0)
    ]));
  }
}, An = /* @__PURE__ */ ee(Sn, [["__scopeId", "data-v-00e6a563"]]), jn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Rn = ["data-agent-row"], Ie = "journal.agents.filters", Ce = "cubic-bezier(0.2, 0.9, 0.25, 1)", Tn = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const d = e, { rows: o } = dt("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: c } = Be("waits"), { rows: t } = Be("progress"), M = (n) => t.value.find((u) => u.agent_id === n.id) ?? null, A = (n) => {
      var u;
      return ((u = c.value.find((h) => h.agent_id === n.id)) == null ? void 0 : u.reason) ?? "";
    }, S = $("running"), b = $(""), F = JSON.parse(localStorage.getItem(Ie) || '{"roles":[],"profiles":[],"programs":[]}'), j = $(F), R = $({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), L = $([]), N = x(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), P = (n, u) => {
      j.value = pt(j.value, n, u);
    }, H = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, q = (n) => n.slice(0, 1).toUpperCase() + n.slice(1);
    de(j, (n) => localStorage.setItem(Ie, JSON.stringify(n)));
    const V = Re();
    async function I() {
      const [n, u] = await Promise.all([V.read("agent cards --options"), V.read("agent programs")]);
      n.ok && (R.value = n.value), u.ok && (L.value = u.value.rows);
    }
    V.follow(["agent.*"], I), I();
    const U = $([]), W = $(""), K = $(!1), J = $(!1), w = $(25);
    let l = 0;
    async function i() {
      const n = ++l, u = [
        ...j.value.roles.map((B) => `--role ${JSON.stringify(B)}`),
        ...j.value.profiles.map((B) => `--profile ${JSON.stringify(B)}`),
        ...j.value.programs.map((B) => `--program ${JSON.stringify(B)}`)
      ].join(" "), h = await V.read(`${d.line} --show ${S.value} --search ${JSON.stringify(b.value)} --limit ${w.value} ${u}`);
      n === l && (U.value = h.ok ? h.value.rows : [], W.value = h.ok ? "" : h.error, J.value = h.ok && h.value.page * h.value.size < h.value.total, K.value = !0);
    }
    async function s() {
      return w.value += 25, await i(), !0;
    }
    de([S, b, j], () => {
      w.value = 25, i();
    }), V.follow(["agent.*", "task.*", ...V.sources.flatMap((n) => n.events)], We(i, Fe.pageOfAgents)), i();
    const O = (n) => o.value.find((u) => u.id === n.id) ?? n.facts ?? null, v = U, T = x(() => !!b.value.trim() || N.value > 0), E = x(() => d.texts[S.value] ?? { title: d.empty, hint: "" }), G = $(null), ae = $(null), ie = $(null), Z = x(() => v.value.find((n) => n.id === G.value) ?? null), ge = x(() => Z.value ? [Z.value] : v.value), ve = x(() => v.value.length - ge.value.length), pe = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let re = !1, ye = 0;
    async function Me(n) {
      if (re) return;
      re = !0, ye = ie.value.scrollTop;
      const u = ae.value.querySelector(`[data-agent-open="${n.id}"]`);
      if (!pe()) {
        const se = [...ae.value.querySelectorAll(".agent-row")].filter((D) => !D.contains(u));
        await Promise.all(se.map((D) => D.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const h = [...u.querySelectorAll(".agent-head, .agent-line")], B = [...h, ...u.querySelectorAll("[data-agent-motion]")], ue = B.map((se) => se.getBoundingClientRect());
      if (G.value = n.id, await He(), !pe()) {
        const se = B.map((D) => D.getBoundingClientRect());
        B.forEach((D, ne) => {
          const Y = h.indexOf(D.parentElement), Le = ue[ne].left - se[ne].left - (Y < 0 ? 0 : ue[Y].left - se[Y].left), Je = ue[ne].top - se[ne].top - (Y < 0 ? 0 : ue[Y].top - se[Y].top);
          D.animate([{ transform: `translate(${Le}px, ${Je}px)` }, { transform: "none" }], { duration: 280, easing: Ce });
        }), ae.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((D) => {
          D.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ce, fill: "backwards" });
        });
      }
      re = !1;
    }
    async function me() {
      if (re || !Z.value) return;
      re = !0;
      const n = ae.value.querySelector(`[data-agent-open="${G.value}"]`), u = [...n.children, ...ae.value.querySelectorAll(".agents-held")], h = pe() ? [] : u.map((B) => B.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(h.map((B) => B.finished)), G.value = null, await He(), ie.value.scrollTop = ye, h.forEach((B) => B.cancel()), pe() || (n.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ce }), ae.value.querySelectorAll(".agent-row").forEach((B) => {
        B.contains(n) || B.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ce });
      })), re = !1;
    }
    const xe = (n) => G.value === n.id ? me() : Me(n);
    de(b, (n) => n.trim() && (G.value = null)), de(S, () => {
      G.value = null;
    });
    const he = (n) => {
      n.key === "Escape" && me();
    };
    return window.addEventListener("keydown", he), je(() => window.removeEventListener("keydown", he)), (n, u) => (a(), r("div", {
      ref_key: "agents",
      ref: ae,
      class: oe(["agents", { focused: Z.value }])
    }, [
      k(An),
      k(m(ct), {
        modelValue: b.value,
        "onUpdate:modelValue": u[1] || (u[1] = (h) => b.value = h),
        placeholder: "Search agents",
        "menu-count": N.value,
        "data-agents-search": ""
      }, {
        menu: C(() => [
          k(m(ze), null, {
            default: C(() => [...u[2] || (u[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), r(z, null, X(R.value.roles, (h) => (a(), _(m($e), {
            key: h,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(h),
            checked: j.value.roles.includes(h),
            "data-filter-role": h,
            onClick: (B) => P("roles", h)
          }, {
            default: C(() => [
              f(p(q(h)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          R.value.profiles.length ? (a(), _(m(ze), { key: 0 }, {
            default: C(() => [...u[3] || (u[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : y("", !0),
          (a(!0), r(z, null, X(R.value.profiles, (h) => (a(), _(m($e), {
            key: h.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(h.name),
            checked: j.value.profiles.includes(h.name),
            "data-filter-profile": h.name,
            onClick: (B) => P("profiles", h.name)
          }, {
            default: C(() => [
              f(p(h.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          k(m(ze), null, {
            default: C(() => [...u[4] || (u[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), r(z, null, X(L.value, (h) => (a(), _(m($e), {
            key: h.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(h.name),
            checked: j.value.programs.includes(h.name),
            "data-filter-program": h.name,
            onClick: (B) => P("programs", h.name)
          }, {
            default: C(() => [
              f(p(h.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          N.value ? (a(), _(m($e), {
            key: 1,
            "data-filter-clear": "",
            onClick: H
          }, {
            default: C(() => [...u[5] || (u[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ]),
        default: C(() => [
          k(m(gt), {
            options: R.value.states,
            value: S.value,
            onPick: u[0] || (u[0] = (h) => S.value = h)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      S.value === "retired" && R.value.upgrade_retired ? (a(), r("p", jn, "Retired during the upgrade: " + p(R.value.upgrade_retired), 1)) : y("", !0),
      g("div", {
        ref_key: "list",
        ref: ie,
        class: oe(["agents-view", { "agents-view-open": Z.value }])
      }, [
        K.value && !W.value && !ge.value.length && N.value ? (a(), _(m(De), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: C(() => [
            k(m(te), {
              small: "",
              "data-empty-clear": "",
              onClick: H
            }, {
              default: C(() => [...u[6] || (u[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), _(m(vt), {
          key: 1,
          rows: ge.value,
          failure: W.value,
          loaded: K.value,
          more: !Z.value && J.value,
          older: s,
          empty: E.value.title,
          hint: E.value.hint,
          searching: T.value
        }, {
          default: C(({ row: h }) => [
            g("div", {
              class: "agent-row",
              "data-agent-row": h.id
            }, [
              k(un, {
                row: h,
                facts: O(h),
                progress: M(h),
                "wait-reason": A(h),
                open: h.id === G.value,
                onToggle: (B) => xe(h)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Rn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      Z.value && ve.value ? (a(), r("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: me
      }, p(ve.value) + " more", 1)) : y("", !0)
    ], 2));
  }
}, On = /* @__PURE__ */ ee(Tn, [["__scopeId", "data-v-980c141c"]]);
export {
  On as A
};
