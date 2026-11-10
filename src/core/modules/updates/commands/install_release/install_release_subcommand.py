from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.updates.commands.install_release.install_release import InstallRelease
from core.modules.updates.models.release_install import ReleaseInstall
from core.modules.updates.models.enums.update_step import UpdateStep


class InstallReleaseSubcommand(Subcommand[InstallRelease, ReleaseInstall]):
    """`journal update install`: the newest release copied beside the running code, which a new server takes
    over from the running one."""

    cli_name = "update"
    name = "install"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> InstallRelease:
        return InstallRelease()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ReleaseInstall):
            tag = f" {value.tag}" if value.tag else ""
            output.line(f"the newest release{tag} is installed" if value.step is UpdateStep.FINISHED else f"installation started{tag}: journal update check shows progress")
