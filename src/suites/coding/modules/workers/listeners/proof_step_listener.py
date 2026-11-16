from collections.abc import Sequence

from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.event.changed import Changed
from engine.query.queries import Queries
from engine.agent_machine.states.step_requests import StepRequests
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree


class ProofStepListener(AgentListener[Changed[Proof]]):
    """A proof whose state moved (its tests queued, running, passed, failed or lost) asks for its worker's step in
    the same write."""

    name = "workers.proof-step"

    def __init__(self, requests: StepRequests, queries: Queries) -> None:
        super().__init__(requests)
        self.queries = queries

    def agents(self, event: Changed[Proof]) -> Sequence[int]:
        if event.old_row is None or event.row.state is event.old_row.state:
            return ()
        return (self.queries.query(Worktree).find(event.row.worktree_id).session_agent_id,)
