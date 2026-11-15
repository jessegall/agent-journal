from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.tasks.support.task_start_fixtures import TwoOpenTasks
from core.modules.tasks.agent_messages.task_testing_question_message import TaskTestingQuestionMessage
from engine.testing.expectations.expected_message import expected_agent_message

START_TAX_TASK = HookSamples.shell("journal task start 2", ShellPart("journal", CommandCategory.JOURNAL, ["task", "start", "2"]))
START_TOTAL_TASK = HookSamples.shell("journal task start 1", ShellPart("journal", CommandCategory.JOURNAL, ["task", "start", "1"]))


def test_starting_a_task_with_another_in_hand_asks_about_testing_that_one(new_story):
    story = new_story(fixture=TwoOpenTasks)
    story.run("task start 1", actor=story.agent)
    story.expect_hook_allowed("s-1", START_TAX_TASK, expected_agent_message(TaskTestingQuestionMessage.declared(), task=1))


def test_starting_a_task_with_none_in_hand_says_nothing(new_story):
    story = new_story(fixture=TwoOpenTasks)
    story.expect_absent_hook_line("s-1", START_TOTAL_TASK, "to testing first")
