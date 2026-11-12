from engine.provider.context_window import ContextWindow
from abc import ABC, abstractmethod
from dataclasses import replace
from collections.abc import Mapping, Sequence
from pathlib import Path
from typing import ClassVar

from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.enums.tool_type import ToolType
from engine.profile.agent_profile import AgentProfile
from engine.journal.journal_home import JournalHome
from engine.provider.control_group import ControlGroup
from engine.provider.helper_launch import HelperLaunch
from engine.provider.helper_outcome import HelperOutcome
from engine.enums.hook_decoder import HookDecoder
from engine.provider.hook_file import HookFile
from engine.enums.hook_trust import HookTrust
from engine.provider.launch import Launch
from engine.provider.launch_command import LaunchCommand
from engine.provider.program_folders import ProgramFolders
from engine.enums.model_tier import ModelTier
from engine.provider.peer_note import PeerNote
from engine.provider.program_model import ProgramModel
from engine.provider.program_server_file import ProgramServerFile
from engine.enums.halt_style import HaltStyle
from engine.enums.refusal_style import RefusalStyle
from engine.provider.session_line import SessionLine
from engine.provider.transcript_author import AGENT_AUTHOR, USER_AUTHOR
from engine.provider.transcript_row import TranscriptRow
from engine.provider.transcript_tail import TranscriptTail
from engine.provider.transcript_entry import TranscriptEntry
from engine.time.timestamp import Timestamp
from engine.errors.refusal import Refusal


class Provider(ABC):
    """The base of every agent program's provider: how the journal starts the program, which hooks it sends
    under which event names, how its answers are printed, where its hooks are written, where it keeps its
    sessions, and how it trusts a folder. monitor_tool is the tool the program watches a background run with:
    a Monitor tool, or its shell when it has none; a program with none is never held for a monitor."""

    name: ClassVar[str]
    title: ClassVar[str]
    executable: ClassVar[str]
    hook_events: ClassVar[Mapping[str, HookEventName]]
    matchers: ClassVar[Mapping[str, str]] = {}
    line_events: ClassVar[Sequence[HookEventName]]
    plain_output_events: ClassVar[Sequence[HookEventName]] = ()
    refusals: ClassVar[Mapping[HookEventName, RefusalStyle]] = {}
    tool_categories: ClassVar[Mapping[str, ToolType]]
    safe_tools: ClassVar[tuple[str, ...]] = ()
    web_reader_agents: ClassVar[tuple[str, ...]] = ()
    monitor_tool: ClassVar[ToolType | None] = None
    rewrites: ClassVar[Mapping[HookEventName, Mapping[str, object]]] = {}
    halts: ClassVar[Mapping[HookEventName, HaltStyle]] = {}
    refusal_output_tools: ClassVar[Sequence[ToolType]] = ()
    decoder: ClassVar[HookDecoder] = HookDecoder.COMMON
    skills_folder: ClassVar[str] = ".agents/skills"
    hook_file: ClassVar[HookFile]
    hook_files: ClassVar[tuple[Path, ...]] = ()
    worktree_hook_files: ClassVar[tuple[Path, ...]] = ()
    controls: ClassVar[Sequence[ControlGroup]] = ()
    compacts_headless: ClassVar[bool] = False
    session_variable: ClassVar[str]
    markers: ClassVar[Sequence[str]]
    models: ClassVar[Sequence[ProgramModel]]
    session_tier: ClassVar[ModelTier] = ModelTier.GENERAL
    profile_model_setting: ClassVar[str] = ""

    def __init__(self, folders: ProgramFolders) -> None:
        self.folders = folders

    def readable_folders(self) -> tuple[Path, ...]:
        return ()

    def server_files(self, folder: Path) -> tuple[ProgramServerFile, ...]:
        return ()

    def skill_instruction(self, skill: str, path: Path) -> str:
        return f"read this first: {path}"

    def model_names(self) -> list[str]:
        return [model.name for model in self.models]

    def profile_model(self, profile: AgentProfile) -> str:
        return profile.program_models.get(self.name, "")

    @property
    def model_option(self) -> str:
        return f"--{self.name}-model"

    def with_profile_model(self, profile: AgentProfile, model: str) -> AgentProfile:
        return replace(profile, program_models={**profile.program_models, self.name: model})

    def session_model(self) -> str:
        return next(model.name for model in self.models if model.tier is self.session_tier)

    def nearest_general_model(self, names: Sequence[str]) -> str:
        return self.nearest_model(ModelTier.GENERAL, names)

    def nearest_model(self, tier: ModelTier, names: Sequence[str]) -> str:
        automatic = [model for model in self.models if model.tier is not ModelTier.RARE]
        allowed = [model.name for model in automatic if model.name in names]
        if not allowed:
            raise Refusal(f"{self.name} has no allowed automatic model", "name an allowed model with --model, or allow a fast, general or strongest model")
        positions = {model.name: index for index, model in enumerate(automatic)}
        wanted = next((index for index, model in enumerate(automatic) if model.tier is tier), 0)
        return min(allowed, key=lambda name: abs(positions[name] - wanted))

    @abstractmethod
    def session_command(self, launch: Launch) -> LaunchCommand: ...

    @abstractmethod
    def helper_command(self, launch: HelperLaunch) -> LaunchCommand: ...

    @abstractmethod
    def new_session_arguments(self, session: str) -> Sequence[str]: ...

    @abstractmethod
    def resumed_arguments(self, session: str) -> Sequence[str]: ...

    def is_session_chosen(self) -> bool:
        return bool(self.new_session_arguments(""))

    @abstractmethod
    def helper_outcome(self, output: str, errors: str) -> HelperOutcome: ...

    @abstractmethod
    def transcript(self, project: Path, session: str) -> Path | None: ...

    @abstractmethod
    def transcript_row(self, line: str, position: int) -> TranscriptRow | None: ...

    def session_matches_folder(self, project: Path, session: str) -> bool:
        return self.transcript(project, session) is not None

    def last_reply(self, project: Path, session: str) -> str:
        path = self.transcript(project, session)
        lines = TranscriptTail(path).lines() if path else []
        rows = (self.transcript_row(line, position) for position, line in enumerate(reversed(lines)))
        return next((row.text for row in rows if row and row.author == AGENT_AUTHOR), "")

    def agent_replies(self, project: Path, session: str, count: int) -> tuple[TranscriptRow, ...]:
        path = self.transcript(project, session)
        lines = TranscriptTail(path).lines() if path else []
        rows = (self.transcript_row(line, position) for position, line in enumerate(lines))
        return tuple(row for row in rows if row and row.author == AGENT_AUTHOR)[-count:]

    def transcript_entry(self, line: str) -> TranscriptEntry | None:
        try:
            row = self.transcript_row(line, 0)
            if row is None or not self.is_session_entry(line, row):
                return None
            return TranscriptEntry(row.author != AGENT_AUTHOR, row.text, Timestamp.parsed(row.time))
        except ValueError:
            return None

    def is_session_entry(self, line: str, row: TranscriptRow) -> bool:
        return row.author in (AGENT_AUTHOR, USER_AUTHOR)

    @abstractmethod
    def folder_prepared(self, root: Path, folder: Path, runner: str) -> None: ...

    def folder_trusted(self, folder: Path) -> None:
        pass

    @abstractmethod
    def hook_trust(self, project: Path) -> HookTrust: ...

    @classmethod
    def hooks_rewritten(cls, path: Path, original_hooks: object, updated_hooks: object) -> None:
        pass

    @classmethod
    def record_hook_write(cls, path: Path, hooks: Mapping[str, object]) -> None:
        pass

    @classmethod
    def hooks_copied(cls, source: Path, target: Path) -> None:
        pass

    def user_hook_files(self) -> tuple[Path, ...]:
        return ()

    def context_tokens(self, home: JournalHome, session: str) -> int | None:
        return None

    def uses_web_reader(self, event: HookEvent) -> bool:
        return (event.tool_input().get("subagent_type") or event.raw.get("agent_type")) in self.web_reader_agents

    def skills_kept_after_compaction(self, transcript: Path | None) -> Mapping[str, str]:
        return {}

    def transcript_path(self, event: HookEvent) -> Path | None:
        return event.transcript.path

    def delivered_line(self, line: SessionLine) -> bool:
        return False

    def peer_note(self, line: str) -> Sequence[PeerNote]:
        return ()

    def context_percent(self, home: JournalHome, session: str) -> int | None:
        return None

    def context_window(self, home: JournalHome, session: str) -> ContextWindow:
        return ContextWindow(self.context_percent(home, session), self.context_tokens(home, session))

    def session_effort(self, home: JournalHome, session: str) -> str:
        return ""

    def reported_model(self, home: JournalHome, session: str) -> str:
        return ""

    def effort(self, model: str) -> str:
        return ""

    def session_temp_folders(self, project: Path) -> Mapping[str, Path]:
        return {}

    @classmethod
    def hook_settings(cls, runner: str, root: Path) -> Mapping[str, object]:
        return {}
