from engine.provider.model_efforts import ModelEfforts
from core.modules.codex.support.codex_settings import MODEL_EFFORTS
from engine.provider.context_window import ContextWindow
from engine.provider.control_choice import ControlChoice
from engine.provider.control_group import ControlGroup
from engine.provider.program_server_file import ProgramServerFile
from core.modules.codex.providers.support.codex_server_file import CodexServerFile
from dataclasses import replace
import html
import json
import re
from collections.abc import Mapping, Sequence
from pathlib import Path

from engine.enums.hook_event_name import HookEventName
from engine.enums.tool_type import ToolType
from engine.file.file_access import FileAccess
from engine.instruction.instruction_imports import JOURNAL_FILE
from engine.journal.journal_home import JournalHome
from engine.provider.helper_launch import HelperLaunch
from engine.provider.helper_outcome import HelperOutcome
from engine.enums.hook_decoder import HookDecoder
from engine.provider.hook_file import HookFile
from engine.enums.hook_trust import HookTrust
from engine.provider.launch import Launch
from engine.provider.launch_command import LaunchCommand
from engine.enums.model_tier import ModelTier
from engine.provider.program_hooks import ProgramHooks
from engine.provider.program_folders import ProgramFolders
from engine.profile.agent_profile import AgentProfile
from engine.provider.program_model import ProgramModel
from engine.provider.provider import Provider
from engine.enums.halt_style import HaltStyle
from engine.enums.refusal_style import RefusalStyle
from engine.provider.transcript_author import JOURNAL_AUTHOR, TRANSCRIPT_AUTHORS, TranscriptAuthor
from engine.provider.transcript_row import TranscriptRow
from engine.provider.transcript_tail import TranscriptTail
from engine.types.type_guards import is_list, is_mapping
from engine.private.server_keys import ServerKeys
from core.modules.codex.providers.support.codex_token_count import CodexTokenCount
from core.modules.codex.providers.support.codex_session_effort import CodexSessionEffort
from core.modules.codex.providers.support.codex_event import CodexEvent
from core.modules.codex.providers.support.codex_trust import CodexTrust
from core.modules.codex.providers.support.codex_journal_config import CodexJournalConfig
from engine.provider.managed_hook import ManagedHook
from engine.provider.program_settings import ProgramSettings
from engine.provider.settings_file import SettingsFile
from core.modules.codex.models.enums.codex_hook_event import CodexHookEvent
from engine.journal.journal_home import JOURNAL_FOLDER

HOME_VARIABLE = "CODEX_HOME"
DEVELOPER_ROLE = "developer"
CODEX_CONTEXT_OPENINGS = ("# AGENTS.md instructions", "<environment_context>", "<permissions instructions>", "<skills_instructions>", "<collaboration_mode>", "<recommended_plugins>", "<apps_instructions>")
HOOK_PROMPT_TAG = re.compile(r"</?hook_prompt[^>]*>")
PERSON_LINKS = ("auth.json", "sessions", "history.jsonl")
PERSON_STATE = ("state_5.sqlite", "thread_history_1.sqlite", "session_index.jsonl", "rules", "skills", "plugins")
PERSON_FOLDER = ".codex"
PROGRAMS_FOLDER = "programs"
REQUEST_APPROVAL_ARGUMENTS = ["-c", 'approval_policy="on-request"', "-c", 'sandbox_mode="workspace-write"']


class CodexProvider(Provider):
    """OpenAI's Codex: hooks and their trust in the journal's own Codex folder, passed as CODEX_HOME, rollouts
    under that folder's sessions link to the user's, and a session it names itself, which the first hook
    brings; a main session starts with the MCP servers' keys in its environment."""

    name = "codex"
    title = "Codex"
    executable = "codex"
    hook_events = {event.value: event.event for event in CodexHookEvent}
    line_events = [HookEventName.SESSION_START, HookEventName.PROMPT, HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE]
    plain_output_events = [HookEventName.SESSION_START, HookEventName.PROMPT]
    refusals = {HookEventName.STOP: RefusalStyle.BLOCK}
    halts = {HookEventName.PRE_TOOL_USE: HaltStyle.REFUSE, HookEventName.PROMPT: HaltStyle.REFUSE}
    tool_categories = {"Bash": ToolType.SHELL, "apply_patch": ToolType.EDIT, "write_file": ToolType.NEW_FILE,
                       "read_file": ToolType.READ, "view_image": ToolType.READ, "collaborationspawn_agent": ToolType.AGENT,
                       "request_user_input": ToolType.QUESTION}
    safe_tools = ("webrun", "list_mcp_resources", "create_goal", "update_goal", "clocksleep", "clockcurr_time")
    monitor_tool = ToolType.SHELL
    decoder = HookDecoder.CODEX
    controls = tuple([ControlGroup("context", "Context window", (ControlChoice("compact", "Compact context", "/compact"), ControlChoice("clear", "Clear context", "/clear")))])
    matchers = {"PreToolUse": "tool_name", "PostToolUse": "tool_name", "SessionStart": "source", "SessionEnd": "reason",}
    hook_files = tuple([Path(".codex/hooks.json")])
    worktree_hook_files = hook_files
    hook_file = HookFile(Path(".codex/hooks.json"), {}, {
        "SessionStart": {"additionalContextLimit": 0},
        "UserPromptSubmit": {"additionalContextLimit": 0},
        "PreToolUse": {"additionalContextLimit": 0},
        "PostToolUse": {"additionalContextLimit": 0},
        "SessionEnd": {"timeout": 3},
    })
    session_variable = "CODEX_THREAD_ID"
    markers = ["CODEX_THREAD_ID", "CODEX_SESSION_ID", "CODEX_TOOL_CALL_ID", "CODEX_CI", "CODEX_SANDBOX", "CODEX_VERSION",
               "CODEX_APPLY_PATCH_PRESERVE_LINE_ENDINGS"]
    models = [ProgramModel("gpt-6-luna", ModelTier.FAST), ProgramModel("gpt-6.1-terra", ModelTier.GENERAL), ProgramModel("gpt-6.1-sol", ModelTier.STRONGEST),
              ProgramModel("gpt-6-astra", ModelTier.RARE)]

    profile_model_setting = "journal.core.profiles.model-codex"

    def __init__(self, folders: ProgramFolders, keys: ServerKeys, efforts: ModelEfforts) -> None:
        super().__init__(folders)
        self.keys, self.efforts = keys, efforts
        self.rollouts: dict[str, Path] = {}

    def readable_folders(self) -> tuple[Path, ...]:
        return tuple([self.folders.folder(HOME_VARIABLE, ".codex")])

    def server_files(self, folder: Path) -> tuple[ProgramServerFile, ...]:
        return tuple([CodexServerFile(folder)])

    def profile_model(self, profile: AgentProfile) -> str:
        return profile.program_models.get(self.name, profile.codex_model)

    def with_profile_model(self, profile: AgentProfile, model: str) -> AgentProfile:
        return replace(super().with_profile_model(profile, model), codex_model=model)

    def session_command(self, launch: Launch) -> LaunchCommand:
        permission = ["--dangerously-bypass-approvals-and-sandbox"] if launch.skip_prompts else REQUEST_APPROVAL_ARGUMENTS
        model = [] if launch.names_flag("-m") or launch.names_flag("--model") else ["-m", launch.model]
        effort = [] if launch.effort else self.effort_arguments(launch.model)
        arguments = [self.executable, "--no-daemon", *model, *effort, *permission, *self.journal_instructions(launch.folder), *launch.program_arguments, *launch.session.arguments(self), *launch.prompt_arguments]
        return LaunchCommand(arguments, launch.folder, self.variables(launch.root, launch.variables))

    def launch_variables(self, home: JournalHome) -> Mapping[str, str]:
        return {HOME_VARIABLE: str(home.program_folder(self.name))}

    def variables(self, root: Path, given: Mapping[str, str]) -> dict[str, str]:
        return {**given, **self.keys.all(), **self.launch_variables(JournalHome(root / JOURNAL_FOLDER))}

    @staticmethod
    def journal_instructions(folder: Path) -> list[str]:
        path = folder / JOURNAL_FILE
        if not path.is_file():
            return []
        return ["-c", f"developer_instructions={json.dumps(FileAccess.shared().read(path), ensure_ascii=False)}"]

    def helper_command(self, launch: HelperLaunch) -> LaunchCommand:
        arguments = [self.executable, "exec", *launch.session.arguments(self), "--json", "--dangerously-bypass-approvals-and-sandbox",
                     "--dangerously-bypass-hook-trust", "-m", launch.model, *self.effort_arguments(launch.model), launch.brief]
        return LaunchCommand(arguments, launch.folder, self.variables(launch.root, launch.variables))

    def effort_arguments(self, model: str) -> list[str]:
        effort = self.efforts.effort(MODEL_EFFORTS, model)
        return [] if effort is None else ["-c", f"model_reasoning_effort={effort}"]

    def new_session_arguments(self, session: str) -> Sequence[str]:
        return []

    def resumed_arguments(self, session: str) -> Sequence[str]:
        return ["resume", session]

    def helper_outcome(self, output: str, errors: str) -> HelperOutcome:
        events = list(CodexEvent.events(output))
        replies = [event.reply for event in events if event.is_reply() and event.reply is not None]
        failures = [event.error for event in events if event.is_failure() and event.error is not None]
        session = next((event.thread for event in events if event.is_thread_start()), "")
        return HelperOutcome(replies[-1].strip() if replies else errors.strip(), session, failures[-1] if failures else None)

    def transcript(self, project: Path, session: str) -> Path | None:
        cached = self.rollouts.get(session)
        if cached is not None and cached.is_file():
            return cached
        sessions = self.person_folder() / "sessions"
        located = next(sessions.glob(f"**/rollout-*-{session}.jsonl"), None) if sessions.is_dir() else None
        if located is not None:
            self.rollouts[session] = located
        return located

    def context_percent(self, home: JournalHome, session: str) -> int | None:
        return self.context_window(home, session).used_percentage

    def context_tokens(self, home: JournalHome, session: str) -> int | None:
        return self.context_window(home, session).total_input_tokens

    def context_window(self, home: JournalHome, session: str) -> ContextWindow:
        latest = self.latest_token_count(home, session)
        return ContextWindow(latest.percent(), latest.used_tokens) if latest else ContextWindow(None, None)

    def latest_token_count(self, home: JournalHome, session: str) -> CodexTokenCount | None:
        path = self.transcript(home.folder.parent, session)
        counts = [CodexTokenCount.parsed(line) for line in TranscriptTail(path).lines()] if path else []
        return next((count for count in reversed(counts) if count is not None), None)

    def session_effort(self, home: JournalHome, session: str) -> str:
        path = self.transcript(home.folder.parent, session)
        if path is None:
            return ""
        return CodexSessionEffort(path).read()

    def reported_model(self, home: JournalHome, session: str) -> str:
        path = self.transcript(home.folder.parent, session)
        if path is None:
            return ""
        return CodexSessionEffort(path, "model").read()

    def session_matches_folder(self, project: Path, session: str) -> bool:
        rollout = self.transcript(project, session)
        if rollout is None:
            return False
        header: object = json.loads(TranscriptTail(rollout).first_line() or "{}")
        payload = header.get("payload") if is_mapping(header) else None
        return is_mapping(payload) and payload.get("cwd") == str(project)

    def transcript_row(self, line: str, position: int) -> TranscriptRow | None:
        fields: object = json.loads(line) if line.strip() else {}
        payload = fields.get("payload") if is_mapping(fields) else None
        role = payload.get("role") if is_mapping(payload) else None
        content = payload.get("content") if is_mapping(payload) else None
        if role not in (*TRANSCRIPT_AUTHORS, DEVELOPER_ROLE) or not is_list(content):
            return None
        text = "\n".join(str(block.get("text", "")) for block in content if is_mapping(block) and not str(block.get("text", "")).startswith(CODEX_CONTEXT_OPENINGS))
        shown = html.unescape(HOOK_PROMPT_TAG.sub("", text))
        if not shown.strip():
            return None
        return TranscriptAuthor.row(position, JOURNAL_AUTHOR if role == DEVELOPER_ROLE else role, shown, fields.get("timestamp") if is_mapping(fields) else "")

    def folder_prepared(self, root: Path, folder: Path, runner: str) -> None:
        pass

    def journal_hook_file(self, home: JournalHome) -> Path:
        return home.program_folder(self.name) / "hooks.json"

    def journal_trust(self, home: JournalHome) -> HookTrust:
        if not ProgramHooks.journal(type(self), self.journal_hook_file(home)).is_complete():
            return HookTrust.UNWRITTEN
        return self.trust_record(home).trust(self.journal_hook_file(home).resolve(), list(self.hook_events))

    def trust_record(self, home: JournalHome) -> CodexTrust:
        return CodexTrust(home.program_folder(self.name) / "config.toml")

    def journal_settings(self, home: JournalHome, runner: str, managed: Sequence[ManagedHook], folders: Sequence[Path]) -> ProgramSettings:
        folder = home.program_folder(self.name)
        person = self.person_folder()
        hooks_file = folder / "hooks.json"
        blocks = ProgramHooks.journal(type(self), hooks_file).journal_blocks(runner, home.project_folder, managed)
        person_data = self.person_data()
        config = CodexJournalConfig(person_data.get(person / "config.toml", b""), folders, hooks_file.resolve(), blocks)
        files = (SettingsFile(folder / "config.toml", config.text()), SettingsFile(hooks_file, json.dumps({"hooks": blocks}, indent=2, sort_keys=True) + "\n"))
        present = tuple(name for name in PERSON_STATE if (person / name).exists())
        links = {folder / name: person / name for name in (*PERSON_LINKS, *present)}
        return ProgramSettings(self.name, files, links, self.user_hook_files(), person_data)

    def user_hook_files(self) -> tuple[Path, ...]:
        folder = self.person_folder()
        return (folder / "hooks.json", folder / "config.toml")

    def person_folder(self) -> Path:
        folder = self.folders.folder(HOME_VARIABLE, PERSON_FOLDER)
        is_journal_folder = folder.resolve().parent.name == PROGRAMS_FOLDER and folder.resolve().parent.parent.name == JOURNAL_FOLDER
        return Path.home() / PERSON_FOLDER if is_journal_folder else folder

