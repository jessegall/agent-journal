from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

CART_EDIT = HookSamples.edit("src/cart.py")


def test_a_hook_naming_a_keyword_gives_the_memory_back_once(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "The cart total is in cents" --type fact --keywords cart --environment main', actor=story.agent)
    story.expect_hook_allowed("s-1", CART_EDIT, "The cart total is in cents")
    story.expect_hook_silent("s-1", CART_EDIT)


def test_after_a_compaction_the_keyword_gives_the_memory_back_again(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "The cart total is in cents" --type fact --keywords cart --environment main', actor=story.agent)
    story.expect_hook_allowed("s-1", CART_EDIT, "The cart total is in cents")
    story.advance(timedelta(seconds=1))
    story.hook("s-1", HookSamples.sample("compact"))
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", CART_EDIT, "The cart total is in cents")


def test_one_hook_gives_back_at_most_the_keyword_limit(new_story):
    story = new_story(fixture=BuilderStarted)
    for number in range(1, 5):
        story.run(f'memory make "Cart fact {number}" --type fact --keywords cart --environment main', actor=story.agent)
    reply = story.hook("s-1", CART_EDIT)
    story.expect_rows(sum("Cart fact" in line for line in reply.lines) == 3)
