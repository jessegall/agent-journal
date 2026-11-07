import json

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value


def test_a_revision_read_as_json_is_one_value_with_its_text(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('doc make "Notes" --abstract "Short" --body "First text" --environment main')
    answer = json.loads(story.run("doc revision 1 1 --json").output_text)
    expect_value(answer["body"], "First text")
