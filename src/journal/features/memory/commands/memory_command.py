from argparse import Namespace
from typing import ClassVar

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.memory.states.at_mark import AtMark
from journal.repositories.environments import Environments
from journal.repositories.repository import Repository


class MemoryCommand(Command):
    """What fact, rule and reminder share: create, list, strike, and lifting a hold at a mark when the agent records one."""

    repository: Repository
    scoped: ClassVar[bool] = True

    def __init__(self, environments: Environments, machine: Machine) -> None:
        self.environments, self.machine = environments, machine

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", f"record a {self.noun}")
        create.add_argument("text")
        create.add_argument("--reason", default="")
        self.verb(verbs, "list", f"every {self.noun} here")
        self.verb(verbs, "strike", f"a {self.noun} that no longer holds").add_argument("n", type=int)

    def create(self, args: Namespace, where: Where) -> int:
        row = self.repository.save(self.new(args, self.environments.named(where.environment).id), where.actor)
        self.decided(where)
        print(f"{self.noun} {row.id}: {row.text}")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        rows = self.repository.in_(self.environments.named(where.environment).id) if self.scoped else self.repository.all()
        for row in rows:
            print(f"{row.id:>4}  {row.text}")
        return 0

    def strike(self, args: Namespace, where: Where) -> int:
        self.repository.delete(self.repository.find(args.n), where.actor)
        print(f"{self.noun} {args.n} struck")
        return 0

    def new(self, args: Namespace, environment_id: int):
        return self.repository.model(environment_id=environment_id, text=args.text)

    def decided(self, where: Where) -> None:
        """An agent held at a mark has decided; it goes back to what it was doing."""
        if not where.session:
            return
        agent = self.machine.agent(where.session, self.environments.named(where.environment).id)
        state = self.machine.states.named(agent.state, agent.data)
        if isinstance(state, AtMark):
            self.machine.move(where.session, agent.environment_id, state.back().to)
