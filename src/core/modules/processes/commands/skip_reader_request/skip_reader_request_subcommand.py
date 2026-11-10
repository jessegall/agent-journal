from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.skip_reader_request.skip_reader_request import SkipReaderRequest
from core.modules.processes.models.reader_request import ReaderRequest


class SkipReaderRequestSubcommand(Subcommand[SkipReaderRequest, ReaderRequest]):
    """Completes a reader request without a reader and records why."""

    cli_name = "reader-request"
    name = "waive"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request_id", type=int)
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> SkipReaderRequest:
        return SkipReaderRequest(arguments.request_id, arguments.reason)
