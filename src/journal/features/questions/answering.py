from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.features.questions.states.waiting import Waiting
from journal.models.actor import Actor
from journal.models.question import Question
from journal.repositories.agents import Agents
from journal.repositories.questions import Questions
from journal.supervisor_link import SupervisorLink


class Answering:
    """The one place a question is answered, from the command or the viewer: the row keeps the answer, every agent waiting on it goes back to its work and is told how to read it, and the chat shows a card."""

    def __init__(self, questions: Questions, agents: Agents, machine: Machine, supervisor: SupervisorLink, cards: Cards) -> None:
        self.questions, self.agents, self.machine, self.supervisor, self.cards = questions, agents, machine, supervisor, cards

    def answer(self, question: Question, text: str, by: Actor) -> Question:
        from journal.features.questions.feature import Questions as QuestionsFeature
        answered = self.questions.save(question.answered(text), by)
        for agent in self.agents.in_state(Waiting.name):
            state = self.machine.states.named(agent.state, agent.data)
            if state.question_id != answered.id:
                continue
            self.machine.move(agent.session, agent.environment_id, state.back().to)
            self.supervisor.type(answered.environment_id, QuestionsFeature.ANSWERED.about(n=answered.id).rendered())
        self.cards.show(answered.environment_id, "", f"You answered question {answered.id}", "question", "good", answered.answer, f"question:{answered.id}")
        return answered
