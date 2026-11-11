import ast
from pathlib import Path

TESTS_FOLDER = Path(__file__).resolve().parents[1]
FIXTURE_STEPS = "steps"
COPY_CALLS = ("copy", "copyfile", "copy2")
DATABASE_WORDS = ("database", ".db")
STORIES_PREFIX = "tests/stories/"


def fixture_class_names(tree: ast.Module) -> set[str]:
    return {node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef) and any(getattr(base, "id", "") == "StoryFixture" for base in node.bases)}


def fixture_builds_outside_fixtures(path: Path) -> list[int]:
    tree = ast.parse(path.read_text())
    fixture_lines = {line for node in ast.walk(tree) if isinstance(node, ast.ClassDef) and node.name in fixture_class_names(tree)
                     for line in range(node.lineno, (node.end_lineno or node.lineno) + 1)}
    builds = [node for node in ast.walk(tree) if isinstance(node, ast.Call) and getattr(node.func, "attr", "") == FIXTURE_STEPS
              and isinstance(getattr(node.func, "value", None), ast.Call)]
    return sorted(node.lineno for node in builds if node.lineno not in fixture_lines)


def database_copies(path: Path) -> list[int]:
    tree = ast.parse(path.read_text())
    copies = [node for node in ast.walk(tree) if isinstance(node, ast.Call) and getattr(node.func, "attr", "") in COPY_CALLS
              and any(word in ast.unparse(argument) for argument in node.args for word in DATABASE_WORDS)]
    return sorted(node.lineno for node in copies)


def found(check) -> list[str]:
    return [f"{path.relative_to(TESTS_FOLDER.parent)}:{line}" for path in sorted(TESTS_FOLDER.rglob("*.py")) if path != Path(__file__).resolve() for line in check(path)]


def test_no_story_builds_a_story_fixture_in_its_own_body():
    builds = [line for line in found(fixture_builds_outside_fixtures) if line.startswith(STORIES_PREFIX)]
    assert builds == [], "start the story from a fixture that holds those steps: new_story(fixture=...)"


def test_no_test_copies_a_database():
    assert found(database_copies) == [], "a story runs on its template's working journal and rolls back; it never copies a database"


def test_the_scans_find_a_fixture_built_in_a_test_and_a_copied_database(tmp_path):
    sample = tmp_path / "sample_test.py"
    sample.write_text("import shutil\n\n\ndef test_it(story, home):\n    UserJoined().steps(story)\n    shutil.copyfile(home.database, 'copy.db')\n")
    assert (fixture_builds_outside_fixtures(sample), database_copies(sample)) == ([5], [6])
