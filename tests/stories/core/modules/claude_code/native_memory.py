from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

MEMORY_FILE = "/Users/ada/.claude/projects/-Users-ada-shop/memory/cart.md"
BAN = "Do not write Claude's own memory files: save it as a journal memory instead"


def test_editing_a_native_memory_file_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", HookSamples.edit(MEMORY_FILE), BAN)
