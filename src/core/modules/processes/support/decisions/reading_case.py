from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.support.reader_judgement import ReaderJudgement
from core.modules.processes.support.decisions.output_facts import OutputFacts
from core.modules.processes.models.enums.reader_layer import ReaderLayer

SHORT_RUN_SECONDS = 15


@dataclass(frozen=True, kw_only=True)
class ReadingCase:
    """The facts of one part of a run that the engine decides on, as plain values: the command, the run, its
    reader, its output, the history of its command and the policy of the agent's role. A part with no reader
    has no layer and no judgement; a part that printed nothing measured yet has no output facts."""

    command_key: str
    category: CommandCategory
    classification_recognized: bool
    has_asking_flag: bool
    output_hidden: bool
    is_saved_command: bool
    is_plugin_run: bool
    phase: ReadingPhase
    age_seconds: int
    run_state: ProcessState
    cadence_state: CadenceState
    exit_code: int | None
    reader_layer: ReaderLayer | None
    reader_judgement: ReaderJudgement | None
    default_reader: bool
    reader_failed: bool
    count_missing: bool
    draft_fits: bool
    output: OutputFacts | None
    runs_without_change: int
    waiting_request: bool
    skipped: bool
    has_unreadable_mark: bool
    reader_required: bool
    reader_writing_allowed: bool
    role_uses_saved_commands: bool
    readers_forced: bool

    @property
    def is_request_waiting(self) -> bool:
        return self.reader_required and self.waiting_request

    @property
    def is_unneeded(self) -> bool:
        return (not self.category.has_reader or self.has_asking_flag or self.is_plugin_run or self.was_rejected
                or self.is_short_success or self.is_no_sample)

    # A run killed part way, or one that failed as it started, shows nothing a reader should read.
    @property
    def is_no_sample(self) -> bool:
        return self.output is not None and (self.output.truncated or (self.output.start_crashed and self.exit_code not in (None, 0)))

    @property
    def was_rejected(self) -> bool:
        return self.output is not None and self.output.rejected

    @property
    def is_short_success(self) -> bool:
        return self.phase is ReadingPhase.END and self.exit_code == 0 and self.age_seconds < SHORT_RUN_SECONDS

    @property
    def has_suitable_reader(self) -> bool:
        return self.reader_judgement is not None and self.reader_judgement.is_valid

    @property
    def unreadable_reason(self) -> UnreadableReason | None:
        if self.has_unreadable_mark:
            return UnreadableReason.DECLARED
        return self.measured_unreadable_reason

    # Why no reader can read this output, from its measures alone: sizes, newlines, NUL bytes, carriage returns and a
    # prompt the run stopped growing on, never the words it printed.
    @property
    def measured_unreadable_reason(self) -> UnreadableReason | None:
        if self.phase is ReadingPhase.END:
            return OutputFacts.end_reason(self.output)
        return OutputFacts.measured_reason(self.output, self.cadence_state)

    def available_exits(self, level: PressureLevel) -> tuple[ReadingExit, ...]:
        return level.exits if self.classification_recognized else (*level.exits, ReadingExit.CLASSIFY)
