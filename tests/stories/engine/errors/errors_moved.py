import importlib.util
import json
import re
from pathlib import Path

from engine.database.database import Database
from engine.database.statement import Statement
from engine.module.module_sync import ModuleSync
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository

ROOT = Path(__file__).resolve().parents[4]
SOURCE_FOLDER = ROOT / "src"
MOVED_ERRORS = ("block_refusal", "deadline_passed_error", "duration_error", "missing_file_refusal", "missing_hint_error", "missing_rows_error", "refusal",
                "server_files_error", "unbound_value_error", "user_approval_refusal", "wrong_instance_error")
FIRST_MOVED_ERROR = "code_version_missing_error"
MOVED_ENUM_COUNT = 13
SAMPLE_SOURCE = "src/core/base/sample_error.py"
SAMPLE_TARGET = "src/engine/errors/sample_error.py"
SAMPLE_CLASS = "class SampleError(Exception):\n    pass\n"
REGISTRY_PATH = "engine.caller.caller_resolver"
PREVIOUS_PATH = "core.previous.caller_resolver"
REGISTRY_ROW = Statement("SELECT fingerprint, entries FROM registry WHERE id = 1")
COUNTED_TABLES = ("actors", "migrations", "registry")


def loaded_script(name: str):
    specification = importlib.util.spec_from_file_location(f"{name}_story", ROOT / "scripts" / f"{name}.py")
    script = importlib.util.module_from_spec(specification)
    specification.loader.exec_module(script)
    return script


def source_texts() -> dict[str, str]:
    return {str(path.relative_to(ROOT)): path.read_text() for path in SOURCE_FOLDER.rglob("*.py") if "__pycache__" not in path.parts}


def files_naming_the_old_place(names) -> list[str]:
    old_place = re.compile(rf"core\.base\.({'|'.join(names)})\b")
    return sorted(path for path, text in source_texts().items() if old_place.search(text))


def sample_file(root: Path, relative: str, text: str) -> Path:
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


def registry_entries(story) -> str:
    return str(story.container.get(Database).rows(REGISTRY_ROW)[0][1])


def row_counts(story) -> dict[str, int]:
    database = story.container.get(Database)
    return {table: database.rows(Statement(f"SELECT count(*) FROM {table}"))[0][0] for table in COUNTED_TABLES}


def test_345_a_registry_written_after_a_move_differs_from_the_one_of_the_old_place_only_in_the_moved_path(new_story):
    story = new_story()
    move_check = loaded_script("move_check")
    current = registry_entries(story)
    recorded = current.replace(REGISTRY_PATH, PREVIOUS_PATH)
    story.expect_rows(recorded != current, move_check.registry_differences(recorded, current, {PREVIOUS_PATH: REGISTRY_PATH}) == [])
    story.expect_rows(move_check.registry_differences(recorded, current, {}) != [])


def test_346_a_journal_synced_at_the_old_place_syncs_after_the_move_and_loses_no_row(new_story):
    story = new_story()
    database = story.container.get(Database)
    counted = row_counts(story)
    database.update(Statement("UPDATE registry SET fingerprint = ?, entries = ? WHERE id = 1", ("synced-at-the-old-place", registry_entries(story).replace(REGISTRY_PATH, PREVIOUS_PATH))))
    story.expect_rows(PREVIOUS_PATH in registry_entries(story))
    story.container.get(ModuleSync).run()
    entries = registry_entries(story)
    story.expect_rows(PREVIOUS_PATH not in entries, REGISTRY_PATH in entries, row_counts(story) == counted, detail=str(row_counts(story)))


