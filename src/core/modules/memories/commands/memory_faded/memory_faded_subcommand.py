from argparse import ArgumentParser, Namespace

from engine.subcommand.page_arguments import page_arguments
from engine.row.page import Page
from engine.query.queries import Queries
from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.memories.commands.support.faded_memory import FadedMemory
from core.modules.memories.models.memory import FADING_REMOVAL_REASON, LOWEST_WEIGHT, Memory
from core.modules.memories.models.enums.memory_state import MemoryState


class MemoryFadedSubcommand(ReadSubcommand[Page[FadedMemory]]):
    """Lists the environment's memories removed after fading to weight 0."""

    cli_name = "memory"
    name = "faded"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[FadedMemory]:
        page = self.queries.query(Memory).with_removed().filter(weight=LOWEST_WEIGHT, state=MemoryState.REMOVED, reason=FADING_REMOVAL_REASON).page(arguments.page, arguments.limit)
        return Page(tuple(FadedMemory(memory.id, memory.text) for memory in page.rows), page.number, page.size, page.total)
