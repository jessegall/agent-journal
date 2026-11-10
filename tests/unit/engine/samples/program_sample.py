from collections.abc import Sequence
from pathlib import Path

from engine.enums.hook_event_name import HookEventName
from engine.enums.tool_type import ToolType
from engine.provider.helper_launch import HelperLaunch
from engine.provider.helper_outcome import HelperOutcome
from engine.provider.hook_file import HookFile
from engine.enums.hook_trust import HookTrust
from engine.provider.launch import Launch
from engine.provider.launch_command import LaunchCommand
from engine.provider.provider import Provider
from engine.enums.refusal_style import RefusalStyle
from engine.provider.transcript_row import TranscriptRow

HOOK_FILE = Path(".sample/hooks.json")


class SampleProgram(Provider):
    """A third agent program a module adds, with the common decoder and hooks in .sample/hooks.json."""

    name = "sample"
    title = "Sample program"
    executable = "sample"
    hook_events = {"Start": HookEventName.SESSION_START, "BeforeTool": HookEventName.PRE_TOOL_USE, "End": HookEventName.STOP}
    subagent_events = []
    line_events = [HookEventName.SESSION_START]
    refusals = {HookEventName.STOP: RefusalStyle.BLOCK}
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
        return HelperOutcome(output, "", errors or None)

    def transcript(self, project: Path, session: str) -> Path | None:
        return None

    def transcript_row(self, line: str, position: int) -> TranscriptRow | None:
        return None

    def folder_prepared(self, root: Path, folder: Path, runner: str) -> None:
        return None

    def hook_trust(self, project: Path) -> HookTrust:
        return HookTrust.READY
