import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SERVER_STORIES = ROOT / "tests" / "stories" / "server"
# what is left for task 10187 (viewer_read_counts, viewer_hook_events, library_client); it only goes down, to 0
SERVER_STORY_LIMIT = 0
WHAT_TO_DO = ("the server folder holds no stories (user 124510): a check of the server's machinery is an integration test under tests/integration, "
              "and what an agent or a person sees through the server is a story in its module's folder")


def story_count(folder: Path) -> int:
    count = 0
    for path in folder.rglob("*.py"):
        if "support" in path.parts or "__pycache__" in path.parts:
            continue
        for node in ast.parse(path.read_text()).body:
            members = node.body if isinstance(node, ast.ClassDef) else [node]
            count += sum(1 for member in members if isinstance(member, (ast.FunctionDef, ast.AsyncFunctionDef)) and member.name.startswith("test_"))
    return count


def test_the_server_story_folder_only_shrinks():
    assert story_count(SERVER_STORIES) <= SERVER_STORY_LIMIT, WHAT_TO_DO


def test_the_count_reads_tests_and_skips_support(tmp_path):
    (tmp_path / "support").mkdir()
    (tmp_path / "support" / "helper.py").write_text("def test_not_a_story():\n    pass\n")
    (tmp_path / "routes.py").write_text("def test_one():\n    pass\n\n\nclass TestGroup:\n    def test_two(self):\n        pass\n\n\ndef helper():\n    pass\n")
    assert story_count(tmp_path) == 2
