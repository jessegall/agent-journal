import {ref} from "vue";
import {store} from "../state/store.js";

// Whether the active voice's 3D figure is on screen: "loading" until it is ready, "shown" once it is, "failed" when it cannot be
// drawn here, which is when the compose box shows the voice's flat figure instead
export const figureStatus = ref("loading");

// whether the figure is drawn now: ready, its agent here, and the chat on screen rather than the dump window over it
export const figureVisible = (here) => figureStatus.value === "shown" && here && !store.dumping;

// the agent's states in which the figure is in the chat, as Settings sets it under the avatar: always, only while the agent is idle, or
// while it is idle or waits on the user
const SHOWN_IN = {idle: ["idle", "asleep"], waiting: ["idle", "asleep", "waiting", "asking"]};
export const shownIn = (when, state) => !SHOWN_IN[when] || SHOWN_IN[when].includes(state);

// whether the floors the figure stands on are drawn over the chat, a switch in the developer settings
export const floorsShown = () => Boolean(store.settings?.features?.figure_floors);
