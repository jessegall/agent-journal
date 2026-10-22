from argparse import Namespace

from journal.console.command import Command
from journal.engine.state_machine import StateMachine
from journal.support.rejection import Rejection
from journal.repositories.scope import Scope
from journal.engine.states_catalogue import StatesCatalogue
from journal.support.caller import Caller

POP = "pop"
IDLE = "idle"


class PanicCommand(Command):
    """journal panic <state> [name=value ...]: the one hand on the stack from outside the engine, always allowed to the main agent and the user, never to a worker or a subagent. A state name pushes that state, pop pops the top, idle empties the stack to the bottom; the stack is printed after."""

    noun = "panic"
    default_verb = "apply"

    def __init__(self, machine: StateMachine, states: StatesCatalogue, scope: Scope) -> None:
        self.machine, self.states, self.scope = machine, states, scope

    def arguments(self, verbs) -> None:
        time = self.verb(verbs, "apply", "push a state by name, pop the top, or idle to empty the stack")
        time.add_argument("state")
        time.add_argument("values", nargs="*", help="the state's values as name=value")

    def apply(self, args: Namespace, caller: Caller) -> int:
        text = " ".join(["journal panic", args.state, *args.values])
        agent = self.changed(args, caller, text)
        print(f"the stack, bottom to top: {', '.join(state.state_text() for state in self.machine.states.stack(agent).states)}")
        return 0

    def changed(self, args: Namespace, caller: Caller, text: str):
        if args.state == POP:
            return self.machine.pop(caller.agent_session, self.scope.id, caller.actor, text)
        if args.state == IDLE:
            return self.machine.reset(caller.agent_session, self.scope.id, caller.actor, text)
        if not self.states.known(args.state):
            raise Rejection(f"no state is named {args.state}; the states are {', '.join(self.states.names())}")
        return self.machine.push(caller.agent_session, self.scope.id, self.states.restored(args.state, self.field_values(args.values)), caller.actor, text)

    @staticmethod
    def field_values(pairs: list[str]) -> dict:
        values = {}
        for pair in pairs:
            name, _, value = pair.partition("=")
            values[name] = int(value) if value.isdigit() else value
        return values
