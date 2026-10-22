from argparse import Namespace

from journal.console.command import Command
from journal.features.memory.support.threshold_decisions import ThresholdDecisions
from journal.features.memory.support.memory_context import MemoryContext
from journal.support.caller import Caller
from journal.repositories.repository import Repository


class MemoryCommand(Command):
    """What fact, rule and reminder share: create, list, read, strike, and lifting a hold at a mark when the agent records one."""

    repository: Repository

    def __init__(self, decisions: ThresholdDecisions, context: MemoryContext) -> None:
        self.decisions, self.context = decisions, context

    def arguments(self, verbs) -> None:
        creation = self.verb(verbs, "create", f"record a {self.noun}")
        creation.add_argument("text")
        creation.add_argument("--reason", default="")
        creation.add_argument("--keywords", default="", help="words that bring it back when you write one, comma-separated")
        self.verb(verbs, "list", f"every {self.noun} here")
        self.verb(verbs, "read", f"a {self.noun} whole, which puts it in your context window").add_argument("n", type=int)
        self.verb(verbs, "strike", f"a {self.noun} that no longer holds").add_argument("n", type=int)

    def create(self, args: Namespace, caller: Caller) -> int:
        row = self.repository.save(self.with_keywords(self.new(args), caller), caller.actor)
        self.decisions.decided(caller)
        print(f"{self.noun} {row.id}: {row.text}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        rows = self.repository.all()
        for row in rows:
            print(f"{row.id:>4}  {row.text}")
        return 0

    def read(self, args: Namespace, caller: Caller) -> int:
        row = self.context.admit(self.repository.find(args.n), caller.actor)
        print(f"{self.noun} {row.id}: {row.text}")
        return 0

    def strike(self, args: Namespace, caller: Caller) -> int:
        self.repository.delete(self.repository.find(args.n), caller.actor)
        print(f"{self.noun} {args.n} struck")
        return 0

    def with_keywords(self, row, caller: Caller):
        return row

    def new(self, args: Namespace):
        return self.repository.model(text=args.text, keywords=self.keywords(args))

    @staticmethod
    def keywords(args: Namespace) -> tuple[str, ...]:
        return tuple(word.strip().lower() for word in args.keywords.split(",") if word.strip())
