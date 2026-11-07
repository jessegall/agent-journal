from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser


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


def test_a_closing_text_repeating_the_reply_stays_out_of_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "What happened?" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run('message reply 1 "Yes, that is task 7246, with worker 672: those lines become one line with all the ids. It is not merged yet."', actor=story.agent)
    text = "I have confirmed that to you: task 7246 is with worker 672 and has not been merged yet."
    story.hook("s-1", HookSamples.message_display(text))
    story.hook("s-1", HookSamples.edit("src/cart.py"))
    expect_absent_chat(story, text)


def test_new_worker_and_task_numbers_after_a_reply_reach_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "What happened?" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run('message reply 1 "Yes. Looking at it."', actor=story.agent)
    text = "Delegated to Codex worker 672: tasks 6923 and 6931. I kept back task 7049."
    story.hook("s-1", HookSamples.message_display(text))
    expect_chat(story, text)


def test_new_row_numbers_or_questions_after_a_reply_reach_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "What happened?" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run('message reply 1 "The worker has task 7246 and its tests passed."', actor=story.agent)
    text = "The worker has task 7247 and its tests passed."
    question = "The worker has task 7246 and its tests passed?"
    story.hook("s-1", HookSamples.message_display(text))
    story.hook("s-1", HookSamples.message_display(question))
    expect_chat(story, text)
    expect_chat(story, question)


def test_sixty_percent_overlap_is_held_and_less_reaches_chat(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "What happened?" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.run('message reply 1 "apple berry cherry"', actor=story.agent)
    held = "apple berry cherry melon grape"
    news = "apple berry cherry melon grape lemon"
    story.hook("s-1", HookSamples.message_display(held))
    story.hook("s-1", HookSamples.message_display(news))
    expect_absent_chat(story, held)
    expect_chat(story, news)
