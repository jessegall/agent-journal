import importlib.util
import json
import re
from pathlib import Path

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.module.module_sync import ModuleSync
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


def test_335_the_first_moved_error_sits_in_the_engine_unchanged_and_every_site_that_raises_it_names_it_there(new_story):
    story = new_story()
    moved_file = SOURCE_FOLDER / "engine" / "errors" / f"{FIRST_MOVED_ERROR}.py"
    texts = source_texts()
    raising_sites = [path for path, text in texts.items() if "raise CodeVersionMissingError" in text and not path.endswith(f"{FIRST_MOVED_ERROR}.py")]
    story.expect_rows(moved_file.is_file(), not (SOURCE_FOLDER / "core" / "base" / f"{FIRST_MOVED_ERROR}.py").exists(), "class CodeVersionMissingError(" in moved_file.read_text())
    story.expect_rows(raising_sites, all(f"from engine.errors.{FIRST_MOVED_ERROR} import CodeVersionMissingError" in texts[path] for path in raising_sites), detail=str(raising_sites))


def test_337_each_of_the_eleven_errors_and_refusals_sits_in_the_engine_and_no_file_names_the_old_place(new_story):
    story = new_story()
    missing = [name for name in MOVED_ERRORS if not (SOURCE_FOLDER / "engine" / "errors" / f"{name}.py").is_file()]
    twins = [name for name in MOVED_ERRORS if (SOURCE_FOLDER / "core" / "base" / f"{name}.py").exists()]
    refusal_importers = [path for path, text in source_texts().items() if path.startswith("src/core/modules/") and "from engine.errors.refusal import Refusal" in text]
    story.expect_rows(not missing, not twins, files_naming_the_old_place(MOVED_ERRORS) == [], len(refusal_importers) > 300, detail=f"{missing} {twins} {len(refusal_importers)}")


def test_338_the_moved_enums_sit_in_the_engine_and_no_file_names_the_old_place(new_story):
    story = new_story()
    enums = sorted(path.stem for path in (SOURCE_FOLDER / "engine" / "enums").glob("*.py") if path.stem != "__init__")
    twins = [name for name in enums if (SOURCE_FOLDER / "core" / "base" / f"{name}.py").exists()]
    story.expect_rows(len(enums) >= MOVED_ENUM_COUNT, not twins, files_naming_the_old_place(enums) == [], detail=f"{enums} {twins}")


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


def test_347_the_plugin_contract_names_no_old_place_and_a_plugin_naming_a_moved_path_is_listed_not_rewritten(new_story, tmp_path):
    story = new_story()
    contract = (ROOT / "tests" / "snapshots" / "plugin_event_contract.json").read_text()
    move_tool = loaded_script("move_class_file")
    project = tmp_path / "project"
    sample_file(project, SAMPLE_SOURCE, SAMPLE_CLASS)
    manifest = sample_file(project, ".journal/plugins/sample/journal-plugin.json", '{"reads": "core.base.sample_error"}\n')
    report = move_tool.move_path(project, project / SAMPLE_SOURCE, project / SAMPLE_TARGET)
    story.expect_rows(json.loads(contract), not re.search(rf"core\.base\.({'|'.join((*MOVED_ERRORS, FIRST_MOVED_ERROR))})\b", contract))
    story.expect_rows("not rewritten, a plugin: .journal/plugins/sample/journal-plugin.json" in report, "core.base.sample_error" in manifest.read_text())


def test_348_a_move_and_a_change_of_the_same_import_on_two_branches_meet_at_the_merge_as_an_import_line(new_story, tmp_path):
    story = new_story()
    move_tool = loaded_script("move_class_file")
    repository = GitRepository.sample(tmp_path / "repository")
    folder = repository.folder
    sample_file(folder, SAMPLE_SOURCE, SAMPLE_CLASS)
    importer = sample_file(folder, "src/core/user.py", "from core.base.sample_error import SampleError\n\n\ndef fail():\n    raise SampleError()\n")
    repository.git("add", "--all")
    repository.git("commit", "-m", "A class and its importer")
    repository.git("checkout", "-b", "importing-worker")
    importer.write_text(importer.read_text().replace("import SampleError\n", "import SampleError as CartError\n").replace("raise SampleError()", "raise CartError()"))
    repository.git("commit", "--all", "-m", "The importer names the class anew")
    repository.git("checkout", "main")
    move_tool.move_path(folder, folder / SAMPLE_SOURCE, folder / SAMPLE_TARGET)
    repository.git("add", "--all")
    repository.git("commit", "-m", "Move the class")
    merge = repository.git("merge", "importing-worker")
    merged_text = importer.read_text()
    conflict_blocks = re.findall(r"<<<<<<<[^\n]*\n(.*?)>>>>>>>", merged_text, re.S)
    conflicted = [line for block in conflict_blocks for line in block.splitlines() if line and not line.startswith("=======")]
    story.expect_rows(merge.returncode != 0, len(conflict_blocks) == 1, detail=merge.stdout + merge.stderr)
    story.expect_rows(conflicted, all(line.startswith("from ") for line in conflicted), detail=merged_text)
