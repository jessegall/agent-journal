from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MergeHookFailedMessage(MessageTemplate):
    """The agent message workers.merge_hook_failed."""

    key = "workers.merge_hook_failed"
    type = AgentMessageType.STEERING
    text = "the merge hook {command!r} of worker:{worker} failed, and its merge stands: run it in the checkout to read its output"
    wakes_agent = True
