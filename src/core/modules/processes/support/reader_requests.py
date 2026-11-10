from datetime import timedelta
from dataclasses import replace
from pathlib import Path

from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.time.clock import Clock
from core.base.command.context import Context
from core.base.repository.repository import Repository
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.reader_demands import ReaderDemands
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.run_counts import RunCounts


class ReaderRequests:
    """Opens an agent's request for each command without a proper reader."""

    def __init__(self, queries: Queries, requests: ReaderRequestQuery, parts: ProcessPartQuery, repository: Repository,
                 demands: ReaderDemands, settings: ProcessSettings, clock: Clock, suites: SuiteChoice, judge: ReaderJudge, counts: RunCounts) -> None:
        self.counts = counts
        self.queries, self.requests, self.parts, self.repository = queries, requests, parts, repository
        self.demands, self.settings, self.clock = demands, settings, clock
        self.suites = suites
        self.judge = judge

    def needed(self, process: Process, agent: Agent) -> bool:
        return (agent.role in self.suites.agent_policy().reader_request_roles and process.creator_id == agent.id
                and self.settings.flag(ProcessSetting.READERS_FORCED))

    def request(self, process: Process, spec: PartSpec, reader: Reader | None, context: Context) -> int | None:
        if not self.demands.needs_reader(spec):
            return None
        scope = ReaderSampleScope(process.session_agent_id, spec.command or spec.text)
        reason = self.counts.reader_reason(process, spec, reader, self.demands.reason(spec, reader, scope))
        if not reason:
            return None
        existing = self.open_row(scope)
        if existing is not None:
            return existing.id
        samples = self.parts.kept_samples(["*"]).matching(scope).limited(5)
        sample_id = next((sample.process_id for sample in samples if sample.exit_code != 2 or not self.judge.is_rejected(
            sample.exit_code, self.judge.output_text(sample.process_id, sample.position))), process.id)
        return self.saved_request(process, spec, reason, sample_id, context)

    def after_run(self, process: Process, part: ProcessPart, reader: Reader | None, context: Context) -> None:
        if reader is None and part.reader_request_id is None:
            return
        text = self.judge.output_text(process.id, part.position)
        if self.judge.is_rejected(part.exit_code, text):
            if part.reader_request_id is not None:
                request = self.requests.find(part.reader_request_id)
                if request.completed_at is None and request.sample_process_id == process.id:
                    self.repository.save(replace(request, completed_at=self.clock.timestamp(),
                                                 skip_reason="command rejected before it ran"), context)
            return
        if reader is None:
            return
        spec = PartSpec(part.text, part.program, category=part.category, command=part.command)
        if not self.demands.needs_reader(spec):
            return
        scope = ReaderSampleScope(process.session_agent_id, spec.command or spec.text)
        reason = self.counts.reader_reason(process, spec, reader, self.demands.reason(spec, reader, scope))
        if reason:
            self.open_request(process, spec, reason, process.id, context)

    @staticmethod
    def command_key(spec: PartSpec) -> str:
        return spec.command_key or Path(spec.program).name

    def open_row(self, scope: ReaderSampleScope) -> ReaderRequest | None:
        return self.requests.open().filter(creator_id=scope.agent_id, command=scope.command).first()

    def open_request(self, process: Process, spec: PartSpec, reason: str, sample_process_id: int, context: Context) -> int:
        existing = self.open_row(ReaderSampleScope(process.session_agent_id, spec.command or spec.text))
        if existing is not None:
            return existing.id
        return self.saved_request(process, spec, reason, sample_process_id, context)

    def saved_request(self, process: Process, spec: PartSpec, reason: str, sample_process_id: int, context: Context) -> int:
        key = self.command_key(spec)
        command = spec.command or spec.text
        current_time = self.clock.timestamp()
        minutes = self.settings.integer(ProcessSetting.READER_BLOCK_MINUTES)
        expires_at = Timestamp(current_time.value + timedelta(minutes=minutes)) if MainAgentFinder.newest(self.queries) else current_time
        request = self.repository.save(ReaderRequest(creator_id=process.session_agent_id, command_key=key,
                                                     command=command, category=spec.category, reason=reason, expires_at=expires_at,
                                                     sample_process_id=sample_process_id), context)
        return request.id
