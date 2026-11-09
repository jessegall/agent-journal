from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.judge_worker_test.judge_worker_test import JudgeWorkerTest
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


class JudgeWorkerTestSubcommand(Subcommand[JudgeWorkerTest, WorkerTestRequest]):
    """`journal merger allow <request> [--refuse "<why>"]`: the merger decides a request to run one test."""

    cli_name = "merger"
    name = "allow"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request", type=int)
        parser.add_argument("--refuse")

    def command(self, arguments: Namespace, caller: Caller) -> JudgeWorkerTest:
        return JudgeWorkerTest(arguments.request, arguments.refuse)
