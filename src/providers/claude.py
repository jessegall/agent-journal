import json
import re
import shutil
import time
from dataclasses import asdict, dataclass, field, replace
from datetime import datetime
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, PEER, SENT, SUMMARY, SUPERSEDED, TASK, TOOL, PeerNote, Turn
from providers.payload import AgentCall, AskCall, Chunk, DISPLAYED, EVENTS, LoopCall, LoopEndCall, UsageWindow
from providers.base import BackgroundTasks, HookCommand, Provider, SubagentRow, TypedRun, TypedRuns, WorkLinks, journal_hook, running_and_latest
from providers.jsonl import complete_lines, last_lines, parsed_row, rows
from providers.payload import Dispatch, Hook, ToolCall
from providers.claude_rows import Block, Row
from resources.types import AgentRow
from engine.stored import JsonFiles, read_json, write_text

SENDS = "SendMessage"
SESSIONS = "uds:"
WINDOW, LONG_WINDOW, LONG_MARK = 200_000, 1_000_000, "[1m]"
STATUS_SCRIPT = "claude-status.sh"
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
SETTINGS_FILES = JsonFiles()
PLAN_WINDOWS = {"five_hour": ("5h", 300), "seven_day": ("7d", 10080)}
NOTIFIED = re.compile(r"<tool-use-id>([^<]+)</tool-use-id>.*?<status>([^<]+)</status>", re.S)
TASK_ID = re.compile(r"\b(?:ID:|task|agentId:) (\w+)")
MONITOR_LONGEST = 1800
MONITOR_DEFAULT = 300000
DISPATCHES = ("Agent", "Task")
QUIET_SUBAGENT = 600
SETTLE_BYTES = 65536
SERVER = "journal"


@dataclass
class Crew:
    uses: list = field(default_factory=list)
    window: list = field(default_factory=list)
    ids: dict = field(default_factory=dict)
    ended: dict = field(default_factory=dict)
    errors: dict = field(default_factory=dict)
    moved_to_background: set = field(default_factory=set)


@dataclass(frozen=True)
class SubagentFacts:
    tool: str
    file: str
    outcome: str


def subagent_facts(rows: list[Row]) -> SubagentFacts:
    calls = [(block.name, block.input) for row in rows if row.type == "assistant" for block in row.of_type("tool_use")]
    tool, given = calls[-1] if calls else ("", {})
    file = next((given.get(key) for key in ("file_path", "notebook_path", "path") if given.get(key)), "")
    answers = [block.text for row in rows if row.type == "assistant" for block in row.of_type("text") if block.text.strip()]
    return SubagentFacts(tool, file, answers[-1][:2000] if answers else "")


@dataclass(frozen=True)
class ClaudeSubagentRow(SubagentRow):
    task_id: str
    refusal: str | None
    skills: list[str]
    facts: SubagentFacts | None

    def to_json(self) -> dict:
        fields = asdict(self)
        facts = fields.pop("facts")
        return {**fields, **(facts or {})}


@dataclass(frozen=True)
class CommandRow:
    id: str
    task_id: str
    command: str
    task: str
    running: bool
    at: float
    ended: float
    status: str

    def to_json(self) -> dict:
        return asdict(self)


SPEAKERS = {SUMMARY: SUMMARY, HUMAN: "user", AGENT: "agent"}
ORIGINS = {"peer": PEER, "task-notification": TASK}


def message_row(raw: dict) -> Row | None:
    return Row.from_payload(raw) if raw.get("message") else None


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
    session_variable = "CLAUDE_CODE_SESSION_ID"
    session_markers = ("CLAUDECODE", "CLAUDE_PID", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_EXECPATH", "CLAUDE_CODE_CHILD_SESSION",
                       "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_SESSION_ATTENDED", "CLAUDE_CODE_MESSAGING_SOCKET", "CLAUDE_CODE_MESSAGING_TOKEN")
    home = ".claude"
    sleeping_tools = ("ScheduleWakeup",)
    echoes_typed = True
    background_wakes = True
    tool_kinds = {**Provider.tool_kinds, "AskUserQuestion": AskCall, "CronCreate": LoopCall, "CronDelete": LoopEndCall}
    question_tools = frozenset({"AskUserQuestion"})
    briefing_file = "CLAUDE.md"
    skill_home = ".claude/skills"
    shared_files = (".claude/settings.local.json",)
    worktrees = (".claude", "worktrees")
    link_skills = True
    applies_at_once = ("effort",)
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
        for settings in (Path.home() / self.home / "settings.json", project / self.home / "settings.json", project / self.home / "settings.local.json"):
            saved = SETTINGS_FILES.read(settings, dict, {})
            found = (saved.get(key) if isinstance(saved, dict) else "") or found
        return found

    def effort(self, project: Path, transcript: Path | None = None) -> str:
        return self.reported(transcript, "effort").get("level", "") or self.setting(project, "effortLevel")

    def reported(self, transcript: Path | None, key: str) -> dict:
        status = SETTINGS_FILES.read(Path.home().joinpath(*STATUS_HOME, f"{Path(transcript).stem}.json"), dict, {}) if transcript else {}
        found = status.get(key) if isinstance(status, dict) else None
        return found if isinstance(found, dict) else {}

    def window(self, hook: Hook, used: int) -> int:
        reported = self.reported(hook.transcript, "context_window").get("context_window_size")
        if isinstance(reported, int) and reported > 0:
            return reported
        configured = self.setting(Path(hook.cwd or "."), "model")
        return LONG_WINDOW if LONG_MARK in f"{hook.model}{configured}" or used > WINDOW else WINDOW

    def channel(self, project: Path, hook: HookCommand) -> None:
        f = project / ".mcp.json"
        known = read_json(f, dict, {})
        servers = known.get("mcpServers") or {}
        servers[SERVER] = {"command": "python3", "args": [str(Path(hook.root) / "journal.py"), "-m", "channel", hook.root]}
        write_text(f, json.dumps({**known, "mcpServers": servers}, indent=2) + "\n")

    def journal_typed(self, prompt: str) -> bool:
        return CHANNEL_MARK in prompt or super().journal_typed(prompt)

    def finish_wiring(self, project: Path, hook: HookCommand) -> None:
        self.shared(project)
        self.channel(project, hook)
        settings = self.settings(project)
        if "statusLine" not in settings:
            script = Path(hook.script).with_name(STATUS_SCRIPT)
            self.save(project, {**settings, "statusLine": {"type": "command", "command": f"sh {script}", "padding": 0}})
        settings = self.settings(project)
        permissions = settings.get("permissions") or {}
        deny = list(permissions.get("deny") or [])
        if any(rule not in deny for rule in RECORD_FILES):
            self.save(project, {**settings, "permissions": {**permissions, "deny": deny + [r for r in RECORD_FILES if r not in deny]}})

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

    def agent_file(self, project: Path, name: str) -> Path:
        return project / self.home / "agents" / f"{name}.md"

    def agent_text(self, kind, model: str) -> str:
        return f"---\nname: {kind.name}\ndescription: {kind.description}\ntools: {kind.tools}\nmodel: {model}\n---\n\n{kind.instructions}\n"

    def present(self, project: Path) -> bool:
        return (project / self.home).is_dir() or shutil.which("claude") is not None

    def config(self, project: Path) -> Path:
        return project / self.home / "settings.local.json"

    def hook_files(self, project: Path) -> list[Path]:
        return [Path.home() / self.home / "settings.json", project / self.home / "settings.json", self.config(project)]

    def shared(self, project: Path) -> None:
        f = project / self.home / "settings.json"
        had = read_json(f, dict, None)
        if had is None:
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

    @classmethod
    def display_chunk(cls, raw: dict) -> Chunk | None:
        chunk = Chunk.from_json(raw)
        return chunk if chunk.event == DISPLAYED else None

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
        if row.type == "user":
            for block in row.of_type("tool_result"):
                for task in BACKGROUNDED.findall(block.result):
                    tasks.started.setdefault(task, row.at)
        for text in [row.text or "", row.content or "", *(block.text for block in row.of_type("text"))]:
            if "<task-notification>" not in text:
                continue
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
        found = ((row.at, BASH_INPUT.match(row.text)) for row in self.recent_rows(path) if row.type == "user" and row.text is not None)
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
        return next((row.model for row in reversed(self.recent_rows(path)) if row.model), hook.model)

    def context(self, hook: Hook) -> float | None:
        path = hook.transcript
        if not path or not path.is_file():
            return None
        used = next((row.tokens for row in reversed(self.recent_rows(path)) if row.tokens is not None), None)
        return None if used is None else round(100 * used / self.window(hook, used), 1)

    def turn(self, row: Row, line: int) -> Turn | None:
        if row.type == "attachment" and row.queued.kind == "peer":
            row = replace(row, type="user", origin=row.queued, text=row.prompt, blocks=())
        if (row.sidechain and not row.agent_id) or row.type not in ("user", "assistant"):
            return None
        text = row.text if row.text is not None else "\n".join(block.text for block in row.of_type("text"))
        results = row.of_type("tool_result")
        if results and not text.strip():
            text = "\n".join(block.result for block in results)
        uses = [ToolCall.from_payload(block.id, block.name, row.at, block.input) for block in row.of_type("tool_use")]
        questions = [self.question_text(use) for use in uses if use.name in self.question_tools]
        if questions:
            text = "\n".join(part for part in (text, *questions) if part)
        tools = [f"Skill:{use.skill}" if use.name == "Skill" else use.name for use in uses]
        if not text.strip() and not tools:
            return None
        kind = self.kind(row, bool(results))
        peer = None
        if kind == PEER and row.origin.name and row.origin.sender.startswith(SESSIONS):
            peer, text = PeerNote(PEER, row.origin.sender, row.origin.name), row.origin.body if row.origin.body else text
        sent = next((use for use in uses if use.name == SENDS and use.to), None)
        if sent:
            kind, peer, text = PEER, PeerNote(SENT, sent.to), sent.message if sent.message else text
        asked = [use.id for use in uses if use.name in self.question_tools]
        answered = [block.tool_use_id for block in results]
        return Turn(line, SPEAKERS.get(kind, kind), text, kind=kind, at=row.at, tools=tools, parent=row.parent, asked=asked, answered=answered, peer=peer)

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
            for previous in (turns[j] for j in range(i - 1, -1, -1)):
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
            if BACKGROUNDED.search(block.result) and block.tool_use_id not in crew.moved_to_background:
                crew.moved_to_background.add(block.tool_use_id)
                crew.uses.extend(use for use in crew.window if use.id == block.tool_use_id and not use.background)
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
            sessions[read_json(meta, dict, {}).get("toolUseId")] = meta.with_name(meta.name.replace(".meta.json", ".jsonl"))
        now = time.time()
        subagents = []
        for use in (u for u in uses if u.name in DISPATCHES):
            session = sessions.get(use.id)
            status, done = ("refused", ended[use.id][1]) if use.id in held.errors else ended.get(use.id, ("", 0.0))
            written = session.stat().st_mtime if session is not None and session.is_file() else 0.0
            writing = now - written <= QUIET_SUBAGENT
            behind = use.background or use.id in held.moved_to_background
            running = not status or writing and (status == "returned" and behind or written > done)
            subagents.append(ClaudeSubagentRow(id=use.id, task=use.description if use.description else "subagent", type=use.subagent_type, model=use.model,
                                               running=running, at=use.at, ended=0.0 if running else done, status="" if running else status,
                                               session=session.stem.removeprefix("agent-") if session else "", task_id=ids.get(use.id, ""),
                                               refusal=held.errors.get(use.id), skills=self.skills(session),
                                               facts=subagent_facts(self.recent_rows(session)) if session else None).to_json())
        shells = []
        for use in (u for u in uses if u.name == "Bash" and (u.background or u.id in held.moved_to_background)):
            status, done = ended.get(use.id, ("", 0.0))
            finished = status not in ("", "returned")
            shells.append(CommandRow(use.id, ids.get(use.id, ""), use.command[:160], use.description, not finished, use.at,
                                     done if finished else 0.0, status if finished else "").to_json())
        monitors = []
        for use in (u for u in uses if u.name == "Monitor"):
            status, done = ended.get(use.id, ("", 0.0))
            notified = status not in ("", "returned")
            deadline = use.at + min((use.timeout_ms if use.timeout_ms else MONITOR_DEFAULT) / 1000, MONITOR_LONGEST)
            finished = notified or now > deadline
            monitors.append(CommandRow(use.id, ids.get(use.id, ""), (use.command if use.command else use.url)[:160], use.description if use.description else "monitor",
                                       not finished, use.at, monitor_end(finished, notified, done, deadline), monitor_status(finished, notified, status)).to_json())
        return {AgentRow.skills: self.skills_in(held.window), AgentRow.shells: len(shells), AgentRow.subagents: len(subagents),
                AgentRow.monitors: len(monitors), AgentRow.shell_rows: running_and_latest(shells),
                AgentRow.subagent_rows: running_and_latest(subagents), AgentRow.monitor_rows: running_and_latest(monitors)}

    def stop_instruction(self, task: str) -> str:
        return f"run TaskStop with task_id {task} now"

    def conversation_file(self, conversation: str) -> Path | None:
        return next(iter(sorted((Path.home() / self.home / "projects").glob(f"*/{conversation}.jsonl"))), None)

    def subagent_transcript(self, path: Path, session: str) -> Path | None:
        found = Path(path).with_suffix("").joinpath("subagents", f"agent-{session}.jsonl")
        return found if found.is_file() else None

    def settling(self, path: Path) -> bool:
        lines, _ = last_lines(path, SETTLE_BYTES)
        for row in rows(reversed(lines), message_row):
            if row.type in ("user", "assistant"):
                return row.type == "user" or (bool(row.blocks) and all(block.type == "thinking" for block in row.blocks))
        return False

    def thoughts(self, transcript: Path, offset: int) -> tuple[list[tuple[str, str]], int]:
        lines, _ = complete_lines(transcript, offset)
        blocks: dict[str, list[Block]] = {}
        ends, at, done = [], offset, offset
        for line in lines:
            at += len(line) + 1
            row = parsed_row(line, Row.from_payload)
            if row is None:
                continue
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
