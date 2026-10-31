from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.memories.support.memory_samples import VOICE
from tests.stories.core.support.coding_fixtures import BuilderStarted

SESSION_START = HookSamples.session_start()
FACT_MAKE = 'memory make "The cart total is in cents" --type fact --environment main'
FACT_OFF = "setting make memories.type.fact false --environment main"


def test_a_type_switched_off_in_an_environment_cannot_be_made_there(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(FACT_OFF)
    story.expect_refusal(FACT_MAKE, "the memory type fact is switched off here", actor=story.agent)


def test_a_switched_off_type_s_rows_stay_but_are_not_given_and_come_back_when_switched_on(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(FACT_MAKE, actor=story.agent)
    setting_id = story.new_row_id(FACT_OFF)
    reply = story.hook("s-1", SESSION_START)
    story.expect_rows(not any("The cart total is in cents" in line for line in reply.lines))
    story.expect_success(f"setting edit {setting_id} --value true")
    story.expect_hook_allowed("s-1", SESSION_START, "The cart total is in cents")


def test_a_rule_switched_off_by_its_full_name_gives_nothing(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(FACT_MAKE, actor=story.agent)
    story.run("setting make memories.give-at-start false")
    reply = story.hook("s-1", SESSION_START)
    story.expect_rows(not any("The cart total is in cents" in line for line in reply.lines))


def test_a_type_a_module_adds_is_given_after_the_facts(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_sync_success(VOICE)
    story.run('memory make "Write as a colleague, never as a manual" --type voice --environment main', actor=story.agent)
    story.run(FACT_MAKE, actor=story.agent)
    story.expect_ordered_hook_lines("s-1", SESSION_START, "The cart total is in cents", "Write as a colleague, never as a manual")
