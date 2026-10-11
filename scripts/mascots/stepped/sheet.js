// Every clip of the butler on one page, each on its own live canvas with a turn of its own.
import {CLIPS, Stage, loadFigure, supportsClip} from "./figure.js";

const VOICE = "butler";
const DEGREES_PER_PIXEL = 1;

function timing(clip) {
    return `${clip.frames} frames · ${clip.fps} fps · ${clip.loops ? "loops" : "once"}`;
}

function isEmpty(canvas) {
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    return pixels.every((value, index) => index % 4 !== 3 || value === 0);
}

function card(clip, sheet) {
    const element = document.createElement("article");
    element.className = "card";
    element.innerHTML = `
        <div class="stage"><canvas tabindex="0" aria-label="${clip.name}, drag to turn"></canvas></div>
        <div class="name"><h2>${clip.name}</h2><span class="timing">${timing(clip)}</span></div>
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
    const entry = {clip, element, canvas: element.querySelector("canvas"), slider: element.querySelector("input"), shown: ""};
    entry.manual = null;
    entry.current = 0;
    entry.frameRange = element.querySelector(".frame-range");
    entry.frameCount = element.querySelector(".frame-count");
    entry.note = element.querySelector(".note");
    entry.selectFrame = (frame) => {
        entry.manual = Math.max(0, Math.min(clip.frames - 1, frame));
        entry.shown = "";
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
    entry.canvas.addEventListener("pointerdown", (event) => {
        dragFrom = {x: event.clientX, facing: Number(entry.slider.value)};
        entry.canvas.setPointerCapture(event.pointerId);
    });
    entry.canvas.addEventListener("pointermove", (event) => {
        if (dragFrom) {
            entry.turn(dragFrom.facing + (event.clientX - dragFrom.x) * DEGREES_PER_PIXEL);
        }
    });
    entry.canvas.addEventListener("pointerup", () => (dragFrom = null));
    entry.canvas.addEventListener("keydown", (event) => {
        const step = {ArrowLeft: -15, ArrowRight: 15}[event.key];
        if (step) {
            entry.turn(Number(entry.slider.value) + step);
        }
    });
    return entry;
}

function resize(entries, size) {
    const pixels = Math.round(size * (window.devicePixelRatio || 1));
    for (const entry of entries) {
        entry.canvas.width = entry.canvas.height = pixels;
        Object.assign(entry.canvas.style, {width: `${size}px`, height: `${size}px`});
        entry.shown = "";
    }
    document.getElementById("sheet").style.setProperty("--cell", `${Math.max(size + 26, 200)}px`);
}

async function main() {
    const status = document.getElementById("status");
    let figure = await loadFigure(`${VOICE}.glb`, "wardrobe_manifest.json", VOICE).catch((error) => {
        status.textContent = `The butler did not load: ${error.message}`;
        throw error;
    });
    status.hidden = true;
    const stage = new Stage();
    const sheet = document.getElementById("sheet");
    const entries = CLIPS.map((clip) => card(clip, sheet));
    const notes = () => entries.forEach((entry) => {
        entry.element.hidden = !supportsClip(entry.clip.name, figure.stance);
        entry.note.textContent = entry.clip.name === "pull_ups" ? "Short lift on two fixed side handles, not a full overhead pull-up."
            : entry.clip.name === "sit_on_edge" ? "Seated loop; host scene supplies the ledge."
            : entry.clip.name.endsWith("_in") ? "Arrives from the left, brakes, turns, then holds." : "";
    });
    notes();
    const cache = new Map([[VOICE, Promise.resolve(figure)]]);
    let request = 0;
    document.getElementById("figure-choice").addEventListener("change", async (event) => {
        const voice = event.target.value, token = ++request;
        if (!cache.has(voice)) cache.set(voice, loadFigure(`${VOICE}.glb`, "wardrobe_manifest.json", voice));
        try {
            const loaded = await cache.get(voice);
            if (token !== request) return;
            figure = loaded;
            entries.forEach((entry) => entry.shown = "");
            notes();
        } catch (error) {
            cache.delete(voice);
            status.hidden = false;
            status.textContent = `The figure did not load: ${error.message}`;
        }
    });
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
        entries.forEach((entry) => { entry.manual = null; entry.shown = ""; });
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
            const key = `${frame}/${facing}/${entry.canvas.width}`;
            if (key === entry.shown) {
                continue;
            }
            stage.draw(figure, entry.clip, frame, facing, entry.canvas);
            entry.entering = isEmpty(entry.canvas);
            entry.shown = key;
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

main();
