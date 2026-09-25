import json
import os
import re
import shutil
import time
from dataclasses import asdict, dataclass, field, replace
from datetime import datetime
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, PEER, SENT, SUMMARY, SUPERSEDED, TASK, TOOL, Turn
from providers.payload import AgentCall, AskCall, DISPLAYED, EVENTS, UsageWindow
from providers.base import BackgroundTasks, Provider, TypedRun, TypedRuns, WorkLinks, journal_hook, parsed, recent
from providers.payload import Dispatch, Hook, ToolCall
from providers.claude_rows import Block, Row
from resources.types import AgentRow
from engine.stored import read_json, tail, write_json, write_text
from engine import runtime
from engine.sessions import Sessions
from engine.drivers import ANSI, CHOICE, Driver
from engine.fields import Loaded

ASKS = frozenset({"AskUserQuestion"})
SENDS = "SendMessage"
SESSIONS = "uds:"
WINDOW, LONG_WINDOW, LONG_MARK = 200_000, 1_000_000, "[1m]"
STATUS_SCRIPT = "claude-status.sh"
HANDED = "channel-handed.json"
HANDED_KEPT = 20
HANDED_TEXT = 80
MOVED_ON = 4
TYPED_FOR = 300
CHANNEL_MARK = '<channel source="journal"'
BASH_INPUT = re.compile(r"^<bash-input>(.*)</bash-input>$", re.S)
COMMAND_NAME = re.compile(r"<command-name>(.*?)</command-name>", re.S)
COMMAND_ARGS = re.compile(r"<command-args>(.*?)</command-args>", re.S)
TYPED_OUTPUT = re.compile(r"<(bash-stdout|bash-stderr|local-command-stdout)>(.*?)</\1>", re.S)
KEPT_TYPED = 50
BACKGROUNDED = re.compile(r"(?:backgrounded by user with ID|running in background with ID): (\w+)")
TASK_ENDED = re.compile(r"<task-id>(\w+)</task-id>.*?<status>(\w+)</status>", re.S)
TASK_OK = "completed"
WORK_LINK = re.compile(r"https://(?:claude\.ai/(?:design|code/artifact|artifact)/|github\.com/[\w.-]+/[\w.-]+/pull/\d+|www\.figma\.com/)[^\s\"'<>)\]]*")
KEPT_LINKS = 10
EVALED = re.compile(r"&& eval '(.*)' < /dev/null && pwd -P", re.S)
RECORD_FILES = ("Read(./.journal/environments/*/*/*.md)", "Read(./.journal/project/*/*.md)")
STATUS_HOME = (".journal", "claude-status")
PLAN_WINDOWS = {"five_hour": ("5h", 300), "seven_day": ("7d", 10080)}
NOTIFIED = re.compile(r"<tool-use-id>([^<]+)</tool-use-id>.*?<status>([^<]+)</status>", re.S)
TASK_ID = re.compile(r"\b(?:ID:|task|agentId:) (\w+)")
MONITOR_LONGEST = 1800
MONITOR_DEFAULT = 300000
DISPATCHES = ("Agent", "Task")
QUIET_SUBAGENT = 600
SETTLE_BYTES = 65536



@dataclass(frozen=True)
class HandedLine(Loaded):
    line: str = ""
    at: float = 0.0


@dataclass(frozen=True)
class Handed(Loaded):
    lines: tuple[HandedLine, ...] = ()
    typed_until: float = 0.0

    def to_json(self) -> dict:
        return {"lines": [asdict(h) for h in self.lines], "typed_until": self.typed_until}


@dataclass
class Crew:
    uses: list = field(default_factory=list)
    window: list = field(default_factory=list)
    ids: dict = field(default_factory=dict)
    ended: dict = field(default_factory=dict)
    errors: dict = field(default_factory=dict)

SPEAKERS = {SUMMARY: SUMMARY, HUMAN: "user", AGENT: "agent"}
ORIGINS = {"peer": PEER, "task-notification": TASK}


def worth_opening(link: str) -> bool:
    _, _, file = link.partition("?file=")
    return not file or file.endswith(".html")


def typed_command(text: str) -> str | None:
    shell = BASH_INPUT.match(text)
    if shell:
        return f"!{shell[1]}"
    name = COMMAND_NAME.search(text)
    if not name:
        return None
    args = COMMAND_ARGS.search(text)
    return f"{name[1]} {args[1]}".strip() if args else name[1]


def monitor_end(finished: bool, notified: bool, done: float, deadline: float) -> float:
    if not finished:
        return 0.0
    return done if notified else deadline


def monitor_status(finished: bool, notified: bool, status: str) -> str:
    if not finished:
        return ""
    return status if notified else "expired"


class Claude(Provider):
    name = "claude"
    sleeping_tools = ("ScheduleWakeup",)
    echoes_typed = True
    tool_kinds = {**Provider.tool_kinds, "AskUserQuestion": AskCall}
    question_tools = frozenset({"AskUserQuestion"})
    briefing_file = "CLAUDE.md"
    skill_home = ".claude/skills"
    link_skills = True
    controls = {
        "groups": [
            {
                "key": "model",
                "label": "Model",
                "choices": [
                    {"value": "opus", "label": "Opus", "command": "/model opus"},
                    {"value": "sonnet", "label": "Sonnet", "command": "/model sonnet"},
                    {"value": "haiku", "label": "Haiku", "command": "/model haiku"},
                    {"value": "claude-fable-5-1", "label": "Fable", "command": "/model claude-fable-5-1"},
                ],
            },
            {
                "key": "effort",
                "label": "Reasoning effort",
                "choices": [
                    {"value": "auto", "label": "Auto", "command": "/effort auto"},
                    {"value": "low", "label": "Low", "command": "/effort low"},
                    {"value": "medium", "label": "Medium", "command": "/effort medium"},
                    {"value": "high", "label": "High", "command": "/effort high"},
                    {"value": "xhigh", "label": "Extra high", "command": "/effort xhigh"},
                    {"value": "max", "label": "Maximum", "command": "/effort max"},
                ],
            },
            {
                "key": "context",
                "label": "Context window",
                "choices": [
                    {"value": "compact", "label": "Compact context", "command": "/compact"},
                    {"value": "clear", "label": "Clear context", "command": "/clear"},
                ],
            },
        ],
        "note": "Changes apply immediately to this Claude Code session.",
    }

    def inbox(self, hook: Hook) -> str:
        return hook.inbox if hook.inbox and Path(hook.inbox).is_socket() else ""

    def setting(self, project: Path, key: str) -> str:
        found = ""
        for settings in (Path.home() / ".claude" / "settings.json", project / ".claude" / "settings.json", project / ".claude" / "settings.local.json"):
            saved = read_json(settings, {})
            found = (saved.get(key) if isinstance(saved, dict) else "") or found
        return found

    def effort(self, project: Path, transcript: Path | None = None) -> str:
        return self.reported(transcript, "effort").get("level", "") or self.setting(project, "effortLevel")

    def reported(self, transcript: Path | None, key: str) -> dict:
        status = read_json(Path.home().joinpath(*STATUS_HOME, f"{Path(transcript).stem}.json"), {}) if transcript else {}
        found = status.get(key) if isinstance(status, dict) else None
        return found if isinstance(found, dict) else {}

    def window(self, hook: Hook, used: int) -> int:
        configured = self.setting(Path(hook.cwd or "."), "model")
        return LONG_WINDOW if LONG_MARK in f"{hook.model}{configured}" or used > WINDOW else WINDOW

    def channel(self, project: Path, command: str) -> None:
        f = project / ".mcp.json"
        known = read_json(f, {})
        servers = known.get("mcpServers") or {}
        words = command.split()
        servers[SERVER] = {"command": "python3", "args": [str(Path(words[3]) / "journal.py"), "-m", "channel", words[3]]}
        write_text(f, json.dumps({**known, "mcpServers": servers}, indent=2) + "\n")

    def wire(self, project: Path, command: str) -> Path:
        self.shared(project)
        wired = super().wire(project, command)
        self.channel(project, command)
        settings = self.settings(project)
        if "statusLine" not in settings:
            script = Path(command.split()[1]).with_name(STATUS_SCRIPT)
            self.save(project, {**settings, "statusLine": {"type": "command", "command": f"sh {script}", "padding": 0}})
        settings = self.settings(project)
        permissions = settings.get("permissions") or {}
        deny = list(permissions.get("deny") or [])
        if any(rule not in deny for rule in RECORD_FILES):
            self.save(project, {**settings, "permissions": {**permissions, "deny": deny + [r for r in RECORD_FILES if r not in deny]}})
        return wired

    def usage(self, path: Path, now: float | None = None) -> list[UsageWindow] | None:
        limits = self.reported(path, "rate_limits")
        if not limits:
            return None
        windows = []
        for key, (label, minutes) in PLAN_WINDOWS.items():
            raw = limits.get(key)
            if not isinstance(raw, dict):
                continue
            try:
                windows.append(UsageWindow(key, label, float(raw.get("used_percentage")), minutes, self.moment(raw.get("resets_at"))))
            except (TypeError, ValueError):
                continue
        return windows

    def moment(self, value) -> int:
        if isinstance(value, (int, float)) or str(value).isdigit():
            return int(float(value))
        return int(datetime.fromisoformat(str(value).replace("Z", "+00:00")).timestamp())

    def present(self, project: Path) -> bool:
        return (project / ".claude").is_dir() or shutil.which("claude") is not None

    def config(self, project: Path) -> Path:
        return project / ".claude" / "settings.local.json"

    def hook_files(self, project: Path) -> list[Path]:
        return [Path.home() / ".claude" / "settings.json", project / ".claude" / "settings.json", self.config(project)]

    def shared(self, project: Path) -> None:
        f = project / ".claude" / "settings.json"
        had = read_json(f, None)
        if not isinstance(had, dict):
            return
        kept = {event: [b for b in blocks if not journal_hook(json.dumps(b))] for event, blocks in (had.get("hooks") or {}).items()}
        cleaned = {**had, "hooks": {event: blocks for event, blocks in kept.items() if blocks}}
        if STATUS_SCRIPT in json.dumps(cleaned.get("statusLine", "")):
            cleaned.pop("statusLine")
        if not cleaned["hooks"]:
            cleaned.pop("hooks")
        if cleaned != had:
            write_text(f, json.dumps(cleaned, indent=2) + "\n")

    def wiring(self, command: str) -> dict:
        return {"hooks": {event: [{"hooks": [{"type": "command", "command": command}]}] for event in (*EVENTS, DISPLAYED)}}

    def compacted(self, hook: Hook) -> bool:
        return hook.source == "compact"

    session_variable = "CLAUDE_CODE_SESSION_ID"
    session_markers = ("CLAUDECODE", "CLAUDE_PID", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_EXECPATH", "CLAUDE_CODE_CHILD_SESSION",
                       "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_SESSION_ATTENDED", "CLAUDE_CODE_MESSAGING_SOCKET", "CLAUDE_CODE_MESSAGING_TOKEN")

    def shell_wrapper(self, script: Path) -> dict:
        return {"CLAUDE_CODE_SHELL_PREFIX": str(script)}

    def row_of(self, raw: dict) -> Row:
        return Row.from_payload(raw)

    def work_links(self, path: Path) -> list[str]:
        newest = [link for link in reversed(self.folded(path, self.link_rows, WorkLinks).links) if worth_opening(link)]
        return list({link.partition("?")[0]: link for link in reversed(newest)}.values())[::-1]

    def link_rows(self, found: WorkLinks, row: Row) -> WorkLinks:
        if row.type != "assistant":
            return found
        for block in row.of_type("text"):
            fresh = [link.rstrip(".,;)") for link in WORK_LINK.findall(block.text)]
            found.links = [*(link for link in found.links if link not in fresh), *dict.fromkeys(fresh)][-KEPT_LINKS:]
        return found

    def background_tasks(self, path: Path) -> BackgroundTasks:
        return self.folded(path, self.task_rows, BackgroundTasks)

    def task_rows(self, tasks: BackgroundTasks, row: Row) -> BackgroundTasks:
        for block in row.of_type("tool_result") if row.type == "user" else ():
            for task in BACKGROUNDED.findall(block.result):
                tasks.started.setdefault(task, row.at)
        for text in [row.text or "", row.content or "", *(block.text for block in row.of_type("text"))]:
            if "<task-notification>" in text:
                for task, status in TASK_ENDED.findall(text):
                    tasks.ended.setdefault(task, row.at)
                    if status != TASK_OK:
                        tasks.failed.add(task)
        return tasks

    def typed_runs(self, path: Path) -> list[TypedRun]:
        return list(self.folded(path, self.typed_rows, TypedRuns).runs)

    def typed_rows(self, typed: TypedRuns, row: Row) -> TypedRuns:
        if row.type != "user" or row.text is None:
            return typed
        command = typed_command(row.text)
        if command is not None:
            typed.runs = [*typed.runs, TypedRun(row.at, command)][-KEPT_TYPED:]
            return typed
        printed = [text.strip() for _, text in TYPED_OUTPUT.findall(row.text) if text.strip()]
        if typed.runs and typed.runs[-1].output is None and TYPED_OUTPUT.search(row.text):
            typed.runs[-1].output = "\n".join(printed)
        return typed

    def shell_runs(self, path: Path) -> list[tuple[float, str]]:
        found = ((row.at, BASH_INPUT.match(row.text)) for row in self.recent(path) if row.type == "user" and row.text is not None)
        return [(at, match[1]) for at, match in found if match]

    def unwrapped_command(self, command: str) -> str:
        found = EVALED.search(command)
        return found[1].replace("'\"'\"'", "'") if found else command

    def dispatch(self, tool) -> Dispatch | None:
        if not isinstance(tool, AgentCall) or tool.name != "Agent":
            return None
        kind = tool.kind.strip().lower()
        return Dispatch(kind=kind, model=tool.model.strip(), model_supported=kind != "fork", description=tool.task.strip(), name_supported=True)

    def model(self, hook: Hook) -> str:
        path = hook.transcript
        if not path or not path.is_file():
            return hook.model
        return next((row.model for row in reversed(self.recent(path)) if row.model), hook.model)

    def context(self, hook: Hook) -> float | None:
        path = hook.transcript
        if not path or not path.is_file():
            return None
        used = next((row.tokens for row in reversed(self.recent(path)) if row.tokens is not None), None)
        return None if used is None else round(100 * used / self.window(hook, used), 1)

    def turn(self, row: Row) -> tuple | None:
        if row.type == "attachment" and row.queued.kind == "peer":
            row = replace(row, type="user", origin=row.queued, text=row.prompt, blocks=())
        if (row.sidechain and not row.agent_id) or row.type not in ("user", "assistant"):
            return None
        text = row.text if row.text is not None else "\n".join(block.text for block in row.of_type("text"))
        results = row.of_type("tool_result")
        if results and not text.strip():
            text = "\n".join(block.result for block in results)
        uses = [ToolCall.from_payload(block.id, block.name, row.at, block.input) for block in row.of_type("tool_use")]
        questions = [self.question_text(use) for use in uses if use.name in ASKS]
        if questions:
            text = "\n".join(part for part in (text, *questions) if part)
        tools = [f"Skill:{use.skill}" if use.name == "Skill" else use.name for use in uses]
        if not text.strip() and not tools:
            return None
        kind = self.kind(row, bool(results))
        who = SPEAKERS.get(kind, kind)
        if kind == PEER and row.origin.name and row.origin.sender.startswith(SESSIONS):
            who, text = f"{PEER}:{row.origin.name}:{row.origin.sender}", row.origin.body if row.origin.body else text
        sent = next((use for use in uses if use.name == SENDS and use.to), None)
        if sent:
            kind, who, text = PEER, f"{SENT}:{sent.to}", sent.message if sent.message else text
        asked = [use.id for use in uses if use.name in ASKS]
        answered = [block.tool_use_id for block in results]
        return who, text, kind, row.at, tools, row.parent, asked, answered

    def question_text(self, use: ToolCall) -> str:
        lines = (f"{question.text}  [{' / '.join(question.labels)}]" if question.labels else question.text for question in use.questions)
        return "\n".join(f"asked: {text}" for text in lines if text)

    def kind(self, row: Row, has_result: bool) -> str:
        if row.compact_summary:
            return SUMMARY
        if row.type == "assistant":
            return AGENT
        origin = row.origin.kind
        if origin in ORIGINS:
            return ORIGINS[origin]
        if has_result:
            return TOOL
        return INJECTED if row.meta else HUMAN

    def refine(self, turns: list[Turn]) -> list[Turn]:
        asked = set()
        for i, turn in enumerate(turns):
            asked.update(turn.asked)
            if turn.kind == TOOL and asked.intersection(turn.answered):
                turn.kind = HUMAN
                turn.who = "user"
            if turn.kind != HUMAN or not turn.parent:
                continue
            for previous in reversed(turns[:i]):
                if previous.kind == AGENT and previous.text.strip():
                    break
                if previous.kind == HUMAN and previous.parent == turn.parent:
                    previous.kind = SUPERSEDED
                    break
        return turns

    def tool_uses(self, row: Row) -> list[ToolCall]:
        return row.tool_calls

    def results(self, row: Row) -> list[Block]:
        return row.of_type("tool_result") if row.type == "user" and row.main else []

    def stopped(self, ended: dict, uses: list[ToolCall], ids: dict[str, str]) -> dict[str, tuple[str, float]]:
        tasks = {task: used for used, task in ids.items()}
        for use in (u for u in uses if u.name == "TaskStop"):
            stopped = tasks.get(use.task)
            if stopped and ended.get(stopped, ("returned",))[0] == "returned":
                ended[stopped] = ("stopped", use.at)
        return ended

    def refused_by_hook(self, block: Block) -> bool:
        return block.is_error and "hook error" in block.result

    def loaded(self, uses: list[ToolCall]) -> list[str]:
        return sorted({u.skill for u in uses if u.name == "Skill"} - {""})

    def skills(self, session: Path | None) -> list[str]:
        if session is None or not session.is_file():
            return []
        return sorted(self.folded(session, self.skill_names, set))

    def skill_names(self, names: set, row: Row) -> set:
        names.update(use.skill_loaded for use in self.tool_uses(row) if use.skill_loaded)
        return names

    def crew_rows(self, crew: "Crew", row: Row) -> "Crew":
        if self.starts_window(row):
            crew.window.clear()
        for use in self.tool_uses(row):
            crew.window.append(use)
            if use.name in (*DISPATCHES, "Monitor", "TaskStop") or use.name == "Bash" and use.background:
                crew.uses.append(use)
        if row.type == "queue-operation" and row.operation == "enqueue":
            crew.ended.update({used: (status, row.at) for used, status in NOTIFIED.findall(row.content)})
        for block in self.results(row):
            task = TASK_ID.search(block.result)
            if task:
                crew.ids[block.tool_use_id] = task.group(1)
            crew.ended.setdefault(block.tool_use_id, ("refused" if self.refused_by_hook(block) else "returned", row.at))
            if block.is_error:
                crew.errors.setdefault(block.tool_use_id, block.result.rpartition("hook error:")[2].strip())
        return crew

    def starts_window(self, row: Row) -> bool:
        return row.compact_summary

    def tokens_of(self, row: Row) -> int | None:
        return row.tokens

    def crew(self, path: Path) -> dict:
        held = self.folded(path, self.crew_rows, Crew)
        uses, ids = held.uses, held.ids
        ended = self.stopped(dict(held.ended), uses, ids)
        sessions = {}
        for meta in Path(path).with_suffix("").joinpath("subagents").glob("*.meta.json"):
            try:
                sessions[json.loads(meta.read_text()).get("toolUseId")] = meta.with_name(meta.name.replace(".meta.json", ".jsonl"))
            except (OSError, ValueError):
                continue
        now = time.time()
        subagents = []
        for use in (u for u in uses if u.name in DISPATCHES):
            session = sessions.get(use.id)
            status, done = ("refused", ended[use.id][1]) if use.id in held.errors else ended.get(use.id, ("", 0.0))
            written = session.stat().st_mtime if session is not None and session.is_file() else 0.0
            writing = now - written <= QUIET_SUBAGENT
            running = not status or writing and (status == "returned" or written > done)
            subagents.append({"id": use.id, "task_id": ids.get(use.id, ""), "task": use.description if use.description else "subagent", "type": use.subagent_type,
                              "model": use.model, "running": running, "at": use.at, "ended": 0.0 if running else done,
                              "status": "" if running else status, "refusal": held.errors.get(use.id),
                              "session": session.stem.removeprefix("agent-") if session else "", "skills": self.skills(session)})
        shells = []
        for use in (u for u in uses if u.name == "Bash" and u.background):
            status, done = ended.get(use.id, ("", 0.0))
            finished = status not in ("", "returned")
            shells.append({"id": use.id, "task_id": ids.get(use.id, ""), "command": use.command[:160], "task": use.description,
                           "running": not finished, "at": use.at, "ended": done if finished else 0.0, "status": status if finished else ""})
        monitors = []
        for use in (u for u in uses if u.name == "Monitor"):
            status, done = ended.get(use.id, ("", 0.0))
            notified = status not in ("", "returned")
            deadline = use.at + min((use.timeout_ms if use.timeout_ms else MONITOR_DEFAULT) / 1000, MONITOR_LONGEST)
            finished = notified or now > deadline
            monitors.append({"id": use.id, "task_id": ids.get(use.id, ""), "command": (use.command if use.command else use.url)[:160],
                             "task": use.description if use.description else "monitor", "running": not finished, "at": use.at,
                             "ended": monitor_end(finished, notified, done, deadline),
                             "status": monitor_status(finished, notified, status)})
        return {AgentRow.skills: self.loaded(held.window), AgentRow.shells: len(shells), AgentRow.subagents: len(subagents),
                AgentRow.monitors: len(monitors), AgentRow.shell_rows: recent(shells), AgentRow.subagent_rows: recent(subagents),
                AgentRow.monitor_rows: recent(monitors)}

    def stop_instruction(self, task: str) -> str:
        return f"run TaskStop with task_id {task} now"

    def conversation_file(self, conversation: str) -> Path | None:
        return next(iter(sorted((Path.home() / ".claude" / "projects").glob(f"*/{conversation}.jsonl"))), None)

    def subagent_transcript(self, path: Path, session: str) -> Path | None:
        found = Path(path).with_suffix("").joinpath("subagents", f"agent-{session}.jsonl")
        return found if found.is_file() else None

    def settling(self, path: Path) -> bool:
        for line in reversed(tail(path, SETTLE_BYTES)):
            raw = parsed(line)
            row = Row.from_payload(raw) if isinstance(raw, dict) and raw.get("message") else None
            if row and row.type in ("user", "assistant"):
                return row.type == "user" or (bool(row.blocks) and all(block.type == "thinking" for block in row.blocks))
        return False

    def thoughts(self, transcript: Path, offset: int) -> tuple[list[tuple[str, str]], int]:
        try:
            with open(transcript, "rb") as f:
                f.seek(offset)
                lines = f.read().split(b"\n")
        except OSError:
            return [], offset
        blocks: dict[str, list[Block]] = {}
        ends, at, done = [], offset, offset
        for line in lines[:-1]:
            at += len(line) + 1
            raw = parsed(line.decode(errors="replace"))
            if not isinstance(raw, dict):
                continue
            row = Row.from_payload(raw)
            if row.type == "assistant" and row.blocks:
                blocks.setdefault(row.message_id, []).extend(row.blocks)
                if row.of_type("tool_use"):
                    ends.append(row.message_id)
                    done = at
            elif row.type == "user":
                ends.append("")
                done = at
        found = []
        for key in dict.fromkeys(ends):
            parts = blocks.get(key, [])
            thought = "\n\n".join(part.thinking.strip() for part in parts if part.type == "thinking" and part.thinking.strip())
            if any(part.type == "text" for part in parts):
                found.append(("text", ""))
            elif thought:
                found.append(("thinking", thought))
        return found, done

    def is_subagent(self, hook) -> bool:
        return bool(hook.agent) or "subagents" in (hook.transcript.parts if hook.transcript else ())


ASKS_BEFORE = ("/model",)
CONFIRM_PROMPT = b"Entertoconfirm"
CONFIRM_WAIT = 4.0
CONFIRM_POLL = 0.25


SERVER = "journal"


def claude_state() -> Path:
    return Path(os.environ.get("CLAUDE_CONFIG_DIR") or Path.home()) / ".claude.json"


class ClaudeDriver(Driver):
    DISPLAY_HOOK = True
    SHELL = "!"
    INPUT_MARK = "❯".encode()
    AUTO_ARGS = ("--permission-mode", "auto")
    APPROVAL_FLAGS = frozenset({"--permission-mode", "--dangerously-skip-permissions"})
    SKIP_ARGS = ("--dangerously-skip-permissions",)
    RESUMING = {"--resume": 1, "-r": 1, "--continue": 0, "-c": 0}
    WORKTREE = ("--worktree", "-w")
    WORKTREES = (".claude", "worktrees")
    EXIT = "/exit"
    TAKES_OURS = ("--settings", json.dumps({"crossSessionInbound": "accept"}))
    CHANNEL = ("--dangerously-load-development-channels", f"server:{SERVER}")
    LISTENING = 15.0
    MOVE_TO_BACKGROUND = b"\x02"
    name = "claude"

    def command(self, args: list[str], cwd: Path | None = None) -> list[str]:
        return ["claude", *(() if self.TAKES_OURS[0] in args else self.TAKES_OURS), *self.CHANNEL, *args]

    @classmethod
    def trusted(cls, folder: Path) -> None:
        state = claude_state()
        known = read_json(state, {})
        projects = known.get("projects") or {}
        entry = projects.get(str(folder.resolve())) or {}
        approved = entry.get("enabledMcpjsonServers") or []
        wanted = {**entry, "hasTrustDialogAccepted": True, "enabledMcpjsonServers": approved if SERVER in approved else [*approved, SERVER]}
        if wanted != entry:
            write_json(state, {**known, "projects": {**projects, str(folder.resolve()): wanted}}, indent=2)

    @classmethod
    def latest(cls, project: Path) -> str:
        folder = Path.home() / ".claude" / "projects" / re.sub(r"[^A-Za-z0-9]", "-", str(project))
        return max(folder.glob("*.jsonl"), key=lambda path: path.stat().st_mtime, default=Path()).stem

    @classmethod
    def confirm(cls, printed: bytes) -> bytes:
        plain = b"".join(ANSI.sub(b"", printed).split())
        return b"\r" if cls.CHANNEL[0].encode() in plain and CHOICE.search(plain) else b""

    def run_command(self, command: str) -> bool:
        screen = runtime.session_file(self.record.root, self.session, "screen")
        start = screen.stat().st_size if screen.is_file() else 0
        typed = super().run_command(command)
        if typed and command.strip().startswith(ASKS_BEFORE):
            self._confirm_after(screen, start)
        return typed

    def _confirm_after(self, screen: Path, start: int) -> None:
        until = time.time() + CONFIRM_WAIT
        while time.time() < until:
            time.sleep(CONFIRM_POLL)
            with screen.open("rb") as shown:
                shown.seek(start)
                plain = b"".join(ANSI.sub(b"", shown.read()).split())
            if CONFIRM_PROMPT in plain:
                self._entered()
                return

    def _post(self, line: str) -> bool:
        return self._handed(line)

    def owns(self, row) -> bool:
        pid = Sessions(self.record.root).read(self.session).pid
        return bool(pid) and Path(row.inbox).stem == str(pid)

    def _handed(self, line: str) -> bool:
        root = self.record.root
        pid = Sessions(root).read(self.session).pid
        try:
            if not pid or not self.record.delivery.get("channel", True) or time.time() - runtime.channel_alive(root, pid).stat().st_mtime > self.LISTENING:
                return False
            if not self._delivering():
                return False
            with runtime.channel_queue(root, pid).open("a") as queue:
                queue.write(json.dumps({"content": line, "meta": {"from": "journal"}}) + "\n")
            handed = runtime.session_file(root, self.session, HANDED)
            held = Handed.from_json(read_json(handed, {}))
            write_json(handed, replace(held, lines=(*held.lines[-HANDED_KEPT:], HandedLine(line[:HANDED_TEXT], time.time()))).to_json())
            return True
        except OSError:
            return False

    @staticmethod
    def _channel_text(row: Row) -> str:
        if row.type == "attachment":
            return row.prompt
        if row.type == "queue-operation":
            return row.content
        if row.type != "user":
            return ""
        return row.text if row.text is not None else "\n".join(block.result for block in row.of_type("tool_result"))

    def _delivering(self) -> bool:
        handed = runtime.session_file(self.record.root, self.session, HANDED)
        held = Handed.from_json(read_json(handed, {}))
        if time.time() < held.typed_until:
            return False
        last = self.last_report()
        waiting = held.lines
        if not waiting or not last or not last.transcript:
            return True
        rows = Claude().recent(Path(last.transcript))
        arrived = [text for text in map(self._channel_text, rows) if CHANNEL_MARK in text]
        times = [row.at for row in rows]
        lost = [h for h in waiting if not any(h.line in text for text in arrived) and sum(1 for at in times if at > h.at) >= MOVED_ON]
        kept = tuple(h for h in waiting if not any(h.line in text for text in arrived) and h not in lost)
        write_json(handed, (Handed(typed_until=time.time() + TYPED_FOR) if lost else Handed(lines=kept)).to_json())
        return not lost
