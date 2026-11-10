from argparse import Namespace

from engine.cli.agent_number import AGENT_MODEL_NAME, AgentNumber, NumberedAgentId
from engine.cli.row_numbers import RowNumbers


class AgentNumberArguments:
    """Replaces every agent number among the parsed arguments of a line by the row id of that agent in the
    environment the line runs in. It runs after the environment of the line is checked."""

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def replace_numbers(self, arguments: Namespace, environment_id: int | None) -> None:
        for name, value in vars(arguments).items():
            if isinstance(value, AgentNumber):
                setattr(arguments, name, self.row_id(value, environment_id))
            elif isinstance(value, list):
                setattr(arguments, name, [self.row_id(item, environment_id) if isinstance(item, AgentNumber) else item for item in value])

    def row_id(self, number: AgentNumber, environment_id: int | None) -> NumberedAgentId:
        return NumberedAgentId.of(self.numbers.row_id(AGENT_MODEL_NAME, int(number), environment_id), int(number))
