from engine.cli.row_numbers import RowNumbers
from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate


class AgentNumberMessages:
    """A template's agent message about one agent, which names that agent by its number in the given field."""

    @staticmethod
    def message(numbers: RowNumbers, template: type[MessageTemplate], field: str, agent_id: int, **fields: object) -> AgentMessage:
        return template.declared().agent_message(**{field: numbers.agent_number(agent_id)}, **fields)
