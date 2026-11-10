from core.modules.helpers.support.helper_settings import PROGRAM_WINDOW_PERCENT
from core.modules.helpers.support.program_states import ProgramStates
from tests.stories.core.modules.helpers.usage_limits import report
from tests.stories.core.modules.helpers.usage_lockdown import EDIT, lockdown_story
from tests.stories.core.support.coding_fixtures import UserBuilder


def test_a_plan_window_past_the_window_setting_takes_no_new_agent_but_stops_no_running_agent(new_story):
    story = lockdown_story(new_story, fixture=UserBuilder)
    story.expect_success(f"setting set {PROGRAM_WINDOW_PERCENT} 50 --project", actor=story.user)
    report(story, 60)
    states = story.container.get(ProgramStates)
    story.expect_rows(not states.allowance_state("claude").is_ready, story.hook("s-1", EDIT).halt == "")
    story.expect_success(f"setting set {PROGRAM_WINDOW_PERCENT} 95 --project", actor=story.user)
    story.expect_rows(states.allowance_state("claude").is_ready, story.hook("s-1", EDIT).halt == "")
