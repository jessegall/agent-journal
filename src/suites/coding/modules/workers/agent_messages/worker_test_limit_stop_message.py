from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTestLimitStopMessage(MessageTemplate):
    """The nudge processes.run_over_test_limit."""

    key = "processes.run_over_test_limit"
    type = AgentMessageType.STEERING
    text = "Output {output} stopped: {count} tests, limit {limit}. Run only what proves your change; proofs run at hand-in"
    wakes_agent = True
