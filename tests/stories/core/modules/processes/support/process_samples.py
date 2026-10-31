from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.start_process import PartSpec, StartProcess
from core.modules.processes.models.process import Process
from core.testing.story import Story

BYTES_LONG = 5000
BYTES_SHORT = 12


def start_process(story: Story, line: str = "make test && echo done", piped: bool = False, limit_seconds: int = 30) -> Process:
    """Runs StartProcess the way the runner rule does in a hook call's transaction: one part for each command of the line."""
    texts = [text.strip() for text in line.split("&&")]
    parts = tuple(PartSpec(text, text.split()[0], piped and index == 0) for index, text in enumerate(texts))
    command = StartProcess(story.agent.id, None, line, "/work/main", "zsh", CommandCategory.UNKNOWN, limit_seconds, parts)
    return story.container.get(Bus).run(command, story.agent, environment_id=1)
