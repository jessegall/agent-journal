from datetime import timedelta

from engine.database.database import READ_LIMIT_ROWS, Database
from core.modules.chat.models.journal_exception import JournalException
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.queries.hook_call_query import IDLE_LIMIT_SECONDS
from suites.coding.modules.workers.support.available_work import AvailableWork
from suites.coding.modules.workers.commands.remind_inactive_main_agent.remind_inactive_main_agent_handler import WAKE_SOURCE
from suites.coding.modules.workers.ticks.inactive_main_agent_prompt import InactiveMainAgentPrompt
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from tests.stories.suites.coding.support.main_controls_fixture import scope_line
from tests.stories.support.story_checks import expect_value
from suites.coding.agent_messages.task_assignment_message import TaskAssignmentMessage
from engine.testing.expectations.expected_message import expected_agent_message
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.coding_settings import KEEP_RUNNING_SETTING

AUTO = f"{AUTO_MODE_SETTING}"
DISPATCHES = f"{DISPATCHES_WORKERS_SETTING}"
WORKER_LIMIT = f"{WORKER_RUN_LIMIT}"
SEVERAL_TASKS = READ_LIMIT_ROWS + 1


def available(story):
    with scope_line(story):
        return story.container.get(AvailableWork).answer(story.agent.id)




CONTINUE_SETTING = f"{KEEP_RUNNING_SETTING}"


class KeepGoingOffMain(StoryFixture):
    parent = OpenTaskBuilder

    def steps(self, story):
        story.expect_success("driver choose coding.main --environment main")
        story.expect_success(f"setting set {CONTINUE_SETTING} off --environment main")
        story.expect_success(f"setting set {AUTO} off --environment main")


def main_story(played):
    story = played(OpenTaskBuilder)
    story.expect_success("driver choose coding.main --environment main")
    return story






def waking_lines(story) -> list[str]:
    InactiveMainAgentPrompt()(story.container)
    return [line.text for line in story.story_rows(AgentLine, session_agent_id=story.agent.id, source=WAKE_SOURCE)]








class UnfinishedTaskMain(StoryFixture):
    parent = OpenTaskBuilder

    def steps(self, story):
        story.expect_success(f"setting set {DISPATCHES} off --environment main")
        story.expect_success(f"setting set {AUTO} off --environment main")
        story.expect_success("driver choose coding.main --environment main")
        story.expect_success('plan make "Later work" --brief "A plan the user has not approved"', actor=story.agent)
        story.expect_success('phase make --plan 1 "First" --goal "The first step is done"', actor=story.agent)
        story.expect_success('task make "In the plan" --brief "A task of a plan that has not started" --phase 1', actor=story.agent)
        story.expect_success(f"task assign 2 --to {story.agent.id}", actor=story.agent)






def test_a_stop_of_a_main_agent_with_more_unfinished_tasks_than_one_read_may_load_is_held_and_records_no_fault(played):
    story = played(UnfinishedTaskMain)
    for number in range(SEVERAL_TASKS):
        task = story.new_row_id(f'task make "Step {number}" --brief "One more step"', actor=story.agent)
        story.run(f"task assign {task} --to {story.agent.id}", actor=story.agent)
    story.container.get(Database).read_limit_rows = READ_LIMIT_ROWS
    reply = story.hook("s-1", HookSamples.stop())
    faults = [row.message for row in story.story_rows(JournalException)]
    story.expect_rows(bool(reply.refusal), faults == [], detail=f"{reply.refusal} | {faults}")

