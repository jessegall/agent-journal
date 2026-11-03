import os
import subprocess
from pathlib import Path

import pytest

pytest_plugins = ["core.testing.pytest_plugin"]
STORY_SUPPORT_FOLDER = "support"
REAL_PROGRAM_FLAG = "--real-program"
REAL_PROGRAM_MARK = "real_program"
REAL_PROGRAMS = ("claude", "codex")
os.environ.pop("JOURNAL_AGENT_SESSION", None)


class RealProgramLaunchError(RuntimeError):
    """A test tried to start a real agent program, which costs tokens, without the flag that allows it."""


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(REAL_PROGRAM_FLAG, action="store_true", help="run only the stories that start a real Claude Code or Codex")


def pytest_configure(config: pytest.Config) -> None:
    config.addinivalue_line("markers", f"{REAL_PROGRAM_MARK}: the story starts a real agent program and runs only with {REAL_PROGRAM_FLAG}")


def pytest_collection_modifyitems(config: pytest.Config, items: list[pytest.Item]) -> None:
    wanted = config.getoption(REAL_PROGRAM_FLAG)
    kept = [item for item in items if (item.get_closest_marker(REAL_PROGRAM_MARK) is not None) == wanted]
    config.hook.pytest_deselected(items=[item for item in items if item not in kept])
    items[:] = kept


def pytest_terminal_summary(terminalreporter: pytest.TerminalReporter, config: pytest.Config) -> None:
    real_reports = [report for outcome in ("passed", "failed") for report in terminalreporter.stats.get(outcome, []) if REAL_PROGRAM_MARK in getattr(report, "keywords", {}) and report.when == "call"]
    terminalreporter.write_line(f"{len(real_reports)} stories used a real Claude Code or Codex")


def names_real_program(command: object, stand_in_folder: Path) -> bool:
    tokens = command.split() if isinstance(command, str) else list(command) if isinstance(command, (list, tuple)) else []
    return bool(tokens) and Path(str(tokens[0])).name in REAL_PROGRAMS and not Path(str(tokens[0])).is_relative_to(stand_in_folder)


@pytest.fixture(autouse=True)
def refuse_real_programs(request: pytest.FixtureRequest, monkeypatch: pytest.MonkeyPatch, tmp_path_factory: pytest.TempPathFactory) -> None:
    if request.config.getoption(REAL_PROGRAM_FLAG):
        return
    real_popen = subprocess.Popen

    class GuardedPopen(real_popen):
        def __init__(self, args: object, *arguments: object, **options: object) -> None:
            if names_real_program(args, tmp_path_factory.getbasetemp()):
                raise RealProgramLaunchError(f"a test may start {args} only with {REAL_PROGRAM_FLAG}")
            super().__init__(args, *arguments, **options)

    monkeypatch.setattr(subprocess, "Popen", GuardedPopen)


def pytest_collect_file(file_path: Path, parent: pytest.Collector):
    is_story = "stories" in file_path.parts and STORY_SUPPORT_FOLDER not in file_path.parts and file_path.suffix == ".py" and file_path.name != "__init__.py"
    if is_story and not file_path.name.startswith("test_") and not parent.session.isinitpath(file_path):
        return pytest.Module.from_parent(parent, path=file_path)
    return None
