from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted


def messages_text(story) -> str:
    return story.run("message list").output_text


def test_the_final_text_block_of_an_agent_turn_becomes_a_chat_message_of_the_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("The totals are fixed."))
    assert "The totals are fixed." in messages_text(story)
    story.expect_success("message list", f"1  {story.agent.id}  agent  The totals are fixed.  []  {{}}  []  []")


def test_the_same_display_hook_sent_twice_makes_one_message(new_story):
    story = new_story(fixture=BuilderStarted)
    sample = HookSamples.message_display("Done.").with_fields(firing="firing-1")
    story.hook("s-1", sample)
    story.hook("s-1", sample)
    assert messages_text(story).count("Done.") == 1


def test_a_text_block_that_is_not_final_makes_no_message(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("Still thinking", final=False))
    assert "Still thinking" not in messages_text(story)


def test_an_empty_text_block_makes_no_message(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("   "))
    assert messages_text(story).strip() == "nothing found"
