from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.updates.models.release import Release
from core.modules.updates.support.release_source import ReleaseSource
from core.modules.updates.support.update_standing import UpdateStanding


class UpdateCheckSubcommand(ReadSubcommand[UpdateStanding]):
    """`journal update check`: whether a newer release is out than the one this journal last installed."""

    cli_name = "update"
    name = "check"

    def __init__(self, source: ReleaseSource, queries: Queries) -> None:
        self.source, self.queries = source, queries

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> UpdateStanding:
        installed = self.queries.query(Release).newest().page(1, 1).rows
        return UpdateStanding(self.source.newest(), installed[0] if installed else None)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, UpdateStanding):
            output.write(value.line, {"line": value.line, "tag": value.newest.tag, "is_current": value.installed is not None and value.installed.checksum == value.newest.checksum})
