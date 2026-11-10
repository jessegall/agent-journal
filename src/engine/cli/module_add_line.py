from argparse import ArgumentParser
from pathlib import Path
from typing import TextIO

from engine.cli.console import REFUSED_CODE, SUCCESS_CODE, USAGE_CODE
from core.base.database.schema_mismatch_error import SchemaMismatchError
from core.base.model.tables import Tables
from core.base.module.module_addition import ModuleAddition
from core.base.module.module_error import ModuleError
from core.base.subcommand.output import Output

MODULE_ADDITION_ARGUMENTS = ["module", "add"]


class ModuleAddLine:
    """Runs module add on an opened journal, including one whose registry is not ready."""

    def __init__(self, addition: ModuleAddition, tables: Tables) -> None:
        self.addition, self.tables = addition, tables

    def run(self, argv: list[str], stream: TextIO) -> int:
        parser = ArgumentParser(prog="journal module add")
        parser.add_argument("folder", type=Path)
        try:
            arguments = parser.parse_args(argv[2:])
        except SystemExit as error:
            return USAGE_CODE if error.code else SUCCESS_CODE
        output = Output(self.tables, False, stream)
        try:
            report = self.addition.add(arguments.folder)
        except (ModuleError, SchemaMismatchError) as error:
            output.error(str(error))
            return REFUSED_CODE
        output.line(report.text)
        return SUCCESS_CODE
