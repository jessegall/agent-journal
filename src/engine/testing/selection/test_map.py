import json
import os
from dataclasses import dataclass, field
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.testing.selection.function_bodies import FunctionBodies
from engine.testing.selection.test_map_recorder import PROJECT_FOLDER

MAP_FILE_VARIABLE = "JOURNAL_TEST_MAP"
MAP_FILE = Path(os.environ[MAP_FILE_VARIABLE]) if MAP_FILE_VARIABLE in os.environ else PROJECT_FOLDER / ".journal" / "runtime" / "test-map.json"
# a test-only switch that records a map on a run that is not a full run, so one folder run proves the recorder
RECORD_VARIABLE = "JOURNAL_RECORD_TEST_MAP"


@dataclass
class TestMap:
    """What each test of the newest full run reached: the project functions it ran, the source files its story
    template's build ran, and a hash of each such function's definition as it was then. A selector compares
    the hashes with the code now to find the tests a change reaches."""

    __test__ = False

    functions: dict[str, list[str]] = field(default_factory=dict)
    template_files: dict[str, list[str]] = field(default_factory=dict)
    bodies: dict[str, dict[str, str]] = field(default_factory=dict)

    @staticmethod
    def is_recorded(is_full_run: bool) -> bool:
        return is_full_run or os.environ.get(RECORD_VARIABLE) == "1"

    def add(self, functions: dict[str, list[str]], template_files: dict[str, list[str]]) -> None:
        self.functions.update(functions)
        self.template_files.update(template_files)

    def with_bodies(self) -> "TestMap":
        files = sorted({name.split("::", 1)[0] for names in self.functions.values() for name in names})
        return TestMap(self.functions, self.template_files, {file: FunctionBodies.file_hashes(PROJECT_FOLDER / file) for file in files})

    def write(self, file: Path = MAP_FILE) -> None:
        if FileAccess.is_dir(file.parent):
            FileAccess.write(file, json.dumps({"functions": self.functions, "template_files": self.template_files, "bodies": self.bodies}, sort_keys=True))

    @staticmethod
    def read(file: Path = MAP_FILE) -> "TestMap":
        if not FileAccess.is_file(file):
            return TestMap()
        stored = json.loads(FileAccess.read(file))
        return TestMap(stored["functions"], stored["template_files"], stored["bodies"])
