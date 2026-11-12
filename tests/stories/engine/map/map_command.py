from pathlib import Path

import pytest

from engine.file.file_access import FileAccess
from engine.map.code_map import TOP_FOLDERS, CodeMap
from engine.map.errors.missing_summary_error import MissingSummaryError
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

ROOT = Path(__file__).resolve().parents[4]
SOURCE = ROOT / "src"
PINNED_MAP = ROOT / "tests" / "snapshots" / "map.txt"
HOW_TO_PIN = "the pinned map differs from the code: run journal map --write and commit tests/snapshots/map.txt"
MARKER = "class {name}Area(EngineArea):\n    summary = \"{summary}\"\n    use = AreaUse.CONTRACT\n"


def map_lines() -> list[str]:
    return CodeMap(SOURCE, FileAccess.shared()).lines()


def top_folder_lines(top: str) -> list[str]:
    lines = map_lines()
    start = next(index for index, line in enumerate(lines) if line.startswith(f"{top}  "))
    following = lines[start + 1:]
    end = next((index for index, line in enumerate(following) if not line.startswith(" ")), len(following))
    return following[:end]


def small_tree(root: Path) -> Path:
    marker = root / "src" / "engine" / "clock" / "clock_area.py"
    marker.parent.mkdir(parents=True)
    marker.write_text(MARKER.format(name="Clock", summary="Tells the time."))
    return root / "src"


def test_443_the_map_command_prints_seven_top_folders_with_one_line_for_every_one(new_story):
    story = new_story(fixture=UserJoined)
    (story.home.project_folder / "src").symlink_to(SOURCE, target_is_directory=True)
    text = story.run("map", actor=story.user)
    text.expect_code(0)
    tops = [line for line in map_lines() if not line.startswith(" ")]
    story.expect_rows([line.split("  ")[0] for line in tops] == list(TOP_FOLDERS), len(tops) == 7, all(line.split("  ", 1)[1].strip() for line in tops), detail=str(tops))
    for line in tops:
        text.expect_text(line)


def test_444_the_engine_areas_show_contract_areas_first_and_internal_ones_after_with_one_line_for_every_area(new_story):
    story = new_story()
    lines = top_folder_lines("engine")
    areas = sorted(folder.name for folder in (SOURCE / "engine").iterdir() if folder.is_dir() and folder.name not in ("__pycache__", "errors", "enums") and not CodeMap.holds_only_caches(folder))
    shown = [line.split("  ")[2] for line in lines if line.startswith("    ")]
    story.expect_rows(lines.index("  contract") < lines.index("  internal"), sorted(shown) == areas, detail=str(sorted(set(areas) ^ set(shown))))
    story.expect_rows(all(len(line.strip().split("  ", 1)) == 2 for line in lines if line.startswith("    ")), detail="an area line has no summary")


def test_445_every_core_module_shows_its_purpose_and_the_modules_it_needs(new_story):
    story = new_story()
    lines = top_folder_lines("core")
    modules = sorted(folder.name for folder in (SOURCE / "core" / "modules").iterdir() if folder.is_dir() and folder.name != "__pycache__")
    tasks_line = next(line for line in lines if line.startswith("  tasks  "))
    story.expect_rows([line.split("  ")[1] for line in lines] == modules, "Needs: " in tasks_line, "Adds tasks" in tasks_line, detail=tasks_line)


def test_446_a_folder_with_no_summary_is_refused_with_the_folder_and_the_instruction(new_story, tmp_path):
    story = new_story()
    source = small_tree(tmp_path)
    (source / "engine" / "ledger").mkdir()
    with pytest.raises(MissingSummaryError) as raised:
        CodeMap(source, FileAccess.shared()).text()
    story.expect_rows(raised.value.folder == "src/engine/ledger", "write src/engine/ledger/ledger_area.py" in raised.value.instruction, detail=str(raised.value))


def test_447_a_new_folder_shows_as_a_new_line_and_the_pinned_map_is_the_map_of_the_code(new_story, tmp_path):
    story = new_story()
    source = small_tree(tmp_path)
    first = CodeMap(source, FileAccess.shared()).lines()
    marker = source / "engine" / "ledger" / "ledger_area.py"
    marker.parent.mkdir()
    marker.write_text(MARKER.format(name="Ledger", summary="Counts what was spent."))
    second = CodeMap(source, FileAccess.shared()).lines()
    story.expect_rows(sorted(set(second) - set(first)) == ["    ledger  Counts what was spent."], detail=str(second))
    story.expect_rows("\n".join(map_lines()) + "\n" == PINNED_MAP.read_text(), detail=HOW_TO_PIN)


def test_450_the_core_modules_are_one_line_for_every_module_and_no_tree_of_their_folders(new_story):
    story = new_story()
    lines = top_folder_lines("core")
    story.expect_rows(all(line.startswith("  ") and not line.startswith("   ") for line in lines), detail="a line below a module")
    story.expect_rows(not any("commands" == line.strip().split("  ")[0] for line in lines), detail="a folder of a module is shown")


def test_451_a_marker_that_cannot_be_read_fails_with_the_folder_and_writes_no_half_map(new_story, tmp_path):
    story = new_story()
    source = small_tree(tmp_path)
    broken = source / "engine" / "ledger" / "ledger_area.py"
    broken.parent.mkdir()
    broken.write_text("class LedgerArea(:\n")
    pinned = tmp_path / "map.txt"
    with pytest.raises(MissingSummaryError) as raised:
        pinned.write_text(CodeMap(source, FileAccess.shared()).text())
    story.expect_rows(raised.value.folder == "src/engine/ledger", not pinned.exists(), detail=str(raised.value))


def test_452_a_pinned_map_edited_by_hand_differs_from_the_map_of_the_code(new_story):
    story = new_story()
    generated = "\n".join(map_lines()) + "\n"
    edited = PINNED_MAP.read_text().replace("engine  ", "engine  By hand: ", 1)
    story.expect_rows(edited != generated, PINNED_MAP.read_text() == generated, detail=HOW_TO_PIN)


def test_the_map_write_saves_the_map_of_the_checkout_the_journal_runs_for(new_story):
    story = new_story(fixture=UserJoined)
    checkout = story.home.project_folder
    small_tree(checkout)
    pinned = checkout / "tests" / "snapshots" / "map.txt"
    pinned.parent.mkdir(parents=True)
    pinned.write_text("an old map\n")
    story.run("map --write", actor=story.user).expect_code(0)
    expect_value(pinned.read_text(), CodeMap(checkout / "src", FileAccess.shared()).text())


def test_the_map_write_is_refused_in_a_checkout_with_no_snapshots_folder(new_story):
    story = new_story(fixture=UserJoined)
    small_tree(story.home.project_folder)
    story.expect_refusal("map --write", "has no tests/snapshots folder to save the map in", actor=story.user)


def test_a_folder_left_with_only_its_cache_after_a_move_is_no_line_of_the_map(new_story, tmp_path):
    story = new_story()
    source = small_tree(tmp_path)
    (source / "engine" / "ledger" / "__pycache__").mkdir(parents=True)
    expect_value(CodeMap(source, FileAccess.shared()).lines(), ["engine  " + TOP_FOLDERS["engine"], "  contract", "    clock  Tells the time."])
