from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

import pytest

from core.modules.plugins.support.plugin_step_check import PluginStepCheck
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.support.story_checks import expect_count_output_2
from suites.coding.modules.workers.support.worker_nudges import WORKER_REFUSED
from engine.testing.expectations.expected_nudge import expected_nudge

REASON = "[plugin sample] the checks need a fix"


@pytest.fixture
def working_story(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    return story, worker


def test_a_worker_refused_by_a_plugin_five_times_is_named_to_the_main_agent(working_story, monkeypatch):
    story, worker = working_story
    step = "worker commit --differences none"
    monkeypatch.setattr(PluginStepCheck, "refusal", lambda *_args, **_kwargs: REASON)
    for _ in range(4):
        story.expect_refusal(step, REASON, actor=worker)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "refused")
    story.expect_refusal(step, REASON, actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id} --json", expected_nudge(WORKER_REFUSED))
    story.expect_refusal(step, REASON, actor=worker)
    expect_count_output_2(story, f"agent-line list --agent {story.agent.id}", "hit 5 refusals", 1)
    story.advance(timedelta(minutes=10))
    story.expect_refusal(step, REASON, actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "hit 7 refusals")


def test_an_allowed_stop_clears_the_refusal_count(working_story):
    story, worker = working_story
    session = worker_session(story, worker)
    for _ in range(4):
        story.expect_hook_refusal(session, HookSamples.stop(), "Task 1 is not finished")
    story.expect_success('wait stuck "the build tool is missing"', actor=worker)
    story.expect_hook_allowed(session, HookSamples.stop())
    story.expect_success("wait end 1", actor=worker)
    for _ in range(4):
        story.expect_hook_refusal(session, HookSamples.stop(), "Task 1 is not finished")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "refused")
    story.expect_hook_refusal(session, HookSamples.stop(), "Task 1 is not finished")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "hit 5 refusals")
