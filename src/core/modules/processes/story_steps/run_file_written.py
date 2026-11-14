from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunFileWritten(StoryStep):
    """The runner wrote one named file of a run's folder."""

    name = "run file written"

    def run(self, container: Container, process_id: int, name: str, text: str) -> None:  # type: ignore[override]
        container.get(OutputFolder).write(process_id, name, text)
