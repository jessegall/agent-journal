import {store} from "../state/store.js";

const SKELETON = ["To do", "Held", "Doing", "Needs you", "Done"].map((title) => ({key: title, title, cards: []}));

export const laneTitle = (key) => (store.board.lanes.find((lane) => lane.key === key) || {title: key}).title;

export const named = (text) => (card) => !text.trim() || `#${card.n} ${card.title}`.toLowerCase().includes(text.trim().toLowerCase());

export const shownLanes = (meaningOf, keep) =>
    store.board.loaded
        ? store.board.lanes
              .filter((lane) => store.board.lens.done !== false || meaningOf(lane.key) !== "done")
              .map((lane) => ({...lane, cards: lane.cards.filter(keep)}))
        : SKELETON;

export const lens = (change) => (store.board.lens = {...store.board.lens, ...change});
