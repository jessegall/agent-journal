from datetime import datetime, timezone

from engine.agent_machine.record.question import Question
from engine.agent_stack.frame import Frame
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.reason import Reason
from engine.enums.decision_class import DecisionClass
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.states.working import Working
from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_stack.work_reference import WorkReference
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.frame_codec import FrameCodec
from engine.command.bus import Bus
from engine.database.database import Database
from engine.enums.wait_mode import WaitMode
from engine.enums.work_type import WorkType
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.command.context import Context
from engine.actor.actor import Actor
from core.modules.drivers.commands.remove_stack_frame.remove_stack_frame import RemoveStackFrame
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_stack import AgentStack
from tests.stories.core.support.coding_fixtures import ReadTaskBuilder

ENTERED = datetime(2026, 10, 31, 9, 0, tzinfo=timezone.utc)
WORK_KEY = NeedKey("Working", None, "task:2")
WAIT_KEY = NeedKey("Waiting", SubjectReference("questions", 4), "question:4")


def stacked(story, *frames: Frame) -> None:
    row = story.container.get(Queries).query(AgentStack).filter(session_agent_id=story.agent.id).first()
    stack = row.changed(frames=FrameCodec.encoded(frames)) if row is not None else AgentStack(session_agent_id=story.agent.id, frames=FrameCodec.encoded(frames))
    with story.container.get(Database).transaction():
        story.container.get(Repository).save(stack, Context(Actor.core(), story.clock.timestamp(), RemoveStackFrame(story.agent.id, "", "")))


def suppressed(story) -> tuple[NeedKey, ...]:
    return story.container.get(AgentViewReader).read(story.agent.id, Question.none()).suppressions


def popped(story, frame: str) -> None:
    story.container.get(Bus).run(RemoveStackFrame(story.agent.id, frame, "the person moved it"), story.user, environment_id=1)


def test_a_popped_working_frame_is_suppressed_until_its_work_is_assigned_again(played):
    story = played(ReadTaskBuilder)
    story.expect_success('task make "Second task" --brief "the work a person moves"', actor=story.user)
    stacked(story, Frame(Working(WorkReference(WorkType.TASK, 2, "task 2"), True, Reason("tasks.finish", DecisionClass.REFUSE, "tasks.work", "finish task 2")), WORK_KEY, ENTERED))
    popped(story, WORK_KEY.generation)
    assert suppressed(story) == tuple([WORK_KEY])
    story.expect_success(f"task assign 2 --to {story.container.get(AgentRows).find(story.agent.id).number}", actor=story.user)
    assert suppressed(story) == ()


def test_a_popped_waiting_frame_is_cancelled_for_that_wait_alone(played):
    story = played(ReadTaskBuilder)
    stacked(story, Frame(Waiting(tuple([SubjectReference("questions", 4)]), WaitMode.ALL, False, "waiting on question 4"), WAIT_KEY, ENTERED))
    popped(story, WAIT_KEY.generation)
    assert suppressed(story) == tuple([WAIT_KEY])
