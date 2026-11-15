from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MergeWaitsMessage(MessageTemplate):
    """The nudge workers.merge_waits."""

    key = "workers.merge_waits"
    type = AgentMessageType.STEERING
    text = "The merge of worker {worker} waits for environment {environment} to check out {branch} again"
    turn_limited = False
    plural_text = 'The merges of workers {worker} wait for environment {environment} to check out {branch} again'
    id_field = "worker"
