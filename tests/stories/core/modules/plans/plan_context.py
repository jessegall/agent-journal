import json
import pytest
from datetime import timedelta

from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.documents.support.trail_fixtures import ApprovedTrailPlan, StartedTrailPlan, Trail, feature, pending, viewer_answer


@pytest.fixture
def approved_trail(new_story):
    return Trail(new_story(fixture=ApprovedTrailPlan))


@pytest.fixture
def trail(new_story):
    return Trail(new_story(fixture=StartedTrailPlan))


@pending(6851)
def test_started_plan_delivers_context_after_viewer_or_cli_start(approved_trail):
    trail = approved_trail
    trail.person("viewer.shell", "plan", "start", "1")
    lines = "\n".join(trail.tick().lines)
    feature("plan context 1" in lines, lines)
    feature("Original cart request" not in lines, "journal notice quoted user prose")


@pending(6851)
def test_a_plan_without_tasks_still_delivers_context(trail):
    feature("plan context 1" in "\n".join(trail.tick().lines), "zero-task plan had no context pointer")


@pending(6851)
def test_plan_edits_do_not_redeliver_start_context(trail):
    trail.context("plan")
    trail.tick()
    trail.story.advance(timedelta(seconds=1))
    trail.command('plan edit 1 --title "Renamed cart plan"')
    feature("plan context 1" not in "\n".join(trail.tick().lines), "ordinary edit redelivered a start")


@pending(6851)
def test_replacement_main_reads_already_started_plan_context(trail):
    trail.story.advance(timedelta(seconds=1))
    trail.story.hook("replacement", HookSamples.session_start())
    reply = trail.story.hook("replacement", HookSamples.tick())
    feature("plan context 1" in "\n".join(reply.lines), "replacement main missed an earlier plan start")


@pending(6851)
def test_new_start_episode_delivers_new_context(trail):
    trail.context("plan")
    trail.tick()
    trail.story.advance(timedelta(seconds=1))
    trail.person("viewer.shell", "plan", "block", "1", "--reason", "Wait for approval")
    trail.person("viewer.shell", "plan", "unblock", "1")
    feature("plan context 1" in "\n".join(trail.tick().lines), "new executable episode did not deliver context")


@pending(6851)
def test_plan_context_excludes_other_environments(trail):
    trail.story.expect_success("environment make side")
    trail.story.expect_success("agent start side-main claude main --environment side")
    answer = viewer_answer(trail.story, "messages.chat", ["message", "send", "Private side request"], environment="side")
    assert answer.code == 0, answer.error
    page = trail.context("plan")
    feature("messages" in page and "Private side request" not in json.dumps(page), json.dumps(page))
