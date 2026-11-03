from tests.stories.core.support.fixtures import UserJoined

RULE_COMMAND = 'memory make "Always run the tests before a commit" --type rule --project'


def test_an_agent_makes_a_rule_for_its_environment(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('memory make "Always run the tests before a commit" --type rule --environment main', "type: rule", actor=story.agent)


def test_the_user_makes_a_rule_for_the_whole_project_at_weight_10(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(RULE_COMMAND, "type: rule", "weight: 10", actor=story.user)


def test_an_agent_changes_a_fact_into_a_rule(new_story):
    story = new_story(fixture=UserJoined)
    fact_id = story.new_row_id('memory make "The cart total is in cents" --type fact --environment main', actor=story.agent)
    story.expect_success(f"memory edit {fact_id} --type rule", actor=story.agent)
