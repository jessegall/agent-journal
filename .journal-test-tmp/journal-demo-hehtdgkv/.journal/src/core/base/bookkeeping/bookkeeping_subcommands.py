from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.bookkeeping.event_show_subcommand import EventShowSubcommand
from core.base.bookkeeping.event_list_subcommand import EventListSubcommand
from core.base.bookkeeping.refusal_show_subcommand import RefusalShowSubcommand
from core.base.bookkeeping.refusal_list_subcommand import RefusalListSubcommand


BOOKKEEPING_SUBCOMMANDS: dict[str, type[ReadSubcommand[object]]] = {
    f"{subcommand.cli_name} {subcommand.name}": subcommand
    for subcommand in (EventShowSubcommand, EventListSubcommand, RefusalShowSubcommand, RefusalListSubcommand)
}
