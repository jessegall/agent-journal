import {ref} from "vue";
import {store} from "../state/store.js";

// Whether the active voice's 3D figure is on screen: "loading" until it is ready, "shown" once it is, "failed" when it cannot be
// drawn here, which is when the compose box shows the voice's flat figure instead
export const figureStatus = ref("loading");

// whether the figure is drawn now: ready, its agent here, and the chat on screen rather than the dump window over it
export const figureVisible = (here) => figureStatus.value === "shown" && here && !store.dumping;
