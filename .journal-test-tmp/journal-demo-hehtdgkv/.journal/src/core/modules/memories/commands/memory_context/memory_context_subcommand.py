from argparse import ArgumentParser, Namespace

from core.base.subcommand.page_arguments import page_arguments
from core.base.page import Page
from core.base.query.queries import Queries
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.memories.models.context_memory import ContextMemory


class MemoryContextSubcommand(ReadSubcommand[Page[ContextMemory]]):
    """`journal memory context`: the memories you were given since your last compaction, and why."""

    cli_name = "memory"
    name = "context"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[ContextMemory]:
        return self.queries.query(ContextMemory).filter(agent_id=caller.actor.id).page(arguments.page, arguments.limit)
