from collections.abc import Sequence
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.listener.rows.event_rows import EventRows
from engine.time.clock import Clock
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from engine.query.conditions.among import Among
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.reader_demands import ReaderDemands
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_judgement import ReaderJudgement
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.reader_writers import ReaderWriters
from core.modules.processes.support.cadence.run_cadences import RunCadences
from core.modules.processes.support.decisions.command_run_counts import CommandRunCounts
from core.modules.processes.support.decisions.escalation_resets import EscalationResets
from core.modules.processes.support.decisions.output_facts import SAMPLE_BYTES, OutputFacts
from core.modules.processes.models.enums.reader_layer import ReaderLayer
from core.modules.processes.support.decisions.reading_case import ReadingCase
from core.modules.processes.support.run_counts import RunCounts
from core.modules.processes.support.silent_start_runs import SilentStartRuns


class ReadingFacts:
    """Gathers the facts of one part of a run into a ReadingCase, and decides nothing: the command, the run, its
    reader and that reader's judgement, its output, the history of its command and the policy of the agent's
    role, and how the run prints. It is the one builder of a ReadingCase."""

    def __init__(self, readers: ReaderRows, judge: ReaderJudge, writers: ReaderWriters, requests: ReaderRequestQuery, run_counts: CommandRunCounts,
                 resets: EscalationResets, folder: OutputFolder, settings: ProcessSettings, suites: SuiteChoice, rows: EventRows, clock: Clock,
                 cadences: RunCadences, run: ReaderRun, counts: RunCounts) -> None:
        self.readers, self.judge, self.writers, self.requests, self.run_counts = readers, judge, writers, requests, run_counts
        self.resets, self.folder, self.settings, self.suites, self.rows, self.clock, self.cadences = resets, folder, settings, suites, rows, clock, cadences
        self.run, self.counts = run, counts

    def gathered_cases(self, process: Process, parts: Sequence[ProcessPart], point: ReadingMoment) -> list[ReadingCase]:
        keys = [SilentStartRuns.name(part.text, part.program, part.category) for part in parts]
        runs = self.run_counts.runs_without_reader(keys)
        waiting = self.waiting_commands(process, [part.command or part.text for part in parts])
        flagged = self.resets.flagged_keys(keys)
        return [self.gathered_case(process, part, point, runs[key], (part.command or part.text) in waiting, key in flagged) for part, key in zip(parts, keys)]

    def gathered_case(self, process: Process, part: ProcessPart, point: ReadingMoment, runs_without_change: int, request_is_waiting: bool, is_flagged: bool) -> ReadingCase:
        agent = self.rows.required(Agent, process.session_agent_id)
        command = part.command or part.text
        command_key = SilentStartRuns.name(part.text, part.program, part.category)
        reader = self.reader(part)
        policy = self.suites.agent_policy()
        return ReadingCase(command_key=command_key, category=part.category, classification_known=part.category is not CommandCategory.UNKNOWN,
                           has_asking_flag=ReaderDemands.is_help_request(command), output_hidden=part.piped, is_saved_command=bool(part.saved_command),
                           is_plugin_run=bool(process.plugin), moment=point, age_seconds=self.age_seconds(process), run_state=process.state,
                           cadence_state=self.cadences.process_cadence(process, self.clock.timestamp()).state(),
                           exit_code=part.exit_code, reader_layer=self.layer(reader), reader_judgement=self.judgement(process, part, reader),
                           reader_is_default=reader is not None and reader.is_default, reader_failed=self.reader_failed(process, reader, point),
                           count_missing=self.counts.count_missing(process, part),
                           draft_fits=self.draft_fits(process, part, reader, point), output=self.output(process, part, point),
                           runs_without_change=runs_without_change,
                           request_is_waiting=request_is_waiting, was_skipped=self.resets.skipped_after(command_key, process.creation_timestamp()),
                           has_unreadable_mark=is_flagged, role_must_have_reader=agent.role in policy.reader_request_roles,
                           role_may_write_readers=self.writers.allows(Actor(agent.id, ActorType.AGENT)), role_uses_saved_commands=agent.role in policy.saved_command_roles,
                           readers_forced=self.settings.flag(ProcessSetting.READERS_FORCED))

    def reader(self, part: ProcessPart) -> Reader | None:
        selected = ReaderSelection.choose(self.readers.all(), [part], self.readers.layers())
        return None if selected is None else selected.reader

    def measured_reason(self, process: Process, part: ProcessPart) -> UnreadableReason | None:
        return OutputFacts.reason_at_end(self.output(process, part, ReadingMoment.END))

    def reader_failed(self, process: Process, reader: Reader | None, point: ReadingMoment) -> bool:
        return reader is not None and point is ReadingMoment.END and ReaderRun.has_failed(reader, self.folder.reader_lines(process.id))

    def draft_fits(self, process: Process, part: ProcessPart, reader: Reader | None, point: ReadingMoment) -> bool:
        if reader is not None or point is not ReadingMoment.END:
            return False
        text = self.folder.part_head(process.id, part.position, SAMPLE_BYTES).decode(errors="replace")
        layers = self.readers.layers()
        return bool(text.strip()) and any(self.fits(stock, part.category, text) for stock in self.readers.all() if layers.layer(stock) is ReaderLayer.STOCK)

    def fits(self, reader: Reader, category: CommandCategory, text: str) -> bool:
        return (not self.judge.fields_missing(reader, category) and not self.judge.misses(reader, category, text)
                and bool(self.run.lines(reader, text, "finished")))

    def layer(self, reader: Reader | None) -> ReaderLayer | None:
        return None if reader is None else self.readers.layers().layer(reader)

    def judgement(self, process: Process, part: ProcessPart, reader: Reader | None) -> ReaderJudgement | None:
        scope = ReaderSampleScope(process.session_agent_id, part.command or part.text)
        return None if reader is None else self.judge.judged_command(reader, part.category, scope)

    def output(self, process: Process, part: ProcessPart, point: ReadingMoment) -> OutputFacts | None:
        if point is ReadingMoment.START:
            return None
        sample = self.folder.part_head(process.id, part.position, SAMPLE_BYTES)
        return OutputFacts.measured(sample, self.folder.part_bytes(process.id, part.position), part.exit_code, part.category)

    def age_seconds(self, process: Process) -> int:
        return int(process.creation_timestamp().elapsed_seconds(self.clock.timestamp()))

    def waiting_commands(self, process: Process, commands: Sequence[str]) -> set[str]:
        open_requests = self.requests.open().filter(creator_id=process.session_agent_id).matching(Among("command", tuple(dict.fromkeys(commands))))
        return set(open_requests.pluck("command", str))
