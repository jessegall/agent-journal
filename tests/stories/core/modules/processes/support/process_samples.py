import shlex

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.part_spec import PartSpec
from core.modules.processes.commands.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.testing.hook_sample import HookSample
from core.testing.story import Story

BYTES_LONG = 5000
BYTES_SHORT = 12


def start_process(story: Story, line: str = "make test && echo done", piped: bool = False, limit_seconds: int = 30) -> Process:
    """Runs StartProcess the way the runner rule does in a hook call's transaction: one part for each command of the line."""
    texts = [text.strip() for text in line.split("&&")]
    parts = tuple(PartSpec(text, text.split()[0], piped and index == 0) for index, text in enumerate(texts))
    command = StartProcess(story.agent.id, None, line, "/work/main", "zsh", CommandCategory.UNKNOWN, limit_seconds, parts)
    return story.container.get(Bus).run(command, story.agent, environment_id=1)


def runner_line(process_id: int, line: str, limit: int = 30, background: bool = False) -> str:
    """The line the rule gives the agent's tool to run in place of its own."""
    flag = " --background" if background else ""
    return f"journal-run --process {process_id} --limit {limit}{flag} -- {shlex.quote(line)}"


def with_parse_error(sample: HookSample, error: str = "unbalanced quote") -> HookSample:
    tool = dict(sample.body["tool"])
    tool["shell"] = {**tool["shell"], "parse_error": error}
    return sample.with_fields(tool=tool)


def user_waits(story: Story) -> None:
    """A person sends a message the agent has not read."""
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
