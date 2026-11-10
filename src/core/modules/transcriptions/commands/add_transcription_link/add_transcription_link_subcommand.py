from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.models.link import Link
from core.modules.transcriptions.commands.add_transcription_link.add_transcription_link import AddTranscriptionLink


class AddTranscriptionLinkSubcommand(Subcommand[AddTranscriptionLink, Link]):
    """`journal transcription link <n> <model> <number>`: links a row made from a transcription, such as doc 3."""

    cli_name = "transcription"
    name = "link"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("transcription_id", type=int)
        parser.add_argument("target_model")
        parser.add_argument("target_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AddTranscriptionLink:
        return AddTranscriptionLink(arguments.transcription_id, arguments.target_model, arguments.target_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Link):
            output.line(f"linked {value.target_model} {value.target_id} to transcription {value.source_id}")
