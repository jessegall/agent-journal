from dataclasses import replace

from engine.actor.actor import Actor
from engine.agent_machine.record.question import Question
from engine.agent_machine.stepping.agent_state_machine import AgentStateMachine
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.stack_codec import StackCodec
from engine.agent_step.step_writer import StepWriter
from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.agent_stack_move import AgentStackMove
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.support.coding_fixtures import BuilderStarted


def step(story, question=Question.none()):
    view = story.container.get(AgentViewReader).read(story.agent.id, question)
    return view, AgentStateMachine().step(view, question)


def saved(story, view, step_record, hook_call_id=None):
    with story.container.get(Database).transaction():
        return story.container.get(StepWriter).save(view, step_record, hook_call_id, Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))


def test_a_first_step_seeds_the_stack_row_and_its_move(played):
    story = played(BuilderStarted)
    view, outcome = step(story)
    commit = saved(story, view, outcome)
    row = story.container.get(Queries).query(AgentStack).filter(session_agent_id=story.agent.id).first()
    assert (commit.is_saved, row is not None, StackCodec.decoded(row.stacked_states) == list(outcome.stack.stacked_states)) == (True, True, True)


def test_a_step_that_changes_nothing_writes_nothing(played):
    story = played(BuilderStarted)
    saved(story, *step(story))
    view, outcome = step(story)
    queries = story.container.get(Queries)
    version = queries.query(AgentStack).filter(session_agent_id=story.agent.id).first().version
    moves = queries.query(AgentStackMove).filter(session_agent_id=story.agent.id).count()
    saved(story, view, outcome)
    assert queries.query(AgentStack).filter(session_agent_id=story.agent.id).first().version == version
    assert queries.query(AgentStackMove).filter(session_agent_id=story.agent.id).count() == moves


def test_a_save_whose_read_versions_changed_is_a_conflict_and_writes_nothing(played):
    story = played(BuilderStarted)
    view, outcome = step(story)
    saved(story, view, outcome)
    stale = replace(view, read_versions=replace(view.read_versions, stack_version=0))
    commit = saved(story, stale, AgentStateMachine().step(stale, Question.none()))
    assert not commit.is_saved
