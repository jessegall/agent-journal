# agent-journal

Write code, docstrings and documents in the plain terms any developer knows, for a reader seeing them cold: no poetry, no invented words, no voice (doc 1091).

**NO LAZY LOADING OF SERVICES, EVENTS, GUARDS, LISTENERS OR RULES.** The engine loads all of them whole when a
journal loads, and every journal with the same registry shares that one load. Never change this into loading on first
use, not to make a test faster nor to save a moment at boot: when loading is slow, the fault is that it happens more
than once, so share the load instead. With the developer setting Prevent lazy loading on, and always in the stories,
a lazy load stops the work at once (message 109663).

To look at any screen you change, run `journal look-at-screen --window <window> --setup "<journal line, with --environment main>"` (a worker needs its sandbox off): it saves a screenshot in the worktree, prints its path and stops its server.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

@JOURNAL.md
