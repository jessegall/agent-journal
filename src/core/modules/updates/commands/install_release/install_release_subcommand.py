from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.updates.commands.install_release.install_release import InstallRelease
from core.modules.updates.models.release import Release


class InstallReleaseSubcommand(Subcommand[InstallRelease, Release]):
    """`journal update install`: the newest release put into .journal/src, which the journal runs from its next
    request."""

    cli_name = "update"
    name = "install"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> InstallRelease:
        return InstallRelease()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Release):
            tag = f" {value.tag}" if value.tag else ""
            output.line(f"the newest release{tag} is installed in .journal/src: the journal runs it from its next request")
