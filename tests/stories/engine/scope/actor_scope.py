from core.testing.story_fixture import StoryFixture

from datetime import timedelta

import pytest

from engine.caller.caller_request import CallerRequest
from engine.change.event_log import EventLog
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.process_samples import ended_run
from tests.stories.core.modules.processes.worker_outputs import worker_run
from tests.stories.core.support.coding_fixtures import BuilderHelper
from core.testing.expect_row import expect_row

TASK_LINE = 'task make "Fix the cart" --environment main'
MAIN_CHAT = "chat-mark main --environment main"
MAIN_DOCK = "dock-item main --environment main"
MADE = "Task 1 created"
QUESTION_LINE = 'question ask "Which cart?" --context "A story asks this so its card and answer can be checked." --options "the old" "the new" --environment main'
DOC_LINE = 'doc make "Cart rules" --abstract "How the cart counts" --body "Cents" --environment main'


@pytest.fixture
def subagent_task(new_story):
    story = new_story(fixture=BuilderHelper)
    story.run(TASK_LINE, actor=story.helper)
    story.run_listeners()
    return story


def test_a_helpers_task_move_stays_out_of_the_main_chat_and_is_stored_as_its_own(subagent_task):
    story = subagent_task
    story.expect_absent(MAIN_CHAT, MADE)
    mark = next(story.container.get(Queries).query(ChatMark).filter(target_model="task", target_id=1).all_rows())
    expect_row(mark, session_agent_id=story.helper.id)


def test_a_main_agents_task_move_still_shows_in_the_main_chat(new_story):
    story = new_story(fixture=BuilderHelper)
    story.run(TASK_LINE, actor=story.agent)
    story.run_listeners()
    story.expect_text(MAIN_CHAT, MADE)


def test_a_task_move_of_the_journal_itself_has_no_scope_and_shows(new_story):
    story = new_story(fixture=GlobalTaskMark)
    story.expect_text(MAIN_CHAT, MADE)


def test_a_line_another_agent_caused_is_hidden_and_its_own_is_not(new_story):
    story = new_story(fixture=BuilderHelper)
    line = AgentLine(session_agent_id=story.agent.id, creator_id=story.helper.id, text="words")
    expect_state_scoped_2(line, story, AgentLineState.HIDDEN)
    expect_state_scoped(line, story, AgentLineState.WAITING)


def test_when_lets_only_the_events_its_function_says_true_to_through(new_story):
    story = new_story(fixture=BuilderHelper)
    story.run(TASK_LINE, actor=story.helper)
    scopes = story.container.get(Scopes)
    log = story.container.get(EventLog)
    event = log.event(log.newest_id())
    with scopes.event_scope([ActorScope.when(lambda logged: logged.event == event.event)], event):
        expect_row(scopes, actor_id=None)
    with scopes.event_scope([ActorScope.when(lambda logged: False)], event):
        expect_row(scopes, actor_id=story.helper.id)
    with scopes.event_scope([ActorScope], event):
        expect_row(scopes, actor_id=None)


def test_a_helpers_document_still_docks_above_the_main_chat(new_story):
    story = new_story(fixture=BuilderHelper)
    story.run(DOC_LINE, actor=story.helper)
    story.run_listeners()
    story.expect_text(MAIN_DOCK, "Cart rules")


def test_a_helpers_dock_item_stays_out_of_the_main_chat_and_pushes_nothing_out(new_story):
    story = new_story(fixture=BuilderHelper)
    story.run(DOC_LINE, actor=story.agent)
    story.run_listeners()
    story.run('memory make "The cart counts in cents" --weight 5 --environment main', actor=story.helper)
    story.expect_success("dock add memories.memory memory 1 --environment main", actor=story.helper)
    story.expect_absent(MAIN_DOCK, "memories.memory")
    story.expect_text("dock-item list", "memories.memory")
    story.expect_text(MAIN_DOCK, "Cart rules")


def test_a_helpers_message_send_is_refused_and_a_main_agents_is_not(new_story):
    story = new_story(fixture=BuilderHelper)
    story.expect_refusal('message send "The cart is done" --environment main', "only a main agent", actor=story.helper)
    story.expect_success('message send "The cart is done" --environment main', actor=story.agent)


def test_the_commands_of_the_main_agent_leave_out_a_helpers_and_the_helpers_page_shows_them(new_story):
    story = new_story(fixture=BuilderHelper)
    ended_run(story, "pytest -q", "ok\n")
    worker_run(story, story.helper, "make build")
    story.expect_absent("process feed", "make build")
    story.expect_text("process feed", "pytest -q")
    story.expect_text(f"process feed --session-agent-id {story.helper.id}", "make build")


def test_a_helper_reads_only_its_own_rows_and_a_person_reads_them_all(subagent_task):
    story = subagent_task
    story.expect_absent("chat-mark list", MADE, actor=story.agent)
    story.expect_text("chat-mark list", MADE, actor=story.helper)
    story.expect_text("chat-mark list", MADE)


def test_a_helpers_reminder_does_not_fire_at_the_main_agent(new_story):
    story = new_story(fixture=BuilderHelper)
    story.expect_success('reminder make "Log the task" --every-minutes 10 --environment main', actor=story.helper)
    story.advance(timedelta(minutes=11))
    story.expect_absent_hook_line("s-1", HookSamples.edit("src/cart.py"), "reminder:1: Log the task")


def test_a_helpers_question_is_refused_and_it_reports_to_the_agent_that_sent_it_instead(new_story):
    story = new_story(fixture=BuilderHelper)
    story.expect_refusal(QUESTION_LINE, "put it in your report to the main agent", actor=story.helper)


def test_a_main_agents_question_still_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderHelper)
    story.expect_success(QUESTION_LINE, actor=story.agent)
    story.run_listeners()
    story.expect_text(MAIN_DOCK, "questions.open")


def test_an_edit_of_a_shown_mark_under_an_agent_leaves_it_in_the_main_chat(new_story):
    story = new_story(fixture=GlobalTaskMark)
    mark = next(story.container.get(Queries).query(ChatMark).filter(target_model="task", target_id=1).all_rows())
    expect_agent_id_mark(mark, None)
    expect_agent_id_scoped(mark, "new", story, None)


def test_a_helpers_reaction_still_reaches_the_main_agent(new_story):
    story = new_story(fixture=BuilderHelper)
    story.run('message send "The cart is done" --environment main', actor=story.agent)
    story.run('message react 1 "👍"', actor=story.helper)
    story.expect_absent("agent-line list --state hidden", "message 1")


class GlobalTaskMark(StoryFixture):
    parent = BuilderHelper

    def steps(self, story):
        story.run(TASK_LINE)
        story.run_listeners()


def expect_agent_id_mark(mark, expected) -> None:
    actual = mark.session_agent_id
    assert actual is expected, actual


def applied_setting(story, model, actor_id):
    scopes = story.container.get(Scopes)
    with scopes.opened(actor_id):
        return scopes.applied(model)


def expect_agent_id_scoped(mark, text, story, expected) -> None:
    actual = applied_setting(story, mark.changed(text=text), story.helper.id).session_agent_id
    assert actual is expected, actual


def expect_state_scoped(line, story, expected) -> None:
    actual = applied_setting(story, line, story.agent.id).state
    assert actual is expected, actual


def expect_state_scoped_2(line, story, expected) -> None:
    actual = applied_setting(story, line, story.helper.id).state
    assert actual is expected, actual
