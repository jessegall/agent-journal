import json
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.library.library_lookup import LibraryLookup
from core.base.library.library_aware_show import LibraryAwareShow
from core.base.library.library_reading import LibraryReading
from core.base.library.library_ref import LibraryRef
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.support.sequence_guards import SequenceGuards
from core.modules.sequences.models.support.sequence_triggers import SequenceTriggers

class SequenceShowSubcommand(LibraryAwareShow, ReadSubcommand[Sequence | LibraryReading]):
    """`journal sequence show <n or library:n>`: its title, how it starts, and its steps in order; a sequence of this
    journal, or one of the team's library read live."""

    share = "sequence"
    cli_name = "sequence"
    name = "show"

    def __init__(self, queries: Queries, lookup: LibraryLookup) -> None:
        self.queries, self.lookup = queries, lookup

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=LibraryRef.row_id)

    def local(self, arguments: Namespace, caller: Caller) -> Sequence:
        return self.queries.query(Sequence).find(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LibraryReading):
            self.write_library(value, output)
        if isinstance(value, Sequence):
            self.write_local(value, output)

    @staticmethod
    def write_library(fetched: LibraryReading, output: Output) -> None:
        item = fetched.item
        if output.json_output:
            output.write("", item.json())
            return
        output.line(f"From the team's library, version {item.version}, changed by {item.author}; it is not a sequence of this journal.")
        output.line(f"library sequence {item.item_id}: {item.fields.get('title', '')}")
        for number, step in enumerate(json.loads(str(item.fields.get("steps", "[]"))), 1):
            output.line(f"{number}. {step}")

    @staticmethod
    def write_local(value: Sequence, output: Output) -> None:
        if output.json_output:
            output.row(value)
            return
        triggers = SequenceTriggers.parsed(value.triggers)
        output.line(f"sequence {value.id}: {value.title}, " + (f"starts on its own on {len(triggers)} triggers" if triggers else "starts by hand only"))
        for number, step in enumerate(value.steps, 1):
            checks = SequenceGuards.step_guard(value.step_guards, number).checks
            output.line(f"{number}. {step}" + (f" (checks that must pass: {', '.join(str(check) for check in checks)})" if checks else ""))
