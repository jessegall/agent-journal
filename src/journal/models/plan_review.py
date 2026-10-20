from dataclasses import dataclass
from typing import ClassVar

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class PlanReview(Scoped):
    """One round of reviewers reading a plan: opened when the plan goes into review, closed when it is made ready again, with the reviewers that read it and what the round changed in it."""

    text_fields: ClassVar[tuple[str, ...]] = ("changed",)

    reviewers: tuple[str, ...] = ()
    changed: str | None = None

    def is_open(self) -> bool:
        return self.changed is None

    def closed(self, reviewers: tuple[str, ...], changed: str) -> "PlanReview":
        return self.with_(reviewers=reviewers, changed=changed)
