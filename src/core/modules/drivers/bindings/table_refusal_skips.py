from collections.abc import Sequence

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.command import Command
from engine.driver.refusal_skips import RefusalSkips
from engine.guard.guards import LIFECYCLE_GUARD
from engine.query.queries import Queries
from engine.log.refusal_log import RefusalLog
from engine.registry.registry import Registry
from core.modules.drivers.commands.skip_refusal.skip_refusal import SkipRefusal
from core.modules.drivers.commands.use_grant.use_grant import UseGrant
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.driver_grant import DriverGrant
from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType


class TableRefusalSkips(RefusalSkips):
    """Finds a skip that waits for a rule in the table, reads the rules that refused the agent's last refused
    hook, and turns an agent's skipped guards into kept skips, each held to the same checks; a user
    skips a guard freely. Guards that share a short flag are one skip: the one that refused the agent, or
    the first when none did."""

    def __init__(self, queries: Queries, bus: Bus, registry: Registry, refusals: RefusalLog) -> None:
        self.queries, self.bus, self.registry, self.refusals = queries, bus, registry, refusals

    def waiting(self, agent_id: int, rule: str) -> Command[object] | None:
        skip = self.queries.query(DriverGrant).filter(session_agent_id=agent_id, grant_type=GrantType.REFUSAL_SKIP, policy_key=rule, grant_state=GrantState.CONFIRMED, requires_approval=False).newest().first()
        return UseGrant(skip.id) if skip is not None else None

    def last_refused_rules(self, agent_id: int) -> frozenset[str]:
        call = self.queries.query(HookCall).filter(session_agent_id=agent_id, answer=HookAnswer.REFUSED).newest().first()
        return frozenset(str(row.get("rule")) for row in call.refused_rules) if call is not None else frozenset()

    def check_guards(self, actor: Actor, guards: Sequence[str], reason: str) -> None:
        if actor.type is ActorType.AGENT:
            for guard in self.skipped_once(actor, [name for name in guards if name != LIFECYCLE_GUARD]):
                self.bus.run(SkipRefusal(guard, reason, is_used=True), actor)

    def skipped_once(self, actor: Actor, guards: Sequence[str]) -> list[str]:
        flags = {entry.name: entry.short_flag for entry in self.registry.guards}
        groups: dict[str, list[str]] = {}
        for guard in guards:
            groups.setdefault(flags.get(guard) or guard, []).append(guard)
        refused = self.refusals.guards_refused_past(actor.id, "") if groups else set[str]()
        return [next((guard for guard in group if guard in refused), group[0]) for group in groups.values()]
