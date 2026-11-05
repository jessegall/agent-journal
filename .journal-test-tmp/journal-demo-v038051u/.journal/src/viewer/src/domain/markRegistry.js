import {declarationRegistry} from "./declarationRegistry.js";

// The chat mark types the modules declare, read from /api/marks and found by type
const marks = declarationRegistry("/api/marks", "marks");

export const loadMarkDeclarations = marks.load;
// the mark declarations /api/marks lists, none when the server cannot be read
export const readMarkDeclarations = marks.read;
export const fetchMarkDeclarations = marks.fetchAll;
export const markDeclaration = marks.find;
