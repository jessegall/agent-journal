import {lineResult} from "../../src/windows/windowContext.js";
import {dockDeclaration} from "../../src/domain/dockRegistry.js";

// the window a docked card is drawn in by a test: each card's key answers the first read its type declares
export function dockWindow(items = [], extra = {}) {
    const answerOf = (name) => {
        const item = items.find((candidate) => `dock.${candidate.id}` === name);
        if (!item) return {ok: false, failure: "refused", error: `no key ${name}`};
        return lineResult(item.type, [...dockDeclaration(item.type).reads[0].split(" "), String(item.target_id)], "main");
    };
    return {
        environment: "main",
        visible: {value: true},
        follow: () => {},
        ...extra,
        async readKeys({only = []}) {
            const keys = await Promise.all(only.map(async (name) => [name, await answerOf(name)]));
            return {ok: true, value: {declared: {}, keys: Object.fromEntries(keys)}};
        },
    };
}
