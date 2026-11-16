from argparse import ArgumentParser, Namespace
from pathlib import Path

from engine.caller.caller import Caller
from engine.module.suite_contract_breach import SuiteContractBreach
from engine.module.suite_import_check import SuiteImportCheck
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple


class CheckSuiteSubcommand(ReadSubcommand[tuple[SuiteContractBreach, ...]]):
    """`journal suite check <folder>`: checks a suite's own folder by the engine's import rule and prints each
    refusal with its file and line."""

    cli_name = "suite"
    name = "check"

    def __init__(self, check: SuiteImportCheck) -> None:
        self.check = check

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("folder")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[SuiteContractBreach, ...]:
        return self.check.refusals(Path(arguments.folder).expanduser().resolve())

    def write_output(self, value: object, output: Output) -> None:
        refusals = [refusal for refusal in value if isinstance(refusal, SuiteContractBreach)] if is_tuple(value) else []
        output.write("\n".join(refusal.text for refusal in refusals) or "the suite keeps the engine's contract", {"refusals": [refusal.text for refusal in refusals]})
