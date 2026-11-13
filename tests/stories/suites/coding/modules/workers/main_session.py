from tests.stories.core.support.agent_labels import agent_number
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
import pytest
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.support.worker_nudges import PROOF_CHECK
from tests.stories.suites.coding.modules.workers.report import REPORT, MergerOffOrchestrator, stop_with_text
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, repository_environment, worker_session
from core.modules.agents.support.report_nudges import PARENT_REPORT
from suites.coding.modules.workers.support.worker_nudges import WORKER_COMMENT_COPY
from engine.testing.expectations.said_nudge import said


@pytest.fixture
def delivered_story(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    return story, worker


@pytest.fixture
def replacement(delivered_story):
    story, worker = delivered_story
    story.expect_success(f"agent end {story.agent.id}", actor=story.agent)
    main = Actor(story.new_row_id("agent start s-new claude main --environment main"), ActorType.AGENT)
    return story, worker, main


@pytest.fixture
def started_replacement(replacement):
    story, _, _ = replacement
    story.hook("s-new", HookSamples.session_start())
    return replacement


def test_a_new_main_session_hears_a_workers_report(replacement):
    story, worker, main = replacement
    story.expect_hook_allowed(worker_session(story, worker), stop_with_text(REPORT))
    story.expect_text(f"agent-line list --agent {main.id}", said(PARENT_REPORT))


def test_a_new_main_session_is_held_for_a_delivered_workers_proof(started_replacement):
    story, worker, _ = started_replacement
    notice = PROOF_CHECK.nudge(worker=agent_number(story, worker.id), task=1, proofs="1").text
    story.expect_hook_refusal("s-new", HookSamples.stop(), notice)


def test_a_new_main_session_hears_a_comment_sent_to_its_worker(replacement):
    story, worker, main = replacement
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success('task comment 1 "use the new cart" --environment main', actor=user)
    story.expect_text(f"agent-line list --agent {main.id}", said(WORKER_COMMENT_COPY))


def test_a_main_session_in_another_environment_does_not_take_over_a_worker(delivered_story):
    story, worker = delivered_story
    story.expect_success('environment make side "Side project"')
    story.expect_success("agent start s-side claude main --environment side")
    story.expect_text(f"agent show {agent_number(story, worker.id)}", f"parent_id: {story.agent.id}")


def test_a_new_helper_session_does_not_take_over_a_worker(delivered_story):
    story, worker = delivered_story
    story.expect_success(f"agent start s-helper claude helper --parent {story.agent.id} --environment main")
    story.expect_text(f"agent show {agent_number(story, worker.id)}", f"parent_id: {story.agent.id}")
