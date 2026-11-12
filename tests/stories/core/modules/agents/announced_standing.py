from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder


def test_a_helper_session_that_announced_itself_reads_running_with_no_launch_and_no_process(new_story):
    story = new_story(fixture=UserBuilder)
    helper_id = story.new_row_id(f"agent start s-announced claude helper --parent {story.agent.id} --environment main", actor=story.agent)
    story.expect_text(f"agent standing {agent_number(story, helper_id)} --environment main", "standing: running", actor=story.agent)
