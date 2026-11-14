from argparse import Namespace

from engine.cli.agent_number import AGENT_MODEL_NAME, AgentNumber
from engine.cli.numbered_agent_id import NumberedAgentId
from engine.cli.row_numbers import RowNumbers


class AgentNumberArguments:
    """Replaces every agent number among the parsed arguments of a line by the row id of that agent in the
    environment the line runs in. An agent written as row:<id> must be an agent of that environment.
    It runs after the environment of the line is checked."""

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def replace_numbers(self, arguments: Namespace, environment_id: int | None) -> None:
        for name, value in vars(arguments).items():
            if isinstance(value, AgentNumber):
                setattr(arguments, name, self.row_id(value, environment_id))
            elif isinstance(value, list):
                setattr(arguments, name, [self.row_id(item, environment_id) if isinstance(item, AgentNumber) else item for item in value])

    def row_id(self, number: AgentNumber, environment_id: int | None) -> NumberedAgentId:
        if number.is_row_id:
            return NumberedAgentId.with_number(int(number), self.numbers.environment_number(AGENT_MODEL_NAME, int(number), environment_id))
        return NumberedAgentId.with_number(self.numbers.row_id(AGENT_MODEL_NAME, number, environment_id), number)
