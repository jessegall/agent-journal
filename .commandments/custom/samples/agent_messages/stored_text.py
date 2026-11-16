from engine.driver.message_template import MessageTemplate
from engine.driver.message_template import MessageTemplate as Declaration
from engine.enums.agent_message_type import AgentMessageType

# @sin architecture_messages_stored_text_in_an_agent_message
REPORT = MessageTemplate("sample.report", AgentMessageType.STEERING, "worker:{worker}: {report}")
# @sin architecture_messages_stored_text_in_an_agent_message
REASON = MessageTemplate("sample.reason", AgentMessageType.STEERING, "worker:{worker}: {reason}")
# @sin architecture_messages_stored_text_in_an_agent_message
COMMAND = MessageTemplate("sample.command", AgentMessageType.STEERING, "{command}", path_fields=["command"])
# @sin architecture_messages_stored_text_in_an_agent_message
ALIASED = Declaration("sample.alias", AgentMessageType.STEERING, "{summary}")
# @sin architecture_messages_stored_text_in_an_agent_message
PLURAL = MessageTemplate("sample.plural", AgentMessageType.STEERING, "message:{message}", plural_text="{words}")
# @sin architecture_messages_stored_text_in_an_agent_message
KEYWORDS = MessageTemplate(key="sample.named", type=AgentMessageType.NOTICE, text="{message_text}")
# @righteous architecture_messages_stored_text_in_an_agent_message
ROWS = MessageTemplate("sample.rows", AgentMessageType.STEERING, "{count} messages: {messages}")
# @righteous architecture_messages_stored_text_in_an_agent_message
PATH = MessageTemplate("sample.path", AgentMessageType.STEERING, "read {path}", path_fields=["path"])
# @righteous architecture_messages_stored_text_in_an_agent_message
OPENING = MessageTemplate("drivers.opening_line", AgentMessageType.NOTICE, "{text}")
# @righteous architecture_messages_stored_text_in_an_agent_message
FAULT = MessageTemplate("drivers.rule_failed", AgentMessageType.NOTICE, "{text}")

# @righteous architecture_messages_stored_text_in_an_agent_message
PLAIN_DICT = dict(text="{reason}")
