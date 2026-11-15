from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from core.modules.processes.support.block_conditions.output_titled import OutputTitled


class RunNameMessage(MessageTemplate):
    """The agent message processes.name_the_run."""

    key = "processes.name_the_run"
    type = AgentMessageType.STEERING
    text = "Output {process} is titled by its raw command: give it a title"
    required_command = "journal output title {process}"
    closed_by = OutputTitled
