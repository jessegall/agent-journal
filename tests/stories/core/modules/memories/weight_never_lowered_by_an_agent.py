from tests.stories.core.support.fixtures import UserJoined

FACT_MAKE = 'memory make "The cart total is in cents" --type fact --weight 6 --environment main'


def test_an_agent_raises_a_weight(new_story):
    story = new_story(fixture=UserJoined)
    fact_id = story.new_row_id(FACT_MAKE, actor=story.agent)
    story.expect_success(f"memory weigh {fact_id} 8", actor=story.agent)
    story.expect_success(f"memory show {fact_id}", "weight: 8", actor=story.agent)


def test_an_agent_that_lowers_a_weight_is_refused_with_the_way_on(new_story):
    story = new_story(fixture=UserJoined)
    fact_id = story.new_row_id(FACT_MAKE, actor=story.agent)
    story.expect_refusal(f"memory weigh {fact_id} 2", "a weight is never lowered", actor=story.agent)


def test_the_user_lowers_a_weight(new_story):
    story = new_story(fixture=UserJoined)
    fact_id = story.new_row_id(FACT_MAKE, actor=story.agent)
    story.expect_success(f"memory weigh {fact_id} 2", actor=story.user)
    story.expect_success(f"memory show {fact_id}", "weight: 2", actor=story.user)
