from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.messages.migrations.m015_main_message_targets import MainMessageTargetsMigration
from core.modules.messages.models.message import Message
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.engine.scope.environment_rows import TwoWorkingEnvironments, staging_agent
from tests.stories.core.modules.memories.support.memory_owners import MainAndWorkerMemories, read_agent, started_agent

MAIN_QUESTION = "Ship on Friday?"
PERSON_MESSAGE = "Hello main"


class StartedTaskMark(StoryFixture):
    """The main agent of environment main started task 1, which shows a mark in its chat."""

    parent = TwoWorkingEnvironments

    def steps(self, story):
        story.run("task start 1", actor=story.agent)
        story.run_listeners()

    def expect(self, story):
        story.expect_text("chat-mark list", "Task 1")


def open_main_question(story):
    story.run(f'question ask "{MAIN_QUESTION}" --context "A story asks this so its card and answer can be checked." --options a b', actor=story.agent)


def main_hook_call(story):
    return story.hook("s-1", HookSamples.prompt("Look at the cart")).hook_call_id


def test_a_new_main_session_reads_the_question_of_the_session_before_it(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    open_main_question(story)
    story.expect_text("question list", MAIN_QUESTION, actor=started_agent(story, "s-2", "main"))


def test_a_worker_reads_no_question_of_the_main_agent(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    open_main_question(story)
    story.expect_no_text("question list", MAIN_QUESTION, actor=read_agent(story, "s-9"))


def test_a_new_main_session_reads_the_hook_calls_of_the_session_before_it(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    call_id = main_hook_call(story)
    story.expect_success(f"hook-call show {call_id}", actor=started_agent(story, "s-2", "main"))


def test_a_worker_reads_no_hook_call_of_the_main_agent(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    call_id = main_hook_call(story)
    story.expect_refusal(f"hook-call show {call_id}", "no hook-call", actor=read_agent(story, "s-9"))


def test_a_worker_reads_its_own_hook_calls(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker_call = story.hook("s-9", HookSamples.prompt("Work on the cart")).hook_call_id
    story.expect_success(f"hook-call show {worker_call}", actor=read_agent(story, "s-9"))


def test_a_main_agent_of_another_environment_reads_no_hook_call_here(new_story):
    story = new_story(fixture=TwoWorkingEnvironments)
    call_id = main_hook_call(story)
    story.expect_refusal(f"hook-call show {call_id}", "no hook-call", actor=staging_agent(story))


def test_a_main_agent_of_another_environment_reads_no_chat_mark_here(new_story):
    story = new_story(fixture=StartedTaskMark)
    story.expect_text("chat-mark list", "Task 1", actor=story.agent)
    story.expect_no_text("chat-mark list", "Task 1", actor=staging_agent(story))


def test_a_new_main_session_reads_the_chat_marks_of_the_session_before_it(new_story):
    story = new_story(fixture=StartedTaskMark)
    story.expect_text("chat-mark list", "Task 1", actor=started_agent(story, "s-4", "main"))


def test_a_person_reads_the_rows_of_every_agent(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    open_main_question(story)
    story.expect_text("question list --environment main", MAIN_QUESTION, actor=story.user)


def test_a_message_to_the_main_agent_stores_no_target(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    message_id = story.new_row_id(f'message send "{PERSON_MESSAGE}" --environment main', story.user)
    story.expect_rows(story.row(Message, message_id).target_agent_id is None)


def test_a_message_with_no_target_reaches_a_new_main_session(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    story.run(f'message send "{PERSON_MESSAGE}" --environment main', actor=story.user)
    story.expect_text("message unread", PERSON_MESSAGE, actor=started_agent(story, "s-2", "main"))


def test_a_message_to_a_worker_keeps_its_target(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    message_id = story.new_row_id(f'message send "{PERSON_MESSAGE}" --target-agent {worker.id} --environment main', story.user)
    story.expect_rows(story.row(Message, message_id).target_agent_id == worker.id)


def test_the_migration_clears_a_stored_main_target_and_keeps_a_worker_s(new_story):
    story = new_story(fixture=MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    first = story.new_row_id(f'message send "{PERSON_MESSAGE}" --environment main', story.user)
    second = story.new_row_id(f'message send "{PERSON_MESSAGE}" --target-agent {worker.id} --environment main', story.user)
    database = story.container.get(Database)
    database.update(Statement(f"UPDATE messages SET target_agent_id = {story.agent.id} WHERE id = {first}"))
    for sql in MainMessageTargetsMigration.statements:
        database.update(Statement(sql))
    story.expect_rows(story.row(Message, first).target_agent_id is None, story.row(Message, second).target_agent_id == worker.id)
