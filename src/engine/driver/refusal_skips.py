from collections.abc import Sequence

from engine.actor.actor import Actor
from engine.command.command import Command


class RefusalSkips:
    """The skips agents earn after a refusal: one that waits for a rule, the rules that refused the agent's last
    refused hook, and the check of a skipped guard; with no module keeping skips, nothing waits and a skipped guard
    is simply skipped."""

    def waiting(self, agent_id: int, rule: str) -> Command[object] | None:
        return None

    def has_refused(self, agent_id: int, rule: str) -> bool:
        return rule in self.last_refused_rules(agent_id)

    # the rules that refused the agent's last refused hook
    def last_refused_rules(self, agent_id: int) -> frozenset[str]:
        return frozenset()

    def check_guards(self, actor: Actor, guards: Sequence[str], reason: str) -> None:
        return None
