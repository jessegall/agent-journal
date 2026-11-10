from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

from tests.stories.core.support.coding_fixtures import UserBuilder


def test_the_tip_of_a_working_agent_names_its_type_program_and_number(new_story):
    story = new_story(fixture=UserBuilder)
    worker = story.new_row_id("agent start s-tip claude worker --environment main")
    story.expect_text(f"agent tip {agent_number(story, worker)} --environment main --json", '"activity": "working"', '"retired": false', '"program": "claude"', f'"role_label": "worker {worker}"', actor=story.user)


def test_the_tip_of_an_ended_agent_says_it_ended(new_story):
    story = new_story(fixture=UserBuilder)
    worker = story.new_row_id("agent start s-tip claude worker --environment main")
    story.advance(timedelta(minutes=2))
    story.run(f"agent end {worker}", actor=story.user)
    story.expect_text(f"agent tip {agent_number(story, worker)} --environment main --json", '"activity": "ended"', '"retired": false', actor=story.user)
