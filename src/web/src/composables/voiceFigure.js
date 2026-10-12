import {ref} from "vue";

// Whether the active voice's 3D figure is on screen: "loading" until it is ready, "shown" once it is, "failed" when it cannot be
// drawn here, which is when the compose box shows the voice's flat figure instead
export const figureStatus = ref("loading");

// How many pixels of the seated figure stand above the compose box's edge, or 0 while no figure sits there; the thread leaves that much room under its newest message
export const figureRise = ref(0);
