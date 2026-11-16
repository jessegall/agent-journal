from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType

# @sin architecture_messages_command_in_an_agent_message
APPROVAL_SHOWN = MessageTemplate("sample.show", AgentMessageType.NOTICE, "approval {approval} was decided: journal approval show {approval}")
# @sin architecture_messages_command_in_an_agent_message
TRIGGERS_FIRED = MessageTemplate("sample.plural", AgentMessageType.NOTICE, "trigger:{trigger} fired", plural_text="triggers {trigger} fired: read each with journal trigger show <id>")
# @sin architecture_messages_command_in_an_agent_message
OVERVIEW_FIRST = MessageTemplate(key="sample.named", type=AgentMessageType.NOTICE, text="run journal overview first")
# @righteous architecture_messages_command_in_an_agent_message
APPROVAL_DECIDED = MessageTemplate("sample.decided", AgentMessageType.NOTICE, "approval {approval} was decided")
# @righteous architecture_messages_command_in_an_agent_message
JOURNAL_STARTED = MessageTemplate("sample.prose", AgentMessageType.NOTICE, "the journal started: go on with your work")
# @righteous architecture_messages_command_in_an_agent_message
DRIVER_ACCESS = MessageTemplate("sample.commands", AgentMessageType.NOTICE, "this driver runs journal commands only")
# @righteous architecture_messages_command_in_an_agent_message
IMAGE_TAG_DUE = MessageTemplate("sample.paid", AgentMessageType.STEERING, "message:{message} has an image", required_command="journal message tag {message}")
