from collections.abc import Sequence

from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.event.changed import Changed
from core.modules.agents.models.agent import Agent

# the lifecycle facts of an agent row (doc 1310 section 10.6): a launch and its failure, a process gone, an exit,
# a usage lockdown, a pause and an interruption
LIFECYCLE_FIELDS = ("pid", "session", "launched_at", "launch_failed_at", "ended_at", "usage_limit_ends_at", "paused_at", "interrupted_at", "halted_at")
# the fields a parent reads from its child's row: whether it is there and whether it can go on
PARENT_FIELDS = ("ended_at", "launch_failed_at", "halted_at")


class AgentLifecycleStepListener(AgentListener[Changed[Agent]]):
    """A changed lifecycle fact of an agent asks for its step in the same write, and for its parent's when the
    child ended, failed to launch or halted, so the domain keeps only the fact and the machine decides."""

    name = "agents.lifecycle-step"

    def agents(self, event: Changed[Agent]) -> Sequence[int]:
        old_row = event.old_row
        changed = [field for field in LIFECYCLE_FIELDS if old_row is not None and getattr(event.row, field) != getattr(old_row, field)]
        if not changed:
            return ()
        parent = event.row.parent_id if event.row.parent_id is not None and set(changed) & set(PARENT_FIELDS) else None
        return tuple([event.row.id, parent]) if parent is not None else (event.row.id,)
