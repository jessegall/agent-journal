from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunStarted(StoryStep):
    """The runner started a run: its line and the texts of its parts are in its folder."""

    name = "run started"

    def run(self, container: Container, process_id: int, line: str, part_texts: list[str]) -> None:  # type: ignore[override]
        container.get(OutputFolder).write_start(process_id, line, part_texts)
