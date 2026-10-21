from argparse import Namespace

from journal.support.actor_kind import ActorKind
from journal.support.caller import Caller

from journal.features.memory.commands.memory_command import MemoryCommand
from journal.features.memory.support.threshold_decisions import ThresholdDecisions
from journal.features.memory.support.memory_context import MemoryContext
from journal.models.rule import Rule
from journal.repositories.rules import Rules


class RuleCommand(MemoryCommand):
    """A rule binds the whole project, so it has no environment."""

    noun = "rule"

    def __init__(self, rules: Rules, decisions: ThresholdDecisions, context: MemoryContext) -> None:
        super().__init__(decisions, context)
        self.repository = rules

    def with_keywords(self, row: Rule, caller: Caller) -> Rule:
        return row.created(caller.actor.kind == ActorKind.AGENT)

    def new(self, args: Namespace) -> Rule:
        return Rule(text=args.text, reason=args.reason, keywords=self.keywords(args))
