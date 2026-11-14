import sys
from pathlib import Path
from types import CodeType

from engine.module.code_fingerprint import CORE_FOLDER

PROJECT_FOLDER = CORE_FOLDER.parent.parent
RECORDED_FOLDERS = (str(PROJECT_FOLDER / "src") + "/", str(PROJECT_FOLDER / "tests") + "/")
TOOL_ID = sys.monitoring.PROFILER_ID
TOOL_NAME = "journal test map"
MODULE_CODE = "<module>"


class TestMapRecorder:
    """Records the project functions each test runs, through sys.monitoring: one start event per function per
    test, turned off once seen and on again when the next test starts, so a function that runs in a loop costs
    one event. Code run when a module is first imported belongs to no test."""

    __test__ = False

    def __init__(self, tool_id: int = TOOL_ID) -> None:
        self.tool_id = tool_id
        self.current: set[str] = set()
        self.tests: dict[str, list[str]] = {}

    def start(self) -> None:
        sys.monitoring.use_tool_id(self.tool_id, TOOL_NAME)
        sys.monitoring.register_callback(self.tool_id, sys.monitoring.events.PY_START, self.started)
        sys.monitoring.set_events(self.tool_id, sys.monitoring.events.PY_START)

    def stop(self) -> None:
        sys.monitoring.set_events(self.tool_id, sys.monitoring.events.NO_EVENTS)
        sys.monitoring.register_callback(self.tool_id, sys.monitoring.events.PY_START, None)
        sys.monitoring.free_tool_id(self.tool_id)

    def begin_test(self) -> None:
        self.current = set()
        sys.monitoring.restart_events()

    def finish_test(self, node_id: str) -> None:
        self.tests[node_id] = sorted(self.current)
        self.current = set()

    def started(self, code: CodeType, offset: int) -> object:
        if code.co_qualname != MODULE_CODE and code.co_filename.startswith(RECORDED_FOLDERS):
            self.current.add(f"{Path(code.co_filename).relative_to(PROJECT_FOLDER).as_posix()}::{code.co_qualname}")
        return sys.monitoring.DISABLE
