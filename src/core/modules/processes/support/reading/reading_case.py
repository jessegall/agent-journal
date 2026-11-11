from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from core.modules.processes.models.enums.cadence_state import CadenceState
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.support.reader_judgement import ReaderJudgement
from core.modules.processes.support.reading.output_facts import OutputFacts
from core.modules.processes.support.reading.reader_layer import ReaderLayer

SHORT_RUN_SECONDS = 15


@dataclass(frozen=True, kw_only=True)
class ReadingCase:
    """The facts of one part of a run that the engine decides on, as plain values: the command, the run, its
    reader, its output, the history of its command and the policy of the agent's role. A part with no reader
    has no layer and no judgement; a part that printed nothing measured yet has no output facts."""

    command_key: str
    category: CommandCategory
    classification_known: bool
    has_asking_flag: bool
    output_hidden: bool
    saved_command: str | None
    is_plugin_run: bool
    moment: ReadingMoment
    age_seconds: int
    run_state: ProcessState
    cadence_state: CadenceState = CadenceState.STREAMING
    exit_code: int | None
    reader_layer: ReaderLayer | None
    reader_judgement: ReaderJudgement | None
    reader_is_default: bool
    output: OutputFacts | None
    runs_without_change: int
    request_is_waiting: bool
    was_skipped: bool
    has_unreadable_mark: bool
    role_must_have_reader: bool
    role_may_write_readers: bool
    role_uses_saved_commands: bool
    readers_forced: bool

    @property
    def is_not_needed(self) -> bool:
        return (not self.category.has_reader or self.has_asking_flag or self.is_plugin_run or self.was_rejected
                or self.is_short_success)

    @property
    def was_rejected(self) -> bool:
        return self.output is not None and self.output.was_rejected

    @property
    def is_short_success(self) -> bool:
        return self.moment is ReadingMoment.END and self.exit_code == 0 and self.age_seconds < SHORT_RUN_SECONDS

    @property
    def reader_is_suitable(self) -> bool:
        return self.reader_judgement is not None and self.reader_judgement.is_valid

    @property
    def unreadable_reason(self) -> UnreadableReason | None:
        if self.has_unreadable_mark:
            return UnreadableReason.DECLARED
        return None if self.output is None else self.output.unreadable_reason

    def exits_for(self, level: PressureLevel) -> tuple[ReadingExit, ...]:
        return level.exits if self.classification_known else (*level.exits, ReadingExit.CLASSIFY)
