from engine.file.kept_bytes import KeptBytes
from engine.provider.model_efforts import ModelEfforts
from core.modules.claude_code.support.claude_code_settings import MODEL_EFFORTS
from engine.provider.program_server_file import ProgramServerFile
from core.modules.claude_code.providers.support.claude_server_file import ClaudeServerFile
from dataclasses import replace
from engine.profile.agent_profile import AgentProfile
from engine.provider.context_window import ContextWindow
import json
import os
import re
from collections.abc import Mapping, Sequence
from pathlib import Path

from engine.enums.hook_event_name import HookEventName
from engine.enums.tool_type import ToolType
from engine.journal.journal_home import JournalHome
from engine.provider.helper_launch import HelperLaunch
from engine.provider.helper_outcome import HelperOutcome
from engine.provider.hook_file import HookFile
from engine.enums.hook_trust import HookTrust
from engine.provider.launch import Launch
from engine.provider.launch_command import LaunchCommand
from engine.enums.model_tier import ModelTier
from engine.provider.transcript_author import AGENT_AUTHOR, TRANSCRIPT_AUTHORS, USER_AUTHOR, TranscriptAuthor
from engine.provider.program_hooks import ProgramHooks
from engine.provider.managed_hook import ManagedHook
from engine.provider.program_settings import ProgramSettings, SettingsFile
from engine.provider.program_folders import ProgramFolders
from engine.provider.program_model import ProgramModel
from engine.provider.control_choice import ControlChoice
from engine.provider.control_group import ControlGroup
from engine.provider.provider import Provider
from engine.enums.halt_style import HaltStyle
from engine.enums.refusal_style import RefusalStyle
from engine.provider.session_line import SessionLine
from engine.provider.peer_note import PeerNote
from engine.provider.transcript_row import TranscriptRow
from engine.file.file_access import FileAccess
from engine.provider.status_file_fields import StatusFileFields
from engine.types.type_guards import is_list, is_mapping
from engine.private.server_keys import ServerKeys
from core.modules.claude_code.providers.support.claude_folder_name import ClaudeFolderName
from core.modules.claude_code.providers.support.claude_stream_row import ClaudeStreamRow
from core.modules.claude_code.providers.support.claude_inbox import ClaudeInbox
from core.modules.claude_code.providers.support.claude_kept_skills import ClaudeKeptSkills
from core.modules.claude_code.providers.support.claude_peer_notes import ClaudePeerNotes
from core.modules.claude_code.providers.support.claude_trust import ClaudeTrust
from core.modules.claude_code.providers.support.claude_live_settings import ClaudeLiveSettings
from engine.enums.agent_setting import AgentSetting
from engine.journal.journal_home import JOURNAL_FOLDER

CONFIG_VARIABLE = "CLAUDE_CONFIG_DIR"
LIVE_SETTING_KEYS = {AgentSetting.COMPACT_WINDOW: "autoCompactWindow"}
LIVE_SETTING_RANGES = {AgentSetting.COMPACT_WINDOW: (100_000, 1_000_000)}
SYNTHETIC_MODEL = "<synthetic>"
PROMPT_SOURCE = "promptSource"
TEMPORARY_FILES_FOLDER = Path("/tmp")


MODEL_CHOICES = (("opus", "Opus"), ("sonnet", "Sonnet"), ("haiku", "Haiku"), ("fable", "Fable"))
FALLBACK_EFFORT = "high"
EFFORT_CHOICES = (("low", "Low"), ("medium", "Medium"), ("high", "High"), ("xhigh", "Extra high"), ("max", "Maximum"))

SETTINGS_FLAGS = ("--settings", "--setting-sources")
SETTING_SOURCES = "project"
SERVER_FILE = "mcp.json"
SERVERS_KEY = "mcpServers"
CARRIED_SETTINGS = ("env", "apiKeyHelper", "awsAuthRefresh", "awsCredentialExport", "forceLoginMethod", "forceLoginOrgUUID", "otelHeadersHelper",
                    "includeCoAuthoredBy", "skipDangerousModePermissionPrompt")
BYPASS_PERMISSIONS = {"defaultMode": "bypassPermissions"}

COMPACT_LINE = "/compact Focus on continuing the work at once: what you were doing last, what comes next, and the facts those depend on. Keep every instruction, request, direction and correction the user gave you. Leave out the rest of the earlier history and old messages: the journal gives back recent messages, tasks, memories and rules."

class ClaudeCodeProvider(Provider):
    """Anthropic's Claude Code: hooks in the journal's own settings file, passed with --settings, sessions
    under its config folder's projects, a session id the journal chooses, and a state file that records the
    folders it trusts; a main session starts with the MCP servers' keys in its environment."""

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

    halts = {HookEventName.PRE_TOOL_USE: HaltStyle.DENY}
    rewrites = {HookEventName.PRE_TOOL_USE: {"run_in_background": False}}
    refusal_output_tools = [ToolType.SHELL]
    monitor_tool = ToolType.MONITOR
    tool_categories = {"Bash": ToolType.SHELL, "Monitor": ToolType.MONITOR, "Edit": ToolType.EDIT, "MultiEdit": ToolType.EDIT,
                       "NotebookEdit": ToolType.EDIT, "Write": ToolType.NEW_FILE, "Read": ToolType.READ, "Skill": ToolType.READ, "Grep": ToolType.SEARCH,
                       "Glob": ToolType.SEARCH, "ToolSearch": ToolType.SEARCH, "Agent": ToolType.AGENT, "Task": ToolType.AGENT,
                       "AskUserQuestion": ToolType.QUESTION}
    safe_tools = ("WebFetch", "WebSearch", "TodoWrite")
    web_reader_agents = tuple(["web-fetch"])
    matchers = {"PreToolUse": "tool_name", "PostToolUse": "tool_name", "PostToolUseFailure": "tool_name",
                "SessionStart": "source", "SessionEnd": "reason", "PreCompact": "trigger"}
    hook_file = HookFile(Path(".claude/settings.local.json"), {})
    hook_files = (Path(".claude/settings.json"), Path(".claude/settings.local.json"))
    session_variable = "CLAUDE_CODE_SESSION_ID"
    person_file_note = "Claude Code itself may save a /model or /config choice in this file; the journal does not."
    markers = ["CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_SHELL_PREFIX"]
    compacts_headless = True
    controls = (ControlGroup("model", "Model", tuple(ControlChoice(value, label, f"/model {value}") for value, label in MODEL_CHOICES)),
                ControlGroup("effort", "Reasoning effort", tuple(ControlChoice(value, label, f"/effort {value}") for value, label in EFFORT_CHOICES)),
                ControlGroup("context", "Context window", (ControlChoice("compact", "Compact context", COMPACT_LINE), ControlChoice("clear", "Clear context", "/clear"))))
    models = [ProgramModel("haiku", ModelTier.FAST), ProgramModel("sonnet", ModelTier.GENERAL), ProgramModel("opus", ModelTier.STRONGEST),
              ProgramModel("fable", ModelTier.RARE)]
    session_tier = ModelTier.STRONGEST

    def __init__(self, folders: ProgramFolders, keys: ServerKeys, efforts: ModelEfforts) -> None:
        super().__init__(folders)
        self.keys, self.efforts = keys, efforts

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
        launch.refuse_flags(self.title, *SETTINGS_FLAGS)
        permission = ["--dangerously-skip-permissions"] if launch.skip_prompts else ["--permission-mode", "default"]
        model = [] if launch.names_flag("--model") else ["--model", launch.model]
        effort = [] if launch.names_flag("--effort") else ["--effort", launch.effort or self.effort(launch.model)]
        arguments = [self.executable, *self.settings_arguments(launch.root), *model, *effort, *permission, *launch.program_arguments,
                     *launch.session.arguments(self), *launch.prompt_arguments]
        return LaunchCommand(arguments, launch.folder, {**launch.variables, **self.keys.all()}, launch.session.session)

    def helper_command(self, launch: HelperLaunch) -> LaunchCommand:
        arguments = [self.executable, *self.settings_arguments(launch.root), "-p", launch.brief, "--model", launch.model, "--effort", self.effort(launch.model), "--dangerously-skip-permissions",
                     "--output-format", "stream-json", "--verbose", *launch.session.arguments(self)]
        return LaunchCommand(arguments, launch.folder, {**launch.variables, **self.keys.all()}, launch.session.session)

    def settings_arguments(self, root: Path) -> list[str]:
        home = JournalHome(root / JOURNAL_FOLDER)
        return ["--settings", str(home.program_settings_file(self.name)), "--setting-sources", SETTING_SOURCES, "--mcp-config", str(self.server_file(home))]

    def server_file(self, home: JournalHome) -> Path:
        return home.program_folder(self.name) / SERVER_FILE

    def effort(self, model: str) -> str:
        return self.efforts.effort(MODEL_EFFORTS, model) or FALLBACK_EFFORT

    def session_effort(self, home: JournalHome, session: str) -> str:
        return self.status_text(home.status_file(session), "effort", "level") or self.effort(self.reported_model(home, session))

    def reported_model(self, home: JournalHome, session: str) -> str:
        return self.status_text(home.status_file(session), "model", "id")

    @staticmethod
    def status_text(path: Path, group: str, name: str) -> str:
        if not path.is_file():
            return ""
        fields = StatusFileFields.read(path, FileAccess.shared().version(path)).get(group)
        value = fields.get(name) if is_mapping(fields) else None
        return value if isinstance(value, str) else ""

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

    def skills_kept_after_compaction(self, transcript: Path | None) -> Mapping[str, str]:
        return ClaudeKeptSkills(transcript).digests() if transcript is not None else {}

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
        self.folder_trusted(folder)

    def folder_trusted(self, folder: Path) -> None:
        ClaudeTrust(self.state_file()).trusted(folder)

    def change_agent_setting(self, folder: Path, setting: AgentSetting, value: int) -> None:
        lowest, highest = LIVE_SETTING_RANGES[setting]
        ClaudeLiveSettings(folder).write(LIVE_SETTING_KEYS[setting], min(max(value, lowest), highest))

    def user_hook_files(self) -> tuple[Path, ...]:
        return tuple([self.folders.folder(CONFIG_VARIABLE, ".claude") / "settings.json"])

    def journal_settings(self, home: JournalHome, runner: str, managed: Sequence[ManagedHook], folders: Sequence[Path]) -> ProgramSettings:
        path = home.program_settings_file(self.name)
        root = home.project_folder
        person_data = self.person_data()
        person_file = self.user_hook_files()[0]
        person_settings = self.person_settings(person_data.get(person_file, b""))
        unreadable = tuple(path for path in [person_file] if path.is_file() and (path not in person_data or person_settings is None))
        person_values = {key: value for key, value in (person_settings or {}).items() if key in CARRIED_SETTINGS}
        settings = {**person_values, "permissions": BYPASS_PERMISSIONS, **self.hook_settings(runner, root),
                    "hooks": ProgramHooks.journal(type(self), path).journal_blocks(runner, root, managed)}
        state = self.state_file()
        person_state = self.person_settings(KeptBytes.read(state)) if state.is_file() and os.access(state, os.R_OK) else {}
        servers = person_state.get(SERVERS_KEY, {}) if person_state is not None else {}
        if person_state is None:
            unreadable = (*unreadable, state)
        server_file = SettingsFile(self.server_file(home), json.dumps({SERVERS_KEY: servers if is_mapping(servers) else {}}, indent=2, sort_keys=True) + "\n")
        return ProgramSettings(self.name, (SettingsFile(path, json.dumps(settings, indent=2, sort_keys=True) + "\n"), server_file),
                               person_files=self.user_hook_files(), person_data=person_data, unreadable_person_files=unreadable)

    @staticmethod
    def person_settings(data: bytes) -> Mapping[str, object] | None:
        try:
            parsed: object = json.loads(data or b"{}")
        except (json.JSONDecodeError, UnicodeDecodeError):
            return None
        return {str(key): value for key, value in parsed.items()} if is_mapping(parsed) else None

    def journal_hook_file(self, home: JournalHome) -> Path:
        return home.program_settings_file(self.name)

    def journal_trust(self, home: JournalHome) -> HookTrust:
        return HookTrust.READY if ProgramHooks.journal(type(self), self.journal_hook_file(home)).is_complete() else HookTrust.UNWRITTEN

    def context_percent(self, home: JournalHome, session: str) -> int | None:
        return self.context_window(home, session).used_percentage

    def context_tokens(self, home: JournalHome, session: str) -> int | None:
        return self.context_window(home, session).total_input_tokens

    def context_window(self, home: JournalHome, session: str) -> ContextWindow:
        return ContextWindow.read_status_file(home.status_file(session))

    def session_temp_folders(self, project: Path) -> Mapping[str, Path]:
        prefix = re.sub(r"[/.]", "-", str(project.resolve()))
        program_folder = TEMPORARY_FILES_FOLDER / f"claude-{os.getuid()}"
        project_folders = [folder for folder in program_folder.iterdir() if folder.name == prefix or folder.name.startswith(f"{prefix}--")] if program_folder.is_dir() else []
        return {session.name: session for folder in project_folders for session in folder.iterdir() if session.is_dir()}

    @classmethod
    def hook_settings(cls, runner: str, root: Path) -> Mapping[str, object]:
        return {"autoMemoryEnabled": False, "statusLine": {"type": "command", "command": f'{runner} --status "{root}"', "padding": 0}}

    def delivered_line(self, line: SessionLine) -> bool:
        return ClaudeInbox(self.folders.folder(CONFIG_VARIABLE, ".claude") / "sessions").delivered_line(line)

    def peer_note(self, line: str) -> Sequence[PeerNote]:
        return ClaudePeerNotes.note(line)

    def state_file(self) -> Path:
        return self.folders.folder(CONFIG_VARIABLE, "") / ".claude.json"
