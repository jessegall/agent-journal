from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ReaderSampleReadyNudge(NudgeDeclaration):
    """The nudge workers.reader_sample_ready."""

    key = "workers.reader_sample_ready"
    type = NudgeType.STEERING
    text = "Read the sample of output {output} with reader {reader}"
    wakes_agent = True
