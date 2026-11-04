from tests.stories.core.support.fixtures import UserJoined


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
    story = new_story(fixture=UserJoined)
    story.run('message send "first" --environment main', actor=story.user)
    story.run('message send "second" --environment main', actor=story.user)
    newest = story.run("message feed --limit 1 --json", actor=story.user)
    newest.expect_text("second")
    newest.expect_no_text("first")
    older = story.run("message feed --before-id 2 --json", actor=story.user)
    older.expect_text("first")
    older.expect_no_text("second")
