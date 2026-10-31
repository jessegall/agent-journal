// The chat mark types the modules declare, read once from /api/marks and found by type
const declarations = new Map();

export function loadMarkDeclarations(list) {
    declarations.clear();
    for (const declaration of list) declarations.set(declaration.type, declaration);
}

// a mark whose type no module declares any more is drawn as a quiet line
export const markDeclaration = (type) => declarations.get(type) || null;
