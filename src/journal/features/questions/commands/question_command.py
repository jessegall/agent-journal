from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.questions.answering import Answering
from journal.features.questions.states.waiting import Waiting
from journal.models.question import Question
from journal.models.ref import Ref
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions


class QuestionCommand(Command):
    noun = "question"

    def __init__(self, questions: Questions, environments: Environments, machine: Machine, answering: Answering, messages: Messages, links: Links) -> None:
        self.questions, self.environments, self.machine, self.answering, self.messages, self.links = questions, environments, machine, answering, messages, links

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
        environment = self.environments.named(where.environment).id
        options = tuple(o.strip() for o in args.options.split(",") if o.strip())
        question = self.questions.save(Question(environment_id=environment, text=args.text, options=options), where.actor)
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
        if question.answer is not None:
            print("  act on the answer")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for question in self.questions.open(self.environments.named(where.environment).id):
            choices = f"  [{' / '.join(question.options)}]" if question.options else ""
            print(f"{question.id:>4}  {question.text}{choices}")
        return 0
