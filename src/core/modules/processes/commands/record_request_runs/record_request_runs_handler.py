from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.record_request_runs.record_request_runs import RecordRequestRuns
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.queries.request_run_query import RequestRunQuery
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.request_log_entry import RequestLogEntry

PRUNED_AT_ONCE = 50


class RecordRequestRunsHandler(Handler[RecordRequestRuns, None]):
    """Writes a request row for each logged entry, as a run of its agent or of the environment's main
    agent, and removes up to 50 of the environment's rows older than the days they are kept; it runs
    every few seconds while requests come in, so the rows are pruned as fast as they grow."""

    command = RecordRequestRuns

    def __init__(self, repository: Repository, agents: AgentRows, request_runs: RequestRunQuery, settings: ProcessSettings) -> None:
        self.repository, self.agents, self.request_runs, self.settings = repository, agents, request_runs, settings

    def handle(self, command: RecordRequestRuns, context: Context) -> None:
        for entry in command.entries:
            agent_id = self.owner_id(entry, self.agents.environment_main_agent(entry.environment_id))
            if agent_id is None:
                continue
            self.repository.save(RequestRun(session_agent_id=agent_id, creator_id=context.actor.id, kind=entry.kind, line=entry.line, exit_code=entry.exit_code,
                                            ended_at=Timestamp.parsed(entry.ended_at)), context)
        days = max(1, self.settings.integer(ProcessSetting.REQUEST_RUN_DAYS))
        old = self.request_runs.ended_prior(context.timestamp, days).ordered("ended_at", "id").take(PRUNED_AT_ONCE)
        self.repository.delete_many_stored(old, context)

    @staticmethod
    def owner_id(entry: RequestLogEntry, main_agent: Agent | None) -> int | None:
        if entry.agent_id is not None:
            return entry.agent_id
        return main_agent.id if main_agent is not None else None
