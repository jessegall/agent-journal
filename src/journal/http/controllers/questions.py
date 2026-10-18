from journal.engine.machine import Machine
from journal.features.questions.states.waiting import Waiting
from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.question import Question
from journal.repositories.agents import Agents
from journal.repositories.not_found import NotFound
from journal.repositories.questions import Questions
from journal.supervisor_link import SupervisorLink


class QuestionController(Controller[Question]):
    def __init__(self, questions: Questions, agents: Agents, machine: Machine, supervisor: SupervisorLink) -> None:
        self.repository, self.agents, self.machine, self.supervisor = questions, agents, machine, supervisor

    def answer(self, request: Request) -> Response:
        from journal.features.questions.feature import Questions as QuestionsFeature
        try:
            question = self.repository.find(request.number("id"))
        except NotFound as missing:
            return Response.missing(missing)
        answered = self.repository.save(question.answered(request.body.get("answer", "")), request.actor)
        for agent in self.agents.in_state(Waiting.name):
            state = self.machine.states.named(agent.state, agent.data)
            if state.question_id == answered.id:
                self.machine.move(agent.session, agent.environment_id, state.back().to)
                self.supervisor.type(answered.environment_id, QuestionsFeature.ANSWERED.about(n=answered.id, answer=answered.answer).rendered())
        return Response.json(answered)
