from collections.abc import Sequence

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.command import Command
from engine.database.kept_rows import KeptRows
from engine.driver.interval import Interval
from engine.driver.refusal_skips import RefusalSkips
from engine.driver.span_queries import SpanQueries
from engine.time.timestamp import Timestamp
from engine.guard.guards import LIFECYCLE_GUARD
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from engine.log.refusal_log import RefusalLog
from engine.registry.registry import Registry
from core.modules.drivers.commands.skip_refusal.skip_refusal import SkipRefusal
from core.modules.drivers.commands.use_refusal_skip.use_refusal_skip import UseRefusalSkip
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.refusal_skip import RefusalSkip


class TableRefusalSkips(RefusalSkips):
    """Finds a skip that waits for a rule in the table, says whether a rule is silenced by a skip within its window, and turns an agent's skipped guards into kept skips, each
    held to the same checks; a user skips a guard freely. Guards that share a short flag are one skip: the
    one that refused the agent, or the first when none did."""

    def __init__(self, queries: Queries, bus: Bus, registry: Registry, refusals: RefusalLog, spans: SpanQueries, kept: KeptRows) -> None:
        self.queries, self.bus, self.registry, self.refusals, self.spans, self.kept = queries, bus, registry, refusals, spans, kept

    def waiting(self, agent_id: int, rule: str) -> Command[object] | None:
        skip = self.queries.query(RefusalSkip).filter(session_agent_id=agent_id, name=rule, used_at=None, cancelled_at=None, needs_approval=False).matching(HasValue("confirmed_at")).newest().first()
        return UseRefusalSkip(skip.id) if skip is not None else None

    def is_skipped(self, agent_id: int, rule: str, window: Interval, timestamp: Timestamp) -> bool:
        return self.kept.scoped_current(lambda: self.skipped_within(agent_id, rule, window, timestamp), name=f"drivers.skip_window:{agent_id}:{rule}:{timestamp.text}")

    def skipped_within(self, agent_id: int, rule: str, window: Interval, timestamp: Timestamp) -> bool:
        skip = self.queries.query(RefusalSkip).filter(session_agent_id=agent_id, name=rule, cancelled_at=None).newest().first()
        return skip is not None and not window.has_passed(self.spans, agent_id, skip.creation_timestamp(), timestamp)

    def has_refused(self, agent_id: int, rule: str) -> bool:
        call = self.queries.query(HookCall).filter(session_agent_id=agent_id, answer=HookAnswer.REFUSED).newest().first()
        return call is not None and any(row.get("rule") == rule for row in call.refused_rules)

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
