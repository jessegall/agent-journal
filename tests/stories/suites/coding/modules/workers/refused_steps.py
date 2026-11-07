from datetime import timedelta

import pytest

from core.modules.plugins.support.plugin_step_check import PluginStepCheck
from core.testing.hook_samples import HookSamples
from tests.stories.suites.coding.modules.workers.report import OrchestratorWithMergerOff
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.support.story_checks import expect_count_output_2

REASON = "[plugin sample] the checks need a fix"


@pytest.fixture
def working_story(new_story):
    story = new_story(fixture=OrchestratorWithMergerOff)
    repository_environment(story)
    worker = dispatched_worker(story)
    return story, worker


@pytest.mark.parametrize("step", ["worker next --differences none", "worker deliver --differences none"])
def test_a_worker_refused_by_a_plugin_five_times_is_named_to_the_main_agent(working_story, monkeypatch, step):
    story, worker = working_story
    monkeypatch.setattr(PluginStepCheck, "refusal", lambda *_args, **_kwargs: REASON)
    for _ in range(4):
        story.expect_refusal(step, REASON, actor=worker)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "refused")
    story.expect_refusal(step, REASON, actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id} --json", f"worker:{worker.id} refused 5 times on task:1: journal worker status {worker.id}")
    story.expect_refusal(step, REASON, actor=worker)
    expect_count_output_2(story, f"agent-line list --agent {story.agent.id}", "refused 5 times", 1)
    story.advance(timedelta(minutes=10))
    story.expect_refusal(step, REASON, actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "refused 7 times")


def test_a_worker_refused_its_stop_five_times_is_named_to_the_main_agent(working_story):
    story, worker = working_story
    session = worker_session(story, worker)
    for _ in range(5):
        story.expect_hook_refusal(session, HookSamples.stop(), "journal worker next")
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} refused 5 times on task:1", f"journal worker status {worker.id}")


def test_a_single_refusal_tells_the_main_agent_nothing(working_story):
    story, worker = working_story
    story.expect_hook_refusal(worker_session(story, worker), HookSamples.stop(), "journal worker next")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "refused")


def test_an_allowed_stop_clears_the_refusal_count(working_story):
    story, worker = working_story
    session = worker_session(story, worker)
    for _ in range(4):
        story.expect_hook_refusal(session, HookSamples.stop(), "journal worker next")
    story.expect_success('wait stuck "the build tool is missing"', actor=worker)
    story.expect_hook_allowed(session, HookSamples.stop())
    story.expect_success("wait end 1", actor=worker)
    for _ in range(4):
        story.expect_hook_refusal(session, HookSamples.stop(), "journal worker next")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "refused")
    story.expect_hook_refusal(session, HookSamples.stop(), "journal worker next")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "refused 5 times")
