import {shallowRef} from "vue";

// The dockable item types the modules declare, read from /api/docks and found by type
const declarations = shallowRef(new Map());

export function loadDockDeclarations(list) {
    declarations.value = new Map(list.map((declaration) => [declaration.type, declaration]));
}

export async function fetchDockDeclarations() {
    try {
        loadDockDeclarations((await (await fetch("/api/docks")).json()).docks || []);
    } catch (error) {
        loadDockDeclarations([]);
    }
}

export const dockDeclaration = (type) => declarations.value.get(type) || null;
