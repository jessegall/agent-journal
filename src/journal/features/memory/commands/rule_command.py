from argparse import Namespace

from journal.support.actor_kind import ActorKind
from journal.support.caller import Caller

from journal.engine.support.session_agents import SessionAgents
from journal.repositories.agents import Agents
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.features.memory.support.memory_context import MemoryContext
from journal.models.rule import Rule
from journal.repositories.rules import Rules
from journal.repositories.scope import Scope


class RuleCommand(MemoryCommand):
    """A rule binds the whole project, so it has no environment."""

    scoped = False
    noun = "rule"

    def __init__(self, rules: Rules, sessions: SessionAgents, scope: Scope, agents: Agents, context: MemoryContext) -> None:
        super().__init__(sessions, scope, agents, context)
        self.repository = rules

    def with_keywords(self, row: Rule, caller: Caller) -> Rule:
        return row.created(caller.actor.kind == ActorKind.AGENT)

    def new(self, args: Namespace) -> Rule:
        return Rule(text=args.text, reason=args.reason, keywords=self.keywords(args))
