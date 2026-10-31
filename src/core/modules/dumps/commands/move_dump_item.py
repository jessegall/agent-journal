from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.dumps.commands.support.dump_line import DumpLine


@dataclass(frozen=True)
class MoveDumpItem(Command[DumpLine]):
    """Notes an item of a dump, or files it with the rows it became, or fails it with the reason; the dump closes
    when every item is filed or failed."""

    dump_id: int
    item: str
    action: str
    text: str
    refs: tuple[str, ...] = ()
