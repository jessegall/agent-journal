# Writing a plugin

A plugin is a folder with a manifest and programs of its own. The journal runs them when something happens and reads what
they print. Start with the working [sample](samples/tidy-worktrees/), which a story installs and runs.

## The manifest

`journal-plugin.json` lies at the root of the folder. `name`, `title` and `version` are required. The name is how every
command refers to the plugin.

| Field | What it says |
|---|---|
| `protocol` | The version of the event line it reads, 1 if left out. A plugin above this journal's version installs, runs nothing, and its card says it needs a newer journal. |
| `listen` | Scripts to run for a change. See the three forms. |
| `program` | The file run for each name in `hears` and `holds`. |
| `hears` | Older event names it runs for after the event. |
| `holds` | Older event names it answers before they go on, each with an optional `window_ms`. |
| `settings` | A JSON file listing its settings, each with a key, title and type. |
| `requires` | Programs that must be installed, each with a check command and a hint. |
| `setup` | Commands run once, in order, when it installs. |
| `installed` | A command that answers with JSON settings once it is installed. |
| `services` | Programs kept running while the plugin is on. |
| `health` | How a service answers a health check. |
| `cards` | The tone of each type of card it shows. |
| `skills` | The folder holding its skills. |
| `reaches` | For an older event name, which helpers and workers it reaches besides the main agent. |
| `aliases` | The commands it provides under short names. |
| `dashboard` | A page it writes, with a name, a title and `events`, the keys of the events that make the viewer read it again while it is open. With no `events` an open page reads once a minute. |
| `description` | What it is for. |
| `project_reads` | Folders of the project a worker's shell line may read for it. |
| `files` | Other files that count as what it runs. Changing one switches the plugin off until a person has read the change. A folder counts every file in it, and a big folder costs time at every step of an agent. |

A wrong entry never stops an install. It shows on the plugin's card, and the rest of the plugin works.

A service may hold long-lived children. They end with its process group when it stops or crashes, and a child that calls setsid leaves the group and is not stopped.

## Finding a key

`journal event keys` lists every event by its key, with the forms it offers and plain words for it. `--grep` narrows the list.
A key looks like `core.tasks.task.created`: the module, the model, and what happened.

## The three forms

An entry in `listen` names a key and a script for any of three forms:

```json
{"event": "core.tasks.task.created", "guard": "check.sh", "listen": "add.sh", "commit": "tell.sh"}
```

- `guard` runs before a change and can refuse it, and then nothing is saved.
- `listen` runs during a change. It sees the row before it is saved, with `final` false, and an id it reads may still change. The commands it answers are saved with the change. A journal command it runs itself is saved at once and stays.
- `commit` runs after the change is saved and cannot stop it. Only this form promises the change happened.

A form's value may be `service:<name>`, naming one of its `services` with `answers` set. The event then goes to that running service, on its socket, and no new program starts, which matters when a program takes long to start. If the socket is closed, `program` runs if there is one, and otherwise it is a fault. A name that is no answering service is wrong on the card. An older event it holds, with no form named, goes to its first answering service the same way; when that socket is closed the event is late at once and the program is not started, since a program started now would answer past the window.

All deliveries run in turn on one thread, for every plugin, older events included. A commit script or service that is slow holds every other plugin's deliveries until it ends.

A guard or listen script holds no lock, but whoever made the change waits for it, and is told so once a minute. The journal puts no time limit on a script, except a guard on an agent's tool step or prompt, which keeps the journal's limit; the card says so. Turning the plugin off stops a script that never ends.

Only a request in a running server runs guard and listen scripts. A server thread, a tick and a run with no server skip them and note the skip. Some commands run only once, such as a merge, and their guard and listen scripts are skipped too. The card shows the last skip of each entry with its reason. Commit scripts always get their delivery.

A script's own writes start no guard or listen script of any plugin, and it does not hear its own write in commit.

## The event line

A script gets one line of JSON on its input:

- `v`: the version of this line.
- `event`: the key.
- `agent`, its `role`, `skills`, `environment` and `at`. `checkout.kind` is not the role: a main agent can edit inside a worktree.
- `window_ms`: the limit this call runs under, or null for no limit.
- `checkout`: the checkout of the agent, with `kind`, `root`, `project_root`, `branch`, `base_branch`, `base_commit` and `exists`.
- `data`: for a script named by key, `form`, `final`, `log_name`, `event_id`, `actor`, `command`, `cause_id`, `row`, `old_row` and `changed`. A hidden field reads as hidden. An event about a file also has `file`.

The rules of this line:

1. A plugin never works out a checkout. The journal says which one it is.
2. `relative` is the name of a file. It runs from the root of the checkout, with `/`, and it is the same for one file in the main checkout and in every worktree. Join on it and nothing else.
3. Every absolute path the journal gives is a real path, with every link resolved.
4. A plugin may hold a relative path and an agent. With those two the journal does the rest.
5. The meaning of a field never changes. Fields are added. A change of meaning raises `v`.

A cut worktree starts from `base_commit` of the branch. Nothing promises that it equals another copy of the project read from a main checkout, whose working files may differ from any commit.

## A worktree's life

`suites.coding.workers.worker_worktree.cut` fires once the worktree exists and is prepared. `suites.coding.workers.worker_worktree.remove` fires when a merge or a release removes the worktree of a worker that started. A release of a worktree still opening and a failed start delete the row, so they fire `suites.coding.workers.worker_worktree.deleted` instead. The sweep of leftover folders has no row, so it fires nothing, and a folder removed by hand fires nothing until the worker is released.

## A server stop

A server stop kills a running commit script. That delivery, and any still queued, run after the next start, so a commit script can run twice for one event: make it safe to run again. A guard or listen script that a stop kills answers its waiting command with the stop, and nothing is written.

## A worker's merge

`suites.coding.workers.worker_worktree.merge` in the commit form fires once for each merge, after the merge has committed, and never for a refused merge or one that clashed: a merge that clashes returns the worktree to its worker and fires `suites.coding.workers.worker_worktree.rework`. The guard and listen forms are skipped, because a merge runs only once. Its `row` holds `session_agent_id`, the worker; `task_id` and `merged_task_ids`, its tasks; `commit_before_merge` and `commit_after_merge`, the merged range on `base_branch`; `environment_id`; and `folder`, the worktree's path as a name, since the folder may be gone by then. `journal plugin changes --since <commit_before_merge>` lists the files.

## Answering

A script may print one line of JSON:

```json
{"answer": "refuse", "reason": "why", "tell": "a line for the agent", "commands": ["task log 7 done"], "cards": [], "require_skills": []}
```

Printing nothing allows. `refuse` stops a change only in `guard`; in `listen` and `commit` it is a fault.

To say you could not judge something, answer with a `tell`, and put the reason in its text, since `reason` is read only with `refuse`. It is no fault. It counts as a success, so it clears a run of earlier faults. A delivery with no agent has nobody to tell, so the line is dropped.

## The calls

| Call | What it answers | Who may call it |
|---|---|---|
| `journal plugin checkout` | The checkout of an agent. | A plugin or a person for any agent with `--agent`; an agent for itself. |
| `journal plugin changes [--since <commit>]` | Each name that differs from a commit. | The same. |
| `journal plugin file <relative> [--from checkout, project or base]` | The text of a file. A name that is not there exits with code 4. | The same; an agent reads the project only in declared folders. |
| `journal plugin run [--agent <n>] [--read-only] -- <command>` | Runs a command at the root of a checkout with the sandbox of its agent. | A plugin or a person, never an agent. |

A `journal worker send <worker> "<job>"` call exits with code 5 when the worker is retired; a general refusal exits with code 1.

## project_reads

A worker's shell reads its own worktree and not the main checkout. `project_reads` lists folders of the project, by relative path, that it may read for this plugin:

```json
{"project_reads": [".rules"]}
```

An entry that leaves the project, is a single dot, is empty, is a link pointing out, or names the journal's own folder or anything in it is never opened, and shows as wrong on the card. This is only about what a plugin may declare: a worker's own worktree stays readable by its shell, and the plugin's own data folder stays reachable by its rules.

## When something fails

A fault lets the event through. The card shows the last fault, such as `it ended with code 3 at core.tasks.task.created (guard)` with the end of what the script wrote to stderr, setting values hidden. After five faults in a row the chat says the plugin is failing. A failing plugin's guard and listen scripts are tried once every five minutes, and a success clears the mark. A script stopped on purpose counts no fault. A plugin with eight scripts running has the next one skipped.

Changing a file the plugin runs switches it off and tells the chat. The user switches it on again after reading the change.

## Skipping a guard

```
journal task make "Fix" --skip-guard plugins.event-guard:<plugin> --skip-reason "<why>"
```

This passes one plugin, and the log names the skip. The bare name passes nothing. An entry with `"skip": false` cannot be passed this way. A person can always turn the plugin off.

## Trying a script

`journal plugin try <name> <key> [--agent <n>]` runs the script of that key for real with the newest event of the key, or an empty row. It prints the line, the answer and any fault, and applies nothing. A read-only helper may not start it.

`journal plugin record <name> --inputs` shows the last lines the plugin was sent. `journal plugin events <name>` shows how each entry stands.
