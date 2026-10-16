from journal.engine.machine import Machine
from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.features.questions.states.waiting import Waiting
from journal.models.question import Question
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class ReleaseWaiting(Listener[Updated]):
    """When a question is answered, every agent waiting on it goes back to its work and is told how to read the answer."""

    def __init__(self, machine: Machine, agents: Agents, supervisor: SupervisorLink) -> None:
        self.machine, self.agents, self.supervisor = machine, agents, supervisor

    def handle(self, event: Updated) -> None:
        from journal.features.questions.feature import Questions as QuestionsFeature
        question = event.model
        if not isinstance(question, Question) or question.answer is None or event.was.answer is not None:
            return
        for agent in self.agents.in_state(Waiting.name):
            state = self.machine.states.named(agent.state, agent.data)
            if state.question_id != question.id:
                continue
            self.machine.move(agent.session, agent.environment_id, state.back().to)
            self.supervisor.type(question.environment_id, QuestionsFeature.ANSWERED.about(n=question.id).rendered())
