# Architecture

How the code of the journal is laid out, which part may use which, and the one way to do each recurring thing.
Every rule names what enforces it.
`journal map` prints the current tree with one line for each folder; the pinned copy is `tests/snapshots/map.txt`.

## The layers

The source is under `src`. A path says its layer, and a layer imports down, never up.

| Layer | Path | May import |
|---|---|---|
| Engine | `src/engine` | The engine alone |
| Core module | `src/core/modules/<name>` | The engine, itself, and the modules in its `dependencies` |
| Suite | `src/suites/<suite>` | The engine, itself, and the public folders of the modules it lists as dependencies |
| Suite module | `src/suites/<suite>/modules/<name>` | The same as a suite |
| Tunnel | `src/tunnels/<name>` | The same as a suite; never the server |
| Host | `src/server`, `src/install` | The engine and the core modules; no suite and no tunnel |
| Module list | the `__init__.py` of `src/core/modules`, `src/suites`, `src/tunnels` | Every module it lists |
| Test kit | `src/engine/testing`, `<module>/testing` | Anything |

- The table of patterns is `src/engine/module/layer_table.py`; nothing else writes a layer down.
- `src/engine/module/layer_check.py` reads every import of every file and refuses one that goes up or sideways
  to a module that is not listed, and a loop between modules. It has no list of exceptions.
- Enforced by `tests/integration/engine/module/test_every_module_is_in_a_layer.py`, the stories in
  `tests/stories/engine/module`, and the detectors
  `architecture_layers_engine_imports_a_module` and `architecture_layers_import_of_core_base`.
- The core names no suite, not in an import and not in a word: detector `core_names_no_suite`.

## The engine

`src/engine` is one folder for each area (command, model, query, driver, module and so on).

- Each area has a marker file `<area>_area.py` with one line on what it holds and whether it is a contract
  the modules build on or internal. `src/engine/map/code_map.py` refuses a folder without one.
- Errors of an area sit in its `errors` folder, the errors every area shares in `src/engine/errors`.
- Every enum of the engine sits in `src/engine/enums`.
- No file sits loose in `src/engine`. Detectors: `architecture_layout_base_loose_class`,
  `architecture_layout_error_outside_errors`, `architecture_layout_enum_outside_enums`.

## A module

A module is a folder with a declaration class in `<name>_module.py` that lists everything it adds: models,
migrations, commands, guards, listeners, the agent machine's contributions, settings, windows. It declares the modules it needs in
`dependencies` and what it binds to an engine contract in `bindings` (detector `module_registration`).

| Folder | Holds |
|---|---|
| `commands/<command>` | The command, its handler and its subcommand, together in one folder |
| `models` | The rows; `models/enums` the enums of the module |
| `queries` | Reads that are kept and shared |
| `guards` | Guards that can refuse a change |
| `listeners` | Listeners that run on a save, a deletion or a commit |
| `policies` | Policies: a pure judgement of an action, which the hook and a command's entrance both ask |
| `states` | State sources: the states and holds an agent's step needs, as required states and hold plans |
| `lines` | Line sources: the lines a step gives the agent |
| `effects` | Effects: the commands a step's save runs |
| `wake_causes`, `transforms` | Wake causes, and transforms of a tool's input |
| `agent_messages` | The texts an agent is told, one message template to a file |
| `migrations`, `upgrade`, `seeders` | The tables, the moves from version 4, the demo data |
| `support` | Classes of the module that are none of the above, one subject to a file |
| `errors` | The errors of the module |
| `skills`, `web` | The skills it ships and its windows in the viewer |
| `testing` | Fakes and builders for tests; never imported by product code |

- One sort of class to a folder: detector `architecture_layout_wrong_sort_in_kind_folder`.
- A folder holds at most 12 entries unless it is one of the lists above, and a file sits at most 3 levels below
  its layer: `src/engine/map/folder_budget.py` and the detector `architecture_layout_file_too_deep_below_its_layer`.
- Files that sit with the wrong owner are listed by `scripts/wrong_owner_survey.py`; the list
  `tests/snapshots/wrong_owner.txt` only shrinks.

## Suites

A suite is a set of agent machine drivers for one sort of work, with the modules it lists, its helper types and their
instruction lines, and the sections it adds to the Settings page. An environment runs one suite.

- `Suite.modules` is the one list of a suite's modules, its own module first. The shipped suites are listed in
  `src/suites/__init__.py`, and the loader loads a suite with its modules (`src/engine/module/module_finder.py`).
- `src/engine/module/suite_list.py` refuses a module two suites list and a core module a suite lists.
- A module under `src` does not name its suite itself: detector `architecture_suites_module_names_its_suite`.
- A plugin adds its modules to a suite by shipping a suite that `joins` it (`Suite.joins`); no module names its suite.
- A suite hands out tasks through its `task_assigner`, a `TaskAssigner` (`src/engine/module/task_assigner.py`).

## The agent machine

How the journal drives an agent (doc 1310). Each hook, and each step outside a hook, is one step of the agent's
state machine: it reads one view of the agent, asks every contribution its modules list, and saves the step and its
decision record in one write; the hook is answered from that record.

- The engine holds the machine: `src/engine/agent_stack` (the seven states, the stacked states, reasons and holds) sits
  below `src/engine/agent_machine` (the view, the step, the record and the contracts of the contributions). The stack
  imports nothing of the machine: detector `architecture_drivers_stack_imports_the_machine`.
- A module contributes classes on its lists: `policies`, `states` (state sources), `lines` (line sources), `effects`,
  `wake_causes`, `transforms`, `block_conditions`, `agent_listeners`. A contribution only answers: it runs no command
  and takes no bus (detectors `architecture_drivers_contribution_runs_a_command`, `architecture_drivers_contribution_takes_a_bus`,
  `architecture_drivers_contribution_builds_its_reader`). A write is an effect's command, which the step's save runs.
- Only the engine defines a state: a module gives one through a state source that returns a required state
  (detector `architecture_drivers_state_defined_outside_the_stack`).
- The drivers module keeps the machine's rows: `agent_stacks` and `agent_stack_moves` written only by the step's save,
  `StoredStepWriter` (detector `architecture_drivers_stack_row_written_outside_the_step`); a hold, `agent_blocks`,
  opened from a step's hold plan or through `OpenHold` (detector `architecture_drivers_hold_opened_outside_the_step`).
- A step saves against the read versions it read; every write that changes what an agent may do moves them in the
  same write (`ReadVersionsWriters`).
- Grants (refusal skips, guard and alias skips, permissions) are one table, `driver_grants`, read through the grant
  ledger; a spent journal command leaves a used grant record its entry point takes once.
- A wake is a durable `agent_wake` row: the step writes it, the wake owner claims it with a lease, sends it after the
  claim's write and records the delivery in a write of its own.
- A driver names its agent type, its rank order (names, never numbers: detector `architecture_drivers_rank_key_is_a_number`),
  its work stop and who answers its escalations; a suite declares its drivers and the instruction lines of its helper types.

## One way to do each thing

| Thing | The one way | Enforced by |
|---|---|---|
| Change a row | A command with its handler; a person or an agent reaches it through its subcommand | `architecture_core_handler_runs_twice` |
| Answer a hook | A contribution of the agent machine that only answers; it runs no command | `architecture_drivers_contribution_runs_a_command` |
| Hold an agent | A state source's hold plan, or `OpenHold`; `CloseAgentBlock` ends it | `architecture_drivers_hold_opened_outside_the_step` |
| Let an agent pass a refusal once | A grant in `driver_grants`: a skip or a permission, spent through the grant ledger | the grant ledger's tests |
| Refuse a command an agent runs | The policy the hook asks, asked again at the command's entrance through `CommandCheck` | the entry point tests |
| Read or write a file | `FileAccess.shared()` in `src/engine/file/file_access.py` | `FileReadsDetector`, `FileWritesDetector` |
| SQL | Built with the query builder; SQL text only in `src/engine/database`, `src/engine/query` and migrations | `architecture_queries_sql_text_in_a_builder`, `architecture_queries_statement_outside_the_builder` |
| Read rows | `queries.query(Model)` with where, order_by and take or limit; get() returns at most 50 rows, a named limit at most 1000, and every row only through every_row(reason), listed in `tests/snapshots/every_row_reads.txt` | `tests/unit/test_every_row_reads.py`, `tests/unit/test_no_unbounded_reads.py` |
| The time | The clock of `src/engine/time` | `architecture_core_wall_clock_outside_clock` |
| A line in the system log | `SystemLogWriter` | `architecture_core_log_outside_system_log_writer` |
| A line to an agent | The message sender; an agent message names a row and carries no data of it | `architecture_messages_agent_line_outside_message_sender`, `architecture_messages_command_in_an_agent_message` |
| A model from stored values | Through its table | `architecture_model_loaded_outside_table` |
| A setting | One declaration in its module, read through the settings | the skill `commandments-settings-architecture` |
| A request from the viewer | The one transport file | the skill `commandments-viewer-request-funnel` |

Services, events, guards, listeners and the agent machine's contributions load whole when a journal loads; nothing
loads on first use.

## Tests

- `tests/unit` mirrors `src`: a unit test proves one building block with samples of its own and imports nothing
  behind its boundary (detector `test_test_unit_test_crosses_its_boundary`).
- `tests/stories` holds the stories, written with the story builder of `src/engine/testing`. What a module does
  is proved by a story. Two stories may not repeat one another.
- `tests/readers` proves the readers of command output. `tests/install` proves the installer and runs only
  before a release.
- A move of a file is made with `scripts/move_class_file.py`, which rewrites every import and every detector
  that names the path, and `scripts/move_check.py` proves the registry did not change.

## Detectors

Every rule above is a file in `.commandments/custom` or a Python check with a test.
`tests/unit/test_architecture_detectors.py` proves that each architecture detector loads, has a
refused and an accepted sample, is listed in the configuration, and names folders that exist, so a moved folder
fails a test instead of switching a detector off. A new rule of the architecture gets a detector and a test.
