from argparse import Namespace

from journal.engine.machine import Machine
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.models.rule import Rule
from journal.repositories.environments import Environments
from journal.repositories.rules import Rules


class RuleCommand(MemoryCommand):
    """A rule binds the whole project, so it has no environment."""

    noun = "rule"
    scoped = False

    def __init__(self, rules: Rules, environments: Environments, machine: Machine) -> None:
        super().__init__(environments, machine)
        self.repository = rules

    def new(self, args: Namespace, environment_id: int) -> Rule:
        return Rule(text=args.text, reason=args.reason, keywords=self.keywords(args))
