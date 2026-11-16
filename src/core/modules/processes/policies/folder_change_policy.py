from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.processes.agent_messages.move_ban_message import MoveBanMessage

CHANGE_WORD = "cd"


class FolderChangePolicy(EventPolicy):
    """An agent does not move to another folder with cd; a cd into the folder it is already in does nothing
    and goes through."""

    key = "processes.folder-change"
    rank = "shell.all"

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error:
            return None
        folder = event.folder.rstrip("/")
        for part in shell.parts:
            if part.program == CHANGE_WORD and [argument.rstrip("/") for argument in part.arguments] != [folder]:
                return MoveBanMessage.declared().agent_message(folder=folder or "the project")
        return None
