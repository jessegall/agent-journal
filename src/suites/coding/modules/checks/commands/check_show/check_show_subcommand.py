from argparse import ArgumentParser, Namespace
from typing import cast

from core.base.caller.caller import Caller
from core.base.cli.row_links import RowLinks
from core.base.library.library_lookup import LibraryLookup
from core.base.library.library_aware_show import LibraryAwareShow
from core.base.library.library_reading import LibraryReading
from core.base.library.library_ref import LibraryRef
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from suites.coding.modules.checks.models.check import Check

class CheckShowSubcommand(LibraryAwareShow[Check], ReadSubcommand[Check | LibraryReading]):
    """`journal check show <n or library:n>`: a check of this journal in full, or one of the team's library read
    live, with its command."""

    share = "check"
    cli_name = "check"
    name = "show"

    def __init__(self, queries: Queries, links: RowLinks, lookup: LibraryLookup) -> None:
        self.queries, self.links, self.lookup = queries, links, lookup

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=LibraryRef.row_id)

    def local(self, arguments: Namespace, caller: Caller) -> Check:
        return self.queries.query(Check).find(arguments.id)

    def write_output(self, value: Check | LibraryReading, output: Output) -> None:
        if isinstance(value, LibraryReading):
            self.write_library(value, output)
            return
        self.write_check(cast(Check, value), output)

    def write_check(self, check: Check, output: Output) -> None:
        values = {**output.values(check), "state": check.state}
        output.write("\n".join(f"{column}: {shown}" for column, shown in values.items() if shown not in (None, {}, "")), values)
        if not output.json_output:
            for line in self.links.lines(check.model_name, check.id):
                output.line(line)

    @staticmethod
    def write_library(fetched: LibraryReading, output: Output) -> None:
        item = fetched.item
        if output.json_output:
            output.write("", item.json())
            return
        schedule = f"every {item.fields.get('interval_minutes')} min" if item.fields.get("interval_minutes") else "by hand"
        output.line(f"From the team's library, version {item.version}, changed by {item.author}; it is not a check of this journal.")
        output.line(f"library check {item.item_id}: {item.fields.get('title', '')} ({schedule})")
        output.line(f"command: {item.fields.get('command', '')}")
        output.line(f"brief: {item.fields.get('brief', '')}")
