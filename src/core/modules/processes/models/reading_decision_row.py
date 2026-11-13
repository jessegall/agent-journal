from engine.query.rows.prunable import Prunable
from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.reader_action import ReaderAction
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.enums.reason_code import ReasonCode


@dataclass(frozen=True, kw_only=True)
class ReadingDecisionRow(Prunable, Model):
    """The engine's decision about the reader of one part of a run at one moment, kept so hooks read it and do
    not decide again."""

    kept_rows = 5000

    model_name = "reading_decision"
    cli_name = "reading-decision"

    process_id: int
    part_position: int
    command_key: str
    moment: ReadingMoment
    state: ReaderState
    action: ReaderAction
    level: PressureLevel
    reason: ReasonCode
    decided_at: Timestamp
