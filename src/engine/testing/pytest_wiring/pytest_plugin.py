from engine.file.file_access import FileAccess
import os
from collections.abc import Callable, Generator
import time
from pathlib import Path

import pytest

from engine.module.code_fingerprint import PINNED_CODE_VARIABLE
from engine.module.schema_inputs import SchemaInputs

from engine.registry.lazy_loading import LazyLoading
from engine.module.python_source_folders import python_source_folders
from engine.testing.runs.run_cpu import RunCpu
from engine.testing.runs.run_durations import RunDurations
from engine.testing.runs.run_size import RunSize
from engine.testing.runs.full_run_record import FullRunRecord
from engine.testing.runs.full_run_records import FullRunRecords
from engine.testing.stories.story import Story
from engine.testing.selection.test_map import TestMap
from engine.testing.selection.test_map_recorder import TestMapRecorder
from engine.testing.selection.affected_tests import AffectedTests
from engine.testing.selection.selection_misses import SelectionMisses
from engine.testing.templates.touched_code import TouchedCode
from engine.testing.stories.story_fixture import StoryFixture
from engine.testing.stories.story_overlap import StoryOverlap
from engine.testing.stories.story_steps import StorySteps
from engine.testing.stories.story_budget import BUDGET_MARKER, POINTS_BUDGET, StoryBudget
from engine.testing.cache.template_cache import TemplateCache
from engine.testing.templates.temp_folders import TempFolders
from engine.testing.templates.template_databases import TemplateDatabases

STORY_OVERLAP = pytest.StashKey[StoryOverlap]()
STORY_RUNS = pytest.StashKey[list[StorySteps]]()
RUN_FOLDER = pytest.StashKey[Path]()
CALL_PASSED = pytest.StashKey[bool]()
RUN_START = pytest.StashKey[float]()
RUN_CPU = pytest.StashKey[RunCpu]()
RUN_DURATIONS = pytest.StashKey[RunDurations]()
FULL_RUN = pytest.StashKey[FullRunRecord]()
FIXTURE_SUMMARY = pytest.StashKey[str]()
CPU_SECONDS_KEY = "journal_cpu_seconds"
STORY_STEPS_KEY = "journal_story_steps"
STORY_PATHS_KEY = "journal_story_paths"
STORY_FIXTURES_KEY = "journal_story_fixtures"
STORY_CHECKS_KEY = "journal_story_checks"
RECORDS_MAP_KEY = "journal_records_test_map"
TEST_MAP_KEY = "journal_test_map"
RECORDER = pytest.StashKey[TestMapRecorder]()
TEMPLATE_FILES = pytest.StashKey[dict[str, list[str]]]()
FAILED_TESTS = pytest.StashKey[set[str]]()
MISSED_TESTS = pytest.StashKey[list[str]]()
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
        os.environ[PINNED_CODE_VARIABLE] = SchemaInputs.hash(python_source_folders())
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
    config.stash[RUN_DURATIONS] = RunDurations()
    config.stash[FAILED_TESTS] = set()
    config.addinivalue_line("markers", f"{BUDGET_MARKER}(points, reason): a story that may cost more than the default budget, and why")
    config.stash[STORY_OVERLAP] = StoryOverlap()
    if records_test_map(config):
        config.stash[RECORDER] = TestMapRecorder()
        config.stash[TEMPLATE_FILES] = {}
        config.stash[RECORDER].start()
    if config.option.basetemp is None and not hasattr(config, "workerinput"):
        config.stash[RUN_FOLDER] = config.option.basetemp = TempFolders().start()


# the run's first process decides once whether the run records a test map and tells its runners, so a test run
# started inside a test never writes one
def records_test_map(config: pytest.Config) -> bool:
    worker_input: dict[str, object] | None = getattr(config, "workerinput", None)
    if worker_input is not None:
        return bool(worker_input.get(RECORDS_MAP_KEY, False))
    option = config.option
    is_full_run = RunSize(config.args, 1).is_full_run(option.keyword, option.markexpr, option.deselect or (), bool(getattr(option, "lf", False)))
    return TestMap.is_recorded(is_full_run) and not option.collectonly


@pytest.hookimpl(optionalhook=True)
def pytest_configure_node(node: object) -> None:
    worker_input: dict[str, object] = getattr(node, "workerinput")
    worker_input[RECORDS_MAP_KEY] = RECORDER in getattr(node, "config").stash


def pytest_itemcollected(item: pytest.Item) -> None:
    item.stash[STORY_RUNS] = []


@pytest.fixture(scope="session")
def templates() -> Generator[TemplateDatabases]:
    TemplateDatabases.remove_stale_working_folders(time.time())
    databases = TemplateDatabases(run_template_folder())
    yield databases
    FileAccess.rmtree(databases.working_folder, True)


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
        if TEMPLATE_FILES in request.config.stash:
            touched = TouchedCode.read(templates.template(modules, fixture).home.folder)
            request.config.stash[TEMPLATE_FILES][item.nodeid] = sorted({*request.config.stash[TEMPLATE_FILES].get(item.nodeid, []), *touched})
        return story
    yield started
    for steps in created if item.stash.get(CALL_PASSED, False) else []:
        overlap.add(item.nodeid, steps.start, steps.lines(), steps.path(), steps.fixture, steps.checks())
        steps.story.close()
    created.clear()
    if item.stash.get(CALL_PASSED, False):
        FileAccess.rmtree(tmp_path, ignore_errors=True)


@pytest.hookimpl(wrapper=True)
def pytest_runtest_makereport(item: pytest.Item, call: pytest.CallInfo[None]) -> Generator[None, pytest.TestReport, pytest.TestReport]:
    report = yield
    if report.when == "call":
        item.stash[CALL_PASSED] = report.passed
    return report


def pytest_report_teststatus(report: pytest.TestReport | pytest.CollectReport, config: pytest.Config) -> None:
    # The one hook that gets a report and the config, and the controller of a run with -n hears every runner's reports in it.
    # A file that fails to import sends its collection report here too, and that report has no duration.
    if isinstance(report, pytest.CollectReport):
        return
    config.stash[RUN_DURATIONS].add(report.nodeid, report.duration)
    if report.failed:
        config.stash[FAILED_TESTS].add(report.nodeid)


@pytest.hookimpl(wrapper=True)
def pytest_runtest_protocol(item: pytest.Item, nextitem: pytest.Item | None) -> Generator[None, object, object]:
    started = time.thread_time()
    recorder = item.config.stash.get(RECORDER, None)
    if recorder is not None:
        recorder.begin_test()
    try:
        return (yield)
    finally:
        item.config.stash[RUN_CPU].add(time.thread_time() - started)
        if recorder is not None:
            recorder.finish_test(item.nodeid)


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
        overrun = budget.overrun(steps.points)
        if overrun:
            pytest.fail(overrun, pytrace=False)


def story_budget(item: pytest.Item) -> StoryBudget:
    marker = item.get_closest_marker(BUDGET_MARKER)
    if marker is None:
        return StoryBudget()
    return StoryBudget(points=marker.kwargs.get("points", POINTS_BUDGET))


@pytest.hookimpl(optionalhook=True)
def pytest_testnodedown(node: pytest.Session, error: object) -> None:
    output: dict[str, dict[str, list[str]]] = getattr(node, "workeroutput", {})
    node.config.stash[STORY_OVERLAP].stories.update(output.get(STORY_STEPS_KEY, {}))
    node.config.stash[STORY_OVERLAP].story_paths.update(output.get(STORY_PATHS_KEY, {}))
    node.config.stash[STORY_OVERLAP].story_fixtures.update(getattr(node, "workeroutput", {}).get(STORY_FIXTURES_KEY, {}))
    node.config.stash[STORY_OVERLAP].add_checks(output.get(STORY_CHECKS_KEY, {}))
    node.config.stash[RUN_CPU].add(float(getattr(node, "workeroutput", {}).get(CPU_SECONDS_KEY, 0.0)))
    if RECORDER in node.config.stash:
        node.config.stash[RECORDER].tests.update(output.get(TEST_MAP_KEY, {}).get("functions", {}))
        node.config.stash[TEMPLATE_FILES].update(output.get(TEST_MAP_KEY, {}).get("template_files", {}))


def pytest_sessionfinish(session: pytest.Session) -> None:
    overlap = session.config.stash[STORY_OVERLAP]
    process_output: dict[str, object] | None = getattr(session.config, "workeroutput", None)
    if process_output is not None:
        process_output[STORY_STEPS_KEY] = overlap.stories
        process_output[STORY_PATHS_KEY] = overlap.story_paths
        process_output[STORY_FIXTURES_KEY] = overlap.story_fixtures
        process_output[STORY_CHECKS_KEY] = {name: sorted(checks) for name, checks in overlap.story_checks.items()}
        process_output[CPU_SECONDS_KEY] = session.config.stash[RUN_CPU].seconds
        if RECORDER in session.config.stash:
            session.config.stash[RECORDER].stop()
            process_output[TEST_MAP_KEY] = {"functions": session.config.stash[RECORDER].tests, "template_files": session.config.stash[TEMPLATE_FILES]}
        return
    option = session.config.option
    is_full_run = RunSize(session.config.args, 1).is_full_run(option.keyword, option.markexpr, option.deselect or (), bool(getattr(option, "lf", False)))
    if is_full_run and not option.collectonly:
        selection = AffectedTests(TestMap.read())
        arguments = tuple(selection.arguments(selection.changed_files()))
        missed = SelectionMisses(arguments).missed(session.config.stash[FAILED_TESTS])
        session.config.stash[MISSED_TESTS] = missed
        record = FullRunRecord(session.testscollected, session.testsfailed, time.monotonic() - session.config.stash[RUN_START], session.config.stash[RUN_CPU].seconds,
                               len(arguments), len(missed))
        session.config.stash[FULL_RUN] = record
        FullRunRecords.add(record)
        session.config.stash[RUN_DURATIONS].write()
    if RECORDER in session.config.stash:
        session.config.stash[RECORDER].stop()
        TestMap(session.config.stash[RECORDER].tests, session.config.stash[TEMPLATE_FILES]).with_bodies().write()
    lines = [*overlap.report_lines(is_full_run), *fixture_rule_lines(session.config, overlap)]
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
        for test in config.stash.get(MISSED_TESTS, []):
            terminalreporter.write_line(f"the selector would have missed {test}")
    fixture_summary = config.stash.get(FIXTURE_SUMMARY, None)
    if fixture_summary is not None:
        terminalreporter.write_line(fixture_summary)
    run_folder = config.stash.get(RUN_FOLDER, None)
    if run_folder is not None:
        TempFolders().finish(run_folder, exitstatus == pytest.ExitCode.OK)
