from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING
from core.modules.developer.support.hook_numbers_file import HookNumbersFile
from core.modules.developer.support.hook_number import HookNumber
from core.modules.developer.support.route_times import RouteTimes
from core.modules.settings.bindings.support.setting_values import SettingValues


class HookNumbersSubcommand(ReadSubcommand[tuple[HookNumber, ...]]):
    """`journal developer numbers [--slowest]`: what each kind of hook, each reader and, while Hook durations is on,
    each HTTP route has cost, by name or slowest first."""

    cli_name = "developer"
    name = "numbers"

    def __init__(self, numbers: HookNumbersFile, routes: RouteTimes, settings: SettingValues) -> None:
        self.numbers, self.routes, self.settings = numbers, routes, settings

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--slowest", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[HookNumber, ...]:
        rows = self.numbers.read()
        if self.settings.value(HOOK_DURATIONS_SETTING, caller.environment_id) is True:
            rows.extend(self.routes.read())
        return tuple(sorted(rows, key=lambda row: -row.slowest_ms) if arguments.slowest else sorted(rows, key=lambda row: row.hook))

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [row for row in value if isinstance(row, HookNumber)]
            output.write("\n".join(f"{row.hook}: {row.count} at {row.total_ms // max(row.count, 1)} ms, slowest {row.slowest_ms} ms" for row in rows) or "nothing counted yet", {"rows": [row.json() for row in rows]})
