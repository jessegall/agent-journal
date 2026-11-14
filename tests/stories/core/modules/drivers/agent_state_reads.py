from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.drivers.agent_states_lifecycle import SkillsDueAgent
from tests.stories.core.modules.skills.due import DUE
from tests.stories.core.support.agent_labels import agent_number


def test_driver_states_shows_the_load_state_in_its_tier_with_the_row_that_holds_it_and_none_for_the_other_tiers(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    shown = story.run(f"driver states {agent_number(story, story.agent.id)}", actor=story.agent).output_text
    in_place = next(line for line in shown.splitlines() if line.startswith("in_place:") or line.startswith("in place:"))
    deferred = next(line for line in shown.splitlines() if line.startswith("deferred:"))
    story.expect_rows("skills.load-required (agent_skill:" in in_place and " since " in in_place, "critical: (none)" in shown, "skills.kept-record-due (agent_skill:" in deferred, detail=shown)


def test_driver_state_types_lists_the_states_of_the_shipped_modules_with_module_shape_tier_and_gated_rules(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    story.expect_text("driver state-types", "skills.load-required", "messages.unread", "plans.focus-due", "messages.unread-countdown", "skills.skill-block", "in place", "stack", "plans.focus-lines on post_tool_use", actor=story.agent)


def test_a_hook_call_lists_the_states_of_its_board_with_tier_outcome_and_opener_time(new_story):
    story = new_story(DUE, fixture=SkillsDueAgent)
    reply = story.hook("s-1", HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use"))
    shown = story.run(f"hook-call show {reply.hook_call_id}", actor=story.agent).output_text
    story.expect_rows("plans.focus-due (in_place): closed" in shown, " ms" in shown, detail=shown)
