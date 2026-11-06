/* @code-commandments-generated */
import { openBlock as a, createElementBlock as l, normalizeStyle as Te, normalizeClass as ne, toDisplayString as v, createCommentVNode as m, createElementVNode as V, renderSlot as we, computed as f, createVNode as x, withCtx as T, createTextVNode as w, Fragment as B, renderList as le, onUnmounted as Ce, ref as A, onMounted as je, createBlock as j, Teleport as Ke, mergeProps as Ue, watch as pe, toRef as Ze, unref as k, withModifiers as he, defineAsyncComponent as Je, withKeys as Ae, createSlots as Ge, resolveDynamicComponent as Ye, nextTick as Ve } from "vue";
import { peekRef as $e, Icon as ze, RunningCommand as Qe, FoldGroup as Ee, TaskStatusIcon as Xe, useNow as et, age as tt, perHour as at, useWindow as Be, loadWindowComponent as nt, coalesced as Ie, READ_RATES as Ne, TimeAgo as He, Btn as qe, InnerTabs as lt, TabBody as ot, SwitchCase as st, EmptyState as We, useRows as rt, useDeclaredRows as Re, SearchBar as it, Segmented as ct, MenuLabel as Se, MenuItem as be, RowList as dt, toggleFilter as ut } from "@journal/window-kit";
import { _ as oe, T as ht } from "./TranscriptRows-DCpyNUhv.mjs";
const pt = ["stroke-width", "innerHTML"], J = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const M = e, p = { right: 0, down: 90, left: 180, up: 270 }, c = {
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
    return (y, z) => (a(), l("svg", {
      class: "ico",
      style: Te({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...M.facing === "right" ? {} : { transform: `rotate(${p[M.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[c[e.name] || e.name] || t.dot
    }, null, 12, pt));
  }
}, gt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, vt = {
  key: 1,
  class: "menu-item-text"
}, ft = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (M, p) => (a(), l("button", {
      type: "button",
      class: ne(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), l("span", gt, v(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (a(), l("span", vt, [
        V("span", null, [
          we(M.$slots, "default", {}, void 0, !0)
        ]),
        V("small", null, v(e.description), 1)
      ])) : we(M.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ oe(ft, [["__scopeId", "data-v-9c67fe37"]]), mt = {}, yt = { class: "menu-label" };
function kt(e, M) {
  return a(), l("span", yt, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ke = /* @__PURE__ */ oe(mt, [["render", kt], ["__scopeId", "data-v-71c11156"]]), wt = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Mt = {
  key: 0,
  class: "skills-none"
}, bt = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: M }) {
    const p = e, c = M, t = f(() => p.skills.filter((z) => z.state === "loaded")), y = f(() => p.skills.filter((z) => z.state !== "loaded"));
    return (z, C) => (a(), l("div", wt, [
      x(ke, null, {
        default: T(() => [...C[1] || (C[1] = [
          w("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? m("", !0) : (a(), l("p", Mt, "None yet. Compacting the conversation empties this list.")),
      (a(!0), l(B, null, le(t.value, (g) => (a(), l("p", {
        key: g.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        x(J, {
          name: "book",
          size: 12
        }),
        w(v(g.skill), 1)
      ]))), 128)),
      y.value.length ? (a(), l(B, { key: 1 }, [
        x(ke, null, {
          default: T(() => [...C[2] || (C[2] = [
            w("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), l(B, null, le(y.value, (g) => (a(), l("p", {
          key: g.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          x(J, {
            name: "book",
            size: 12
          }),
          w(v(g.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      x(me, {
        "data-agent-skills-browse": "",
        onClick: C[0] || (C[0] = (g) => c("browse"))
      }, {
        default: T(() => [...C[3] || (C[3] = [
          w("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, xt = /* @__PURE__ */ oe(bt, [["__scopeId", "data-v-27140adf"]]), $t = (e, M, p) => Math.max(M, Math.min(p, e)), Fe = /* @__PURE__ */ new WeakMap(), Ct = (e, M) => Fe.set(e, M);
function St(e, M) {
  for (let p = M; p; p = Fe.get(p) ?? p.parentElement) if (p === e) return !0;
  return !1;
}
function Tt(e, M) {
  const p = (c) => {
    var y, z;
    const t = ((y = e.value) == null ? void 0 : y.element) || ((z = e.value) == null ? void 0 : z.$el) || e.value;
    t && !St(t, c.target) && M(c);
  };
  window.addEventListener("click", p), Ce(() => window.removeEventListener("click", p));
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
  setup(e, { expose: M, emit: p }) {
    const c = e, t = A(null), y = (i) => i ? `${i}px` : void 0, z = f(() => ({
      minWidth: y(c.minWidth),
      maxWidth: y(c.maxWidth),
      maxHeight: y(c.maxHeight),
      height: y(c.height)
    })), C = A({ w: 0, h: 0 }), g = A(c.anchor ? c.anchor.getBoundingClientRect() : null), D = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), S = (i) => ({
      left: Math.max(0, i.left),
      top: Math.max(0, i.top),
      right: Math.min(window.innerWidth, i.right),
      bottom: Math.min(window.innerHeight, i.bottom)
    }), R = (i) => {
      const $ = i.closest(".pane, .float-window");
      return $ ? S($.getBoundingClientRect()) : D();
    }, Z = (i, $) => `${Math.max(0, i ? Math.min(i, $) : $)}px`;
    function P(i, $) {
      return {
        below: i.bottom - $.bottom - c.gap - fe,
        above: $.top - i.top - c.gap - fe,
        across: i.right - i.left - 2 * fe
      };
    }
    function G(i) {
      const $ = R(c.anchor), O = P($, i);
      return C.value.w <= O.across && C.value.h <= Math.max(O.below, O.above) ? $ : D();
    }
    const E = f(() => {
      if (!g.value) return z.value;
      const i = g.value, $ = G(i), O = P($, i), { w: W, h: F } = C.value, ce = c.align === "auto" ? i.left + i.right > $.left + $.right : c.align === "right", Q = $t(ce ? i.right - W : i.left, $.left + fe, Math.max($.left + fe, $.right - W - fe)), se = F > O.below && O.above > O.below ? { bottom: `${window.innerHeight - i.top + c.gap}px`, maxHeight: Z(c.maxHeight, O.above) } : { top: `${i.bottom + c.gap}px`, maxHeight: Z(c.maxHeight, O.below) };
      return { ...z.value, ...se, left: `${Q}px`, maxWidth: Z(c.maxWidth, O.across) };
    }), I = p, L = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function K(i) {
      const $ = L(), O = $.indexOf(document.activeElement);
      $[(O + i + $.length) % $.length].focus();
    }
    const X = { ArrowDown: () => K(1), ArrowUp: () => K(-1), Escape: () => I("close") }, Y = (i) => X[i.key] && (i.preventDefault(), X[i.key]()), q = () => t.value && (C.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let ee = 0;
    const d = new ResizeObserver(() => {
      cancelAnimationFrame(ee), ee = requestAnimationFrame(q);
    });
    Tt(t, (i) => c.anchor && !c.anchor.contains(i.target) && I("close"));
    const o = (i, $) => ["top", "left", "right", "bottom"].some((O) => Math.abs(i[O] - $[O]) > 1), u = (i) => i.bottom < 0 || i.top > window.innerHeight;
    let te = 0;
    function ie() {
      if (c.anchor) {
        const i = c.anchor.getBoundingClientRect();
        if (!c.anchor.isConnected || u(i)) return I("close");
        o(i, g.value) && (g.value = i);
      }
      te = requestAnimationFrame(ie);
    }
    return je(() => {
      c.anchor && t.value && Ct(t.value, c.anchor), q(), t.value && d.observe(t.value), !c.plain && L()[0] && L()[0].focus(), ie();
    }), Ce(() => {
      d.disconnect(), cancelAnimationFrame(te), cancelAnimationFrame(ee);
    }), M({ element: t }), (i, $) => (a(), j(Ke, {
      to: "body",
      disabled: !e.anchor
    }, [
      V("div", Ue({
        ref_key: "panel",
        ref: t
      }, i.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: E.value,
        onKeydown: Y
      }), [
        we(i.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), At = /* @__PURE__ */ oe(zt, [["__scopeId", "data-v-7f046e0d"]]);
async function Vt(e, M, p) {
  if (!e) return p(M);
  const { target: c, fields: t } = e, y = Object.fromEntries(Object.keys(t).map((g) => [g, c[g]])), z = () => Object.assign(c, y);
  Object.assign(c, t);
  let C = !1;
  try {
    const g = await p(M);
    return C = g.ok, g;
  } finally {
    C || z();
  }
}
function Ht(e, M, p) {
  const c = A([]), t = A([]), y = A({}), z = A(""), C = A(!1), g = f(() => !!e.value && !e.value.ended_at), D = f(() => g.value && !!e.value.paused_at);
  async function S() {
    if (g.value) {
      const I = await M(["agent", "controls", String(e.value.id)]);
      c.value = I.ok ? I.value.groups : [];
      return;
    }
    const E = await M(["agent", "programs"]);
    t.value = E.ok ? E.value.rows : [];
  }
  async function R(E, I = null) {
    z.value = "";
    const L = await Vt(I, E, M);
    return z.value = L.ok ? "" : L.error, p(), L;
  }
  const Z = (E, I) => R(["agent", "control", String(e.value.id), E, I.value], { target: y, fields: { value: { ...y.value, [E]: I.label } } }), P = () => (C.value = !1, R(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), G = (E) => R(["agent", "launch", E.name]);
  return je(S), pe(g, S), { groups: c, programs: t, chosen: y, failure: z, asking: C, running: g, paused: D, choose: Z, stop: P, start: G };
}
const _e = { claude: "Claude Code", codex: "Codex" };
Object.entries(_e).map(([e, M]) => ({ key: e, label: M }));
function Rt(e, M = "agent") {
  return _e[e] || M;
}
const Lt = ["disabled", "title"], Ot = ["title"], jt = { class: "gauge usage" }, Et = ["disabled", "title"], Bt = { class: "gauge" }, It = ["disabled", "title"], Nt = ["disabled"], qt = ["disabled"], Wt = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Ft = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, _t = ["title"], Dt = 75, Pt = {
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
  setup(e, { emit: M }) {
    const p = e, c = M, t = Ht(Ze(p, "agent"), p.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => c("changed")), y = A(null), z = A(""), C = f(() => t.groups.value.find((d) => d.key === z.value));
    function g(d, o) {
      y.value = d.currentTarget, z.value = o;
    }
    function D() {
      y.value = null, z.value = "", t.asking.value = !1;
    }
    const S = A([]), R = f(() => S.value.filter((d) => d.state === "loaded"));
    async function Z() {
      const d = p.agent && p.run ? await p.run(["agent-skill", "list", "--agent", String(p.agent.id)]) : null;
      S.value = d != null && d.ok ? d.value.rows ?? [] : [];
    }
    function P(d) {
      g(d, "skills"), Z();
    }
    pe(() => {
      var d;
      return (d = p.agent) == null ? void 0 : d.id;
    }, Z, { immediate: !0 });
    const G = (d) => t.groups.value.some((o) => o.key === d), E = f(() => {
      var d;
      return t.chosen.value.model ?? ((d = L.value) == null ? void 0 : d.model) ?? "";
    }), I = f(() => {
      var d;
      return t.chosen.value.effort ?? ((d = L.value) == null ? void 0 : d.effort) ?? "";
    });
    f(() => !!p.agent && !p.agent.ended_at);
    const L = f(() => {
      var d;
      return ((d = p.usage.agents) == null ? void 0 : d.find((o) => {
        var u;
        return o.id === ((u = p.agent) == null ? void 0 : u.id);
      })) ?? null;
    }), K = f(() => {
      var d;
      return ((d = p.usage.windows) == null ? void 0 : d[0]) ?? null;
    }), X = f(() => K.value ? Math.max(0, Math.min(100, Math.round(K.value.used_percent))) : null), Y = f(() => {
      var d;
      return ((d = L.value) == null ? void 0 : d.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), q = f(() => {
      var d;
      return (d = L.value) != null && d.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), ee = f(() => {
      var u;
      const d = (u = p.agent) != null && u.process_started_at ? new Date(p.agent.process_started_at).getTime() : 0;
      if (!d) return "";
      const o = Math.max(0, Math.floor((p.now - d) / 6e4));
      return o >= 60 ? `${Math.floor(o / 60)}h ${o % 60}m` : `${o}m`;
    });
    return (d, o) => (a(), l("div", {
      class: ne(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), l(B, { key: 0 }, [
        V("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: o[0] || (o[0] = (u) => g(u, "agent"))
        }, [
          x(J, {
            name: "agents",
            size: 12
          }),
          w(" " + v(k(Rt)(e.agent.program)), 1)
        ], 8, Lt),
        X.value !== null ? (a(), l("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${X.value}% of the plan's ${K.value.title} allowance used`,
          onClick: o[1] || (o[1] = (u) => c("open", "usage", u.currentTarget))
        }, [
          x(J, {
            name: "clock",
            size: 12
          }),
          o[14] || (o[14] = w()),
          V("span", jt, [
            V("span", {
              style: Te({ width: `${X.value}%` })
            }, null, 4)
          ]),
          w(" " + v(X.value) + "% ", 1)
        ], 8, Ot)) : m("", !0),
        Y.value !== null ? (a(), l("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${Y.value}% full: clear or compact it`,
          onClick: o[2] || (o[2] = (u) => G("context") ? g(u, "context") : c("open", "context", u.currentTarget))
        }, [
          x(J, {
            name: "gauge",
            size: 12
          }),
          o[15] || (o[15] = w()),
          V("span", Bt, [
            V("span", {
              style: Te({ width: `${Y.value}%` })
            }, null, 4)
          ]),
          w(" " + v(Y.value) + "% ", 1)
        ], 8, Et)) : m("", !0),
        E.value ? (a(), l("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${E.value}: change the model`,
          onClick: o[3] || (o[3] = (u) => G("model") ? g(u, "model") : null)
        }, [
          x(J, {
            name: "model",
            size: 12
          }),
          w(" " + v(E.value), 1)
        ], 8, It)) : m("", !0),
        G("effort") || e.card && I.value ? (a(), l("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: o[4] || (o[4] = (u) => g(u, "effort"))
        }, [
          x(J, {
            name: "bolt",
            size: 12
          }),
          w(" " + v(I.value), 1)
        ], 8, Nt)) : m("", !0),
        q.value ? (a(), l("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: o[5] || (o[5] = (u) => c("open", "cost", u.currentTarget))
        }, v(q.value), 9, qt)) : m("", !0),
        ee.value ? (a(), l("span", Wt, [
          x(J, {
            name: "reminders",
            size: 12
          }),
          w(" " + v(ee.value), 1)
        ])) : m("", !0),
        e.branch ? (a(), l("span", Ft, [
          x(J, {
            name: "branch",
            size: 12
          }),
          w(" " + v(e.branch), 1)
        ])) : m("", !0),
        e.card ? m("", !0) : (a(), l("button", {
          key: 7,
          type: "button",
          class: ne(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: o[6] || (o[6] = (u) => c("open", "jobs", u.currentTarget))
        }, [
          x(J, {
            name: "clock",
            size: 12
          }),
          w(" " + v(e.jobs), 1)
        ], 2)),
        e.run ? (a(), l("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: P
        }, [
          x(J, {
            name: "book",
            size: 12
          }),
          w(" " + v(R.value.length), 1)
        ])) : m("", !0),
        e.fitness ? (a(), l(B, { key: 9 }, [
          V("button", {
            type: "button",
            class: ne(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Dt }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: o[7] || (o[7] = (u) => c("open", "fitness", u.currentTarget))
          }, [
            x(J, {
              name: "heart",
              size: 12
            }),
            w(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          V("button", {
            type: "button",
            class: ne(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: o[8] || (o[8] = (u) => c("open", "load", u.currentTarget))
          }, [
            x(J, {
              name: "weight",
              size: 12
            }),
            w(" " + v(e.fitness.workload), 1)
          ], 2)
        ], 64)) : m("", !0)
      ], 64)) : e.run && !e.loading ? (a(), l("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: o[9] || (o[9] = (u) => g(u, "start"))
      }, [
        x(J, {
          name: "agents",
          size: 12
        }),
        o[16] || (o[16] = w(" Start an agent", -1))
      ])) : m("", !0),
      o[22] || (o[22] = V("span", { class: "space" }, null, -1)),
      k(t).failure.value ? (a(), l("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: k(t).failure.value
      }, v(k(t).failure.value), 9, _t)) : m("", !0),
      we(d.$slots, "default", {}, void 0, !0),
      y.value ? (a(), j(At, {
        key: 3,
        anchor: y.value,
        "min-width": 190,
        onClose: D
      }, {
        default: T(() => [
          z.value === "agent" ? (a(), l(B, { key: 0 }, [
            k(t).asking.value ? (a(), l(B, { key: 0 }, [
              x(ke, { "data-agent-stop-ask": "" }, {
                default: T(() => [...o[17] || (o[17] = [
                  w("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              x(me, {
                "data-agent-stop-confirm": "",
                onClick: o[10] || (o[10] = (u) => (D(), k(t).stop()))
              }, {
                default: T(() => [...o[18] || (o[18] = [
                  w("Stop it", -1)
                ])]),
                _: 1
              }),
              x(me, {
                onClick: o[11] || (o[11] = (u) => k(t).asking.value = !1)
              }, {
                default: T(() => [...o[19] || (o[19] = [
                  w("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (a(), j(me, {
              key: 1,
              "data-agent-stop": "",
              onClick: o[12] || (o[12] = (u) => k(t).asking.value = !0)
            }, {
              default: T(() => [...o[20] || (o[20] = [
                w("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : z.value === "start" ? (a(), l(B, { key: 1 }, [
            x(ke, null, {
              default: T(() => [...o[21] || (o[21] = [
                w("Start an agent", -1)
              ])]),
              _: 1
            }),
            (a(!0), l(B, null, le(k(t).programs.value, (u) => (a(), j(me, {
              key: u.name,
              "data-agent-program": u.name,
              onClick: (te) => (D(), k(t).start(u))
            }, {
              default: T(() => [
                w(v(u.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : z.value === "skills" ? (a(), j(xt, {
            key: 2,
            skills: S.value,
            onBrowse: o[13] || (o[13] = (u) => (D(), c("open", "skills", null)))
          }, null, 8, ["skills"])) : C.value ? (a(), l(B, { key: 3 }, [
            x(ke, null, {
              default: T(() => [
                w(v(C.value.label), 1)
              ]),
              _: 1
            }),
            (a(!0), l(B, null, le(C.value.choices, (u) => (a(), j(me, {
              key: u.value,
              "data-agent-choice": u.value,
              onClick: (te) => (k(t).choose(C.value.key, u), D())
            }, {
              default: T(() => [
                w(v(u.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : m("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : m("", !0)
    ], 2));
  }
}, Kt = /* @__PURE__ */ oe(Pt, [["__scopeId", "data-v-cada4ffe"]]), Ut = {
  class: "agent-command",
  "data-agent-command": ""
}, Zt = {
  key: 1,
  "data-agent-stopped": ""
}, Jt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (M, p) => (a(), l("span", Ut, [
      e.waitReason ? (a(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: p[0] || (p[0] = he((c) => k($e)("test_queue:0"), ["stop"]))
      }, [
        w("Waiting: " + v(e.waitReason) + " ", 1),
        x(k(ze), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), l("span", Zt, "Waiting")) : (a(), j(k(Qe), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Le = /* @__PURE__ */ oe(Jt, [["__scopeId", "data-v-bb905922"]]), Gt = ["data-agent-delegated", "onClick"], Yt = { class: "agent-task-number" }, Qt = { class: "agent-task-title" }, Xt = ["title"], ea = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: M }) {
    const p = M;
    return (c, t) => (a(), j(k(Ee), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (y) => p("toggle"))
    }, {
      default: T(() => [
        (a(!0), l(B, null, le(e.section.tasks, (y) => (a(), l("button", {
          key: y.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": y.id,
          onClick: (z) => k($e)(`tasks:${y.id}`)
        }, [
          x(k(Xe), {
            status: y.state
          }, null, 8, ["status"]),
          V("span", Yt, v(y.id), 1),
          V("span", Qt, v(y.title), 1),
          y.plan_id ? (a(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${y.plan_id}: ${y.plan_title}`
          }, "Plan " + v(y.plan_id) + ": " + v(y.plan_title), 9, Xt)) : m("", !0)
        ], 8, Gt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, ta = /* @__PURE__ */ oe(ea, [["__scopeId", "data-v-acc154a9"]]), aa = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], na = { class: "agent-head" }, la = ["data-state"], oa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, sa = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, ra = { class: "agent-times" }, ia = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, ca = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, da = { class: "agent-line" }, ua = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, ha = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, pa = {
  key: 0,
  class: "agent-line agent-work-start"
}, ga = ["data-peek"], va = ["title"], fa = ["data-peek"], ma = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, ya = {
  key: 2,
  class: "agent-summary",
  "data-agent-report": ""
}, ka = {
  key: 3,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, wa = {
  key: 4,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ma = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, ba = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, xa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, $a = {
  key: 0,
  class: "agent-helper-brief"
}, Ca = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Sa = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ta = "It ended without a report", za = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: M }) {
    const p = { helper: "Helper", reviewer: "Reviewer" }, c = ["started", "blocked", "open", "completed"], t = e, y = M, z = et(), C = f(() => {
      var s, h;
      if ((s = t.facts) != null && s.profile_title) return t.facts.profile_title;
      if ((h = t.facts) != null && h.profile) return t.facts.profile;
      const n = p[t.row.role] || t.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), g = f(() => {
      var n;
      return ((n = t.facts) == null ? void 0 : n.tasks) ?? [];
    }), D = f(() => g.value.filter((n) => n.state === "open")), S = f(() => {
      const n = g.value.find((s) => {
        var h;
        return s.id === ((h = t.facts) == null ? void 0 : h.task_id);
      });
      return n != null && n.plan_id ? n : D.value.find((s) => s.plan_id);
    }), R = f(() => {
      var n, s, h, b, r;
      return t.row.role === "helper" ? ((n = t.facts) == null ? void 0 : n.helper_job) || "" : (s = t.facts) != null && s.job_enabled && (((h = t.facts) == null ? void 0 : h.task_title) || ((b = D.value[0]) == null ? void 0 : b.title) || ((r = g.value.at(-1)) == null ? void 0 : r.title)) || "";
    }), Z = f(() => {
      var n;
      return ((n = t.facts) == null ? void 0 : n.job_returned) || t.row.job_returned || "";
    }), P = f(() => {
      const n = R.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), G = f(() => {
      var n, s;
      return [t.row.program, (n = t.facts) == null ? void 0 : n.model, (s = t.facts) == null ? void 0 : s.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), E = f(() => {
      var n, s;
      return t.row.ended_at && ((s = (n = t.facts) == null ? void 0 : n.job_returned) != null && s.startsWith(Ta)) ? t.facts.job_returned : "";
    }), I = f(() => tt(t.row.process_started_at || t.row.created_at, z.value)), L = /* @__PURE__ */ new Set(["open", "started", "testing"]), K = f(() => !!t.row.ended_at && t.row.role !== "main" && g.value.some((n) => L.has(n.state))), X = f(() => {
      var n;
      return t.waitReason || K.value ? "waiting" : t.row.state === "running" && ((n = t.facts) == null ? void 0 : n.state) || t.row.state;
    }), Y = f(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.completed_count) ?? g.value.filter((s) => s.state === "completed").length;
    }), q = f(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.task_count) ?? g.value.length;
    }), ee = f(() => `${Y.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), d = f(() => {
      var s;
      const n = at(Y.value, ((s = t.progress) == null ? void 0 : s.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, z.value);
      return t.row.role !== "main" && n ? `${n} per hour` : "";
    }), o = f(() => g.value.length ? c.map((n) => ({ state: n, label: n.slice(0, 1).toUpperCase() + n.slice(1), tasks: g.value.filter((s) => s.state === n || n === "started" && s.state === "testing" || n === "completed" && s.state === "cancelled") })) : []), u = /* @__PURE__ */ new Set(["completed"]), te = A({}), ie = (n) => !(te.value[n] ?? u.has(n)), i = (n) => te.value = { ...te.value, [n]: ie(n) }, $ = Be(), O = f(() => t.row.access === "read-only"), W = f(() => O.value ? $.tabs.filter((n) => ["transcript", "terminal"].includes(n.key)) : $.tabs), F = A(W.value[0]);
    pe(() => t.open, (n) => {
      n && (F.value = W.value[0]);
    });
    const ce = Object.fromEntries($.tabs.filter((n) => n.component).map((n) => [n.key, Je(() => nt(n.component))])), Q = f(() => t.row.role === "helper" && !t.row.ended_at), ge = () => $.run(["helper", "stop", String(t.row.id)]), se = A(!1), re = A(""), ae = A(""), de = f(() => t.row.role !== "main" && (!t.row.ended_at || K.value || t.waitReason));
    async function Me() {
      if (!de.value) return;
      const n = await $.read(`usage tool --agent ${t.row.id}`, { deferred: !0 });
      re.value = n.ok ? n.value.tool : "", ae.value = n.ok ? n.value.note : "";
    }
    const ue = $.follow(["hook_call.*", "process_part.*"], Ie(Me, Ne.agentCommand));
    return Ce(() => ue == null ? void 0 : ue()), Me(), (n, s) => {
      var h, b, r, H;
      return a(), l("div", {
        class: ne(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: s[6] || (s[6] = (U) => !e.open && y("toggle")),
        onKeydown: [
          s[7] || (s[7] = Ae(he((U) => !e.open && y("toggle"), ["self", "prevent"]), ["enter"])),
          s[8] || (s[8] = Ae(he((U) => !e.open && y("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        V("span", na, [
          e.open ? (a(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: s[0] || (s[0] = he((U) => y("toggle"), ["stop"]))
          }, [
            x(k(ze), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          V("span", {
            class: "agent-dot",
            "data-state": X.value,
            "data-agent-motion": ""
          }, null, 8, la),
          V("span", oa, v(C.value), 1),
          V("span", sa, v(((h = e.facts) == null ? void 0 : h.given_name) || e.row.id), 1),
          e.open ? m("", !0) : (a(), j(k(ze), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          V("span", ra, [
            e.row.ended_at && !K.value ? (a(), j(k(He), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (a(), l("span", ia, v(I.value), 1)),
            (b = e.facts) != null && b.last_activity ? (a(), l("span", ca, [
              s[9] || (s[9] = w("Last heard: ", -1)),
              x(k(He), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : m("", !0)
          ])
        ]),
        V("span", da, [
          V("span", ua, v(G.value), 1),
          q.value && !R.value ? (a(), l("span", ha, v(ee.value), 1)) : m("", !0)
        ]),
        S.value ? (a(), l("span", pa, [
          V("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${S.value.plan_id}`,
            onClick: s[1] || (s[1] = he((U) => k($e)(`plans:${S.value.plan_id}`), ["stop"]))
          }, "Plan " + v(S.value.plan_id) + ": " + v(S.value.plan_title), 9, ga)
        ])) : m("", !0),
        R.value ? (a(), l("span", {
          key: 1,
          class: ne(["agent-line", { "agent-work-start": !S.value }])
        }, [
          V("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: R.value
          }, [
            P.value ? (a(), l("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": P.value,
              onClick: s[2] || (s[2] = he((U) => k($e)(P.value), ["stop"]))
            }, v(R.value), 9, fa)) : (a(), l(B, { key: 1 }, [
              w(v(R.value), 1)
            ], 64))
          ], 8, va),
          q.value ? (a(), l("span", ma, v(ee.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        Z.value ? (a(), l("p", ya, [
          s[10] || (s[10] = V("span", null, "Last report: ", -1)),
          w(v(Z.value), 1)
        ])) : m("", !0),
        e.row.retirement_reason ? (a(), l("p", ka, "Retirement reason: " + v(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (a(), l("p", wa, v(e.row.resume_reason), 1)) : m("", !0),
        !e.open && (de.value || q.value && d.value) ? (a(), l("span", {
          key: 5,
          class: ne(["agent-foot", { "agent-work-start": !R.value && !S.value }]),
          "data-agent-foot": ""
        }, [
          de.value ? (a(), j(Le, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: K.value,
            command: re.value,
            note: ae.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          q.value && d.value ? (a(), l("span", Ma, v(d.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        e.open ? (a(), l("div", {
          key: 6,
          class: "agent-more",
          "data-agent-more": "",
          onClick: s[5] || (s[5] = he(() => {
          }, ["stop"]))
        }, [
          x(Kt, {
            agent: e.row,
            branch: (r = e.progress) == null ? void 0 : r.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: T(() => [
              Q.value ? (a(), j(k(qe), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: ge
              }, {
                default: T(() => [...s[11] || (s[11] = [
                  w("Stop", -1)
                ])]),
                _: 1
              })) : m("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          de.value ? (a(), j(Le, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: K.value,
            command: re.value,
            note: ae.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          E.value ? (a(), l("p", ba, v(E.value), 1)) : m("", !0),
          x(k(lt), {
            class: "agent-tabs",
            tabs: W.value,
            active: F.value,
            answer: { tasks: g.value.length },
            onChoose: s[3] || (s[3] = (U) => F.value = U)
          }, null, 8, ["tabs", "active", "answer"]),
          x(k(ot), {
            class: "agent-tab-body",
            tab: F.value,
            "data-agent-tab-body": (H = F.value) == null ? void 0 : H.key
          }, {
            default: T(() => {
              var U;
              return [
                x(k(st), {
                  value: (U = F.value) == null ? void 0 : U.key
                }, Ge({
                  tasks: T(() => {
                    var _;
                    return [
                      g.value.length ? m("", !0) : (a(), j(k(We), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: T(() => [...s[12] || (s[12] = [
                          w("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (a(!0), l(B, null, le(o.value, (N) => (a(), j(ta, {
                        key: N.state,
                        section: N,
                        open: ie(N.state),
                        onToggle: (ye) => i(N.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (_ = e.facts) != null && _.instruction ? (a(), l(B, { key: 1 }, [
                        s[13] || (s[13] = V("p", { class: "agent-label" }, "Instruction", -1)),
                        V("div", xa, v(e.facts.instruction), 1)
                      ], 64)) : m("", !0)
                    ];
                  }),
                  transcript: T(() => {
                    var _;
                    return [
                      O.value ? (a(), l(B, { key: 0 }, [
                        (_ = e.facts) != null && _.instruction ? (a(), l("div", $a, [
                          x(k(Ee), {
                            label: "Instruction",
                            open: se.value,
                            "data-agent-section": "instruction",
                            onToggle: s[4] || (s[4] = (N) => se.value = !se.value)
                          }, {
                            default: T(() => [
                              V("div", Ca, v(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (a(), l("p", Sa, "No job recorded")) : m("", !0)
                      ], 64)) : m("", !0),
                      x(ht, {
                        line: `agent transcript ${e.row.id}`,
                        agent: O.value ? Q.value ? e.row.id : null : e.row.id,
                        helper: O.value && Q.value,
                        padding: "0"
                      }, null, 8, ["line", "agent", "helper"])
                    ];
                  }),
                  _: 2
                }, [
                  le(k(ce), (_, N) => ({
                    name: N,
                    fn: T(() => [
                      (a(), j(Ye(_), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : m("", !0)
      ], 42, aa);
    };
  }
}, Aa = /* @__PURE__ */ oe(za, [["__scopeId", "data-v-fd1b4f7f"]]), Va = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Ha = ["data-agent-row"], Oe = "journal.agents.filters", xe = "cubic-bezier(0.2, 0.9, 0.25, 1)", Ra = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const M = e, { rows: p } = rt("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: c } = Re("waits"), { rows: t } = Re("progress"), y = (h) => t.value.find((b) => b.agent_id === h.id) ?? null, z = (h) => {
      var b;
      return ((b = c.value.find((r) => r.agent_id === h.id)) == null ? void 0 : b.reason) ?? "";
    }, C = A("running"), g = A(""), D = JSON.parse(localStorage.getItem(Oe) || '{"roles":[],"profiles":[],"programs":[]}'), S = A(D), R = A({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), Z = A([]), P = f(() => S.value.roles.length + S.value.profiles.length + S.value.programs.length), G = (h, b) => {
      S.value = ut(S.value, h, b);
    }, E = () => {
      S.value = { roles: [], profiles: [], programs: [] };
    }, I = (h) => h.slice(0, 1).toUpperCase() + h.slice(1);
    pe(S, (h) => localStorage.setItem(Oe, JSON.stringify(h)));
    const L = Be();
    async function K() {
      const [h, b] = await Promise.all([L.read("agent cards --options"), L.read("agent programs")]);
      h.ok && (R.value = h.value), b.ok && (Z.value = b.value.rows);
    }
    L.follow(["agent.*"], K), K();
    const X = A([]), Y = A(""), q = A(!1), ee = A(!1), d = A(25);
    let o = 0;
    async function u() {
      const h = ++o, b = [
        ...S.value.roles.map((H) => `--role ${JSON.stringify(H)}`),
        ...S.value.profiles.map((H) => `--profile ${JSON.stringify(H)}`),
        ...S.value.programs.map((H) => `--program ${JSON.stringify(H)}`)
      ].join(" "), r = await L.read(`${M.line} --show ${C.value} --search ${JSON.stringify(g.value)} --limit ${d.value} ${b}`);
      h === o && (X.value = r.ok ? r.value.rows : [], Y.value = r.ok ? "" : r.error, ee.value = r.ok && r.value.page * r.value.size < r.value.total, q.value = !0);
    }
    async function te() {
      return d.value += 25, await u(), !0;
    }
    pe([C, g, S], () => {
      d.value = 25, u();
    }), L.follow(["agent.*", "task.*", ...L.sources.flatMap((h) => h.events)], Ie(u, Ne.pageOfAgents)), u();
    const ie = (h) => h.facts ?? p.value.find((b) => b.id === h.id) ?? null, i = X, $ = f(() => !!g.value.trim() || P.value > 0), O = f(() => M.texts[C.value] ?? { title: M.empty, hint: "" }), W = A(null), F = A(null), ce = A(null), Q = f(() => i.value.find((h) => h.id === W.value) ?? null), ge = f(() => Q.value ? [Q.value] : i.value), se = f(() => i.value.length - ge.value.length), re = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ae = !1, de = 0;
    async function Me(h) {
      if (ae) return;
      ae = !0, de = ce.value.scrollTop;
      const b = F.value.querySelector(`[data-agent-open="${h.id}"]`);
      if (!re()) {
        const _ = [...F.value.querySelectorAll(".agent-row")].filter((N) => !N.contains(b));
        await Promise.all(_.map((N) => N.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const r = [...b.querySelectorAll(".agent-head, .agent-line")], H = [...r, ...b.querySelectorAll("[data-agent-motion]")], U = H.map((_) => _.getBoundingClientRect());
      if (W.value = h.id, await Ve(), !re()) {
        const _ = H.map((N) => N.getBoundingClientRect());
        H.forEach((N, ye) => {
          const ve = r.indexOf(N.parentElement), De = U[ye].left - _[ye].left - (ve < 0 ? 0 : U[ve].left - _[ve].left), Pe = U[ye].top - _[ye].top - (ve < 0 ? 0 : U[ve].top - _[ve].top);
          N.animate([{ transform: `translate(${De}px, ${Pe}px)` }, { transform: "none" }], { duration: 280, easing: xe });
        }), F.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((N) => {
          N.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: xe, fill: "backwards" });
        });
      }
      ae = !1;
    }
    async function ue() {
      if (ae || !Q.value) return;
      ae = !0;
      const h = F.value.querySelector(`[data-agent-open="${W.value}"]`), b = [...h.children, ...F.value.querySelectorAll(".agents-held")], r = re() ? [] : b.map((H) => H.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(r.map((H) => H.finished)), W.value = null, await Ve(), ce.value.scrollTop = de, r.forEach((H) => H.cancel()), re() || (h.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: xe }), F.value.querySelectorAll(".agent-row").forEach((H) => {
        H.contains(h) || H.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: xe });
      })), ae = !1;
    }
    const n = (h) => W.value === h.id ? ue() : Me(h);
    pe(g, (h) => h.trim() && (W.value = null)), pe(C, () => {
      W.value = null;
    });
    const s = (h) => {
      h.key === "Escape" && ue();
    };
    return window.addEventListener("keydown", s), Ce(() => window.removeEventListener("keydown", s)), (h, b) => (a(), l("div", {
      ref_key: "agents",
      ref: F,
      class: ne(["agents", { focused: Q.value }])
    }, [
      x(k(it), {
        modelValue: g.value,
        "onUpdate:modelValue": b[1] || (b[1] = (r) => g.value = r),
        placeholder: "Search agents",
        "menu-count": P.value,
        "data-agents-search": ""
      }, {
        menu: T(() => [
          x(k(Se), null, {
            default: T(() => [...b[2] || (b[2] = [
              w("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(B, null, le(R.value.roles, (r) => (a(), j(k(be), {
            key: r,
            role: "menuitemcheckbox",
            "aria-checked": S.value.roles.includes(r),
            checked: S.value.roles.includes(r),
            "data-filter-role": r,
            onClick: (H) => G("roles", r)
          }, {
            default: T(() => [
              w(v(I(r)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          R.value.profiles.length ? (a(), j(k(Se), { key: 0 }, {
            default: T(() => [...b[3] || (b[3] = [
              w("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (a(!0), l(B, null, le(R.value.profiles, (r) => (a(), j(k(be), {
            key: r.name,
            role: "menuitemcheckbox",
            "aria-checked": S.value.profiles.includes(r.name),
            checked: S.value.profiles.includes(r.name),
            "data-filter-profile": r.name,
            onClick: (H) => G("profiles", r.name)
          }, {
            default: T(() => [
              w(v(r.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          x(k(Se), null, {
            default: T(() => [...b[4] || (b[4] = [
              w("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(B, null, le(Z.value, (r) => (a(), j(k(be), {
            key: r.name,
            role: "menuitemcheckbox",
            "aria-checked": S.value.programs.includes(r.name),
            checked: S.value.programs.includes(r.name),
            "data-filter-program": r.name,
            onClick: (H) => G("programs", r.name)
          }, {
            default: T(() => [
              w(v(r.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          P.value ? (a(), j(k(be), {
            key: 1,
            "data-filter-clear": "",
            onClick: E
          }, {
            default: T(() => [...b[5] || (b[5] = [
              w("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: T(() => [
          x(k(ct), {
            options: R.value.states,
            value: C.value,
            onPick: b[0] || (b[0] = (r) => C.value = r)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      C.value === "retired" && R.value.upgrade_retired ? (a(), l("p", Va, "Retired during the upgrade: " + v(R.value.upgrade_retired), 1)) : m("", !0),
      V("div", {
        ref_key: "list",
        ref: ce,
        class: ne(["agents-view", { "agents-view-open": Q.value }])
      }, [
        q.value && !Y.value && !ge.value.length && P.value ? (a(), j(k(We), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: T(() => [
            x(k(qe), {
              small: "",
              "data-empty-clear": "",
              onClick: E
            }, {
              default: T(() => [...b[6] || (b[6] = [
                w("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), j(k(dt), {
          key: 1,
          rows: ge.value,
          failure: Y.value,
          loaded: q.value,
          more: !Q.value && ee.value,
          older: te,
          empty: O.value.title,
          hint: O.value.hint,
          searching: $.value
        }, {
          default: T(({ row: r }) => [
            V("div", {
              class: "agent-row",
              "data-agent-row": r.id
            }, [
              x(Aa, {
                row: r,
                facts: ie(r),
                progress: y(r),
                "wait-reason": z(r),
                open: r.id === W.value,
                onToggle: (H) => n(r)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Ha)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      Q.value && se.value ? (a(), l("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: ue
      }, v(se.value) + " more", 1)) : m("", !0)
    ], 2));
  }
}, Ea = /* @__PURE__ */ oe(Ra, [["__scopeId", "data-v-ea858e86"]]);
export {
  Ea as A
};
