/* @code-commandments-generated */
import { openBlock as a, createElementBlock as o, normalizeStyle as Ae, normalizeClass as ne, toDisplayString as v, createCommentVNode as w, createElementVNode as H, renderSlot as Me, computed as g, createVNode as b, withCtx as S, createTextVNode as y, Fragment as I, renderList as le, onUnmounted as Se, ref as z, onMounted as Ee, createBlock as R, Teleport as Ue, mergeProps as Ze, watch as pe, toRef as Je, unref as m, withModifiers as he, defineAsyncComponent as Ge, withKeys as Ve, createSlots as Ye, resolveDynamicComponent as Qe, nextTick as He } from "vue";
import { peekRef as Ce, Icon as ze, RunningCommand as Xe, FoldGroup as Be, TaskStatusIcon as et, useNow as tt, age as at, perHour as nt, useWindow as Ie, loadWindowComponent as lt, coalesced as Ne, READ_RATES as qe, TimeAgo as Re, Btn as We, InnerTabs as ot, TabBody as st, SwitchCase as rt, EmptyState as Fe, useRows as it, useDeclaredRows as Oe, SearchBar as ct, Segmented as dt, MenuLabel as Te, MenuItem as xe, RowList as ut, toggleFilter as ht } from "@journal/window-kit";
import { _ as ce, T as pt } from "./TranscriptRows-ByPSYos4.js";
const gt = ["stroke-width", "innerHTML"], _ = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const M = e, d = { right: 0, down: 90, left: 180, up: 270 }, c = {
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
    return (f, T) => (a(), o("svg", {
      class: "ico",
      style: Ae({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...M.facing === "right" ? {} : { transform: `rotate(${d[M.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[c[e.name] || e.name] || t.dot
    }, null, 12, gt));
  }
}, vt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ft = {
  key: 1,
  class: "menu-item-text"
}, mt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (M, d) => (a(), o("button", {
      type: "button",
      class: ne(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), o("span", vt, v(e.checked ? "✓" : ""), 1)) : w("", !0),
      e.description ? (a(), o("span", ft, [
        H("span", null, [
          Me(M.$slots, "default", {}, void 0, !0)
        ]),
        H("small", null, v(e.description), 1)
      ])) : Me(M.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ ce(mt, [["__scopeId", "data-v-fec99974"]]), yt = {}, kt = { class: "menu-label" };
function wt(e, M) {
  return a(), o("span", kt, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ ce(yt, [["render", wt], ["__scopeId", "data-v-aa955b3e"]]), Mt = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, bt = {
  key: 0,
  class: "skills-none"
}, xt = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: M }) {
    const d = e, c = M, t = g(() => d.skills.filter((T) => T.state === "loaded")), f = g(() => d.skills.filter((T) => T.state !== "loaded"));
    return (T, V) => (a(), o("div", Mt, [
      b(we, null, {
        default: S(() => [...V[1] || (V[1] = [
          y("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? w("", !0) : (a(), o("p", bt, "None yet. Compacting the conversation empties this list.")),
      (a(!0), o(I, null, le(t.value, (p) => (a(), o("p", {
        key: p.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(_, {
          name: "book",
          size: 12
        }),
        y(v(p.skill), 1)
      ]))), 128)),
      f.value.length ? (a(), o(I, { key: 1 }, [
        b(we, null, {
          default: S(() => [...V[2] || (V[2] = [
            y("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), o(I, null, le(f.value, (p) => (a(), o("p", {
          key: p.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(_, {
            name: "book",
            size: 12
          }),
          y(v(p.skill), 1)
        ]))), 128))
      ], 64)) : w("", !0),
      b(ke, {
        "data-agent-skills-browse": "",
        onClick: V[0] || (V[0] = (p) => c("browse"))
      }, {
        default: S(() => [...V[3] || (V[3] = [
          y("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, $t = /* @__PURE__ */ ce(xt, [["__scopeId", "data-v-be514d47"]]), Ct = (e, M, d) => Math.max(M, Math.min(d, e)), De = /* @__PURE__ */ new WeakMap(), St = (e, M) => De.set(e, M);
function Tt(e, M) {
  for (let d = M; d; d = De.get(d) ?? d.parentElement) if (d === e) return !0;
  return !1;
}
function At(e, M) {
  const d = (c) => {
    var f, T;
    const t = ((f = e.value) == null ? void 0 : f.element) || ((T = e.value) == null ? void 0 : T.$el) || e.value;
    t && !Tt(t, c.target) && M(c);
  };
  window.addEventListener("click", d), Se(() => window.removeEventListener("click", d));
}
const ye = 8, zt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: M, emit: d }) {
    const c = e, t = z(null), f = (r) => r ? `${r}px` : void 0, T = g(() => ({
      minWidth: f(c.minWidth),
      maxWidth: f(c.maxWidth),
      maxHeight: f(c.maxHeight),
      height: f(c.height)
    })), V = z({ w: 0, h: 0 }), p = z(c.anchor ? c.anchor.getBoundingClientRect() : null), E = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), N = (r) => ({
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      right: Math.min(window.innerWidth, r.right),
      bottom: Math.min(window.innerHeight, r.bottom)
    }), C = (r) => {
      const $ = r.closest(".pane, .float-window");
      return $ ? N($.getBoundingClientRect()) : E();
    }, q = (r, $) => `${Math.max(0, r ? Math.min(r, $) : $)}px`;
    function te(r, $) {
      return {
        below: r.bottom - $.bottom - c.gap - ye,
        above: $.top - r.top - c.gap - ye,
        across: r.right - r.left - 2 * ye
      };
    }
    function F(r) {
      const $ = C(c.anchor), j = te($, r);
      return V.value.w <= j.across && V.value.h <= Math.max(j.below, j.above) ? $ : E();
    }
    const L = g(() => {
      if (!p.value) return T.value;
      const r = p.value, $ = F(r), j = te($, r), { w: U, h: Q } = V.value, Z = c.align === "auto" ? r.left + r.right > $.left + $.right : c.align === "right", ue = Ct(Z ? r.right - U : r.left, $.left + ye, Math.max($.left + ye, $.right - U - ye)), oe = Q > j.below && j.above > j.below ? { bottom: `${window.innerHeight - r.top + c.gap}px`, maxHeight: q(c.maxHeight, j.above) } : { top: `${r.bottom + c.gap}px`, maxHeight: q(c.maxHeight, j.below) };
      return { ...T.value, ...oe, left: `${ue}px`, maxWidth: q(c.maxWidth, j.across) };
    }), B = d, O = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function D(r) {
      const $ = O(), j = $.indexOf(document.activeElement);
      $[(j + r + $.length) % $.length].focus();
    }
    const K = { ArrowDown: () => D(1), ArrowUp: () => D(-1), Escape: () => B("close") }, W = (r) => K[r.key] && (r.preventDefault(), K[r.key]()), G = () => t.value && (V.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let P = 0;
    const h = new ResizeObserver(() => {
      cancelAnimationFrame(P), P = requestAnimationFrame(G);
    });
    At(t, (r) => c.anchor && !c.anchor.contains(r.target) && B("close"));
    const l = (r, $) => ["top", "left", "right", "bottom"].some((j) => Math.abs(r[j] - $[j]) > 1), u = (r) => r.bottom < 0 || r.top > window.innerHeight;
    let Y = 0;
    function ge() {
      if (c.anchor) {
        const r = c.anchor.getBoundingClientRect();
        if (!c.anchor.isConnected || u(r)) return B("close");
        l(r, p.value) && (p.value = r);
      }
      Y = requestAnimationFrame(ge);
    }
    return Ee(() => {
      c.anchor && t.value && St(t.value, c.anchor), G(), t.value && h.observe(t.value), !c.plain && O()[0] && O()[0].focus(), ge();
    }), Se(() => {
      h.disconnect(), cancelAnimationFrame(Y), cancelAnimationFrame(P);
    }), M({ element: t }), (r, $) => (a(), R(Ue, {
      to: "body",
      disabled: !e.anchor
    }, [
      H("div", Ze({
        ref_key: "panel",
        ref: t
      }, r.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: L.value,
        onKeydown: W
      }), [
        Me(r.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Vt = /* @__PURE__ */ ce(zt, [["__scopeId", "data-v-3d203970"]]);
async function Ht(e, M, d) {
  if (!e) return d(M);
  const { target: c, fields: t } = e, f = Object.fromEntries(Object.keys(t).map((p) => [p, c[p]])), T = () => Object.assign(c, f);
  Object.assign(c, t);
  let V = !1;
  try {
    const p = await d(M);
    return V = p.ok, p;
  } finally {
    V || T();
  }
}
function Rt(e, M, d) {
  const c = z([]), t = z([]), f = z({}), T = z(""), V = z(!1), p = g(() => !!e.value && !e.value.ended_at), E = g(() => p.value && !!e.value.paused_at);
  async function N() {
    if (p.value) {
      const B = await M(["agent", "controls", String(e.value.id)]);
      c.value = B.ok ? B.value.groups : [];
      return;
    }
    const L = await M(["agent", "programs"]);
    t.value = L.ok ? L.value.rows : [];
  }
  async function C(L, B = null) {
    T.value = "";
    const O = await Ht(B, L, M);
    return T.value = O.ok ? "" : O.error, d(), O;
  }
  const q = (L, B) => C(["agent", "control", String(e.value.id), L, B.value], { target: f, fields: { value: { ...f.value, [L]: B.label } } }), te = () => (V.value = !1, C(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), F = (L) => C(["agent", "launch", L.name]);
  return Ee(N), pe(p, N), { groups: c, programs: t, chosen: f, failure: T, asking: V, running: p, paused: E, choose: q, stop: te, start: F };
}
const Pe = { claude: "Claude Code", codex: "Codex" };
Object.entries(Pe).map(([e, M]) => ({ key: e, label: M }));
function Ot(e, M = "agent") {
  return Pe[e] || M;
}
const Lt = ["disabled", "title"], jt = ["title"], Et = { class: "gauge usage" }, Bt = ["disabled", "title"], It = { class: "gauge" }, Nt = ["disabled", "title"], qt = ["disabled"], Wt = ["disabled"], Ft = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Dt = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Pt = ["title"], _t = 75, Kt = {
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
    const d = e, c = M, t = Rt(Je(d, "agent"), d.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => c("changed")), f = z(null), T = z(""), V = g(() => t.groups.value.find((h) => h.key === T.value));
    function p(h, l) {
      f.value = h.currentTarget, T.value = l;
    }
    function E() {
      f.value = null, T.value = "", t.asking.value = !1;
    }
    const N = z([]), C = g(() => N.value.filter((h) => h.state === "loaded"));
    async function q() {
      const h = d.agent && d.run ? await d.run(["agent-skill", "list", "--agent", String(d.agent.id)]) : null;
      N.value = h != null && h.ok ? h.value.rows ?? [] : [];
    }
    function te(h) {
      p(h, "skills"), q();
    }
    pe(() => {
      var h;
      return (h = d.agent) == null ? void 0 : h.id;
    }, q, { immediate: !0 });
    const F = (h) => t.groups.value.some((l) => l.key === h), L = g(() => {
      var h;
      return t.chosen.value.model ?? ((h = O.value) == null ? void 0 : h.model) ?? "";
    }), B = g(() => {
      var h;
      return t.chosen.value.effort ?? ((h = O.value) == null ? void 0 : h.effort) ?? "";
    });
    g(() => !!d.agent && !d.agent.ended_at);
    const O = g(() => {
      var h;
      return ((h = d.usage.agents) == null ? void 0 : h.find((l) => {
        var u;
        return l.id === ((u = d.agent) == null ? void 0 : u.id);
      })) ?? null;
    }), D = g(() => {
      var h;
      return ((h = d.usage.windows) == null ? void 0 : h[0]) ?? null;
    }), K = g(() => D.value ? Math.max(0, Math.min(100, Math.round(D.value.used_percent))) : null), W = g(() => {
      var h;
      return ((h = O.value) == null ? void 0 : h.context_percent) == null ? null : Math.round(O.value.context_percent);
    }), G = g(() => {
      var h;
      return (h = O.value) != null && h.cost_dollars ? `$${O.value.cost_dollars.toFixed(2)}` : "";
    }), P = g(() => {
      var u;
      const h = (u = d.agent) != null && u.process_started_at ? new Date(d.agent.process_started_at).getTime() : 0;
      if (!h) return "";
      const l = Math.max(0, Math.floor((d.now - h) / 6e4));
      return l >= 60 ? `${Math.floor(l / 60)}h ${l % 60}m` : `${l}m`;
    });
    return (h, l) => (a(), o("div", {
      class: ne(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), o(I, { key: 0 }, [
        H("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: l[0] || (l[0] = (u) => p(u, "agent"))
        }, [
          b(_, {
            name: "agents",
            size: 12
          }),
          y(" " + v(m(Ot)(e.agent.program)), 1)
        ], 8, Lt),
        K.value !== null ? (a(), o("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${K.value}% of the plan's ${D.value.title} allowance used`,
          onClick: l[1] || (l[1] = (u) => c("open", "usage", u.currentTarget))
        }, [
          b(_, {
            name: "clock",
            size: 12
          }),
          l[14] || (l[14] = y()),
          H("span", Et, [
            H("span", {
              style: Ae({ width: `${K.value}%` })
            }, null, 4)
          ]),
          y(" " + v(K.value) + "% ", 1)
        ], 8, jt)) : w("", !0),
        W.value !== null ? (a(), o("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${W.value}% full: clear or compact it`,
          onClick: l[2] || (l[2] = (u) => F("context") ? p(u, "context") : c("open", "context", u.currentTarget))
        }, [
          b(_, {
            name: "gauge",
            size: 12
          }),
          l[15] || (l[15] = y()),
          H("span", It, [
            H("span", {
              style: Ae({ width: `${W.value}%` })
            }, null, 4)
          ]),
          y(" " + v(W.value) + "% ", 1)
        ], 8, Bt)) : w("", !0),
        L.value ? (a(), o("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${L.value}: change the model`,
          onClick: l[3] || (l[3] = (u) => F("model") ? p(u, "model") : null)
        }, [
          b(_, {
            name: "model",
            size: 12
          }),
          y(" " + v(L.value), 1)
        ], 8, Nt)) : w("", !0),
        F("effort") || e.card && B.value ? (a(), o("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: l[4] || (l[4] = (u) => p(u, "effort"))
        }, [
          b(_, {
            name: "bolt",
            size: 12
          }),
          y(" " + v(B.value), 1)
        ], 8, qt)) : w("", !0),
        G.value ? (a(), o("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: l[5] || (l[5] = (u) => c("open", "cost", u.currentTarget))
        }, v(G.value), 9, Wt)) : w("", !0),
        P.value ? (a(), o("span", Ft, [
          b(_, {
            name: "reminders",
            size: 12
          }),
          y(" " + v(P.value), 1)
        ])) : w("", !0),
        e.branch ? (a(), o("span", Dt, [
          b(_, {
            name: "branch",
            size: 12
          }),
          y(" " + v(e.branch), 1)
        ])) : w("", !0),
        e.card ? w("", !0) : (a(), o("button", {
          key: 7,
          type: "button",
          class: ne(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: l[6] || (l[6] = (u) => c("open", "jobs", u.currentTarget))
        }, [
          b(_, {
            name: "clock",
            size: 12
          }),
          y(" " + v(e.jobs), 1)
        ], 2)),
        e.run ? (a(), o("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: te
        }, [
          b(_, {
            name: "book",
            size: 12
          }),
          y(" " + v(C.value.length), 1)
        ])) : w("", !0),
        e.fitness ? (a(), o(I, { key: 9 }, [
          H("button", {
            type: "button",
            class: ne(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < _t }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: l[7] || (l[7] = (u) => c("open", "fitness", u.currentTarget))
          }, [
            b(_, {
              name: "heart",
              size: 12
            }),
            y(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          H("button", {
            type: "button",
            class: ne(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: l[8] || (l[8] = (u) => c("open", "load", u.currentTarget))
          }, [
            b(_, {
              name: "weight",
              size: 12
            }),
            y(" " + v(e.fitness.workload), 1)
          ], 2)
        ], 64)) : w("", !0)
      ], 64)) : e.run && !e.loading ? (a(), o("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: l[9] || (l[9] = (u) => p(u, "start"))
      }, [
        b(_, {
          name: "agents",
          size: 12
        }),
        l[16] || (l[16] = y(" Start an agent", -1))
      ])) : w("", !0),
      l[22] || (l[22] = H("span", { class: "space" }, null, -1)),
      m(t).failure.value ? (a(), o("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: m(t).failure.value
      }, v(m(t).failure.value), 9, Pt)) : w("", !0),
      Me(h.$slots, "default", {}, void 0, !0),
      f.value ? (a(), R(Vt, {
        key: 3,
        anchor: f.value,
        "min-width": 190,
        onClose: E
      }, {
        default: S(() => [
          T.value === "agent" ? (a(), o(I, { key: 0 }, [
            m(t).asking.value ? (a(), o(I, { key: 0 }, [
              b(we, { "data-agent-stop-ask": "" }, {
                default: S(() => [...l[17] || (l[17] = [
                  y("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              b(ke, {
                "data-agent-stop-confirm": "",
                onClick: l[10] || (l[10] = (u) => (E(), m(t).stop()))
              }, {
                default: S(() => [...l[18] || (l[18] = [
                  y("Stop it", -1)
                ])]),
                _: 1
              }),
              b(ke, {
                onClick: l[11] || (l[11] = (u) => m(t).asking.value = !1)
              }, {
                default: S(() => [...l[19] || (l[19] = [
                  y("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (a(), R(ke, {
              key: 1,
              "data-agent-stop": "",
              onClick: l[12] || (l[12] = (u) => m(t).asking.value = !0)
            }, {
              default: S(() => [...l[20] || (l[20] = [
                y("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : T.value === "start" ? (a(), o(I, { key: 1 }, [
            b(we, null, {
              default: S(() => [...l[21] || (l[21] = [
                y("Start an agent", -1)
              ])]),
              _: 1
            }),
            (a(!0), o(I, null, le(m(t).programs.value, (u) => (a(), R(ke, {
              key: u.name,
              "data-agent-program": u.name,
              onClick: (Y) => (E(), m(t).start(u))
            }, {
              default: S(() => [
                y(v(u.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : T.value === "skills" ? (a(), R($t, {
            key: 2,
            skills: N.value,
            onBrowse: l[13] || (l[13] = (u) => (E(), c("open", "skills", null)))
          }, null, 8, ["skills"])) : V.value ? (a(), o(I, { key: 3 }, [
            b(we, null, {
              default: S(() => [
                y(v(V.value.label), 1)
              ]),
              _: 1
            }),
            (a(!0), o(I, null, le(V.value.choices, (u) => (a(), R(ke, {
              key: u.value,
              "data-agent-choice": u.value,
              onClick: (Y) => (m(t).choose(V.value.key, u), E())
            }, {
              default: S(() => [
                y(v(u.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : w("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : w("", !0)
    ], 2));
  }
}, Ut = /* @__PURE__ */ ce(Kt, [["__scopeId", "data-v-cce150b4"]]), Zt = {
  class: "agent-command",
  "data-agent-command": ""
}, Jt = {
  key: 1,
  "data-agent-stopped": ""
}, Gt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (M, d) => (a(), o("span", Zt, [
      e.waitReason ? (a(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: d[0] || (d[0] = he((c) => m(Ce)("test_queue:0"), ["stop"]))
      }, [
        y("Waiting: " + v(e.waitReason) + " ", 1),
        b(m(ze), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), o("span", Jt, "Waiting")) : (a(), R(m(Xe), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Le = /* @__PURE__ */ ce(Gt, [["__scopeId", "data-v-1b371fb5"]]), Yt = ["data-agent-delegated", "onClick"], Qt = { class: "agent-task-number" }, Xt = { class: "agent-task-title" }, ea = ["title"], ta = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: M }) {
    const d = M;
    return (c, t) => (a(), R(m(Be), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (f) => d("toggle"))
    }, {
      default: S(() => [
        (a(!0), o(I, null, le(e.section.tasks, (f) => (a(), o("button", {
          key: f.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": f.id,
          onClick: (T) => m(Ce)(`tasks:${f.id}`)
        }, [
          b(m(et), {
            status: f.state
          }, null, 8, ["status"]),
          H("span", Qt, v(f.id), 1),
          H("span", Xt, v(f.title), 1),
          f.plan_id ? (a(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${f.plan_id}: ${f.plan_title}`
          }, "Plan " + v(f.plan_id) + ": " + v(f.plan_title), 9, ea)) : w("", !0)
        ], 8, Yt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, aa = /* @__PURE__ */ ce(ta, [["__scopeId", "data-v-238ff959"]]), na = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], la = { class: "agent-head" }, oa = ["data-state"], sa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, ra = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, ia = { class: "agent-times" }, ca = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, da = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, ua = { class: "agent-line" }, ha = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, pa = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, ga = {
  key: 0,
  class: "agent-line agent-work-start"
}, va = ["data-peek"], fa = ["title"], ma = ["data-peek"], ya = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, ka = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, wa = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Ma = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ba = {
  key: 0,
  class: "agent-helper-brief"
}, xa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, $a = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ca = "It ended without a report", Sa = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: M }) {
    const d = { helper: "Helper", reviewer: "Reviewer" }, c = ["started", "blocked", "open", "completed"], t = e, f = M, T = tt(), V = g(() => {
      var i, J;
      if ((i = t.facts) != null && i.profile_title) return t.facts.profile_title;
      if ((J = t.facts) != null && J.profile) return t.facts.profile;
      const n = d[t.row.role] || t.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), p = g(() => {
      var n;
      return ((n = t.facts) == null ? void 0 : n.tasks) ?? [];
    }), E = g(() => p.value.filter((n) => n.state === "open")), N = g(() => {
      const n = p.value.find((i) => {
        var J;
        return i.id === ((J = t.facts) == null ? void 0 : J.task_id);
      });
      return n != null && n.plan_id ? n : E.value.find((i) => i.plan_id);
    }), C = g(() => {
      var n, i, J, de;
      return t.row.role === "helper" ? ((n = t.facts) == null ? void 0 : n.helper_job) || "" : (i = t.facts) != null && i.job_enabled && (((J = t.facts) == null ? void 0 : J.task_title) || ((de = E.value[0]) == null ? void 0 : de.title)) || "";
    }), q = g(() => {
      const n = C.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), te = g(() => {
      var n, i;
      return [t.row.program, (n = t.facts) == null ? void 0 : n.model, (i = t.facts) == null ? void 0 : i.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), F = g(() => {
      var n, i;
      return t.row.ended_at && ((i = (n = t.facts) == null ? void 0 : n.job_returned) != null && i.startsWith(Ca)) ? t.facts.job_returned : "";
    }), L = g(() => at(t.row.process_started_at || t.row.created_at, T.value)), B = /* @__PURE__ */ new Set(["open", "started", "testing"]), O = g(() => !!t.row.ended_at && t.row.role !== "main" && p.value.some((n) => B.has(n.state))), D = g(() => {
      var n;
      return t.waitReason || O.value ? "waiting" : t.row.state === "running" && ((n = t.facts) == null ? void 0 : n.state) || t.row.state;
    }), K = g(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.completed_count) ?? p.value.filter((i) => i.state === "completed").length;
    }), W = g(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.task_count) ?? p.value.length;
    }), G = g(() => `${K.value} of ${W.value} ${W.value === 1 ? "task" : "tasks"}`), P = g(() => {
      var i;
      const n = nt(K.value, ((i = t.progress) == null ? void 0 : i.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, T.value);
      return t.row.role !== "main" && n ? `${n} per hour` : "";
    }), h = g(() => p.value.length ? c.map((n) => ({ state: n, label: n.slice(0, 1).toUpperCase() + n.slice(1), tasks: p.value.filter((i) => i.state === n || n === "started" && i.state === "testing" || n === "completed" && i.state === "cancelled") })) : []), l = /* @__PURE__ */ new Set(["completed"]), u = z({}), Y = (n) => !(u.value[n] ?? l.has(n)), ge = (n) => u.value = { ...u.value, [n]: Y(n) }, r = Ie(), $ = g(() => t.row.access === "read-only"), j = g(() => $.value ? r.tabs.filter((n) => ["transcript", "terminal"].includes(n.key)) : r.tabs), U = z(j.value[0]);
    pe(() => t.open, (n) => {
      n && (U.value = j.value[0]);
    });
    const Q = Object.fromEntries(r.tabs.filter((n) => n.component).map((n) => [n.key, Ge(() => lt(n.component))])), Z = g(() => t.row.role === "helper" && !t.row.ended_at), ue = () => r.run(["helper", "stop", String(t.row.id)]), X = z(!1), oe = z(""), ve = z(""), se = g(() => t.row.role !== "main" && (!t.row.ended_at || O.value || t.waitReason));
    async function re() {
      if (!se.value) return;
      const n = await r.read(`usage tool --agent ${t.row.id}`);
      oe.value = n.ok ? n.value.tool : "", ve.value = n.ok ? n.value.note : "";
    }
    const fe = r.follow(["hook_call.*", "process_part.*"], Ne(re, qe.agentCommand));
    return Se(() => fe == null ? void 0 : fe()), re(), (n, i) => {
      var J, de, k, x;
      return a(), o("div", {
        class: ne(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: i[6] || (i[6] = (s) => !e.open && f("toggle")),
        onKeydown: [
          i[7] || (i[7] = Ve(he((s) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          i[8] || (i[8] = Ve(he((s) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        H("span", la, [
          e.open ? (a(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: i[0] || (i[0] = he((s) => f("toggle"), ["stop"]))
          }, [
            b(m(ze), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : w("", !0),
          H("span", {
            class: "agent-dot",
            "data-state": D.value,
            "data-agent-motion": ""
          }, null, 8, oa),
          H("span", sa, v(V.value), 1),
          H("span", ra, v(((J = e.facts) == null ? void 0 : J.given_name) || e.row.id), 1),
          e.open ? w("", !0) : (a(), R(m(ze), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          H("span", ia, [
            e.row.ended_at && !O.value ? (a(), R(m(Re), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (a(), o("span", ca, v(L.value), 1)),
            (de = e.facts) != null && de.last_activity ? (a(), o("span", da, [
              i[9] || (i[9] = y("Last heard: ", -1)),
              b(m(Re), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : w("", !0)
          ])
        ]),
        H("span", ua, [
          H("span", ha, v(te.value), 1),
          W.value && !C.value ? (a(), o("span", pa, v(G.value), 1)) : w("", !0)
        ]),
        N.value ? (a(), o("span", ga, [
          H("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${N.value.plan_id}`,
            onClick: i[1] || (i[1] = he((s) => m(Ce)(`plans:${N.value.plan_id}`), ["stop"]))
          }, "Plan " + v(N.value.plan_id) + ": " + v(N.value.plan_title), 9, va)
        ])) : w("", !0),
        C.value ? (a(), o("span", {
          key: 1,
          class: ne(["agent-line", { "agent-work-start": !N.value }])
        }, [
          H("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: C.value
          }, [
            q.value ? (a(), o("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": q.value,
              onClick: i[2] || (i[2] = he((s) => m(Ce)(q.value), ["stop"]))
            }, v(C.value), 9, ma)) : (a(), o(I, { key: 1 }, [
              y(v(C.value), 1)
            ], 64))
          ], 8, fa),
          W.value ? (a(), o("span", ya, v(G.value), 1)) : w("", !0)
        ], 2)) : w("", !0),
        !e.open && (se.value || W.value && P.value) ? (a(), o("span", {
          key: 2,
          class: ne(["agent-foot", { "agent-work-start": !C.value && !N.value }]),
          "data-agent-foot": ""
        }, [
          se.value ? (a(), R(Le, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: O.value,
            command: oe.value,
            note: ve.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : w("", !0),
          W.value && P.value ? (a(), o("span", ka, v(P.value), 1)) : w("", !0)
        ], 2)) : w("", !0),
        e.open ? (a(), o("div", {
          key: 3,
          class: "agent-more",
          "data-agent-more": "",
          onClick: i[5] || (i[5] = he(() => {
          }, ["stop"]))
        }, [
          b(Ut, {
            agent: e.row,
            branch: (k = e.progress) == null ? void 0 : k.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: S(() => [
              Z.value ? (a(), R(m(We), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: ue
              }, {
                default: S(() => [...i[10] || (i[10] = [
                  y("Stop", -1)
                ])]),
                _: 1
              })) : w("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          se.value ? (a(), R(Le, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: O.value,
            command: oe.value,
            note: ve.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : w("", !0),
          F.value ? (a(), o("p", wa, v(F.value), 1)) : w("", !0),
          b(m(ot), {
            class: "agent-tabs",
            tabs: j.value,
            active: U.value,
            answer: { tasks: p.value.length },
            onChoose: i[3] || (i[3] = (s) => U.value = s)
          }, null, 8, ["tabs", "active", "answer"]),
          b(m(st), {
            class: "agent-tab-body",
            tab: U.value,
            "data-agent-tab-body": (x = U.value) == null ? void 0 : x.key
          }, {
            default: S(() => {
              var s;
              return [
                b(m(rt), {
                  value: (s = U.value) == null ? void 0 : s.key
                }, Ye({
                  tasks: S(() => {
                    var A;
                    return [
                      p.value.length ? w("", !0) : (a(), R(m(Fe), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: S(() => [...i[11] || (i[11] = [
                          y("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (a(!0), o(I, null, le(h.value, (ee) => (a(), R(aa, {
                        key: ee.state,
                        section: ee,
                        open: Y(ee.state),
                        onToggle: (ie) => ge(ee.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (A = e.facts) != null && A.instruction ? (a(), o(I, { key: 1 }, [
                        i[12] || (i[12] = H("p", { class: "agent-label" }, "Instruction", -1)),
                        H("div", Ma, v(e.facts.instruction), 1)
                      ], 64)) : w("", !0)
                    ];
                  }),
                  transcript: S(() => {
                    var A;
                    return [
                      $.value ? (a(), o(I, { key: 0 }, [
                        (A = e.facts) != null && A.instruction ? (a(), o("div", ba, [
                          b(m(Be), {
                            label: "Instruction",
                            open: X.value,
                            "data-agent-section": "instruction",
                            onToggle: i[4] || (i[4] = (ee) => X.value = !X.value)
                          }, {
                            default: S(() => [
                              H("div", xa, v(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (a(), o("p", $a, "No job recorded")) : w("", !0)
                      ], 64)) : w("", !0),
                      b(pt, {
                        line: `agent transcript ${e.row.id}`,
                        agent: $.value ? Z.value ? e.row.id : null : e.row.id,
                        helper: $.value && Z.value,
                        padding: "0"
                      }, null, 8, ["line", "agent", "helper"])
                    ];
                  }),
                  _: 2
                }, [
                  le(m(Q), (A, ee) => ({
                    name: ee,
                    fn: S(() => [
                      (a(), R(Qe(A), {
                        agent: e.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : w("", !0)
      ], 42, na);
    };
  }
}, Ta = /* @__PURE__ */ ce(Sa, [["__scopeId", "data-v-bb87550a"]]), Aa = ["data-agent-row"], je = "journal.agents.filters", $e = "cubic-bezier(0.2, 0.9, 0.25, 1)", za = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const M = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], d = e, { rows: c } = it("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: t } = Oe("waits"), { rows: f } = Oe("progress"), T = (k) => f.value.find((x) => x.agent_id === k.id) ?? null, V = (k) => {
      var x;
      return ((x = t.value.find((s) => s.agent_id === k.id)) == null ? void 0 : x.reason) ?? "";
    }, p = z("running"), E = z(""), N = JSON.parse(localStorage.getItem(je) || '{"roles":[],"profiles":[],"programs":[]}'), C = z(N), q = z({ roles: [], profiles: [] }), te = z([]), F = g(() => C.value.roles.length + C.value.profiles.length + C.value.programs.length), L = (k, x) => {
      C.value = ht(C.value, k, x);
    }, B = () => {
      C.value = { roles: [], profiles: [], programs: [] };
    }, O = (k) => k.slice(0, 1).toUpperCase() + k.slice(1);
    pe(C, (k) => localStorage.setItem(je, JSON.stringify(k)));
    const D = Ie();
    async function K() {
      const [k, x] = await Promise.all([D.read("agent cards --options"), D.read("agent programs")]);
      k.ok && (q.value = k.value), x.ok && (te.value = x.value.rows);
    }
    D.follow(["agent.*"], K), K();
    const W = z([]), G = z(""), P = z(!1), h = z(!1), l = z(25);
    let u = 0;
    async function Y() {
      const k = ++u, x = [
        ...C.value.roles.map((A) => `--role ${JSON.stringify(A)}`),
        ...C.value.profiles.map((A) => `--profile ${JSON.stringify(A)}`),
        ...C.value.programs.map((A) => `--program ${JSON.stringify(A)}`)
      ].join(" "), s = await D.read(`${d.line} --show ${p.value} --search ${JSON.stringify(E.value)} --limit ${l.value} ${x}`);
      k === u && (W.value = s.ok ? s.value.rows : [], G.value = s.ok ? "" : s.error, h.value = s.ok && s.value.page * s.value.size < s.value.total, P.value = !0);
    }
    async function ge() {
      return l.value += 25, await Y(), !0;
    }
    pe([p, E, C], () => {
      l.value = 25, Y();
    }), D.follow(["agent.*", "task.*", ...D.sources.flatMap((k) => k.events)], Ne(Y, qe.pageOfAgents)), Y();
    const r = (k) => c.value.find((x) => x.id === k.id) ?? null, $ = W, j = g(() => !!E.value.trim() || F.value > 0), U = g(() => d.texts[p.value] ?? { title: d.empty, hint: "" }), Q = z(null), Z = z(null), ue = z(null), X = g(() => $.value.find((k) => k.id === Q.value) ?? null), oe = g(() => X.value ? [X.value] : $.value), ve = g(() => $.value.length - oe.value.length), se = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let re = !1, fe = 0;
    async function n(k) {
      if (re) return;
      re = !0, fe = ue.value.scrollTop;
      const x = Z.value.querySelector(`[data-agent-open="${k.id}"]`);
      if (!se()) {
        const ie = [...Z.value.querySelectorAll(".agent-row")].filter((ae) => !ae.contains(x));
        await Promise.all(ie.map((ae) => ae.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const s = [...x.querySelectorAll(".agent-head, .agent-line")], A = [...s, ...x.querySelectorAll("[data-agent-motion]")], ee = A.map((ie) => ie.getBoundingClientRect());
      if (Q.value = k.id, await He(), !se()) {
        const ie = A.map((ae) => ae.getBoundingClientRect());
        A.forEach((ae, be) => {
          const me = s.indexOf(ae.parentElement), _e = ee[be].left - ie[be].left - (me < 0 ? 0 : ee[me].left - ie[me].left), Ke = ee[be].top - ie[be].top - (me < 0 ? 0 : ee[me].top - ie[me].top);
          ae.animate([{ transform: `translate(${_e}px, ${Ke}px)` }, { transform: "none" }], { duration: 280, easing: $e });
        }), Z.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((ae) => {
          ae.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: $e, fill: "backwards" });
        });
      }
      re = !1;
    }
    async function i() {
      if (re || !X.value) return;
      re = !0;
      const k = Z.value.querySelector(`[data-agent-open="${Q.value}"]`), x = [...k.children, ...Z.value.querySelectorAll(".agents-held")], s = se() ? [] : x.map((A) => A.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(s.map((A) => A.finished)), Q.value = null, await He(), ue.value.scrollTop = fe, s.forEach((A) => A.cancel()), se() || (k.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: $e }), Z.value.querySelectorAll(".agent-row").forEach((A) => {
        A.contains(k) || A.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: $e });
      })), re = !1;
    }
    const J = (k) => Q.value === k.id ? i() : n(k);
    pe(E, (k) => k.trim() && (Q.value = null)), pe(p, () => {
      Q.value = null;
    });
    const de = (k) => {
      k.key === "Escape" && i();
    };
    return window.addEventListener("keydown", de), Se(() => window.removeEventListener("keydown", de)), (k, x) => (a(), o("div", {
      ref_key: "agents",
      ref: Z,
      class: ne(["agents", { focused: X.value }])
    }, [
      b(m(ct), {
        modelValue: E.value,
        "onUpdate:modelValue": x[1] || (x[1] = (s) => E.value = s),
        placeholder: "Search agents",
        "menu-count": F.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          b(m(Te), null, {
            default: S(() => [...x[2] || (x[2] = [
              y("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), o(I, null, le(q.value.roles, (s) => (a(), R(m(xe), {
            key: s,
            role: "menuitemcheckbox",
            "aria-checked": C.value.roles.includes(s),
            checked: C.value.roles.includes(s),
            "data-filter-role": s,
            onClick: (A) => L("roles", s)
          }, {
            default: S(() => [
              y(v(O(s)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          q.value.profiles.length ? (a(), R(m(Te), { key: 0 }, {
            default: S(() => [...x[3] || (x[3] = [
              y("Profile", -1)
            ])]),
            _: 1
          })) : w("", !0),
          (a(!0), o(I, null, le(q.value.profiles, (s) => (a(), R(m(xe), {
            key: s.name,
            role: "menuitemcheckbox",
            "aria-checked": C.value.profiles.includes(s.name),
            checked: C.value.profiles.includes(s.name),
            "data-filter-profile": s.name,
            onClick: (A) => L("profiles", s.name)
          }, {
            default: S(() => [
              y(v(s.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(m(Te), null, {
            default: S(() => [...x[4] || (x[4] = [
              y("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), o(I, null, le(te.value, (s) => (a(), R(m(xe), {
            key: s.name,
            role: "menuitemcheckbox",
            "aria-checked": C.value.programs.includes(s.name),
            checked: C.value.programs.includes(s.name),
            "data-filter-program": s.name,
            onClick: (A) => L("programs", s.name)
          }, {
            default: S(() => [
              y(v(s.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          F.value ? (a(), R(m(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: B
          }, {
            default: S(() => [...x[5] || (x[5] = [
              y("Clear filters", -1)
            ])]),
            _: 1
          })) : w("", !0)
        ]),
        default: S(() => [
          b(m(dt), {
            options: M,
            value: p.value,
            onPick: x[0] || (x[0] = (s) => p.value = s)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      H("div", {
        ref_key: "list",
        ref: ue,
        class: ne(["agents-view", { "agents-view-open": X.value }])
      }, [
        P.value && !G.value && !oe.value.length && F.value ? (a(), R(m(Fe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            b(m(We), {
              small: "",
              "data-empty-clear": "",
              onClick: B
            }, {
              default: S(() => [...x[6] || (x[6] = [
                y("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), R(m(ut), {
          key: 1,
          rows: oe.value,
          failure: G.value,
          loaded: P.value,
          more: !X.value && h.value,
          older: ge,
          empty: U.value.title,
          hint: U.value.hint,
          searching: j.value
        }, {
          default: S(({ row: s }) => [
            H("div", {
              class: "agent-row",
              "data-agent-row": s.id
            }, [
              b(Ta, {
                row: s,
                facts: r(s),
                progress: T(s),
                "wait-reason": V(s),
                open: s.id === Q.value,
                onToggle: (A) => J(s)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Aa)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      X.value && ve.value ? (a(), o("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: i
      }, v(ve.value) + " more", 1)) : w("", !0)
    ], 2));
  }
}, Oa = /* @__PURE__ */ ce(za, [["__scopeId", "data-v-27ea31c4"]]);
export {
  Oa as A
};
