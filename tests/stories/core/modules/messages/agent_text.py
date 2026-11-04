from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted


def messages_text(story) -> str:
    return story.run("message list").output_text


def test_the_final_text_block_of_an_agent_turn_becomes_a_chat_message_of_the_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("The totals are fixed."))
    expect_messages_text(story, "The totals are fixed.")
    story.expect_success("message list", f"1  {story.agent.id}  agent  The totals are fixed.  []  {{}}  []  []")


def test_the_same_display_hook_sent_twice_makes_one_message(new_story):
    story = new_story(fixture=BuilderStarted)
    sample = HookSamples.message_display("Done.").with_fields(firing="firing-1")
    story.hook("s-1", sample)
    story.hook("s-1", sample)
    expect_count_messages(story, "Done.", 1)


def test_a_text_block_that_is_not_final_makes_no_message(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("Still thinking", final=False))
    expect_absent_messages_text(story, "Still thinking")


def test_an_empty_text_block_makes_no_message(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("   "))
    expect_messages(story, "nothing found")


def expect_messages_text(story, expected) -> None:
    actual = messages_text(story)
    assert expected in actual, actual


def expect_absent_messages_text(story, expected) -> None:
    actual = messages_text(story)
    assert expected not in actual, actual


def expect_messages(story, expected) -> None:
    actual = messages_text(story).strip()
    assert actual == expected, actual


def expect_count_messages(story, text, expected) -> None:
    actual = messages_text(story).count(text)
    assert actual == expected, actual
