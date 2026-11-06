/* @code-commandments-generated */
import { openBlock as n, createElementBlock as r, normalizeStyle as oe, normalizeClass as ee, toDisplayString as c, createCommentVNode as f, createElementVNode as g, renderSlot as ve, computed as y, createVNode as h, withCtx as C, createTextVNode as m, Fragment as V, renderList as G, onUnmounted as $e, ref as x, onMounted as Le, createBlock as D, Teleport as Ke, mergeProps as Ze, watch as le, toRef as Ge, unref as p, withModifiers as X, defineAsyncComponent as Ye, createSlots as Qe, resolveDynamicComponent as Xe, withKeys as ze, withDirectives as et, vShow as tt, nextTick as Oe } from "vue";
import { peekRef as we, Icon as Me, RunningCommand as at, FoldGroup as Be, TaskStatusIcon as nt, Btn as Q, TextArea as Ie, TextInput as je, useWindow as xe, SwitchCase as Ee, loadWindowComponent as lt, coalesced as Ne, READ_RATES as We, InnerTabs as st, TabBody as ot, EmptyState as qe, useNow as it, age as rt, perHour as ut, TimeAgo as Se, useRows as dt, useDeclaredRows as He, SearchBar as ct, Segmented as gt, MenuLabel as Ae, MenuItem as ye, RowList as vt, toggleFilter as pt } from "@journal/window-kit";
import { _ as K, T as mt } from "./TranscriptRows-DCpyNUhv.mjs";
const ht = ["stroke-width", "innerHTML"], Z = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const i = e, o = { right: 0, down: 90, left: 180, up: 270 }, l = {
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
    }, v = {
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
    return (b, S) => (n(), r("svg", {
      class: "ico",
      style: oe({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...i.facing === "right" ? {} : { transform: `rotate(${o[i.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: v[l[e.name] || e.name] || v.dot
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
    return (i, o) => (n(), r("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), r("span", ft, c(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (n(), r("span", kt, [
        g("span", null, [
          ve(i.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, c(e.description), 1)
      ])) : ve(i.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, de = /* @__PURE__ */ K(yt, [["__scopeId", "data-v-9c67fe37"]]), bt = {}, wt = { class: "menu-label" };
function Mt(e, i) {
  return n(), r("span", wt, [
    ve(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ge = /* @__PURE__ */ K(bt, [["render", Mt], ["__scopeId", "data-v-71c11156"]]), $t = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, xt = {
  key: 0,
  class: "skills-none"
}, Ct = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: i }) {
    const o = e, l = i, v = y(() => o.skills.filter((S) => S.state === "loaded")), b = y(() => o.skills.filter((S) => S.state !== "loaded"));
    return (S, k) => (n(), r("div", $t, [
      h(ge, null, {
        default: C(() => [...k[1] || (k[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      v.value.length ? f("", !0) : (n(), r("p", xt, "None yet. Compacting the conversation empties this list.")),
      (n(!0), r(V, null, G(v.value, (M) => (n(), r("p", {
        key: M.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        h(Z, {
          name: "book",
          size: 12
        }),
        m(c(M.skill), 1)
      ]))), 128)),
      b.value.length ? (n(), r(V, { key: 1 }, [
        h(ge, null, {
          default: C(() => [...k[2] || (k[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), r(V, null, G(b.value, (M) => (n(), r("p", {
          key: M.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          h(Z, {
            name: "book",
            size: 12
          }),
          m(c(M.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      h(de, {
        "data-agent-skills-browse": "",
        onClick: k[0] || (k[0] = (M) => l("browse"))
      }, {
        default: C(() => [...k[3] || (k[3] = [
          m("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, St = /* @__PURE__ */ K(Ct, [["__scopeId", "data-v-27140adf"]]), At = (e, i, o) => Math.max(i, Math.min(o, e)), Fe = /* @__PURE__ */ new WeakMap(), jt = (e, i) => Fe.set(e, i);
function Rt(e, i) {
  for (let o = i; o; o = Fe.get(o) ?? o.parentElement) if (o === e) return !0;
  return !1;
}
function Tt(e, i) {
  const o = (l) => {
    var b, S;
    const v = ((b = e.value) == null ? void 0 : b.element) || ((S = e.value) == null ? void 0 : S.$el) || e.value;
    v && !Rt(v, l.target) && i(l);
  };
  window.addEventListener("click", o), $e(() => window.removeEventListener("click", o));
}
const ue = 8, zt = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: i, emit: o }) {
    const l = e, v = x(null), b = (d) => d ? `${d}px` : void 0, S = y(() => ({
      minWidth: b(l.minWidth),
      maxWidth: b(l.maxWidth),
      maxHeight: b(l.maxHeight),
      height: b(l.height)
    })), k = x({ w: 0, h: 0 }), M = x(l.anchor ? l.anchor.getBoundingClientRect() : null), E = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), w = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), T = (d) => {
      const A = d.closest(".pane, .float-window");
      return A ? w(A.getBoundingClientRect()) : E();
    }, L = (d, A) => `${Math.max(0, d ? Math.min(d, A) : A)}px`;
    function B(d, A) {
      return {
        below: d.bottom - A.bottom - l.gap - ue,
        above: A.top - d.top - l.gap - ue,
        across: d.right - d.left - 2 * ue
      };
    }
    function I(d) {
      const A = T(l.anchor), F = B(A, d);
      return k.value.w <= F.across && k.value.h <= Math.max(F.below, F.above) ? A : E();
    }
    const H = y(() => {
      if (!M.value) return S.value;
      const d = M.value, A = I(d), F = B(A, d), { w: Y, h: ae } = k.value, ce = l.align === "auto" ? d.left + d.right > A.left + A.right : l.align === "right", ne = At(ce ? d.right - Y : d.left, A.left + ue, Math.max(A.left + ue, A.right - Y - ue)), me = ae > F.below && F.above > F.below ? { bottom: `${window.innerHeight - d.top + l.gap}px`, maxHeight: L(l.maxHeight, F.above) } : { top: `${d.bottom + l.gap}px`, maxHeight: L(l.maxHeight, F.below) };
      return { ...S.value, ...me, left: `${ne}px`, maxWidth: L(l.maxWidth, F.across) };
    }), N = o, z = () => [...v.value.querySelectorAll("button:not(:disabled)")];
    function W(d) {
      const A = z(), F = A.indexOf(document.activeElement);
      A[(F + d + A.length) % A.length].focus();
    }
    const q = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => N("close") }, P = (d) => q[d.key] && (d.preventDefault(), q[d.key]()), U = () => v.value && (k.value = { w: v.value.offsetWidth, h: v.value.scrollHeight });
    let J = 0;
    const u = new ResizeObserver(() => {
      cancelAnimationFrame(J), J = requestAnimationFrame(U);
    });
    Tt(v, (d) => l.anchor && !l.anchor.contains(d.target) && N("close"));
    const t = (d, A) => ["top", "left", "right", "bottom"].some((F) => Math.abs(d[F] - A[F]) > 1), a = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let s = 0;
    function j() {
      if (l.anchor) {
        const d = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || a(d)) return N("close");
        t(d, M.value) && (M.value = d);
      }
      s = requestAnimationFrame(j);
    }
    return Le(() => {
      l.anchor && v.value && jt(v.value, l.anchor), U(), v.value && u.observe(v.value), !l.plain && z()[0] && z()[0].focus(), j();
    }), $e(() => {
      u.disconnect(), cancelAnimationFrame(s), cancelAnimationFrame(J);
    }), i({ element: v }), (d, A) => (n(), D(Ke, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ze({
        ref_key: "panel",
        ref: v
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: H.value,
        onKeydown: P
      }), [
        ve(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ot = /* @__PURE__ */ K(zt, [["__scopeId", "data-v-7f046e0d"]]);
async function Ht(e, i, o) {
  if (!e) return o(i);
  const { target: l, fields: v } = e, b = Object.fromEntries(Object.keys(v).map((M) => [M, l[M]])), S = () => Object.assign(l, b);
  Object.assign(l, v);
  let k = !1;
  try {
    const M = await o(i);
    return k = M.ok, M;
  } finally {
    k || S();
  }
}
function Vt(e, i, o) {
  const l = x([]), v = x([]), b = x({}), S = x(""), k = x(!1), M = y(() => !!e.value && !e.value.ended_at), E = y(() => M.value && !!e.value.paused_at);
  async function w() {
    if (M.value) {
      const N = await i(["agent", "controls", String(e.value.id)]);
      l.value = N.ok ? N.value.groups : [];
      return;
    }
    const H = await i(["agent", "programs"]);
    v.value = H.ok ? H.value.rows : [];
  }
  async function T(H, N = null) {
    S.value = "";
    const z = await Ht(N, H, i);
    return S.value = z.ok ? "" : z.error, o(), z;
  }
  const L = (H, N) => T(["agent", "control", String(e.value.id), H, N.value], { target: b, fields: { value: { ...b.value, [H]: N.label } } }), B = () => (k.value = !1, T(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), I = (H) => T(["agent", "launch", H.name]);
  return Le(w), le(M, w), { groups: l, programs: v, chosen: b, failure: S, asking: k, running: M, paused: E, choose: L, stop: B, start: I };
}
const De = { claude: "Claude Code", codex: "Codex" };
Object.entries(De).map(([e, i]) => ({ key: e, label: i }));
function Lt(e, i = "agent") {
  return De[e] || i;
}
function Bt(e) {
  if (!e) return "Not compacted yet";
  const i = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${i}` : e.end_percent === null ? `Last compacted ${i}, from ${e.start_percent}%` : `Last compacted ${i}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const It = ["disabled", "title"], Et = ["title"], Nt = { class: "gauge usage" }, Wt = ["disabled", "title"], qt = { class: "gauge" }, Ft = ["disabled", "title"], Dt = ["disabled"], Pt = ["disabled"], _t = {
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
  setup(e, { emit: i }) {
    const o = e, l = i, v = Vt(Ge(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed")), b = x(null), S = x(""), k = y(() => v.groups.value.find((u) => u.key === S.value));
    function M(u, t) {
      b.value = u.currentTarget, S.value = t;
    }
    function E() {
      b.value = null, S.value = "", v.asking.value = !1;
    }
    const w = x([]), T = y(() => w.value.filter((u) => u.state === "loaded"));
    async function L() {
      const u = o.agent && o.run ? await o.run(["agent-skill", "list", "--agent", String(o.agent.id)]) : null;
      w.value = u != null && u.ok ? u.value.rows ?? [] : [];
    }
    function B(u) {
      M(u, "skills"), L();
    }
    le(() => {
      var u;
      return (u = o.agent) == null ? void 0 : u.id;
    }, L, { immediate: !0 });
    const I = (u) => v.groups.value.some((t) => t.key === u), H = y(() => {
      var u;
      return v.chosen.value.model ?? ((u = z.value) == null ? void 0 : u.model) ?? "";
    }), N = y(() => {
      var u;
      return v.chosen.value.effort ?? ((u = z.value) == null ? void 0 : u.effort) ?? "";
    });
    y(() => !!o.agent && !o.agent.ended_at);
    const z = y(() => {
      var u;
      return ((u = o.usage.agents) == null ? void 0 : u.find((t) => {
        var a;
        return t.id === ((a = o.agent) == null ? void 0 : a.id);
      })) ?? null;
    }), W = y(() => {
      var u;
      return ((u = o.usage.windows) == null ? void 0 : u[0]) ?? null;
    }), q = y(() => W.value ? Math.max(0, Math.min(100, Math.round(W.value.used_percent))) : null), P = y(() => {
      var u;
      return ((u = z.value) == null ? void 0 : u.context_percent) == null ? null : Math.round(z.value.context_percent);
    }), U = y(() => {
      var u;
      return (u = z.value) != null && u.cost_dollars ? `$${z.value.cost_dollars.toFixed(2)}` : "";
    }), J = y(() => {
      var a;
      const u = (a = o.agent) != null && a.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!u) return "";
      const t = Math.max(0, Math.floor((o.now - u) / 6e4));
      return t >= 60 ? `${Math.floor(t / 60)}h ${t % 60}m` : `${t}m`;
    });
    return (u, t) => (n(), r("div", {
      class: ee(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (n(), r(V, { key: 0 }, [
        g("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: t[0] || (t[0] = (a) => M(a, "agent"))
        }, [
          h(Z, {
            name: "agents",
            size: 12
          }),
          m(" " + c(p(Lt)(e.agent.program)), 1)
        ], 8, It),
        q.value !== null ? (n(), r("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${q.value}% of the plan's ${W.value.title} allowance used`,
          onClick: t[1] || (t[1] = (a) => l("open", "usage", a.currentTarget))
        }, [
          h(Z, {
            name: "clock",
            size: 12
          }),
          t[14] || (t[14] = m()),
          g("span", Nt, [
            g("span", {
              style: oe({ width: `${q.value}%` })
            }, null, 4)
          ]),
          m(" " + c(q.value) + "% ", 1)
        ], 8, Et)) : f("", !0),
        P.value !== null ? (n(), r("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${P.value}% full: clear or compact it`,
          onClick: t[2] || (t[2] = (a) => I("context") ? M(a, "context") : l("open", "context", a.currentTarget))
        }, [
          h(Z, {
            name: "gauge",
            size: 12
          }),
          t[15] || (t[15] = m()),
          g("span", qt, [
            g("span", {
              style: oe({ width: `${P.value}%` })
            }, null, 4)
          ]),
          m(" " + c(P.value) + "% ", 1)
        ], 8, Wt)) : f("", !0),
        H.value ? (n(), r("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${H.value}: change the model`,
          onClick: t[3] || (t[3] = (a) => I("model") ? M(a, "model") : null)
        }, [
          h(Z, {
            name: "model",
            size: 12
          }),
          m(" " + c(H.value), 1)
        ], 8, Ft)) : f("", !0),
        I("effort") || e.card && N.value ? (n(), r("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: t[4] || (t[4] = (a) => M(a, "effort"))
        }, [
          h(Z, {
            name: "bolt",
            size: 12
          }),
          m(" " + c(N.value), 1)
        ], 8, Dt)) : f("", !0),
        U.value ? (n(), r("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: t[5] || (t[5] = (a) => l("open", "cost", a.currentTarget))
        }, c(U.value), 9, Pt)) : f("", !0),
        J.value ? (n(), r("span", _t, [
          h(Z, {
            name: "reminders",
            size: 12
          }),
          m(" " + c(J.value), 1)
        ])) : f("", !0),
        e.branch ? (n(), r("span", Ut, [
          h(Z, {
            name: "branch",
            size: 12
          }),
          m(" " + c(e.branch), 1)
        ])) : f("", !0),
        e.card ? f("", !0) : (n(), r("button", {
          key: 7,
          type: "button",
          class: ee(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: t[6] || (t[6] = (a) => l("open", "jobs", a.currentTarget))
        }, [
          h(Z, {
            name: "clock",
            size: 12
          }),
          m(" " + c(e.jobs), 1)
        ], 2)),
        e.run ? (n(), r("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: B
        }, [
          h(Z, {
            name: "book",
            size: 12
          }),
          m(" " + c(T.value.length), 1)
        ])) : f("", !0),
        e.fitness ? (n(), r(V, { key: 9 }, [
          g("button", {
            type: "button",
            class: ee(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Qt }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: t[7] || (t[7] = (a) => l("open", "fitness", a.currentTarget))
          }, [
            h(Z, {
              name: "heart",
              size: 12
            }),
            m(" " + c(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          g("button", {
            type: "button",
            class: ee(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: t[8] || (t[8] = (a) => l("open", "load", a.currentTarget))
          }, [
            h(Z, {
              name: "weight",
              size: 12
            }),
            m(" " + c(e.fitness.workload), 1)
          ], 2)
        ], 64)) : f("", !0)
      ], 64)) : e.run && !e.loading ? (n(), r("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: t[9] || (t[9] = (a) => M(a, "start"))
      }, [
        h(Z, {
          name: "agents",
          size: 12
        }),
        t[16] || (t[16] = m(" Start an agent", -1))
      ])) : f("", !0),
      t[22] || (t[22] = g("span", { class: "space" }, null, -1)),
      p(v).failure.value ? (n(), r("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: p(v).failure.value
      }, c(p(v).failure.value), 9, Jt)) : f("", !0),
      ve(u.$slots, "default", {}, void 0, !0),
      b.value ? (n(), D(Ot, {
        key: 3,
        anchor: b.value,
        "min-width": 190,
        onClose: E
      }, {
        default: C(() => {
          var a;
          return [
            S.value === "agent" ? (n(), r(V, { key: 0 }, [
              p(v).asking.value ? (n(), r(V, { key: 0 }, [
                h(ge, { "data-agent-stop-ask": "" }, {
                  default: C(() => [...t[17] || (t[17] = [
                    m("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                h(de, {
                  "data-agent-stop-confirm": "",
                  onClick: t[10] || (t[10] = (s) => (E(), p(v).stop()))
                }, {
                  default: C(() => [...t[18] || (t[18] = [
                    m("Stop it", -1)
                  ])]),
                  _: 1
                }),
                h(de, {
                  onClick: t[11] || (t[11] = (s) => p(v).asking.value = !1)
                }, {
                  default: C(() => [...t[19] || (t[19] = [
                    m("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (n(), D(de, {
                key: 1,
                "data-agent-stop": "",
                onClick: t[12] || (t[12] = (s) => p(v).asking.value = !0)
              }, {
                default: C(() => [...t[20] || (t[20] = [
                  m("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : S.value === "start" ? (n(), r(V, { key: 1 }, [
              h(ge, null, {
                default: C(() => [...t[21] || (t[21] = [
                  m("Start an agent", -1)
                ])]),
                _: 1
              }),
              (n(!0), r(V, null, G(p(v).programs.value, (s) => (n(), D(de, {
                key: s.name,
                "data-agent-program": s.name,
                onClick: (j) => (E(), p(v).start(s))
              }, {
                default: C(() => [
                  m(c(s.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : S.value === "skills" ? (n(), D(St, {
              key: 2,
              skills: w.value,
              onBrowse: t[13] || (t[13] = (s) => (E(), l("open", "skills", null)))
            }, null, 8, ["skills"])) : k.value ? (n(), r(V, { key: 3 }, [
              h(ge, null, {
                default: C(() => [
                  m(c(k.value.label), 1)
                ]),
                _: 1
              }),
              S.value === "context" ? (n(), r(V, { key: 0 }, [
                g("div", Kt, [
                  g("span", Zt, [
                    g("span", {
                      style: oe({ width: `${P.value}%` })
                    }, null, 4)
                  ]),
                  g("span", Gt, c(P.value) + "%", 1)
                ]),
                g("p", Yt, c(p(Bt)(((a = z.value) == null ? void 0 : a.last_compaction) ?? null)), 1)
              ], 64)) : f("", !0),
              (n(!0), r(V, null, G(k.value.choices, (s) => (n(), D(de, {
                key: s.value,
                "data-agent-choice": s.value,
                onClick: (j) => (p(v).choose(k.value.key, s), E())
              }, {
                default: C(() => [
                  m(c(s.label), 1)
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
}, ea = /* @__PURE__ */ K(Xt, [["__scopeId", "data-v-d5933ce4"]]), ta = {
  class: "agent-command",
  "data-agent-command": ""
}, aa = {
  key: 1,
  "data-agent-stopped": ""
}, na = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (i, o) => (n(), r("span", ta, [
      e.waitReason ? (n(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = X((l) => p(we)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + c(e.waitReason) + " ", 1),
        h(p(Me), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), r("span", aa, "Waiting")) : (n(), D(p(at), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, la = /* @__PURE__ */ K(na, [["__scopeId", "data-v-bb905922"]]), sa = ["data-agent-delegated", "onClick"], oa = { class: "agent-task-number" }, ia = { class: "agent-task-title" }, ra = ["title"], ua = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const o = i;
    return (l, v) => (n(), D(p(Be), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: v[0] || (v[0] = (b) => o("toggle"))
    }, {
      default: C(() => [
        (n(!0), r(V, null, G(e.section.tasks, (b) => (n(), r("button", {
          key: b.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": b.id,
          onClick: (S) => p(we)(`tasks:${b.id}`)
        }, [
          h(p(nt), {
            status: b.state
          }, null, 8, ["status"]),
          g("span", oa, c(b.id), 1),
          g("span", ia, c(b.title), 1),
          b.plan_id ? (n(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${b.plan_id}: ${b.plan_title}`
          }, "Plan " + c(b.plan_id) + ": " + c(b.plan_title), 9, ra)) : f("", !0)
        ], 8, sa))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, da = /* @__PURE__ */ K(ua, [["__scopeId", "data-v-acc154a9"]]), ca = { class: "action-field" }, ga = ["value", "disabled"], va = ["value"], pa = { key: 1 }, ma = {
  key: 1,
  class: "action-field"
}, ha = { class: "action-buttons" }, fa = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (i, o) => (n(), r("form", {
      onSubmit: o[4] || (o[4] = X((l) => i.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), r(V, { key: 0 }, [
        g("label", ca, [
          o[6] || (o[6] = m("Task ", -1)),
          g("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (l) => i.$emit("update:task", l.target.value))
          }, [
            o[5] || (o[5] = g("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), r(V, null, G(e.tasks, (l) => (n(), r("option", {
              key: l.id,
              value: String(l.id)
            }, c(l.id) + ": " + c(l.title), 9, va))), 128))
          ], 40, ga)
        ]),
        e.moreTasks ? (n(), D(p(Q), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (l) => i.$emit("more"))
        }, {
          default: C(() => [...o[7] || (o[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), r("p", pa, "No open tasks.")) : f("", !0)
      ], 64)) : (n(), r("label", ma, [
        o[8] || (o[8] = m("Job", -1)),
        h(p(Ie), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (l) => i.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      g("div", ha, [
        h(p(Q), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: C(() => [...o[9] || (o[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(p(Q), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (l) => i.$emit("cancel"))
        }, {
          default: C(() => [...o[10] || (o[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ka = /* @__PURE__ */ K(fa, [["__scopeId", "data-v-356a2712"]]), ya = { class: "action-field" }, ba = { class: "action-buttons" }, wa = {
  __name: "AgentMessageForm",
  props: { text: String, pending: Boolean },
  emits: ["submit", "cancel", "update:text"],
  setup(e) {
    return (i, o) => (n(), r("form", {
      onSubmit: o[2] || (o[2] = X((l) => i.$emit("submit"), ["prevent"]))
    }, [
      g("label", ya, [
        o[3] || (o[3] = m("Message", -1)),
        h(p(Ie), {
          value: e.text,
          disabled: e.pending,
          "data-agent-message-text": "",
          onInput: o[0] || (o[0] = (l) => i.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ]),
      g("div", ba, [
        h(p(Q), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.text.trim(),
          "data-agent-submit-message": ""
        }, {
          default: C(() => [...o[4] || (o[4] = [
            m("Send the message", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(p(Q), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (l) => i.$emit("cancel"))
        }, {
          default: C(() => [...o[5] || (o[5] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ma = /* @__PURE__ */ K(wa, [["__scopeId", "data-v-a6a1f785"]]), $a = { class: "action-buttons" }, xa = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (i, o) => (n(), r("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = X((l) => i.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = g("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      h(p(je), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (l) => i.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      g("div", $a, [
        h(p(Q), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: C(() => [...o[3] || (o[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(p(Q), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (l) => i.$emit("cancel"))
        }, {
          default: C(() => [...o[4] || (o[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ca = /* @__PURE__ */ K(xa, [["__scopeId", "data-v-bbe4e841"]]), Sa = { class: "action-buttons" }, Aa = {
  key: 0,
  role: "alert"
}, ja = {
  key: 1,
  role: "status"
}, Ra = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const i = e, o = xe(), l = x(""), v = x(""), b = x(""), S = x(""), k = x([]), M = x(0), E = x(!1), w = x(!1), T = x(!1), L = x(""), B = x(""), I = y(() => !!i.row.retired_at || i.row.state === "retired"), H = y(() => !I.value && !!i.row.ended_at), N = y(() => {
      var a;
      return H.value && ((a = i.row.job_command) == null ? void 0 : a.length) && !i.row.resume_reason;
    }), z = y(() => N.value && !w.value && (i.row.job_task_flag ? k.value.some((a) => String(a.id) === S.value) : !!v.value.trim()));
    function W(a) {
      l.value = a, v.value = "", b.value = "", S.value = "", L.value = "", B.value = "";
    }
    async function q() {
      W("job"), i.row.job_task_flag && (k.value = [], M.value = 0, E.value = !1, await P());
    }
    async function P() {
      if (!w.value) {
        w.value = !0;
        try {
          const a = await o.read(`task list --state open --limit 100 --page ${M.value + 1}`);
          L.value = a.ok ? "" : a.error, a.ok && (k.value = [...k.value, ...a.value.rows], M.value = a.value.page, E.value = a.value.page * a.value.size < a.value.total);
        } finally {
          w.value = !1;
        }
      }
    }
    async function U(a, s) {
      if (!T.value) {
        T.value = !0, L.value = "";
        try {
          const j = await o.run(a);
          L.value = j.ok ? "" : j.error, j.ok && (W(""), B.value = s);
        } finally {
          T.value = !1;
        }
      }
    }
    async function J() {
      if (!z.value) return;
      const a = i.row.job_task_flag ? [i.row.job_task_flag, S.value] : [v.value.trim()];
      await U([...i.row.job_command, String(i.row.id), ...a], "Job sent.");
    }
    async function u() {
      I.value || H.value || !v.value.trim() || await U(["message", "send", v.value.trim(), "--target-agent", String(i.row.id)], "Message sent.");
    }
    async function t() {
      !H.value || l.value !== "retire" || !b.value.trim() || await U(["agent", "retire", String(i.row.id), "--reason", b.value.trim()], "Agent retired permanently.");
    }
    return (a, s) => {
      var j;
      return I.value ? f("", !0) : (n(), r("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: s[9] || (s[9] = X(() => {
        }, ["stop"])),
        onKeydown: s[10] || (s[10] = X(() => {
        }, ["stop"]))
      }, [
        g("div", Sa, [
          H.value ? (n(), r(V, { key: 0 }, [
            (j = e.row.job_command) != null && j.length ? (n(), D(p(Q), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: T.value || w.value || !N.value,
              onClick: q
            }, {
              default: C(() => [...s[11] || (s[11] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (n(), D(p(Q), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: T.value || w.value,
              onClick: s[0] || (s[0] = (d) => W("retire"))
            }, {
              default: C(() => [...s[12] || (s[12] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : (n(), D(p(Q), {
            key: 1,
            small: "",
            "data-agent-send-message": "",
            disabled: T.value,
            onClick: s[1] || (s[1] = (d) => W("message"))
          }, {
            default: C(() => [...s[13] || (s[13] = [
              m("Send a message", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        h(p(Ee), { value: l.value }, {
          job: C(() => [
            h(ka, {
              task: S.value,
              "onUpdate:task": s[2] || (s[2] = (d) => S.value = d),
              text: v.value,
              "onUpdate:text": s[3] || (s[3] = (d) => v.value = d),
              row: e.row,
              tasks: k.value,
              pending: T.value,
              loading: w.value,
              "more-tasks": E.value,
              failure: L.value,
              "job-ready": z.value,
              onSubmit: J,
              onMore: P,
              onCancel: s[4] || (s[4] = (d) => W(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          message: C(() => [
            h(Ma, {
              text: v.value,
              "onUpdate:text": s[5] || (s[5] = (d) => v.value = d),
              pending: T.value,
              onSubmit: u,
              onCancel: s[6] || (s[6] = (d) => W(""))
            }, null, 8, ["text", "pending"])
          ]),
          retire: C(() => [
            h(Ca, {
              reason: b.value,
              "onUpdate:reason": s[7] || (s[7] = (d) => b.value = d),
              pending: T.value,
              onSubmit: t,
              onCancel: s[8] || (s[8] = (d) => W(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        L.value ? (n(), r("p", Aa, c(L.value), 1)) : f("", !0),
        B.value ? (n(), r("p", ja, c(B.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, Ta = /* @__PURE__ */ K(Ra, [["__scopeId", "data-v-b34af637"]]), za = {
  key: 0,
  class: "agent-summary",
  "data-agent-report": ""
}, Oa = {
  key: 1,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ha = {
  key: 2,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Va = {
  key: 3,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, La = {
  key: 5,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Ba = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ia = {
  key: 0,
  class: "agent-helper-brief"
}, Ea = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Na = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Wa = "It ended without a report", qa = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean, totalCount: Number, tasksPerHour: String },
  setup(e) {
    const i = e, o = ["started", "blocked", "open", "completed"], l = y(() => {
      var t;
      return ((t = i.facts) == null ? void 0 : t.job_returned) || i.row.job_returned || "";
    }), v = y(() => {
      var t, a;
      return i.row.ended_at && ((a = (t = i.facts) == null ? void 0 : t.job_returned) != null && a.startsWith(Wa)) ? i.facts.job_returned : "";
    }), b = y(() => i.tasks.length ? o.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: i.tasks.filter((a) => a.state === t || t === "started" && a.state === "testing" || t === "completed" && a.state === "cancelled") })) : []), S = /* @__PURE__ */ new Set(["completed"]), k = x({}), M = (t) => !(k.value[t] ?? S.has(t)), E = (t) => k.value = { ...k.value, [t]: M(t) }, w = xe(), T = y(() => i.row.access === "read-only"), L = y(() => !!i.row.retired_at || i.row.state === "retired"), B = y(() => L.value ? w.tabs.filter((t) => t.key === "transcript") : T.value ? w.tabs.filter((t) => ["transcript", "terminal"].includes(t.key)) : w.tabs), I = x(B.value[0]);
    le(B, (t) => {
      t.some((a) => {
        var s;
        return a.key === ((s = I.value) == null ? void 0 : s.key);
      }) || (I.value = t[0]);
    }), le(() => i.open, (t) => {
      t && (I.value = B.value[0]);
    });
    const H = Object.fromEntries(w.tabs.filter((t) => t.component).map((t) => [t.key, Ye(() => lt(t.component))])), N = y(() => i.row.role === "helper" && !i.row.ended_at), z = () => w.run(["helper", "stop", String(i.row.id)]), W = x(!1), q = x(""), P = x(""), U = y(() => i.row.role !== "main" && (!i.row.ended_at || i.stoppedWithWork || i.waitReason));
    async function J() {
      if (!i.open || !U.value) return;
      const t = await w.read(`usage tool --agent ${i.row.id}`, { deferred: !0 });
      i.open && (q.value = t.ok ? t.value.tool : "", P.value = t.ok ? t.value.note : "");
    }
    const u = w.follow(["hook_call.*", "process_part.*"], Ne(J, We.agentCommand));
    return $e(() => u == null ? void 0 : u()), le(() => i.open, (t) => {
      t && J();
    }, { immediate: !0 }), (t, a) => {
      var s, j;
      return n(), r("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: a[2] || (a[2] = X(() => {
        }, ["stop"]))
      }, [
        l.value ? (n(), r("p", za, "Last report: " + c(l.value), 1)) : f("", !0),
        e.row.retirement_reason ? (n(), r("p", Oa, "Retirement reason: " + c(e.row.retirement_reason), 1)) : f("", !0),
        e.row.resume_reason ? (n(), r("p", Ha, c(e.row.resume_reason), 1)) : f("", !0),
        h(Ta, { row: e.row }, null, 8, ["row"]),
        e.totalCount && e.tasksPerHour ? (n(), r("span", Va, c(e.tasksPerHour), 1)) : f("", !0),
        h(ea, {
          agent: e.row,
          branch: (s = e.progress) == null ? void 0 : s.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: C(() => [
            N.value ? (n(), D(p(Q), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: z
            }, {
              default: C(() => [...a[3] || (a[3] = [
                m("Stop", -1)
              ])]),
              _: 1
            })) : f("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"]),
        U.value ? (n(), D(la, {
          key: 4,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: q.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        v.value ? (n(), r("p", La, c(v.value), 1)) : f("", !0),
        h(p(st), {
          class: "agent-tabs",
          tabs: B.value,
          active: I.value,
          answer: { tasks: e.tasks.length },
          onChoose: a[0] || (a[0] = (d) => I.value = d)
        }, null, 8, ["tabs", "active", "answer"]),
        h(p(ot), {
          class: "agent-tab-body",
          tab: I.value,
          "data-agent-tab-body": (j = I.value) == null ? void 0 : j.key
        }, {
          default: C(() => {
            var d;
            return [
              h(p(Ee), {
                value: (d = I.value) == null ? void 0 : d.key
              }, Qe({
                tasks: C(() => {
                  var A;
                  return [
                    e.tasks.length ? f("", !0) : (n(), D(p(qe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: C(() => [...a[4] || (a[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), r(V, null, G(b.value, (F) => (n(), D(da, {
                      key: F.state,
                      section: F,
                      open: M(F.state),
                      onToggle: (Y) => E(F.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (A = e.facts) != null && A.instruction ? (n(), r(V, { key: 1 }, [
                      a[5] || (a[5] = g("p", { class: "agent-label" }, "Instruction", -1)),
                      g("div", Ba, c(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: C(() => {
                  var A;
                  return [
                    T.value ? (n(), r(V, { key: 0 }, [
                      (A = e.facts) != null && A.instruction ? (n(), r("div", Ia, [
                        h(p(Be), {
                          label: "Instruction",
                          open: W.value,
                          "data-agent-section": "instruction",
                          onToggle: a[1] || (a[1] = (F) => W.value = !W.value)
                        }, {
                          default: C(() => [
                            g("div", Ea, c(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), r("p", Na, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    h(mt, {
                      line: `agent transcript ${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["line"])
                  ];
                }),
                _: 2
              }, [
                G(p(H), (A, F) => ({
                  name: F,
                  fn: C(() => [
                    (n(), D(Xe(A), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"])
      ]);
    };
  }
}, Fa = /* @__PURE__ */ K(qa, [["__scopeId", "data-v-cf216a4f"]]), Da = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Pa = { class: "agent-head" }, _a = ["data-state"], Ua = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Ja = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ka = { class: "agent-times" }, Za = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Ga = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Ya = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Qa = {
  key: 3,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Xa = { class: "agent-line" }, en = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, tn = {
  key: 0,
  class: "agent-session",
  "data-agent-session": ""
}, an = {
  key: 1,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, nn = {
  key: 0,
  class: "agent-line agent-work-start"
}, ln = ["data-peek"], sn = ["title"], on = ["data-peek"], rn = ["data-agent-waiting", "data-agent-stopped"], un = {
  key: 1,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, dn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const o = { helper: "Helper", reviewer: "Reviewer" }, l = e, v = i, b = it(), S = y(() => {
      var t, a;
      if ((t = l.facts) != null && t.profile_title) return l.facts.profile_title;
      if ((a = l.facts) != null && a.profile) return l.facts.profile;
      const u = o[l.row.role] || l.row.role;
      return u.slice(0, 1).toUpperCase() + u.slice(1);
    }), k = y(() => {
      var u;
      return ((u = l.facts) == null ? void 0 : u.tasks) ?? [];
    }), M = y(() => k.value.filter((u) => u.state === "open")), E = y(() => {
      const u = k.value.find((t) => {
        var a;
        return t.id === ((a = l.facts) == null ? void 0 : a.task_id);
      });
      return u != null && u.plan_id ? u : M.value.find((t) => t.plan_id);
    }), w = y(() => {
      var u, t, a, s, j;
      return l.row.role === "helper" ? ((u = l.facts) == null ? void 0 : u.helper_job) || "" : (t = l.facts) != null && t.job_enabled && (((a = l.facts) == null ? void 0 : a.task_title) || ((s = M.value[0]) == null ? void 0 : s.title) || ((j = k.value.at(-1)) == null ? void 0 : j.title)) || "";
    }), T = y(() => {
      const u = w.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return u ? `${u[1].toLowerCase() === "plan" ? "plans" : "docs"}:${u[2]}` : "";
    }), L = y(() => {
      var u, t;
      return [l.row.program, (u = l.facts) == null ? void 0 : u.model, (t = l.facts) == null ? void 0 : t.effort].filter(Boolean).join(" · ");
    }), B = y(() => rt(l.row.process_started_at || l.row.created_at, b.value)), I = /* @__PURE__ */ new Set(["open", "started", "testing"]), H = y(() => !!l.row.ended_at && l.row.role !== "main" && k.value.some((u) => I.has(u.state))), N = y(() => {
      var u;
      return l.row.retired_at || l.row.state === "retired" ? "retired" : l.waitReason || H.value ? "waiting" : l.row.state === "running" && ((u = l.facts) == null ? void 0 : u.state) || l.row.state;
    }), z = y(() => l.waitReason ? `Waiting: ${l.waitReason}` : N.value === "blocked" ? "Blocked" : H.value ? "Stopped with work left" : ""), W = y(() => {
      var u;
      return ((u = l.progress) == null ? void 0 : u.completed_count) ?? k.value.filter((t) => t.state === "completed").length;
    }), q = y(() => {
      var u;
      return ((u = l.progress) == null ? void 0 : u.task_count) ?? k.value.length;
    }), P = y(() => `${W.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), U = y(() => {
      var t;
      const u = ut(W.value, ((t = l.progress) == null ? void 0 : t.started_at) || l.row.created_at, l.progress ? l.progress.finished_at : l.row.ended_at, b.value);
      return l.row.role !== "main" && u ? `${u} per hour` : "";
    }), J = y(() => !!l.row.retired_at || l.row.state === "retired");
    return (u, t) => {
      var a, s;
      return n(), r("div", {
        class: ee(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        title: L.value,
        onClick: t[3] || (t[3] = (j) => !e.open && v("toggle")),
        onKeydown: [
          t[4] || (t[4] = ze(X((j) => !e.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          t[5] || (t[5] = ze(X((j) => !e.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        g("span", Pa, [
          e.open ? (n(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = X((j) => v("toggle"), ["stop"]))
          }, [
            h(p(Me), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : f("", !0),
          g("span", {
            class: "agent-dot",
            "data-state": N.value,
            "data-agent-motion": ""
          }, null, 8, _a),
          g("span", Ua, c(S.value), 1),
          g("span", Ja, c(((a = e.facts) == null ? void 0 : a.given_name) || e.row.id), 1),
          e.open ? f("", !0) : (n(), D(p(Me), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          g("span", Ka, [
            J.value ? (n(), r("span", Za, [
              t[6] || (t[6] = m("Retired, ", -1)),
              h(p(Se), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (n(), r("span", Ga, [
              t[7] || (t[7] = m("Idle, ", -1)),
              h(p(Se), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (n(), r("span", Ya, c(B.value), 1)),
            e.open && ((s = e.facts) != null && s.last_activity) ? (n(), r("span", Qa, [
              t[8] || (t[8] = m("Last heard: ", -1)),
              h(p(Se), {
                at: e.facts.last_activity
              }, null, 8, ["at"])
            ])) : f("", !0)
          ])
        ]),
        g("span", Xa, [
          g("span", en, c(L.value), 1),
          e.open ? (n(), r("span", tn, "Session: " + c(e.row.session), 1)) : f("", !0),
          e.open && q.value && !w.value ? (n(), r("span", an, c(P.value), 1)) : f("", !0)
        ]),
        e.open && E.value ? (n(), r("span", nn, [
          g("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${E.value.plan_id}`,
            onClick: t[1] || (t[1] = X((j) => p(we)(`plans:${E.value.plan_id}`), ["stop"]))
          }, "Plan " + c(E.value.plan_id) + ": " + c(E.value.plan_title), 9, ln)
        ])) : f("", !0),
        w.value || !e.open && z.value ? (n(), r("span", {
          key: 1,
          class: ee(["agent-line", { "agent-work-start": !E.value }])
        }, [
          g("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: w.value
          }, [
            e.open && T.value ? (n(), r("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": T.value,
              onClick: t[2] || (t[2] = X((j) => p(we)(T.value), ["stop"]))
            }, c(w.value), 9, on)) : (n(), r(V, { key: 1 }, [
              m(c(w.value), 1)
            ], 64))
          ], 8, sn),
          !e.open && z.value ? (n(), r("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": H.value && !e.waitReason ? "" : null
          }, c(z.value), 9, rn)) : f("", !0),
          e.open && q.value ? (n(), r("span", un, c(P.value), 1)) : f("", !0)
        ], 2)) : f("", !0),
        e.open ? (n(), D(Fa, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: k.value,
          "stopped-with-work": H.value,
          open: e.open,
          "total-count": q.value,
          "tasks-per-hour": U.value
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open", "total-count", "tasks-per-hour"])) : f("", !0)
      ], 42, Da);
    };
  }
}, cn = /* @__PURE__ */ K(dn, [["__scopeId", "data-v-d42cf236"]]), gn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, vn = ["aria-expanded"], pn = { key: 0 }, mn = { key: 1 }, hn = { class: "limits-panel" }, fn = { class: "limits-head" }, kn = ["data-agent-limit-type", "data-agent-limit-profile"], yn = { class: "count" }, bn = { class: "bar" }, wn = { class: "count" }, Mn = { class: "bar" }, $n = ["data-agent-limit-type"], xn = { class: "limit-field" }, Cn = { class: "limit-field" }, Sn = {
  key: 1,
  role: "alert"
}, An = {
  key: 2,
  role: "status"
}, jn = {
  __name: "AgentLimits",
  setup(e) {
    const i = xe(), o = x([]), l = x({}), v = x(!1), b = x(!1), S = x(!1), k = x(""), M = x(""), E = (t) => t === 0 ? "no limit" : String(t), w = (t, a) => a === 0 ? 0 : t > a ? 2 : t === a ? 1 : 0, T = y(() => o.value.flatMap((t) => t.per_profile && t.profiles.length ? t.profiles.map((a) => ({ ...a, label: a.title, type: t.key, key: `${t.key}:${a.profile}` })) : [t])), L = (t) => Math.max(w(t.running, t.run_limit), w(t.kept, t.kept_limit)), B = y(() => T.value.filter((t) => L(t)).sort((t, a) => L(a) - L(t))), I = y(() => o.value.reduce((t, a) => t + a.running, 0)), H = y(() => o.value.reduce((t, a) => t + a.kept, 0)), N = (t) => {
      const a = [t.run_limit ? t.running - t.run_limit : -1, t.kept_limit ? t.kept - t.kept_limit : -1], s = Math.max(...a);
      return s > 0 ? `Over by ${s}` : s === 0 ? "At limit" : "Within limits";
    }, z = (t, a) => a ? `${Math.min(t / Math.max(t, a) * 100, 100)}%` : "0%", W = (t, a) => a && t > a ? `${(t - a) / t * 100}%` : "0%";
    let q = 0;
    async function P() {
      const t = ++q, a = await i.read("agent limits");
      t === q && (o.value = a.ok ? a.value.rows : [], k.value = a.ok ? "" : a.error);
    }
    async function U(t) {
      const a = await Promise.all(o.value.flatMap((s) => [s.run_setting, s.kept_setting]).map(async (s) => {
        const j = await i.read(`setting show ${s}`);
        return [s, j.ok ? j.value.source : ""];
      }));
      t === q && (l.value = Object.fromEntries(a));
    }
    async function J() {
      b.value = !b.value, b.value && await U(q);
    }
    async function u(t, a, s, j) {
      if (S.value || i.readOnly) return;
      const d = Number(j.target.value);
      if (!Number.isInteger(d) || d < 0 || !j.target.value.trim()) {
        k.value = "Use a whole number of 0 or more.", j.target.value = String(s);
        return;
      }
      S.value = !0, M.value = "";
      try {
        const A = await i.run(["setting", "set", a, String(d), "--environment", i.environment]);
        if (k.value = A.ok ? "" : A.error, !A.ok) {
          j.target.value = String(s);
          return;
        }
        await P(), M.value = `${t.label} limits saved.`;
      } finally {
        S.value = !1;
      }
    }
    return i.follow(["agent.*", "setting.*"], P), P(), (t, a) => (n(), r("section", gn, [
      o.value.length ? (n(), r(V, { key: 0 }, [
        g("button", {
          class: "summary",
          type: "button",
          "aria-expanded": v.value,
          onClick: a[0] || (a[0] = (s) => v.value = !v.value)
        }, [
          B.value.length ? (n(), r(V, { key: 0 }, [
            (n(!0), r(V, null, G(B.value.slice(0, 2), (s) => (n(), r("span", {
              key: s.key,
              class: "summary-item"
            }, [
              g("span", {
                class: ee(["mark", { over: L(s) === 2 }])
              }, null, 2),
              m(c(s.label) + ": " + c(N(s)), 1)
            ]))), 128)),
            B.value.length > 2 ? (n(), r("span", pn, c(B.value.length - 2) + " more", 1)) : f("", !0)
          ], 64)) : (n(), r("span", mn, "All within limits, " + c(I.value) + " running, " + c(H.value) + " kept", 1)),
          h(p(Me), {
            name: "caret",
            size: 12
          })
        ], 8, vn),
        et(g("div", hn, [
          g("div", fn, [
            a[1] || (a[1] = g("strong", null, "Agent limits", -1)),
            h(p(Q), {
              small: "",
              disabled: S.value || p(i).readOnly,
              "data-agent-limits-edit": "",
              onClick: J
            }, {
              default: C(() => [
                m(c(b.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          b.value ? (n(), r(V, { key: 1 }, [
            (n(!0), r(V, null, G(o.value, (s) => (n(), r("div", {
              key: s.key,
              class: "edit-row",
              "data-agent-limit-type": s.key
            }, [
              g("strong", null, c(s.label), 1),
              g("label", xn, [
                g("span", null, [
                  a[3] || (a[3] = m("Running", -1)),
                  s.per_profile ? (n(), r(V, { key: 0 }, [
                    m(" per profile")
                  ], 64)) : f("", !0)
                ]),
                h(p(je), {
                  type: "number",
                  min: "0",
                  value: String(s.run_limit),
                  disabled: S.value || p(i).readOnly,
                  "data-agent-run-limit": s.key,
                  onChange: (j) => u(s, s.run_setting, s.run_limit, j)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                g("small", null, c(l.value[s.run_setting]), 1)
              ]),
              g("label", Cn, [
                g("span", null, [
                  a[4] || (a[4] = m("Kept", -1)),
                  s.per_profile ? (n(), r(V, { key: 0 }, [
                    m(" per profile")
                  ], 64)) : f("", !0)
                ]),
                h(p(je), {
                  type: "number",
                  min: "0",
                  value: String(s.kept_limit),
                  disabled: S.value || p(i).readOnly,
                  "data-agent-kept-limit": s.key,
                  onChange: (j) => u(s, s.kept_setting, s.kept_limit, j)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                g("small", null, c(l.value[s.kept_setting]), 1)
              ])
            ], 8, $n))), 128)),
            g("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + c(p(i).environment) + ".", 1)
          ], 64)) : (n(), r(V, { key: 0 }, [
            a[2] || (a[2] = g("div", { class: "table-head" }, [
              g("span", null, "Agent"),
              g("span", null, "Running"),
              g("span", null, "Kept"),
              g("span", null, "Status")
            ], -1)),
            (n(!0), r(V, null, G(T.value, (s) => (n(), r("div", {
              key: s.key,
              class: "limit-row",
              "data-agent-limit-type": s.type || s.key,
              "data-agent-limit-profile": s.profile
            }, [
              g("strong", null, c(s.label), 1),
              g("div", yn, [
                g("span", null, c(s.run_limit ? `${s.running} of ${s.run_limit}` : `${s.running} · none may start`), 1),
                g("div", bn, [
                  g("span", {
                    style: oe({ width: z(s.running, s.run_limit) })
                  }, null, 4),
                  g("i", {
                    style: oe({ width: W(s.running, s.run_limit) })
                  }, null, 4)
                ])
              ]),
              g("div", wn, [
                g("span", null, c(s.kept) + " of " + c(E(s.kept_limit)), 1),
                g("div", Mn, [
                  g("span", {
                    style: oe({ width: z(s.kept, s.kept_limit) })
                  }, null, 4),
                  g("i", {
                    style: oe({ width: W(s.kept, s.kept_limit) })
                  }, null, 4)
                ])
              ]),
              g("span", {
                class: ee(["status", { warning: L(s) === 1, danger: L(s) === 2 }])
              }, c(N(s)), 3)
            ], 8, kn))), 128))
          ], 64))
        ], 512), [
          [tt, v.value]
        ])
      ], 64)) : f("", !0),
      k.value ? (n(), r("p", Sn, c(k.value), 1)) : f("", !0),
      M.value ? (n(), r("p", An, c(M.value), 1)) : f("", !0)
    ]));
  }
}, Rn = /* @__PURE__ */ K(jn, [["__scopeId", "data-v-d42b4bd2"]]), Tn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, zn = ["data-agent-row"], Ve = "journal.agents.filters", be = "cubic-bezier(0.2, 0.9, 0.25, 1)", On = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const i = e, { rows: o } = dt("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: l } = He("waits"), { rows: v } = He("progress"), b = (R) => v.value.find((O) => O.agent_id === R.id) ?? null, S = (R) => {
      var O;
      return ((O = l.value.find(($) => $.agent_id === R.id)) == null ? void 0 : O.reason) ?? "";
    }, k = x("running"), M = x(""), E = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), w = x(E), T = x({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), L = x([]), B = y(() => w.value.roles.length + w.value.profiles.length + w.value.programs.length), I = (R, O) => {
      w.value = pt(w.value, R, O);
    }, H = () => {
      w.value = { roles: [], profiles: [], programs: [] };
    }, N = (R) => R.slice(0, 1).toUpperCase() + R.slice(1);
    le(w, (R) => localStorage.setItem(Ve, JSON.stringify(R)));
    const z = xe();
    async function W() {
      const [R, O] = await Promise.all([z.read("agent cards --options"), z.read("agent programs")]);
      R.ok && (T.value = R.value), O.ok && (L.value = O.value.rows);
    }
    z.follow(["agent.*"], W), W();
    const q = x([]), P = x(""), U = x(!1), J = x(!1), u = x(25);
    let t = 0;
    async function a() {
      const R = ++t, O = [
        ...w.value.roles.map((_) => `--role ${JSON.stringify(_)}`),
        ...w.value.profiles.map((_) => `--profile ${JSON.stringify(_)}`),
        ...w.value.programs.map((_) => `--program ${JSON.stringify(_)}`)
      ].join(" "), $ = await z.read(`${i.line} --show ${k.value} --search ${JSON.stringify(M.value)} --limit ${u.value} ${O}`);
      R === t && (q.value = $.ok ? $.value.rows : [], P.value = $.ok ? "" : $.error, J.value = $.ok && $.value.page * $.value.size < $.value.total, U.value = !0);
    }
    async function s() {
      return u.value += 25, await a(), !0;
    }
    le([k, M, w], () => {
      u.value = 25, a();
    }), z.follow(["agent.*", "task.*", ...z.sources.flatMap((R) => R.events)], Ne(a, We.pageOfAgents)), a();
    const j = (R) => o.value.find((O) => O.id === R.id) ?? R.facts ?? null, d = q, A = y(() => !!M.value.trim() || B.value > 0), F = y(() => i.texts[k.value] ?? { title: i.empty, hint: "" }), Y = x(null), ae = x(null), ce = x(null), ne = y(() => d.value.find((R) => R.id === Y.value) ?? null), pe = y(() => ne.value ? [ne.value] : d.value), me = y(() => d.value.length - pe.value.length), he = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ie = !1, Re = 0;
    async function Pe(R) {
      if (ie) return;
      ie = !0, Re = ce.value.scrollTop;
      const O = ae.value.querySelector(`[data-agent-open="${R.id}"]`);
      if (!he()) {
        const se = [...ae.value.querySelectorAll(".agent-row")].filter((te) => !te.contains(O));
        await Promise.all(se.map((te) => te.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const $ = [...O.querySelectorAll(".agent-head, .agent-line")], _ = [...$, ...O.querySelectorAll("[data-agent-motion]")], fe = _.map((se) => se.getBoundingClientRect());
      if (Y.value = R.id, await Oe(), !he()) {
        const se = _.map((te) => te.getBoundingClientRect());
        _.forEach((te, ke) => {
          const re = $.indexOf(te.parentElement), Ue = fe[ke].left - se[ke].left - (re < 0 ? 0 : fe[re].left - se[re].left), Je = fe[ke].top - se[ke].top - (re < 0 ? 0 : fe[re].top - se[re].top);
          te.animate([{ transform: `translate(${Ue}px, ${Je}px)` }, { transform: "none" }], { duration: 280, easing: be });
        }), ae.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((te) => {
          te.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: be, fill: "backwards" });
        });
      }
      ie = !1;
    }
    async function Ce() {
      if (ie || !ne.value) return;
      ie = !0;
      const R = ae.value.querySelector(`[data-agent-open="${Y.value}"]`), O = [...R.children, ...ae.value.querySelectorAll(".agents-held")], $ = he() ? [] : O.map((_) => _.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all($.map((_) => _.finished)), Y.value = null, await Oe(), ce.value.scrollTop = Re, $.forEach((_) => _.cancel()), he() || (R.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: be }), ae.value.querySelectorAll(".agent-row").forEach((_) => {
        _.contains(R) || _.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: be });
      })), ie = !1;
    }
    const _e = (R) => Y.value === R.id ? Ce() : Pe(R);
    le(M, (R) => R.trim() && (Y.value = null)), le(k, () => {
      Y.value = null;
    });
    const Te = (R) => {
      R.key === "Escape" && Ce();
    };
    return window.addEventListener("keydown", Te), $e(() => window.removeEventListener("keydown", Te)), (R, O) => (n(), r("div", {
      ref_key: "agents",
      ref: ae,
      class: ee(["agents", { focused: ne.value }])
    }, [
      h(Rn),
      h(p(ct), {
        modelValue: M.value,
        "onUpdate:modelValue": O[1] || (O[1] = ($) => M.value = $),
        placeholder: "Search agents",
        "menu-count": B.value,
        "data-agents-search": ""
      }, {
        menu: C(() => [
          h(p(Ae), null, {
            default: C(() => [...O[2] || (O[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), r(V, null, G(T.value.roles, ($) => (n(), D(p(ye), {
            key: $,
            role: "menuitemcheckbox",
            "aria-checked": w.value.roles.includes($),
            checked: w.value.roles.includes($),
            "data-filter-role": $,
            onClick: (_) => I("roles", $)
          }, {
            default: C(() => [
              m(c(N($)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          T.value.profiles.length ? (n(), D(p(Ae), { key: 0 }, {
            default: C(() => [...O[3] || (O[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (n(!0), r(V, null, G(T.value.profiles, ($) => (n(), D(p(ye), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": w.value.profiles.includes($.name),
            checked: w.value.profiles.includes($.name),
            "data-filter-profile": $.name,
            onClick: (_) => I("profiles", $.name)
          }, {
            default: C(() => [
              m(c($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          h(p(Ae), null, {
            default: C(() => [...O[4] || (O[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), r(V, null, G(L.value, ($) => (n(), D(p(ye), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": w.value.programs.includes($.name),
            checked: w.value.programs.includes($.name),
            "data-filter-program": $.name,
            onClick: (_) => I("programs", $.name)
          }, {
            default: C(() => [
              m(c($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          B.value ? (n(), D(p(ye), {
            key: 1,
            "data-filter-clear": "",
            onClick: H
          }, {
            default: C(() => [...O[5] || (O[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: C(() => [
          h(p(gt), {
            options: T.value.states,
            value: k.value,
            onPick: O[0] || (O[0] = ($) => k.value = $)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      k.value === "retired" && T.value.upgrade_retired ? (n(), r("p", Tn, "Retired during the upgrade: " + c(T.value.upgrade_retired), 1)) : f("", !0),
      g("div", {
        ref_key: "list",
        ref: ce,
        class: ee(["agents-view", { "agents-view-open": ne.value }])
      }, [
        U.value && !P.value && !pe.value.length && B.value ? (n(), D(p(qe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: C(() => [
            h(p(Q), {
              small: "",
              "data-empty-clear": "",
              onClick: H
            }, {
              default: C(() => [...O[6] || (O[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), D(p(vt), {
          key: 1,
          rows: pe.value,
          failure: P.value,
          loaded: U.value,
          more: !ne.value && J.value,
          older: s,
          empty: F.value.title,
          hint: F.value.hint,
          searching: A.value
        }, {
          default: C(({ row: $ }) => [
            g("div", {
              class: "agent-row",
              "data-agent-row": $.id
            }, [
              h(cn, {
                row: $,
                facts: j($),
                progress: b($),
                "wait-reason": S($),
                open: $.id === Y.value,
                onToggle: (_) => _e($)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, zn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      ne.value && me.value ? (n(), r("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: Ce
      }, c(me.value) + " more", 1)) : f("", !0)
    ], 2));
  }
}, Bn = /* @__PURE__ */ K(On, [["__scopeId", "data-v-c7305f3d"]]);
export {
  Bn as A
};
