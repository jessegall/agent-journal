import json
from functools import cache
from dataclasses import dataclass, field, replace
import re
import time
import shutil
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, TOOL
from providers.payload import AgentCall, AskCall, BashCall, EVENTS, Failure, PERMISSION, SKILL_READ, UsageWindow, bare
from providers.base import Asking, BackgroundTasks, Provider, parsed, recent
from providers.payload import Dispatch, Hook, ToolCall
from providers.codex_rows import Chunk, Payload, Row
from engine.fields import Loaded
from resources.types import AgentRow
from engine.stored import read_json, tail, write_text
from providers.drivers import ANSI, Driver
from typing import TypedDict

TOOLS = {"exec": "Bash", "exec_command": "Bash", "shell": "Bash", "shell_command": "Bash", "apply_patch": "Edit"}
SKILL_LOOP = re.compile(r"for\s+\w+\s+in\s+([^;]+);\s*do")
TAIL_BYTES = 262144
WINDOW_LABELS = {300: "5h", 1440: "1d", 10080: "7d"}
SPAWN_IN_SCRIPT = re.compile(r"tools\.\w*spawn_agent\(")
SCRIPT_FIELD = r"\b{}:\s*\"([^\"]*)\""
SPAWNED = re.compile(r'"agent_id":"([^"]+)"(?:,"nickname":"([^"]*)")?')
CONTEXT_CONTROLS = {"key": "context", "label": "Context window", "choices": [{"value": "compact", "label": "Compact context", "command": "/compact"},
                                                                             {"value": "clear", "label": "New conversation", "command": "/new"}]}
FAST_CONTROLS = {"key": "fast", "label": "Fast mode", "choices": [{"value": "switch", "label": "Turn fast mode on or off", "command": "/fast"}]}
EXITS_KEPT = 200
UNREAD_SCRIPT = "a script"
CELL_RUNNING = re.compile(r"^Script running with cell ID (\d+)")
CELL_ID = re.compile(r'"cell_id"\s*:\s*"?(\d+)')
DETACHED = re.compile(r"^(.*?)\s*(?:>\S*\s*(?:2>&1)?\s*)?&\s*(?:echo \$!)?\s*$", re.S)
EXEC_COMMAND = re.compile(r'exec_command\(\{\s*["\']?cmd["\']?\s*:\s*(["\'`])((?:(?!\1)[^\\]|\\.)*)\1')
TASK_EVENTS = re.compile(r'"type":"(task_started|task_complete)"')


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
    at: float = 0.0


@dataclass(frozen=True)
class SpawnAnswer(Loaded):
    agent_id: str = ""
    task_name: str = ""


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
        return 0
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
    tool_kinds = {**Provider.tool_kinds, "exec": CodexShell, "exec_command": CodexShell, "shell": CodexShell, "shell_command": CodexShell, "apply_patch": CodexShell, "spawn_agent": AgentCall,
                  "request_user_input": AskCall, "request_user_input_async": AskCall}
    briefing_file = "AGENTS.md"
    skill_home = ".agents/skills"
    retired_skill_homes = (".codex/skills",)

    def skill_load(self, name: str) -> str:
        return f"read {self.skill_home}/{name}/SKILL.md"

    @classmethod
    def control_options(cls, current_model: str) -> dict:
        return cls.controls_for(cls.catalog(), current_model if current_model else cls.configuration().model)

    @classmethod
    def control_choice(cls, action: str, value: str, current_model: str) -> dict:
        config = cls.configuration()
        model = current_model if current_model else config.model
        controls = cls.controls_for(cls.catalog(), model)
        group = next((group for group in controls["groups"] if group["key"] == action), None)
        selected = next((item for item in (group or {}).get("choices", []) if item["value"] == value), None)
        if not selected:
            from resources.base import Refused
            raise Refused(f"{cls.name} does not support {action} {value!r}")
        models = cls.catalog()
        commands = cls.commands(models, action, value, model, config.effort)
        return {"action": action, **selected, "commands": commands, "command": commands[0]}

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
        path = path if path else Path.home() / ".codex" / "models_cache.json"
        listed = read_json(path, dict, {}).get("models")
        return [CodexModel.from_json(model) for model in listed if CodexModel.listed(model)] if isinstance(listed, list) else []

    @classmethod
    def configuration(cls, path: Path | None = None) -> CodexConfig:
        path = path if path else Path.home() / ".codex" / "config.toml"
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
        if chosen in self.models():
            return chosen
        return self.configuration().model or chosen

    def models(self) -> tuple[str, ...]:
        return tuple(model.slug for model in self.catalog())

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

    def agent_types(self, project: Path, chosen: list) -> list[Path]:
        folder = project / ".codex" / "agents"
        written = []
        for kind, _ in chosen:
            sandbox = "workspace-write" if "Bash" in kind.tools and "Grep" not in kind.tools else "read-only"
            text = (f"name = {json.dumps(kind.name)}\ndescription = {json.dumps(kind.description)}\nsandbox_mode = {json.dumps(sandbox)}\n"
                    f"developer_instructions = {json.dumps(kind.instructions)}\n")
            target = folder / f"{kind.name}.toml"
            if not target.is_file() or target.read_text() != text:
                folder.mkdir(parents=True, exist_ok=True)
                write_text(target, text)
                written.append(target)
        return written

    def present(self, project: Path) -> bool:
        return (project / ".codex").is_dir() or shutil.which("codex") is not None

    def config(self, project: Path) -> Path:
        return project / ".codex" / "hooks.json"

    def hook_files(self, project: Path) -> list[Path]:
        return [Path.home() / ".codex" / "hooks.json", self.config(project)]

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}]
                          for event in EVENTS if event != PERMISSION}}

    def dispatch(self, tool) -> Dispatch | None:
        if not isinstance(tool, AgentCall):
            return None
        return Dispatch(kind=tool.kind.strip().lower(), task=tool.task.strip().lower(), model=tool.model.strip(), model_supported=True, models=self.models())

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
        for line in reversed(tail(path, TAIL_BYTES)):
            row = parsed(line, Row.from_payload)
            if row and row.type == "event_msg" and row.payload.type == "token_count":
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
        ends = [line for line in tail(path, TAIL_BYTES) if TASK_EVENTS.search(line)]
        return parsed(ends[-1], Failure.from_turn_end) if ends else None

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
        events = TASK_EVENTS.findall("".join(tail(found, TAIL_BYTES))) if found else []
        running = not events or events[-1] == "task_started"
        return running, 0.0 if running or not found else found.stat().st_mtime

    def spawned(self, path: Path, script: str, output: str, at: float) -> list[dict]:
        return [self.subagent_row(path, Spawned(script_field(script, "task_name", index) or found[2] or "subagent", script_field(script, "agent_type", index),
                                                script_field(script, "model", index), at), found[1])
                for index, found in enumerate(SPAWNED.finditer(output))]

    def subagent_row(self, path: Path, asked: Spawned, session: str) -> dict:
        running, ended = self.subagent_state(path, session) if session else (True, 0.0)
        return {"task": asked.task_name, "type": asked.agent_type, "model": asked.model, "session": session, "running": running, "at": asked.at,
                "ended": ended, "status": "" if running else "finished"}

    def spawned_session(self, path: Path, answer: SpawnAnswer, since: float) -> str:
        """The session of a subagent spawned directly: named in the answer, or found by its path among the rollouts written since."""
        if answer.agent_id or not answer.task_name:
            return answer.agent_id
        parent = path.stem[-36:]
        for found in path.parent.parent.glob("*/rollout-*.jsonl"):
            spawn = self.meta(found).source.subagent.thread_spawn if found.stat().st_mtime >= since else None
            if spawn and spawn.parent_thread_id == parent and spawn.agent_path == answer.task_name:
                return found.stem[-36:]
        return ""

    def crew(self, path: Path) -> dict:
        rows = [row for _, row in self.entries(path)]
        uses = [use for row in rows for use in self.tool_uses(row)]
        skills = sorted({use.skill for use in uses if use.name == "Skill"} - {""})
        subagent_rows = []
        shell_rows = []
        shells = 0
        compacting = False
        pending, spawning, asking = {}, {}, {}
        for row in rows:
            payload = row.payload
            if row.type == "response_item":
                name, key, text = payload.name, payload.key, payload.argument_text
                if name == "exec" and SPAWN_IN_SCRIPT.search(text):
                    spawning[key] = text
                elif name.endswith("spawn_agent"):
                    asking[key] = replace(Spawned.from_json(arguments_of(payload.arguments)), at=row.at)
                elif bare(name) in ("exec", "exec_command", "shell", "shell_command"):
                    pending[key] = text
                asked = asking.pop(key, None) if payload.type == "function_call_output" else None
                if asked:
                    subagent_rows.append(self.subagent_row(path, asked, self.spawned_session(path, SpawnAnswer.from_json(arguments_of(payload.output)), asked.at)))
                script = spawning.pop(key, None) if payload.type == "custom_tool_call_output" else None
                if script:
                    subagent_rows += self.spawned(path, script, payload.output, row.at)
                if payload.type == "custom_tool_call_output" and payload.output.startswith("Script running with cell ID"):
                    shells += 1
                    command = pending.get(key, "")
                    shell_rows.append({"command": command[:160] if command else "background shell", "cell": payload.output.split("ID", 1)[-1].strip()})
            if row.type == "compacted":
                compacting = True
            elif row.type == "response_item" and (payload.role == "assistant" or payload.type in ("reasoning", "function_call", "custom_tool_call")):
                compacting = False
        return {AgentRow.skills: skills, AgentRow.shells: shells, AgentRow.subagents: len(subagent_rows),
                AgentRow.shell_rows: recent(shell_rows), AgentRow.subagent_rows: recent(subagent_rows), AgentRow.compacting: compacting}

    def effort(self, project: Path, transcript: Path | None = None) -> str:
        return self.configuration().effort

    def session(self, path: Path | None) -> dict:
        if path is None or not Path(path).is_file():
            return {}
        return {AgentRow.parent: self.meta(path).parent_thread}

    def meta(self, path: Path) -> Payload:
        with Path(path).open() as source:
            for line in source:
                row = parsed(line, Row.from_payload)
                if row and row.type == "session_meta":
                    return row.payload
        return Payload()

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


class CodexDriver(Driver):
    PRODUCT = "the Codex CLI"
    AUTO_ARGS = ("--approve-for-me",)
    SKIP_ARGS = ("--dangerously-bypass-approvals-and-sandbox",)
    APPROVAL_FLAGS = frozenset({"-a", "--ask-for-approval", "--approve-for-me", "--full-auto", "--dangerously-bypass-approvals-and-sandbox"})
    TRUSTS_HOOKS = "--dangerously-bypass-hook-trust"
    READY = b"AskCodextodoanything"
    BUSY = b"esctointerrupt"
    ENTER_CAN_MISS = True
    ASKING = (b"Wouldyouliketorun", b"Yes,proceed", b"Allowcommand", b"Approve")
    ASKED_COMMAND = re.compile(r"Would you like to run the following command\?.*\$ (.+?)\s*›\s*1\.\s*Yes, proceed", re.S)
    ALLOW = b"y"
    ASKS_ON_SCREEN = True
    QUEUED = b"Messagestobesubmittedafternexttoolcall"
    RUNNING = b"backgroundterminalrunning"
    SEND_NOW = b"\x1b"
    TRUSTING = re.compile(rb"(?:Doyoutrustthecontentsofthisdirectory|Trustthisfolder\?).*?(\d)\.(?:Yes,continue|Trustandcontinue)", re.S)
    UPDATING = re.compile(rb"Updateavailable.*?(\d)\.Skip(?!until)", re.S)
    SCREEN_TAIL = 8192
    OPENING = "The journal started this session."
    CONFIRM_AFTER = 3.0
    RESUME = "resume"
    CONTINUING = ("continue", "--continue")
    name = "codex"

    @classmethod
    def opening(cls, printed: bytes) -> str:
        plain = b"".join(ANSI.sub(b"", printed).split())
        return cls.OPENING if cls.READY in plain and not cls.consent(printed) else ""

    @classmethod
    def consent(cls, printed: bytes) -> bytes:
        plain = b"".join(ANSI.sub(b"", printed).split())
        asked = max((*cls.TRUSTING.finditer(plain), *cls.UPDATING.finditer(plain)), key=lambda match: match.start(), default=None)
        return asked.group(1) + b"\r" if asked and asked.start() > plain.rfind(cls.READY) else b""

    def at_prompt(self) -> bool:
        plain = self._screen()
        return plain.rfind(self.READY) > plain.rfind(self.BUSY) and self.quiet_for() >= self.QUIET

    def asking(self) -> bool:
        plain = self._screen()
        return max(plain.rfind(phrase) for phrase in self.ASKING) > max(plain.rfind(self.READY), plain.rfind(self.BUSY))

    def asked(self) -> Asking | None:
        if not self.asking():
            return None
        found = list(self.ASKED_COMMAND.finditer(self._screen_text()))
        return Asking("exec_command", found[-1][1].strip()[:300] if found else "a command", time.time())

    def _screen_text(self) -> str:
        return self._printed_tail().decode(errors="replace")

    def _screen(self) -> bytes:
        return b"".join(self._printed_tail().split())

    def _printed_tail(self) -> bytes:
        try:
            tail = self.printed.read_bytes()[-self.SCREEN_TAIL:]
        except OSError:
            return b""
        return ANSI.sub(b"", tail)

    def command(self, args: list[str], cwd: Path | None = None) -> list[str]:
        trusted = ["-c", f'projects."{Path(cwd).resolve()}".trust_level="trusted"'] if cwd else []
        trust = [] if self.TRUSTS_HOOKS in args else [self.TRUSTS_HOOKS]
        return ["codex", *trust, *trusted, *self.carried_on(args)]

    @classmethod
    def carried_on(cls, args: list[str]) -> list[str]:
        rest = [arg for arg in args if arg not in cls.CONTINUING]
        if len(rest) < len(args):
            return [cls.RESUME, "--last", *rest]
        if "--resume" in args[:-1]:
            at = args.index("--resume")
            return [cls.RESUME, args[at + 1], *args[:at], *args[at + 2:]]
        return args

    @classmethod
    def resuming(cls, args: list[str]) -> bool:
        return cls.carried_on(args)[:1] == [cls.RESUME]

    @classmethod
    def resumed(cls, args: list[str], conversation: str) -> list[str]:
        if not conversation:
            return args
        rest = cls.carried_on(args)
        if rest[:1] == [cls.RESUME]:
            rest = rest[2:] if len(rest) > 1 and (rest[1] == "--last" or not rest[1].startswith("-")) else rest[1:]
        return [cls.RESUME, conversation, *rest]
