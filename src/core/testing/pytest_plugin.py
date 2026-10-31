import os
from collections.abc import Callable
from pathlib import Path

import pytest

from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from core.testing.story_overlap import StoryOverlap
from core.testing.template_databases import TemplateDatabases

STORY_OVERLAP = pytest.StashKey[StoryOverlap]()
CURRENT_TEST_VARIABLE = "PYTEST_CURRENT_TEST"


@pytest.fixture(scope="session")
def templates(tmp_path_factory: pytest.TempPathFactory) -> TemplateDatabases:
    return TemplateDatabases(tmp_path_factory.mktemp("templates"))


@pytest.fixture
def new_story(templates: TemplateDatabases, tmp_path: Path, request: pytest.FixtureRequest) -> Callable[..., Story]:
    overlap = request.config.stash.setdefault(STORY_OVERLAP, StoryOverlap())

    def started(*modules: str, fixture: type[StoryFixture] | None = None) -> Story:
        story = templates.story(tmp_path / "journal", modules, fixture)
        overlap.add(os.environ.get(CURRENT_TEST_VARIABLE, "").split(" ")[0], story)
        return story
    return started


def pytest_terminal_summary(terminalreporter: pytest.TerminalReporter, config: pytest.Config) -> None:
    overlap = config.stash.get(STORY_OVERLAP, None)
    for line in overlap.report_lines() if overlap else ():
        terminalreporter.write_line(line)
