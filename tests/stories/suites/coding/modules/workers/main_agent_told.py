from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.commands.record_worker_report.record_worker_report import RecordWorkerReport
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES, SHORT_PROOF_SOURCE
from suites.coding.modules.workers.support.worker_nudges import PROOF_WAITS
from tests.stories.core.modules.messages.delivery import KeptTyping
from tests.stories.core.support.coding_fixtures import BuilderStarted


def story_with_worker(new_story, typing=None):
    story = new_story(fixture=BuilderStarted)
    if typing is not None:
        story.container.bind(TerminalTyping, typing)
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    return story, worker


def report(story, worker) -> None:
    story.container.get(Bus).run(RecordWorkerReport(worker.id, 1, story.agent.id, "Handed in"), worker, environment_id=1)
    story.run_listeners()


def test_a_workers_report_is_typed_to_an_idle_main_agent(new_story):
    typing = KeptTyping()
    story, worker = story_with_worker(new_story, typing)
    story.advance(timedelta(minutes=5))
    report(story, worker)
    assert any("reports in message" in line for _, line in typing.typed), typing.typed


def test_a_workers_report_says_it_wakes_the_main_agent_and_stays_visible(new_story):
    story, worker = story_with_worker(new_story)
    report(story, worker)
    line = next(story.container.get(Queries).query(AgentLine).filter(agent_id=story.agent.id).newest().all_rows())
    assert line.wakes_agent and "reports in message" in line.text


def test_the_line_of_a_proof_with_no_test_names_the_check_and_wakes_the_main_agent():
    line = PROOF_WAITS.nudge(worker=7, proofs="3 4").text
    assert "journal proof check 3 4" in line and "journal proof short" in line and PROOF_WAITS.wakes_agent


def test_a_proof_sent_back_starts_an_ended_worker_again():
    assert SHORT_PROOF_SOURCE in RESUMING_SOURCES
