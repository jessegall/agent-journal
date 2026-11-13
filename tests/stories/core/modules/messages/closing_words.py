import pytest

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.modules.documents.support.trail_fixtures import viewer
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.messages.support.message_nudges import MESSAGE_REACTION
from core.modules.messages.support.message_nudges import NEW_MESSAGE
def chat(story) -> str:
    return story.run("message list --environment main", actor=story.user).output_text


def two_lines(text: str) -> str:
    first, _, last = text.rpartition(" ")
    return f"{first}\n{last}"


def test_words_after_a_person_wrote_again_since_the_reply_reach_the_chat(new_story):
    story = new_story(fixture=UserBuilder)
    story.run('message send "is the cart done" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run('message reply 1 "yes"', actor=story.agent)
    story.run('message send "one more thing" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.message_display("Going idle now."))
    expect_chat(story, "Going idle now.")


def test_closing_words_that_ask_the_user_to_choose_reach_the_chat_after_a_reaction(new_story):
    story = new_story(fixture=UserBuilder)
    story.run('message send "Are you back at work" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt(f"[journal] {NEW_MESSAGE.nudge(message=1).text}"))
    story.run('message react 1 "👍"', actor=story.agent)
    text = "Everything came through intact: the summary (doc 1) and the briefing (doc 2).\n\nShall I set the research team on docs 1 and 2?"
    story.hook("s-1", HookSamples.message_display(text))
    story.hook("s-1", HookSamples.stop())
    expect_chat(story, "Shall I set the research team on docs 1 and 2?")


def expect_absent_chat(story, expected) -> None:
    actual = chat(story)
    assert expected not in actual, actual


def expect_chat(story, expected) -> None:
    actual = chat(story)
    assert expected in actual, actual


@pytest.fixture
def reply_ready(new_story):
    story = new_story(fixture=UserBuilder)
    story.run('message send "What happened?" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    return story


def test_a_closing_text_repeating_the_reply_stays_out_of_chat(reply_ready):
    story = reply_ready
    story.run('message reply 1 "Yes, that is task 7246, with worker 672: those lines become one line with all the ids. It is not merged yet."', actor=story.agent)
    text = two_lines("I have confirmed that to you: task 7246 is with worker 672 and has not been merged yet.")
    story.hook("s-1", HookSamples.message_display(text))
    story.hook("s-1", HookSamples.edit("src/cart.py"))
    expect_absent_chat(story, text)


@pytest.fixture
def reaction_turn(new_story, monkeypatch):
    story = new_story(fixture=UserBuilder)
    lines = []
    monkeypatch.setattr(TerminalTyping, "type_line", lambda _typing, agent, line: lines.append((agent.id, line)))
    story.expect_success('message send "The cart is ready" --environment main', actor=story.agent)
    story.hook("s-1", HookSamples.stop())
    viewer(story, "messages.chat", ["message", "react", "1", "👍"])
    story.expect_rows(len(lines) == 1, lines[0][0] == story.agent.id)
    line = lines[0][1]
    story.expect_rows(MESSAGE_REACTION.nudge(message=1).text in line, "👍" not in line)
    story.hook("s-1", HookSamples.prompt(line))
    return story


def test_a_message_sent_on_purpose_in_a_reaction_turn_reaches_chat(reaction_turn):
    story = reaction_turn
    story.expect_success('message send "I will start the cart work" --environment main', actor=story.agent)
    story.hook("s-1", HookSamples.message_display("I have sent the message."))
    story.hook("s-1", HookSamples.stop())
    expect_chat(story, "I will start the cart work")
    expect_absent_chat(story, "I have sent the message.")
