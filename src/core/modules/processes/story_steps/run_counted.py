from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunCounted(StoryStep):
    """A run's test listing counted its tests: the listing's text and its exit status."""

    name = "run counted"

    def run(self, container: Container, process_id: int, text: str, status: int) -> None:  # type: ignore[override]
        container.get(OutputFolder).write_count(process_id, text, status)
