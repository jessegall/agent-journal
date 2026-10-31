from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

CART_EDIT = HookSamples.edit("src/cart.py", 3, 1).with_fields(event="post_tool_use")


def test_an_agent_that_edits_a_file_leaves_a_file_edit_with_its_path_and_counts(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", CART_EDIT)
    story.expect_success("file-edit show 1", "path: src/cart.py", "added: 3", "removed: 1", f"agent_id: {story.agent.id}")


def test_an_edit_the_agent_is_about_to_make_leaves_no_file_edit(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1))
    story.expect_success("file-edit list", "nothing found")


def test_a_tool_that_reads_files_leaves_no_file_edit(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.sample("post_tool_use", {"name": "Read", "category": "read", "files": ["src/cart.py"], "diff": None}))
    story.expect_success("file-edit list", "nothing found")
