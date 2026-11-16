from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunMoveRequested(StoryStep):
    """Whether a run was asked to move to the background."""

    name = "run asked to move"

    def run(self, container: Container, process_id: int) -> object:  # type: ignore[override]
        return container.get(OutputFolder).has_move_request(process_id)
