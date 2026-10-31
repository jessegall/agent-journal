from argparse import ArgumentParser, Namespace
from pathlib import Path
from uuid import uuid4

from core.base.caller.caller import Caller
from core.base.journal_home import JournalHome
from core.base.provider.launch import Launch
from core.base.provider.model_tier import ModelTier
from core.base.provider.providers import Providers
from core.base.provider.resumed_session import ResumedSession
from core.base.provider.session_start import SessionStart
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_text_list


class ProgramCommandSubcommand(ReadSubcommand[list[str]]):
    """`journal program command <program> <folder> --launch <name> [--resume <session>] [--ask-prompts]`: the
    command line that starts the program in the folder, one argument a line, as its provider builds it, for
    the launcher."""

    cli_name = "program"
    name = "command"

    def __init__(self, providers: Providers, home: JournalHome) -> None:
        self.providers, self.home = providers, home

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")
        parser.add_argument("folder")
        parser.add_argument("--launch", required=True)
        parser.add_argument("--resume", default="")
        parser.add_argument("--ask-prompts", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> list[str]:
        provider = self.providers.provider(arguments.program)
        model = next(model.name for model in provider.models if model.tier is ModelTier.GENERAL)
        session = ResumedSession(arguments.resume) if arguments.resume else SessionStart(str(uuid4()))
        launch = Launch(self.home.folder.parent, Path(arguments.folder), model, arguments.launch, session, {}, skip_prompts=not arguments.ask_prompts)
        return list(provider.session_command(launch).arguments)

    def write_output(self, value: object, output: Output) -> None:
        output.line("\n".join(value) if is_text_list(value) else str(value))
