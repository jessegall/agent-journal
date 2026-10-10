import json
import os
import re
import shlex
import shutil
import sys
import time
from dataclasses import asdict, dataclass, field, replace
from datetime import datetime
from pathlib import Path

from engine.transcript import AGENT, HUMAN, INJECTED, PEER, SENT, SUMMARY, SUPERSEDED, TASK, TOOL, PeerNote, Turn
from providers.payload import AgentCall, AskCall, Chunk, DISPLAYED, EVENTS, LoopCall, LoopEndCall, UsageWindow
from providers.tested import testing_piece
from providers.base import REFUSED, BackgroundTasks, HookCommand, OpenCommands, Provider, SubagentRow, TypedRun, TypedRuns, WorkLinks, journal_hook, running_and_latest
from providers.jsonl import lines_from, parsed_row, rows, tail_lines
from providers.payload import Dispatch, Hook, HookEvent, InputRewrite, RewrittenAnswer, ToolCall
from providers.claude_rows import Block, Row
from resources.types import AgentRow
from engine.proc import run
from engine.stored import JsonFiles, read_json, write_text
from providers.playwright import environment, runs_playwright, server_args, with_logins

SENDS = "SendMessage"
READING_KINDS = ("explore", "plan", "claude-code-guide")
WRITING_TOOLS = {"Edit", "Write", "NotebookEdit", "*"}
AGENT_TOOLS = re.compile(r"^tools:\s*(.+)$", re.M)
SESSIONS = "uds:"
WINDOW, LONG_WINDOW, LONG_MARK = 200_000, 1_000_000, "[1m]"
STATUS_SCRIPT = "claude-status.sh"
INTERRUPTED = "[Request interrupted by user"
CHANNEL_MARK = '<channel source="journal"'
CROSS_SESSION = re.compile(r"^<cross-session-message\s+([^>]*)>(.*?)</cross-session-message>$", re.S)
FROM_NAME, FROM_ADDRESS = re.compile(r'\bfrom-name="([^"]*)"'), re.compile(r'\bfrom="([^"]*)"')
BASH_INPUT = re.compile(r"^<bash-input>(.*)</bash-input>$", re.S)
COMMAND_NAME = re.compile(r"<command-name>(.*?)</command-name>", re.S)
COMMAND_ARGS = re.compile(r"<command-args>(.*?)</command-args>", re.S)
TYPED_OUTPUT = re.compile(r"<(bash-stdout|bash-stderr|local-command-stdout)>(.*?)</\1>", re.S)
KEPT_TYPED = 50
MODELS = (("opus", "Opus"), ("sonnet", "Sonnet"), ("haiku", "Haiku"), ("claude-fable-5-1", "Fable"))
BACKGROUNDED = re.compile(r"(?:backgrounded by user with ID|running in background with ID): (\w+)")
TASK_ENDED = re.compile(r"<task-id>(\w+)</task-id>.*?<status>(\w+)</status>", re.S)
TASK_OK = "completed"
BYPASSING = "bypassPermissions"
TASK_OUTPUT = re.compile(r"<task-id>(\w+)</task-id>(?:(?!</task-notification>).)*?<output-file>([^<]+)</output-file>", re.S)
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
BROWSER = "playwright"


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
    refusals = ("credit balance is too low", "usage limit reached", "invalid api key")
    name = "claude"
    session_variable = "CLAUDE_CODE_SESSION_ID"
    follow_up = 'SendMessage({{to: "{id}", message: "<the new work>"}})'
    session_markers = ("CLAUDECODE", "CLAUDE_PID", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_EXECPATH", "CLAUDE_CODE_CHILD_SESSION",
                       "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_SESSION_ATTENDED", "CLAUDE_CODE_MESSAGING_SOCKET", "CLAUDE_CODE_MESSAGING_TOKEN")
    home = ".claude"
    sleeping_tools = ("ScheduleWakeup",)
    echoes_typed = True
    background_wakes = True
    result_names_move = True
    tool_kinds = {**Provider.tool_kinds, "AskUserQuestion": AskCall, "CronCreate": LoopCall, "CronDelete": LoopEndCall}
    question_tools = frozenset({"AskUserQuestion"})
    briefing_file = "CLAUDE.md"
    briefing_import = "AGENTS.md"
    skill_home = ".claude/skills"
    shared_files = (".claude/settings.local.json",)
    worktrees = (".claude", "worktrees")
    link_skills = True
    applies_at_once = ("effort",)
    dispatch_default = "sonnet"
    controls = {
        "groups": [
            {
                "key": "model",
                "label": "Model",
                "choices": [{"value": value, "label": label, "command": f"/model {value}"} for value, label in MODELS],
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

    @classmethod
    def ask_argv(cls, prompt: str) -> tuple[str, ...]:
        return ("claude", "-p", "--model", cls.dispatch_default, prompt)

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
        servers[SERVER] = {"command": sys.executable, "args": [str(hook.root / "journal.py"), "-m", "channel", str(hook.root)]}
        write_text(f, json.dumps({**known, "mcpServers": servers}, indent=2) + "\n")

    def browser_logins(self, project: Path, storage: Path) -> bool:
        """Starts the project's Playwright server from the saved logins, and every other Playwright tool through the agent's environment."""
        return any([self._playwright_server(project, storage), self._playwright_environment(project, storage)])

    def _playwright_server(self, project: Path, storage: Path) -> bool:
        f = project / ".mcp.json"
        known = read_json(f, dict, {})
        servers = known.get("mcpServers") or {}
        name = next((key for key, server in servers.items() if runs_playwright(server)), BROWSER)
        had = servers.get(name) or {"type": "stdio", "command": "npx", "args": server_args(storage)}
        wanted = {**had, "args": with_logins(had.get("args") or [], storage)}
        if servers.get(name) == wanted:
            return False
        write_text(f, json.dumps({**known, "mcpServers": {**servers, name: wanted}}, indent=2) + "\n")
        return True

    def _playwright_environment(self, project: Path, storage: Path) -> bool:
        f = self.config(project)
        known = read_json(f, dict, {})
        env = known.get("env") or {}
        wanted = {**env, **environment(storage)}
        if env == wanted:
            return False
        write_text(f, json.dumps({**known, "env": wanted}, indent=2) + "\n")
        return True

    def serve_mcp(self, project: Path, name: str, url: str, headers_helper: str = "") -> bool:
        f = project / ".mcp.json"
        known = read_json(f, dict, {})
        servers = known.get("mcpServers") or {}
        wanted = {key: value for key, value in {"type": "http", "url": url, "headersHelper": headers_helper}.items() if value}
        if servers.get(name) == wanted:
            return False
        write_text(f, json.dumps({**known, "mcpServers": {**servers, name: wanted}}, indent=2) + "\n")
        return True

    def mcp_servers(self, project: Path) -> dict[str, str]:
        own = read_json(Path.home() / ".claude.json", dict, {})
        listed = [read_json(project / ".mcp.json", dict, {}), own, (own.get("projects") or {}).get(str(project)) or {}]
        servers = {name: server for found in listed for name, server in (found.get("mcpServers") or {}).items() if isinstance(server, dict)}
        return {name: str(server.get("url", "")) for name, server in servers.items()}

    def drop_mcp(self, project: Path, name: str) -> bool:
        f = project / ".mcp.json"
        known = read_json(f, dict, {})
        servers = known.get("mcpServers") or {}
        if name not in servers:
            return False
        write_text(f, json.dumps({**known, "mcpServers": {key: one for key, one in servers.items() if key != name}}, indent=2) + "\n")
        return True

    def wiring_trouble(self, project: Path) -> str:
        found = super().wiring_trouble(project)
        if found:
            return found
        python = ((read_json(project / ".mcp.json", dict, {}).get("mcpServers") or {}).get(SERVER) or {}).get("command", "")
        if not (python and Path(python).exists()):
            return f"its channel runs {python or 'no Python'}, which is gone: reinstall: re-run install.sh"
        if run([python, "-c", "import sys; print(sys.version_info >= (3, 10))"], timeout=10).strip() != "True":
            return f"its channel runs {python or 'no Python'}, which is not Python 3.10 or newer"
        return ""

    def interrupted_by_user(self, transcript: Path) -> bool:
        for line in reversed(tail_lines(transcript, 16000).lines):
            found = parsed_row(line, self.row_of)
            if found is None or found.type != "user":
                continue
            words = [found.text or "", *(block.text for block in found.blocks if block.type == "text")]
            return any(word.startswith(INTERRUPTED) for word in words)
        return False

    def journal_typed(self, prompt: str) -> bool:
        return CHANNEL_MARK in prompt or super().journal_typed(prompt)

    def finish_wiring(self, project: Path, hook: HookCommand) -> None:
        self.shared(project)
        self.channel(project, hook)
        settings = self.settings(project)
        if "statusLine" not in settings:
            script = hook.script.with_name(STATUS_SCRIPT)
            self.save(project, {**settings, "statusLine": {"type": "command", "command": shlex.join(["sh", str(script)]), "padding": 0}})
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

    def model_labels(self) -> dict[str, str]:
        return dict(MODELS)

    def offers(self, model: str) -> bool:
        return model in self.models() or model.startswith("claude-")

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

    def rewritten(self, hook: Hook, command: str, answered: dict) -> dict:
        if hook.permission_mode != BYPASSING:
            return answered
        return RewrittenAnswer(answered, InputRewrite(hook.tool.tool_input, command)).to_json()

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

    def command_is_open(self, path: Path, tool_use: str = "") -> bool:
        opened = self.folded(path, self.open_command_rows, OpenCommands)
        if tool_use in opened.asked:
            return tool_use not in opened.answered
        return not opened.asked or any(use not in opened.answered for use in opened.asked)

    def open_command_rows(self, opened: OpenCommands, row: Row) -> OpenCommands:
        opened.asked.update({use.id: use.command for use in self.tool_uses(row) if row.type == "assistant" and use.name == "Bash"})
        opened.answered.update(block.tool_use_id for block in self.results(row))
        return opened

    def background_tasks(self, path: Path) -> BackgroundTasks:
        return self.folded(path, self.task_rows, BackgroundTasks)

    def task_rows(self, tasks: BackgroundTasks, row: Row) -> BackgroundTasks:
        tasks.used.update({use.id: use.command for use in self.tool_uses(row) if row.type == "assistant" and use.name == "Bash" and testing_piece(use.command)})
        for block in row.of_type("tool_result") if row.type == "user" else []:
            self.started_task(tasks, block, row.at)
        for text in [row.text or "", row.content or "", *(block.text for block in row.of_type("text"))]:
            self.ended_tasks(tasks, text, row.at)
        return tasks

    def started_task(self, tasks: BackgroundTasks, block: Block, at: float) -> None:
        for task in BACKGROUNDED.findall(block.result):
            tasks.started.setdefault(task, at)
            if block.tool_use_id in tasks.used:
                tasks.commands.setdefault(task, tasks.used[block.tool_use_id])

    def ended_tasks(self, tasks: BackgroundTasks, text: str, at: float) -> None:
        if "<task-notification>" not in text:
            return
        tasks.outputs.update(TASK_OUTPUT.findall(text))
        for task, status in TASK_ENDED.findall(text):
            tasks.ended.setdefault(task, at)
            if status != TASK_OK:
                tasks.failed.add(task)

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

    def dispatch(self, tool, project: Path) -> Dispatch | None:
        if not isinstance(tool, AgentCall) or tool.name != "Agent":
            return None
        kind = tool.kind.strip().lower()
        return Dispatch(kind=kind, model=tool.model.strip(), model_supported=kind != "fork", description=tool.task.strip(), name_supported=True,
                        prompt=tool.prompt, read_only=self.reads_only(project, tool.kind.strip()))

    def reads_only(self, project: Path, kind: str) -> bool:
        if kind.lower() in READING_KINDS:
            return True
        profile = self.agent_file(project, kind)
        tools = AGENT_TOOLS.search(profile.read_text()) if profile.is_file() else None
        return bool(tools) and not WRITING_TOOLS & {tool.strip() for tool in tools[1].split(",")}

    def model(self, hook: Hook) -> str:
        chosen = self.reported(hook.transcript, "model").get("id")
        if isinstance(chosen, str) and chosen:
            return chosen
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

    def start_refusal(self, folder: Path) -> str:
        path = folder / ".claude" / "settings.json"
        if not path.is_file():
            return ""
        try:
            settings = json.loads(path.read_text())
        except ValueError:
            return f"{path} is not valid JSON, so Claude Code would stop a helper at start with a dialog it cannot answer: fix the file first"
        if not isinstance(settings, dict) or not isinstance(settings.get("hooks", {}), dict):
            return (f"{path} holds hooks that are not an object, so Claude Code would stop a helper at start with a dialog it cannot answer: "
                    f"make hooks an object or take it out of the file first")
        return ""

    def turn(self, row: Row, line: int) -> Turn | None:
        if row.type == "attachment" and row.queued.kind == "peer":
            row = replace(row, type="user", origin=row.queued, text=row.prompt, blocks=())
        if row.type == "attachment" and CROSS_SESSION.match(row.prompt.strip()):
            row = replace(row, type="user", text=row.prompt, blocks=())
        if row.type == "queue-operation" and CROSS_SESSION.match(row.content.strip()):
            row = replace(row, type="user", text=row.content, blocks=())
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
        cross = CROSS_SESSION.match(text.strip()) if kind in (HUMAN, INJECTED) else None
        if cross:
            sender = FROM_ADDRESS.search(cross[1])
            named = FROM_NAME.search(cross[1])
            address = sender[1] if sender else ""
            kind, peer, text = PEER, PeerNote(PEER, address, named[1] if named else address), cross[2].strip()
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
            crew.ended.setdefault(block.tool_use_id, (REFUSED if self.refused_by_hook(block) else "returned", row.at))
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
            session = sessions.get(use.id) or self.session_of_task(path, ids.get(use.id, ""))
            status, done = (REFUSED, ended[use.id][1]) if use.id in held.errors else ended.get(use.id, ("", 0.0))
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

    def crew_stamp(self, path: Path) -> tuple:
        folder = Path(path).with_suffix("").joinpath("subagents")
        try:
            return tuple(sorted((entry.name, entry.stat().st_size) for entry in os.scandir(folder) if entry.name.endswith((".jsonl", ".meta.json"))))
        except OSError:
            return ()

    def session_of_task(self, path: Path, task: str) -> Path | None:
        """The conversation file of a subagent found by the id its launch answered with, for one whose meta file names another tool use, as a resumed one's does."""
        found = Path(path).with_suffix("").joinpath("subagents", f"agent-{task}.jsonl") if task else None
        return found if found is not None and found.is_file() else None

    def stop_instruction(self, task: str) -> str:
        return f"run TaskStop with task_id {task} now"

    def scratch_of(self, folder: Path) -> Path | None:
        return Path("/private/tmp" if sys.platform == "darwin" else "/tmp") / f"claude-{os.getuid()}" / re.sub(r"[^A-Za-z0-9]", "-", str(Path(folder).resolve()))

    def conversation_file(self, conversation: str) -> Path | None:
        return next(iter(sorted((Path.home() / self.home / "projects").glob(f"*/{conversation}.jsonl"))), None)

    def subagent_transcript(self, path: Path, session: str) -> Path | None:
        found = Path(path).with_suffix("").joinpath("subagents", f"agent-{session}.jsonl")
        return found if found.is_file() else None

    def settling(self, path: Path) -> bool:
        lines = tail_lines(path, SETTLE_BYTES).lines
        for row in rows(reversed(lines), Row.from_payload):
            if row.type in ("user", "assistant"):
                return row.type == "user" or (bool(row.blocks) and all(block.type == "thinking" for block in row.blocks))
        return False

    def thoughts(self, transcript: Path, offset: int) -> tuple[list[tuple[str, str]], int]:
        read = lines_from(transcript, offset)
        blocks: dict[str, list[Block]] = {}
        ends, at, done = [], read.start, read.start
        for line in read.lines:
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
