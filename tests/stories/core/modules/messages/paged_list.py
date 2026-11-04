from core.testing.story_fixture import StoryFixture

from tests.stories.core.support.fixtures import UserJoined


class ThreeMessages(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        for text in ('first', 'second', 'third'):
            story.run(f'message send "{text}" --environment main', actor=story.user)


def three_messages(new_story):
    return new_story(fixture=ThreeMessages)


def test_a_list_after_an_id_holds_only_the_rows_newer_than_it(new_story):
    story = three_messages(new_story)
    output = story.run("message list --after-id 2", actor=story.user)
    output.expect_text(" third ")
    output.expect_no_text(" second ")
    output.expect_no_text(" first ")


def test_a_list_before_an_id_holds_only_the_rows_older_than_it(new_story):
    story = three_messages(new_story)
    output = story.run("message list --before-id 3", actor=story.user)
    output.expect_text(" second ")
    output.expect_text(" first ")
    output.expect_no_text(" third ")


def test_a_list_after_the_newest_id_is_empty(new_story):
    story = three_messages(new_story)
    output = story.run("message list --after-id 3", actor=story.user).output_text
    expect_output_6(output, "nothing found")


def expect_output_6(output, expected) -> None:
    actual = output.strip()
    assert actual == expected, actual
