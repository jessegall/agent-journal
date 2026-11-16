from tests.stories.support.story_checks import expect_value

from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES, SHORT_PROOF_SOURCE
from suites.coding.modules.workers.agent_messages.proof_waits_message import ProofWaitsMessage
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value_with


def story_with_worker(new_story, typing=None):
    story = new_story(fixture=BuilderStarted)
    if typing is not None:
        story.replace(TerminalTyping, typing)
    worker = story.agent_actor(story.new_row_id(f"agent start s-9 claude worker --parent {story.agent.id} --environment main"))
    return story, worker


def report(story, worker) -> None:
    story.container.get(Bus).run(RecordParentReport(worker.id, story.agent.id, "Handed in"), worker, environment_id=1)
    story.run_listeners()


def expect_wakes_agent_proof(item) -> None:
    actual = item.wakes_agent
    assert actual, actual


def expect_terminal_line(text, typing) -> None:
    actual = any((text in line for _, line in typing.typed))
    assert actual, actual


def test_the_line_of_a_proof_with_no_test_names_the_check_and_wakes_the_main_agent():
    line = ProofWaitsMessage.declared().agent_message(worker=7, proofs="3 4").text
    expect_value_with(line, "proofs 3 4")
    expect_value_with(line, "waits on your check")
    expect_value(bool(ProofWaitsMessage.declared().wakes_agent), True)


def test_a_proof_sent_back_starts_an_ended_worker_again():
    expect_value_with(RESUMING_SOURCES, SHORT_PROOF_SOURCE)
