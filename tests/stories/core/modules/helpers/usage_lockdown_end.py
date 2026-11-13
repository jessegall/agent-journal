import json
from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_activity import AgentActivity
from core.modules.drivers.commands.end_silent_helpers.end_silent_helpers import EndSilentHelpers
from core.modules.helpers.commands.end_helpers_past_limits.end_helpers_past_limits import EndHelpersPastLimits
from core.modules.helpers.ticks.usage_limit_marker import UsageLimitMarker
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, read_jobs
from tests.stories.core.modules.helpers.usage_limits import report
from tests.stories.core.modules.helpers.usage_lockdown import EDIT, LIFT, LIMIT, STOP_LINE, lockdown_story

LOCKDOWN_ENDED_TEXT = "The usage limit ended: continue what you were doing"
STOPPED_TIME = timedelta(minutes=45)


class LimitedStartedHelper(StoryFixture):
    """A running helper of journal-researcher, and a limit of 50 percent on Claude."""

    parent = StartedHelper

    def steps(self, story):
        story.expect_success(LIMIT, actor=story.user)


def lockdown_ended_line_count(story, agent_id: int) -> int:
    return story.run(f"agent-line list --agent {agent_id}").output_text.count(LOCKDOWN_ENDED_TEXT)


def test_a_stopped_agent_is_recorded_once_and_told_to_go_on_once_when_the_limit_is_lifted_and_its_next_hook_is_answered(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    story.hook("s-1", EDIT)
    halted = story.row(Agent, story.agent.id)
    story.hook("s-1", EDIT)
    story.expect_rows(halted.halted_at is not None, halted.activity is AgentActivity.HALTED, story.row(Agent, story.agent.id).version == halted.version)
    story.expect_success("usage-limit delete 1", actor=story.user)
    UsageLimitMarker()(story.container)
    UsageLimitMarker()(story.container)
    story.expect_rows(story.row(Agent, story.agent.id).halted_at is None, lockdown_ended_line_count(story, story.agent.id) == 1, story.hook("s-1", EDIT).halt == "")


def test_an_agent_that_sent_no_hook_during_the_limit_gets_no_go_on_line_when_it_ends(new_story):
    story = lockdown_story(new_story)
    report(story, 55)
    UsageLimitMarker()(story.container)
    story.expect_rows(story.row(Agent, story.agent.id).usage_limit_ends_at is not None, story.row(Agent, story.agent.id).halted_at is None)
    story.expect_success("usage-limit delete 1", actor=story.user)
    UsageLimitMarker()(story.container)
    story.expect_rows(story.row(Agent, story.agent.id).usage_limit_ends_at is None, lockdown_ended_line_count(story, story.agent.id) == 0)


def test_with_the_plan_window_used_up_the_stop_line_names_no_limit_to_delete_and_deleting_the_persons_limit_keeps_the_agent_stopped(new_story):
    story = lockdown_story(new_story)
    report(story, 100)
    story.expect_rows(LIFT not in story.hook("s-1", EDIT).halt)
    story.expect_success("usage-limit delete 1", actor=story.user)
    UsageLimitMarker()(story.container)
    reply = story.hook("s-1", EDIT)
    story.expect_rows(reply.halt.startswith(STOP_LINE), LIFT not in reply.halt, story.row(Agent, story.agent.id).halted_at is not None, lockdown_ended_line_count(story, story.agent.id) == 0)


def test_a_stopped_helper_is_not_ended_for_silence_or_its_job_minutes_and_the_stopped_time_is_left_out_of_its_job(new_story):
    story = lockdown_story(new_story, fixture=LimitedStartedHelper)
    helper = helper_agent(story)
    report(story, 55)
    story.expect_rows(story.hook(helper.session, EDIT).halt.startswith(STOP_LINE))
    story.advance(STOPPED_TIME)
    bus = story.container.get(Bus)
    bus.run(EndSilentHelpers(), Actor.core())
    bus.run(EndHelpersPastLimits(), Actor.core())
    story.expect_rows(story.row(Agent, helper.id).ended_at is None, story.row(Agent, helper.id).halted_at is not None)
    story.expect_success("usage-limit delete 1", actor=story.user)
    UsageLimitMarker()(story.container)
    bus.run(EndSilentHelpers(), Actor.core())
    job = read_jobs(story, helper)[0]
    story.expect_rows(story.row(Agent, helper.id).ended_at is None, job.halted_seconds >= STOPPED_TIME.total_seconds(), lockdown_ended_line_count(story, helper.id) == 1, detail=str(job.halted_seconds))


def test_the_usage_read_names_the_stopped_program_with_its_end_its_limit_and_the_count_of_stopped_agents(new_story):
    story = lockdown_story(new_story)
    story.expect_rows(json.loads(story.run("usage show --json --environment main").output_text)["lockdowns"] == [])
    report(story, 55)
    story.hook("s-1", EDIT)
    lockdowns = json.loads(story.run("usage show --json --environment main").output_text)["lockdowns"]
    story.expect_rows(len(lockdowns) == 1, detail=str(lockdowns))
    story.expect_rows(lockdowns[0]["program"] == "claude", lockdowns[0]["limit_id"] == 1, lockdowns[0]["halted_count"] == 1, lockdowns[0]["reason"].startswith("Claude is at your usage limit until"), detail=str(lockdowns))
