import sys
from pathlib import Path, PurePosixPath

from engine.testing.selection.function_bodies import FunctionBodies
from engine.testing.selection.test_map import TestMap
from engine.testing.selection.test_map_recorder import PROJECT_FOLDER

EVERYTHING = "tests"
STORY_FOLDERS = ("tests/stories", "tests/integration")
# a change here can reach any test, so every test runs
WHOLE_RUN_PATHS = ("tests/conftest.py", "pytest.ini", "pyproject.toml", "uv.lock", "src/engine/testing/", "src/engine/container/", "src/engine/registry/",
                   "src/engine/command/bus.py", "src/engine/database/", "src/engine/listener/", ".venv/")
# a change to the shape of the stored rows reaches every story
SCHEMA_PARTS = ("/migrations/", "/models/", "/views/")


class AffectedTests:
    """The pytest arguments a set of changed files reaches, read from the newest full run's test map: the tests
    that ran a function whose definition changed or went, the tests whose story template ran a changed file, a
    changed test file itself, every test of a file whose module-level code changed, every test of the module of a
    new file or a changed data file, and every story for a change to stored rows. A change to the test kit or
    the engine's core, or a missing map, runs everything."""

    def __init__(self, test_map: TestMap, project: Path = PROJECT_FOLDER) -> None:
        self.test_map, self.project = test_map, project

    def arguments(self, changed: list[str]) -> list[str]:
        if not self.test_map.functions or any(name.startswith(WHOLE_RUN_PATHS) for name in changed):
            return [EVERYTHING]
        if any(part in name for name in changed for part in SCHEMA_PARTS):
            return list(STORY_FOLDERS)
        selected: set[str] = set()
        for name in changed:
            selected |= self.reached(name)
        return sorted(selected)

    def reached(self, name: str) -> set[str]:
        if self.is_test_file(name):
            return {name, *self.tests_running_in(name)}
        if not name.endswith(".py"):
            return self.tests_running_in(self.module_folder(name))
        by_template = {test for test, files in self.test_map.template_files.items() if name in files}
        recorded = self.test_map.bodies.get(name)
        if recorded is None:
            return by_template | self.tests_running_in(self.module_folder(name))
        now = FunctionBodies.file_hashes(self.project / name)
        changed = {f"{name}::{function}" for function, body in recorded.items() if now.get(function) != body}
        if not changed:
            return by_template | self.tests_running_in(name)
        return by_template | {test for test, functions in self.test_map.functions.items() if changed.intersection(functions)}

    def tests_running_in(self, prefix: str) -> set[str]:
        return {test for test, functions in self.test_map.functions.items() if any(function.startswith(prefix) for function in functions)}

    @staticmethod
    def is_test_file(name: str) -> bool:
        path = PurePosixPath(name)
        return name.startswith("tests/") and path.suffix == ".py" and "support" not in path.parts and path.name != "__init__.py"

    # the module a file belongs to (src/core/modules/tasks/), or its own folder outside the modules
    @staticmethod
    def module_folder(name: str) -> str:
        parts = PurePosixPath(name).parts
        if "modules" in parts and len(parts) > parts.index("modules") + 1:
            return "/".join(parts[:parts.index("modules") + 2]) + "/"
        return str(PurePosixPath(name).parent) + "/"


if __name__ == "__main__":
    print("\n".join(AffectedTests(TestMap.read()).arguments(sys.argv[1:])))
