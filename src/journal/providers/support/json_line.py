import json
from typing import Self


class JsonLine:
    """A value read from one line of a program's JSON-lines output: a line that is no JSON object reads as the value's blank."""

    @classmethod
    def blank(cls) -> Self:
        raise NotImplementedError

    @classmethod
    def built(cls, data: dict) -> Self:
        raise NotImplementedError

    @classmethod
    def parsed(cls, line: str) -> Self:
        try:
            data = json.loads(line)
        except ValueError:
            return cls.blank()
        return cls.built(data) if isinstance(data, dict) else cls.blank()

    @classmethod
    def lines(cls, output: str) -> list[Self]:
        return [cls.parsed(line) for line in output.splitlines()]
