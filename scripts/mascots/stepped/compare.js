// The butler's wave clip drawn twice, from the rendered sheet and in the browser, to check the two look the same.
import {CELL, CLIPS, Stage, loadFigure} from "./figure.js";

const VOICE = "butler";
const CLIP = CLIPS.find((clip) => clip.name === "wave");
const SHEET = {url: `../../../src/web/dist/mascots/${VOICE}/${CLIP.name}.webp`, columns: 8};

function sheetCell(size) {
    const cell = document.createElement("div");
    cell.className = "sheet";
    const rows = Math.ceil(CLIP.frames / SHEET.columns);
    Object.assign(cell.style, {
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${SHEET.url})`,
        backgroundSize: `${size * SHEET.columns}px ${size * rows}px`,
    });
    return {
        element: cell,
        show(frame) {
            const row = Math.floor(frame / SHEET.columns);
            cell.style.backgroundPosition = `${-(frame % SHEET.columns) * size}px ${-row * size}px`;
        },
    };
}

function figureCaption(element, words) {
    const figure = document.createElement("figure");
    const caption = document.createElement("figcaption");
    caption.textContent = words;
    figure.append(element, caption);
    return figure;
}

async function main() {
    const figure = await loadFigure(`${VOICE}.glb`, "wardrobe_manifest.json", VOICE);
    const stage = new Stage();
    const cells = [];
    const pictures = [];
    for (const row of document.querySelectorAll(".row")) {
        const size = Number(row.dataset.size);
        const cell = sheetCell(size);
        const picture = document.createElement("canvas");
        Object.assign(picture.style, {width: `${size}px`, height: `${size}px`});
        picture.width = picture.height = CELL;
        cells.push(cell);
        pictures.push(picture);
        row.append(figureCaption(cell.element, `Rendered sheet, ${size} px`), figureCaption(picture, `Browser, ${size} px`));
    }
    let frame = 0;
    let shown = -1;
    let paused = false;
    let started = performance.now();
    const draw = () => {
        pictures.forEach((picture) => stage.draw(figure, CLIP, frame, 0, picture));
        cells.forEach((cell) => cell.show(frame));
        document.getElementById("frame").textContent = `Frame ${frame + 1} of ${CLIP.frames}`;
        shown = frame;
    };
    const tick = (now) => {
        if (!paused) {
            frame = Math.floor(((now - started) / 1000) * CLIP.fps) % CLIP.frames;
        }
        if (frame !== shown) {
            draw();
        }
        requestAnimationFrame(tick);
    };
    document.getElementById("pause").addEventListener("click", (event) => {
        paused = !paused;
        started = performance.now() - (frame / CLIP.fps) * 1000;
        event.target.textContent = paused ? "Play" : "Pause";
    });
    document.getElementById("step").addEventListener("click", () => {
        paused = true;
        document.getElementById("pause").textContent = "Play";
        frame = (frame + 1) % CLIP.frames;
    });
    window.showFrame = (index) => {
        paused = true;
        frame = index;
        draw();
        return pictures[0].toDataURL("image/png");
    };
    requestAnimationFrame(tick);
}

main();
