from engine.command.bus import Bus
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.ticks.agent_minute_steps import MINUTE_STEP, AgentMinuteSteps
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.listeners.run_end_step_listener import RunEndStepListener
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted


def open_causes(story) -> list[tuple[str, ...]]:
    rows = story.container.get(Queries).query(AgentStepRequest).filter(session_agent_id=story.agent.id, served_at=None).every_row("one agent of one test")
    return [request.causes for request in rows]


def waiting_slice_on(story) -> None:
    story.hook("s-1", HookSamples.session_start())


def test_the_minute_step_asks_for_the_step_of_an_agent_the_waiting_slice_answers(played):
    story = played(BuilderStarted)
    waiting_slice_on(story)
    AgentMinuteSteps()(story.container)
    assert any(MINUTE_STEP in causes for causes in open_causes(story))


def test_a_run_that_ends_asks_for_the_step_of_the_agent_that_ran_it(played):
    story = install_runner(played(BuilderStarted))
    waiting_slice_on(story)
    process = start_process(story, "make test")
    story.container.get(Bus).run(EndProcess(process.id, 0, 0, 0), story.agent, environment_id=1)
    assert any(RunEndStepListener.name in causes for causes in open_causes(story))
