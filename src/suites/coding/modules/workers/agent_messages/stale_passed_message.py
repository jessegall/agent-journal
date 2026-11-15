from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StalePassedMessage(MessageTemplate):
    """The nudge workers.worktree_behind_passed."""

    key = "workers.worktree_behind_passed"
    type = AgentMessageType.STEERING
    text = "the merger passed worker:{worker} to you with behind check {check}: decide whether it updates"
    turn_limited = False
    wakes_agent = True
    full_text = True
