import shlex

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.modules.processes.commands.end_process import EndProcess
from core.modules.processes.commands.end_process_part import EndProcessPart
from core.modules.processes.commands.move_process import MoveProcess
from core.modules.processes.commands.part_spec import PartSpec
from core.modules.processes.commands.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_sample import HookSample
from core.testing.story import Story

BYTES_LONG = 5000
BYTES_SHORT = 12


def start_process(story: Story, line: str = "make test && echo done", piped: bool = False, limit_seconds: int = 30) -> Process:
    """Runs StartProcess the way the runner rule does in a hook call's transaction: one part for each command of the line."""
    texts = [text.strip() for text in line.split("&&")]
    parts = tuple(PartSpec(text, text.split()[0], piped and index == 0) for index, text in enumerate(texts))
    command = StartProcess(story.agent.id, None, line, "/work/main", "zsh", CommandCategory.JOURNAL if line.startswith("journal ") else CommandCategory.UNKNOWN, limit_seconds, parts)
    return story.container.get(Bus).run(command, story.agent, environment_id=1)


def runner_line(story: Story, process_id: int, line: str, limit: int = 30, background: bool = False) -> str:
    """The line the rule gives the agent's tool to run in place of its own."""
    flag = " --background" if background else ""
    return f"{shlex.quote(str(story.home.folder.resolve() / 'bin' / 'journal-run'))} --process {process_id} --limit {limit}{flag} -- {shlex.quote(line)}"


def with_parse_error(sample: HookSample, error: str = "unbalanced quote") -> HookSample:
    tool = dict(sample.body["tool"])
    tool["shell"] = {**tool["shell"], "parse_error": error}
    return sample.with_fields(tool=tool)


def user_waits(story: Story) -> None:
    """A person sends a message the agent has not read."""
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)


def install_runner(story: Story) -> Story:
    """Places a runner where the installer does, so the rule rewrites lines."""
    binary = story.home.folder.resolve() / "bin" / "journal-run"
    binary.parent.mkdir(parents=True, exist_ok=True)
    binary.write_text("#!/bin/sh\n")
    binary.chmod(0o755)
    return story


def ended_run(story: Story, line: str, text: str, exit_code: int = 0) -> Process:
    """A run of the builder that has ended with the output given, kept as the module keeps a long run's."""
    process = start_process(story, line)
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, text)
    bus = story.container.get(Bus)
    bus.run(EndProcessPart(process.id, 1, exit_code), story.agent, environment_id=1)
    bus.run(EndProcess(process.id, exit_code, max(len(text), BYTES_LONG), text.count("\n")), story.agent, environment_id=1)
    return process


def moved_run(story: Story, line: str = "make build") -> Process:
    """A run of the builder that went to the background."""
    process = start_process(story, line)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    return process


def end_run(story: Story, process: Process, text: str, exit_code: int = 0) -> None:
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, text)
    bus = story.container.get(Bus)
    bus.run(EndProcessPart(process.id, 1, exit_code), story.agent, environment_id=1)
    bus.run(EndProcess(process.id, exit_code, max(len(text), BYTES_LONG), text.count("\n")), story.agent, environment_id=1)
