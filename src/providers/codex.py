import json
from functools import cache
from dataclasses import dataclass, field, replace
import re
import shutil
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, TOOL
from providers.payload import AgentCall, AskCall, BashCall, EVENTS, Failure, PERMISSION, SKILL_READ, UsageWindow
from providers.base import BackgroundTasks, Provider, SubagentRow, running_and_latest
from providers.jsonl import last_lines, parsed, parsed_row, rows
from providers.payload import Dispatch, Hook, ToolCall
from providers.codex_rows import Chunk, Row
from engine.fields import Loaded
from resources.types import AgentRow
from engine.stored import read_json
from typing import TypedDict

SHELL_TOOLS = ("exec", "exec_command", "shell", "shell_command")
TOOLS = {**dict.fromkeys(SHELL_TOOLS, "Bash"), "apply_patch": "Edit"}
SKILL_LOOP = re.compile(r"for\s+\w+\s+in\s+([^;]+);\s*do")
TAIL_BYTES = 262144
WINDOW_LABELS = {300: "5h", 1440: "1d", 10080: "7d"}
SPAWN_IN_SCRIPT = re.compile(r"tools\.\w*spawn_agent\(")
SCRIPT_FIELD = r"\b{}:\s*\"([^\"]*)\""
SPAWNED = re.compile(r'"agent_id"\s*:\s*"([^"]+)"(?:\s*,\s*"nickname"\s*:\s*"([^"]*)")?')
CONTEXT_CONTROLS = {"key": "context", "label": "Context window", "choices": [{"value": "compact", "label": "Compact context", "command": "/compact"},
                                                                             {"value": "clear", "label": "New conversation", "command": "/new"}]}
FAST_CONTROLS = {"key": "fast", "label": "Fast mode", "choices": [{"value": "switch", "label": "Turn fast mode on or off", "command": "/fast"}]}
EXITS_KEPT = 200
UNREAD_SCRIPT = "a script"
CELL_RUNNING = re.compile(r"^Script running with cell ID (\d+)")
CELL_ID = re.compile(r'"cell_id"\s*:\s*"?(\d+)')
DETACHED = re.compile(r"^(.*?)\s*(?:>\S*\s*(?:2>&1)?\s*)?&\s*(?:echo \$!)?\s*$", re.S)
EXEC_COMMAND = re.compile(r'exec_command\(\{\s*["\']?cmd["\']?\s*:\s*(["\'`])((?:(?!\1)[^\\]|\\.)*)\1')
TASK_EVENTS = re.compile(rb'"type":"(task_started|task_complete)"')


@dataclass(frozen=True)
class CodexShell(BashCall):
    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "CodexShell":
        command = next(given[key] for key in ("cmd", "input", "command") if key in given)
        printed = "\n".join(str(response[key]) for key in ("stdout", "stderr") if response.get(key))
        return cls(name, given, response, command=" ".join(command) if isinstance(command, list) else str(command), printed=printed)


def script_field(text: str, key: str, index: int) -> str:
    values = re.findall(SCRIPT_FIELD.format(key), text)
    return values[index] if index < len(values) else ""


@dataclass(frozen=True)
class Spawned(Loaded):
    task_name: str = "subagent"
    agent_type: str = ""
    model: str = ""


def arguments_of(raw) -> dict:
    if isinstance(raw, dict):
        return raw
    try:
        detail = json.loads(raw) if isinstance(raw, str) else None
    except ValueError:
        return {}
    return detail if isinstance(detail, dict) else {}


@dataclass(frozen=True)
class CodexModel:
    slug: str
    display_name: str
    efforts: tuple
    default_effort: str

    @classmethod
    def from_json(cls, raw: dict) -> "CodexModel":
        return cls(raw["slug"], raw["display_name"] if raw.get("display_name") else raw["slug"], tuple(level["effort"] for level in raw["supported_reasoning_levels"]),
                   raw["default_reasoning_level"] if raw.get("default_reasoning_level") else "")

    @staticmethod
    def listed(raw) -> bool:
        levels = raw.get("supported_reasoning_levels") if isinstance(raw, dict) else None
        return (isinstance(raw, dict) and bool(raw.get("slug")) and raw.get("visibility") == "list" and bool(raw.get("supported_in_api"))
                and isinstance(levels, list) and all(isinstance(level, dict) and level.get("effort") for level in levels))

    @property
    def choice(self) -> dict:
        return {"value": self.slug, "label": self.display_name}


def polled(text: str) -> list[Chunk]:
    chunks = (parsed(line, Chunk.from_json) for line in text.splitlines() if line.startswith("{"))
    return [chunk for chunk in chunks if chunk is not None and chunk.chunk_id]


def running_sessions(text: str) -> list[str]:
    return [chunk.session_id for chunk in polled(text) if chunk.session_id]


@dataclass
class CodexTasks(BackgroundTasks):
    scripts: dict[str, str] = field(default_factory=dict)
    waits: dict[str, str] = field(default_factory=dict)
    exits: dict[str, tuple[float, bool]] = field(default_factory=dict)

    def opened(self, session: str, at: float, command: str) -> None:
        self.started[session] = at
        self.commands[session] = command
        if session in self.exits:
            self.end(session, *self.exits.pop(session))

    def open_sessions(self, text: str, at: float, command: str) -> None:
        for session in [s for s in running_sessions(text) if s not in self.started]:
            self.opened(session, at, command)

    def end(self, key: str, at: float, failed: bool) -> None:
        self.ended.setdefault(key, at)
        if failed:
            self.failed.add(key)


@dataclass(frozen=True)
class SpawnedAgent:
    task: str
    type: str
    model: str
    session: str
    at: float


@dataclass(frozen=True)
class CellShellRow:
    command: str
    cell: str
    running: bool = True
    ended: float = 0.0
    status: str = ""

    def to_json(self) -> dict:
        found = {"command": self.command, "cell": self.cell, "running": self.running}
        return found if self.running else {**found, "ended": self.ended, "status": self.status}


@dataclass
class CodexCrew:
    subagents: list[SpawnedAgent] = field(default_factory=list)
    shells: list[CellShellRow] = field(default_factory=list)
    compacting: bool = False
    pending: dict[str, str] = field(default_factory=dict)
    spawning: dict[str, str] = field(default_factory=dict)
    direct: dict[str, Spawned] = field(default_factory=dict)
    waits: dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class CodexConfig:
    model: str = ""
    effort: str = ""
    doc_limit: int = 32768


def effort_choice(effort: str) -> dict:
    return {"value": effort, "label": {"xhigh": "Extra high"}.get(effort, effort.title())}


def initial_effort(action: str, current, standard: list, default):
    if action == "effort" and current in standard:
        return current
    if action == "effort" and current:
        return ""
    if default:
        return default
    return standard[0] if standard else ""


def message_kind(payload) -> str:
    if payload.role == "assistant":
        return AGENT
    return INJECTED if payload.text.lstrip().startswith("<") else HUMAN


class ModelControls(TypedDict):
    groups: list[dict]
    note: str


class Codex(Provider):
    name = "codex"
    question_tools = frozenset({"request_user_input", "request_user_input_async"})
    tool_kinds = {**Provider.tool_kinds, **dict.fromkeys((*SHELL_TOOLS, "apply_patch"), CodexShell), "spawn_agent": AgentCall,
                  "request_user_input": AskCall, "request_user_input_async": AskCall}
    home = ".codex"
    briefing_file = "AGENTS.md"
    skill_home = ".agents/skills"
    retired_skill_homes = (f"{home}/skills",)

    def skill_load(self, name: str) -> str:
        return f"read {self.skill_home}/{name}/SKILL.md"

    @classmethod
    def control_options(cls, current_model: str) -> dict:
        return cls.controls_for(cls.catalog(), current_model if current_model else cls.configuration().model)

    @classmethod
    def commands_for(cls, action: str, value: str, current_model: str) -> list[str]:
        config = cls.configuration()
        return cls.commands(cls.catalog(), action, value, current_model if current_model else config.model, config.effort)

    @classmethod
    def matched(cls, models: list[CodexModel], current_model: str) -> CodexModel | None:
        if not models:
            return None
        exact = next((item for item in models if item.slug == current_model), None)
        near = next((item for item in models if current_model and (current_model.startswith(item.slug) or item.slug.startswith(current_model))), None)
        configured = next((item for item in models if item.slug == cls.configuration().model), None)
        return exact or near or configured or models[0]

    @classmethod
    def controls_for(cls, models: list[CodexModel], current_model: str) -> ModelControls:
        model = cls.matched(models, current_model)
        groups = [{"key": "model", "label": "Model", "choices": [item.choice for item in models]}]
        if model:
            groups.append({"key": "effort", "label": "Reasoning effort", "choices": [effort_choice(effort) for effort in model.efforts]})
        groups += [FAST_CONTROLS, CONTEXT_CONTROLS]
        note = "Changes apply immediately through the Codex model picker."
        if not models:
            note = "Codex model catalog unavailable; use /model in the Codex terminal."
        return {"groups": groups if models else [], "note": note}

    @classmethod
    def catalog(cls, path: Path | None = None) -> list[CodexModel]:
        path = path if path else Path.home() / cls.home / "models_cache.json"
        listed = read_json(path, dict, {}).get("models")
        return [CodexModel.from_json(model) for model in listed if CodexModel.listed(model)] if isinstance(listed, list) else []

    @classmethod
    def configuration(cls, path: Path | None = None) -> CodexConfig:
        path = path if path else Path.home() / cls.home / "config.toml"
        try:
            lines = path.read_text().splitlines()
        except OSError:
            return CodexConfig()
        found = {}
        for line in lines:
            match = re.match(r"\s*(model|model_reasoning_effort)\s*=\s*\"([^\"]+)\"", line)
            if match:
                found["model" if match.group(1) == "model" else "effort"] = match.group(2)
            limit = re.match(r"\s*project_doc_max_bytes\s*=\s*(\d+)\s*$", line)
            if limit:
                found["doc_limit"] = int(limit.group(1))
        return CodexConfig(**found)

    def dispatch_model(self, chosen: str) -> str:
        if chosen in {model.slug for model in self.catalog()}:
            return chosen
        return self.configuration().model or chosen

    @classmethod
    @cache
    def briefing_limit(cls) -> int:
        return cls.configuration().doc_limit

    @classmethod
    def commands(cls, models: list[CodexModel], action: str, value: str, current_model: str, current_effort: str) -> list[str]:
        target = cls.matched(models, current_model) if action == "effort" else next(model for model in models if model.slug == value)
        source_model = models.index(cls.matched(models, current_model))
        target_model = models.index(target)
        commands = ["/model", cls.move(source_model, target_model)]
        supported = list(target.efforts)
        standard = [item for item in supported if item not in ("max", "ultra")]
        advanced = [item for item in supported if item in ("max", "ultra")]
        first = standard[0] if standard else advanced[0]
        fallback = target.default_effort if target.default_effort else first
        chosen = value if action == "effort" else fallback
        initial = initial_effort(action, current_effort, standard, target.default_effort)
        if chosen in standard:
            commands.append(cls.move(standard.index(initial) if initial in standard else 0, standard.index(chosen)))
        else:
            commands.append(cls.move(standard.index(initial) if initial in standard else 0, len(standard)))
            commands.append(cls.move(0, advanced.index(chosen)))
        return commands

    @staticmethod
    def move(start: int, target: int) -> str:
        key = "\x1b[B" if target >= start else "\x1b[A"
        return key * abs(target - start)

    def agent_file(self, project: Path, name: str) -> Path:
        return project / self.home / "agents" / f"{name}.toml"

    def agent_text(self, kind, model: str) -> str:
        sandbox = "workspace-write" if "Bash" in kind.tools and "Grep" not in kind.tools else "read-only"
        return (f"name = {json.dumps(kind.name)}\ndescription = {json.dumps(kind.description)}\nsandbox_mode = {json.dumps(sandbox)}\n"
                f"developer_instructions = {json.dumps(kind.instructions)}\n")

    def present(self, project: Path) -> bool:
        return (project / self.home).is_dir() or shutil.which("codex") is not None

    def config(self, project: Path) -> Path:
        return project / self.home / "hooks.json"

    def hook_files(self, project: Path) -> list[Path]:
        return [Path.home() / self.home / "hooks.json", self.config(project)]

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}]
                          for event in EVENTS if event != PERMISSION}}

    def dispatch(self, tool) -> Dispatch | None:
        if not isinstance(tool, AgentCall):
            return None
        return Dispatch(kind=tool.kind.strip().lower(), task=tool.task.strip().lower(), model=tool.model.strip(), model_supported=True)

    def row_of(self, raw: dict) -> Row:
        return Row.from_payload(raw)

    def turn(self, row: Row) -> tuple[str, str] | None:
        payload = row.payload
        if row.type != "response_item":
            return None
        if payload.type == "message":
            if not payload.text.strip() or payload.role not in ("user", "assistant"):
                return None
            turn_kind = message_kind(payload)
            return "agent" if payload.role == "assistant" else "user", payload.text, turn_kind, row.at, []
        if payload.type in ("function_call", "custom_tool_call"):
            return "agent", "", AGENT, row.at, [TOOLS.get(payload.name, payload.name if payload.name else "?")]
        if payload.type in ("function_call_output", "custom_tool_call_output"):
            return TOOL, payload.output_text, TOOL, row.at, []
        return None

    def context(self, hook: Hook) -> float | None:
        return next((round(100 * p.used_tokens / p.window, 1) for p in self.token_counts(hook.transcript) if p.used_tokens and p.window), None)

    def usage(self, path: Path, now: float | None = None) -> list[UsageWindow] | None:
        limits = next((p.limits for p in self.token_counts(path) if p.limits is not None), None)
        if limits is None:
            return None
        return [UsageWindow(limit.key, self.window_label(limit.minutes), limit.used, limit.minutes, limit.resets) for limit in limits]

    def token_counts(self, path: Path | None):
        lines, _ = last_lines(path, TAIL_BYTES)
        for row in rows(reversed(lines), Row.from_payload):
            if row.type == "event_msg" and row.payload.type == "token_count":
                yield row.payload

    def window_label(self, minutes: int) -> str:
        if minutes in WINDOW_LABELS:
            return WINDOW_LABELS[minutes]
        if minutes and minutes % 1440 == 0:
            return f"{minutes // 1440}d"
        if minutes and minutes % 60 == 0:
            return f"{minutes // 60}h"
        return f"{minutes}m"

    def subagent_transcript(self, path: Path, session: str) -> Path | None:
        return next(Path(path).parent.parent.glob(f"*/rollout-*-{session}.jsonl"), None)

    def failure(self, path: Path) -> Failure | None:
        lines, _ = last_lines(path, TAIL_BYTES)
        ends = [line for line in lines if TASK_EVENTS.search(line)]
        return parsed_row(ends[-1], Failure.from_turn_end) if ends else None

    def background_tasks(self, path: Path) -> BackgroundTasks:
        return self.folded(path, self.task_rows, CodexTasks)

    def task_rows(self, tasks: CodexTasks, row: Row) -> CodexTasks:
        found = row.payload
        if found.type == "custom_tool_call" and found.call == "exec":
            command = EXEC_COMMAND.search(found.argument_text)
            if command:
                tasks.scripts[found.key] = command[2]
        if found.type == "function_call" and found.call == "wait":
            cell = CELL_ID.search(found.argument_text)
            if cell:
                tasks.waits[found.key] = f"cell:{cell[1]}"
        if found.type == "custom_tool_call_output":
            self.exec_output(tasks, found, row.at)
        if found.type == "function_call_output" and found.key in tasks.waits:
            self.cell_answer(tasks, tasks.waits.pop(found.key), found.output_text, row.at)
        if found.type == "item_completed" and found.item.type == "CommandExecution":
            self.command_ended(tasks, found, row.at)
        return tasks

    @staticmethod
    def exec_output(tasks: CodexTasks, found, at: float) -> None:
        script = tasks.scripts.pop(found.key, "")
        running = CELL_RUNNING.search(found.output_text)
        if running:
            tasks.started.setdefault(f"cell:{running[1]}", at)
            tasks.commands[f"cell:{running[1]}"] = script or UNREAD_SCRIPT
        if script:
            tasks.open_sessions(found.output_text, at, script)
        for chunk in [c for c in polled(found.output_text) if c.session_id in tasks.started and c.output]:
            tasks.printed[chunk.session_id] = at

    @staticmethod
    def cell_answer(tasks: CodexTasks, cell: str, text: str, at: float) -> None:
        if cell not in tasks.started:
            return
        if tasks.commands[cell] != UNREAD_SCRIPT:
            tasks.open_sessions(text, at, tasks.commands[cell])
        if text.startswith("Script running"):
            tasks.printed[cell] = at
            return
        tasks.end(cell, at, not text.startswith("Script completed"))

    @staticmethod
    def command_ended(tasks: CodexTasks, found, at: float) -> None:
        detached = DETACHED.match(found.item.command_line)
        if detached and found.item.stdout.strip().isdigit():
            key = f"pid:{found.item.stdout.strip()}"
            tasks.started.setdefault(key, at)
            tasks.commands[key] = detached[1].strip("() ")
            tasks.detached[key] = int(found.item.stdout.strip())
        ended, failed = found.completed_at_ms / 1000 if found.completed_at_ms else at, found.item.status == "failed"
        if found.item.process_id not in tasks.started:
            tasks.exits[found.item.process_id] = (ended, failed)
            while len(tasks.exits) > EXITS_KEPT:
                tasks.exits.pop(next(iter(tasks.exits)))
            return
        tasks.end(found.item.process_id, ended, failed)

    def subagent_state(self, path: Path, session: str) -> tuple[bool, float]:
        found = self.subagent_transcript(path, session)
        events = TASK_EVENTS.findall(b"".join(last_lines(found, TAIL_BYTES)[0])) if found else []
        running = not events or events[-1] == b"task_started"
        return running, 0.0 if running or not found else found.stat().st_mtime

    def subagent_row(self, path: Path, spawn: SpawnedAgent) -> dict:
        running, ended = self.subagent_state(path, spawn.session) if spawn.session else (True, 0.0)
        return SubagentRow(spawn.session, spawn.task, spawn.type, spawn.model, running, spawn.at, ended, "" if running else "finished", spawn.session).to_json()

    def crew_rows(self, crew: CodexCrew, row: Row) -> CodexCrew:
        if row.type == "compacted":
            crew.compacting = True
            return crew
        if row.type != "response_item":
            return crew
        payload = row.payload
        name, key, script = payload.name, payload.key, payload.argument_text
        is_call = payload.type in ("function_call", "custom_tool_call")
        if is_call and name.rsplit(".", 1)[-1] in SHELL_TOOLS:
            crew.pending[key] = script
        if is_call and name == "exec" and SPAWN_IN_SCRIPT.search(script):
            crew.spawning[key] = script
        elif is_call and name.endswith("spawn_agent"):
            crew.direct[key] = Spawned.from_json(arguments_of(payload.arguments))
        elif payload.type == "function_call" and name.endswith("wait"):
            cell = CELL_ID.search(script)
            if cell:
                crew.waits[key] = cell[1]
        output = payload.output_text if payload.type in ("function_call_output", "custom_tool_call_output") else ""
        if output:
            self.answered(crew, key, output, row.at)
        if payload.role == "assistant" or payload.type in ("reasoning", "function_call", "custom_tool_call"):
            crew.compacting = False
        return crew

    @staticmethod
    def answered(crew: CodexCrew, key: str, output: str, at: float) -> None:
        script = crew.spawning.pop(key, None)
        if script:
            crew.subagents += [SpawnedAgent(script_field(script, "task_name", index) or found[2] or "subagent", script_field(script, "agent_type", index),
                                            script_field(script, "model", index), found[1], at) for index, found in enumerate(SPAWNED.finditer(output))]
        asked = crew.direct.pop(key, None)
        if asked:
            found = SPAWNED.search(output)
            crew.subagents.append(SpawnedAgent(asked.task_name, asked.agent_type, asked.model, found[1] if found else "", at))
        command = crew.pending.pop(key, "")
        cell = CELL_RUNNING.search(output)
        if cell:
            crew.shells.append(CellShellRow(command[:160] if command else "background shell", cell[1]))
        finished = crew.waits.pop(key, "")
        if finished and not output.startswith("Script running"):
            at_cell = next((i for i, shell in enumerate(crew.shells) if shell.cell == finished), None)
            if at_cell is not None:
                crew.shells[at_cell] = replace(crew.shells[at_cell], running=False, ended=at, status="completed" if output.startswith("Script completed") else "failed")

    def crew(self, path: Path) -> dict:
        held = self.folded(path, self.crew_rows, CodexCrew)
        subagents = [self.subagent_row(path, spawn) for spawn in held.subagents]
        return {AgentRow.skills: self.skills(Path(path)), AgentRow.shells: sum(shell.running for shell in held.shells), AgentRow.subagents: len(subagents),
                AgentRow.shell_rows: running_and_latest([shell.to_json() for shell in held.shells]), AgentRow.subagent_rows: running_and_latest(subagents),
                AgentRow.compacting: held.compacting}

    def effort(self, project: Path, transcript: Path | None = None) -> str:
        return self.configuration().effort

    def session(self, path: Path | None) -> dict:
        if path is None or not Path(path).is_file():
            return {}
        with Path(path).open("rb") as source:
            found = next((row for row in rows(source, Row.from_payload) if row.type == "session_meta"), None)
        return {AgentRow.parent: found.payload.parent_thread} if found else {}

    def tool_uses(self, row: Row) -> list[ToolCall]:
        payload = row.payload
        if row.type != "response_item" or payload.type not in ("function_call", "custom_tool_call"):
            return []
        given = payload.arguments if isinstance(payload.arguments, dict) else {}
        uses = [ToolCall.from_payload(payload.key, payload.name, row.at, given)]
        text = payload.argument_text
        if "tools.exec_command" not in text:
            return uses
        found = set(SKILL_READ.findall(text))
        if "/skills/$s/SKILL.md" in text:
            loop = SKILL_LOOP.search(text)
            if loop:
                found.update(word for word in loop.group(1).split() if word == "journal" or word.startswith("journal-"))
        return uses + [ToolCall(id="", name="Skill", at=row.at, skill=skill) for skill in sorted(found)]
