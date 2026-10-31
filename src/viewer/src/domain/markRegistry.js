import {shallowRef} from "vue";

// The chat mark types the modules declare, read from /api/marks and found by type
const declarations = shallowRef(new Map());

export function loadMarkDeclarations(list) {
    declarations.value = new Map(list.map((declaration) => [declaration.type, declaration]));
}

// the mark declarations /api/marks lists, none when the server cannot be read
export async function readMarkDeclarations() {
    try {
        return (await (await fetch("/api/marks")).json()).marks || [];
    } catch (error) {
        return [];
    }
}

export async function fetchMarkDeclarations() {
    loadMarkDeclarations(await readMarkDeclarations());
}

// a mark whose type no module declares any more is drawn as a quiet line
export const markDeclaration = (type) => declarations.value.get(type) || null;
