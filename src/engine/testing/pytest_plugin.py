import os
import shutil
from collections.abc import Callable, Generator
import time
from pathlib import Path

import pytest

from engine.database.shared_tables import SharedTables
from engine.module.code_fingerprint import PINNED_CODE_VARIABLE
from engine.module.source_hash import SourceHash

from engine.registry.lazy_loading import LazyLoading
from engine.module.python_source_folders import python_source_folders
from engine.testing.runs.run_cpu import RunCpu
from engine.testing.runs.run_size import RunSize
from engine.testing.runs.full_run_record import FullRunRecord
from engine.testing.runs.full_run_records import FullRunRecords
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from engine.testing.stories.story_body import StoryBody
from engine.testing.stories.story_overlap import StoryOverlap
from engine.testing.stories.story_steps import StorySteps
from engine.testing.stories.story_budget import BUDGET_MARKER, CPU_SECONDS_BUDGET, POINTS_BUDGET, StoryBudget
from engine.testing.cache.template_cache import TemplateCache
from engine.testing.templates.temp_folders import TempFolders
from engine.testing.templates.template_databases import TemplateDatabases

STORY_OVERLAP = pytest.StashKey[StoryOverlap]()
STORY_RUNS = pytest.StashKey[list[StorySteps]]()
RUN_FOLDER = pytest.StashKey[Path]()
CALL_PASSED = pytest.StashKey[bool]()
RUN_START = pytest.StashKey[float]()
RUN_CPU = pytest.StashKey[RunCpu]()
FULL_RUN = pytest.StashKey[FullRunRecord]()
FIXTURE_SUMMARY = pytest.StashKey[str]()
CPU_SECONDS_KEY = "journal_cpu_seconds"
STORY_STEPS_KEY = "journal_story_steps"
STORY_PATHS_KEY = "journal_story_paths"
STORY_FIXTURES_KEY = "journal_story_fixtures"
FIXTURE_RULES_OPTION = "story_fixture_rules"
FIXTURE_RULES_FAIL = "fail"
SINGLE_RUNNER_LIMIT_OPTION = "one_runner_below"
RUNNERS_OPTION = "runners"
HIGHEST_COUNT_START_OPTION = "most_runners_from"
MOST_RUNNERS_OPTION = "most_runners"
RUNNER_NICENESS = 10
TEMPLATE_FOLDER_VARIABLE = "JOURNAL_TEMPLATE_FOLDER"
LISTING_OPTIONS = ("collectonly", "help", "version")


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addini(SINGLE_RUNNER_LIMIT_OPTION, "a run with -n of fewer tests than this runs in one test runner", default="50")
    parser.addini(RUNNERS_OPTION, "the test runners a run with -n starts", default="4")
    parser.addini(HIGHEST_COUNT_START_OPTION, "a run with -n of this many tests or more starts the most test runners", default="1000")
    parser.addini(FIXTURE_RULES_OPTION, f"{FIXTURE_RULES_FAIL}: a story with no fixture, stories of different files that open the same way and a fixture that adds no step fail the run; anything else only counts them", default="count")
    parser.addini(MOST_RUNNERS_OPTION, "the most test runners a run with -n starts", default="8")


@pytest.hookimpl(tryfirst=True)
def pytest_cmdline_main(config: pytest.Config) -> None:
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
        os.environ[PINNED_CODE_VARIABLE] = SourceHash.text(python_source_folders())
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
def templates() -> Generator[TemplateDatabases]:
    TemplateDatabases.remove_stale_working_folders(time.time())
    databases = TemplateDatabases(run_template_folder())
    yield databases
    databases.working_folder.cleanup()


@pytest.fixture
def new_story(templates: TemplateDatabases, tmp_path: Path, request: pytest.FixtureRequest) -> Generator[Callable[..., Story]]:
    overlap = request.config.stash[STORY_OVERLAP]
    item: pytest.Item = getattr(request, "node")
    created = item.stash[STORY_RUNS]

    def started(*modules: str, fixture: type[StoryFixture] | None = None, environment: str | None = None) -> Story:
        story = templates.story(tmp_path / "journal", modules, fixture)
        story.environment = environment
        story.use_fixture_environment(fixture.line_environment() if fixture else None)
        created.append(StorySteps(story, " ".join((*modules, fixture.__name__ if fixture else "")), fixture.__name__ if fixture else ""))
        return story
    yield started
    for steps in created if item.stash.get(CALL_PASSED, False) else []:
        overlap.add(item.nodeid, steps.start, steps.lines(), [] if StoryBody.reaches_internals(getattr(item, "function")) else steps.path(), steps.fixture)
        steps.story.close()
    created.clear()
    SharedTables.shared.cache_clear()
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
    failed_expectations = [message for steps in item.stash[STORY_RUNS] for message in steps.story.failed_expectations]
    if failed_expectations:
        pytest.fail("\n\n".join([f"{len(failed_expectations)} expectations failed:", *failed_expectations]), pytrace=False)
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
    node.config.stash[STORY_OVERLAP].story_paths.update(output.get(STORY_PATHS_KEY, {}))
    node.config.stash[STORY_OVERLAP].story_fixtures.update(getattr(node, "workeroutput", {}).get(STORY_FIXTURES_KEY, {}))
    node.config.stash[RUN_CPU].add(float(getattr(node, "workeroutput", {}).get(CPU_SECONDS_KEY, 0.0)))


def pytest_sessionfinish(session: pytest.Session) -> None:
    overlap = session.config.stash[STORY_OVERLAP]
    process_output: dict[str, object] | None = getattr(session.config, "workeroutput", None)
    if process_output is not None:
        process_output[STORY_STEPS_KEY] = overlap.stories
        process_output[STORY_PATHS_KEY] = overlap.story_paths
        process_output[STORY_FIXTURES_KEY] = overlap.story_fixtures
        process_output[CPU_SECONDS_KEY] = session.config.stash[RUN_CPU].seconds
        return
    if RunSize(session.config.args, 1).is_full_suite() and not session.config.option.collectonly:
        record = FullRunRecord(session.testscollected, session.testsfailed, time.monotonic() - session.config.stash[RUN_START], session.config.stash[RUN_CPU].seconds)
        session.config.stash[FULL_RUN] = record
        FullRunRecords.add(record)
    lines = [*overlap.report_lines(), *fixture_rule_lines(session.config, overlap)]
    if not lines:
        return
    report = pytest.TestReport(nodeid="stories::overlapping_steps", location=("stories", 0, "overlapping_steps"),
                               keywords={}, outcome="failed", longrepr="\n".join(lines), when="call", sections=[])
    session.config.hook.pytest_runtest_logreport(report=report)
    if session.exitstatus == pytest.ExitCode.OK:
        session.exitstatus = pytest.ExitCode.TESTS_FAILED


def fixture_rule_lines(config: pytest.Config, overlap: StoryOverlap) -> list[str]:
    if not overlap.stories:
        return []
    findings = [overlap.no_fixture_lines(), overlap.file_opening_lines(), overlap.empty_fixture_lines(StoryFixture.declared())]
    config.stash[FIXTURE_SUMMARY] = (f"stories starting from no fixture: {len(findings[0])}, groups of stories sharing their first steps across files: {len(findings[1])}, "
                                     f"fixtures adding no step: {len(findings[2])}")
    return [line for lines in findings for line in lines] if config.getini(FIXTURE_RULES_OPTION) == FIXTURE_RULES_FAIL else []


def pytest_terminal_summary(terminalreporter: pytest.TerminalReporter, config: pytest.Config, exitstatus: int) -> None:
    full_run = config.stash.get(FULL_RUN, None)
    if full_run is not None:
        terminalreporter.write_line(full_run.summary_line())
    fixture_summary = config.stash.get(FIXTURE_SUMMARY, None)
    if fixture_summary is not None:
        terminalreporter.write_line(fixture_summary)
    run_folder = config.stash.get(RUN_FOLDER, None)
    if run_folder is not None:
        TempFolders().finish(run_folder, exitstatus == pytest.ExitCode.OK)
