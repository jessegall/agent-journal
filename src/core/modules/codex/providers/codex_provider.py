from core.base.provider.program_server_file import ProgramServerFile
from core.modules.codex.providers.support.codex_server_file import CodexServerFile
from dataclasses import replace
import html
import json
import re
from collections.abc import Mapping, Sequence
from pathlib import Path

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.tool_type import ToolType
from core.base.file_access import FileAccess
from core.base.instruction_imports import JOURNAL_FILE
from core.base.journal_home import JournalHome
from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.helper_outcome import HelperOutcome
from core.base.provider.hook_decoder import HookDecoder
from core.base.provider.hook_file import HookFile
from core.base.provider.hook_trust import HookTrust
from core.base.provider.launch import Launch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.model_tier import ModelTier
from core.base.provider.program_hooks import ProgramHooks
from core.base.provider.program_folders import ProgramFolders
from core.base.profile.agent_profile import AgentProfile
from core.base.provider.program_model import ProgramModel
from core.base.provider.provider import Provider
from core.base.driver.refusal_style import RefusalStyle
from core.base.provider.transcript_author import JOURNAL_AUTHOR, TRANSCRIPT_AUTHORS, TranscriptAuthor
from core.base.provider.transcript_row import TranscriptRow
from core.base.provider.transcript_tail import TranscriptTail
from core.base.type_guards import is_list, is_mapping
from core.base.private.server_keys import ServerKeys
from core.modules.codex.providers.support.codex_token_count import CodexTokenCount
from core.modules.codex.providers.support.codex_session_effort import CodexSessionEffort
from core.modules.codex.providers.support.codex_event import CodexEvent
from core.modules.codex.providers.support.codex_trust import CodexTrust
from core.modules.codex.providers.support.codex_hook_event import CodexHookEvent

HOME_VARIABLE = "CODEX_HOME"
DEVELOPER_ROLE = "developer"
CODEX_CONTEXT_OPENINGS = ("# AGENTS.md instructions", "<environment_context>", "<permissions instructions>", "<skills_instructions>", "<collaboration_mode>", "<recommended_plugins>", "<apps_instructions>")
HOOK_PROMPT_TAG = re.compile(r"</?hook_prompt[^>]*>")


class CodexProvider(Provider):
    """OpenAI's Codex: hooks in .codex/hooks.json, trusted per file and hook in its config.toml, rollouts
    under its sessions folder, and a session it names itself, which the first hook brings; a main session
    starts with the MCP servers' keys in its environment."""

    name = "codex"
    title = "Codex"
    executable = "codex"
    hook_events = {event.value: event.event for event in CodexHookEvent}
    line_events = [HookEventName.SESSION_START, HookEventName.PROMPT, HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE]
    plain_output_events = [HookEventName.SESSION_START, HookEventName.PROMPT]
    refusals = {HookEventName.STOP: RefusalStyle.BLOCK}
    tool_categories = {"Bash": ToolType.SHELL, "apply_patch": ToolType.EDIT, "write_file": ToolType.NEW_FILE,
                       "read_file": ToolType.READ, "view_image": ToolType.READ, "collaborationspawn_agent": ToolType.AGENT,
                       "request_user_input": ToolType.QUESTION}
    safe_tools = ("webrun", "list_mcp_resources", "create_goal", "update_goal", "clocksleep", "clockcurr_time")
    monitor_tool = ToolType.SHELL
    decoder = HookDecoder.CODEX
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

    def __init__(self, folders: ProgramFolders, keys: ServerKeys) -> None:
        super().__init__(folders)
        self.keys = keys
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
        skip = ["--dangerously-bypass-approvals-and-sandbox"] if launch.skip_prompts else []
        model = [] if launch.names_flag("-m") or launch.names_flag("--model") else ["-m", launch.model]
        arguments = [self.executable, "--no-daemon", *model, *skip, *self.journal_instructions(launch.folder), *launch.program_arguments, *launch.session.arguments(self), *launch.prompt_arguments]
        return LaunchCommand(arguments, launch.folder, {**launch.variables, **self.keys.all()})

    @staticmethod
    def journal_instructions(folder: Path) -> list[str]:
        path = folder / JOURNAL_FILE
        if not path.is_file():
            return []
        return ["-c", f"developer_instructions={json.dumps(FileAccess.shared().read(path), ensure_ascii=False)}"]

    def helper_command(self, launch: HelperLaunch) -> LaunchCommand:
        arguments = [self.executable, "exec", *launch.session.arguments(self), "--json", "--dangerously-bypass-approvals-and-sandbox",
                     "--dangerously-bypass-hook-trust", "-m", launch.model, launch.brief]
        return LaunchCommand(arguments, launch.folder, {**launch.variables, **self.keys.all()})

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
        sessions = self.folders.folder(HOME_VARIABLE, ".codex") / "sessions"
        located = next(sessions.glob(f"**/rollout-*-{session}.jsonl"), None) if sessions.is_dir() else None
        if located is not None:
            self.rollouts[session] = located
        return located

    def context_percent(self, home: JournalHome, session: str) -> int | None:
        latest = self.latest_token_count(home, session)
        return latest.percent() if latest else None

    def context_tokens(self, home: JournalHome, session: str) -> int | None:
        latest = self.latest_token_count(home, session)
        return latest.used_tokens if latest else None

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
        ProgramHooks.hooks(type(self), folder).write(runner, root)

    def hook_trust(self, project: Path) -> HookTrust:
        if not ProgramHooks.hooks(type(self), project).is_complete():
            return HookTrust.UNWRITTEN
        return self.trust_record().trust(project.resolve() / self.hook_file.path, list(self.hook_events))

    def trust_record(self) -> CodexTrust:
        return CodexTrust(self.folders.folder(HOME_VARIABLE, ".codex") / "config.toml")

    def user_hook_files(self) -> tuple[Path, ...]:
        folder = self.folders.folder(HOME_VARIABLE, ".codex")
        return (folder / "hooks.json", folder / "config.toml")

    @classmethod
    def hooks_rewritten(cls, path: Path, original_hooks: object, updated_hooks: object) -> None:
        cls.configured_trust().remapped(path.resolve(), original_hooks, updated_hooks)

    @classmethod
    def record_hook_write(cls, path: Path, hooks: Mapping[str, object]) -> None:
        cls.configured_trust().record_generated(path.resolve(), hooks)

    @classmethod
    def hooks_copied(cls, source: Path, target: Path) -> None:
        cls.configured_trust().copied(source.resolve(), target.resolve())

    @staticmethod
    def configured_trust() -> CodexTrust:
        config = ProgramFolders().folder(HOME_VARIABLE, ".codex") / "config.toml"
        return CodexTrust(config)
