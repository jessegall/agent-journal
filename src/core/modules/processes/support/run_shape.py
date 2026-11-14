import re
from dataclasses import dataclass


@dataclass(frozen=True)
class RunShape:
    """The line shape in a run's output that a reader counts for progress, the reader flag and pattern that count
    it, and whether the output states a total."""

    label: str
    located: re.Pattern[str]
    flag: str
    pattern: str
    states_total: bool
    count: str | None = None

    @property
    def total_note(self) -> str:
        return "states its total" if self.states_total else "states no total, so the command must print one first"

    def reader_options(self) -> str:
        count = f' --count "{self.count}"' if self.count is not None else ""
        return f'--lines "{self.located.pattern}" --summary "(?i)passed|failed|done" --{self.flag} "{self.pattern}"{count}'
