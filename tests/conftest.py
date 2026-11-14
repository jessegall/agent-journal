from collections.abc import Generator
from functools import cache
import os
import subprocess
from pathlib import Path

import pytest

from engine.testing.stories.story import Story
from engine.listener.commit.listener_set import ListenerSet
from tests.stories.support.program_states import bind_ready_programs
from tests.stories.suites.coding.modules.workers.support.memory_git.git_choice import REAL_GIT
from core.modules.plugins.support.machine_runs import MACHINE_FOLDER_VARIABLE

pytest_plugins = ["engine.testing.pytest_wiring.pytest_plugin"]
STORY_SUPPORT_FOLDER = "support"
REAL_PROGRAM_FLAG = "--real-program"
REAL_PROGRAM_MARK = "real_program"
REAL_PROGRAMS = ("claude", "codex")
TYPE_CHECK_MARK = "type_check"
REAL_GIT_MARK = "real_git"
INSTALL_MARK = "install_job"
INSTALL_FOLDER = "install"
BROWSER_MARK = "browser_job"
BROWSER_CALL = "expect_browser"
READER_MARK = "reader_job"
VIEWER_MARK = "viewer_job"
SEPARATE_JOBS = (TYPE_CHECK_MARK, INSTALL_MARK, BROWSER_MARK, READER_MARK, VIEWER_MARK)
os.environ.pop("JOURNAL_AGENT_SESSION", None)


class RealProgramLaunchError(RuntimeError):
    """A test tried to start a real agent program, which costs tokens, without the flag that allows it."""


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(REAL_PROGRAM_FLAG, action="store_true", help="run only the stories that start a real Claude Code or Codex")


def pytest_configure(config: pytest.Config) -> None:
    config.addinivalue_line("markers", f"{REAL_PROGRAM_MARK}: the story starts a real agent program and runs only with {REAL_PROGRAM_FLAG}")
    config.addinivalue_line("markers", f"{REAL_GIT_MARK}: the story is about git and builds its repository with real git; every other story keeps its repository in memory")
    config.addinivalue_line("markers", f"{TYPE_CHECK_MARK}: the strict type check, a gate of its own: python3 -m pytest -m {TYPE_CHECK_MARK}")
    config.addinivalue_line("markers", f"{BROWSER_MARK}: drives a real browser, a gate of its own: python3 -m pytest -m {BROWSER_MARK} tests")
    config.addinivalue_line("markers", f"{INSTALL_MARK}: runs the real install or upgrade, a gate of its own: python3 -m pytest -m {INSTALL_MARK} tests")
    config.addinivalue_line("markers", f"{VIEWER_MARK}: runs the viewer's whole vitest suite, a gate of its own: python3 -m pytest -m {VIEWER_MARK} tests")
    config.addinivalue_line("markers", f"{READER_MARK}: runs every stock reader on its fixture outputs, a gate of its own: python3 -m pytest -m {READER_MARK} tests")


def pytest_collection_modifyitems(config: pytest.Config, items: list[pytest.Item]) -> None:
    wanted = config.getoption(REAL_PROGRAM_FLAG)
    waiting = stories_waiting_for_a_plan()
    for item in items:
        if item.nodeid in waiting:
            item.add_marker(pytest.mark.xfail(strict=True, reason=f"written ahead of its code: waits for {waiting[item.nodeid]}"))
        if INSTALL_FOLDER in item.path.parts[item.path.parts.index("tests"):]:
            item.add_marker(INSTALL_MARK)
        if browser_driver(item.path):
            item.add_marker(BROWSER_MARK)
    kept = [item for item in items if (item.get_closest_marker(REAL_PROGRAM_MARK) is not None) == wanted and belongs_job(item, config)]
    config.hook.pytest_deselected(items=[item for item in items if item not in kept])
    items[:] = kept


def stories_waiting_for_a_plan() -> dict[str, str]:
    """The stories written ahead of their code, each with the plan that builds it. Such a story is expected to
    fail, and fails the run once it passes, so its line is deleted when its plan is built."""
    lines = (Path(__file__).parent / "stories" / "waiting_for_a_plan.txt").read_text().splitlines()
    return dict(line.split("  ", 1) for line in lines if line)


@cache
def browser_driver(path: Path) -> bool:
    return BROWSER_CALL in path.read_text()


def belongs_job(item: pytest.Item, config: pytest.Config) -> bool:
    """A test of a separate job runs when its job is asked for by its mark, or its file or job folder is named."""
    job = next((mark for mark in SEPARATE_JOBS if item.get_closest_marker(mark) is not None), None)
    if job is None or config.getoption("markexpr") == job:
        return True
    targets = [Path(argument.split("::")[0]).resolve() for argument in config.args]
    return any(target == item.path or (target.name == INSTALL_FOLDER and target in item.path.parents) for target in targets)


def pytest_terminal_summary(terminalreporter: pytest.TerminalReporter, config: pytest.Config) -> None:
    real_reports = [report for outcome in ("passed", "failed") for report in terminalreporter.stats.get(outcome, []) if REAL_PROGRAM_MARK in getattr(report, "keywords", {}) and report.when == "call"]
    terminalreporter.write_line(f"{len(real_reports)} stories used a real Claude Code or Codex")


def names_real_program(command: object, fake_folder: Path) -> bool:
    tokens = command.split() if isinstance(command, str) else list(command) if isinstance(command, (list, tuple)) else []
    return bool(tokens) and Path(str(tokens[0])).name in REAL_PROGRAMS and not Path(str(tokens[0])).is_relative_to(fake_folder)


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


@pytest.fixture(autouse=True)
def program_config_folder(request: pytest.FixtureRequest, monkeypatch: pytest.MonkeyPatch, tmp_path: Path, tmp_path_factory: pytest.TempPathFactory) -> None:
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex-home"))
    monkeypatch.setenv(MACHINE_FOLDER_VARIABLE, str(tmp_path / "machine"))
    if request.config.getoption(REAL_PROGRAM_FLAG):
        return
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path_factory.mktemp("claude-config")))


@pytest.fixture(autouse=True)
def story_program_readiness(monkeypatch):
    opened = Story.opened

    def ready_story(cls, home, state):
        story = opened(home, state)
        bind_ready_programs(story)
        return story

    monkeypatch.setattr(Story, 'opened', classmethod(ready_story))


@pytest.fixture(autouse=True)
def story_git_choice(request: pytest.FixtureRequest) -> Generator[None]:
    token = REAL_GIT.set(request.node.get_closest_marker(REAL_GIT_MARK) is not None)
    yield
    REAL_GIT.reset(token)


@pytest.fixture(autouse=True)
def no_built_listener_sets() -> None:
    ListenerSet.built_sets.clear()
