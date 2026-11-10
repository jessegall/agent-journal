from argparse import ArgumentParser, Namespace
from engine.caller.caller import Caller
from engine.registry.event_key_entry import EventKeyEntry
from engine.registry.registry import Registry
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple

COLUMN_SPACES = "   "


class EventKeysSubcommand(ReadSubcommand[tuple[EventKeyEntry, ...]]):
    """`journal event keys [--grep <text>]`: every event a plugin can name, with the forms it offers, its
    name in the log and plain words for it, sorted by key."""

    cli_name, name = "event", "keys"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--grep", default="", help="keep the keys that contain this text")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[EventKeyEntry, ...]:
        return tuple(sorted((entry for entry in self.registry.event_keys.values() if arguments.grep in entry.key), key=lambda entry: entry.key))

    def write_output(self, value: object, output: Output) -> None:
        entries = [entry for entry in value if isinstance(entry, EventKeyEntry)] if is_tuple(value) else []
        text = "\n".join(COLUMN_SPACES.join((entry.key, " ".join(entry.forms), entry.event, entry.description)) for entry in entries) or "no event has that key"
        output.write(text, {"rows": [output.values(entry) for entry in entries]})
