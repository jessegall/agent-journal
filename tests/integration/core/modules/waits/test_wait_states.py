from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.row_reference import RowReference
from engine.query.queries import Queries
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.questions.models.question import Question as QuestionRow
from core.modules.waits.states.wait_states import WaitStates
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

QUESTION_COMMAND = 'question ask "Which database?" --context "The store needs one database for its orders." --options "sqlite" "postgres" --recommend "sqlite"'


def open_question(story) -> int:
    answer = story.run(QUESTION_COMMAND, actor=story.agent)
    assert answer.code == 0, answer.output_text
    return story.container.get(Queries).query(QuestionRow).filter(session_agent_id=story.agent.id).newest().first().id


def waiting(story) -> list[Waiting]:
    agent = story.container.get(AgentRows).find(story.agent.id)
    states = story.container.get(WaitStates).states([AgentReference(agent.id, agent.parent_id, agent.environment_id, agent.role)], Question.none())
    return [required_state.state for required_state in states.get(agent.id, ())]


def test_a_question_the_agent_asks_is_a_wait_on_that_question_with_its_step_requested_in_the_same_write(played):
    story = played(BuilderStarted)
    story.hook("s-1", HookSamples.session_start())
    question_id = open_question(story)
    assert [state.subjects for state in waiting(story)] == [(RowReference("questions", question_id),)]
    requests = story.container.get(Queries).query(AgentStepRequest).filter(session_agent_id=story.agent.id, served_at=None).first()
    assert requests is not None and "waits.wait-step" in requests.causes


def test_an_answered_question_leaves_no_wait(played):
    story = played(BuilderStarted)
    question_id = open_question(story)
    story.expect_success(f"question answer {question_id} --answer sqlite", actor=story.user)
    assert waiting(story) == []
