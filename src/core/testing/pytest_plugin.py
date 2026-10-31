from collections.abc import Callable
from pathlib import Path

import pytest

from core.testing.story import Story
from core.testing.template_databases import TemplateDatabases


@pytest.fixture(scope="session")
def templates(tmp_path_factory: pytest.TempPathFactory) -> TemplateDatabases:
    return TemplateDatabases(tmp_path_factory.mktemp("templates"))


@pytest.fixture
def new_story(templates: TemplateDatabases, tmp_path: Path) -> Callable[..., Story]:
    def started(*modules: str) -> Story:
        return Story.started(templates, tmp_path / "journal", modules)
    return started
