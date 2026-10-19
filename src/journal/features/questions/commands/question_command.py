from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.questions.answering import Answering
from journal.features.questions.states.waiting import Waiting
from journal.models.question import Question
from journal.support.ref import Ref
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.support.refused import Refused
from journal.support.scope import Scope
from journal.repositories.workers import Workers


class QuestionCommand(Command):
    noun = "question"

    def __init__(self, questions: Questions, machine: Machine, answering: Answering, messages: Messages, links: Links, scope: Scope, workers: Workers) -> None:
        self.questions, self.machine, self.answering, self.messages, self.links, self.scope, self.workers = questions, machine, answering, messages, links, scope, workers

    def arguments(self, verbs) -> None:
        ask = self.verb(verbs, "ask", "ask the user something and wait")
        ask.add_argument("text")
        ask.add_argument("--options", default="", help="comma-separated choices")
        answer = self.verb(verbs, "answer", "answer a question")
        answer.add_argument("n", type=int)
        answer.add_argument("answer")
        self.verb(verbs, "list", "every open question here")
        self.verb(verbs, "show", "a question whole: its words, its choices, the answer and the messages linked to it").add_argument("n", type=int)

    def ask(self, args: Namespace, where: Where) -> int:
        if not where.session or self.workers.by_session(where.session):
            raise Refused("nobody can answer a question asked from here: put it in the worker's report instead")
        environment = self.scope.id
        options = tuple(o.strip() for o in args.options.split(",") if o.strip())
        asked = Question(text=args.text, options=options)
        if asked.unclear_options():
            raise Refused(f"an option says who acts by name, the agent or the user, never I, we or you: {'; '.join(asked.unclear_options())}")
        question = self.questions.save(asked, where.actor)
        if where.session:
            agent = self.machine.agent(where.session, environment)
            self.machine.move(where.session, environment, Waiting.leaving(self.machine.states.named(agent.state, agent.data), question_id=question.id))
        print(f"question {question.id} asked; waiting for the answer")
        return 0

    def answer(self, args: Namespace, where: Where) -> int:
        question = self.answering.answer(self.questions.find(args.n), args.answer, where.actor)
        print(f"question {question.id} answered: {question.answer}")
        return 0

    def show(self, args: Namespace, where: Where) -> int:
        """The question reaches the agent here, whole: its words, its choices, the answer, and every message linked to it in full."""
        question = self.questions.find(args.n)
        choices = f"  [{' / '.join(question.options)}]" if question.options else ""
        print(f"question {question.id}: {question.text}{choices}")
        print(f"  answer: {question.answer}" if question.answer is not None else "  not answered yet")
        for link in self.links.of(question):
            other = link.target if link.source == Ref.to(question) else link.source
            if other.table == "messages":
                message = self.messages.find(other.id)
                print(f"  {link.kind} message {message.id} from the {message.author}: {message.text}")
            else:
                print(f"  {link.kind} {other}")
        if question.is_answered():
            print("  act on the answer")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for question in self.questions.open():
            choices = f"  [{' / '.join(question.options)}]" if question.options else ""
            print(f"{question.id:>4}  {question.text}{choices}")
        return 0
