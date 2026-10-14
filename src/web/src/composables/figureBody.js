import {reactive} from "vue";
import {startFloors, stopFloors} from "../figure/floors.js";

// The figure's body, one state, and the loop that steps it every frame against the floors the floors loop reads (figure/floors.js):
// - place: where it rests, or last rested while it travels, a spot on a line with the posture it takes there (places.js)
// - at: the picture's left and top in the window, kept at the place while it rests and stepped along each leg while it travels
// - trip: the trip in hand, or null: the spot it goes to with that spot's footing, and once it sets off its legs still to go (places.js
//   tripTo); `started` once it stands ready to travel, `moves` while a leg carries it, and `hopping` and `clip` for the leg it is on or
//   sets off on next
// - leg: the leg under way, and walk: where and when it set off and the floor a walk keeps to
// - footing: what it rests on (figure/floors.js footingOn), watched each frame, also while it gets ready to go; null once it sets off,
//   when the trip keeps the footing of the spot it goes to
// - airborne: the fall it is in, or null; landing: the land clip plays once after a jump or a fall, unless it goes on to hang
// - arriving, leaving, here: the voice's entrance plays when its figure appears, and its exit when the environment's agent goes
// - sliding: the picture eases to a new place as the posture changes; rested: the posture it rests in; way: the way its last trip went
// `frame` steps the body once; it runs each frame while the figure is here and the page is shown.
export function useFigureBody(frame) {
    const body = reactive({
        place: {x: 0, y: 0, posture: "stand", view: null, on: null},
        at: {x: 0, y: 0},
        trip: null,
        leg: {x: 0, y: 0, ms: 0, lead: 0, easing: "linear"},
        walk: {from: {x: 0, y: 0}, began: 0, on: null},
        footing: null,
        airborne: null,
        landing: false,
        arriving: false,
        leaving: false,
        here: false,
        sliding: false,
        rested: "stand",
        way: 0,
    });
    let looped = 0;
    const loop = () => {
        looped = requestAnimationFrame(loop);
        if (body.here && !document.hidden) frame();
    };
    function stop() {
        cancelAnimationFrame(looped);
        stopFloors();
    }
    function start() {
        stop();
        startFloors();
        looped = requestAnimationFrame(loop);
    }
    return {body, start, stop};
}
