import {ref} from "vue";

// Whether the active voice's 3D figure is on screen: "loading" until it is ready, "shown" once it is, "failed" when it cannot be
// drawn here, which is when the compose box shows the voice's flat figure instead
export const figureStatus = ref("loading");
