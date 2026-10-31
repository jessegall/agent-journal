from tests.stories.core.fixtures import MainEnvironment
from tests.stories.core import story_lines as lines
def test_a_session_start_makes_one_actor_and_one_agent_under_one_number(new_story):
    story = new_story(fixture=MainEnvironment)
    agent_id = story.new_row_id(lines.AGENT_START)
    story.expect_success(f"agent show {agent_id}", "session: s-1", "role: main", "environment_id: 1")
    story.expect_success(f"actor show {agent_id}", "type: agent", "name: s-1")


def test_a_session_starts_only_once(new_story):
    story = new_story(fixture=MainEnvironment)
    story.run(lines.AGENT_START)
    story.expect_refusal(lines.AGENT_START, "session s-1 has started already")


def test_a_helper_names_the_agent_that_started_it_and_the_environment_lists_both(new_story):
    story = new_story(fixture=MainEnvironment)
    main_id = story.new_row_id(lines.AGENT_START)
    helper_id = story.new_row_id(f"agent start s-2 claude worker --parent {main_id} --environment main")
    story.expect_success(f"agent show {helper_id}", f"parent_id: {main_id}", "role: worker")
    story.expect_success("agent list --environment 1", f"{helper_id}  {main_id}  s-2  claude  worker", f"{main_id}  s-1  claude  main")


def test_an_agent_starts_only_in_an_environment_and_is_never_made_by_hand(new_story):
    story = new_story()
    story.expect_refusal("agent start s-1 claude main", "an agent starts in an environment")
    story.expect_usage_error("agent make s-1 claude main")
