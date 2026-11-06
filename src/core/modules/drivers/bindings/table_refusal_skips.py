from collections.abc import Sequence

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.driver.refusal_skips import RefusalSkips
from core.base.module.driver_entries import DRIVERS_MODULE
from core.base.query.queries import Queries
from core.modules.drivers.commands.skip_refusal.skip_refusal import SkipRefusal
from core.modules.drivers.commands.use_refusal_skip.use_refusal_skip import UseRefusalSkip
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.refusal_skip import RefusalSkip


class TableRefusalSkips(RefusalSkips):
    """Finds a skip that waits for a rule in the table, and turns an agent's skipped guards into kept skips, each
    held to the same checks; a person skips a guard freely."""

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def waiting(self, agent_id: int, rule: str) -> Command[object] | None:
        skip = self.queries.query(RefusalSkip).filter(session_agent_id=agent_id, name=rule, used_at=None).newest().first()
        return UseRefusalSkip(skip.id) if skip is not None else None

    def has_refused(self, agent_id: int, rule: str) -> bool:
        call = self.queries.query(HookCall).filter(session_agent_id=agent_id, answer=HookAnswer.REFUSED).newest().first()
        rules = call.metadata.module_part(DRIVERS_MODULE).get("rules", []) if call is not None else []
        return any(row.get("rule") == rule and row.get("outcome") == "refused" for row in rules)

    def check_guards(self, actor: Actor, guards: Sequence[str], reason: str) -> None:
        if actor.type is ActorType.AGENT:
            for guard in guards:
                self.bus.run(SkipRefusal(guard, reason, is_used=True), actor)
