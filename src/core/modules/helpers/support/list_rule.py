import re
from collections.abc import Iterator, Sequence
from dataclasses import dataclass

from core.base.type_guards import is_list, is_tuple


@dataclass(frozen=True)
class ListRule:
    """What a list setting accepts: text lines that are not blank or repeated, each matching the pattern and
    listed in the choices when those are given, with the numbers at their ends adding up to the total if set."""

    pattern: str = ""
    choices: Sequence[str] = ()
    total: int = 0

    def problems(self, key: str, value: object) -> Iterator[str]:
        lines = list(value) if is_tuple(value) else value
        if not is_list(lines) or not all(isinstance(line, str) for line in lines):
            yield f"{key} is a list of text lines, not {value!r}"
            return
        for line in lines:
            yield from self.line_problems(key, str(line))
        if len(set(lines)) != len(lines):
            yield f"{key} lists the same line twice"
        if self.total and lines and sum(self.ending_number(str(line)) for line in lines) != self.total:
            yield f"the numbers in {key} must add up to {self.total}"

    def line_problems(self, key: str, line: str) -> Iterator[str]:
        if not line.strip():
            yield f"{key} holds a blank line"
        elif self.pattern and not re.fullmatch(self.pattern, line):
            yield f"{key} holds {line!r}, which does not follow {self.pattern}"
        elif self.choices and line not in self.choices:
            yield f"{key} holds {line!r}; choose from {', '.join(self.choices)}"

    @staticmethod
    def ending_number(line: str) -> int:
        digits = re.search(r"(\d+)$", line)
        return int(digits.group(1)) if digits else 0
