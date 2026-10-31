from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.demo.commands.demo_report import DemoReport
from core.modules.demo.commands.demo_report_writing import DemoReportWriting
from core.modules.demo.support.demo_scratch import DemoScratch


class DemoStartSubcommand(DemoReportWriting, ReadSubcommand[DemoReport]):
    """`journal demo start`: makes a scratch journal in a folder of its own, seeds the demo in it, runs a
    server on it and prints the link that logs you into its viewer."""

    cli_name = "demo"
    name = "start"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> DemoReport:
        session = DemoScratch().start()
        return DemoReport([f"the demo runs in {session.folder} (server pid {session.pid})", session.link, f"stop it with: kill {session.pid}"])
