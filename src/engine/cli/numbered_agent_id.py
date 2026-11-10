from typing import Self


class NumberedAgentId(int):
    """The row id of an agent a command line named by its number, with that number, so a line built again from
    the parsed arguments names the same agent."""

    number: int

    @classmethod
    def with_number(cls, row_id: int, number: int) -> Self:
        numbered = cls(row_id)
        numbered.number = number
        return numbered
