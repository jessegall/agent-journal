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
PIN_HINT = "the pinned map differs from the code: run journal map --write and commit tests/snapshots/map.txt"
MARKER = "class {name}Area(EngineArea):\n    summary = \"{summary}\"\n    use = AreaUse.CONTRACT\n"


def map_lines() -> list[str]:
    return CodeMap(SOURCE, FileAccess()).lines()


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


def test_the_map_write_saves_the_map_of_the_checkout_the_journal_runs_for(new_story):
    story = new_story(fixture=UserJoined)
    checkout = story.home.project_folder
    small_tree(checkout)
    pinned = checkout / "tests" / "snapshots" / "map.txt"
    pinned.parent.mkdir(parents=True)
    pinned.write_text("an old map\n")
    story.run("map --write", actor=story.user).expect_code(0)
    expect_value(pinned.read_text(), CodeMap(checkout / "src", FileAccess()).text())


def test_the_map_write_is_refused_in_a_checkout_with_no_snapshots_folder(new_story):
    story = new_story(fixture=UserJoined)
    small_tree(story.home.project_folder)
    story.expect_refusal("map --write", "has no tests/snapshots folder to save the map in", actor=story.user)


