from tests.stories.core.support.coding_fixtures import UserBuilder
from engine.testing.stories.story_fixture import StoryFixture

from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_count_shown, expect_value_without

CART_EDIT = HookSamples.edit("src/cart.py")


def test_a_hook_naming_a_keyword_gives_the_memory_back_once(new_story):
    story = new_story(fixture=CartMemory)
    story.expect_hook_silent("s-1", CART_EDIT)


def test_after_a_compaction_the_keyword_gives_the_memory_back_again(new_story):
    story = new_story(fixture=CartMemory)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", HookSamples.sample("compact"))
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", CART_EDIT, "memory:1 applies now")


def test_one_hook_gives_back_at_most_the_keyword_limit(new_story):
    story = new_story(fixture=BuilderStarted)
    for number in range(1, 5):
        story.run(f'memory make "Cart fact {number}" --keywords cart --environment main', actor=story.agent)
    story.expect_hook_allowed("s-1", CART_EDIT, "memory:1, 2, 3 applies now")


class CartMemory(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.run('memory make "The cart total is in cents" --keywords cart --environment main', actor=story.agent)
        story.expect_hook_allowed('s-1', CART_EDIT, 'memory:1 applies now')


def test_a_start_memory_a_keyword_gave_before_the_listener_ran_is_given_once(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('memory make "The cart rounds to cents" --keywords cart --environment main', actor=story.user)
    story.hook("s-1", HookSamples.session_start())
    story.hook("s-1", HookSamples.prompt("Look at the cart"))
    story.run_listeners()
    delivered = story.run("memory-delivery list", actor=story.user).output_text
    expect_count_shown(delivered, "keyword", 1)
    expect_value_without(delivered, "start")
