# Journeys that stay outside MCP

A started agent does its journal work through the journal MCP tools: it reads `overview_read` first, follows each
`next_action`, sends every write with a `request_key` and asks `operations_read` when a write's outcome is unknown.
At every start, clear, resume and compaction it is told so, together with the journeys below that still go through
the CLI or the web (`app/Mcp/Support/McpInstructions.php`, added by `app/Mcp/Listeners/AddMcpInstructions.php`).

| Journey | Entry point | Who has it |
|---|---|---|
| Sequences: start one, read the current step, move on | `journal sequence` | every agent |
| Process outputs and their readers: run a command, read its output, write a reader | `journal output read`, `journal reader` | every agent |
| Inspect skills and their revisions | `journal skill list`, `journal skill show`, `journal skill revisions` | every agent |
| Page inbox history or acknowledge delivered messages | `journal message history`, `journal message read` | actors with inbox access |
| Reminders at a time or an interval | `journal reminder` | an agent whose profile dispatches work |
| Helper dispatch: start, send to, continue or steer a helper | `journal helper` | an agent whose profile dispatches work |
| Cancel a plan | `journal plan cancel` | an agent whose profile may cancel the plan |
| Account work: sign in, switch or remove a Claude Code or Codex account | the Accounts page | an agent whose profile dispatches work, for the user |
| A decision only the user makes | `journal question ask`, then the user answers in the web | every agent asks; only the user decides |

A read-only helper such as a reviewer is told only the journeys it has. Nothing here names a token or a path.
