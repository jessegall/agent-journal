from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.agents.support.report_nudges import EMPTY_REPORT_TEXT, SHORT_REPORT_CHARACTERS
from core.modules.messages.models.message import Message
from core.modules.drivers.ticks.silent_helper_ending import SilentHelperEnding
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, StartedHelper, jobs_of, the_helper
from tests.stories.core.modules.helpers.read_only_access import StartedCodexHelper

PROGRAMS = [StartedHelper, StartedCodexHelper]
LINES = "agent-line list --agent {agent}"


def stop_with_report(text):
    stop = HookSamples.stop()
    return stop.with_raw({**stop.body["raw"], "last_assistant_message": text})


def reported(new_story, helper_fixture, text):
    story = new_story(fixture=helper_fixture)
    story.hook(the_helper(story).session, stop_with_report(text))
    return story


def report_of(story):
    return story.container.get(Queries).query(Message).filter(session_agent_id=the_helper(story).id).first()


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_short_report_arrives_inside_the_parents_line(new_story, helper_fixture):
    story = reported(new_story, helper_fixture, "The cart adds tax twice.")
    story.expect_text(LINES.format(agent=story.agent.id), f"helper:{the_helper(story).id} reports", "The cart adds tax twice.")


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_long_report_gives_the_parent_its_message_number(new_story, helper_fixture):
    story = reported(new_story, helper_fixture, "x" * (SHORT_REPORT_CHARACTERS + 1))
    story.expect_text(LINES.format(agent=story.agent.id), f"journal message read {report_of(story).id}")


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_helper_that_says_nothing_still_reports(new_story, helper_fixture):
    story = reported(new_story, helper_fixture, "")
    story.expect_text(LINES.format(agent=story.agent.id), EMPTY_REPORT_TEXT)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_report_ends_the_job_and_stays_out_of_the_chat(new_story, helper_fixture):
    story = reported(new_story, helper_fixture, "The cart adds tax twice.")
    message, job = report_of(story), jobs_of(story, the_helper(story))[0]
    story.expect_rows(message.is_chat_visible is False, job.report_message_id == message.id, job.returned == "The cart adds tax twice.", job.ended_at is not None)
    story.expect_text("chat-mark list --environment 1", "Finished journal-researcher")


def test_a_report_to_a_parent_that_ended_for_good_goes_to_the_running_main_agent(new_story):
    story = new_story(fixture=StartedHelper)
    second = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    story.run(f"agent end {story.agent.id}", actor=story.user)
    story.hook(the_helper(story).session, stop_with_report("The cart adds tax twice."))
    story.expect_text(LINES.format(agent=second.id), "The cart adds tax twice.")


def test_a_resumed_helper_reports_its_next_job_the_same_way(new_story):
    story = new_story(fixture=EndedHelper)
    story.expect_success(f'helper send {the_helper(story).id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    story.hook(the_helper(story).session, stop_with_report("The listener side is fine."))
    jobs = jobs_of(story, the_helper(story))
    story.expect_rows(len(jobs) == 2, jobs[1].returned == "The listener side is fine.")


def test_a_stop_with_no_open_job_reports_nothing(new_story):
    story = new_story(fixture=EndedHelper)
    story.hook(the_helper(story).session, stop_with_report("Nothing to add."))
    story.expect_no_text(LINES.format(agent=story.agent.id), "Nothing to add.")


def exited(story, code, terminal=""):
    helper = the_helper(story)
    path = story.home.terminal_file(helper.id)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(terminal)
    story.expect_success(f"agent exited {helper.id} {code}")
    story.run_listeners()


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("code, terminal, reason", [(1, "API Error: 429 rate limit reached", "it hit a rate limit"), (1, "Please run /login", "its login expired"),
                                                    (1, "unknown model gpt-9", "its model is not known"), (137, "", "its program exited with code 137")],
                         ids=["rate limit", "login", "model", "killed"])
def test_a_program_that_exits_with_no_report_tells_the_parent_why(new_story, helper_fixture, code, terminal, reason):
    story = new_story(fixture=helper_fixture)
    exited(story, code, terminal)
    story.expect_text(LINES.format(agent=story.agent.id), reason)
    story.expect_rows(the_helper(story).ended_at is not None, jobs_of(story, the_helper(story))[0].ended_at is not None)


def test_a_program_that_exits_after_its_report_only_ends_its_row(new_story):
    story = reported(new_story, StartedHelper, "The cart adds tax twice.")
    exited(story, 0)
    story.expect_rows(the_helper(story).ended_at is not None)
    story.expect_no_text(LINES.format(agent=story.agent.id), "without a report")


def test_a_main_agents_exit_leaves_its_row(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent exited {story.agent.id} 0")
    story.expect_text(f"agent show {story.agent.id}", "role: main")


def test_a_helper_that_ends_with_its_job_open_tells_the_parent(new_story):
    story = new_story(fixture=EndedHelper)
    story.expect_text(LINES.format(agent=story.agent.id), EMPTY_REPORT_TEXT)


def test_a_silent_helper_ends_with_no_agent_to_carry_the_tick(new_story):
    story = new_story(fixture=StartedHelper)
    story.advance(timedelta(minutes=31))
    SilentHelperEnding()(story.container)
    story.run_listeners()
    story.expect_rows(the_helper(story).ended_at is not None)


def test_a_paused_parent_keeps_its_helpers_job_open_and_takes_it_back_on_resume(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent end {the_helper(story).id}", actor=story.user)
    story.run_listeners()
    story.expect_rows(jobs_of(story, the_helper(story))[0].ended_at is None)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    story.run_listeners()
    launcher.thread.join(timeout=5)
    story.expect_rows(len(launcher.requests) == 1)


def test_a_new_main_agent_takes_over_a_running_helper_and_its_report(new_story):
    story = new_story(fixture=StartedHelper)
    story.run(f"agent end {story.agent.id}", actor=story.user)
    second = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    story.expect_rows(the_helper(story).parent_id == second.id)
    story.hook(the_helper(story).session, stop_with_report("The cart adds tax twice."))
    story.expect_text(LINES.format(agent=second.id), "The cart adds tax twice.")


def test_a_new_main_agent_takes_the_report_lines_left_on_the_ended_one(new_story):
    story = reported(new_story, StartedHelper, "The cart adds tax twice.")
    story.run(f"agent end {story.agent.id}", actor=story.user)
    second = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    story.expect_text(LINES.format(agent=second.id), "The cart adds tax twice.")
    story.expect_text("message reports --environment main", f"message:{report_of(story).id}", actor=second)


def test_a_helper_stopped_as_its_launch_ended_tells_the_parent_so(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent exited {the_helper(story).id} 143 --launch-ended")
    story.run_listeners()
    story.expect_text(LINES.format(agent=story.agent.id), "the journal launch that ran it ended")
