from argparse import Namespace

from journal.console.command import Command
from journal.support.where import Where
from journal.engine.machine import Machine
from journal.events.agent.awaited import Awaited
from journal.events.bus import Bus
from journal.features.tasks.states.expecting import Expecting
from journal.support.scope import Scope


class AwaitCommand(Command):
    """journal await "<what>": the agent waits for something outside its hands, a command, a run or a person, with or without a task in hand; working again lifts it."""

    noun = "await"
    default_verb = "now"

    def __init__(self, machine: Machine, scope: Scope, bus: Bus) -> None:
        self.machine, self.scope, self.bus = machine, scope, bus

    def arguments(self, verbs) -> None:
        self.verb(verbs, "now", "say what you wait for").add_argument("what")

    def now(self, args: Namespace, where: Where) -> int:
        environment = self.scope.id
        current = self.machine.agent(where.session, environment)
        self.machine.move(where.session, environment, Expecting.leaving(self.machine.states.named(current.state, current.data), what=args.what))
        self.bus.dispatch(Awaited(what=args.what).placed(where.session, environment, current.provider, None))
        print(f"waiting for {args.what}; working again lifts it")
        return 0
