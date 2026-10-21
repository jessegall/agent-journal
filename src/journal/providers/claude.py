import json
import os
import re
import shlex
import uuid
from pathlib import Path
from typing import Iterator

from journal.events.agent.peer_message import PeerMessage
from journal.providers.support.claude_row import ClaudeRow
from journal.features.profiles.support.profile_view import ProfileView
from journal.providers.provider import TAIL_BYTES, Provider
from journal.providers.support.turn import Turn
from journal.providers.support.capability import Capability
from journal.models.mcp_server import McpServer
from journal.providers.support.hooks_ready import HooksReady
from journal.providers.support.profile import Profile
from journal.support.agent_message import AgentMessage
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

CROSS_SESSION = re.compile(r"^<cross-session-message\s+([^>]*)>(.*?)</cross-session-message>$", re.S)
SENDER_NAME_PATTERN, SENDER_ADDRESS_PATTERN = re.compile(r'\bfrom-name="([^"]*)"'), re.compile(r'\bfrom="([^"]*)"')


class Claude(Provider):
    name = "claude"
    prompt_flags = ("--dangerously-skip-permissions",)
    home = ".claude"
    settings_file = "settings.json"
    foreign_settings = ("settings.local.json",)
    settings_extras = {"enableAllProjectMcpServers": True}
    capabilities = frozenset(Capability)
    session_variable = "CLAUDE_CODE_SESSION_ID"
    inherited_markers = ("CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_SHELL_PREFIX")
    question_model = "haiku"
    settings_files = (".claude/settings.json", ".claude/settings.local.json", "~/.claude/settings.json")
    profile_suffix = ".md"
    default = True
    session_inbox = True
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
        "Edit": lambda input: FileEdit(Provider.file_paths(input)),
        "MultiEdit": lambda input: FileEdit(Provider.file_paths(input)),
        "NotebookEdit": lambda input: FileEdit(Provider.file_paths(input)),
        "Write": lambda input: FileWrite(str(input.get("file_path", ""))),
        "Read": lambda input: FileRead(str(input.get("file_path", "")), bool(input.get("limit") or input.get("offset"))),
        "Skill": lambda input: SkillLoad(str(input.get("skill", ""))),
        "Agent": lambda input: Claude.subagent(input),
        "Task": lambda input: Claude.subagent(input),
        "SendMessage": lambda input: AgentMessage(str(input.get("to", "")), str(input.get("message", ""))),
        "AskUserQuestion": lambda input: UserQuestion(),
    }

    @staticmethod
    def subagent(input: dict) -> SubagentDispatch:
        return SubagentDispatch(str(input.get("subagent_type", "")), str(input.get("model", "")), str(input.get("description", "")), str(input.get("prompt", "")), bool(input.get("run_in_background")))

    @staticmethod
    def config_folder() -> Path:
        return Path(os.environ.get("CLAUDE_CONFIG_DIR") or Path.home() / ".claude")

    def profile_model(self, profile: ProfileView) -> str:
        return profile["model"]

    def transcript(self, project: Path, session: str) -> Path | None:
        path = self.config_folder() / "projects" / self.folder_name(project) / f"{session}.jsonl"
        return path if path.is_file() else None

    def latest_session(self, project: Path, start: float) -> str:
        folder = self.config_folder() / "projects" / self.folder_name(project)
        saved = [path for path in folder.glob("*.jsonl") if path.stat().st_mtime >= start] if folder.is_dir() else []
        return max(saved, key=lambda path: path.stat().st_mtime).stem if saved else ""

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
        tools = [b.name for b in row.type_match("tool_use")]
        if not text.strip() and not tools:
            return None
        kind = row.kind
        return Turn(number, "user" if kind in ("human", "injected") else kind, kind, self.seconds(row.timestamp), text, tools)

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

    def peer_messages(self, line: dict) -> list[PeerMessage]:
        row = ClaudeRow.parsed(line)
        if not row.is_enqueued:
            return []
        arrived = CROSS_SESSION.match(row.queued.strip())
        if arrived is None:
            return []
        matched = SENDER_NAME_PATTERN.search(arrived[1]) or SENDER_ADDRESS_PATTERN.search(arrived[1])
        return [PeerMessage(sender=matched[1] if matched else "another session", text=arrived[2].strip())]

    def interactive_command(self, choice: Choice, status: StatusLine, args: tuple[str, ...]) -> list[str]:
        skipped = [flag for flag in self.prompt_flags if choice.prompt_flags and flag not in args]
        return ["claude", *skipped, "--settings", status.settings(), *args]

    def launch_environment(self, runner: Path) -> dict[str, str]:
        return {"CLAUDE_CODE_SHELL_PREFIX": str(runner)}

    def resume(self, session: str) -> tuple[str, ...]:
        return ("--resume", session)

    def profile_text(self, profile: Profile, model: str, codex_model: str) -> str:
        return f"---\nname: {profile.name}\ndescription: {profile.description}\ntools: {profile.tools}\nkind: {profile.kind}\nmodel: {model}\ncodex-model: {codex_model}\n---\n\n{profile.body}\n"

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

    def worker_session(self, resume: str) -> str:
        return resume or str(uuid.uuid4())

    def worker_outcome(self, output: str, err: str) -> WorkerOutcome:
        answers = [(row.answer, row) for row in ClaudeStreamRow.lines(output) if row.answer is not None]
        if not answers:
            return WorkerOutcome(output.strip() or err.strip(), self.output_session(output, err))
        text, last = answers[-1]
        report = text.strip() or err.strip()
        return WorkerOutcome(report, last.session or self.output_session(output, err), report if last.is_error else "")

    def output_session(self, output: str, err: str) -> str:
        return next((row.session for row in ClaudeStreamRow.lines(output) if row.session), "")

    def wire_hooks(self, project: Path, script: Path, command: str) -> Path:
        path = super().wire_hooks(project, script, command)
        settings = json.loads(path.read_text())
        status = shlex.join(["sh", str(script.with_name("status.sh"))])
        if settings.get("statusLine", {}).get("command") != status:
            settings["statusLine"] = {"type": "command", "command": status, "padding": 0}
            path.write_text(json.dumps(settings, indent=2) + "\n")
        return path
