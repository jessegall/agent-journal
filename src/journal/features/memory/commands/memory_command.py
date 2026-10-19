from argparse import Namespace
from typing import ClassVar

from journal.console.command import Command
from journal.support.where import Where
from journal.engine.machine import Machine
from journal.repositories.agents import Agents
from journal.repositories.repository import Repository
from journal.support.scope import Scope


class MemoryCommand(Command):
    """What fact, rule and reminder share: create, list, strike, and lifting a hold at a mark when the agent records one."""

    scoped: ClassVar[bool] = True
    repository: Repository

    def __init__(self, machine: Machine, scope: Scope, agents: Agents) -> None:
        self.machine, self.scope, self.agents = machine, scope, agents

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", f"record a {self.noun}")
        create.add_argument("text")
        create.add_argument("--reason", default="")
        create.add_argument("--keywords", default="", help="words that bring it back when you write one, comma-separated")
        self.verb(verbs, "list", f"every {self.noun} here")
        self.verb(verbs, "strike", f"a {self.noun} that no longer holds").add_argument("n", type=int)

    def create(self, args: Namespace, where: Where) -> int:
        row = self.repository.save(self.new(args), where.actor)
        self.decided(where)
        print(f"{self.noun} {row.id}: {row.text}")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        rows = self.repository.in_() if self.scoped else self.repository.all()
        for row in rows:
            print(f"{row.id:>4}  {row.text}")
        return 0

    def strike(self, args: Namespace, where: Where) -> int:
        self.repository.delete(self.repository.find(args.n), where.actor)
        print(f"{self.noun} {args.n} struck")
        return 0

    def new(self, args: Namespace):
        return self.repository.model(text=args.text, keywords=self.keywords(args))

    @staticmethod
    def keywords(args: Namespace) -> tuple[str, ...]:
        return tuple(word.strip().lower() for word in args.keywords.split(",") if word.strip())

    def decided(self, where: Where) -> None:
        """An agent held at a mark has decided: the mark owed is paid."""
        if not where.session:
            return
        self.agents.touch(self.machine.agent(where.session, self.scope.id), where.actor, mark_owed=0)
