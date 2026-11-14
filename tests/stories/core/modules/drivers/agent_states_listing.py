from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords


def test_driver_state_types_lists_every_registered_state_with_its_shape_and_the_rule_it_gates(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_text("driver state-types", "skills.load-required", "skills.read-first on pre_tool_use", "messages.unread-countdown", "CountdownState", actor=story.agent)


def test_driver_states_lists_the_tiers_of_an_agent_and_says_none_for_a_tier_with_no_open_state(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_text(f"driver states {agent_number(story, story.agent.id)}", "critical: (none)", "stack: (none)", actor=story.agent)
