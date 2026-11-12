from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.record_request_runs.record_request_runs import RecordRequestRuns
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.support.request_log_entry import RequestLogEntry


class RecordRequestRunsHandler(Handler[RecordRequestRuns, None]):
    """Writes a request row for each logged entry, as a run of its agent or of the running main agent of the entry's own environment; the
    process pruning removes the old ones."""

    command = RecordRequestRuns

    def __init__(self, repository: Repository, agents: AgentRows) -> None:
        self.repository, self.agents = repository, agents

    def handle(self, command: RecordRequestRuns, context: Context) -> None:
        for entry in command.entries:
            agent_id = self.owner_id(entry, self.agents.environment_main_agent(entry.environment_id))
            if agent_id is None:
                continue
            self.repository.save(RequestRun(session_agent_id=agent_id, creator_id=context.actor.id, kind=entry.kind, line=entry.line, exit_code=entry.exit_code,
                                            ended_at=Timestamp.parsed(entry.ended_at)), context)

    @staticmethod
    def owner_id(entry: RequestLogEntry, main_agent: Agent | None) -> int | None:
        if entry.agent_id is not None:
            return entry.agent_id
        return main_agent.id if main_agent is not None else None
