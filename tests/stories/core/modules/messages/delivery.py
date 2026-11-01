from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def delivery_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    return story


def test_an_unread_message_of_the_user_reaches_the_agent_at_its_next_hook_and_is_then_read(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.stop(), "[journal] new message 1: Fix the cart first")
    story.expect_text("message show 1", "read_at:", actor=story.user)


def test_a_message_is_given_once(new_story):
    story = delivery_story(new_story)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "new message 1")


def test_the_files_of_a_message_are_named_by_their_path_in_the_line(new_story):
    story = delivery_story(new_story)
    pending = story.home.pending_files / "aaaaaaaaaaaaaaaa"
    pending.mkdir(parents=True)
    (pending / "cart.png").write_bytes(b"png")
    story.run('message send "see this" --file aaaaaaaaaaaaaaaa/cart.png --environment main', actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.stop(), f"file {story.home.message_files(1) / 'cart.png'}")


def test_a_message_of_the_agent_is_not_given_back_to_it(new_story):
    story = delivery_story(new_story)
    story.run('message send "On it" --environment main', actor=story.agent)
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "new message")
