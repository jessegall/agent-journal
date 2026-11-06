import json
import shlex
import pytest
from datetime import timedelta

from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.documents.support.trail_fixtures import ApprovedTrailPlan, StartedTrailPlan, Trail, feature, pending, viewer_answer


@pytest.fixture
def approved_trail(new_story):
    return Trail(new_story(fixture=ApprovedTrailPlan))


@pytest.fixture
def trail(new_story):
    return Trail(new_story(fixture=StartedTrailPlan))


class PlanContextAcknowledged(StoryFixture):
    parent = StartedTrailPlan

    def steps(self, story):
        Trail(story).context("plan")
        story.hook("s-1", HookSamples.tick())


@pytest.fixture
def acknowledged_trail(new_story):
    return Trail(new_story(fixture=PlanContextAcknowledged))


@pending(6851)
@pytest.mark.parametrize("started_by", ["viewer", "agent"])
def test_started_plan_delivers_context_after_viewer_or_cli_start(approved_trail, started_by):
    trail = approved_trail
    if started_by == "viewer":
        trail.person("viewer.shell", "plan", "start", "1")
    else:
        trail.command("plan start 1")
    lines = "\n".join(trail.tick().lines)
    feature("plan context 1" in lines, lines)
    feature("Original cart request" not in lines, "journal notice quoted user prose")


@pending(6851)
def test_a_plan_without_tasks_still_delivers_context(trail):
    feature("plan context 1" in "\n".join(trail.tick().lines), "zero-task plan had no context pointer")


@pending(6851)
def test_plan_edits_do_not_redeliver_start_context(acknowledged_trail):
    trail = acknowledged_trail
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
def test_new_start_episode_delivers_new_context(acknowledged_trail):
    trail = acknowledged_trail
    trail.story.advance(timedelta(seconds=1))
    trail.person("viewer.shell", "plan", "block", "1", "--reason", "Wait for approval")
    trail.person("viewer.shell", "plan", "unblock", "1")
    feature("plan context 1" in "\n".join(trail.tick().lines), "new executable episode did not deliver context")


@pending(6851)
def test_plan_context_excludes_other_environments(trail, tmp_path):
    folder = tmp_path / "side"
    folder.mkdir()
    trail.story.expect_success(f"environment make side {shlex.quote(str(folder))}")
    trail.story.expect_success("agent start side-main claude main --environment side")
    answer = viewer_answer(trail.story, "messages.chat", ["message", "send", "Private side request"], environment="side")
    assert answer.code == 0, answer.error
    page = trail.context("plan")
    feature("messages" in page and "Private side request" not in json.dumps(page), json.dumps(page))


@pending(6851)
def test_plan_start_pointer_is_read_before_work(trail):
    trail.tick()
    trail.story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "journal plan context 1")
    before = trail.source_rows(trail.story.agent.id)
    trail.context("plan")
    feature(before == trail.source_rows(trail.story.agent.id), "plan context changed the source")
    trail.story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    feature("plan context 1" not in "\n".join(trail.tick().lines), "acknowledged start was delivered again")


@pending(6851)
def test_first_task_overview_inherits_plan_context(approved_trail):
    trail = approved_trail
    trail.command('phase make --plan 1 "Cart phase" --goal "Check the result"')
    trail.command('phase place 1 --phase 1')
    trail.person("viewer.shell", "plan", "comment", "1", "Keep the approved cart scope")
    trail.command("plan start 1")
    outcome = trail.command("task overview 1")
    feature("Keep the approved cart scope" in outcome.output_text, outcome.output_text)
