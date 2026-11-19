from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.updates.support.installed_releases import InstalledReleases
from core.modules.updates.models.release_install import ReleaseInstall
from core.modules.updates.support.release_source import ReleaseSource
from core.modules.updates.support.update_status import UpdateStatus


class UpdateCheckSubcommand(ReadSubcommand[UpdateStatus]):
    """`journal update check`: whether a newer release is out than the one this journal last installed."""

    cli_name = "update"
    name = "check"

    def __init__(self, source: ReleaseSource, queries: Queries, installed: InstalledReleases) -> None:
        self.source, self.queries, self.installed = source, queries, installed

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> UpdateStatus:
        installation = self.queries.query(ReleaseInstall).newest().first()
        return UpdateStatus(self.source.newest(), self.installed.installed(), installation)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, UpdateStatus):
            output.write(value.line, {"line": value.line, "tag": value.newest.tag, "is_current": value.is_current,
                                      "installation": {"step": value.installation.step.value, "detail": value.installation.detail} if value.installation else None})
