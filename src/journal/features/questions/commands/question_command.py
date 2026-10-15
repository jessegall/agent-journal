from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.features.questions.states.waiting import Waiting
from journal.models.question import Question
from journal.repositories.agents import Agents
from journal.repositories.environments import Environments
from journal.repositories.questions import Questions
from journal.supervisor_link import SupervisorLink


class QuestionCommand(Command):
    noun = "question"

    def __init__(self, questions: Questions, agents: Agents, environments: Environments, machine: Machine, supervisor: SupervisorLink, cards: Cards) -> None:
        self.questions, self.agents, self.environments, self.machine, self.supervisor, self.cards = questions, agents, environments, machine, supervisor, cards

    def arguments(self, verbs) -> None:
        ask = self.verb(verbs, "ask", "ask the user something and wait")
        ask.add_argument("text")
        ask.add_argument("--options", default="", help="comma-separated choices")
        answer = self.verb(verbs, "answer", "answer a question")
        answer.add_argument("n", type=int)
        answer.add_argument("answer")
        self.verb(verbs, "list", "every open question here")

    def ask(self, args: Namespace, where: Where) -> int:
        environment = self.environments.named(where.environment).id
        options = tuple(o.strip() for o in args.options.split(",") if o.strip())
        question = self.questions.save(Question(environment_id=environment, text=args.text, options=options), where.actor)
        if where.session:
            agent = self.machine.agent(where.session, environment)
            self.machine.move(where.session, environment, Waiting.leaving(self.machine.states.named(agent.state, agent.data), question_id=question.id))
        print(f"question {question.id} asked; waiting for the answer")
        return 0

    def answer(self, args: Namespace, where: Where) -> int:
        from journal.features.questions.feature import Questions as QuestionsFeature
        question = self.questions.save(self.questions.find(args.n).answered(args.answer), where.actor)
        for agent in self.agents.in_state(Waiting.name):
            state = self.machine.states.named(agent.state, agent.data)
            if state.question_id != question.id:
                continue
            self.machine.move(agent.session, agent.environment_id, state.back().to)
            self.supervisor.type(question.environment_id, QuestionsFeature.ANSWERED.about(n=question.id, answer=question.answer).rendered())
        self.cards.show(question.environment_id, "", f"You answered question {question.id}", "question", "good", question.answer, f"question:{question.id}")
        print(f"question {question.id} answered: {question.answer}")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for question in self.questions.open(self.environments.named(where.environment).id):
            choices = f"  [{' / '.join(question.options)}]" if question.options else ""
            print(f"{question.id:>4}  {question.text}{choices}")
        return 0
