import {createApp, h} from "vue";
import {expect, test} from "vitest";
import PriorityIcon from "../src/kit/PriorityIcon.vue";
import {namedPriority, priorityLabel} from "../src/domain/taskPriority.js";

const drawn = (value) => {
    const element = document.createElement("div");
    createApp({render: () => h(PriorityIcon, {value})}).mount(element);
    return element.querySelector("svg");
};

test("the icon lights one chevron for low, two for normal, three above, and colours high and critical", () => {
    const lit = (value) => [...drawn(value).querySelectorAll("path")].filter((path) => path.style.opacity === "1").length;
    expect([lit(100), lit(200), lit(300), lit(400)]).toEqual([1, 2, 3, 3]);
    expect(drawn(300).classList.contains("high")).toBe(true);
    expect(drawn(400).classList.contains("hot")).toBe(true);
    expect(drawn(200).classList.contains("high")).toBe(false);
});

test("a level reads by its name and a number between levels by its number", () => {
    expect(priorityLabel(400)).toBe("Critical");
    expect(priorityLabel(250)).toBe("250");
});

test("a number between levels draws as the level at or below it, and one under Low as Low", () => {
    const lit = (value) => [...drawn(value).querySelectorAll("path")].filter((path) => path.style.opacity === "1").length;
    expect([lit(250), lit(301), lit(399), lit(401), lit(50)]).toEqual([2, 3, 3, 3, 1]);
    expect(drawn(301).classList.contains("high")).toBe(true);
    expect(drawn(399).classList.contains("hot")).toBe(false);
    expect(drawn(401).classList.contains("hot")).toBe(true);
    expect([namedPriority(301), namedPriority(299), namedPriority(300), namedPriority(50)]).toEqual([300, 200, 300, 100]);
});
