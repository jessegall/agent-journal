from pathlib import Path
from types import SimpleNamespace

from core.modules import DEFAULT_MODULES
from suites import DEFAULT_SUITES

ROOT = Path(__file__).resolve().parents[4]
STORIES = ROOT / "tests" / "stories"
# a module whose stories sit outside its own story folder, with the path they are at
MOVED_STORIES = {"journal.core.tunnel": "tests/stories/server/server_tunnel.py", "journal.core.claude_code": "tests/unit/core/modules/claude_code"}


def stories_path(module) -> Path:
    return STORIES / Path(module.__module__.replace(".", "/")).parent


def modules_without_stories(modules, placed) -> list[str]:
    return sorted(module.name for module in modules if not any(stories_path(module).glob("*.py")) and not (ROOT / placed.get(module.name, "none")).exists())


def test_every_module_has_stories():
    assert modules_without_stories((*DEFAULT_MODULES, *DEFAULT_SUITES), MOVED_STORIES) == []


def test_a_module_with_no_stories_is_found():
    lonely = SimpleNamespace(__module__="core.modules.lonely.lonely_module", name="journal.core.lonely")

    assert modules_without_stories([lonely], {}) == ["journal.core.lonely"]
