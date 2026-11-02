from core.modules.waits.support.wait_nudges import WAIT_ENDED
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait


WORK_CONTINUED = "the agent went on working"
LINE_SOURCE = "waits.wait-over"


class WaitEndListener(SaveListener):
    """A wait that ended on anything but the agent's own work tells the agent it is over, and how, at its next hook."""

    name = "waits.wait-over"
    event = "wait.*"

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, change: Change[Model]) -> None:
        wait = change.row
        if not isinstance(wait, Wait) or wait.state is not WaitState.ENDED or not change.event.endswith(".end") or wait.outcome == WORK_CONTINUED:
            return
        self.repository.save(AgentLine(agent_id=wait.agent_id, creator_id=change.context.actor.id, text=WAIT_ENDED.nudge(wait=wait.id, outcome=wait.outcome).text, source=LINE_SOURCE), change.context)
