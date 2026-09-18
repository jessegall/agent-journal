<script setup>
defineProps({ name: { type: String, default: "dot" }, size: { type: Number, default: 16 } });

const paths = {
  dot: "M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  home: "M2.5 7.5 8 3l5.5 4.5V13H10V9.5H6V13H2.5z",
  mail: "M2 4h12v8H2zM2 4l6 4.5L14 4",
  circle: "M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z",
  play: "M5 3v10l8-5z",
  flag: "M4 14V2.5h8L10 5.5l2 3H4",
  file: "M4 2h5l3 3v9H4zM9 2v3h3",
  report: "M3 13h10M5 11V6M8 11V3M11 11V8",
  pin: "M6 2h4v5l1.5 2H4.5L6 7zM8 9v5",
  list: "M3 4h10M3 8h10M3 12h7",
  clock: "M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5v3l2 1.5",
  help: "M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM6.3 6.3A1.8 1.8 0 1 1 8.6 8c-.5.3-.6.6-.6 1.1M8 11.3h.01",
  bubble: "M2.5 3h11v7H7l-3 2.5V10H2.5z",
  bot: "M4 6h8v6H4zM8 3v3M6 9h.5M9.5 9h.5",
  bell: "M5 11V7a3 3 0 0 1 6 0v4l1 1H4zM7 13.5h2",
  band: "M2 5h12M2 8h12M2 11h8",
  smile: "M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM6 9.5c1 1 3 1 4 0M6.3 6.5h.01M9.7 6.5h.01",
  wrench: "M9.5 2.5a3 3 0 0 0-3 4L2.5 10.5l2 2L8.5 8.5a3 3 0 0 0 4-3l-2 1-1.5-1.5z",
  brush: "M3 13c2 0 3-1 3-3l6-6-2-2-6 6c-2 0-3 1-3 3z",
  plug: "M6 2v3M10 2v3M4 5h8v3a4 4 0 0 1-8 0zM8 12v2",
  branch: "M5 3v10M5 3a2 2 0 1 0 0 .01M5 13a2 2 0 1 0 0 .01M11 5a2 2 0 1 0 0 .01M11 7c0 3-6 2-6 5",
  arrow: "M3 8h9M9 5l3 3-3 3",
  settings: "M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1 1M11.2 11.2l1 1M3.8 12.2l1-1M11.2 4.8l1-1",
  search: "M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM10.5 10.5 14 14",
  panel: "M2.5 3h11v10h-11zM9.5 3v10",
  plus: "M8 3v10M3 8h10",
  chevron: "M6 4l4 4-4 4",
  check: "M3 8.5l3 3 7-7",
  x: "M4 4l8 8M12 4l-8 8",
  clip: "M10.5 5.5 6 10a1.5 1.5 0 0 0 2 2l5-5a3 3 0 0 0-4-4L4 8",
  send: "M2.5 8l11-5-3 11-3-4.5z",
  info: "M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 7v4M8 5h.01",
  more: "M4 8h.01M8 8h.01M12 8h.01",
};
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name] || paths.dot" />
  </svg>
</template>
