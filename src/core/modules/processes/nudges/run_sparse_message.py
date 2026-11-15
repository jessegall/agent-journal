from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RunSparseMessage(MessageTemplate):
    """The nudge processes.run_sparse."""

    key = "processes.run_sparse"
    type = AgentMessageType.NOTICE
    text = "Output {output} prints about once every {seconds}s, too sparse for a reader: {hint}"
    plural_text = "outputs {output} print too seldom for a reader to follow: {hint}"
    id_field = "output"
