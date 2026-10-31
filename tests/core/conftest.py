from pathlib import Path

import pytest

from core.testing.pytest_plugin import new_story, templates

STORY_FIXTURES = (new_story, templates)

def pytest_collect_file(file_path: Path, parent: pytest.Collector):
    in_stories = "stories" in file_path.parts or "modules" in file_path.parts
    is_story = in_stories and file_path.suffix == ".py" and file_path.name not in ("conftest.py", "__init__.py", "samples.py")
    if is_story and not file_path.name.startswith("test_"):
        return pytest.Module.from_parent(parent, path=file_path)
    return None
