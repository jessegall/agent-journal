from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.wake_cause import WakeCause
from engine.query.conditions.greater import Greater
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process


class RunEndedWake(WakeCause):
    """A run the agent moved to the background ended after its last hook (doc 1310 section 6.4): the resting
    agent is given a turn to read it, even with no work left to refuse its stop."""

    key = "processes.run-ended"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def needs_wake(self, view: AgentView) -> bool:
        if view.newest_hook_at is None:
            return False
        runs = self.queries.query(Process).filter(session_agent_id=view.agent.agent_id).matching(HasValue("moved_at"))
        return runs.matching(Greater("ended_at", Timestamp(view.newest_hook_at).text)).exists()

    def text(self, view: AgentView) -> str:
        return "A run you moved to the background ended: read its output"
