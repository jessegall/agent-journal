from core.base.provider.program_server_file import ProgramServerFile
from core.modules.claude_code.providers.support.claude_server_file import ClaudeServerFile
from dataclasses import replace
from core.base.profile.agent_profile import AgentProfile
from core.base.file_access import FileAccess
from core.base.provider.status_file_fields import StatusFileFields
import json
import os
import re
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
from core.base.provider.transcript_author import AGENT_AUTHOR, TRANSCRIPT_AUTHORS, USER_AUTHOR, TranscriptAuthor
from core.base.provider.program_hooks import ProgramHooks
from core.base.provider.program_folders import ProgramFolders
from core.base.provider.program_model import ProgramModel
from core.base.provider.control_choice import ControlChoice
from core.base.provider.control_group import ControlGroup
from core.base.provider.provider import Provider
from core.base.driver.refusal_style import RefusalStyle
from core.base.provider.session_line import SessionLine
from core.base.provider.peer_note import PeerNote
from core.base.provider.transcript_row import TranscriptRow
from core.base.type_guards import is_list, is_mapping
from core.base.private.server_keys import ServerKeys
from core.modules.claude_code.providers.support.claude_folder_name import ClaudeFolderName
from core.modules.claude_code.providers.support.claude_stream_row import ClaudeStreamRow
from core.modules.claude_code.providers.support.claude_inbox import ClaudeInbox
from core.modules.claude_code.providers.support.claude_kept_skills import ClaudeKeptSkills
from core.modules.claude_code.providers.support.claude_peer_notes import ClaudePeerNotes
from core.modules.claude_code.providers.support.claude_trust import ClaudeTrust

CONFIG_VARIABLE = "CLAUDE_CONFIG_DIR"
SYNTHETIC_MODEL = "<synthetic>"
PROMPT_SOURCE = "promptSource"
TEMPORARY_FILES_FOLDER = Path("/tmp")


MODEL_CHOICES = (("opus", "Opus"), ("sonnet", "Sonnet"), ("haiku", "Haiku"), ("fable", "Fable"))
EFFORT_CHOICES = (("low", "Low"), ("medium", "Medium"), ("high", "High"), ("xhigh", "Extra high"), ("max", "Maximum"))
SESSION_EFFORT = "high"

COMPACT_LINE = "/compact Keep the summary short: what the user asked, what is decided and what is open. Leave out what comes back after a compaction: rules, memories, task briefs and skill texts."

class ClaudeCodeProvider(Provider):
    """Anthropic's Claude Code: hooks in .claude/settings.local.json, sessions under its config folder's
    projects, a session id the journal chooses, and a state file that records the folders it trusts; a main
    session starts with the MCP servers' keys in its environment."""

    name = "claude"
    title = "Claude Code"
    executable = "claude"
    hook_events = {"SessionStart": HookEventName.SESSION_START, "UserPromptSubmit": HookEventName.PROMPT,
                   "PreToolUse": HookEventName.PRE_TOOL_USE, "PostToolUse": HookEventName.POST_TOOL_USE,
                   "PostToolUseFailure": HookEventName.POST_TOOL_USE_FAILURE, "PreCompact": HookEventName.COMPACT,
                   "Stop": HookEventName.STOP, "StopFailure": HookEventName.STOP_FAILURE,
                   
                   "SessionEnd": HookEventName.SESSION_END, "MessageDisplay": HookEventName.MESSAGE_DISPLAY}
    line_events = [HookEventName.SESSION_START, HookEventName.PROMPT, HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE]
    plain_output_events = [HookEventName.SESSION_START, HookEventName.PROMPT]
    refusals = {HookEventName.PRE_TOOL_USE: RefusalStyle.DENY, HookEventName.PROMPT: RefusalStyle.BLOCK, HookEventName.STOP: RefusalStyle.BLOCK}
    skills_folder = ".claude/skills"
    profile_model_setting = "journal.core.profiles.model-claude"

    rewrites = {HookEventName.PRE_TOOL_USE: {"run_in_background": False}}
    refusal_output_tools = [ToolType.SHELL]
    monitor_tool = ToolType.MONITOR
    tool_categories = {"Bash": ToolType.SHELL, "Monitor": ToolType.MONITOR, "Edit": ToolType.EDIT, "MultiEdit": ToolType.EDIT,
                       "NotebookEdit": ToolType.EDIT, "Write": ToolType.NEW_FILE, "Read": ToolType.READ, "Skill": ToolType.READ, "Grep": ToolType.SEARCH,
                       "Glob": ToolType.SEARCH, "ToolSearch": ToolType.SEARCH, "Agent": ToolType.AGENT, "Task": ToolType.AGENT,
                       "AskUserQuestion": ToolType.QUESTION}
    safe_tools = ("WebFetch", "WebSearch", "TodoWrite")
    web_reader_agents = ("web-fetch",)
    matchers = {"PreToolUse": "tool_name", "PostToolUse": "tool_name", "PostToolUseFailure": "tool_name",
                "SessionStart": "source", "SessionEnd": "reason", "PreCompact": "trigger"}
    hook_file = HookFile(Path(".claude/settings.local.json"), {})
    hook_files = (Path(".claude/settings.json"), Path(".claude/settings.local.json"))
    session_variable = "CLAUDE_CODE_SESSION_ID"
    markers = ["CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_SHELL_PREFIX"]
    controls = (ControlGroup("model", "Model", tuple(ControlChoice(value, label, f"/model {value}") for value, label in MODEL_CHOICES)),
                ControlGroup("effort", "Reasoning effort", tuple(ControlChoice(value, label, f"/effort {value}") for value, label in EFFORT_CHOICES)),
                ControlGroup("context", "Context window", (ControlChoice("compact", "Compact context", COMPACT_LINE), ControlChoice("clear", "Clear context", "/clear"))))
    models = [ProgramModel("haiku", ModelTier.FAST), ProgramModel("sonnet", ModelTier.GENERAL), ProgramModel("opus", ModelTier.STRONGEST),
              ProgramModel("fable", ModelTier.RARE)]
    session_tier = ModelTier.STRONGEST

    def __init__(self, folders: ProgramFolders, keys: ServerKeys) -> None:
        super().__init__(folders)
        self.keys = keys

    def skill_instruction(self, skill: str, path: Path) -> str:
        return f"load this first with the Skill tool: {skill}"

    def readable_folders(self) -> tuple[Path, ...]:
        return tuple([self.folders.folder(CONFIG_VARIABLE, ".claude")])

    def server_files(self, folder: Path) -> tuple[ProgramServerFile, ...]:
        return tuple([ClaudeServerFile(folder)])

    def profile_model(self, profile: AgentProfile) -> str:
        return profile.program_models.get(self.name, profile.model)

    @property
    def model_option(self) -> str:
        return "--model"

    def with_profile_model(self, profile: AgentProfile, model: str) -> AgentProfile:
        return replace(super().with_profile_model(profile, model), model=model)

    def session_command(self, launch: Launch) -> LaunchCommand:
        skip = ["--dangerously-skip-permissions"] if launch.skip_prompts else []
        model = [] if launch.names_flag("--model") else ["--model", launch.model]
        effort = [] if launch.names_flag("--effort") else ["--effort", SESSION_EFFORT]
        arguments = [self.executable, *model, *effort, *skip, *launch.program_arguments, *launch.session.arguments(self), *launch.prompt_arguments]
        return LaunchCommand(arguments, launch.folder, {**launch.variables, **self.keys.all()}, launch.session.session)

    def helper_command(self, launch: HelperLaunch) -> LaunchCommand:
        arguments = [self.executable, "-p", launch.brief, "--model", launch.model, "--effort", SESSION_EFFORT, "--dangerously-skip-permissions",
                     "--output-format", "stream-json", "--verbose", *launch.session.arguments(self)]
        return LaunchCommand(arguments, launch.folder, {**launch.variables, **self.keys.all()}, launch.session.session)

    def session_effort(self, home: JournalHome, session: str) -> str:
        return SESSION_EFFORT

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
        projects = self.folders.folder(CONFIG_VARIABLE, ".claude") / "projects"
        path = projects / ClaudeFolderName.folder_name(project) / f"{session}.jsonl"
        if path.is_file():
            return path
        return next(projects.glob(f"*/{session}.jsonl"), None) if projects.is_dir() else None

    def skills_kept_after_compaction(self, event: HookEvent) -> Mapping[str, str]:
        path = self.transcript_path(event)
        return ClaudeKeptSkills(path).digests() if path is not None else {}

    def session_matches_folder(self, project: Path, session: str) -> bool:
        return (self.folders.folder(CONFIG_VARIABLE, ".claude") / "projects" / ClaudeFolderName.folder_name(project) / f"{session}.jsonl").is_file()

    def transcript_row(self, line: str, position: int) -> TranscriptRow | None:
        fields: object = json.loads(line) if line.strip() else {}
        if not is_mapping(fields):
            return None
        message, author = fields.get("message"), fields.get("type")
        if author not in TRANSCRIPT_AUTHORS or not is_mapping(message):
            return None
        text = "\n".join(self.message_texts(message.get("content")))
        return TranscriptAuthor.row(position, author, text, fields.get("timestamp")) if text.strip() else None

    def is_session_entry(self, line: str, row: TranscriptRow) -> bool:
        fields: object = json.loads(line)
        if not is_mapping(fields) or fields.get("isMeta") or fields.get("isSidechain"):
            return False
        message = fields.get("message")
        if row.author == AGENT_AUTHOR:
            return is_mapping(message) and message.get("model") != SYNTHETIC_MODEL
        return row.author == USER_AUTHOR and PROMPT_SOURCE in fields

    @staticmethod
    def message_texts(content: object) -> list[str]:
        if isinstance(content, str):
            return [content]
        blocks = content if is_list(content) else []
        return [str(block.get("text", "")) for block in blocks if is_mapping(block) and block.get("type") == "text"]

    def folder_prepared(self, root: Path, folder: Path, runner: str) -> None:
        ProgramHooks.hooks(type(self), folder).write(runner, root)
        self.folder_trusted(folder)

    def folder_trusted(self, folder: Path) -> None:
        ClaudeTrust(self.state_file()).trusted(folder)

    def user_hook_files(self) -> tuple[Path, ...]:
        return tuple([self.folders.folder(CONFIG_VARIABLE, ".claude") / "settings.json"])

    def hook_trust(self, project: Path) -> HookTrust:
        return HookTrust.READY if ProgramHooks.hooks(type(self), project).is_complete() else HookTrust.UNWRITTEN

    def context_percent(self, home: JournalHome, session: str) -> int | None:
        return self.context_number(home, session, "used_percentage")

    def context_tokens(self, home: JournalHome, session: str) -> int | None:
        return self.context_number(home, session, "total_input_tokens")

    @staticmethod
    def context_number(home: JournalHome, session: str, name: str) -> int | None:
        path = home.status_file(session)
        fields = StatusFileFields.read(path, FileAccess.shared().version(path)) if path.is_file() else {}
        window = fields.get("context_window") if is_mapping(fields) else None
        value = window.get(name) if is_mapping(window) else None
        return int(value) if isinstance(value, int | float) and not isinstance(value, bool) else None

    def session_temp_folders(self, project: Path) -> Mapping[str, Path]:
        prefix = re.sub(r"[/.]", "-", str(project.resolve()))
        program_folder = TEMPORARY_FILES_FOLDER / f"claude-{os.getuid()}"
        project_folders = [folder for folder in program_folder.iterdir() if folder.name == prefix or folder.name.startswith(f"{prefix}--")] if program_folder.is_dir() else []
        return {session.name: session for folder in project_folders for session in folder.iterdir() if session.is_dir()}

    @classmethod
    def hook_settings(cls, runner: str, root: Path) -> Mapping[str, object]:
        return {"autoMemoryEnabled": False, "statusLine": {"type": "command", "command": f'{runner} --status "{root}"', "padding": 0}}

    def line_sent(self, line: SessionLine) -> bool:
        return ClaudeInbox(self.folders.folder(CONFIG_VARIABLE, ".claude") / "sessions").line_sent(line)

    def peer_note(self, line: str) -> Sequence[PeerNote]:
        return ClaudePeerNotes.note(line)

    def state_file(self) -> Path:
        return self.folders.folder(CONFIG_VARIABLE, "") / ".claude.json"
