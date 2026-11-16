from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.database.database import Database
from engine.repository.repository import Repository
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.expectations.expected_message import expected_agent_message
from core.modules.drivers.commands.run_agent_step.run_agent_step import RunAgentStep
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.tasks.agent_messages.stop_task_message import StopTaskMessage
from core.modules.tasks.models.task import Task
from suites.coding.support.coding_settings import KEEP_RUNNING_SETTING
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from tests.stories.support.story_checks import expect_value


def test_a_task_the_timed_step_round_hands_over_is_held_by_the_main_agent_whose_stop_is_then_refused(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_success("driver choose coding.main --environment main")
    story.expect_success(f"setting set {KEEP_RUNNING_SETTING} on --environment main")
    with story.container.get(Database).transaction():
        request = story.container.get(Repository).save(AgentStepRequest(session_agent_id=story.agent.id, causes=("tests.round",)),
                                                       Context(Actor.core(), story.clock.timestamp(), RunAgentStep(0)))
    story.container.get(Bus).run(RunAgentStep(request.id), Actor.core(), environment_id=1)
    expect_value(story.row(Task, 1).holder_id, story.agent.id)
    story.expect_hook_refusal("s-1", HookSamples.stop(), expected_agent_message(StopTaskMessage.declared(), task=1))
