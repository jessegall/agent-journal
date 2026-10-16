from argparse import Namespace

from journal.engine.machine import Machine
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.models.rule import Rule
from journal.repositories.rules import Rules
from journal.repositories.scope import Scope


class RuleCommand(MemoryCommand):
    """A rule binds the whole project, so it has no environment."""

    noun = "rule"
    scoped = False

    def __init__(self, rules: Rules, machine: Machine, scope: Scope) -> None:
        super().__init__(machine, scope)
        self.repository = rules

    def new(self, args: Namespace) -> Rule:
        return Rule(text=args.text, reason=args.reason, keywords=self.keywords(args))
