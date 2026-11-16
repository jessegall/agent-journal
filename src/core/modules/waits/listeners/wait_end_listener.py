from engine.scope.actor_scope import ActorScope
from core.modules.waits.agent_messages.wait_ended_message import WaitEndedMessage
from engine.event.moved import Moved
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from core.modules.waits.models.lifecycles.wait_lifecycle import WaitLifecycle
from engine.driver.message_sender import MessageSender
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait


WORK_CONTINUED = "the agent went on working"
LINE_SOURCE = "waits.wait-over"


class WaitEndListener(SaveListener[Moved[Wait]]):
    """A wait that ended on anything but the agent's own work tells the agent it is over, and how, at its next
    hook."""

    name = "waits.wait-over"
    moves = (WaitLifecycle.end,)
    disabled_scopes = [ActorScope]

    def __init__(self, message_sender: MessageSender) -> None:
        self.message_sender = message_sender

    def handle(self, event: Moved[Wait], context: Context) -> None:
        wait = event.row
        if wait.state is not WaitState.ENDED or wait.outcome == WORK_CONTINUED:
            return
        self.message_sender.send(wait.session_agent_id, WaitEndedMessage.declared(), LINE_SOURCE, context, wait=wait.id)
