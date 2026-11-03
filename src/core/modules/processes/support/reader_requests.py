from datetime import timedelta
from pathlib import Path
from fnmatch import fnmatchcase

from core.base.agent_role import AgentRole
from core.base.clock import Clock
from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.reader_demands import ReaderDemands
from core.modules.processes.support.reader_selection import ReaderSelection


class ReaderRequests:
    """Opens or joins the request for each command without a proper reader."""

    def __init__(self, queries: Queries, requests: ReaderRequestQuery, parts: ProcessPartQuery, repository: Repository,
                 demands: ReaderDemands, settings: ProcessSettings, clock: Clock) -> None:
        self.queries, self.requests, self.parts, self.repository = queries, requests, parts, repository
        self.demands, self.settings, self.clock = demands, settings, clock

    def needed(self, process: Process, agent: Agent) -> bool:
        return (agent.role is AgentRole.WORKER and process.creator_id == agent.id
                and self.settings.flag(ProcessSetting.READERS_FORCED, agent.environment_id))

    def request(self, process: Process, spec: PartSpec, reader: Reader | None, context: Context) -> int | None:
        if not self.demands.needs_reader(process.environment_id, spec):
            return None
        reason = self.demands.reason(spec, reader)
        if not reason:
            return None
        key = spec.command_key or Path(spec.program).name
        existing = self.requests.open().filter(environment_id=process.environment_id, command_key=key).page(1, 1).rows
        if existing:
            return existing[0].id
        command = spec.command or spec.text
        sample = next((part for part in self.parts.with_kept_output().newest().all_rows() if fnmatchcase(part.command or part.text, f"{key}*")), None)
        now = self.clock.timestamp()
        minutes = self.settings.integer(ProcessSetting.READER_HOLD_MINUTES, process.environment_id)
        hold_until = Timestamp(now.value + timedelta(minutes=minutes)) if MainAgentFinder.newest(self.queries, process.environment_id) else now
        request = self.repository.save(ReaderRequest(environment_id=process.environment_id, creator_id=process.agent_id, command_key=key,
                                                     command=command, category=spec.category, reason=reason, hold_until=hold_until,
                                                     sample_process_id=sample.process_id if sample else process.id), context)
        return request.id
