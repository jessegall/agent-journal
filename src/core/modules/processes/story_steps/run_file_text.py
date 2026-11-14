from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunFileText(StoryStep):
    """The text of one named file of a run's folder."""

    name = "run file text"

    def run(self, container: Container, process_id: int, name: str) -> object:  # type: ignore[override]
        return container.get(OutputFolder).text(process_id, name)
