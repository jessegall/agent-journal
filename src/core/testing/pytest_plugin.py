import os
from collections.abc import Callable, Generator
from pathlib import Path

import pytest
from xdist.workermanage import WorkerController

from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from core.testing.story_overlap import StoryOverlap
from core.testing.story_steps import StorySteps
from core.testing.template_databases import TemplateDatabases

STORY_OVERLAP = pytest.StashKey[StoryOverlap]()
STORY_RUNS = pytest.StashKey[list[StorySteps]]()
STORY_STEPS_KEY = "journal_story_steps"
XDIST_WORKER_VARIABLE = "PYTEST_XDIST_WORKER"


def pytest_configure(config: pytest.Config) -> None:
    config.stash[STORY_OVERLAP] = StoryOverlap()


def pytest_itemcollected(item: pytest.Item) -> None:
    item.stash[STORY_RUNS] = []


@pytest.fixture(scope="session")
def templates(tmp_path_factory: pytest.TempPathFactory) -> TemplateDatabases:
    run_folder = tmp_path_factory.getbasetemp().parent if XDIST_WORKER_VARIABLE in os.environ else tmp_path_factory.getbasetemp()
    folder = run_folder / "templates"
    folder.mkdir(exist_ok=True)
    return TemplateDatabases(folder)


@pytest.fixture
def new_story(templates: TemplateDatabases, tmp_path: Path, request: pytest.FixtureRequest) -> Generator[Callable[..., Story]]:
    overlap = request.config.stash[STORY_OVERLAP]
    created = request.node.stash[STORY_RUNS]

    def started(*modules: str, fixture: type[StoryFixture] | None = None) -> Story:
        story = templates.story(tmp_path / "journal", modules, fixture)
        created.append(StorySteps(story))
        return story
    yield started
    for steps in created:
        overlap.add(request.node.nodeid, steps.lines())


@pytest.hookimpl(wrapper=True, tryfirst=True)
def pytest_runtest_call(item: pytest.Item) -> Generator[None]:
    for steps in item.stash[STORY_RUNS]:
        steps.begin_test()
    try:
        yield
    finally:
        for steps in item.stash[STORY_RUNS]:
            steps.finish_test()


@pytest.hookimpl(optionalhook=True)
def pytest_testnodedown(node: WorkerController, error: object) -> None:
    output = getattr(node, "workeroutput", {})
    node.config.stash[STORY_OVERLAP].stories.update(output.get(STORY_STEPS_KEY, {}))


def pytest_sessionfinish(session: pytest.Session) -> None:
    overlap = session.config.stash[STORY_OVERLAP]
    if hasattr(session.config, "workeroutput"):
        session.config.workeroutput[STORY_STEPS_KEY] = overlap.stories
        return
    lines = overlap.report_lines()
    if not lines:
        return
    report = pytest.TestReport(nodeid="stories::shared_first_steps", location=("stories", 0, "shared_first_steps"),
                               keywords={}, outcome="failed", longrepr="\n".join(lines), when="call", sections=[])
    session.config.hook.pytest_runtest_logreport(report=report)
    if session.exitstatus == pytest.ExitCode.OK:
        session.exitstatus = pytest.ExitCode.TESTS_FAILED
