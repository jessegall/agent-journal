from collections.abc import Sequence
from pathlib import Path

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.tool_type import ToolType
from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.helper_outcome import HelperOutcome
from core.base.provider.hook_file import HookFile
from core.base.provider.hook_trust import HookTrust
from core.base.provider.launch import Launch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.provider import Provider
from core.base.provider.refusal_style import RefusalStyle
from core.base.provider.transcript_row import TranscriptRow

HOOK_FILE = Path(".sample/hooks.json")


class SampleProgram(Provider):
    """A third agent program a module adds, with the common decoder and hooks in .sample/hooks.json."""

    name = "sample"
    title = "Sample program"
    executable = "sample"
    hook_events = {"Start": HookEventName.SESSION_START, "BeforeTool": HookEventName.PRE_TOOL_USE, "End": HookEventName.STOP}
    subagent_events = []
    line_events = [HookEventName.SESSION_START]
    refusals = {HookEventName.PRE_TOOL_USE: RefusalStyle.EXIT_CODE}
    tool_categories = {"shell": ToolType.SHELL}
    hook_file = HookFile(HOOK_FILE, {})
    session_variable = "SAMPLE_SESSION_ID"
    markers = ["SAMPLE_SESSION_ID"]
    models = []

    def session_command(self, launch: Launch) -> LaunchCommand:
        return LaunchCommand([self.executable, *launch.session.arguments(self)], launch.folder, launch.variables, launch.session.session)

    def helper_command(self, launch: HelperLaunch) -> LaunchCommand:
        return LaunchCommand([self.executable, launch.brief], launch.folder, launch.variables, launch.session.session)

    def new_session_arguments(self, session: str) -> Sequence[str]:
        return ["--session", session]

    def resumed_arguments(self, session: str) -> Sequence[str]:
        return ["--resume", session]

    def helper_outcome(self, output: str, errors: str) -> HelperOutcome:
        return HelperOutcome(output, "", errors)

    def transcript(self, project: Path, session: str) -> Path | None:
        return None

    def transcript_rows(self, path: Path) -> Sequence[TranscriptRow]:
        return []

    def folder_prepared(self, root: Path, folder: Path, runner: str) -> None:
        return None

    def hook_trust(self, project: Path) -> HookTrust:
        return HookTrust.READY
