import importlib.util
from pathlib import Path

from engine.enums.execution_lane import ExecutionLane
from engine.execution.builtin_classes import BUILTIN_CLASSES
from engine.execution.default_lane_limits import DEFAULT_LANE_LIMITS

SCRIPT = Path(__file__).resolve().parents[3] / "scripts" / "execution_class_table.py"


def table_text() -> str:
    spec = importlib.util.spec_from_file_location("execution_class_table", SCRIPT)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.table_text()


def test_every_built_in_class_is_printed():
    text = table_text()
    assert all(f"| {row.execution_class.name} |" in text for row in BUILTIN_CLASSES)


def test_capacities_printed():
    text = table_text()
    assert all(f"| {lane} | {DEFAULT_LANE_LIMITS.capacity(lane)} |" in text for lane in ExecutionLane)
