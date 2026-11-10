from engine.subcommand.read_subcommand import ReadSubcommand
from engine.bookkeeping.event_show_subcommand import EventShowSubcommand
from engine.bookkeeping.event_keys_subcommand import EventKeysSubcommand
from engine.bookkeeping.event_list_subcommand import EventListSubcommand
from engine.bookkeeping.refusal_show_subcommand import RefusalShowSubcommand
from engine.bookkeeping.refusal_list_subcommand import RefusalListSubcommand


BOOKKEEPING_SUBCOMMANDS: dict[str, type[ReadSubcommand[object]]] = {
    f"{subcommand.cli_name} {subcommand.name}": subcommand
    for subcommand in (EventShowSubcommand, EventListSubcommand, EventKeysSubcommand, RefusalShowSubcommand, RefusalListSubcommand)
}
