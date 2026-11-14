from collections.abc import Sequence

from engine.actor.actor import Actor
from engine.command.command import Command
from engine.driver.interval import Interval
from engine.time.timestamp import Timestamp


class RefusalSkips:
    """The skips agents earn after a refusal: one that waits for a rule, one that silences a rule for a window, and the check of a skipped guard; with no
    module keeping skips, nothing waits and a skipped guard is simply skipped."""

    def waiting(self, agent_id: int, rule: str) -> Command[object] | None:
        return None

    def has_refused(self, agent_id: int, rule: str) -> bool:
        return False

    def is_skipped(self, agent_id: int, rule: str, window: Interval, timestamp: Timestamp) -> bool:
        return False

    def check_guards(self, actor: Actor, guards: Sequence[str], reason: str) -> None:
        return None
