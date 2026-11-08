from collections.abc import Callable, Generator
import time
from pathlib import Path

import pytest

from core.base.registry.lazy_loading import LazyLoading
from core.testing.run_size import RunSize
from core.testing.full_run_record import FullRunRecord
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
RUN_START = pytest.StashKey[float]()
STORY_STEPS_KEY = "journal_story_steps"
TESTS_PER_WORKER_OPTION = "tests_per_worker"
MOST_WORKERS_OPTION = "most_workers"


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addini(TESTS_PER_WORKER_OPTION, "a run with -n starts one test runner for every started block of this many tests", default="250")
    parser.addini(MOST_WORKERS_OPTION, "the most test runners a run with -n starts", default="4")


@pytest.hookimpl(tryfirst=True)
def pytest_cmdline_main(config: pytest.Config) -> None:
    if not config.getoption("numprocesses", None):
        return
    per_worker, most = int(config.getini(TESTS_PER_WORKER_OPTION)), int(config.getini(MOST_WORKERS_OPTION))
    workers = RunSize(config.args, per_worker * most).workers(per_worker, most)
    config.option.numprocesses = 0 if workers == 1 else workers


def pytest_configure(config: pytest.Config) -> None:
    LazyLoading.always_prevented = True
    config.stash[RUN_START] = time.monotonic()
    config.addinivalue_line("markers", f"{BUDGET_MARKER}(points, cpu_seconds, reason): a story that may cost more than the default budget, and why")
    config.stash[STORY_OVERLAP] = StoryOverlap()
    if config.option.basetemp is None and not hasattr(config, "workerinput"):
        config.stash[RUN_FOLDER] = config.option.basetemp = TempFolders().start()


def pytest_itemcollected(item: pytest.Item) -> None:
    item.stash[STORY_RUNS] = []


@pytest.fixture(scope="session")
def templates() -> TemplateDatabases:
    return TemplateDatabases(TemplateCache().folder())


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


def pytest_sessionfinish(session: pytest.Session) -> None:
    overlap = session.config.stash[STORY_OVERLAP]
    process_output: dict[str, object] | None = getattr(session.config, "workeroutput", None)
    if process_output is not None:
        process_output[STORY_STEPS_KEY] = overlap.stories
        return
    if RunSize(session.config.args, 1).is_whole_suite() and not session.config.option.collectonly:
        FullRunRecord(session.testscollected, session.testsfailed, time.monotonic() - session.config.stash[RUN_START]).write()
    lines = overlap.report_lines()
    if not lines:
        return
    report = pytest.TestReport(nodeid="stories::shared_first_steps", location=("stories", 0, "shared_first_steps"),
                               keywords={}, outcome="failed", longrepr="\n".join(lines), when="call", sections=[])
    session.config.hook.pytest_runtest_logreport(report=report)
    if session.exitstatus == pytest.ExitCode.OK:
        session.exitstatus = pytest.ExitCode.TESTS_FAILED


def pytest_terminal_summary(config: pytest.Config, exitstatus: int) -> None:
    run_folder = config.stash.get(RUN_FOLDER, None)
    if run_folder is not None:
        TempFolders().finish(run_folder, exitstatus == pytest.ExitCode.OK)
