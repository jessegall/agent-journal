from engine.driver.message_template import MessageTemplate
from engine.driver.message_template import MessageTemplate as Declaration
from engine.enums.agent_message_type import AgentMessageType

# @sin architecture_nudges_stored_text
REPORT = MessageTemplate("sample.report", AgentMessageType.STEERING, "worker:{worker}: {report}")
# @sin architecture_nudges_stored_text
REASON = MessageTemplate("sample.reason", AgentMessageType.STEERING, "worker:{worker}: {reason}")
# @sin architecture_nudges_stored_text
COMMAND = MessageTemplate("sample.command", AgentMessageType.STEERING, "{command}", path_fields=["command"])
# @sin architecture_nudges_stored_text
ALIASED = Declaration("sample.alias", AgentMessageType.STEERING, "{summary}")
# @sin architecture_nudges_stored_text
PLURAL = MessageTemplate("sample.plural", AgentMessageType.STEERING, "message:{message}", plural_text="{words}")
# @sin architecture_nudges_stored_text
KEYWORDS = MessageTemplate(key="sample.named", type=AgentMessageType.NOTICE, text="{message_text}")
# @righteous architecture_nudges_stored_text
ROWS = MessageTemplate("sample.rows", AgentMessageType.STEERING, "{count} messages: {messages}")
# @righteous architecture_nudges_stored_text
PATH = MessageTemplate("sample.path", AgentMessageType.STEERING, "read {path}", path_fields=["path"])
# @righteous architecture_nudges_stored_text
OPENING = MessageTemplate("drivers.opening_line", AgentMessageType.NOTICE, "{text}")
# @righteous architecture_nudges_stored_text
FAULT = MessageTemplate("drivers.rule_failed", AgentMessageType.NOTICE, "{text}")

# @righteous architecture_nudges_stored_text
PLAIN_DICT = dict(text="{reason}")
