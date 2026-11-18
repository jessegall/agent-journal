from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.models.helper_steer import HelperSteer
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, read_jobs
from tests.stories.core.modules.helpers.helper_reports import helper_report, stop_with_report

"""A steer a parent sends a busy helper reaches it as text at its next tool call, holds its tools and its report
until it answers, and comes back to the parent with its answer in the report."""

STEER = "Compare the lifecycle hook shapes as well"
ANSWER = "I add a comparison of the hook shapes to section 3"


def read_tool():
    return HookSamples.tool_use("Read", ToolType.READ, [], None)


def steered(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f'helper send {helper_agent(story).id} "{STEER}" --steer', actor=story.agent)
    return story, helper_agent(story), story.first_row(HelperSteer)


def test_a_steer_reaches_the_helper_as_text_at_its_next_tool_call_and_holds_it_there(new_story):
    story, helper, steer = steered(new_story)
    reply = story.hook(helper.session, read_tool())
    story.expect_rows(any(STEER in line for line in reply.lines), f"helper-steer:{steer.id}" in reply.refusal, detail=reply)


def test_a_steered_helper_reports_only_after_it_answers_and_the_report_carries_the_answer(new_story):
    story, helper, steer = steered(new_story)
    refused = story.hook(helper.session, stop_with_report("The doc is saved."))
    story.run_listeners()
    story.expect_rows(f"helper-steer:{steer.id}" in refused.refusal, helper_report(story) is None, detail=refused)
    story.expect_success(f'helper answer-steer {steer.id} "{ANSWER}"', actor=Actor(helper.id, ActorType.AGENT))
    story.hook(helper.session, read_tool())
    story.hook(helper.session, stop_with_report("The doc is saved."))
    story.run_listeners()
    story.expect_text(f"message read {helper_report(story).id}", "The doc is saved.", STEER, ANSWER, actor=story.agent)


def test_only_the_steered_helper_answers_its_steer(new_story):
    story, _, steer = steered(new_story)
    story.expect_refusal(f'helper answer-steer {steer.id} "{ANSWER}"', "another helper's job", actor=story.agent)


def test_a_steer_to_a_helper_that_ends_before_its_next_hook_resumes_it(new_story):
    story, helper, _ = steered(new_story)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_success(f"agent end {helper.id}", actor=story.user)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(read_jobs(story, helper)[-1].ended_at is None, STEER in str(launcher.requests), detail=launcher.requests)
