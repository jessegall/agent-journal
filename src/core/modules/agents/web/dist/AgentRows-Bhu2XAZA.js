/* @code-commandments-generated */
import { openBlock as t, createElementBlock as o, normalizeStyle as Re, normalizeClass as re, toDisplayString as u, createCommentVNode as m, createElementVNode as C, renderSlot as Me, computed as $, createVNode as h, withCtx as S, createTextVNode as p, Fragment as N, renderList as ae, onUnmounted as Se, ref as j, onMounted as Ee, createBlock as q, Teleport as Ze, mergeProps as Ge, watch as de, toRef as Ye, unref as v, withModifiers as oe, defineAsyncComponent as Qe, withKeys as Ve, createSlots as Xe, resolveDynamicComponent as et, nextTick as He } from "vue";
import { peekRef as Ce, Icon as Te, RunningCommand as tt, FoldGroup as Ne, TaskStatusIcon as at, Btn as ne, TextArea as qe, TextInput as ze, useWindow as Ae, SwitchCase as Fe, useNow as nt, age as lt, perHour as ot, loadWindowComponent as st, coalesced as We, READ_RATES as Pe, TimeAgo as Oe, InnerTabs as it, TabBody as rt, EmptyState as De, useRows as ut, useDeclaredRows as Le, SearchBar as dt, Segmented as ct, MenuLabel as je, MenuItem as xe, RowList as gt, toggleFilter as vt } from "@journal/window-kit";
import { _ as te, T as pt } from "./TranscriptRows-ByPSYos4.js";
const mt = ["stroke-width", "innerHTML"], ee = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const i = e, n = { right: 0, down: 90, left: 180, up: 270 }, s = {
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
    return (f, T) => (t(), o("svg", {
      class: "ico",
      style: Re({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...i.facing === "right" ? {} : { transform: `rotate(${n[i.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: a[s[e.name] || e.name] || a.dot
    }, null, 12, mt));
  }
}, ht = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ft = {
  key: 1,
  class: "menu-item-text"
}, kt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (i, n) => (t(), o("button", {
      type: "button",
      class: re(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), o("span", ht, u(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (t(), o("span", ft, [
        C("span", null, [
          Me(i.$slots, "default", {}, void 0, !0)
        ]),
        C("small", null, u(e.description), 1)
      ])) : Me(i.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ye = /* @__PURE__ */ te(kt, [["__scopeId", "data-v-fec99974"]]), yt = {}, bt = { class: "menu-label" };
function wt(e, i) {
  return t(), o("span", bt, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ te(yt, [["render", wt], ["__scopeId", "data-v-aa955b3e"]]), Mt = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, xt = {
  key: 0,
  class: "skills-none"
}, $t = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: i }) {
    const n = e, s = i, a = $(() => n.skills.filter((T) => T.state === "loaded")), f = $(() => n.skills.filter((T) => T.state !== "loaded"));
    return (T, R) => (t(), o("div", Mt, [
      h(we, null, {
        default: S(() => [...R[1] || (R[1] = [
          p("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? m("", !0) : (t(), o("p", xt, "None yet. Compacting the conversation empties this list.")),
      (t(!0), o(N, null, ae(a.value, (k) => (t(), o("p", {
        key: k.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        h(ee, {
          name: "book",
          size: 12
        }),
        p(u(k.skill), 1)
      ]))), 128)),
      f.value.length ? (t(), o(N, { key: 1 }, [
        h(we, null, {
          default: S(() => [...R[2] || (R[2] = [
            p("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), o(N, null, ae(f.value, (k) => (t(), o("p", {
          key: k.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          h(ee, {
            name: "book",
            size: 12
          }),
          p(u(k.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      h(ye, {
        "data-agent-skills-browse": "",
        onClick: R[0] || (R[0] = (k) => s("browse"))
      }, {
        default: S(() => [...R[3] || (R[3] = [
          p("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Ct = /* @__PURE__ */ te($t, [["__scopeId", "data-v-be514d47"]]), St = (e, i, n) => Math.max(i, Math.min(n, e)), Ue = /* @__PURE__ */ new WeakMap(), At = (e, i) => Ue.set(e, i);
function jt(e, i) {
  for (let n = i; n; n = Ue.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Rt(e, i) {
  const n = (s) => {
    var f, T;
    const a = ((f = e.value) == null ? void 0 : f.element) || ((T = e.value) == null ? void 0 : T.$el) || e.value;
    a && !jt(a, s.target) && i(s);
  };
  window.addEventListener("click", n), Se(() => window.removeEventListener("click", n));
}
const ke = 8, Tt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: i, emit: n }) {
    const s = e, a = j(null), f = (c) => c ? `${c}px` : void 0, T = $(() => ({
      minWidth: f(s.minWidth),
      maxWidth: f(s.maxWidth),
      maxHeight: f(s.maxHeight),
      height: f(s.height)
    })), R = j({ w: 0, h: 0 }), k = j(s.anchor ? s.anchor.getBoundingClientRect() : null), F = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), A = (c) => ({
      left: Math.max(0, c.left),
      top: Math.max(0, c.top),
      right: Math.min(window.innerWidth, c.right),
      bottom: Math.min(window.innerHeight, c.bottom)
    }), H = (c) => {
      const O = c.closest(".pane, .float-window");
      return O ? A(O.getBoundingClientRect()) : F();
    }, L = (c, O) => `${Math.max(0, c ? Math.min(c, O) : O)}px`;
    function V(c, O) {
      return {
        below: c.bottom - O.bottom - s.gap - ke,
        above: O.top - c.top - s.gap - ke,
        across: c.right - c.left - 2 * ke
      };
    }
    function w(c) {
      const O = H(s.anchor), P = V(O, c);
      return R.value.w <= P.across && R.value.h <= Math.max(P.below, P.above) ? O : F();
    }
    const M = $(() => {
      if (!k.value) return T.value;
      const c = k.value, O = w(c), P = V(O, c), { w: Y, h: Q } = R.value, X = s.align === "auto" ? c.left + c.right > O.left + O.right : s.align === "right", se = St(X ? c.right - Y : c.left, O.left + ke, Math.max(O.left + ke, O.right - Y - ke)), pe = Q > P.below && P.above > P.below ? { bottom: `${window.innerHeight - c.top + s.gap}px`, maxHeight: L(s.maxHeight, P.above) } : { top: `${c.bottom + s.gap}px`, maxHeight: L(s.maxHeight, P.below) };
      return { ...T.value, ...pe, left: `${se}px`, maxWidth: L(s.maxWidth, P.across) };
    }), I = n, B = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function W(c) {
      const O = B(), P = O.indexOf(document.activeElement);
      O[(P + c + O.length) % O.length].focus();
    }
    const K = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => I("close") }, J = (c) => K[c.key] && (c.preventDefault(), K[c.key]()), D = () => a.value && (R.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let Z = 0;
    const b = new ResizeObserver(() => {
      cancelAnimationFrame(Z), Z = requestAnimationFrame(D);
    });
    Rt(a, (c) => s.anchor && !s.anchor.contains(c.target) && I("close"));
    const g = (c, O) => ["top", "left", "right", "bottom"].some((P) => Math.abs(c[P] - O[P]) > 1), d = (c) => c.bottom < 0 || c.top > window.innerHeight;
    let z = 0;
    function G() {
      if (s.anchor) {
        const c = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || d(c)) return I("close");
        g(c, k.value) && (k.value = c);
      }
      z = requestAnimationFrame(G);
    }
    return Ee(() => {
      s.anchor && a.value && At(a.value, s.anchor), D(), a.value && b.observe(a.value), !s.plain && B()[0] && B()[0].focus(), G();
    }), Se(() => {
      b.disconnect(), cancelAnimationFrame(z), cancelAnimationFrame(Z);
    }), i({ element: a }), (c, O) => (t(), q(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      C("div", Ge({
        ref_key: "panel",
        ref: a
      }, c.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: J
      }), [
        Me(c.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), zt = /* @__PURE__ */ te(Tt, [["__scopeId", "data-v-3d203970"]]);
async function Vt(e, i, n) {
  if (!e) return n(i);
  const { target: s, fields: a } = e, f = Object.fromEntries(Object.keys(a).map((k) => [k, s[k]])), T = () => Object.assign(s, f);
  Object.assign(s, a);
  let R = !1;
  try {
    const k = await n(i);
    return R = k.ok, k;
  } finally {
    R || T();
  }
}
function Ht(e, i, n) {
  const s = j([]), a = j([]), f = j({}), T = j(""), R = j(!1), k = $(() => !!e.value && !e.value.ended_at), F = $(() => k.value && !!e.value.paused_at);
  async function A() {
    if (k.value) {
      const I = await i(["agent", "controls", String(e.value.id)]);
      s.value = I.ok ? I.value.groups : [];
      return;
    }
    const M = await i(["agent", "programs"]);
    a.value = M.ok ? M.value.rows : [];
  }
  async function H(M, I = null) {
    T.value = "";
    const B = await Vt(I, M, i);
    return T.value = B.ok ? "" : B.error, n(), B;
  }
  const L = (M, I) => H(["agent", "control", String(e.value.id), M, I.value], { target: f, fields: { value: { ...f.value, [M]: I.label } } }), V = () => (R.value = !1, H(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), w = (M) => H(["agent", "launch", M.name]);
  return Ee(A), de(k, A), { groups: s, programs: a, chosen: f, failure: T, asking: R, running: k, paused: F, choose: L, stop: V, start: w };
}
const _e = { claude: "Claude Code", codex: "Codex" };
Object.entries(_e).map(([e, i]) => ({ key: e, label: i }));
function Ot(e, i = "agent") {
  return _e[e] || i;
}
const Lt = ["disabled", "title"], Bt = ["title"], It = { class: "gauge usage" }, Et = ["disabled", "title"], Nt = { class: "gauge" }, qt = ["disabled", "title"], Ft = ["disabled"], Wt = ["disabled"], Pt = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Dt = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ut = ["title"], _t = 75, Jt = {
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
  setup(e, { emit: i }) {
    const n = e, s = i, a = Ht(Ye(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed")), f = j(null), T = j(""), R = $(() => a.groups.value.find((b) => b.key === T.value));
    function k(b, g) {
      f.value = b.currentTarget, T.value = g;
    }
    function F() {
      f.value = null, T.value = "", a.asking.value = !1;
    }
    const A = j([]), H = $(() => A.value.filter((b) => b.state === "loaded"));
    async function L() {
      const b = n.agent && n.run ? await n.run(["agent-skill", "list", "--agent", String(n.agent.id)]) : null;
      A.value = b != null && b.ok ? b.value.rows ?? [] : [];
    }
    function V(b) {
      k(b, "skills"), L();
    }
    de(() => {
      var b;
      return (b = n.agent) == null ? void 0 : b.id;
    }, L, { immediate: !0 });
    const w = (b) => a.groups.value.some((g) => g.key === b), M = $(() => {
      var b;
      return a.chosen.value.model ?? ((b = B.value) == null ? void 0 : b.model) ?? "";
    }), I = $(() => {
      var b;
      return a.chosen.value.effort ?? ((b = B.value) == null ? void 0 : b.effort) ?? "";
    });
    $(() => !!n.agent && !n.agent.ended_at);
    const B = $(() => {
      var b;
      return ((b = n.usage.agents) == null ? void 0 : b.find((g) => {
        var d;
        return g.id === ((d = n.agent) == null ? void 0 : d.id);
      })) ?? null;
    }), W = $(() => {
      var b;
      return ((b = n.usage.windows) == null ? void 0 : b[0]) ?? null;
    }), K = $(() => W.value ? Math.max(0, Math.min(100, Math.round(W.value.used_percent))) : null), J = $(() => {
      var b;
      return ((b = B.value) == null ? void 0 : b.context_percent) == null ? null : Math.round(B.value.context_percent);
    }), D = $(() => {
      var b;
      return (b = B.value) != null && b.cost_dollars ? `$${B.value.cost_dollars.toFixed(2)}` : "";
    }), Z = $(() => {
      var d;
      const b = (d = n.agent) != null && d.process_started_at ? new Date(n.agent.process_started_at).getTime() : 0;
      if (!b) return "";
      const g = Math.max(0, Math.floor((n.now - b) / 6e4));
      return g >= 60 ? `${Math.floor(g / 60)}h ${g % 60}m` : `${g}m`;
    });
    return (b, g) => (t(), o("div", {
      class: re(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (t(), o(N, { key: 0 }, [
        C("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: g[0] || (g[0] = (d) => k(d, "agent"))
        }, [
          h(ee, {
            name: "agents",
            size: 12
          }),
          p(" " + u(v(Ot)(e.agent.program)), 1)
        ], 8, Lt),
        K.value !== null ? (t(), o("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${K.value}% of the plan's ${W.value.title} allowance used`,
          onClick: g[1] || (g[1] = (d) => s("open", "usage", d.currentTarget))
        }, [
          h(ee, {
            name: "clock",
            size: 12
          }),
          g[14] || (g[14] = p()),
          C("span", It, [
            C("span", {
              style: Re({ width: `${K.value}%` })
            }, null, 4)
          ]),
          p(" " + u(K.value) + "% ", 1)
        ], 8, Bt)) : m("", !0),
        J.value !== null ? (t(), o("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${J.value}% full: clear or compact it`,
          onClick: g[2] || (g[2] = (d) => w("context") ? k(d, "context") : s("open", "context", d.currentTarget))
        }, [
          h(ee, {
            name: "gauge",
            size: 12
          }),
          g[15] || (g[15] = p()),
          C("span", Nt, [
            C("span", {
              style: Re({ width: `${J.value}%` })
            }, null, 4)
          ]),
          p(" " + u(J.value) + "% ", 1)
        ], 8, Et)) : m("", !0),
        M.value ? (t(), o("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${M.value}: change the model`,
          onClick: g[3] || (g[3] = (d) => w("model") ? k(d, "model") : null)
        }, [
          h(ee, {
            name: "model",
            size: 12
          }),
          p(" " + u(M.value), 1)
        ], 8, qt)) : m("", !0),
        w("effort") || e.card && I.value ? (t(), o("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: g[4] || (g[4] = (d) => k(d, "effort"))
        }, [
          h(ee, {
            name: "bolt",
            size: 12
          }),
          p(" " + u(I.value), 1)
        ], 8, Ft)) : m("", !0),
        D.value ? (t(), o("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: g[5] || (g[5] = (d) => s("open", "cost", d.currentTarget))
        }, u(D.value), 9, Wt)) : m("", !0),
        Z.value ? (t(), o("span", Pt, [
          h(ee, {
            name: "reminders",
            size: 12
          }),
          p(" " + u(Z.value), 1)
        ])) : m("", !0),
        e.branch ? (t(), o("span", Dt, [
          h(ee, {
            name: "branch",
            size: 12
          }),
          p(" " + u(e.branch), 1)
        ])) : m("", !0),
        e.card ? m("", !0) : (t(), o("button", {
          key: 7,
          type: "button",
          class: re(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: g[6] || (g[6] = (d) => s("open", "jobs", d.currentTarget))
        }, [
          h(ee, {
            name: "clock",
            size: 12
          }),
          p(" " + u(e.jobs), 1)
        ], 2)),
        e.run ? (t(), o("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: V
        }, [
          h(ee, {
            name: "book",
            size: 12
          }),
          p(" " + u(H.value.length), 1)
        ])) : m("", !0),
        e.fitness ? (t(), o(N, { key: 9 }, [
          C("button", {
            type: "button",
            class: re(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < _t }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: g[7] || (g[7] = (d) => s("open", "fitness", d.currentTarget))
          }, [
            h(ee, {
              name: "heart",
              size: 12
            }),
            p(" " + u(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          C("button", {
            type: "button",
            class: re(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: g[8] || (g[8] = (d) => s("open", "load", d.currentTarget))
          }, [
            h(ee, {
              name: "weight",
              size: 12
            }),
            p(" " + u(e.fitness.workload), 1)
          ], 2)
        ], 64)) : m("", !0)
      ], 64)) : e.run && !e.loading ? (t(), o("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: g[9] || (g[9] = (d) => k(d, "start"))
      }, [
        h(ee, {
          name: "agents",
          size: 12
        }),
        g[16] || (g[16] = p(" Start an agent", -1))
      ])) : m("", !0),
      g[22] || (g[22] = C("span", { class: "space" }, null, -1)),
      v(a).failure.value ? (t(), o("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: v(a).failure.value
      }, u(v(a).failure.value), 9, Ut)) : m("", !0),
      Me(b.$slots, "default", {}, void 0, !0),
      f.value ? (t(), q(zt, {
        key: 3,
        anchor: f.value,
        "min-width": 190,
        onClose: F
      }, {
        default: S(() => [
          T.value === "agent" ? (t(), o(N, { key: 0 }, [
            v(a).asking.value ? (t(), o(N, { key: 0 }, [
              h(we, { "data-agent-stop-ask": "" }, {
                default: S(() => [...g[17] || (g[17] = [
                  p("Stop the agent? It stops what it is doing.", -1)
                ])]),
                _: 1
              }),
              h(ye, {
                "data-agent-stop-confirm": "",
                onClick: g[10] || (g[10] = (d) => (F(), v(a).stop()))
              }, {
                default: S(() => [...g[18] || (g[18] = [
                  p("Stop it", -1)
                ])]),
                _: 1
              }),
              h(ye, {
                onClick: g[11] || (g[11] = (d) => v(a).asking.value = !1)
              }, {
                default: S(() => [...g[19] || (g[19] = [
                  p("Keep it running", -1)
                ])]),
                _: 1
              })
            ], 64)) : (t(), q(ye, {
              key: 1,
              "data-agent-stop": "",
              onClick: g[12] || (g[12] = (d) => v(a).asking.value = !0)
            }, {
              default: S(() => [...g[20] || (g[20] = [
                p("Stop", -1)
              ])]),
              _: 1
            }))
          ], 64)) : T.value === "start" ? (t(), o(N, { key: 1 }, [
            h(we, null, {
              default: S(() => [...g[21] || (g[21] = [
                p("Start an agent", -1)
              ])]),
              _: 1
            }),
            (t(!0), o(N, null, ae(v(a).programs.value, (d) => (t(), q(ye, {
              key: d.name,
              "data-agent-program": d.name,
              onClick: (z) => (F(), v(a).start(d))
            }, {
              default: S(() => [
                p(u(d.title), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-program", "onClick"]))), 128))
          ], 64)) : T.value === "skills" ? (t(), q(Ct, {
            key: 2,
            skills: A.value,
            onBrowse: g[13] || (g[13] = (d) => (F(), s("open", "skills", null)))
          }, null, 8, ["skills"])) : R.value ? (t(), o(N, { key: 3 }, [
            h(we, null, {
              default: S(() => [
                p(u(R.value.label), 1)
              ]),
              _: 1
            }),
            (t(!0), o(N, null, ae(R.value.choices, (d) => (t(), q(ye, {
              key: d.value,
              "data-agent-choice": d.value,
              onClick: (z) => (v(a).choose(R.value.key, d), F())
            }, {
              default: S(() => [
                p(u(d.label), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-choice", "onClick"]))), 128))
          ], 64)) : m("", !0)
        ]),
        _: 1
      }, 8, ["anchor"])) : m("", !0)
    ], 2));
  }
}, Kt = /* @__PURE__ */ te(Jt, [["__scopeId", "data-v-a3401630"]]), Zt = {
  class: "agent-command",
  "data-agent-command": ""
}, Gt = {
  key: 1,
  "data-agent-stopped": ""
}, Yt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (i, n) => (t(), o("span", Zt, [
      e.waitReason ? (t(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: n[0] || (n[0] = oe((s) => v(Ce)("test_queue:0"), ["stop"]))
      }, [
        p("Waiting: " + u(e.waitReason) + " ", 1),
        h(v(Te), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), o("span", Gt, "Waiting")) : (t(), q(v(tt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Be = /* @__PURE__ */ te(Yt, [["__scopeId", "data-v-1b371fb5"]]), Qt = ["data-agent-delegated", "onClick"], Xt = { class: "agent-task-number" }, ea = { class: "agent-task-title" }, ta = ["title"], aa = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const n = i;
    return (s, a) => (t(), q(v(Ne), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (f) => n("toggle"))
    }, {
      default: S(() => [
        (t(!0), o(N, null, ae(e.section.tasks, (f) => (t(), o("button", {
          key: f.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": f.id,
          onClick: (T) => v(Ce)(`tasks:${f.id}`)
        }, [
          h(v(at), {
            status: f.state
          }, null, 8, ["status"]),
          C("span", Xt, u(f.id), 1),
          C("span", ea, u(f.title), 1),
          f.plan_id ? (t(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${f.plan_id}: ${f.plan_title}`
          }, "Plan " + u(f.plan_id) + ": " + u(f.plan_title), 9, ta)) : m("", !0)
        ], 8, Qt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, na = /* @__PURE__ */ te(aa, [["__scopeId", "data-v-238ff959"]]), la = { class: "action-field" }, oa = ["value", "disabled"], sa = ["value"], ia = { key: 1 }, ra = {
  key: 1,
  class: "action-field"
}, ua = { class: "action-buttons" }, da = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (i, n) => (t(), o("form", {
      onSubmit: n[4] || (n[4] = oe((s) => i.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), o(N, { key: 0 }, [
        C("label", la, [
          n[6] || (n[6] = p("Task ", -1)),
          C("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: n[0] || (n[0] = (s) => i.$emit("update:task", s.target.value))
          }, [
            n[5] || (n[5] = C("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), o(N, null, ae(e.tasks, (s) => (t(), o("option", {
              key: s.id,
              value: String(s.id)
            }, u(s.id) + ": " + u(s.title), 9, sa))), 128))
          ], 40, oa)
        ]),
        e.moreTasks ? (t(), q(v(ne), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: n[1] || (n[1] = (s) => i.$emit("more"))
        }, {
          default: S(() => [...n[7] || (n[7] = [
            p("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), o("p", ia, "No open tasks.")) : m("", !0)
      ], 64)) : (t(), o("label", ra, [
        n[8] || (n[8] = p("Job", -1)),
        h(v(qe), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: n[2] || (n[2] = (s) => i.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      C("div", ua, [
        h(v(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...n[9] || (n[9] = [
            p("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(v(ne), {
          small: "",
          disabled: e.pending,
          onClick: n[3] || (n[3] = (s) => i.$emit("cancel"))
        }, {
          default: S(() => [...n[10] || (n[10] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ca = /* @__PURE__ */ te(da, [["__scopeId", "data-v-adde4158"]]), ga = { class: "action-field" }, va = { class: "action-buttons" }, pa = {
  __name: "AgentMessageForm",
  props: { text: String, pending: Boolean },
  emits: ["submit", "cancel", "update:text"],
  setup(e) {
    return (i, n) => (t(), o("form", {
      onSubmit: n[2] || (n[2] = oe((s) => i.$emit("submit"), ["prevent"]))
    }, [
      C("label", ga, [
        n[3] || (n[3] = p("Message", -1)),
        h(v(qe), {
          value: e.text,
          disabled: e.pending,
          "data-agent-message-text": "",
          onInput: n[0] || (n[0] = (s) => i.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ]),
      C("div", va, [
        h(v(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.text.trim(),
          "data-agent-submit-message": ""
        }, {
          default: S(() => [...n[4] || (n[4] = [
            p("Send the message", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(v(ne), {
          small: "",
          disabled: e.pending,
          onClick: n[1] || (n[1] = (s) => i.$emit("cancel"))
        }, {
          default: S(() => [...n[5] || (n[5] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ma = /* @__PURE__ */ te(pa, [["__scopeId", "data-v-5620d063"]]), ha = { class: "action-buttons" }, fa = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (i, n) => (t(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: n[2] || (n[2] = oe((s) => i.$emit("submit"), ["prevent"]))
    }, [
      n[5] || (n[5] = C("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      h(v(ze), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": n[0] || (n[0] = (s) => i.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      C("div", ha, [
        h(v(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...n[3] || (n[3] = [
            p("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(v(ne), {
          small: "",
          disabled: e.pending,
          onClick: n[1] || (n[1] = (s) => i.$emit("cancel"))
        }, {
          default: S(() => [...n[4] || (n[4] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ka = /* @__PURE__ */ te(fa, [["__scopeId", "data-v-23a905c0"]]), ya = { class: "action-buttons" }, ba = {
  key: 0,
  role: "alert"
}, wa = {
  key: 1,
  role: "status"
}, Ma = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const i = e, n = Ae(), s = j(""), a = j(""), f = j(""), T = j(""), R = j([]), k = j(0), F = j(!1), A = j(!1), H = j(!1), L = j(""), V = j(""), w = $(() => !!i.row.retired_at || i.row.state === "retired"), M = $(() => !w.value && !!i.row.ended_at), I = $(() => {
      var d;
      return M.value && ((d = i.row.job_command) == null ? void 0 : d.length) && !i.row.resume_reason;
    }), B = $(() => I.value && !A.value && (i.row.job_task_flag ? R.value.some((d) => String(d.id) === T.value) : !!a.value.trim()));
    function W(d) {
      s.value = d, a.value = "", f.value = "", T.value = "", L.value = "", V.value = "";
    }
    async function K() {
      W("job"), i.row.job_task_flag && (R.value = [], k.value = 0, F.value = !1, await J());
    }
    async function J() {
      if (!A.value) {
        A.value = !0;
        try {
          const d = await n.read(`task list --state open --limit 100 --page ${k.value + 1}`);
          L.value = d.ok ? "" : d.error, d.ok && (R.value = [...R.value, ...d.value.rows], k.value = d.value.page, F.value = d.value.page * d.value.size < d.value.total);
        } finally {
          A.value = !1;
        }
      }
    }
    async function D(d, z) {
      if (!H.value) {
        H.value = !0, L.value = "";
        try {
          const G = await n.run(d);
          L.value = G.ok ? "" : G.error, G.ok && (W(""), V.value = z);
        } finally {
          H.value = !1;
        }
      }
    }
    async function Z() {
      if (!B.value) return;
      const d = i.row.job_task_flag ? [i.row.job_task_flag, T.value] : [a.value.trim()];
      await D([...i.row.job_command, String(i.row.id), ...d], "Job sent.");
    }
    async function b() {
      w.value || M.value || !a.value.trim() || await D(["message", "send", a.value.trim(), "--target-agent", String(i.row.id)], "Message sent.");
    }
    async function g() {
      !M.value || s.value !== "retire" || !f.value.trim() || await D(["agent", "retire", String(i.row.id), "--reason", f.value.trim()], "Agent retired permanently.");
    }
    return (d, z) => {
      var G;
      return w.value ? m("", !0) : (t(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: z[9] || (z[9] = oe(() => {
        }, ["stop"])),
        onKeydown: z[10] || (z[10] = oe(() => {
        }, ["stop"]))
      }, [
        C("div", ya, [
          M.value ? (t(), o(N, { key: 0 }, [
            (G = e.row.job_command) != null && G.length ? (t(), q(v(ne), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || A.value || !I.value,
              onClick: K
            }, {
              default: S(() => [...z[11] || (z[11] = [
                p("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (t(), q(v(ne), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || A.value,
              onClick: z[0] || (z[0] = (c) => W("retire"))
            }, {
              default: S(() => [...z[12] || (z[12] = [
                p("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : (t(), q(v(ne), {
            key: 1,
            small: "",
            "data-agent-send-message": "",
            disabled: H.value,
            onClick: z[1] || (z[1] = (c) => W("message"))
          }, {
            default: S(() => [...z[13] || (z[13] = [
              p("Send a message", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        h(v(Fe), { value: s.value }, {
          job: S(() => [
            h(ca, {
              task: T.value,
              "onUpdate:task": z[2] || (z[2] = (c) => T.value = c),
              text: a.value,
              "onUpdate:text": z[3] || (z[3] = (c) => a.value = c),
              row: e.row,
              tasks: R.value,
              pending: H.value,
              loading: A.value,
              "more-tasks": F.value,
              failure: L.value,
              "job-ready": B.value,
              onSubmit: Z,
              onMore: J,
              onCancel: z[4] || (z[4] = (c) => W(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          message: S(() => [
            h(ma, {
              text: a.value,
              "onUpdate:text": z[5] || (z[5] = (c) => a.value = c),
              pending: H.value,
              onSubmit: b,
              onCancel: z[6] || (z[6] = (c) => W(""))
            }, null, 8, ["text", "pending"])
          ]),
          retire: S(() => [
            h(ka, {
              reason: f.value,
              "onUpdate:reason": z[7] || (z[7] = (c) => f.value = c),
              pending: H.value,
              onSubmit: g,
              onCancel: z[8] || (z[8] = (c) => W(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        L.value ? (t(), o("p", ba, u(L.value), 1)) : m("", !0),
        V.value ? (t(), o("p", wa, u(V.value), 1)) : m("", !0)
      ], 32));
    };
  }
}, xa = /* @__PURE__ */ te(Ma, [["__scopeId", "data-v-8e1cadf9"]]), $a = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Ca = { class: "agent-head" }, Sa = ["data-state"], Aa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, ja = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ra = { class: "agent-times" }, Ta = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, za = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Va = { class: "agent-line" }, Ha = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Oa = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, La = {
  key: 0,
  class: "agent-line agent-work-start"
}, Ba = ["data-peek"], Ia = ["title"], Ea = ["data-peek"], Na = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, qa = {
  key: 2,
  class: "agent-summary",
  "data-agent-report": ""
}, Fa = {
  key: 3,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Wa = {
  key: 4,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Pa = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, Da = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Ua = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, _a = {
  key: 0,
  class: "agent-helper-brief"
}, Ja = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ka = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Za = "It ended without a report", Ga = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const n = { helper: "Helper", reviewer: "Reviewer" }, s = ["started", "blocked", "open", "completed"], a = e, f = i, T = nt(), R = $(() => {
      var l, x;
      if ((l = a.facts) != null && l.profile_title) return a.facts.profile_title;
      if ((x = a.facts) != null && x.profile) return a.facts.profile;
      const r = n[a.row.role] || a.row.role;
      return r.slice(0, 1).toUpperCase() + r.slice(1);
    }), k = $(() => {
      var r;
      return ((r = a.facts) == null ? void 0 : r.tasks) ?? [];
    }), F = $(() => k.value.filter((r) => r.state === "open")), A = $(() => {
      const r = k.value.find((l) => {
        var x;
        return l.id === ((x = a.facts) == null ? void 0 : x.task_id);
      });
      return r != null && r.plan_id ? r : F.value.find((l) => l.plan_id);
    }), H = $(() => {
      var r, l, x, y, E;
      return a.row.role === "helper" ? ((r = a.facts) == null ? void 0 : r.helper_job) || "" : (l = a.facts) != null && l.job_enabled && (((x = a.facts) == null ? void 0 : x.task_title) || ((y = F.value[0]) == null ? void 0 : y.title) || ((E = k.value.at(-1)) == null ? void 0 : E.title)) || "";
    }), L = $(() => {
      var r;
      return ((r = a.facts) == null ? void 0 : r.job_returned) || a.row.job_returned || "";
    }), V = $(() => {
      const r = H.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return r ? `${r[1].toLowerCase() === "plan" ? "plans" : "docs"}:${r[2]}` : "";
    }), w = $(() => {
      var r, l;
      return [a.row.program, (r = a.facts) == null ? void 0 : r.model, (l = a.facts) == null ? void 0 : l.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role, a.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), M = $(() => {
      var r, l;
      return a.row.ended_at && ((l = (r = a.facts) == null ? void 0 : r.job_returned) != null && l.startsWith(Za)) ? a.facts.job_returned : "";
    }), I = $(() => lt(a.row.process_started_at || a.row.created_at, T.value)), B = /* @__PURE__ */ new Set(["open", "started", "testing"]), W = $(() => !!a.row.ended_at && a.row.role !== "main" && k.value.some((r) => B.has(r.state))), K = $(() => {
      var r;
      return a.waitReason || W.value ? "waiting" : a.row.state === "running" && ((r = a.facts) == null ? void 0 : r.state) || a.row.state;
    }), J = $(() => {
      var r;
      return ((r = a.progress) == null ? void 0 : r.completed_count) ?? k.value.filter((l) => l.state === "completed").length;
    }), D = $(() => {
      var r;
      return ((r = a.progress) == null ? void 0 : r.task_count) ?? k.value.length;
    }), Z = $(() => `${J.value} of ${D.value} ${D.value === 1 ? "task" : "tasks"}`), b = $(() => {
      var l;
      const r = ot(J.value, ((l = a.progress) == null ? void 0 : l.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, T.value);
      return a.row.role !== "main" && r ? `${r} per hour` : "";
    }), g = $(() => k.value.length ? s.map((r) => ({ state: r, label: r.slice(0, 1).toUpperCase() + r.slice(1), tasks: k.value.filter((l) => l.state === r || r === "started" && l.state === "testing" || r === "completed" && l.state === "cancelled") })) : []), d = /* @__PURE__ */ new Set(["completed"]), z = j({}), G = (r) => !(z.value[r] ?? d.has(r)), c = (r) => z.value = { ...z.value, [r]: G(r) }, O = Ae(), P = $(() => a.row.access === "read-only"), Y = $(() => !!a.row.retired_at || a.row.state === "retired"), Q = $(() => Y.value ? O.tabs.filter((r) => r.key === "transcript") : P.value ? O.tabs.filter((r) => ["transcript", "terminal"].includes(r.key)) : O.tabs), X = j(Q.value[0]);
    de(Q, (r) => {
      r.some((l) => {
        var x;
        return l.key === ((x = X.value) == null ? void 0 : x.key);
      }) || (X.value = r[0]);
    }), de(() => a.open, (r) => {
      r && (X.value = Q.value[0]);
    });
    const se = Object.fromEntries(O.tabs.filter((r) => r.component).map((r) => [r.key, Qe(() => st(r.component))])), ve = $(() => a.row.role === "helper" && !a.row.ended_at), pe = () => O.run(["helper", "stop", String(a.row.id)]), ue = j(!1), ie = j(""), me = j(""), he = $(() => a.row.role !== "main" && (!a.row.ended_at || W.value || a.waitReason));
    async function fe() {
      if (!he.value) return;
      const r = await O.read(`usage tool --agent ${a.row.id}`, { deferred: !0 });
      ie.value = r.ok ? r.value.tool : "", me.value = r.ok ? r.value.note : "";
    }
    const be = O.follow(["hook_call.*", "process_part.*"], We(fe, Pe.agentCommand));
    return Se(() => be == null ? void 0 : be()), fe(), (r, l) => {
      var x, y, E, ce;
      return t(), o("div", {
        class: re(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: e.row.session,
        onClick: l[6] || (l[6] = (U) => !e.open && f("toggle")),
        onKeydown: [
          l[7] || (l[7] = Ve(oe((U) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          l[8] || (l[8] = Ve(oe((U) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        C("span", Ca, [
          e.open ? (t(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: l[0] || (l[0] = oe((U) => f("toggle"), ["stop"]))
          }, [
            h(v(Te), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          C("span", {
            class: "agent-dot",
            "data-state": K.value,
            "data-agent-motion": ""
          }, null, 8, Sa),
          C("span", Aa, u(R.value), 1),
          C("span", ja, u(((x = e.facts) == null ? void 0 : x.given_name) || e.row.id), 1),
          e.open ? m("", !0) : (t(), q(v(Te), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          C("span", Ra, [
            e.row.ended_at && !W.value ? (t(), q(v(Oe), {
              key: 0,
              class: "agent-time",
              at: e.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (t(), o("span", Ta, u(I.value), 1)),
            (y = e.facts) != null && y.last_activity ? (t(), o("span", za, [
              l[9] || (l[9] = p("Last heard: ", -1)),
              h(v(Oe), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : m("", !0)
          ])
        ]),
        C("span", Va, [
          C("span", Ha, u(w.value), 1),
          D.value && !H.value ? (t(), o("span", Oa, u(Z.value), 1)) : m("", !0)
        ]),
        A.value ? (t(), o("span", La, [
          C("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${A.value.plan_id}`,
            onClick: l[1] || (l[1] = oe((U) => v(Ce)(`plans:${A.value.plan_id}`), ["stop"]))
          }, "Plan " + u(A.value.plan_id) + ": " + u(A.value.plan_title), 9, Ba)
        ])) : m("", !0),
        H.value ? (t(), o("span", {
          key: 1,
          class: re(["agent-line", { "agent-work-start": !A.value }])
        }, [
          C("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: H.value
          }, [
            V.value ? (t(), o("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": V.value,
              onClick: l[2] || (l[2] = oe((U) => v(Ce)(V.value), ["stop"]))
            }, u(H.value), 9, Ea)) : (t(), o(N, { key: 1 }, [
              p(u(H.value), 1)
            ], 64))
          ], 8, Ia),
          D.value ? (t(), o("span", Na, u(Z.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        L.value ? (t(), o("p", qa, [
          l[10] || (l[10] = C("span", null, "Last report: ", -1)),
          p(u(L.value), 1)
        ])) : m("", !0),
        e.row.retirement_reason ? (t(), o("p", Fa, "Retirement reason: " + u(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (t(), o("p", Wa, u(e.row.resume_reason), 1)) : m("", !0),
        h(xa, { row: e.row }, null, 8, ["row"]),
        !e.open && (he.value || D.value && b.value) ? (t(), o("span", {
          key: 5,
          class: re(["agent-foot", { "agent-work-start": !H.value && !A.value }]),
          "data-agent-foot": ""
        }, [
          he.value ? (t(), q(Be, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: W.value,
            command: ie.value,
            note: me.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          D.value && b.value ? (t(), o("span", Pa, u(b.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        e.open ? (t(), o("div", {
          key: 6,
          class: "agent-more",
          "data-agent-more": "",
          onClick: l[5] || (l[5] = oe(() => {
          }, ["stop"]))
        }, [
          h(Kt, {
            agent: e.row,
            branch: (E = e.progress) == null ? void 0 : E.branch,
            usage: { agents: e.facts ? [e.facts] : [], windows: [] },
            card: ""
          }, {
            default: S(() => [
              ve.value ? (t(), q(v(ne), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: pe
              }, {
                default: S(() => [...l[11] || (l[11] = [
                  p("Stop", -1)
                ])]),
                _: 1
              })) : m("", !0)
            ]),
            _: 1
          }, 8, ["agent", "branch", "usage"]),
          he.value ? (t(), q(Be, {
            key: 0,
            class: "agent-command",
            "wait-reason": e.waitReason,
            stopped: W.value,
            command: ie.value,
            note: me.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          M.value ? (t(), o("p", Da, u(M.value), 1)) : m("", !0),
          h(v(it), {
            class: "agent-tabs",
            tabs: Q.value,
            active: X.value,
            answer: { tasks: k.value.length },
            onChoose: l[3] || (l[3] = (U) => X.value = U)
          }, null, 8, ["tabs", "active", "answer"]),
          h(v(rt), {
            class: "agent-tab-body",
            tab: X.value,
            "data-agent-tab-body": (ce = X.value) == null ? void 0 : ce.key
          }, {
            default: S(() => {
              var U;
              return [
                h(v(Fe), {
                  value: (U = X.value) == null ? void 0 : U.key
                }, Xe({
                  tasks: S(() => {
                    var _;
                    return [
                      k.value.length ? m("", !0) : (t(), q(v(De), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: S(() => [...l[12] || (l[12] = [
                          p("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (t(!0), o(N, null, ae(g.value, (le) => (t(), q(na, {
                        key: le.state,
                        section: le,
                        open: G(le.state),
                        onToggle: (ge) => c(le.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (_ = e.facts) != null && _.instruction ? (t(), o(N, { key: 1 }, [
                        l[13] || (l[13] = C("p", { class: "agent-label" }, "Instruction", -1)),
                        C("div", Ua, u(e.facts.instruction), 1)
                      ], 64)) : m("", !0)
                    ];
                  }),
                  transcript: S(() => {
                    var _;
                    return [
                      P.value ? (t(), o(N, { key: 0 }, [
                        (_ = e.facts) != null && _.instruction ? (t(), o("div", _a, [
                          h(v(Ne), {
                            label: "Instruction",
                            open: ue.value,
                            "data-agent-section": "instruction",
                            onToggle: l[4] || (l[4] = (le) => ue.value = !ue.value)
                          }, {
                            default: S(() => [
                              C("div", Ja, u(e.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : e.facts && e.row.ended_at ? (t(), o("p", Ka, "No job recorded")) : m("", !0)
                      ], 64)) : m("", !0),
                      h(pt, {
                        line: `agent transcript ${e.row.id}`,
                        padding: "0"
                      }, null, 8, ["line"])
                    ];
                  }),
                  _: 2
                }, [
                  ae(v(se), (_, le) => ({
                    name: le,
                    fn: S(() => [
                      (t(), q(et(_), {
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
      ], 42, $a);
    };
  }
}, Ya = /* @__PURE__ */ te(Ga, [["__scopeId", "data-v-4312b32d"]]), Qa = {
  class: "agent-limits",
  "data-agent-limits": ""
}, Xa = { class: "limits-head" }, en = ["data-agent-limit-type"], tn = { class: "limits-counts" }, an = { key: 0 }, nn = { key: 1 }, ln = { key: 0 }, on = ["data-agent-limit-profile"], sn = { class: "limit-fields" }, rn = { class: "limit-field" }, un = { class: "limit-field" }, dn = {
  key: 1,
  role: "alert"
}, cn = {
  key: 2,
  role: "status"
}, gn = {
  __name: "AgentLimits",
  setup(e) {
    const i = Ae(), n = j([]), s = j({}), a = j(!1), f = j(!1), T = j(""), R = j(""), k = (L) => L === 0 ? "no limit" : String(L);
    let F = 0;
    async function A() {
      const L = ++F, V = await i.read("agent limits");
      if (L !== F || (n.value = V.ok ? V.value.rows : [], T.value = V.ok ? "" : V.error, !V.ok)) return;
      const w = await Promise.all(n.value.flatMap((M) => [M.run_setting, M.kept_setting]).map(async (M) => {
        const I = await i.read(`setting show ${M}`);
        return [M, I.ok ? I.value.source : ""];
      }));
      L === F && (s.value = Object.fromEntries(w));
    }
    async function H(L, V, w, M) {
      if (f.value || i.readOnly) return;
      const I = Number(M.target.value);
      if (!Number.isInteger(I) || I < 0 || !M.target.value.trim()) {
        T.value = "Use a whole number of 0 or more.", M.target.value = String(w);
        return;
      }
      f.value = !0, R.value = "";
      try {
        const B = await i.run(["setting", "set", V, String(I), "--environment", i.environment]);
        if (T.value = B.ok ? "" : B.error, !B.ok) {
          M.target.value = String(w);
          return;
        }
        await A(), R.value = `${L.label} limits saved.`;
      } finally {
        f.value = !1;
      }
    }
    return i.follow(["agent.*", "setting.*"], A), A(), (L, V) => (t(), o("section", Qa, [
      n.value.length ? (t(), o(N, { key: 0 }, [
        C("div", Xa, [
          V[1] || (V[1] = C("strong", null, "Agent limits", -1)),
          h(v(ne), {
            small: "",
            disabled: f.value || v(i).readOnly,
            "data-agent-limits-edit": "",
            onClick: V[0] || (V[0] = (w) => a.value = !a.value)
          }, {
            default: S(() => [
              p(u(a.value ? "Done" : "Edit limits"), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        (t(!0), o(N, null, ae(n.value, (w) => (t(), o("div", {
          key: w.key,
          class: "type-limits",
          "data-agent-limit-type": w.key
        }, [
          C("div", tn, [
            C("strong", null, u(w.label), 1),
            w.per_profile ? (t(), o("span", an, "Running: " + u(w.running) + " · Kept: " + u(w.kept), 1)) : (t(), o("span", nn, "Running: " + u(w.running) + " of " + u(w.run_limit) + " · Kept: " + u(w.kept) + " of " + u(k(w.kept_limit)), 1))
          ]),
          w.per_profile ? (t(), o("p", ln, "Limits per profile: running " + u(w.run_limit) + ", kept " + u(k(w.kept_limit)) + ".", 1)) : m("", !0),
          (t(!0), o(N, null, ae(w.profiles, (M) => (t(), o("p", {
            key: M.profile,
            class: "profile-limits",
            "data-agent-limit-profile": M.profile
          }, u(M.title) + ": running " + u(M.running) + " of " + u(M.run_limit) + " · kept " + u(M.kept) + " of " + u(k(M.kept_limit)), 9, on))), 128)),
          a.value ? (t(), o(N, { key: 1 }, [
            C("div", sn, [
              C("label", rn, [
                C("span", null, [
                  V[2] || (V[2] = p("Running", -1)),
                  w.per_profile ? (t(), o(N, { key: 0 }, [
                    p(" per profile")
                  ], 64)) : m("", !0)
                ]),
                h(v(ze), {
                  type: "number",
                  min: "0",
                  value: String(w.run_limit),
                  disabled: f.value || v(i).readOnly,
                  "data-agent-run-limit": w.key,
                  onChange: (M) => H(w, w.run_setting, w.run_limit, M)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                C("small", null, u(s.value[w.run_setting]), 1)
              ]),
              C("label", un, [
                C("span", null, [
                  V[3] || (V[3] = p("Kept", -1)),
                  w.per_profile ? (t(), o(N, { key: 0 }, [
                    p(" per profile")
                  ], 64)) : m("", !0)
                ]),
                h(v(ze), {
                  type: "number",
                  min: "0",
                  value: String(w.kept_limit),
                  disabled: f.value || v(i).readOnly,
                  "data-agent-kept-limit": w.key,
                  onChange: (M) => H(w, w.kept_setting, w.kept_limit, M)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                C("small", null, u(s.value[w.kept_setting]), 1)
              ])
            ]),
            C("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + u(v(i).environment) + ".", 1)
          ], 64)) : m("", !0)
        ], 8, en))), 128))
      ], 64)) : m("", !0),
      T.value ? (t(), o("p", dn, u(T.value), 1)) : m("", !0),
      R.value ? (t(), o("p", cn, u(R.value), 1)) : m("", !0)
    ]));
  }
}, vn = /* @__PURE__ */ te(gn, [["__scopeId", "data-v-92094f1b"]]), pn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, mn = ["data-agent-row"], Ie = "journal.agents.filters", $e = "cubic-bezier(0.2, 0.9, 0.25, 1)", hn = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const i = e, { rows: n } = ut("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: s } = Le("waits"), { rows: a } = Le("progress"), f = (l) => a.value.find((x) => x.agent_id === l.id) ?? null, T = (l) => {
      var x;
      return ((x = s.value.find((y) => y.agent_id === l.id)) == null ? void 0 : x.reason) ?? "";
    }, R = j("running"), k = j(""), F = JSON.parse(localStorage.getItem(Ie) || '{"roles":[],"profiles":[],"programs":[]}'), A = j(F), H = j({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), L = j([]), V = $(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), w = (l, x) => {
      A.value = vt(A.value, l, x);
    }, M = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, I = (l) => l.slice(0, 1).toUpperCase() + l.slice(1);
    de(A, (l) => localStorage.setItem(Ie, JSON.stringify(l)));
    const B = Ae();
    async function W() {
      const [l, x] = await Promise.all([B.read("agent cards --options"), B.read("agent programs")]);
      l.ok && (H.value = l.value), x.ok && (L.value = x.value.rows);
    }
    B.follow(["agent.*"], W), W();
    const K = j([]), J = j(""), D = j(!1), Z = j(!1), b = j(25);
    let g = 0;
    async function d() {
      const l = ++g, x = [
        ...A.value.roles.map((E) => `--role ${JSON.stringify(E)}`),
        ...A.value.profiles.map((E) => `--profile ${JSON.stringify(E)}`),
        ...A.value.programs.map((E) => `--program ${JSON.stringify(E)}`)
      ].join(" "), y = await B.read(`${i.line} --show ${R.value} --search ${JSON.stringify(k.value)} --limit ${b.value} ${x}`);
      l === g && (K.value = y.ok ? y.value.rows : [], J.value = y.ok ? "" : y.error, Z.value = y.ok && y.value.page * y.value.size < y.value.total, D.value = !0);
    }
    async function z() {
      return b.value += 25, await d(), !0;
    }
    de([R, k, A], () => {
      b.value = 25, d();
    }), B.follow(["agent.*", "task.*", ...B.sources.flatMap((l) => l.events)], We(d, Pe.pageOfAgents)), d();
    const G = (l) => n.value.find((x) => x.id === l.id) ?? l.facts ?? null, c = K, O = $(() => !!k.value.trim() || V.value > 0), P = $(() => i.texts[R.value] ?? { title: i.empty, hint: "" }), Y = j(null), Q = j(null), X = j(null), se = $(() => c.value.find((l) => l.id === Y.value) ?? null), ve = $(() => se.value ? [se.value] : c.value), pe = $(() => c.value.length - ve.value.length), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ie = !1, me = 0;
    async function he(l) {
      if (ie) return;
      ie = !0, me = X.value.scrollTop;
      const x = Q.value.querySelector(`[data-agent-open="${l.id}"]`);
      if (!ue()) {
        const U = [...Q.value.querySelectorAll(".agent-row")].filter((_) => !_.contains(x));
        await Promise.all(U.map((_) => _.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const y = [...x.querySelectorAll(".agent-head, .agent-line")], E = [...y, ...x.querySelectorAll("[data-agent-motion]")], ce = E.map((U) => U.getBoundingClientRect());
      if (Y.value = l.id, await He(), !ue()) {
        const U = E.map((_) => _.getBoundingClientRect());
        E.forEach((_, le) => {
          const ge = y.indexOf(_.parentElement), Je = ce[le].left - U[le].left - (ge < 0 ? 0 : ce[ge].left - U[ge].left), Ke = ce[le].top - U[le].top - (ge < 0 ? 0 : ce[ge].top - U[ge].top);
          _.animate([{ transform: `translate(${Je}px, ${Ke}px)` }, { transform: "none" }], { duration: 280, easing: $e });
        }), Q.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((_) => {
          _.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: $e, fill: "backwards" });
        });
      }
      ie = !1;
    }
    async function fe() {
      if (ie || !se.value) return;
      ie = !0;
      const l = Q.value.querySelector(`[data-agent-open="${Y.value}"]`), x = [...l.children, ...Q.value.querySelectorAll(".agents-held")], y = ue() ? [] : x.map((E) => E.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(y.map((E) => E.finished)), Y.value = null, await He(), X.value.scrollTop = me, y.forEach((E) => E.cancel()), ue() || (l.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: $e }), Q.value.querySelectorAll(".agent-row").forEach((E) => {
        E.contains(l) || E.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: $e });
      })), ie = !1;
    }
    const be = (l) => Y.value === l.id ? fe() : he(l);
    de(k, (l) => l.trim() && (Y.value = null)), de(R, () => {
      Y.value = null;
    });
    const r = (l) => {
      l.key === "Escape" && fe();
    };
    return window.addEventListener("keydown", r), Se(() => window.removeEventListener("keydown", r)), (l, x) => (t(), o("div", {
      ref_key: "agents",
      ref: Q,
      class: re(["agents", { focused: se.value }])
    }, [
      h(vn),
      h(v(dt), {
        modelValue: k.value,
        "onUpdate:modelValue": x[1] || (x[1] = (y) => k.value = y),
        placeholder: "Search agents",
        "menu-count": V.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          h(v(je), null, {
            default: S(() => [...x[2] || (x[2] = [
              p("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(N, null, ae(H.value.roles, (y) => (t(), q(v(xe), {
            key: y,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(y),
            checked: A.value.roles.includes(y),
            "data-filter-role": y,
            onClick: (E) => w("roles", y)
          }, {
            default: S(() => [
              p(u(I(y)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          H.value.profiles.length ? (t(), q(v(je), { key: 0 }, {
            default: S(() => [...x[3] || (x[3] = [
              p("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (t(!0), o(N, null, ae(H.value.profiles, (y) => (t(), q(v(xe), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(y.name),
            checked: A.value.profiles.includes(y.name),
            "data-filter-profile": y.name,
            onClick: (E) => w("profiles", y.name)
          }, {
            default: S(() => [
              p(u(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          h(v(je), null, {
            default: S(() => [...x[4] || (x[4] = [
              p("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(N, null, ae(L.value, (y) => (t(), q(v(xe), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(y.name),
            checked: A.value.programs.includes(y.name),
            "data-filter-program": y.name,
            onClick: (E) => w("programs", y.name)
          }, {
            default: S(() => [
              p(u(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          V.value ? (t(), q(v(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: M
          }, {
            default: S(() => [...x[5] || (x[5] = [
              p("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: S(() => [
          h(v(ct), {
            options: H.value.states,
            value: R.value,
            onPick: x[0] || (x[0] = (y) => R.value = y)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      R.value === "retired" && H.value.upgrade_retired ? (t(), o("p", pn, "Retired during the upgrade: " + u(H.value.upgrade_retired), 1)) : m("", !0),
      C("div", {
        ref_key: "list",
        ref: X,
        class: re(["agents-view", { "agents-view-open": se.value }])
      }, [
        D.value && !J.value && !ve.value.length && V.value ? (t(), q(v(De), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            h(v(ne), {
              small: "",
              "data-empty-clear": "",
              onClick: M
            }, {
              default: S(() => [...x[6] || (x[6] = [
                p("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), q(v(gt), {
          key: 1,
          rows: ve.value,
          failure: J.value,
          loaded: D.value,
          more: !se.value && Z.value,
          older: z,
          empty: P.value.title,
          hint: P.value.hint,
          searching: O.value
        }, {
          default: S(({ row: y }) => [
            C("div", {
              class: "agent-row",
              "data-agent-row": y.id
            }, [
              h(Ya, {
                row: y,
                facts: G(y),
                progress: f(y),
                "wait-reason": T(y),
                open: y.id === Y.value,
                onToggle: (E) => be(y)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, mn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      se.value && pe.value ? (t(), o("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: fe
      }, u(pe.value) + " more", 1)) : m("", !0)
    ], 2));
  }
}, bn = /* @__PURE__ */ te(hn, [["__scopeId", "data-v-980c141c"]]);
export {
  bn as A
};
