from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunEnded(StoryStep):
    """The runner wrote the exit code a run ended with."""

    name = "run ended"

    def run(self, container: Container, process_id: int, exit_code: int) -> None:  # type: ignore[override]
        container.get(OutputFolder).write_end(process_id, exit_code)
