from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.allow_worker_test.allow_worker_test import AllowWorkerTest
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


class AllowWorkerTestSubcommand(Subcommand[AllowWorkerTest, WorkerTestRequest]):
    """`journal worker allow-test <request>`: the worker may run the test command of its request once."""

    cli_name = "worker"
    name = "allow-test"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AllowWorkerTest:
        return AllowWorkerTest(arguments.request)
