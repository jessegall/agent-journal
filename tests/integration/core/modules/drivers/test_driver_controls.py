from engine.actor.actor import Actor
from tests.stories.core.support.coding_fixtures import BuilderStarted


def output(story, line, actor=None):
    return story.run(line, actor=actor or story.user).output_text.strip()


def test_a_new_driver_shows_its_contract_and_its_compiled_table(played):
    story = played(BuilderStarted)
    text = output(story, "driver table coding.worker")
    assert "coding.worker (worker, coding, digest" in text and "work stop: refuse-while-work-remains" in text


def test_an_unknown_driver_is_refused_with_the_drivers_there_are(played):
    story = played(BuilderStarted)
    assert "the drivers are coding.main, coding.merger, coding.worker, core.helper, core.main" in output(story, "driver table coding.robot")


def test_an_agent_with_no_stack_says_its_first_step_writes_it(played):
    story = played(BuilderStarted)
    assert f"agent {story.agent.id} has no stack yet" in output(story, f"driver stack {story.agent.id}")


def test_no_part_of_the_new_driver_can_go_live_before_its_phase_gate(played):
    story = played(BuilderStarted)
    assert "has not passed its phase's gate" in output(story, "driver set-active blocked.unknown on")
    assert "no part of the new driver is active" in output(story, "driver active")


def test_the_main_agent_switches_a_ready_part_but_may_not_pop_a_frame_or_repin(played):
    story = played(BuilderStarted)
    agent: Actor = story.agent
    assert "safety" in output(story, "driver set-active safety on", agent)
    assert "only a person removes a frame" in output(story, f"driver pop {agent.id} task:1 --reason test", agent)
    assert "only a person repins an agent" in output(story, f"driver repin {agent.id}", agent)


def test_nothing_is_stuck_or_escalated_on_a_fresh_journal(played):
    story = played(BuilderStarted)
    assert (output(story, "driver attention"), output(story, "escalation list")) == ("no agent waits for anyone's attention", "no escalation is open")
