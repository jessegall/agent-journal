// Every clip of the butler on one page, each on its own live canvas with a turn of its own.
import {CLIPS, Stage, loadFigure} from "./figure.js";

const VOICE = "butler";
const DEGREES_PER_PIXEL = 1;

function timing(clip) {
    return `${clip.frames} frames · ${clip.fps} fps · ${clip.loops ? "loops" : "once"}`;
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
        </label>`;
    sheet.append(element);
    const entry = {clip, canvas: element.querySelector("canvas"), slider: element.querySelector("input"), shown: ""};
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
    const figure = await loadFigure(`${VOICE}.glb`, "wardrobe_manifest.json", VOICE).catch((error) => {
        status.textContent = `The butler did not load: ${error.message}`;
        throw error;
    });
    status.hidden = true;
    const stage = new Stage();
    const sheet = document.getElementById("sheet");
    const entries = CLIPS.map((clip) => card(clip, sheet));
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

    const tick = (now) => {
        const seconds = ((paused ? pausedAt : now) - started) / 1000;
        for (const entry of entries) {
            const frame = Math.floor(seconds * entry.clip.fps) % entry.clip.frames;
            const facing = Number(entry.slider.value);
            const key = `${frame}/${facing}/${entry.canvas.width}`;
            if (key === entry.shown) {
                continue;
            }
            stage.draw(figure, entry.clip, frame, facing, entry.canvas);
            entry.shown = key;
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

main();
