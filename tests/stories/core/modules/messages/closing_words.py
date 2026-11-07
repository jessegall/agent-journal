import pytest

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.core.modules.documents.support.trail_fixtures import viewer
from core.modules.agents.support.terminal_typing import TerminalTyping


def chat(story) -> str:
    return story.run("message list --environment main", actor=story.user).output_text


def test_words_after_a_reply_by_command_reach_the_chat_once(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "are you there" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run('message reply 1 "yes"', actor=story.agent)
    story.hook("s-1", HookSamples.message_display("I told you where it stands."))
    expect_chat(story, "I told you where it stands.")


def test_words_after_a_person_wrote_again_since_the_reply_reach_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "is the cart done" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run('message reply 1 "yes"', actor=story.agent)
    story.run('message send "one more thing" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.message_display("Going idle now."))
    expect_chat(story, "Going idle now.")


def test_a_turn_with_no_reply_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.hook("s-1", HookSamples.message_display("Here is what I found."))
    expect_chat(story, "Here is what I found")


def test_a_few_words_answering_a_journal_line_stay_out_of_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] output 3 ended: finished"))
    story.hook("s-1", HookSamples.message_display("The stories are running."))
    expect_absent_chat(story, "The stories are running")


def test_a_question_after_a_journal_line_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] output 3 ended: finished"))
    story.hook("s-1", HookSamples.message_display("Where is the cart total kept?"))
    expect_chat(story, "Where is the cart total kept?")


def test_a_plain_answer_to_a_new_message_line_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] new message 7"))
    story.hook("s-1", HookSamples.message_display("Yes, done."))
    expect_chat(story, "Yes, done")


def test_a_plain_answer_to_an_answered_question_line_reaches_the_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] question:58 is answered"))
    story.hook("s-1", HookSamples.message_display("Going with your choice."))
    expect_chat(story, "Going with your choice")


def expect_absent_chat(story, expected) -> None:
    actual = chat(story)
    assert expected not in actual, actual


def expect_chat(story, expected) -> None:
    actual = chat(story)
    assert expected in actual, actual


@pytest.fixture
def reply_ready(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "What happened?" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    return story


def test_a_closing_text_repeating_the_reply_stays_out_of_chat(reply_ready):
    story = reply_ready
    story.run('message reply 1 "Yes, that is task 7246, with worker 672: those lines become one line with all the ids. It is not merged yet."', actor=story.agent)
    text = "I have confirmed that to you: task 7246 is with worker 672 and has not been merged yet."
    story.hook("s-1", HookSamples.message_display(text))
    story.hook("s-1", HookSamples.edit("src/cart.py"))
    expect_absent_chat(story, text)


def test_new_worker_and_task_numbers_after_a_reply_reach_chat(reply_ready):
    story = reply_ready
    story.run('message reply 1 "Yes. Looking at it."', actor=story.agent)
    text = "Delegated to Codex worker 672: tasks 6923 and 6931. I kept back task 7049."
    story.hook("s-1", HookSamples.message_display(text))
    expect_chat(story, text)


def test_new_row_numbers_or_questions_after_a_reply_reach_chat(reply_ready):
    story = reply_ready
    story.run('message reply 1 "The worker has task 7246 and its tests passed."', actor=story.agent)
    text = "The worker has task 7247 and its tests passed."
    question = "The worker has task 7246 and its tests passed?"
    story.hook("s-1", HookSamples.message_display(text))
    story.hook("s-1", HookSamples.message_display(question))
    expect_chat(story, text)
    expect_chat(story, question)


def test_sixty_percent_overlap_is_held_and_less_reaches_chat(reply_ready):
    story = reply_ready
    story.run('message reply 1 "apple berry cherry"', actor=story.agent)
    repeated = "apple berry cherry melon grape"
    news = "melon grape lemon apple berry cherry"
    story.hook("s-1", HookSamples.message_display(repeated))
    story.hook("s-1", HookSamples.message_display(news))
    expect_absent_chat(story, repeated)
    expect_chat(story, news)


@pytest.fixture
def reaction_turn(new_story, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
    typed = []
    monkeypatch.setattr(TerminalTyping, "type_line", lambda _typing, agent_id, line: typed.append((agent_id, line)))
    story.expect_success('message send "The cart is ready" --environment main', actor=story.agent)
    story.hook("s-1", HookSamples.stop())
    viewer(story, "messages.chat", ["message", "react", "1", "👍"])
    story.expect_rows(len(typed) == 1, typed[0][0] == story.agent.id)
    line = typed[0][1]
    story.expect_rows("the user reacted to message:1" in line, "act if it asks" in line, "closing text is not in chat" in line, "journal message send" in line, "👍" not in line)
    story.hook("s-1", HookSamples.prompt(line))
    return story


@pytest.mark.parametrize("text", ["Thanks!", "A question that ends this reaction turn?", "Long closing text. " * 30])
def test_a_reaction_turns_closing_text_stays_out_of_chat(reaction_turn, text):
    story = reaction_turn
    story.hook("s-1", HookSamples.message_display(text))
    story.hook("s-1", HookSamples.stop())
    expect_absent_chat(story, text)


def test_reaction_text_before_a_tool_reaches_chat_but_the_closing_text_does_not(reaction_turn):
    story = reaction_turn
    story.hook("s-1", HookSamples.message_display("I will inspect the cart."))
    expect_absent_chat(story, "I will inspect the cart.")
    story.hook("s-1", HookSamples.edit("src/cart.py"))
    expect_chat(story, "I will inspect the cart.")
    story.hook("s-1", HookSamples.message_display("All finished."))
    story.hook("s-1", HookSamples.stop())
    expect_absent_chat(story, "All finished.")


def test_a_message_sent_on_purpose_in_a_reaction_turn_reaches_chat(reaction_turn):
    story = reaction_turn
    story.expect_success('message send "I will start the cart work" --environment main', actor=story.agent)
    story.hook("s-1", HookSamples.message_display("I have sent the message."))
    story.hook("s-1", HookSamples.stop())
    expect_chat(story, "I will start the cart work")
    expect_absent_chat(story, "I have sent the message.")


def test_an_older_reaction_line_also_keeps_the_closing_text_out(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.hook("s-1", HookSamples.prompt("[journal] the user put 👍 on message:1: act on it if it asks for something"))
    story.hook("s-1", HookSamples.message_display("Should I continue?"))
    story.hook("s-1", HookSamples.stop())
    expect_absent_chat(story, "Should I continue?")
