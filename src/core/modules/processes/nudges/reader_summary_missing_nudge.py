from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderSummaryMissingNudge(NudgeDeclaration):
    """The nudge processes.reader_no_summary."""

    key = "processes.reader_no_summary"
    type = NudgeType.STEERING
    text = "Reader {reader} found no summary in output {output}"
    required_command = "journal reader add {reader}"
