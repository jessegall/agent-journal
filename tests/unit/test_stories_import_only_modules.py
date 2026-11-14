import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORIES = ROOT / "tests" / "stories"
LIST_FILE = STORIES / "engine_import_story_files.txt"
FORBIDDEN = ("engine", "server", "install", "tunnels")
STORY_KIT = ("engine.testing",)
WHAT_TO_DO = "a story imports only modules, suites and the story kit (user 124518): what needs the engine, the server, install or a tunnel is a unit test"


def forbidden_imports(path: Path) -> list[str]:
    found = []
    for node in ast.walk(ast.parse(path.read_text())):
        if isinstance(node, ast.Import):
            names = [alias.name for alias in node.names]
        elif isinstance(node, ast.ImportFrom) and not node.level:
            names = [node.module or ""]
        else:
            continue
        found += [name for name in names if name.split(".")[0] in FORBIDDEN and not name.startswith(STORY_KIT)]
    return found


def story_files() -> list[Path]:
    return [path for path in sorted(STORIES.rglob("*.py")) if "__pycache__" not in path.parts]


def listed() -> list[str]:
    return [line.strip() for line in LIST_FILE.read_text().splitlines() if line.strip() and not line.lstrip().startswith("#")]


def test_no_unlisted_story_file_imports_the_engine_the_server_install_or_a_tunnel():
    allowed = set(listed())
    reaching = [f"{path.relative_to(ROOT)}: {', '.join(forbidden_imports(path))}" for path in story_files() if path.relative_to(ROOT).as_posix() not in allowed and forbidden_imports(path)]
    assert reaching == [], WHAT_TO_DO


def test_every_listed_story_file_still_imports_one():
    stale = [line for line in listed() if not (ROOT / line).exists() or not forbidden_imports(ROOT / line)]
    assert stale == [], "remove this line from engine_import_story_files.txt"


def test_the_list_is_sorted_with_no_repeats():
    assert listed() == sorted(set(listed()))


def test_the_scan_names_a_forbidden_import_and_passes_the_story_kit(tmp_path):
    sample = tmp_path / "sample.py"
    sample.write_text("from engine.command.bus import Bus\nfrom engine.testing.stories.story import Story\nimport server.server\nfrom core.modules.tasks.models.task import Task\n")
    assert forbidden_imports(sample) == ["engine.command.bus", "server.server"]
