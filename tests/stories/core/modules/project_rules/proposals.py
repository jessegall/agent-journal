from tests.stories.core.support.fixtures import UserJoined


def test_an_agents_rule_waits_on_a_card_until_a_person_approves_it(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('rule make "Name things plainly"', "state: proposed", actor=story.agent)
    story.expect_no_text("rule list --state active", "Name things plainly")
    story.run_listeners()
    story.expect_text("dock-item main --environment main", "project-rules.proposed", actor=story.user)
    story.expect_success("rule approve 1", actor=story.user)
    story.run_listeners()
    story.expect_text("rule list --state active", "Name things plainly", actor=story.agent)
    story.expect_text("dock-item main --environment main", "undocked", actor=story.user)


def test_a_denied_rule_never_holds(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('rule make "Skip the tests"', "state: proposed", actor=story.agent)
    story.expect_success("rule deny 1", actor=story.user)
    story.expect_no_text("rule list --state active", "Skip the tests")


def test_the_setting_lets_agents_make_rules_at_once(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.project-rules.agents-make-rules true --project")
    story.expect_success('rule make "Name things plainly"', "state: active", actor=story.agent)
