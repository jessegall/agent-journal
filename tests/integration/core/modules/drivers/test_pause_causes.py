from engine.agent_machine.states.pause_fact import PauseFact
from engine.agent_machine.record.question import Question
from engine.agent_step.agent_view_reader import AgentViewReader
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.agent_messages.paused_refusal_message import PausedRefusalMessage
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent


def pause_fact(story, agent_id: int) -> PauseFact | None:
    view = story.container.get(AgentViewReader).read(agent_id, Question.none())
    return next((fact for fact in view.facts if isinstance(fact, PauseFact)), None)


def test_a_helper_paused_with_its_main_agent_holds_one_cause_for_each_in_todays_words(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    main = story.container.get(AgentRows).find(helper.parent_id)
    story.expect_success(f"agent pause {main.number}", actor=story.user)
    story.expect_success(f"agent pause {helper.number}", actor=story.user)
    pause = pause_fact(story, helper.id)
    assert pause is not None and {cause.paused_agent_id for cause in pause.causes} == {helper.id, main.id}
    assert pause.refusal_text == PausedRefusalMessage.declared().agent_message().text


def test_resuming_the_helper_leaves_the_cause_of_its_paused_main_agent(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    main = story.container.get(AgentRows).find(helper.parent_id)
    story.expect_success(f"agent pause {main.number}", actor=story.user)
    story.expect_success(f"agent pause {helper.number}", actor=story.user)
    story.expect_success(f"agent resume {helper.number}", actor=story.user)
    pause = pause_fact(story, helper.id)
    assert pause is not None and [cause.paused_agent_id for cause in pause.causes] == [main.id]
