import {afterEach, beforeAll, describe, expect, test, vi} from "vitest";
import {transport} from "../src/api/transport.js";
import {watchPresses} from "../src/platform/pressed.js";

const flush = () => new Promise((resolve) => setTimeout(resolve, 5));

let finish;

beforeAll(() => {
    watchPresses();
    transport.reach = () => new Promise((resolve) => (finish = () => resolve(new Response("{}", {status: 200}))));
});

afterEach(() => document.body.replaceChildren());

function button(onPress) {
    const control = document.createElement("button");
    control.textContent = "Save";
    control.addEventListener("click", onPress);
    document.body.append(control);
    return control;
}

describe("a pressed button while its request is out", () => {
    test("is marked busy until the answer comes", async () => {
        const control = button(() => transport.request("POST", "/api/x", {}));
        control.click();
        await flush();
        expect(control.dataset.busy).toBe("1");
        finish();
        await flush();
        expect(control.dataset.busy).toBeUndefined();
    });

    test("stays unmarked when the request is a read", async () => {
        const control = button(() => transport.request("GET", "/api/x"));
        control.click();
        await flush();
        expect(control.dataset.busy).toBeUndefined();
        finish();
    });

    test("stays unmarked when the request has nothing to do with the press", async () => {
        const control = button(() => {});
        control.click();
        await flush();
        transport.request("POST", "/api/x", {});
        expect(control.dataset.busy).toBeUndefined();
        finish();
    });
});
