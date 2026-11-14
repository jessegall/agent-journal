from tests.stories.core.support.fixtures import UserJoined


def test_a_person_makes_a_rule_and_an_agent_reads_it_in_the_overview(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('rule make "Run only the tests that prove the change"', actor=story.user)
    story.expect_text("rule list --state active", "Run only the tests that prove the change", actor=story.agent)
    story.expect_text("overview", "Run only the tests that prove the change", actor=story.agent)


def test_an_active_rule_can_be_removed_and_leaves_the_list(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('rule make "Plain words only"', actor=story.user)
    story.expect_success("rule remove 1", actor=story.user)
    story.expect_absent("rule list --state active", "Plain words only", actor=story.agent)
