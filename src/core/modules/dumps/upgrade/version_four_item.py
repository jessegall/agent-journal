from dataclasses import dataclass

from core.base.type_guards import is_list, is_mapping
from core.modules.dumps.models.enums.item_state import ItemState


@dataclass(frozen=True)
class VersionFourItem:
    """What version 4 kept of one piece of a dump: the agent's insight, how it was filed or why it failed, and the
    rows it became."""

    insight: str = ""
    outcome: str = ""
    failed: str = ""
    refs: tuple[str, ...] = ()

    @classmethod
    def parsed(cls, raw: object) -> "VersionFourItem":
        if not is_mapping(raw):
            return cls()
        refs = raw.get("refs")
        return cls(string_value(raw.get("insight")), string_value(raw.get("outcome")), string_value(raw.get("failed")),
                   tuple(ref for ref in refs if isinstance(ref, str)) if is_list(refs) else ())

    @property
    def state(self) -> ItemState:
        if self.failed:
            return ItemState.FAILED
        if self.outcome:
            return ItemState.FILED
        return ItemState.READ if self.insight else ItemState.NEW

    @property
    def note(self) -> str:
        return self.insight if self.state is ItemState.READ else ""

    @property
    def summary(self) -> str:
        return self.failed or self.outcome


def string_value(value: object) -> str:
    return value if isinstance(value, str) else ""
