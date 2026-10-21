from datetime import datetime, timezone
from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.questions.support.answering import Answering
from journal.models.question import Question
from journal.support.ref import Ref
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.questions import Questions
from journal.support.refused import Refused
from journal.repositories.workers import Workers


class QuestionCommand(Command):
    noun = "question"

    def __init__(self, questions: Questions, answering: Answering, messages: Messages, links: Links, workers: Workers) -> None:
        self.questions, self.answering, self.messages, self.links, self.workers = questions, answering, messages, links, workers

    def arguments(self, verbs) -> None:
        ask = self.verb(verbs, "ask", "ask the user something and wait")
        ask.add_argument("text")
        ask.add_argument("--options", nargs="+", default=[], help="the choices, each quoted on its own: --options \"first\" \"second\"")
        answer = self.verb(verbs, "answer", "answer a question")
        answer.add_argument("n", type=int)
        answer.add_argument("answer")
        self.verb(verbs, "list", "every open question here")
        self.verb(verbs, "show", "a question whole: its words, its choices, the answer and the messages linked to it").add_argument("n", type=int)

    def ask(self, args: Namespace, caller: Caller) -> int:
        if not caller.session or self.workers.by_session(caller.session):
            raise Refused("nobody can answer a question asked from here: put it in the worker's report instead")
        options = tuple(o.strip() for o in args.options if o.strip())
        if len(options) == 1 and "," in options[0]:
            raise Refused(f"one option holding a comma: give each choice as its own quoted argument, --options \"first\" \"second\", so a comma inside a choice stays in it")
        asked = Question(text=args.text, options=options)
        if asked.unclear_options():
            raise Refused(f"an option says who acts by name, the agent or the user, never I, we or you: {'; '.join(asked.unclear_options())}")
        question = self.questions.save(self.questions.save(asked, caller.actor).asked(datetime.now(timezone.utc).timestamp()), caller.actor)
        print(f"question {question.id} asked; waiting for the answer")
        for i, option in enumerate(question.options, 1):
            print(f"  {i}. {option}")
        return 0

    def answer(self, args: Namespace, caller: Caller) -> int:
        question = self.answering.answer(self.questions.find(args.n), args.answer, caller.actor)
        print(f"question {question.id} answered: {question.answer}")
        return 0

    def show(self, args: Namespace, caller: Caller) -> int:
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

    def list(self, args: Namespace, caller: Caller) -> int:
        for question in self.questions.open():
            choices = f"  [{' / '.join(question.options)}]" if question.options else ""
            print(f"{question.id:>4}  {question.text}{choices}")
        return 0
