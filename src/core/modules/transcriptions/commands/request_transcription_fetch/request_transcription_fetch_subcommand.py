from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.models.task import Task
from core.modules.transcriptions.commands.request_transcription_fetch.request_transcription_fetch import RequestTranscriptionFetch


class RequestTranscriptionFetchSubcommand(Subcommand[RequestTranscriptionFetch, Task]):
    """`journal transcription fetch <server> [--environment <name>]`: asks the main agent to bring in
    transcriptions."""

    cli_name = "transcription"
    name = "fetch"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("server")

    def command(self, arguments: Namespace, caller: Caller) -> RequestTranscriptionFetch:
        return RequestTranscriptionFetch(arguments.server)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Task):
            output.line(f"task {value.id}: {value.title}")
