from collections.abc import Mapping, Sequence
from dataclasses import dataclass

RECENT_TASKS = 20


@dataclass(frozen=True)
class RecentMatches:
    """How many of the newest tasks of the environment a rule would have taken: a dry run over a bounded number of
    tasks, so it stays quick on a large project."""

    tried: int
    matched: int

    @property
    def text(self) -> str:
        if self.tried and self.matched == self.tried:
            return f"The rule would have taken all {self.tried} of the last {self.tried} tasks"
        return f"The rule would have taken {self.matched} of the last {self.tried} tasks"

    def lines(self) -> Sequence[str]:
        return (self.text,)

    def json(self) -> Mapping[str, object]:
        return {"tried": self.tried, "matched": self.matched, "text": self.text}
