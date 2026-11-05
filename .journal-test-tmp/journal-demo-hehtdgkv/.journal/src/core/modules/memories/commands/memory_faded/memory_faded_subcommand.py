from argparse import ArgumentParser, Namespace

from core.base.subcommand.page_arguments import page_arguments
from core.base.environment_names import EnvironmentNames
from core.base.page import Page
from core.base.query.queries import Queries
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.memories.commands.support.faded_memory import FadedMemory
from core.modules.memories.models.memory import FADING_REMOVAL_REASON, LOWEST_WEIGHT, Memory
from core.modules.memories.models.enums.memory_state import MemoryState


class MemoryFadedSubcommand(ReadSubcommand[Page[FadedMemory]]):
    """Lists the environment's memories removed after fading to weight 0."""

    cli_name = "memory"
    name = "faded"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[FadedMemory]:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        page = self.queries.query(Memory).filter(environment_id=environment_id, weight=LOWEST_WEIGHT, state=MemoryState.REMOVED, reason=FADING_REMOVAL_REASON).page(arguments.page, arguments.limit)
        return Page(tuple(FadedMemory(memory.id, memory.text) for memory in page.rows), page.number, page.size, page.total)
