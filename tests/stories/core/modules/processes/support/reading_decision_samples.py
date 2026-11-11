from engine.actor.actor import Actor
from engine.command.context import Context
from engine.query.queries import Queries
from engine.testing.stories.story import Story
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.reader_action import ReaderAction
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reading_exit import ReadingExit
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.enums.reason_code import ReasonCode
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.reading.reading_decision import ReadingDecision
from core.modules.processes.support.reading.reading_decisions import ReadingDecisions


def stored_decision(story: Story, process: Process, moment: ReadingMoment, decision: ReadingDecision) -> None:
    part = story.container.get(Queries).query(ProcessPart).filter(process_id=process.id, position=1).first()
    context = Context(Actor.core(), story.clock.timestamp(), MoveProcess(process.id), environment_id=process.environment_id)
    story.container.get(ReadingDecisions).store(process, part, moment, decision, context)


def stored_missing_reader(story: Story, process: Process, moment: ReadingMoment) -> None:
    stored_decision(story, process, moment, ReadingDecision.pressing(ReaderState.MISSING, ReaderAction.REQUIRE, PressureLevel.PREVENT, ReasonCode.READER_MISSING, (ReadingExit.COMPLY,)))


def stored_suitable_reader(story: Story, process: Process, moment: ReadingMoment) -> None:
    stored_decision(story, process, moment, ReadingDecision.nothing(ReaderState.SUITABLE))
