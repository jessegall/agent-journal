const RUNS = new Set(["doc comment", "report comment", "doc close", "doc edit", "report edit"]);

// the read a document body draws through: its comment, close and edit commands run, every other line reads
export const documentRead = (view) => (line) => (RUNS.has(line.slice(0, 2).join(" ")) ? view.run(line) : view.read(line));
