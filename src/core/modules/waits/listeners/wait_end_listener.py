from core.base.scope.actor_scope import ActorScope
from core.modules.waits.support.wait_nudges import WAIT_ENDED
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.waits.models.lifecycles.wait_lifecycle import WaitLifecycle
from core.modules.drivers.support.nudger import Nudger
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait


WORK_CONTINUED = "the agent went on working"
LINE_SOURCE = "waits.wait-over"


class WaitEndListener(SaveListener[Moved[Wait]]):
    """A wait that ended on anything but the agent's own work tells the agent it is over, and how, at its next
    hook."""

    name = "waits.wait-over"
    moves = tuple([WaitLifecycle.end])
    disabled_scopes = [ActorScope]

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, event: Moved[Wait], context: Context) -> None:
        wait = event.row
        if wait.state is not WaitState.ENDED or wait.outcome == WORK_CONTINUED:
            return
        self.nudger.send(wait.session_agent_id, WAIT_ENDED, LINE_SOURCE, context, wait=wait.id)
