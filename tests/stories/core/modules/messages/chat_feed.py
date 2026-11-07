from core.testing.story_fixture import StoryFixture
from core.modules.messages.messages_module import MessagesModule
from tests.stories.core.support.fixtures import UserJoined


class TwoMessages(StoryFixture):
    """Two messages for feed paging."""

    parent = UserJoined

    def steps(self, story):
        story.run('message send "first" --environment main', actor=story.user)
        story.run('message send "second" --environment main', actor=story.user)


def test_the_feed_brings_a_message_with_only_the_fields_the_chat_draws(new_story):
    story = new_story(fixture=UserJoined)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    answer = story.run("message feed --json", actor=story.user)
    answer.expect_text('"text": "Fix the cart first"')
    answer.expect_text('"captions"')
    answer.expect_text('"files"')
    answer.expect_no_text('"creator_id"')
    answer.expect_no_text('"delivered_at"')
    answer.expect_no_text('"metadata"')


def test_the_feed_pages_by_id_newest_first(new_story):
    story = new_story(fixture=TwoMessages)
    newest = story.run("message feed --limit 1 --json", actor=story.user)
    newest.expect_text("second")
    newest.expect_no_text("first")
    older = story.run("message feed --before-id 2 --json", actor=story.user)
    older.expect_text("first")
    older.expect_no_text("second")


def test_the_feed_lists_only_the_rows_with_the_ids_asked_for(new_story):
    story = new_story(fixture=TwoMessages)
    story.run('message send "third" --environment main', actor=story.user)
    answer = story.run("message feed --ids 1,3 --json", actor=story.user)
    answer.expect_text("first")
    answer.expect_text("third")
    answer.expect_no_text("second")
    story.run("message feed --ids 1,x", actor=story.user).expect_text("no list of whole numbers")


def test_the_chat_window_reads_both_paged_keys_by_ids(new_story):
    story = new_story(fixture=UserJoined)
    window = next(window for window in MessagesModule.windows if window.name == "messages.chat")
    keys = {key.name: key for key in window.keys}
    story.expect_rows("ids" in keys["messages"].arguments, "ids" in keys["marks"].arguments, keys["messages"].listed()["reads_ids"], keys["marks"].listed()["reads_ids"])
