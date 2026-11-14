from core.modules.processes.models.enums.reason_code import ReasonCode
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow

CARD_TEXTS = {
    ReasonCode.READER_MISSING: "Reader: none",
    ReasonCode.REQUEST_WAITING: "Reader: none, asked for",
    ReasonCode.FIELDS_MISSING: "Reader: poor, fields missing",
    ReasonCode.LINES_MISSED: "Reader: poor, picks no line",
    ReasonCode.OVERSIZED: "Reader: poor, keeps nearly every line",
    ReasonCode.SUMMARY_MISSING: "Reader: poor, summary missing",
    ReasonCode.COUNT_MISSING: "Reader: poor, test count missing",
    ReasonCode.PROGRESS_MISSING: "Reader: poor, progress missing",
    ReasonCode.READER_FAILED: "Reader: poor, it failed on this output",
    ReasonCode.DRAFT_FITS: "Reader: draft ready",
    ReasonCode.REDIRECTED: "Reader: none, the output goes to a file",
    ReasonCode.UNKNOWN_COMMAND: "Reader: none, the command type is unknown",
    ReasonCode.SILENT_RUN: "Reader: none, the run prints nothing",
    ReasonCode.UNREADABLE: "Reader: none can read this output",
}


class ReadingCardText:
    """The short line a run's card shows about its reader, from the decision kept at the run's end: no line when
    the run needs no reader or has a good one."""

    @staticmethod
    def text(decision: ReadingDecisionRow) -> str | None:
        return None if decision.state.is_resolved else CARD_TEXTS.get(decision.reason)
