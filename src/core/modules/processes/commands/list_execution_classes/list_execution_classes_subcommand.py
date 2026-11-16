from argparse import Namespace

from engine.caller.caller import Caller
from engine.setting.setting_values import SettingValues
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.support.execution_class_lines import ExecutionClassLines
from core.modules.processes.support.execution_class_table import ExecutionClassTable

POOL_SETTINGS = (ProcessSetting.POOL_CAPACITY_INSTANT, ProcessSetting.POOL_CAPACITY_SHORT, ProcessSetting.POOL_CAPACITY_LONG, ProcessSetting.STARTER_CAP_PERCENT)


class ListExecutionClassesSubcommand(ReadSubcommand[ExecutionClassTable]):
    """`journal queue-class list`: every class, its lane, cost, priority and class limit, built-in, changed
    or your own, and in its JSON the lane capacities and the starter's share beside them."""

    cli_name = "queue-class"
    name = "list"

    def __init__(self, lines: ExecutionClassLines, values: SettingValues) -> None:
        self.class_lines, self.values = lines, values

    def read(self, arguments: Namespace, caller: Caller) -> ExecutionClassTable:
        settings = tuple({"key": setting.key, "title": setting.value.title, "description": setting.value.description, "value": self.values.number(setting.key)}
                         for setting in POOL_SETTINGS)
        return ExecutionClassTable(self.class_lines.entries(), settings)
