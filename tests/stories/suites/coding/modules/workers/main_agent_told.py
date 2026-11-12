from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.query.queries import Queries
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES, SHORT_PROOF_SOURCE
from suites.coding.modules.workers.support.worker_nudges import PROOF_WAITS
from tests.stories.core.modules.messages.delivery import KeptTyping
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_outcome_with, expect_value_with

TEST_ROWS_REASON = "the test reads every row it checks"


def story_with_worker(new_story, typing=None):
    story = new_story(fixture=BuilderStarted)
    if typing is not None:
        story.container.bind(TerminalTyping, typing)
    worker = Actor(story.new_row_id(f"agent start s-9 claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)
    return story, worker


def report(story, worker) -> None:
    story.container.get(Bus).run(RecordParentReport(worker.id, story.agent.id, "Handed in"), worker, environment_id=1)
    story.run_listeners()


def test_a_workers_report_is_typed_to_an_idle_main_agent(new_story):
    typing = KeptTyping()
    story, worker = story_with_worker(new_story, typing)
    story.advance(timedelta(minutes=5))
    report(story, worker)
    expect_terminal_line("reports in message", typing)


def test_a_workers_report_says_it_wakes_the_main_agent_and_stays_visible(new_story):
    story, worker = story_with_worker(new_story)
    report(story, worker)
    line = next(story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).newest().every_row(TEST_ROWS_REASON))
    expect_wakes_agent_proof(line)
    expect_outcome_with(line, "reports in message")


def test_the_line_of_a_proof_with_no_test_names_the_check_and_wakes_the_main_agent():
    line = PROOF_WAITS.nudge(worker=7, proofs="3 4").text
    expect_value_with(line, "proofs 3 4")
    expect_value_with(line, "waits on your check")
    expect_wakes_agent_proof(PROOF_WAITS)


def test_a_proof_sent_back_starts_an_ended_worker_again():
    expect_value_with(RESUMING_SOURCES, SHORT_PROOF_SOURCE)


def expect_wakes_agent_proof(item) -> None:
    actual = item.wakes_agent
    assert actual, actual


def expect_terminal_line(text, typing) -> None:
    actual = any((text in line for _, line in typing.typed))
    assert actual, actual


def test_a_report_that_only_states_progress_is_refused_with_the_way_to_log_it(new_story):
    story, worker = story_with_worker(new_story)
    story.expect_refusal('worker report "tests queued, stopping"', "this is progress", actor=worker)
    story.expect_refusal('worker report "nothing left to do"', 'journal task log <n> "where it stands"', actor=worker)
