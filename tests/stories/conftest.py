from pathlib import Path

import pytest

from tests.stories.builder.story import Story
from tests.stories.builder.template_databases import TemplateDatabases


@pytest.fixture(scope="session")
def templates(tmp_path_factory) -> TemplateDatabases:
    return TemplateDatabases(tmp_path_factory.mktemp("templates"))


@pytest.fixture
def story_on(templates, tmp_path):
    def started(*modules: str) -> Story:
        return Story(templates, tmp_path / "journal", modules)
    return started


def pytest_collect_file(file_path: Path, parent: pytest.Collector):
    is_story = file_path.suffix == ".py" and file_path.name != "conftest.py" and "builder" not in file_path.parts and file_path.name != "__init__.py"
    if is_story and not file_path.name.startswith("test_"):
        return pytest.Module.from_parent(parent, path=file_path)
    return None
