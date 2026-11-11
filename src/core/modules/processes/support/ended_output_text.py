from engine.driver.nudge import Nudge
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_nudges import OUTPUT_ENDED


class EndedOutputText:
    """The line that tells an agent a run of its own that moved to the background ended; how to read such a run
    better is sent by ReadingNotices."""

    @staticmethod
    def nudges(processes: tuple[Process, ...]) -> tuple[Nudge, ...]:
        return tuple(OUTPUT_ENDED.nudge(output=process.id) for process in processes)
