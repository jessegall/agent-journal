from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerJudgeScopeMessage(MessageTemplate):
    """The nudge workers.judge_scope."""

    key = "workers.judge_scope"
    type = AgentMessageType.REFUSAL
    text = "A worker judges only its own changes or its branch"
    turn_limited = False
