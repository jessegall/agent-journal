import os
from pathlib import Path

import pytest

from core.testing.pytest_plugin import new_story, pytest_terminal_summary, templates

STORY_FIXTURES = (new_story, templates, pytest_terminal_summary)
STORY_SUPPORT_FOLDER = "support"
os.environ.pop("JOURNAL_AGENT_SESSION", None)

def pytest_collect_file(file_path: Path, parent: pytest.Collector):
    is_story = "stories" in file_path.parts and STORY_SUPPORT_FOLDER not in file_path.parts and file_path.suffix == ".py" and file_path.name != "__init__.py"
    if is_story and not file_path.name.startswith("test_") and not parent.session.isinitpath(file_path):
        return pytest.Module.from_parent(parent, path=file_path)
    return None
