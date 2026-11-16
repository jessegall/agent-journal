from collections.abc import Sequence

from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.event.changed import Changed
from suites.coding.modules.workers.models.worktree import Worktree


class WorktreeStepListener(AgentListener[Changed[Worktree]]):
    """A worktree whose base moved or whose state moved asks for its worker's step in the same write."""

    name = "workers.worktree-step"

    def agents(self, event: Changed[Worktree]) -> Sequence[int]:
        moved = event.old_row is not None and (event.row.base_commit != event.old_row.base_commit or event.row.state is not event.old_row.state)
        return (event.row.session_agent_id,) if moved else ()
