from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep
from engine.time.timestamp import Timestamp


class RunBeat(StoryStep):
    """A running run's runner beat at the time given."""

    name = "run beat"

    def run(self, container: Container, process_id: int, timestamp: Timestamp) -> None:  # type: ignore[override]
        container.get(OutputFolder).beat(process_id, timestamp)
