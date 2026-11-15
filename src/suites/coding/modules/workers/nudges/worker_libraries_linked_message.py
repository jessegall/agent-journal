from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerLibrariesLinkedMessage(MessageTemplate):
    """The nudge workers.libraries_linked."""

    key = "workers.libraries_linked"
    type = AgentMessageType.STEERING
    text = "Your worktree's libraries are linked: rerun your tests"
    turn_limited = False
    wakes_agent = True
