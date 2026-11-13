from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.claude_code.support.claude_code_nudges import NATIVE_MEMORY_BAN
from engine.testing.expectations.expect_nudge import said

MEMORY_FILE = "/Users/ada/.claude/projects/-Users-ada-shop/memory/cart.md"
BAN = said(NATIVE_MEMORY_BAN)


def test_editing_a_native_memory_file_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", HookSamples.edit(MEMORY_FILE), BAN)
