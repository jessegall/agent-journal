import {declarationRegistry} from "./declarationRegistry.js";

// The dockable item types the modules declare, read from /api/docks and found by type
const docks = declarationRegistry("/api/docks", "docks");

export const loadDockDeclarations = docks.load;
export const fetchDockDeclarations = docks.fetchAll;
export const dockDeclaration = docks.find;
