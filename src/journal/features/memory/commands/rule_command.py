from argparse import Namespace

from journal.support.actor_kind import ActorKind
from journal.support.caller import Caller

from journal.engine.state_machine import StateMachine
from journal.repositories.agents import Agents
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.models.rule import Rule
from journal.repositories.rules import Rules
from journal.support.scope import Scope


class RuleCommand(MemoryCommand):
    """A rule binds the whole project, so it has no environment."""

    noun = "rule"
    scoped = False

    def __init__(self, rules: Rules, machine: StateMachine, scope: Scope, agents: Agents) -> None:
        super().__init__(machine, scope, agents)
        self.repository = rules

    def carrying(self, row: Rule, caller: Caller) -> Rule:
        return row.made(caller.actor.kind == ActorKind.AGENT)

    def new(self, args: Namespace) -> Rule:
        return Rule(text=args.text, reason=args.reason, keywords=self.keywords(args))
