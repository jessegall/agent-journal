from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.processes.models.process_part import ProcessPart
from core.base.query.queries import Queries
from datetime import timedelta

import shlex

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.base.driver.hook_reply import HookReply
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_sample import HookSample
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from core.modules.processes.ticks.output_reading import OutputReading

BYTES_LONG = 5000
BYTES_SHORT = 12


def start_process(story: Story, line: str = "make test && echo done", piped: bool = False, limit_seconds: int = 30, category: CommandCategory | None = None) -> Process:
    texts = [text.strip() for text in line.split("&&")]
    parts = tuple(PartSpec(text, text.split()[0], piped and index == 0, sample_category(text, category)) for index, text in enumerate(texts))
    command = StartProcess(story.agent.id, None, line, "/work/main", "zsh", (category or (CommandCategory.JOURNAL if line.startswith("journal ") else CommandCategory.UNKNOWN)), limit_seconds, parts)
    return story.container.get(Bus).run(command, story.agent, environment_id=1)


def sample_category(text: str, category: CommandCategory | None) -> CommandCategory:
    if text.startswith("cd "):
        return CommandCategory.READ
    if category is not None:
        return category
    return CommandCategory.JOURNAL if text.startswith("journal ") else CommandCategory.UNKNOWN


def runner_line(story: Story, process_id: int, line: str, limit: int = 15, background: bool = False, session: str = "s-1", read_command: bool = False, has_long_part: bool = False, queue_run: bool = True, sandbox: bool = False, progress_count: str = "", progress_position: int = 0, progress_pattern: str = "") -> str:
    flag = (" --background" if background else "") + (" --only-reads" if read_command else "")
    if sandbox or session == "sub-1":
        flag += " --read-only-shell"
    variables = f" JOURNAL_RUN_MOST_OUTPUT={(100 if has_long_part else 10) << 20}"
    if limit > 0 and has_long_part and not read_command and queue_run:
        flag += " --queue"
        variables += " JOURNAL_RUN_QUEUE_WAIT=5"
    if progress_count:
        variables += f" JOURNAL_RUN_PROGRESS_LISTING={shlex.quote(progress_count)} JOURNAL_RUN_PROGRESS_POSITION={progress_position} JOURNAL_RUN_PROGRESS_PATTERN={shlex.quote(progress_pattern)}"
    return f"JOURNAL_AGENT_SESSION={shlex.quote(session)} JOURNAL_RUNNER_PROCESS={process_id}{variables} {shlex.quote(str(story.home.folder.resolve() / 'bin' / 'journal-run'))} --process {process_id} --limit {limit}{flag} -- {shlex.quote(line)}"


def expect_rewritten(reply: HookReply, line: str) -> None:
    assert dict(reply.updated_input) == {"command": line}


def monitor(command: str) -> HookSample:
    return HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": command}}).with_raw({"tool_input": {"command": command}})


def with_parse_error(sample: HookSample, error: str = "unbalanced quote") -> HookSample:
    tool = dict(sample.body["tool"])
    tool["shell"] = {**tool["shell"], "parse_error": error}
    return sample.with_fields(tool=tool)


def user_waits(story: Story) -> None:
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)


def install_runner(story: Story) -> Story:
    binary = story.home.folder.resolve() / "bin" / "journal-run"
    binary.parent.mkdir(parents=True, exist_ok=True)
    binary.write_text("#!/bin/sh\n")
    binary.chmod(0o755)
    return story


def ended_run(story: Story, line: str, text: str, exit_code: int = 0) -> Process:
    process = start_process(story, line)
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, text)
    bus = story.container.get(Bus)
    bus.run(EndProcessPart(process.id, 1, exit_code), story.agent, environment_id=1)
    bus.run(EndProcess(process.id, exit_code, max(len(text), BYTES_LONG), text.count("\n")), story.agent, environment_id=1)
    return process


def parts_started(story: Story, process: Process) -> None:
    actor = Actor(process.session_agent_id, ActorType.AGENT)
    for part in story.container.get(Queries).query(ProcessPart).filter(process_id=process.id).all_rows():
        story.container.get(Bus).run(StartProcessPart(process.id, part.position), actor, environment_id=1)


def started_run(story: Story, line: str = "make test && echo done", category: CommandCategory | None = None) -> Process:
    process = start_process(story, line, category=category)
    parts_started(story, process)
    return process


def moved_run(story: Story, line: str = "make build", category: CommandCategory | None = None) -> Process:
    process = started_run(story, line, category)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    return process


def end_run(story: Story, process: Process, text: str, exit_code: int = 0) -> None:
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, text)
    bus = story.container.get(Bus)
    actor = Actor(process.session_agent_id, ActorType.AGENT)
    bus.run(EndProcessPart(process.id, 1, exit_code), actor, environment_id=1)
    bus.run(EndProcess(process.id, exit_code, max(len(text), BYTES_LONG), text.count("\n")), actor, environment_id=1)


def tick(story) -> None:
    story.advance(timedelta(minutes=1))
    for process in tuple(story.container.get(ProcessQuery).running().all_rows()):
        story.container.get(OutputFolder).beat(process.id, story.clock.timestamp())
    OutputReading().read(story.container)
    story.tick("s-1")


def ended_hook_lines(story: Story, sample: HookSample) -> list[str]:
    reply = story.hook("s-1", sample)
    for process in story.container.get(ProcessQuery).running().all_rows():
        end_run(story, process, "done\n")
    return reply.lines
