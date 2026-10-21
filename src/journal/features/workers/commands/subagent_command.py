from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.repositories.subagents import Subagents
from journal.support.caller import Caller


class SubagentCommand(Command):
    noun = "subagent"

    def __init__(self, subagents: Subagents) -> None:
        self.subagents = subagents

    def arguments(self, verbs) -> None:
        retire = self.verb(verbs, "retire", "let a subagent go: it no longer counts among the subagents running and is not offered the next job")
        retire.add_argument("n", type=int)

    def retire(self, args: Namespace, caller: Caller) -> int:
        subagent = self.subagents.find(args.n)
        self.subagents.save(subagent.retired(datetime.now(timezone.utc).timestamp()), caller.actor)
        print(f"subagent {subagent.id}, {subagent.agent_type}, {subagent.task}, is retired; it no longer counts among the subagents running")
        return 0
