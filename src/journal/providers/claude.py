from journal.models.model_tier import ModelTier
from journal.support.refusal_command import RefusalCommand
from journal.providers.support.agent_tool_input import AgentToolInput
import shutil
import json
import os
import re
import shlex
import uuid
from pathlib import Path
from typing import Iterator

from journal.providers.support.line_count import LineCount
from journal.providers.support.peer_note import PeerNote
from journal.providers.support.claude_row import ClaudeRow
from journal.providers.support.profile_view import ProfileView
from journal.providers.provider import TAIL_BYTES, Provider
from journal.support.decision import Decision
from journal.support.hook import Hook
from journal.support.hook_type import HookType
from journal.support.response import Response
from journal.providers.support.turn import Turn
from journal.providers.support.capability import Capability
from journal.models.mcp_server import McpServer
from journal.providers.support.hooks_ready import HooksReady
from journal.providers.support.profile import Profile
from journal.support.agent_message import AgentMessage
from journal.support.job_cancel import JobCancel
from journal.support.job_schedule import JobSchedule
from journal.support.file_edit import FileEdit
from journal.support.file_read import FileRead
from journal.support.file_write import FileWrite
from journal.support.shell_line import ShellLine
from journal.support.skill_load import SkillLoad
from journal.support.subagent_dispatch import SubagentDispatch
from journal.support.user_question import UserQuestion
from journal.providers.support.claude_stream_row import ClaudeStreamRow
from journal.providers.support.worker_outcome import WorkerOutcome
from journal.support.choice import Choice
from journal.providers.support.status_line import StatusLine
from journal.providers.support.status_line_setting import StatusLineSetting
from journal.support.worktree import Worktree
from journal.providers.support.claude_trust import ClaudeTrust

CROSS_SESSION = re.compile(r"^<cross-session-message\s+([^>]*)>(.*?)</cross-session-message>$", re.S)
SENDER_NAME_PATTERN, SENDER_ADDRESS_PATTERN = re.compile(r'\bfrom-name="([^"]*)"'), re.compile(r'\bfrom="([^"]*)"')


# a refused shell command is swapped for one that prints the journal's line, so the agent reads it as the command's output and the
# program shows no hook error; any other refused tool is denied with the line
SHELL_TOOL = "Bash"

# the settings of this machine alone, never committed: the journal's hooks name this machine's paths, so they live here
LOCAL_SETTINGS = "settings.local.json"
# the settings a project commits for everyone: the journal's hooks are kept out, since another machine's paths do nothing here
SHARED_SETTINGS = "settings.json"


class Claude(Provider):
    """Claude Code keeps its state beside its config folder when one is named, else in the home folder; a run it would make in its own background runs in the foreground through the journal's runner instead; a worktree gets settings with the journal's hooks added, unless the worktree's checked-in settings carry the hooks already."""

    user_line_key = "systemMessage"
    name = "claude"
    title = "Claude Code"
    program = "claude"
    prompt_flags = ("--dangerously-skip-permissions",)
    home = ".claude"
    settings_file = LOCAL_SETTINGS
    foreign_settings = (SHARED_SETTINGS,)
    settings_extras = {"enableAllProjectMcpServers": True}
    project_folder = '"${CLAUDE_PROJECT_DIR:-.}"'
    capabilities = frozenset(Capability)
    session_variable = "CLAUDE_CODE_SESSION_ID"
    inherited_markers = ("CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_SHELL_PREFIX")
    question_model = "haiku"
    model_ranking = ("haiku", "sonnet", "opus")
    model_tiers = {"haiku": ModelTier.FAST, "sonnet": ModelTier.GENERAL, "opus": ModelTier.STRONGEST}
    settings_files = (".claude/settings.json", ".claude/settings.local.json", "~/.claude/settings.json")
    profile_suffix = ".md"
    default = True
    session_inbox = True
    context_limit_notice = "Context limit reached"
    compact_command = "/compact"
    controls = {
        "groups": [
            {"key": "model", "label": "Model", "choices": [{"value": v, "label": l, "command": f"/model {v}"} for v, l in (("opus", "Opus"), ("sonnet", "Sonnet"), ("haiku", "Haiku"), ("fable", "Fable"))]},
            {"key": "effort", "label": "Reasoning effort", "choices": [{"value": v, "label": l, "command": f"/effort {v}"} for v, l in (("low", "Low"), ("medium", "Medium"), ("high", "High"), ("xhigh", "Extra high"), ("max", "Maximum"))]},
            {"key": "context", "label": "Context window", "choices": [{"value": "compact", "label": "Compact context", "command": "/compact"}, {"value": "clear", "label": "Clear context", "command": "/clear"}]},
        ],
        "note": "Changes apply at once to this Claude Code session.",
    }
    decoders = {
        "Bash": lambda input: ShellLine(str(input.get("command", ""))),
        "Monitor": lambda input: ShellLine(str(input.get("command", ""))),
        "Edit": lambda input: FileEdit(Provider.file_paths(input), LineCount.lines(input.get("new_string")), LineCount.lines(input.get("old_string"))),
        "MultiEdit": lambda input: FileEdit(Provider.file_paths(input), *LineCount.edits(input.get("edits"))),
        "NotebookEdit": lambda input: FileEdit(Provider.file_paths(input), LineCount.lines(input.get("new_source"))),
        "Write": lambda input: FileWrite(str(input.get("file_path", "")), LineCount.lines(input.get("content"))),
        "Read": lambda input: FileRead(str(input.get("file_path", "")), bool(input.get("limit") or input.get("offset"))),
        "Skill": lambda input: SkillLoad(str(input.get("skill", ""))),
        "Agent": lambda input: Claude.subagent(input),
        "Task": lambda input: Claude.subagent(input),
        "SendMessage": lambda input: AgentMessage(str(input.get("to", "")), str(input.get("message", "")), str(input.get("summary", ""))),
        "AskUserQuestion": lambda input: UserQuestion(),
        "CronCreate": lambda input: JobSchedule(str(input.get("cron", "")), str(input.get("prompt", "")), bool(input.get("recurring", True))),
        "CronDelete": lambda input: JobCancel(str(input.get("id", ""))),
    }

    @staticmethod
    def subagent(input: AgentToolInput) -> SubagentDispatch:
        return SubagentDispatch(str(input.get("subagent_type", "")), str(input.get("model", "")), str(input.get("description", "")), str(input.get("prompt", "")), bool(input.get("run_in_background")))

    @staticmethod
    def config_folder() -> Path:
        return Path(os.environ.get("CLAUDE_CONFIG_DIR") or Path.home() / ".claude")

    @staticmethod
    def state_file() -> Path:
        configured = os.environ.get("CLAUDE_CONFIG_DIR")
        return Path(configured) / ".claude.json" if configured else Path.home() / ".claude.json"

    def folder_trusted(self, root: Path, folder: Path) -> None:
        ClaudeTrust(self.state_file()).trusted(folder)

    def profile_model(self, profile: ProfileView) -> str:
        return profile["model"]

    def transcript(self, project: Path, session: str) -> Path | None:
        path = self.config_folder() / "projects" / self.folder_name(project) / f"{session}.jsonl"
        return path if path.is_file() else None

    def copy_session(self, source: Path, target: Path, session: str) -> bool:
        if self.transcript(target, session) is not None:
            return True
        original = self.transcript(source, session)
        if original is None:
            return False
        copy = self.config_folder() / "projects" / self.folder_name(target) / original.name
        copy.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(original, copy)
        return True

    def latest_session(self, project: Path, start: float) -> str:
        folder = self.config_folder() / "projects" / self.folder_name(project)
        saved = [path for path in folder.glob("*.jsonl") if path.stat().st_mtime >= start] if folder.is_dir() else []
        return max(saved, key=lambda path: path.stat().st_mtime).stem if saved else ""

    def session_files(self, project: Path) -> list[Path]:
        folder = self.config_folder() / "projects" / self.folder_name(project)
        return list(folder.glob("*.jsonl")) if folder.is_dir() else []

    def session_name(self, path: Path) -> str:
        return path.stem

    def subagent_transcript(self, project: Path, parent: str, agent_id: str) -> Path | None:
        path = self.config_folder() / "projects" / self.folder_name(project) / parent / "subagents" / f"agent-{agent_id}.jsonl"
        return path if path.is_file() else None

    def turn_rows(self, rows: Iterator[tuple[int, dict]]) -> list[Turn]:
        return [turn for number, row in rows if (turn := self.turn(number, ClaudeRow.parsed(row)))]

    def turn(self, number: int, row: ClaudeRow) -> Turn | None:
        if row.type not in ("user", "assistant"):
            return None
        text = "\n".join(b.text for b in row.type_match("text"))
        results = row.type_match("tool_result")
        if results and not text.strip():
            text = "\n".join(b.outcome for b in results)
        uses = row.type_match("tool_use")
        if not text.strip() and not uses:
            return None
        type_name = row.turn_type
        steps = [self.operation(b.name, b.input).as_data() for b in uses]
        return Turn(number, "user" if type_name in ("human", "injected") else type_name, type_name, self.seconds(row.timestamp), text, [b.name for b in uses], steps)

    def turn_thoughts(self, project: Path, session: str) -> list[str]:
        path = self.transcript(project, session)
        if path is None:
            return []
        with path.open("rb") as file:
            start = max(0, path.stat().st_size - TAIL_BYTES)
            file.seek(start)
            lines = file.read().decode(errors="replace").splitlines()[1 if start else 0:]
        thoughts: list[str] = []
        for row in (ClaudeRow.parsed(json.loads(line)) for line in lines if line.startswith("{")):
            if row.is_prompt:
                thoughts = []
            elif row.type == "assistant":
                thoughts += [b.thinking for b in row.type_match("thinking")]
        return thoughts

    def texts(self, line: dict) -> list[str]:
        row = ClaudeRow.parsed(line)
        return [block.text for block in row.type_match("text") if block.text.strip()] if row.type == "assistant" else []

    def peer_messages(self, line: dict) -> list[PeerNote]:
        row = ClaudeRow.parsed(line)
        if not row.is_enqueued:
            return []
        arrived = CROSS_SESSION.match(row.queued.strip())
        if arrived is None:
            return []
        matched = SENDER_NAME_PATTERN.search(arrived[1]) or SENDER_ADDRESS_PATTERN.search(arrived[1])
        return [PeerNote(sender=matched[1] if matched else "another session", text=arrived[2].strip(), transcript_time=row.timestamp)]

    def interactive_command(self, choice: Choice, status: StatusLine, args: tuple[str, ...]) -> list[str]:
        skipped = [flag for flag in self.prompt_flags if choice.prompt_flags and flag not in args]
        return [self.program, *skipped, "--settings", status.settings(), *args]

    def launch_environment(self, runner: Path) -> dict[str, str]:
        return {"CLAUDE_CODE_SHELL_PREFIX": str(runner)}

    def resume(self, session: str) -> tuple[str, ...]:
        return ("--resume", session)

    def mcp_add_command(self, server: McpServer) -> list[str]:
        return [self.program, "mcp", "add", "-s", "local", "--transport", "http", server.name, server.url] if server.url else [self.program, "mcp", "add", "-s", "local", server.name, "--", server.command, *server.args]

    def mcp_remove_commands(self, name: str) -> list[list[str]]:
        return [[self.program, "mcp", "remove", name, "-s", scope] for scope in ("local", "project", "user")]

    def profile_text(self, profile: Profile, model: str, codex_model: str) -> str:
        return f"---\nname: {profile.name}\ndescription: {profile.description}\ntools: {profile.tools}\nkind: {profile.profile_type}\nmodel: {model}\ncodex-model: {codex_model}\n---\n\n{profile.body}\n"

    def write_mcp(self, project: Path, servers: list[McpServer]) -> Path:
        path = project / ".mcp.json"
        stored = json.loads(path.read_text()) if path.is_file() else {}
        path.write_text(json.dumps({**stored, "mcpServers": {server.name: server.shape() for server in servers}}, indent=2) + "\n")
        return path

    def hooks_ready(self, project: Path) -> HooksReady:
        return HooksReady.READY if self.is_wired(project) else HooksReady.UNWIRED

    def worker_command(self, brief: str, model: str, resume: str, session: str) -> list[str]:
        return ["claude", "-p", brief, "--model", model, "--dangerously-skip-permissions", "--output-format", "stream-json", "--verbose", *self.session_flags(resume, session)]

    @staticmethod
    def session_flags(resume: str, session: str) -> list[str]:
        if resume:
            return ["--resume", resume]
        return ["--session-id", session] if session else []

    def worker_settings_flags(self, path: Path) -> list[str]:
        return ["--settings", str(path)]

    def worker_hook_file(self, folder: Path, runtime: Path) -> Path:
        return runtime

    def worker_session(self, resume: str) -> str:
        return resume or str(uuid.uuid4())

    def worker_outcome(self, output: str, err: str) -> WorkerOutcome:
        answers = [(row.answer, row) for row in ClaudeStreamRow.lines(output) if row.answer is not None]
        if not answers:
            return WorkerOutcome(output.strip() or err.strip(), self.output_session(output, err))
        text, last = answers[-1]
        report = text.strip() or err.strip()
        return WorkerOutcome(report, last.session or self.output_session(output, err), report if last.is_error else "", sum(row.cost_dollars for _, row in answers))

    def reply(self, hook: Hook, decision: Decision, copy_key: str) -> Response:
        if decision.allowed and self.is_background_shell_call(hook):
            return self.foreground_run(hook, decision)
        return super().reply(hook, decision, copy_key)

    @staticmethod
    def is_background_shell_call(hook: Hook) -> bool:
        return hook.is_pre_tool_use() and hook.tool == SHELL_TOOL and bool(hook.input.get("run_in_background"))

    @staticmethod
    def foreground_run(hook: Hook, decision: Decision) -> Response:
        answer = {"hookEventName": hook.hook_type.value, "permissionDecision": "allow", "updatedInput": {**hook.input, "run_in_background": False}}
        return Response(200, {"hookSpecificOutput": {**answer, "additionalContext": decision.context} if decision.context else answer})

    def refused(self, hook: Hook, decision: Decision) -> Response:
        if hook.is_pre_tool_use() and hook.tool == SHELL_TOOL:
            return self.shell_refused(hook, decision)
        if hook.is_pre_tool_use():
            return Response(409, {"answer": {"hookSpecificOutput": {"hookEventName": hook.hook_type.value, "permissionDecision": "deny", "permissionDecisionReason": decision.reason}}, "error": decision.reason})
        if hook.hook_type == HookType.USER_PROMPT:
            return Response(409, {"answer": {"decision": "block", "reason": decision.reason}, "error": decision.reason})
        return super().refused(hook, decision)

    @staticmethod
    def shell_refused(hook: Hook, decision: Decision) -> Response:
        printing = {**hook.input, "command": RefusalCommand.build(decision.reason)}
        return Response(409, {"answer": {"hookSpecificOutput": {"hookEventName": hook.hook_type.value, "permissionDecision": "allow", "updatedInput": printing}}, "error": decision.reason})

    def output_session(self, output: str, err: str) -> str:
        return next((row.session for row in ClaudeStreamRow.lines(output) if row.session), "")

    def is_work_started(self, output: str) -> bool:
        return any(row.is_work for row in ClaudeStreamRow.lines(output))

    def worktree_hooks(self, root: Path, folder: Path, script: Path, command: str) -> None:
        if self.has_journal_hooks(folder / self.home / self.settings_file):
            return
        local = root / self.home / LOCAL_SETTINGS
        settings = json.loads(local.read_text()) if local.is_file() and not local.is_symlink() else {}
        hooks = {type_name: [block for block in blocks if not self.journal_paths(block)] for type_name, blocks in (settings.get("hooks") or {}).items()}
        for type_name, blocks in self.hook_block(command).items():
            hooks[type_name] = [*hooks.get(type_name, []), *blocks]
        settings_path = root / ".journal" / "runtime" / "worktree-settings" / "claude.json"
        settings_path.parent.mkdir(parents=True, exist_ok=True)
        settings_path.write_text(json.dumps({**settings, **self.settings_extras, "hooks": hooks, "statusLine": self.status_line(script)}, indent=2) + "\n")
        Worktree.linked(folder / self.home / LOCAL_SETTINGS, settings_path)

    def status_line(self, script: Path) -> StatusLineSetting:
        return StatusLineSetting(type="command", command=shlex.join(["sh", str(script.with_name("status.sh"))]), padding=0)

    def wire_hooks(self, project: Path, script: Path, command: str) -> Path:
        path = super().wire_hooks(project, script, command)
        settings = json.loads(path.read_text())
        if settings.get("statusLine") != self.status_line(script):
            settings["statusLine"] = self.status_line(script)
            path.write_text(json.dumps(settings, indent=2) + "\n")
        return path
