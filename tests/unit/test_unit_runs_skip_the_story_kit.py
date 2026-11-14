import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LOADED_BY_EVERY_RUN = (ROOT / "tests" / "conftest.py", ROOT / "src" / "engine" / "testing" / "pytest_wiring" / "pytest_plugin.py")
STORY_KIT = ("engine.testing.stories.story", "engine.testing.templates.template_databases", "tests.stories")


def module_level_imports(path: Path) -> list[str]:
    names = []
    for node in ast.parse(path.read_text()).body:
        if isinstance(node, ast.ImportFrom) and node.module:
            names.append(node.module)
        if isinstance(node, ast.Import):
            names.extend(alias.name for alias in node.names)
    return names


def test_the_files_every_run_loads_import_no_story_kit_at_module_level():
    found = [f"{path.relative_to(ROOT)}: {name}" for path in LOADED_BY_EVERY_RUN for name in module_level_imports(path) if name.startswith(STORY_KIT)]
    assert found == [], "import the story kit inside the hook or fixture that uses it, so a unit run never loads it"
