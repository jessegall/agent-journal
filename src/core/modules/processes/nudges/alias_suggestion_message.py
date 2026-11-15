from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class AliasSuggestionMessage(MessageTemplate):
    """The nudge processes.alias_suggestion."""

    key = "processes.alias_suggestion"
    type = AgentMessageType.STEERING
    text = "You ran {shape} {count} times: save it as an alias"
    interval = Interval(Seconds(3600))
