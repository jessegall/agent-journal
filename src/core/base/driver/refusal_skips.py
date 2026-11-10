from collections.abc import Sequence

from engine.actor.actor import Actor
from core.base.command.command import Command


class RefusalSkips:
    """The skips agents earn after a refusal: one that waits for a rule, and the check of a skipped guard; with no
    module keeping skips, nothing waits and a skipped guard is simply skipped."""

    def waiting(self, agent_id: int, rule: str) -> Command[object] | None:
        return None

    def has_refused(self, agent_id: int, rule: str) -> bool:
        return False

    def check_guards(self, actor: Actor, guards: Sequence[str], reason: str) -> None:
        return None
