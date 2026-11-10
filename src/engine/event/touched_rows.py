from collections.abc import Iterable, Mapping
from dataclasses import dataclass

from engine.event.logged_event import LoggedEvent

CREATED, UPDATED, DELETED = "created", "updated", "deleted"
ACTION_LABELS = {"create": CREATED, "delete": DELETED}


@dataclass(frozen=True)
class TouchedRows:
    """The rows one command changed, by model:number, each under what that command did to it as a whole."""

    labels: Mapping[str, str]

    @classmethod
    def built(cls, events: Iterable[LoggedEvent]) -> "TouchedRows":
        labels: dict[str, str] = {}
        for event in events:
            model, action = event.event.rsplit(".", 1)
            name = f"{model}:{event.row_id}"
            labels[name] = ACTION_LABELS.get(action, labels.get(name, UPDATED))
        return cls(labels)

    def lines(self) -> list[str]:
        groups = ((label, [name for name, row_label in self.labels.items() if row_label == label]) for label in (CREATED, UPDATED, DELETED))
        return [f"{label}: {', '.join(names)}" for label, names in groups if names]
