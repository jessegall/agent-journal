from datetime import timedelta

from engine.driver.hook_route import HookRoute
from engine.driver.program_lockdown import ProgramLockdown
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.usage_lockdown import UsageLockdown
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.modules.helpers.usage_limits import WEEK_SECONDS, report

EDIT = HookSamples.edit("src/cart.py")
STOP_LINE = "[journal] Claude is at your usage limit until"
LIFT = "a person can lift the limit with usage-limit delete 1"
LIMIT = "usage-limit set claude '5 hours' fixed 50"


class LimitSet(StoryFixture):
    """A person set a limit of 50 percent on the five hour window of Claude."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success(LIMIT, actor=story.user)


def lockdown_story(new_story, fixture=LimitSet) -> Story:
    return with_reported_usage(new_story(fixture=fixture))


def with_reported_usage(story: Story) -> Story:
    """The story reads the usage the program's status file reports, so a limit can be reached in it."""
    story.container.bind(ProgramStates, story.container.constructed(ProgramStates))
    story.container.bind(ProgramLockdown, story.container.constructed(UsageLockdown))
    story.container.bind(HookRoute, story.container.constructed(type(story.container.get(HookRoute))))
    return story


def hook_call_count(story: Story) -> int:
    return len(story.story_rows(HookCall))


def test_a_main_agents_next_tool_is_stopped_in_the_same_hook_once_the_limit_is_reached_and_no_rule_is_asked(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    count = hook_call_count(story)
    reply = story.hook("s-1", EDIT)
    story.expect_rows(reply.halt.startswith(STOP_LINE), LIFT in reply.halt, reply.refusal == "", not reply.lines, reply.hook_call_id is None)
    story.expect_rows(hook_call_count(story) == count, story.row(Agent, story.agent.id).usage_limit_ends_at is None)
    story.expect_rows(not story.container.get(ProgramLockdown).lockdown("codex").is_active)


def test_a_tool_started_just_below_the_percent_finishes_and_its_post_tool_use_exactly_at_it_stops_the_agent(new_story):
    story = lockdown_story(new_story)
    report(story, 49.9)
    story.expect_rows(story.hook("s-1", EDIT).halt == "")
    report(story, 50.0)
    story.expect_rows(story.hook("s-1", HookSamples.sample("post_tool_use")).halt.startswith(STOP_LINE))


def test_the_stop_hook_of_an_agent_with_an_open_task_is_stopped_and_never_blocked(new_story):
    story = lockdown_story(new_story)
    story.expect_success('task make "Fix the cart" --brief "Done when the total is right"', actor=story.agent)
    report(story, 55)
    reply = story.hook("s-1", HookSamples.stop())
    story.expect_rows(reply.halt.startswith(STOP_LINE), reply.refusal == "")
    story.expect_success("task show 1", "state: open")


def test_an_agent_with_a_task_in_hand_is_let_stop_and_its_task_stays_started(new_story):
    story = lockdown_story(new_story)
    story.expect_success('task make "Fix the cart" --brief "Done when the total is right"', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    refused = story.hook("s-1", HookSamples.stop())
    report(story, 55)
    reply = story.hook("s-1", HookSamples.stop())
    story.expect_rows(refused.refusal != "", reply.halt.startswith(STOP_LINE), reply.refusal == "", not reply.lines)
    story.expect_success("task show 1", "state: started")


def test_a_compaction_and_the_tick_are_stopped_and_leave_no_hook_call(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    count = hook_call_count(story)
    replies = [story.hook("s-1", HookSamples.sample("compact")), story.tick("s-1")]
    story.expect_rows(all(reply.halt.startswith(STOP_LINE) and not reply.lines for reply in replies), hook_call_count(story) == count)


def test_the_plan_below_full_changes_nothing_and_a_repeated_firing_first_allowed_gets_the_stop_once_it_is_full(new_story):
    story = lockdown_story(new_story, UserBuilder)
    report(story, 99)
    first = story.hook("s-1", EDIT.with_fields(firing="firing-1"))
    report(story, 100)
    repeated = story.hook("s-1", EDIT.with_fields(firing="firing-1"))
    story.expect_rows(first.halt == "", repeated.halt.startswith(STOP_LINE), "usage-limit delete" not in repeated.halt)


def test_a_session_end_is_still_recorded(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    reply = story.hook("s-1", HookSamples.sample("session_end"))
    story.expect_rows(reply.halt == "", story.row(Agent, story.agent.id).ended_at is not None)


def test_the_later_of_two_ends_is_the_one_in_the_stop_line(new_story):
    story = lockdown_story(new_story)
    report(story, 55, 100)
    week_end = (story.clock.timestamp().value + timedelta(seconds=WEEK_SECONDS)).astimezone().strftime("%H:%M on %d %b")
    halt = story.hook("s-1", HookSamples.sample("post_tool_use")).halt
    story.expect_rows(week_end in halt, "usage-limit delete" not in halt)


def test_a_worker_and_a_helper_are_stopped_at_their_next_tool(new_story):
    story = lockdown_story(new_story)
    story.expect_success(f"agent start s-helper claude helper --parent {story.agent.id} --environment main")
    story.expect_success(f"agent start s-worker claude worker --parent {story.agent.id} --environment main", actor=story.user)
    report(story, 55)
    story.expect_rows(story.hook("s-helper", EDIT).halt.startswith(STOP_LINE), story.hook("s-worker", EDIT).halt.startswith(STOP_LINE))


def test_a_program_a_person_starts_by_hand_is_stopped_at_its_first_hook_and_gets_no_agent(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    reply = story.hook("s-new", HookSamples.session_start())
    story.expect_rows(reply.halt.startswith(STOP_LINE), story.container.get(Queries).query(Agent).filter(session="s-new").first() is None)


def test_a_window_whose_reset_passed_does_not_stop_anything(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    story.advance(timedelta(hours=6))
    story.expect_rows(story.hook("s-1", EDIT).halt == "")


def test_a_removed_limit_ends_the_stop_at_the_next_hook(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    story.expect_success("usage-limit delete 1", actor=story.user)
    story.expect_rows(story.hook("s-1", EDIT).halt == "")


def test_a_fault_while_reading_the_limit_stops_nothing_and_is_written_to_the_system_log(new_story, monkeypatch):
    story = lockdown_story(new_story)
    report(story, 55)

    def unreadable(states, program):
        raise OSError("status file unreadable")

    monkeypatch.setattr(ProgramStates, "limit_end", unreadable)
    story.expect_rows(story.hook("s-1", HookSamples.stop()).halt == "", "could not be read, so nothing is stopped" in story.system_log_text())


def test_an_agent_cannot_lift_the_limit_and_a_failed_tool_of_a_halted_agent_is_stopped_as_well(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    story.expect_refusal("usage-limit delete 1", "an agent cannot", actor=story.agent)
    story.expect_rows(story.hook("s-1", HookSamples.sample("post_tool_use_failure")).halt.startswith(STOP_LINE))
