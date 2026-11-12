from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.record_request_runs.record_request_runs import RecordRequestRuns
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.support.request_log_entry import RequestLogEntry

REQUEST_RUNS_KEPT = 5000
PRUNED_AT_ONCE = 50


class RecordRequestRunsHandler(Handler[RecordRequestRuns, None]):
    """Writes a request row for each logged entry, as a run of its agent or of the environment's main agent, and
    removes up to 50 of the oldest request rows past the newest 5000."""

    command = RecordRequestRuns

    def __init__(self, repository: Repository, queries: Queries, agents: AgentRows) -> None:
        self.repository, self.queries, self.agents = repository, queries, agents

    def handle(self, command: RecordRequestRuns, context: Context) -> None:
        main_agent = self.agents.main_agent()
        for entry in command.entries:
            agent_id = self.owner_id(entry, main_agent)
            if agent_id is None:
                continue
            self.repository.save(RequestRun(session_agent_id=agent_id, creator_id=context.actor.id, kind=entry.kind, line=entry.line, exit_code=entry.exit_code,
                                            ended_at=Timestamp.parsed(entry.ended_at)), context)
        newest = self.queries.query(RequestRun).newest().first()
        if newest is None:
            return
        self.repository.delete_many_stored(self.queries.query(RequestRun).matching(Less("id", newest.id - REQUEST_RUNS_KEPT)).oldest().limited(PRUNED_AT_ONCE), context)

    @staticmethod
    def owner_id(entry: RequestLogEntry, main_agent: Agent | None) -> int | None:
        if entry.agent_id is not None:
            return entry.agent_id
        return main_agent.id if main_agent is not None else None
