from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunHoldsASlot(StoryStep):
    """Whether a run holds a place in the queue of runs."""

    name = "run holds a slot"

    def run(self, container: Container, process_id: int) -> object:  # type: ignore[override]
        return container.get(OutputFolder).has_slot(process_id)
