from argparse import Namespace
from datetime import datetime, timezone
from typing import ClassVar

from journal.console.command import Command
from journal.features.memory.support.memory_context import MemoryContext
from journal.support.caller import Caller
from journal.engine.state_machine import StateMachine
from journal.repositories.agents import Agents
from journal.repositories.repository import Repository
from journal.support.scope import Scope


class MemoryCommand(Command):
    """What fact, rule and reminder share: create, list, read, strike, and lifting a hold at a mark when the agent records one."""

    scoped: ClassVar[bool] = True
    repository: Repository

    def __init__(self, machine: StateMachine, scope: Scope, agents: Agents, context: MemoryContext) -> None:
        self.machine, self.scope, self.agents, self.context = machine, scope, agents, context

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", f"record a {self.noun}")
        create.add_argument("text")
        create.add_argument("--reason", default="")
        create.add_argument("--keywords", default="", help="words that bring it back when you write one, comma-separated")
        self.verb(verbs, "list", f"every {self.noun} here")
        self.verb(verbs, "read", f"a {self.noun} whole, which puts it in your context window").add_argument("n", type=int)
        self.verb(verbs, "strike", f"a {self.noun} that no longer holds").add_argument("n", type=int)

    def create(self, args: Namespace, caller: Caller) -> int:
        row = self.repository.save(self.carrying(self.new(args), caller), caller.actor)
        self.decided(caller)
        print(f"{self.noun} {row.id}: {row.text}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        rows = self.repository.in_() if self.scoped else self.repository.all()
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

    def carrying(self, row, caller: Caller):
        return row

    def new(self, args: Namespace):
        return self.repository.model(text=args.text, keywords=self.keywords(args))

    @staticmethod
    def keywords(args: Namespace) -> tuple[str, ...]:
        return tuple(word.strip().lower() for word in args.keywords.split(",") if word.strip())

    def decided(self, caller: Caller) -> None:
        if not caller.session:
            return
        agent = self.machine.agent(caller.session, self.scope.id)
        if agent.mark_owed:
            self.agents.save(agent.context_decided(datetime.now(timezone.utc).timestamp()), caller.actor)
