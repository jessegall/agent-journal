from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StaleChoicesMessage(MessageTemplate):
    """The agent message workers.worktree_behind_choices."""

    key = "workers.worktree_behind_choices"
    type = AgentMessageType.STEERING
    text = "worker:{worker} is {count} commits behind: order its update, leave it or pass it"
    turn_limited = False
    wakes_agent = True
    full_text = True
