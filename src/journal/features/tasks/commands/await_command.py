from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.tasks.states.expecting import Expecting
from journal.repositories.environments import Environments


class AwaitCommand(Command):
    """journal await "<what>": the agent waits for something outside its hands, a command, a run or a person, with or without a task in hand; working again lifts it."""

    noun = "await"
    default_verb = "now"

    def __init__(self, machine: Machine, environments: Environments) -> None:
        self.machine, self.environments = machine, environments

    def arguments(self, verbs) -> None:
        self.verb(verbs, "now", "say what you wait for").add_argument("what")

    def now(self, args: Namespace, where: Where) -> int:
        environment = self.environments.named(where.environment).id
        current = self.machine.agent(where.session, environment)
        self.machine.move(where.session, environment, Expecting.leaving(self.machine.states.named(current.state, current.data), what=args.what))
        print(f"waiting for {args.what}; working again lifts it")
        return 0
