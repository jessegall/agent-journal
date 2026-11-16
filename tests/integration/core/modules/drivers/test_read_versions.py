from engine.actor.actor import Actor
from engine.agent_machine.record.question import Question
from engine.agent_machine.stepping.agent_state_machine import AgentStateMachine
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.step_writer import StepWriter
from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.driver_version import DriverVersion
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.support.coding_fixtures import BuilderStarted


def read_step(story):
    view = story.container.get(AgentViewReader).read(story.agent.id, Question.none())
    return view, AgentStateMachine().step(view, Question.none())


def saved(story, view, step):
    with story.container.get(Database).transaction():
        return story.container.get(StepWriter).save(view, step, None, Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))


def epoch(story) -> int:
    row = story.container.get(Queries).query(DriverVersion).every_environment("one test's environments").first()
    return row.change_count if row is not None else 0


def test_a_pause_written_after_the_view_was_read_keeps_that_step_from_saving(played):
    story = played(BuilderStarted)
    view, step = read_step(story)
    story.expect_success(f"agent pause {story.container.get(AgentRows).find(story.agent.id).number}", actor=story.user)
    assert saved(story, view, step).is_saved is False
    assert saved(story, *read_step(story)).is_saved is True


