from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from engine.testing.stories.story import Story
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.reading.reading_case import ReadingCase
from core.modules.processes.support.reading.reading_facts import ReadingFacts
from tests.stories.core.modules.helpers.helper_jobs import helper_agent

ENDED = ReadingMoment.END
STARTED = ReadingMoment.START
RUNNING = ReadingMoment.RUNNING


def case_of(story: Story, process: Process, moment: ReadingMoment) -> ReadingCase:
    part = story.container.get(Queries).query(ProcessPart).filter(process_id=process.id, position=1).first()
    return story.container.get(ReadingFacts).case_for(process, part, moment)


def helper_search(story: Story) -> Process:
    helper = helper_agent(story)
    command = StartProcess.single_part(helper.id, "grep -rn cart src", "/work/helper", CommandCategory.SEARCH, 15)
    return story.container.get(Bus).run(command, Actor(helper.id, ActorType.AGENT), environment_id=1)


def plugin_check(story: Story) -> Process:
    command = StartProcess.single_part(story.agent.id, "make lint", "/work/main", CommandCategory.CHECK, 30, plugin="sample")
    return story.container.get(Bus).run(command, story.agent, environment_id=1)
