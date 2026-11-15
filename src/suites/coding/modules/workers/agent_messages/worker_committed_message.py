from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerCommittedMessage(MessageTemplate):
    """The nudge workers.committed."""

    key = "workers.committed"
    type = AgentMessageType.STEERING
    text = "The work of worker:{worker} is committed and ready to merge"
    turn_limited = False
    plural_text = 'the work of workers {worker} is committed and can be merged'
    id_field = "worker"
