import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.agents.support.report_nudges import EMPTY_REPORT_TEXT, SHORT_REPORT_CHARACTERS
from core.modules.messages.models.message import Message
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
