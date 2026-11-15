from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.processes.nudges.move_ban_nudge import MoveBanNudge

CHANGE_WORD = "cd"


class FolderChangePolicy(EventPolicy):
    """An agent does not move to another folder with cd; a cd into the folder it is already in does nothing
    and goes through."""

    key = "processes.folder-change"
    rank = "shell.all"

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error:
            return None
        folder = str(event.raw.get("cwd", "")).rstrip("/")
        for part in shell.parts:
            if part.program == CHANGE_WORD and [argument.rstrip("/") for argument in part.arguments] != [folder]:
                return MoveBanNudge.declared().nudge(folder=folder or "the project")
        return None
