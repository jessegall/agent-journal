from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunShowedOutput(StoryStep):
    """A run of the agent printed the text as its part's output."""

    name = "run printed"

    def run(self, container: Container, process_id: int, position: int, text: str) -> None:  # type: ignore[override]
        container.get(OutputFolder).write_output(process_id, position, text)
