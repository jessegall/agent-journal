// Every clip on one page, the five voices side by side on live canvases that share the clip's turn and frame.
import {CLIPS, GROUND, Stage, loadFigure, supportsClip} from "./figure.js";

const VOICES = ["butler", "homie", "colleague", "coach", "squire"];
const DEGREES_PER_PIXEL = 1;
const PASSAGES = new Set(["enter", "exit"]);
const PASSAGE_NOTE = "Each voice in its own manner. The band at the foot is the chat box: what is below its edge is hidden, as the chat hides it.";
const ARRIVAL_NOTE = "Arrives from the left, brakes, turns, then holds.";
// what each card's clip is for; an easter egg says the one moment it belongs to, read from the agent as the status bar reads it
const NOTES = {
    pull_ups: "Short lift on two fixed side handles, not a full overhead pull-up.",
    sit_on_edge: "Seated loop; host scene supplies the ledge.",
    walk_in: ARRIVAL_NOTE,
    run_in: ARRIVAL_NOTE,
    enter: PASSAGE_NOTE,
    exit: PASSAGE_NOTE,
    search: "Plays while the agent reads or searches files.",
    write: "Plays while the agent edits a file.",
    work: "Plays while the agent runs a command.",
    point: "Plays while it stands at a tab where something waits on you.",
    hop: "Plays as it jumps from one pane's edge to another.",
    squire_chase: "Easter egg, the squire's alone: when a check goes red he runs after a bug across the pane. The viewer draws the bug.",
    butler_tray_down: "Easter egg, the butler's alone: when a commit lands he sets the tray down and picks it straight back up.",
    pointed: "Easter egg, every voice's own: once, when you have kept it waiting three minutes.",
};

function timing(clip) {
    return `${clip.frames} frames · ${clip.fps} fps · ${clip.loops ? "loops" : "once"}`;
}

function isEmpty(canvas) {
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    return pixels.every((value, index) => index % 4 !== 3 || value === 0);
}

function card(clip, sheet) {
    const element = document.createElement("article");
    element.className = PASSAGES.has(clip.name) ? "card passage" : "card";
    const stages = VOICES.map((voice) => `
            <figure class="stage" data-voice="${voice}">
                <span class="edge"><canvas tabindex="0" aria-label="${voice}, ${clip.name}, drag to turn"></canvas></span>
                <figcaption>${voice}</figcaption>
            </figure>`).join("");
    element.innerHTML = `
        <div class="name"><h2>${clip.name}</h2><span class="timing">${timing(clip)}</span></div>
        <div class="voices">${stages}</div>
        <label class="turn" for="turn-${clip.name}">
            Turn
            <input type="range" id="turn-${clip.name}" min="0" max="359" step="1" value="0" />
            <span class="degrees">0°</span>
        </label>
        <div class="frames">
            <button type="button" class="previous" aria-label="Previous frame">Previous</button>
            <button type="button" class="next" aria-label="Next frame">Next</button>
            <output class="frame-count">1 / ${clip.frames}</output>
            <input class="frame-range" aria-label="Frame of ${clip.name}" type="range" min="0" max="${clip.frames - 1}" step="1" value="0" />
        </div>
        <p class="note"></p>`;
    sheet.append(element);
    const canvases = new Map([...element.querySelectorAll(".stage")].map((stage) => [stage.dataset.voice, stage.querySelector("canvas")]));
    const entry = {clip, element, canvases, slider: element.querySelector(".turn input"), shown: new Map(), empty: new Map()};
    entry.manual = null;
    entry.current = 0;
    entry.frameRange = element.querySelector(".frame-range");
    entry.frameCount = element.querySelector(".frame-count");
    entry.note = element.querySelector(".note");
    entry.selectFrame = (frame) => {
        entry.manual = Math.max(0, Math.min(clip.frames - 1, frame));
    };
    entry.frameRange.addEventListener("input", () => entry.selectFrame(Number(entry.frameRange.value)));
    element.querySelector(".previous").addEventListener("click", () => entry.selectFrame(entry.current - 1));
    element.querySelector(".next").addEventListener("click", () => entry.selectFrame(entry.current + 1));
    const readout = element.querySelector(".degrees");
    entry.turn = (degrees) => {
        const facing = ((Math.round(degrees) % 360) + 360) % 360;
        entry.slider.value = facing;
        readout.textContent = `${facing}°`;
    };
    entry.slider.addEventListener("input", () => entry.turn(Number(entry.slider.value)));
    let dragFrom = null;
    for (const canvas of canvases.values()) {
        canvas.addEventListener("pointerdown", (event) => {
            dragFrom = {x: event.clientX, facing: Number(entry.slider.value)};
            canvas.setPointerCapture(event.pointerId);
        });
        canvas.addEventListener("pointermove", (event) => {
            if (dragFrom) {
                entry.turn(dragFrom.facing + (event.clientX - dragFrom.x) * DEGREES_PER_PIXEL);
            }
        });
        canvas.addEventListener("pointerup", () => (dragFrom = null));
        canvas.addEventListener("keydown", (event) => {
            const step = {ArrowLeft: -15, ArrowRight: 15}[event.key];
            if (step) {
                entry.turn(Number(entry.slider.value) + step);
            }
        });
    }
    return entry;
}

function resize(entries, size) {
    const pixels = Math.round(size * (window.devicePixelRatio || 1));
    for (const entry of entries) {
        for (const canvas of entry.canvases.values()) {
            canvas.width = canvas.height = pixels;
            Object.assign(canvas.style, {width: `${size}px`, height: `${size}px`});
        }
        entry.shown.clear();
    }
    document.getElementById("sheet").style.setProperty("--cell", `${size + 26}px`);
}

async function main() {
    const status = document.getElementById("status");
    const loaded = await Promise.allSettled(VOICES.map((voice) => loadFigure(`${voice}.glb`, "wardrobe_manifest.json", voice)));
    const figures = new Map(VOICES.flatMap((voice, index) => loaded[index].status === "fulfilled" ? [[voice, loaded[index].value]] : []));
    const failed = VOICES.filter((voice) => !figures.has(voice));
    status.textContent = failed.length ? `These voices did not load: ${failed.join(", ")}` : "";
    status.hidden = !failed.length;
    const stage = new Stage();
    const sheet = document.getElementById("sheet");
    const entries = CLIPS.map((clip) => card(clip, sheet));
    for (const entry of entries) {
        for (const [voice, canvas] of entry.canvases) {
            const figure = figures.get(voice);
            const shows = figure && supportsClip(entry.clip.name, figure.stance);
            canvas.hidden = !shows;
            canvas.closest(".stage").querySelector("figcaption").textContent = shows ? voice : `${voice} · ${figure ? "hands full" : "did not load"}`;
        }
        entry.note.textContent = NOTES[entry.clip.name] || "";
    }
    sheet.style.setProperty("--ground", `${(GROUND * 100).toFixed(2)}%`);
    resize(entries, 96);

    for (const button of document.querySelectorAll(".sizes button")) {
        button.addEventListener("click", () => {
            document.querySelectorAll(".sizes button").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
            resize(entries, Number(button.dataset.size));
        });
    }
    const turnAll = document.getElementById("turn-all");
    turnAll.addEventListener("input", () => {
        document.getElementById("turn-all-degrees").textContent = `${turnAll.value}°`;
        entries.forEach((entry) => entry.turn(Number(turnAll.value)));
    });

    document.getElementById("check-angle").addEventListener("change", (event) => {
        turnAll.value = event.target.value;
        turnAll.dispatchEvent(new Event("input"));
    });

    let paused = false;
    let pausedAt = 0;
    let started = performance.now();
    const play = document.getElementById("play");
    play.addEventListener("click", () => {
        paused = !paused;
        if (paused) {
            pausedAt = performance.now();
        } else {
            started += performance.now() - pausedAt;
        }
        play.textContent = paused ? "Play" : "Pause";
    });

    document.getElementById("restart").addEventListener("click", () => {
        started = performance.now();
        pausedAt = started;
        entries.forEach((entry) => { entry.manual = null; });
    });

    const tick = (now) => {
        const seconds = ((paused ? pausedAt : now) - started) / 1000;
        for (const entry of entries) {
            const elapsedFrame = Math.floor(seconds * entry.clip.fps);
            const automatic = entry.clip.loops ? elapsedFrame % entry.clip.frames : Math.min(elapsedFrame, entry.clip.frames - 1);
            const frame = entry.manual ?? automatic;
            entry.current = frame;
            entry.frameRange.value = frame;
            entry.frameCount.textContent = `${frame + 1} / ${entry.clip.frames}${entry.entering ? " · entering the frame" : ""}`;
            const facing = Number(entry.slider.value);
            for (const [voice, canvas] of entry.canvases) {
                const key = `${frame}/${facing}/${canvas.width}`;
                if (canvas.hidden || key === entry.shown.get(voice)) {
                    continue;
                }
                stage.draw(figures.get(voice), entry.clip, frame, facing, canvas);
                entry.shown.set(voice, key);
                entry.empty.set(voice, isEmpty(canvas));
            }
            entry.entering = [...entry.canvases].every(([voice, canvas]) => canvas.hidden || entry.empty.get(voice));
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

main();
