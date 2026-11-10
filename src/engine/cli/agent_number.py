from typing import Self

AGENT_MODEL_NAME = "agent"
HIGHEST_NUMBER = 10 ** 19 - 1
ROW_ID_PREFIX = "row:"


class AgentNumber(int):
    """An agent as written on a command line: its number in the environment the line runs in. Used as the type
    of a parser argument, it accepts whole numbers from 1 up to 19 digits. The viewer follows an agent by the
    id of its row and writes that id as row:<id>; is_row_id says which of the two was written."""

    is_row_id: bool

    def __new__(cls, text: str | int) -> Self:
        is_row_id = isinstance(text, str) and text.startswith(ROW_ID_PREFIX)
        number = super().__new__(cls, text.removeprefix(ROW_ID_PREFIX) if isinstance(text, str) else text)
        if not 1 <= number <= HIGHEST_NUMBER:
            raise ValueError(f"{text} is no agent number")
        number.is_row_id = is_row_id
        return number


def row_argument_type(is_numbered: bool) -> type[int]:
    return AgentNumber if is_numbered else int
