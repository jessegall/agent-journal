from typing import Self

AGENT_MODEL_NAME = "agent"
HIGHEST_NUMBER = 10 ** 19 - 1


class AgentNumber(int):
    """An agent as written on a command line: its number in the environment the line runs in. Used as the type
    of a parser argument, it accepts whole numbers from 1 up to 19 digits and nothing else."""

    def __new__(cls, text: str | int) -> Self:
        number = super().__new__(cls, text)
        if not 1 <= number <= HIGHEST_NUMBER:
            raise ValueError(f"{text} is no agent number")
        return number


class NumberedAgentId(int):
    """The row id of an agent a command line named by its number, with that number, so a line built again from
    the parsed arguments names the same agent."""

    number: int

    @classmethod
    def of(cls, row_id: int, number: int) -> Self:
        numbered = cls(row_id)
        numbered.number = number
        return numbered


def row_argument_type(is_numbered: bool) -> type[int]:
    return AgentNumber if is_numbered else int
