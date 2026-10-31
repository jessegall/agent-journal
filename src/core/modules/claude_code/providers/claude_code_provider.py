import json
from collections.abc import Mapping, Sequence
from pathlib import Path

from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.tool_type import ToolType
from core.base.journal_home import JournalHome
from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.helper_outcome import HelperOutcome
from core.base.provider.hook_file import HookFile
from core.base.provider.hook_trust import HookTrust
from core.base.provider.launch import Launch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.model_tier import ModelTier
from core.base.provider.program_hooks import ProgramHooks
from core.base.provider.program_model import ProgramModel
from core.base.provider.provider import Provider
from core.base.provider.refusal_style import RefusalStyle
from core.base.provider.session_line import SessionLine
from core.base.provider.transcript_row import TranscriptRow
from core.base.type_guards import is_list, is_mapping
from core.modules.claude_code.providers.support.claude_folder_name import ClaudeFolderName
from core.modules.claude_code.providers.support.claude_stream_row import ClaudeStreamRow
from core.modules.claude_code.providers.support.claude_inbox import ClaudeInbox
from core.modules.claude_code.providers.support.claude_trust import ClaudeTrust

CONFIG_VARIABLE = "CLAUDE_CONFIG_DIR"
TRANSCRIPT_AUTHORS = ("user", "assistant")


class ClaudeCodeProvider(Provider):
    """Anthropic's Claude Code: hooks in .claude/settings.local.json, sessions under its config folder's projects, a
    session id the journal chooses, and a state file that records the folders it trusts."""

    name = "claude"
    title = "Claude Code"
    executable = "claude"
    hook_events = {"SessionStart": HookEventName.SESSION_START, "UserPromptSubmit": HookEventName.PROMPT,
                   "PreToolUse": HookEventName.PRE_TOOL_USE, "PostToolUse": HookEventName.POST_TOOL_USE,
                   "PostToolUseFailure": HookEventName.POST_TOOL_USE_FAILURE, "PreCompact": HookEventName.COMPACT,
                   "Stop": HookEventName.STOP, "StopFailure": HookEventName.STOP_FAILURE,
                   "SubagentStart": HookEventName.SESSION_START, "SubagentStop": HookEventName.STOP,
                   "SessionEnd": HookEventName.SESSION_END, "MessageDisplay": HookEventName.MESSAGE_DISPLAY}
    subagent_events = ["SubagentStart", "SubagentStop", "PreToolUse", "PostToolUse", "PostToolUseFailure"]
    line_events = [HookEventName.SESSION_START, HookEventName.PROMPT, HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE]
    refusals = {HookEventName.PRE_TOOL_USE: RefusalStyle.DENY, HookEventName.PROMPT: RefusalStyle.BLOCK, HookEventName.STOP: RefusalStyle.BLOCK}
    tool_categories = {"Bash": ToolType.SHELL, "Monitor": ToolType.SHELL, "Edit": ToolType.EDIT, "MultiEdit": ToolType.EDIT,
                       "NotebookEdit": ToolType.EDIT, "Write": ToolType.NEW_FILE, "Read": ToolType.READ, "Grep": ToolType.SEARCH,
                       "Glob": ToolType.SEARCH, "Agent": ToolType.AGENT, "Task": ToolType.AGENT,
                       "AskUserQuestion": ToolType.ASK_USER}
    hook_file = HookFile(Path(".claude/settings.local.json"), {})
    session_variable = "CLAUDE_CODE_SESSION_ID"
    markers = ["CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_SHELL_PREFIX"]
    models = [ProgramModel("haiku", ModelTier.FAST), ProgramModel("sonnet", ModelTier.GENERAL), ProgramModel("opus", ModelTier.STRONGEST)]

    def session_command(self, launch: Launch) -> LaunchCommand:
        skip = ["--dangerously-skip-permissions"] if launch.skip_prompts else []
        arguments = [self.executable, "--model", launch.model, *skip, *launch.session.arguments(self)]
        return LaunchCommand(arguments, launch.folder, launch.variables, launch.session.session)

    def helper_command(self, launch: HelperLaunch) -> LaunchCommand:
        arguments = [self.executable, "-p", launch.brief, "--model", launch.model, "--dangerously-skip-permissions",
                     "--output-format", "stream-json", "--verbose", *launch.session.arguments(self)]
        return LaunchCommand(arguments, launch.folder, launch.variables, launch.session.session)

    def new_session_arguments(self, session: str) -> Sequence[str]:
        return ["--session-id", session]

    def resumed_arguments(self, session: str) -> Sequence[str]:
        return ["--resume", session]

    def helper_outcome(self, output: str, errors: str) -> HelperOutcome:
        rows = list(ClaudeStreamRow.rows(output))
        session = next((row.session for row in rows if row.session), "")
        results = [row for row in rows if row.row_type == "result"]
        if not results:
            return HelperOutcome(output.strip() or errors.strip(), session)
        report = results[-1].report.strip() or errors.strip()
        return HelperOutcome(report, results[-1].session or session, report if results[-1].is_error else None)

    def transcript(self, project: Path, session: str) -> Path | None:
        path = self.folders.folder(CONFIG_VARIABLE, ".claude") / "projects" / ClaudeFolderName.folder_name(project) / f"{session}.jsonl"
        return path if path.is_file() else None

    def transcript_rows(self, path: Path) -> Sequence[TranscriptRow]:
        rows: list[TranscriptRow] = []
        for line in path.read_text().splitlines():
            fields: object = json.loads(line) if line.strip() else {}
            message = fields.get("message") if is_mapping(fields) else None
            author = fields.get("type") if is_mapping(fields) else None
            if author not in TRANSCRIPT_AUTHORS or not is_mapping(message):
                continue
            text = "\n".join(self.message_texts(message.get("content")))
            if text.strip():
                rows.append(TranscriptRow(len(rows) + 1, str(author), str(author), text))
        return rows

    @staticmethod
    def message_texts(content: object) -> list[str]:
        if isinstance(content, str):
            return [content]
        blocks = content if is_list(content) else []
        return [str(block.get("text", "")) for block in blocks if is_mapping(block) and block.get("type") == "text"]

    def transcript_path(self, event: HookEvent) -> Path | None:
        path = event.raw.get("agent_transcript_path") if event.subagent else None
        return Path(path) if isinstance(path, str) and path else super().transcript_path(event)

    def folder_prepared(self, root: Path, folder: Path, runner: str) -> None:
        ProgramHooks.hooks(type(self), folder).write(runner, root)
        ClaudeTrust(self.state_file()).trusted(folder)

    def hook_trust(self, project: Path) -> HookTrust:
        return HookTrust.READY if ProgramHooks.hooks(type(self), project).is_complete() else HookTrust.UNWRITTEN

    def context_percent(self, home: JournalHome, session: str) -> int | None:
        path = home.status_folder / f"{session}.json"
        fields: object = json.loads(path.read_text() or "{}") if path.is_file() else {}
        window = fields.get("context_window") if is_mapping(fields) else None
        used = window.get("used_percentage") if is_mapping(window) else None
        return int(used) if isinstance(used, int | float) and not isinstance(used, bool) else None

    @classmethod
    def hook_settings(cls, runner: str, root: Path) -> Mapping[str, object]:
        return {"statusLine": {"type": "command", "command": f'{runner} --status "{root}"', "padding": 0}}

    def line_sent(self, line: SessionLine) -> bool:
        return ClaudeInbox(self.folders.folder(CONFIG_VARIABLE, ".claude") / "sessions").line_sent(line)

    def state_file(self) -> Path:
        return self.folders.folder(CONFIG_VARIABLE, "") / ".claude.json"
