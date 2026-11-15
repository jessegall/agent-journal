from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RuleTaskMessage(MessageTemplate):
    """The nudge assign_rules.task_given."""

    key = "assign_rules.task_given"
    type = AgentMessageType.NOTICE
    text = "task:{task} is yours by assign-rule:{rule}"
    turn_limited = False
