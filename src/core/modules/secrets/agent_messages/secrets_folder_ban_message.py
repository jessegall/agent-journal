from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SecretsFolderBanMessage(MessageTemplate):
    """The agent message secrets.out_of_reach."""

    key = "secrets.out_of_reach"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "The secrets folder is off limits: run programs that need a secret through the secret command"
