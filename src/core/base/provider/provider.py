from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from pathlib import Path
from typing import ClassVar

from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.tool_type import ToolType
from core.base.journal_home import JournalHome
from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.helper_outcome import HelperOutcome
from core.base.provider.hook_decoder import HookDecoder
from core.base.provider.hook_file import HookFile
from core.base.provider.hook_trust import HookTrust
from core.base.provider.launch import Launch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.program_folders import ProgramFolders
from core.base.provider.program_model import ProgramModel
from core.base.provider.refusal_style import RefusalStyle
from core.base.provider.session_line import SessionLine
from core.base.provider.transcript_row import TranscriptRow


class Provider(ABC):
    """The base of every agent program's provider: how the journal starts the program, which hooks it sends
    under which event names, how its answers are printed, where its hooks are written, where it keeps its
    sessions, and how it trusts a folder."""

    name: ClassVar[str]
    title: ClassVar[str]
    executable: ClassVar[str]
    hook_events: ClassVar[Mapping[str, HookEventName]]
    subagent_events: ClassVar[Sequence[str]]
    line_events: ClassVar[Sequence[HookEventName]]
    refusals: ClassVar[Mapping[HookEventName, RefusalStyle]] = {}
    tool_categories: ClassVar[Mapping[str, ToolType]]
    rewrites: ClassVar[Mapping[HookEventName, Mapping[str, object]]] = {}
    decoder: ClassVar[HookDecoder] = HookDecoder.COMMON
    hook_file: ClassVar[HookFile]
    session_variable: ClassVar[str]
    markers: ClassVar[Sequence[str]]
    models: ClassVar[Sequence[ProgramModel]]

    def __init__(self, folders: ProgramFolders) -> None:
        self.folders = folders

    @abstractmethod
    def session_command(self, launch: Launch) -> LaunchCommand: ...

    @abstractmethod
    def helper_command(self, launch: HelperLaunch) -> LaunchCommand: ...

    @abstractmethod
    def new_session_arguments(self, session: str) -> Sequence[str]: ...

    @abstractmethod
    def resumed_arguments(self, session: str) -> Sequence[str]: ...

    @abstractmethod
    def helper_outcome(self, output: str, errors: str) -> HelperOutcome: ...

    @abstractmethod
    def transcript(self, project: Path, session: str) -> Path | None: ...

    @abstractmethod
    def transcript_rows(self, path: Path) -> Sequence[TranscriptRow]: ...

    @abstractmethod
    def folder_prepared(self, root: Path, folder: Path, runner: str) -> None: ...

    @abstractmethod
    def hook_trust(self, project: Path) -> HookTrust: ...

    def transcript_path(self, event: HookEvent) -> Path | None:
        path = event.raw.get("transcript_path")
        return Path(path).expanduser() if isinstance(path, str) and path else None

    def line_sent(self, line: SessionLine) -> bool:
        return False

    def context_percent(self, home: JournalHome, session: str) -> int | None:
        return None

    @classmethod
    def hook_settings(cls, runner: str, root: Path) -> Mapping[str, object]:
        return {}
