from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from core.modules.tasks.agent_messages.current_task_message import CurrentTaskMessage


def test_a_builder_whose_session_starts_again_is_told_its_task_and_its_last_log(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run("task log 1 'the totals are worked out'", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), CurrentTaskMessage.declared().agent_message(task=1).text)


