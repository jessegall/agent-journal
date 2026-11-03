from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser


def chat(story) -> str:
    return story.run("message list --environment main", actor=story.user).output_text


def test_words_after_a_reply_by_command_stay_out_of_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "are you there" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run('message reply 1 "yes"', actor=story.agent)
    story.hook("s-1", HookSamples.message_display("I told you where it stands."))
    assert "I told you where it stands" not in chat(story)


def test_a_turn_with_no_reply_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.hook("s-1", HookSamples.message_display("Here is what I found."))
    assert "Here is what I found" in chat(story)


def test_a_few_words_answering_a_journal_line_stay_out_of_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] output 3 ended: finished"))
    story.hook("s-1", HookSamples.message_display("The stories are running."))
    assert "The stories are running" not in chat(story)


def test_a_question_after_a_journal_line_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] output 3 ended: finished"))
    story.hook("s-1", HookSamples.message_display("Should I go on?"))
    assert "Should I go on?" in chat(story)


def test_a_plain_answer_to_a_new_message_line_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] new message 7"))
    story.hook("s-1", HookSamples.message_display("Yes, done."))
    assert "Yes, done" in chat(story)


def test_a_plain_answer_to_an_answered_question_line_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] question:58 is answered"))
    story.hook("s-1", HookSamples.message_display("Going with your choice."))
    assert "Going with your choice" in chat(story)
