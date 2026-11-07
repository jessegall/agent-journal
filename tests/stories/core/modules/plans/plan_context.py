import json
import shlex
import pytest
from datetime import timedelta

from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from core.base.driver.tool_type import ToolType
from core.base.driver.command_category import CommandCategory
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.documents.support.trail_fixtures import ApprovedTrailPlan, StartedTrailPlan, Scenario, feature, viewer_answer


@pytest.fixture
def approved_scenario(new_story):
    return Scenario(new_story(fixture=ApprovedTrailPlan))


@pytest.fixture
def scenario(new_story):
    return Scenario(new_story(fixture=StartedTrailPlan))


class PlanContextAcknowledged(StoryFixture):
    parent = StartedTrailPlan

    def steps(self, story):
        Scenario(story).context("plan")
        story.hook("s-1", HookSamples.tick())


@pytest.fixture
def acknowledged_scenario(new_story):
    return Scenario(new_story(fixture=PlanContextAcknowledged))


def delivered(scenario, session="s-1"):
    scenario.story.hook(session, HookSamples.tick())
    return scenario.story.hook(session, HookSamples.tool_use("Read", ToolType.READ, [], None))


@pytest.mark.parametrize("start_channel", ["viewer", "agent"])
def test_started_plan_delivers_context_after_viewer_or_cli_start(approved_scenario, start_channel):
    scenario = approved_scenario
    if start_channel == "viewer":
        scenario.person("viewer.shell", "plan", "start", "1")
    else:
        scenario.command("plan start 1")
    lines = "\n".join(delivered(scenario).lines)
    feature("plan 1 started" in lines, lines)
    feature("Original cart request" not in lines, "journal notice quoted user prose")


def test_a_plan_without_tasks_still_delivers_context(scenario):
    feature("plan 1 started" in "\n".join(delivered(scenario).lines), "zero-task plan had no context pointer")


def test_plan_edits_do_not_redeliver_start_context(acknowledged_scenario):
    scenario = acknowledged_scenario
    scenario.story.advance(timedelta(seconds=1))
    scenario.command('plan edit 1 --title "Renamed cart plan"')
    feature("plan 1 started" not in "\n".join(delivered(scenario).lines), "ordinary edit redelivered a start")


def test_replacement_main_reads_already_started_plan_context(scenario):
    scenario.story.advance(timedelta(seconds=1))
    scenario.story.hook("replacement", HookSamples.session_start())
    reply = delivered(scenario, "replacement")
    feature("plan 1 started" in "\n".join(reply.lines), "replacement main missed an earlier plan start")


def test_new_start_episode_delivers_new_context(acknowledged_scenario):
    scenario = acknowledged_scenario
    scenario.story.advance(timedelta(seconds=1))
    scenario.person("viewer.shell", "plan", "block", "1", "--reason", "Wait for approval")
    scenario.person("viewer.shell", "plan", "unblock", "1")
    feature("plan 1 started" in "\n".join(delivered(scenario).lines), "new executable episode did not deliver context")


def test_plan_context_excludes_other_environments(scenario, tmp_path):
    folder = tmp_path / "side"
    folder.mkdir()
    scenario.story.expect_success(f"environment make side {shlex.quote(str(folder))}")
    scenario.story.expect_success("agent start side-main claude main --environment side")
    answer = viewer_answer(scenario.story, "messages.chat", ["message", "send", "Private side request"], environment="side")
    scenario.story.expect_rows(answer.code == 0, detail=answer.error)
    page = scenario.context("plan")
    feature("messages" in page and "Private side request" not in json.dumps(page), json.dumps(page))


def test_plan_start_pointer_is_read_before_work(scenario):
    scenario.tick()
    scenario.story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "plan 1 started")
    initial_sources = scenario.source_rows(scenario.story.agent.id)
    scenario.context("plan")
    feature(initial_sources == scenario.source_rows(scenario.story.agent.id), "plan context changed the source")
    scenario.story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    feature("plan 1 started" not in "\n".join(delivered(scenario).lines), "acknowledged start was delivered again")


def test_first_task_overview_inherits_plan_context(approved_scenario):
    scenario = approved_scenario
    scenario.command('phase make --plan 1 "Cart phase" --goal "Check the result"')
    scenario.command('phase place 1 --phase 1')
    scenario.person("viewer.shell", "plan", "comment", "1", "Keep the approved cart scope")
    scenario.command("plan start 1")
    outcome = scenario.command("task overview 1")
    feature("Keep the approved cart scope" in outcome.output_text, outcome.output_text)


def test_redirecting_or_piping_plan_context_does_not_release_the_context_block(scenario):
    story = scenario.story
    scenario.tick()
    part = ShellPart("journal", CommandCategory.JOURNAL, ["plan", "context", "1"], subcommand="plan")
    story.expect_hook_refusal("s-1", HookSamples.shell("journal plan context 1 > /tmp/plan", part, redirects=["> /tmp/plan"]), "plan 1 started")
    piped = ShellPart("journal", CommandCategory.JOURNAL, ["plan", "context", "1"], subcommand="plan", pipe_target=1)
    reader = ShellPart("cat", CommandCategory.READ, [])
    story.expect_hook_refusal("s-1", HookSamples.shell("journal plan context 1 && cat", piped, reader), "run the read command directly, without a pipe or redirect")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "plan 1 started")
    scenario.context("plan")
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
