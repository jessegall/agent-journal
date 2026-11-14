from core.modules.processes.support.output_folder import OutputFolder
from engine.container.container import Container
from engine.module.story_step import StoryStep


class RunProcessId(StoryStep):
    """The runner wrote the process id of a run."""

    name = "run process id"

    def run(self, container: Container, process_id: int, pid: int) -> None:  # type: ignore[override]
        container.get(OutputFolder).write_pid(process_id, pid)
