from engine.testing.examples.hook_samples import HookSamples
from engine.enums.tool_type import ToolType
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.read_limit import limit_reads
from tests.stories.core.support.seeds.large_read_seeds import StoryTaskSeed

"""Book 2 part B of doc 1255: the moved readers of tasks keep paging, and a reader that needs every row walks it
within the read limit."""

FINISHED_TASKS = 400
STARTED_TASKS = 60
EDIT_SAMPLE = HookSamples.sample("pre_tool_use", {"name": "Write", "category": ToolType.NEW_FILE, "files": ["a.py"], "shell": None, "diff": None})


def test_the_task_board_still_pages_a_list_of_400_tasks(new_story):
    story = new_story(fixture=UserJoined)
    story.seed(StoryTaskSeed, FINISHED_TASKS)
    limit_reads(story)
    story.expect_text("task board --state completed --limit 50", f"completed: {FINISHED_TASKS}", actor=story.user)


def test_an_agent_with_60_started_tasks_is_read_whole_within_the_read_limit(new_story):
    story = new_story(fixture=UserJoined)
    story.seed(StoryTaskSeed, STARTED_TASKS, state="started", outcome="", closed_at=None, holder_id=story.agent.id)
    limit_reads(story)
    story.expect_hook_allowed("s-1", EDIT_SAMPLE)
