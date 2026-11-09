import os
import shutil
import sys
from collections.abc import Callable, Generator
import time
from pathlib import Path

import pytest

from core.base.module.code_fingerprint import PINNED_CODE_VARIABLE, SOURCE_FOLDER
from core.base.module.source_hash import SourceHash

from core.base.registry.lazy_loading import LazyLoading
from core.testing.heavy_run_gate import HeavyRunGate
from core.testing.run_cpu import RunCpu
from core.testing.run_size import RunSize
from core.testing.full_run_record import FullRunRecord
from core.testing.full_run_records import FullRunRecords
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from core.testing.story_overlap import StoryOverlap
from core.testing.story_steps import StorySteps
from core.testing.story_budget import BUDGET_MARKER, CPU_SECONDS_BUDGET, POINTS_BUDGET, StoryBudget
from core.testing.template_cache import TemplateCache
from core.testing.temp_folders import TempFolders
from core.testing.template_databases import TemplateDatabases

STORY_OVERLAP = pytest.StashKey[StoryOverlap]()
STORY_RUNS = pytest.StashKey[list[StorySteps]]()
RUN_FOLDER = pytest.StashKey[Path]()
CALL_PASSED = pytest.StashKey[bool]()
RUN_START = pytest.StashKey[float]()
RUN_CPU = pytest.StashKey[RunCpu]()
FULL_RUN = pytest.StashKey[FullRunRecord]()
CPU_SECONDS_KEY = "journal_cpu_seconds"
STORY_STEPS_KEY = "journal_story_steps"
SINGLE_RUNNER_LIMIT_OPTION = "one_runner_below"
RUNNERS_OPTION = "runners"
HIGHEST_COUNT_START_OPTION = "most_runners_from"
MOST_RUNNERS_OPTION = "most_runners"
RUNNER_NICENESS = 10
GATE_LOCK_VARIABLE = "JOURNAL_HEAVY_GATE_HELD"
TEMPLATE_FOLDER_VARIABLE = "JOURNAL_TEMPLATE_FOLDER"
LISTING_OPTIONS = ("collectonly", "help", "version")


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addini(SINGLE_RUNNER_LIMIT_OPTION, "a run with -n of fewer tests than this runs in one test runner", default="50")
    parser.addini(RUNNERS_OPTION, "the test runners a run with -n starts", default="4")
    parser.addini(HIGHEST_COUNT_START_OPTION, "a run with -n of this many tests or more starts the most test runners", default="1000")
    parser.addini(MOST_RUNNERS_OPTION, "the most test runners a run with -n starts", default="8")


@pytest.hookimpl(tryfirst=True)
def pytest_cmdline_main(config: pytest.Config) -> None:
    if GATE_LOCK_VARIABLE not in os.environ and RunSize(config.args, 1).is_heavy():
        HeavyRunGate().enter(lambda line: print(line, file=sys.stderr, flush=True))
        os.environ[GATE_LOCK_VARIABLE] = "1"
    if chooses_template_folder(config):
        pinned_code_text()
        run_template_folder()
    if not config.getoption("numprocesses", None):
        return
    os.nice(RUNNER_NICENESS)
    highest_count_start = int(config.getini(HIGHEST_COUNT_START_OPTION))
    runner_total = RunSize(config.args, highest_count_start).runner_count(int(config.getini(SINGLE_RUNNER_LIMIT_OPTION)), int(config.getini(RUNNERS_OPTION)), highest_count_start, int(config.getini(MOST_RUNNERS_OPTION)))
    config.option.numprocesses = 0 if runner_total == 1 else runner_total


def chooses_template_folder(config: pytest.Config) -> bool:
    is_listing = any(config.getoption(option, False) for option in LISTING_OPTIONS)
    return not (hasattr(config, "workerinput") or is_listing or TEMPLATE_FOLDER_VARIABLE in os.environ) and RunSize(config.args, 1).reaches_stories()


def pinned_code_text() -> str:
    # The first process of a run hashes the code and its runners inherit it, so a file edited during the run changes nothing.
    if PINNED_CODE_VARIABLE not in os.environ:
        os.environ[PINNED_CODE_VARIABLE] = SourceHash.text(tuple([SOURCE_FOLDER]))
    return os.environ[PINNED_CODE_VARIABLE]


def run_template_folder() -> Path:
    # The first process of a run chooses the folder and its runners inherit it, so a merge cannot move them.
    if TEMPLATE_FOLDER_VARIABLE not in os.environ:
        os.environ[TEMPLATE_FOLDER_VARIABLE] = str(TemplateCache().folder())
    return Path(os.environ[TEMPLATE_FOLDER_VARIABLE])


def pytest_configure(config: pytest.Config) -> None:
    LazyLoading.disabled = True
    config.stash[RUN_START] = time.monotonic()
    config.stash[RUN_CPU] = RunCpu()
    config.addinivalue_line("markers", f"{BUDGET_MARKER}(points, cpu_seconds, reason): a story that may cost more than the default budget, and why")
    config.stash[STORY_OVERLAP] = StoryOverlap()
    if config.option.basetemp is None and not hasattr(config, "workerinput"):
        config.stash[RUN_FOLDER] = config.option.basetemp = TempFolders().start()


def pytest_itemcollected(item: pytest.Item) -> None:
    item.stash[STORY_RUNS] = []


@pytest.fixture(scope="session")
def templates() -> TemplateDatabases:
    return TemplateDatabases(run_template_folder())


@pytest.fixture
def new_story(templates: TemplateDatabases, tmp_path: Path, request: pytest.FixtureRequest) -> Generator[Callable[..., Story]]:
    overlap = request.config.stash[STORY_OVERLAP]
    item: pytest.Item = getattr(request, "node")
    created = item.stash[STORY_RUNS]

    def started(*modules: str, fixture: type[StoryFixture] | None = None, environment: str | None = None) -> Story:
        story = templates.story(tmp_path / "journal", modules, fixture)
        story.environment = environment
        created.append(StorySteps(story))
        return story
    yield started
    for steps in created:
        overlap.add(item.nodeid, steps.lines())
        steps.story.close()
    created.clear()
    if item.stash.get(CALL_PASSED, False):
        shutil.rmtree(tmp_path, ignore_errors=True)


@pytest.hookimpl(wrapper=True)
def pytest_runtest_makereport(item: pytest.Item, call: pytest.CallInfo[None]) -> Generator[None, pytest.TestReport, pytest.TestReport]:
    report = yield
    if report.when == "call":
        item.stash[CALL_PASSED] = report.passed
    return report


@pytest.hookimpl(wrapper=True)
def pytest_runtest_protocol(item: pytest.Item, nextitem: pytest.Item | None) -> Generator[None, object, object]:
    started = StoryBudget.clock()
    try:
        return (yield)
    finally:
        item.config.stash[RUN_CPU].add(StoryBudget.clock() - started)


@pytest.hookimpl(wrapper=True, tryfirst=True)
def pytest_runtest_call(item: pytest.Item) -> Generator[None]:
    for steps in item.stash[STORY_RUNS]:
        steps.begin_test()
    try:
        yield
    finally:
        for steps in item.stash[STORY_RUNS]:
            steps.finish_test()
    budget = story_budget(item)
    for steps in item.stash[STORY_RUNS]:
        overrun = budget.overrun(steps.points, steps.cpu_seconds)
        if overrun:
            pytest.fail(overrun, pytrace=False)


def story_budget(item: pytest.Item) -> StoryBudget:
    marker = item.get_closest_marker(BUDGET_MARKER)
    if marker is None:
        return StoryBudget()
    return StoryBudget(points=marker.kwargs.get("points", POINTS_BUDGET), cpu_seconds=marker.kwargs.get("cpu_seconds", CPU_SECONDS_BUDGET))


@pytest.hookimpl(optionalhook=True)
def pytest_testnodedown(node: pytest.Session, error: object) -> None:
    output: dict[str, dict[str, list[str]]] = getattr(node, "workeroutput", {})
    node.config.stash[STORY_OVERLAP].stories.update(output.get(STORY_STEPS_KEY, {}))
    node.config.stash[RUN_CPU].add(float(getattr(node, "workeroutput", {}).get(CPU_SECONDS_KEY, 0.0)))


def pytest_sessionfinish(session: pytest.Session) -> None:
    overlap = session.config.stash[STORY_OVERLAP]
    process_output: dict[str, object] | None = getattr(session.config, "workeroutput", None)
    if process_output is not None:
        process_output[STORY_STEPS_KEY] = overlap.stories
        process_output[CPU_SECONDS_KEY] = session.config.stash[RUN_CPU].seconds
        return
    if RunSize(session.config.args, 1).is_full_suite() and not session.config.option.collectonly:
        record = FullRunRecord(session.testscollected, session.testsfailed, time.monotonic() - session.config.stash[RUN_START], session.config.stash[RUN_CPU].seconds)
        session.config.stash[FULL_RUN] = record
        FullRunRecords.add(record)
    lines = overlap.report_lines()
    if not lines:
        return
    report = pytest.TestReport(nodeid="stories::shared_first_steps", location=("stories", 0, "shared_first_steps"),
                               keywords={}, outcome="failed", longrepr="\n".join(lines), when="call", sections=[])
    session.config.hook.pytest_runtest_logreport(report=report)
    if session.exitstatus == pytest.ExitCode.OK:
        session.exitstatus = pytest.ExitCode.TESTS_FAILED


def pytest_terminal_summary(terminalreporter: pytest.TerminalReporter, config: pytest.Config, exitstatus: int) -> None:
    full_run = config.stash.get(FULL_RUN, None)
    if full_run is not None:
        terminalreporter.write_line(full_run.summary_line())
    run_folder = config.stash.get(RUN_FOLDER, None)
    if run_folder is not None:
        TempFolders().finish(run_folder, exitstatus == pytest.ExitCode.OK)
