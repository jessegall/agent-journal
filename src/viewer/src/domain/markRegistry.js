import {shallowRef} from "vue";

// The chat mark types the modules declare, read from /api/marks and found by type
const declarations = shallowRef(new Map());

export function loadMarkDeclarations(list) {
    declarations.value = new Map(list.map((declaration) => [declaration.type, declaration]));
}

export async function fetchMarkDeclarations() {
    try {
        loadMarkDeclarations(await (await fetch("/api/marks")).json());
    } catch (error) {
        loadMarkDeclarations([]);
    }
}

// a mark whose type no module declares any more is drawn as a quiet line
export const markDeclaration = (type) => declarations.value.get(type) || null;
