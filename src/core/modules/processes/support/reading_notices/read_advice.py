from engine.driver.nudge import Nudge
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.output import Output
from core.modules.processes.nudges.large_output_read_nudge import LargeOutputReadNudge
from core.modules.processes.nudges.reader_hint_nudge import ReaderHintNudge
from core.modules.processes.support.process_settings import ProcessSettings


class ReadAdvice:
    """The one advice for an agent of any role that read all of an output: the reader that already
    reads it, else the flags that read part of a large one; a short output read whole says nothing.
    Each line repeats only after the interval of its declaration."""

    def __init__(self, settings: ProcessSettings) -> None:
        self.settings = settings

    def hint(self, output: Output) -> tuple[Nudge, ...]:
        if output.reader_id is not None and output.reader_lines:
            return tuple([ReaderHintNudge.declared().nudge(reader=output.reader_id, output=output.process_id)])
        if output.line_count > self.settings.integer(ProcessSetting.LARGE_OUTPUT_LINES):
            return tuple([LargeOutputReadNudge.declared().nudge(output=output.process_id, lines=output.line_count)])
        return ()
