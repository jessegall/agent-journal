from dataclasses import dataclass, field

from engine.driver.agent_message import AgentMessage
from engine.enums.line_channel import LineChannel
from engine.enums.line_category import LineCategory
from engine.enums.agent_message_type import AgentMessageType


@dataclass(frozen=True)
class Line:
    """Keyed text the agent reads, with what it is for, the key of its interval and how it reaches the agent;
    it changes nothing."""

    key: str
    text: str
    category: LineCategory
    interval_key: str
    channel: LineChannel
    # the key of the source that gave it, whose history records when it last spoke
    source_key: str = ""
    # the agent message it was made from, whose interval, record keys and required command the line keeps when it is said
    agent_message: AgentMessage | None = field(default=None, compare=False)

    # a line of an agent message, of the category its type gives unless one is named
    @classmethod
    def of_agent_message(cls, agent_message: AgentMessage, channel: LineChannel, category: LineCategory | None = None) -> "Line":
        message_category = LineCategory.STEERING if agent_message.type is AgentMessageType.STEERING else LineCategory.INFORMATION
        line_category = message_category if category is None else category
        return cls(agent_message.key, agent_message.text, line_category, agent_message.key, channel, agent_message=agent_message)

    # the agent message that says this line: the one it was made from, or one of its words alone
    def given_message(self) -> AgentMessage:
        if self.agent_message is not None:
            return self.agent_message
        return AgentMessage(self.key, AgentMessageType.STEERING if self.category is LineCategory.STEERING else AgentMessageType.NOTICE, self.text)
