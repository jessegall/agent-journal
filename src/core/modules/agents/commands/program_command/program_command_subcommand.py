import json
from argparse import ArgumentParser, Namespace
from pathlib import Path
from uuid import uuid4

from engine.caller.caller import Caller
from engine.journal.journal_home import JournalHome
from engine.provider.launch import Launch
from engine.provider.providers import Providers
from engine.provider.program_settings_sync import ProgramSettingsSync
from engine.provider.resumed_session import ResumedSession
from engine.provider.session_start import SessionStart
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.errors.refusal import Refusal
from engine.types.type_guards import is_mapping, is_text_list

FORMATS = ("lines", "json")
FIRST_PROMPT = "[journal] the journal started this session: follow its opening lines"


class ProgramCommandSubcommand(ReadSubcommand[list[str] | dict[str, object]]):
    """`journal program command <program> <folder> --launch <name> [--resume <session>] [--ask-prompts]
    [--program-argument=<argument>]... [--format lines|json]`: the command line that starts the program in the
    folder, as its provider builds it, for the launcher: one argument a line, or with --format json the arguments
    and the variables the launch must carry. A program that needs variables refuses the plain form, which an older
    launcher asks for. A resumed session keeps the model and effort it last ran with. It starts the program's
    first turn with the journal's first prompt, unless the person gave arguments of their own."""

    cli_name = "program"
    name = "command"

    def __init__(self, providers: Providers, home: JournalHome, sync: ProgramSettingsSync) -> None:
        self.providers, self.home, self.sync = providers, home, sync

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("program")
        parser.add_argument("folder")
        parser.add_argument("--launch", required=True)
        parser.add_argument("--resume", default="")
        parser.add_argument("--ask-prompts", action="store_true")
        parser.add_argument("--program-argument", action="append", default=[])
        parser.add_argument("--format", choices=FORMATS, default=FORMATS[0])

    def read(self, arguments: Namespace, caller: Caller) -> list[str] | dict[str, object]:
        provider = self.providers.provider(arguments.program)
        variables = dict(provider.launch_variables(self.home))
        if variables and arguments.format == FORMATS[0]:
            raise Refusal(f"{provider.title} starts only with the journal's own settings folder, which this launcher does not pass",
                          "update the journal's launcher with install.sh, then launch again")
        self.sync.prepare(arguments.program)
        session = ResumedSession(arguments.resume) if arguments.resume else SessionStart(str(uuid4()))
        model = provider.reported_model(self.home, arguments.resume) or provider.session_model()
        launch = Launch(self.home.folder.parent, Path(arguments.folder), model, arguments.launch, session, {},
                        skip_prompts=not arguments.ask_prompts, program_arguments=tuple(arguments.program_argument),
                        first_prompt="" if arguments.program_argument else FIRST_PROMPT, effort=provider.session_effort(self.home, arguments.resume))
        command_arguments = list(provider.session_command(launch).arguments)
        if arguments.format == FORMATS[0]:
            return command_arguments
        return {"arguments": command_arguments, "variables": variables}

    def write_output(self, value: object, output: Output) -> None:
        if is_mapping(value):
            output.line(json.dumps(value))
            return
        output.line("\n".join(value) if is_text_list(value) else str(value))
