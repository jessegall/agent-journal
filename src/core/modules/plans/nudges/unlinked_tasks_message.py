from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnlinkedTasksMessage(MessageTemplate):
    """The nudge plans.unlinked_tasks."""

    key = "plans.unlinked_tasks"
    type = AgentMessageType.STEERING
    text = "plan {plan}: {count} open tasks, none blocked: set what each one waits on"
    turn_limited = False
