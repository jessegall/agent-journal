from pathlib import Path

from suites.coding.coding_module import CodingModule
from tests.stories.core.support.fixtures import UserJoined

SKILL = next(skill for skill in CodingModule.skills if skill.folder == "journal-test-draining")
WITHOUT_FULL_RERUN = next(line for line in Path(f"src/suites/coding/skills/{SKILL.folder}/{SKILL.file}").read_text().splitlines() if "Never run the full suite" in line)


def test_the_test_draining_skill_ships_and_teaches_one_file_drained_before_a_full_rerun(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("skill list", f"{SKILL.folder}  {SKILL.description}", actor=story.user)
    story.expect_success(f"skill show {SKILL.folder}", WITHOUT_FULL_RERUN, actor=story.user)
