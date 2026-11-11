from engine.module.module_finder import ModuleFinder
from engine.testing.stories.story import Story
from core.modules.processes.models.process import Process
from core.modules.processes.support.cadence.cadence_log import CADENCE_FILE, CadenceLog
from core.modules.processes.support.output_folder import OutputFolder

CADENCE_TICK = "cadence watch"


def cadence_tick(story: Story) -> None:
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == CADENCE_TICK]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


def ring(story: Story, process: Process) -> tuple[float, ...]:
    return story.container.get(CadenceLog).growths(process.id)


def has_cadence_record(story: Story, process: Process) -> bool:
    return bool(story.container.get(OutputFolder).text(process.id, CADENCE_FILE))


def printed(story: Story, process: Process, text: str) -> None:
    story.container.get(OutputFolder).write_output(process.id, 1, text)
