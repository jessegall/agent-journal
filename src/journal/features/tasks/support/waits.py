from argparse import ArgumentParser

from journal.support.actor import Actor
from journal.models.check import Check
from journal.models.support.ref import Ref
from journal.support.rejection import Rejection
from journal.repositories.checks import Checks
from journal.repositories.questions import Questions
from journal.repositories.tasks import Tasks


class Waits:
    """What a blocked task or plan waits on, as the command line names it: a question or task by --on, a command by --until; each a row the wait links to, and opens it once settled."""

    def __init__(self, tasks: Tasks, questions: Questions, checks: Checks) -> None:
        self.tasks, self.questions, self.checks = tasks, questions, checks

    @staticmethod
    def arguments(parser: ArgumentParser, subject: str) -> None:
        parser.add_argument("--on", action="append", default=[], metavar="question:N|task:N", help=f"a question or task it waits on; the {subject} is open again when that is answered or closed; to wait on the user, ask a question and name it here")
        parser.add_argument("--until", default="", metavar="COMMAND", help=f"a shell command that passes once the wait is over, such as a check that a pull request is merged; run every --every minutes, it opens the {subject} when it passes")
        parser.add_argument("--every", type=int, default=2, help="minutes between two runs of the --until command")

    @staticmethod
    def refuse_unnamed(reason: str, enabled: list[str], deadline: str) -> None:
        if not reason and not enabled and not deadline:
            raise Rejection("say what it waits on: --on question:N or --on task:N, --until \"<command>\", or a reason in words")

    def created(self, enabled: list[str], deadline: str, all_items: int, topic: str, actor: Actor) -> list[Ref]:
        refs = [self.wait_targets(text) for text in enabled]
        if deadline:
            refs.append(Ref.build(self.checks.save(Check(title=f"{topic} waits until this passes", command=deadline, interval=all_items, wait_target=True), actor)))
        return refs

    def wait_targets(self, text: str) -> Ref:
        kind, _, number = text.partition(":")
        if kind not in ("question", "task") or not number.isdigit():
            raise Rejection(f"--on takes question:N or task:N, not {text}")
        ref = Ref(f"{kind}s", int(number))
        (self.questions if kind == "question" else self.tasks).find(ref.id)
        return ref
