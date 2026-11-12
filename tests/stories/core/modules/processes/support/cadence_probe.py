import os
import shutil
import time
from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from engine.module.module_finder import ModuleFinder
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.process import Process
from core.modules.processes.support.cadence.cadence_line import TICK_SECONDS
from core.modules.processes.support.cadence.cadence_log import CADENCE_FILE, CadenceLog
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.group_cpu_time import GroupCpuTime
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper

TEST_ROWS_REASON = "the test reads every row it checks"

CADENCE_TICK = "cadence watch"
TICK = timedelta(seconds=TICK_SECONDS)
WORKER_SESSION = "s-worker"
CADENCE_WORDS = ("printed nothing", "no reader can follow", "has written nothing", "uses no processor time")
TOOL_USE = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))


class HelperBesideWorker(StoryFixture):
    """A main agent with one read-only helper and one worker beside it."""

    parent = StartedHelper

    def steps(self, story: Story) -> None:
        story.run(f"agent start {WORKER_SESSION} claude worker --environment main")


def cadence_tick(story: Story) -> None:
    tick_named(story, CADENCE_TICK)


def tick_named(story: Story, label: str) -> None:
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == label]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


def ticks(story: Story, seconds: int, *processes: Process, every: int = 0, text: str = ".") -> None:
    """Moves the clock ten seconds at a time for the given seconds and runs the cadence watch after each step; with
    every, the given runs print the text at the first step at or after each multiple of every seconds."""
    folder = story.container.get(OutputFolder)
    for elapsed in range(TICK_SECONDS, seconds + 1, TICK_SECONDS):
        story.advance(TICK)
        for process in processes if every and elapsed % every < TICK_SECONDS else ():
            folder.write_output(process.id, 1, folder.output(process.id, 1) + text)
        cadence_tick(story)


def agent_run(story: Story, agent: Agent, line: str, category: CommandCategory) -> Process:
    """A run of another agent than the main one, started and moved to the background by that agent."""
    return started_by(story, Actor(agent.id, ActorType.AGENT), StartProcess.single_part(agent.id, line, "/work/main", category, 30))


def waiting_run(story: Story, agent: Agent, line: str) -> Process:
    """A test run of the given agent that only asks for a spot, so it waits in the queue while the spots are taken."""
    return story.container.get(Bus).run(StartProcess.single_part(agent.id, line, "/work/main", CommandCategory.TEST_RUN, 30), Actor(agent.id, ActorType.AGENT), environment_id=1)


def started_by(story: Story, actor: Actor, command: StartProcess, environment_id: int = 1) -> Process:
    """A run started, its first part begun and moved to the background, all by the given actor."""
    bus = story.container.get(Bus)
    process = bus.run(command, actor, environment_id=environment_id)
    bus.run(StartProcessPart(process.id, 1), actor, environment_id=environment_id)
    bus.run(MoveProcess(process.id), actor, environment_id=environment_id)
    return process


def owned_run(story: Story, owner: Agent, line: str) -> Process:
    """A build on the main agent's session that another agent owns."""
    command = StartProcess(story.agent.id, None, line, "/work/main", "zsh", CommandCategory.BUILD, 30, (PartSpec(line, line.split()[0], False, CommandCategory.BUILD),),
                           owner_agent_id=owner.id)
    return started_by(story, story.agent, command)


def side_run(story: Story, actor: Actor, line: str, category: CommandCategory, plugin: str = "") -> Process:
    """A run on the main agent's session, started by the given actor, of a plugin when one is named."""
    return started_by(story, actor, StartProcess.single_part(story.agent.id, line, "/work/main", category, 30, plugin=plugin))


def kept_lines(story: Story, agent_id: int = 0, actor: Actor | None = None) -> str:
    """Every line the journal has for an agent, the main one unless named, said or waiting, as JSON."""
    return story.run(f"agent-line list --agent {agent_id or story.agent.id} --json", actor=actor or story.agent).output_text


def elsewhere_run(story: Story, actor: Actor) -> Process:
    """A silent build of the agent of the second environment, started and moved to the background there."""
    return started_by(story, actor, StartProcess.single_part(actor.id, "make there", "/work/elsewhere", CommandCategory.BUILD, 30), environment_id=2)


def tree_of(story: Story, tree: GroupCpuTime, group: int, *processes: Process) -> None:
    """The given processor time stands for the process trees of the runs, each under the given group."""
    story.container.bind(GroupCpuTime, tree)
    for process in processes:
        story.container.get(OutputFolder).write_pid(process.id, group)


def printed_now(story: Story, process: Process, text: str) -> None:
    """The run prints the text now, by the story's clock."""
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, folder.output(process.id, 1) + text)
    printed_at = story.clock.timestamp().value.timestamp()
    os.utime(story.home.folder / "processes" / str(process.id) / "1.out", (printed_at, printed_at))


def removed_output(story: Story, process: Process) -> None:
    (story.home.folder / "processes" / str(process.id) / "1.out").unlink()


def damaged_record(story: Story, process: Process) -> None:
    story.container.get(OutputFolder).write(process.id, CADENCE_FILE, "ten looked x")


def record_text(story: Story, process: Process) -> str:
    return story.container.get(OutputFolder).text(process.id, CADENCE_FILE)


def cut_to(story: Story, process: Process, kept: str, dropped: int) -> None:
    """The runner cuts the output to its limit: it keeps the given text and adds the dropped bytes to the cut count."""
    folder = story.container.get(OutputFolder)
    folder.write(process.id, "1.cut-bytes", str(folder.cut_bytes(process.id, 1) + dropped))
    folder.write_output(process.id, 1, kept)


def folder_made_a_file(story: Story, process: Process) -> None:
    """The run's folder is replaced by a plain file, so nothing in it can be read or written."""
    path = story.home.folder / "processes" / str(process.id)
    shutil.rmtree(path)
    path.write_text("not a folder")


def tick_cost(story: Story) -> tuple[int, float]:
    """The statements one cadence tick sends to the database and the seconds it takes."""
    connection = story.container.get(Database).connection
    statements: list[str] = []
    connection.set_trace_callback(statements.append)
    began = time.perf_counter()
    try:
        cadence_tick(story)
    finally:
        connection.set_trace_callback(None)
    return len(statements), time.perf_counter() - began


def worker_agent(story: Story) -> Agent:
    return story.story_rows(Agent, session=WORKER_SESSION)[0]


def told(story: Story, session: str) -> list[str]:
    return list(story.hook(session, TOOL_USE).lines)


def expect_told(story: Story, session: str, *texts: str) -> None:
    lines = told(story, session)
    story.expect_rows(*(any(text in line for line in lines) for text in texts), detail="\n".join(lines))


def ring(story: Story, process: Process) -> tuple[float, ...]:
    return story.container.get(CadenceLog).growths(process.id)


def has_cadence_record(story: Story, process: Process) -> bool:
    return bool(story.container.get(OutputFolder).text(process.id, CADENCE_FILE))


def printed(story: Story, process: Process, text: str) -> None:
    story.container.get(OutputFolder).write_output(process.id, 1, text)


def running_run(story: Story) -> Process:
    return next(iter(story.container.get(ProcessQuery).agent(story.agent.id).running().every_row(TEST_ROWS_REASON)))


def cadence_lines(lines: list[str]) -> list[str]:
    return [line for line in lines if any(words in line for words in CADENCE_WORDS)]
