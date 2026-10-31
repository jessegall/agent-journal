from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.notices.models.notice import Notice
from core.modules.notices.queries.notice_query import NoticeQuery


class NoticeListSubcommand(ReadSubcommand[Sequence[Notice]]):
    """`journal notice list [--environment <name>]`: the open notices of an environment, oldest first."""

    cli_name = "notice"
    name = "list"

    def __init__(self, notices: NoticeQuery, environment_names: EnvironmentNames) -> None:
        self.notices, self.environment_names = notices, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Notice]:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("notices belong to an environment", "name it with --environment")
        return tuple(self.notices.open_ones(environment_id).oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Notice)] if is_tuple(value) else []
        output.write("\n".join(f"{row.id:>4}  {row.title}: {row.link}" for row in listed), {"rows": [output.values(row) for row in listed]})
