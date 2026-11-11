from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
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
from core.modules.processes.support.cadence.cadence_log import CADENCE_FILE, TICK_SECONDS, CadenceLog
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper

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
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == CADENCE_TICK]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


def ticks(story: Story, seconds: int, *processes: Process, every: int = 0, text: str = ".") -> None:
    """Moves the clock ten seconds at a time for the given seconds and runs the cadence watch after each step; with
    every, the given runs print the text at each multiple of every seconds."""
    folder = story.container.get(OutputFolder)
    for elapsed in range(TICK_SECONDS, seconds + 1, TICK_SECONDS):
        story.advance(TICK)
        for process in processes if every and elapsed % every == 0 else ():
            folder.write_output(process.id, 1, folder.output(process.id, 1) + text)
        cadence_tick(story)


def agent_run(story: Story, agent: Agent, line: str, category: CommandCategory) -> Process:
    """A run of another agent than the main one, started and moved to the background by that agent."""
    return started_by(story, Actor(agent.id, ActorType.AGENT), StartProcess.single_part(agent.id, line, "/work/main", category, 30))


def waiting_run(story: Story, agent: Agent, line: str) -> Process:
    """A test run of the given agent that only asks for a spot, so it waits in the queue while the spots are taken."""
    return story.container.get(Bus).run(StartProcess.single_part(agent.id, line, "/work/main", CommandCategory.TEST_RUN, 30), Actor(agent.id, ActorType.AGENT), environment_id=1)


def started_by(story: Story, actor: Actor, command: StartProcess) -> Process:
    """A run started, its first part begun and moved to the background, all by the given actor."""
    bus = story.container.get(Bus)
    process = bus.run(command, actor, environment_id=1)
    bus.run(StartProcessPart(process.id, 1), actor, environment_id=1)
    bus.run(MoveProcess(process.id), actor, environment_id=1)
    return process


def owned_run(story: Story, owner: Agent, line: str) -> Process:
    """A build on the main agent's session that another agent owns."""
    command = StartProcess(story.agent.id, None, line, "/work/main", "zsh", CommandCategory.BUILD, 30, (PartSpec(line, line.split()[0], False, CommandCategory.BUILD),),
                           owner_agent_id=owner.id)
    return started_by(story, story.agent, command)


def side_run(story: Story, actor: Actor, line: str, category: CommandCategory, plugin: str = "") -> Process:
    """A run on the main agent's session, started by the given actor, of a plugin when one is named."""
    return started_by(story, actor, StartProcess.single_part(story.agent.id, line, "/work/main", category, 30, plugin=plugin))


def kept_lines(story: Story) -> str:
    """Every line the journal has for the main agent, said or waiting, as JSON."""
    return story.run(f"agent-line list --agent {story.agent.id} --json", actor=story.agent).output_text


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
    return next(iter(story.container.get(ProcessQuery).agent(story.agent.id).running().all_rows()))


def cadence_lines(lines: list[str]) -> list[str]:
    return [line for line in lines if any(words in line for words in CADENCE_WORDS)]
