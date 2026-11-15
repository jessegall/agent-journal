from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.needs.wake_cause import WakeCause
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.dumps.models.dump import Dump

MAIN_AGENT_TYPE = "main"


class DumpArrivedWake(WakeCause):
    """A dump arrived after the main agent's last hook and is still open (doc 1310 section 6.4)."""

    key = "dumps.dump-arrived"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def needs_wake(self, view: AgentView) -> bool:
        if view.agent.agent_type != MAIN_AGENT_TYPE or view.newest_hook_at is None:
            return False
        return self.queries.query(Dump).filter(closed_at=None).matching(Greater("created_at", Timestamp(view.newest_hook_at).text)).exists()

    def text(self, view: AgentView) -> str:
        return "A dump arrived: sort it"
