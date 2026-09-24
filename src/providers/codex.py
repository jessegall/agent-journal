import json
from dataclasses import dataclass
import re
import shutil
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, TOOL
from providers.payload import AgentCall, AskCall, BashCall, EVENTS, PERMISSION, SKILL_READ, UsageWindow
from providers.base import Provider, parsed, recent
from providers.payload import Dispatch, Hook, ToolCall
from providers.codex_rows import Row
from engine.fields import Loaded
from resources.types import AgentRow
from engine.stored import tail
from engine.drivers import ANSI, MARK, Driver

TOOLS = {"exec": "Bash", "exec_command": "Bash", "shell": "Bash", "shell_command": "Bash", "apply_patch": "Edit"}
SKILL_LOOP = re.compile(r"for\s+\w+\s+in\s+([^;]+);\s*do")
TAIL_BYTES = 262144
WINDOW_LABELS = {300: "5h", 1440: "1d", 10080: "7d"}
SPAWN_IN_SCRIPT = re.compile(r"tools\.\w*spawn_agent\(")
SCRIPT_FIELD = r"\b{}:\s*\"([^\"]*)\""
SPAWNED = re.compile(r'"agent_id":"([^"]+)"(?:,"nickname":"([^"]*)")?')
CONTEXT_CONTROLS = {"key": "context", "label": "Context window", "choices": [{"value": "compact", "label": "Compact context", "command": "/compact"},
                                                                             {"value": "clear", "label": "New conversation", "command": "/new"}]}
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


@dataclass(frozen=True)
class CodexConfig:
    model: str = ""
    effort: str = ""


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


class Codex(Provider):
    name = "codex"
    question_tools = frozenset({"request_user_input"})
    tool_kinds = {**Provider.tool_kinds, "exec": CodexShell, "exec_command": CodexShell, "shell": CodexShell, "shell_command": CodexShell, "spawn_agent": AgentCall,
                  "request_user_input": AskCall}
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
    def controls_for(cls, models: list[CodexModel], current_model: str) -> dict:
        model = cls.matched(models, current_model)
        groups = [{"key": "model", "label": "Model", "choices": [item.choice for item in models]}]
        if model:
            groups.append({"key": "effort", "label": "Reasoning effort", "choices": [effort_choice(effort) for effort in model.efforts]})
        groups.append(CONTEXT_CONTROLS)
        note = "Changes apply immediately through the Codex model picker."
        if not models:
            note = "Codex model catalog unavailable; use /model in the Codex terminal."
        return {"groups": groups if models else [], "note": note}

    @classmethod
    def catalog(cls, path: Path | None = None) -> list[CodexModel]:
        path = path if path else Path.home() / ".codex" / "models_cache.json"
        try:
            data = json.loads(path.read_text())
        except (OSError, TypeError, ValueError):
            return []
        listed = data.get("models") if isinstance(data, dict) else None
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
        return CodexConfig(**found)

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
        for line in reversed(tail(path, TAIL_BYTES)):
            raw = parsed(line)
            row = Row.from_payload(raw) if isinstance(raw, dict) else None
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

    def subagent_state(self, path: Path, session: str) -> tuple[bool, float]:
        found = self.subagent_transcript(path, session)
        events = TASK_EVENTS.findall("".join(tail(found, TAIL_BYTES))) if found else []
        running = not events or events[-1] == "task_started"
        return running, 0.0 if running or not found else found.stat().st_mtime

    def spawned(self, path: Path, script: str, output: str, at: float) -> list[dict]:
        rows = []
        for index, found in enumerate(SPAWNED.finditer(output)):
            running, ended = self.subagent_state(path, found[1])
            rows.append({"task": script_field(script, "task_name", index) or found[2] or "subagent", "type": script_field(script, "agent_type", index),
                         "model": script_field(script, "model", index), "session": found[1], "running": running, "at": at, "ended": ended,
                         "status": "" if running else "finished"})
        return rows

    def crew(self, path: Path) -> dict:
        rows = [row for _, row in self.entries(path)]
        uses = [use for row in rows for use in self.tool_uses(row)]
        skills = sorted({use.skill for use in uses if use.name == "Skill"} - {""})
        subagent_rows = []
        shell_rows = []
        shells = 0
        compacting = False
        pending, spawning = {}, {}
        for row in rows:
            payload = row.payload
            if row.type == "response_item":
                name, key, text = payload.name, payload.key, payload.argument_text
                if name == "exec" and SPAWN_IN_SCRIPT.search(text):
                    spawning[key] = text
                elif name.endswith("spawn_agent"):
                    asked = Spawned.from_json(arguments_of(payload.arguments))
                    subagent_rows.append({"task": asked.task_name, "model": asked.model})
                elif name.rsplit(".", 1)[-1] in ("exec", "exec_command", "shell", "shell_command"):
                    pending[key] = text
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
        with Path(path).open() as source:
            for line in source:
                raw = parsed(line)
                row = Row.from_payload(raw) if isinstance(raw, dict) else None
                if row and row.type == "session_meta":
                    return {AgentRow.parent: row.payload.parent_thread}
        return {}

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
    AUTO_ARGS = ("--approve-for-me",)
    SKIP_ARGS = ("--dangerously-bypass-approvals-and-sandbox",)
    APPROVAL_FLAGS = frozenset({"-a", "--ask-for-approval", "--approve-for-me", "--full-auto", "--dangerously-bypass-approvals-and-sandbox"})
    TRUSTS_HOOKS = "--dangerously-bypass-hook-trust"
    READY = b"AskCodextodoanything"
    BUSY = b"esctointerrupt"
    ASKING = (b"Wouldyouliketorun", b"Yes,proceed", b"Allowcommand", b"Approve")
    SCREEN_TAIL = 8192
    OPENING = f"{MARK} The journal started this session."
    CONFIRM_AFTER = 3.0
    RESUME = "resume"
    CONTINUING = ("continue", "--continue")
    name = "codex"

    @classmethod
    def confirm(cls, printed: bytes) -> bytes:
        plain = b"".join(ANSI.sub(b"", printed).split())
        return f"{cls.OPENING}\r".encode() if cls.READY in plain else b""

    def at_prompt(self) -> bool:
        plain = self._screen()
        return plain.rfind(self.READY) > plain.rfind(self.BUSY) and self.quiet_for() >= self.QUIET

    def asking(self) -> bool:
        plain = self._screen()
        return max(plain.rfind(phrase) for phrase in self.ASKING) > max(plain.rfind(self.READY), plain.rfind(self.BUSY))

    def _screen(self) -> bytes:
        try:
            tail = self.printed.read_bytes()[-self.SCREEN_TAIL:]
        except OSError:
            return b""
        return b"".join(ANSI.sub(b"", tail).split())

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
