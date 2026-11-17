from engine.driver.message_template import MessageTemplate
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.support.exits.exit_texts import ExitTexts
from engine.enums.agent_message_type import AgentMessageType


class ReadRefusalMessage(MessageTemplate):
    """The agent message processes.reading_prevented."""

    key = "processes.reading_prevented"
    type = AgentMessageType.REFUSAL
    text = "output {output} has no proper reader{lacks}: " + ExitTexts.template(PressureLevel.PREVENT.exits)
    full_text = True
