from tests.integration.core.modules.drivers.test_agent_states_lifecycle import SkillsDueAgent
from tests.stories.core.modules.skills.due import DUE
from tests.stories.core.support.agent_labels import agent_number


def test_driver_states_shows_the_load_state_in_its_tier_with_the_row_that_holds_it_and_none_for_the_other_tiers(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    shown = story.run(f"driver states {agent_number(story, story.agent.id)}", actor=story.agent).output_text
    placed = next(line for line in shown.splitlines() if line.startswith("in_place:") or line.startswith("in place:"))
    deferred = next(line for line in shown.splitlines() if line.startswith("deferred:"))
    story.expect_rows("skills.load-required (agent_skill:" in placed and " since " in placed, "critical: (none)" in shown, "skills.kept-record-due (agent_skill:" in deferred, detail=shown)


def test_driver_state_types_lists_the_states_of_the_shipped_modules_with_module_shape_tier_and_gated_rules(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    story.expect_text("driver state-types", "skills.load-required", "messages.unread", "plans.focus-due", "messages.unread-countdown", "skills.skill-block", "in place", "stack", "plans.focus-lines on post_tool_use", actor=story.agent)
