from collections import Counter
from dataclasses import dataclass

from journal.models.support.model_load import ModelLoad


@dataclass(frozen=True)
class RequestLoads:
    """The rows one request or hook turned into models, counted per model, the most first; empty while load counting is off."""

    counts: tuple[ModelLoad, ...] = ()

    @classmethod
    def tallied(cls, tally: Counter) -> "RequestLoads":
        return cls(tuple(ModelLoad(model, rows) for model, rows in tally.most_common()))

    @classmethod
    def parsed(cls, data: dict) -> "RequestLoads":
        return cls(tuple(ModelLoad(model=item["model"], rows=item["rows"]) for item in data.get("counts", ())))

    def line(self) -> str:
        return ", ".join(f"{count.rows} {count.model}" for count in self.counts)
