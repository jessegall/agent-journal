from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.messages.migrations.m015_main_message_targets import MainMessageTargetsMigration
from core.modules.messages.models.message import Message
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.integration.engine.scope.test_environment_rows import TwoWorkingEnvironments, staging_agent
from tests.stories.core.modules.memories.support.memory_owners import MainAndWorkerMemories, read_agent, started_agent
from tests.stories.core.support.agent_labels import agent_number

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


























def test_the_migration_clears_a_stored_main_target_and_keeps_a_worker_s(played):
    story = played(MainAndWorkerMemories)
    worker = read_agent(story, "s-9")
    first = story.new_row_id(f'message send "{PERSON_MESSAGE}" --environment main', story.user)
    second = story.new_row_id(f'message send "{PERSON_MESSAGE}" --target-agent {agent_number(story, worker.id)} --environment main', story.user)
    database = story.container.get(Database)
    database.update(Statement(f"UPDATE messages SET target_agent_id = {story.agent.id} WHERE id = {first}"))
    for sql in MainMessageTargetsMigration.statements:
        database.update(Statement(sql))
    story.expect_rows(story.row(Message, first).target_agent_id is None, story.row(Message, second).target_agent_id == worker.id)
