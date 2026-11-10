from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.agents.support.report_nudges import EMPTY_REPORT_TEXT
from core.modules.messages.models.message import Message
from core.modules.drivers.ticks.end_silent_helpers_tick import EndSilentHelpersTick
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import resumable_session, EndedHelper, JOB, StartedHelper, read_jobs, helper_agent
from core.modules.helpers.support.helper_settings import HELPER_MAX_COST
from core.modules.helpers.ticks.helper_limits_tick import HelperLimitsTick
from tests.stories.core.modules.helpers.read_only_access import StartedCodexHelper
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.modules.documents.support.trail_fixtures import viewer

PROGRAMS = [StartedHelper, StartedCodexHelper]
LINES = "agent-line list --agent {agent}"


def stop_with_report(text):
    stop = HookSamples.stop()
    return stop.with_raw({**stop.body["raw"], "last_assistant_message": text})


class ReportedHelper(StoryFixture):
    parent = StartedHelper

    def steps(self, story):
        story.hook(helper_agent(story).session, stop_with_report("The total is wrong."))
        story.run_listeners()


class ReportedCodexHelper(ReportedHelper):
    parent = StartedCodexHelper


def reported(new_story, helper_fixture, text):
    story = new_story(fixture=helper_fixture)
    story.hook(helper_agent(story).session, stop_with_report(text))
    story.run_listeners()
    return story


def helper_report(story):
    return story.container.get(Queries).query(Message).filter(session_agent_id=helper_agent(story).id).first()


def test_the_agent_card_reads_reports_through_the_viewer(new_story):
    story = new_story(fixture=ReportedHelper)
    report = helper_report(story)
    story.expect_success(f"message read {report.id}", actor=story.agent)
    answer = viewer(story, "agents.agents", ["message", "agent-reports", "--agent", str(helper_agent(story).id)])
    story.expect_rows([row["id"] for row in answer["rows"]] == [report.id], answer["rows"][0]["text"] == "The total is wrong.")


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_long_report_gives_the_parent_its_message_number(new_story, helper_fixture):
    story = reported(new_story, helper_fixture, "x" * 2001)
    story.expect_text(LINES.format(agent=story.agent.id), f"reports in message:{helper_report(story).id}")


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_helper_that_says_nothing_still_reports(new_story, helper_fixture):
    story = reported(new_story, helper_fixture, "")
    story.expect_text(f"message read {helper_report(story).id}", EMPTY_REPORT_TEXT)
    story.expect_no_text(LINES.format(agent=story.agent.id), EMPTY_REPORT_TEXT)


@pytest.mark.parametrize("helper_fixture", [ReportedHelper, ReportedCodexHelper])
def test_a_report_ends_the_job_and_stays_out_of_the_chat(new_story, helper_fixture):
    story = new_story(fixture=helper_fixture)
    message, job = helper_report(story), read_jobs(story, helper_agent(story))[0]
    story.expect_rows(message.is_chat_visible is False, job.report_message_id == message.id, job.returned == "The total is wrong.", job.ended_at is not None)
    story.expect_text("chat-mark list --environment 1", f"Agent {helper_agent(story).id} reported back")


def test_a_report_to_a_parent_that_ended_for_good_goes_to_the_running_main_agent(new_story):
    story = new_story(fixture=StartedHelper)
    second = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    story.run(f"agent end {story.agent.id}", actor=story.user)
    story.hook(helper_agent(story).session, stop_with_report("The cart adds tax twice."))
    story.expect_text(LINES.format(agent=second.id), f"reports in message:{helper_report(story).id}")
    story.expect_text(f"message read {helper_report(story).id}", "The cart adds tax twice.", actor=second)


class ExitedHelper(StoryFixture):
    """A helper whose program exited with its job open and no report, leaving a terminal log."""

    parent = StartedHelper

    def steps(self, story):
        exited(story, 0, "some output")


def test_a_resumed_helper_reports_its_next_job_the_same_way(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    story.expect_success(f'helper send {helper_agent(story).id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    story.hook(helper_agent(story).session, HookSamples.session_start())
    story.hook(helper_agent(story).session, stop_with_report("The listener side is fine."))
    jobs = read_jobs(story, helper_agent(story))
    story.expect_rows(len(jobs) == 2, jobs[1].returned == "The listener side is fine.")


def test_two_jobs_in_a_row_that_end_without_a_report_both_close(new_story, monkeypatch):
    # merger helper 709 on 8 November: its program exited with job 411 unreported, and again at 03:30:55 with job 412,
    # whose report was held as a repeat of the first, so the job stayed open and no merger started again
    story = new_story(fixture=ExitedHelper)
    helper = helper_agent(story)
    story.expect_text(f"message read {helper_report(story).id}", "", actor=story.agent)
    resumable_session(story, helper, monkeypatch)
    story.expect_success(f'helper send {helper.id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    story.hook(helper.session, HookSamples.session_start())
    exited(story, 0)
    jobs = read_jobs(story, helper)
    story.expect_rows(len(jobs) == 2, all(job.ended_at is not None for job in jobs), jobs[0].returned == jobs[1].returned)


def test_a_stop_with_no_open_job_reports_nothing(new_story):
    story = new_story(fixture=EndedHelper)
    story.hook(helper_agent(story).session, stop_with_report("Nothing to add."))
    story.expect_no_text(LINES.format(agent=story.agent.id), "Nothing to add.")


def exited(story, code, terminal=""):
    helper = helper_agent(story)
    path = story.home.terminal_file(helper.id)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(terminal)
    story.expect_success(f"agent exited {helper.id} {code}")
    story.run_listeners()


@pytest.mark.parametrize("helper_fixture, code, terminal, reason", [(StartedHelper, 1, "API Error: 429 rate limit reached", "it hit a rate limit"), (StartedHelper, 2, "Please run /login", "its login expired"),
                                                                    (StartedCodexHelper, 3, "unknown model gpt-9", "its model is not known"), (StartedCodexHelper, 137, "", "its program exited with code 137")],
                         ids=["rate limit", "login", "model", "killed"])
def test_a_program_that_exits_with_no_report_tells_the_parent_why(new_story, helper_fixture, code, terminal, reason):
    story = new_story(fixture=helper_fixture)
    exited(story, code, terminal)
    story.expect_text(f"message read {helper_report(story).id}", reason)
    story.expect_rows(helper_agent(story).ended_at is not None, read_jobs(story, helper_agent(story))[0].ended_at is not None)


def test_a_program_that_exits_after_its_report_only_ends_its_row(new_story):
    story = reported(new_story, StartedHelper, "All read.")
    exited(story, 0)
    story.expect_rows(helper_agent(story).ended_at is not None)
    story.expect_no_text(LINES.format(agent=story.agent.id), "without a report")


def test_a_main_agents_exit_leaves_its_row(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent exited {story.agent.id} 0")
    story.expect_text(f"agent show {story.agent.id}", "role: main")


def test_a_helper_that_ends_with_its_job_open_tells_the_parent(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent end {helper_agent(story).id}", actor=Actor(helper_agent(story).id, ActorType.AGENT))
    story.run_listeners()
    story.expect_text(f"message read {helper_report(story).id}", EMPTY_REPORT_TEXT)
    story.expect_no_text(LINES.format(agent=story.agent.id), EMPTY_REPORT_TEXT)


def test_a_silent_helper_ends_with_no_agent_to_carry_the_tick(new_story):
    story = new_story(fixture=StartedHelper)
    story.advance(timedelta(minutes=31))
    EndSilentHelpersTick()(story.container)
    story.run_listeners()
    story.expect_rows(helper_agent(story).ended_at is not None)


def test_a_paused_parent_keeps_its_helpers_job_open_and_takes_it_back_on_resume(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
    story.run_listeners()
    story.expect_rows(read_jobs(story, helper_agent(story))[0].ended_at is None)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(len(launcher.requests) == 1)


def test_a_new_main_agent_takes_over_a_running_helper_and_its_report(new_story):
    story = new_story(fixture=StartedHelper)
    story.run(f"agent end {story.agent.id}", actor=story.user)
    second = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    story.expect_rows(helper_agent(story).parent_id == second.id)
    story.hook(helper_agent(story).session, stop_with_report("The cart adds tax twice."))
    story.expect_text(LINES.format(agent=second.id), f"reports in message:{helper_report(story).id}")
    story.expect_text(f"message read {helper_report(story).id}", "The cart adds tax twice.", actor=second)


def test_a_new_main_agent_takes_the_report_lines_left_on_the_ended_one(new_story):
    story = reported(new_story, StartedHelper, "Nothing left to read.")
    story.run(f"agent end {story.agent.id}", actor=story.user)
    second = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    story.expect_text(LINES.format(agent=second.id), f"reports in message:{helper_report(story).id}")
    story.expect_text("message reports --environment main", f"message:{helper_report(story).id}", actor=second)
    story.expect_text(f"message read {helper_report(story).id}", "Nothing left to read.", actor=second)


def test_a_helper_stopped_as_its_launch_ended_tells_the_parent_so(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent exited {helper_agent(story).id} 143 --launch-ended")
    story.run_listeners()
    story.expect_text(f"message read {helper_report(story).id}", "the journal launch that ran it ended")


def enforced(story, minutes):
    story.advance(timedelta(minutes=minutes))
    HelperLimitsTick()(story.container)
    story.run_listeners()


def test_a_helper_past_its_time_is_stopped_and_the_parent_hears_why(new_story):
    story = new_story(fixture=StartedHelper)
    enforced(story, 49)
    story.expect_text(LINES.format(agent=story.agent.id), "near its time limit")
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"stopped\n", request_count=2)
    enforced(story, 12)
    story.expect_text(f"message read {helper_report(story).id}", "stopped at its time limit")
    story.expect_rows(helper_agent(story).ended_at is not None, launcher.requests == [{"agent_id": helper_agent(story).id, "stop": True}])


def test_the_parent_is_warned_once(new_story):
    story = new_story(fixture=StartedHelper)
    enforced(story, 50)
    enforced(story, 2)
    lines = story.run(LINES.format(agent=story.agent.id)).output_text
    story.expect_rows(lines.count("near its time limit") == 1)


def test_a_helper_with_no_cost_is_held_by_time_alone(new_story):
    story = new_story(fixture=StartedCodexHelper)
    story.run(f"setting set {HELPER_MAX_COST} 7 --project", actor=story.user)
    enforced(story, 1)
    story.expect_rows(helper_agent(story).ended_at is None)


def test_a_retired_helpers_terminal_log_goes_with_it(new_story):
    story = new_story(fixture=ExitedHelper)
    story.expect_rows(not story.home.terminal_file(helper_agent(story).id).exists())


def test_a_helper_a_trigger_starts_reports_to_the_main_agent(new_story):
    story = new_story(fixture=UserBuilder)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.run('helper start journal-researcher --brief "Review HEAD~5..HEAD" --environment main', actor=Actor.core())
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows(helper_agent(story).parent_id == story.agent.id)
    story.hook(helper_agent(story).session, stop_with_report("The diff is clean."))
    story.expect_text(f"message read {helper_report(story).id}", "The diff is clean.")


def test_a_message_the_main_agent_sends_a_helper_is_not_among_the_main_agents_reports(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    delivered = story.new_row_id(f'message send "Look at the tax as well" --to agent:{helper.id} --environment main', actor=story.agent)
    story.expect_text("message reports --environment main", "no unread reports", actor=story.agent)
    story.expect_text("message reports --environment main", f"message:{delivered}", actor=Actor(helper.id, ActorType.AGENT))


def test_unread_reports_are_found_by_their_agent_and_their_words(new_story):
    story = new_story(fixture=ReportedHelper)
    report = helper_report(story)
    story.expect_text(f"message reports --agent {helper_agent(story).id} --environment main", f"message:{report.id}", actor=story.agent)
    story.expect_text(f"message reports --agent {story.agent.id} --environment main", "no unread reports", actor=story.agent)
    story.expect_text("message reports --search 'total wrong' --environment main", "The total is wrong.", actor=story.agent)
