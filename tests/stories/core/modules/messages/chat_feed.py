from tests.stories.core.support.fixtures import UserJoined


def test_the_feed_brings_a_message_with_only_the_fields_the_chat_draws(new_story):
    story = new_story(fixture=UserJoined)
    story.run('message send "Fix the cart first" --environment main', actor=story.user)
    answer = story.run("message feed --json", actor=story.user).output_text
    assert '"text": "Fix the cart first"' in answer and '"captions"' in answer and '"files"' in answer
    assert '"creator_id"' not in answer and '"delivered_at"' not in answer and '"metadata"' not in answer


def test_the_feed_pages_by_id_newest_first(new_story):
    story = new_story(fixture=UserJoined)
    story.run('message send "first" --environment main', actor=story.user)
    story.run('message send "second" --environment main', actor=story.user)
    newest = story.run("message feed --limit 1 --json", actor=story.user).output_text
    assert "second" in newest and "first" not in newest
    older = story.run("message feed --before-id 2 --json", actor=story.user).output_text
    assert "first" in older and "second" not in older
