import pytest

from pathlib import Path

from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_absent_exists_parent_stale, expect_changed_with, expect_exists_version_four

GOOD = f"{PATH}:GoodSkillsModule"
PROGRAM_FOLDERS = (".claude/skills", ".agents/skills")


def skill_file(story, program_folder: str, folder: str) -> Path:
    return story.home.project_folder / program_folder / folder / "SKILL.md"


def story_with_skill_files(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.run("skill write")
    return story


def refused(new_story, module: str, text: str) -> None:
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:{module}", text)


def test_a_valid_skill_passes_at_sync(new_story):
    new_story(fixture=MainEnvironment).expect_sync_success(GOOD)


def test_a_skill_folder_used_twice_is_refused_at_sync(new_story):
    refused(new_story, "TwiceSkillsModule", "two skills named journal-notes")


def test_a_skill_folder_not_starting_with_journal_is_refused_at_sync(new_story):
    refused(new_story, "OutsideNameModule", "the skill notes does not start with journal")


def test_a_skill_with_no_file_is_refused_at_sync(new_story):
    refused(new_story, "MissingFileModule", "the skill journal-absent has no SKILL.md in its module's skills folder")


def test_a_skill_naming_an_event_no_model_has_is_refused_at_sync(new_story):
    refused(new_story, "GhostEventModule", "the skill journal-notes names ghost.*, which no model's events match")


def test_skill_write_clears_the_journals_stale_folders_and_never_one_it_did_not_write(installed_skill_files):
    story = installed_skill_files
    stale, foreign = skill_file(story, ".claude/skills", "journal-old"), skill_file(story, ".claude/skills", "writing-story-tests")
    for file in (stale, foreign):
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text("kept or cleared")
    story.expect_success("skill write", "removed: journal-old")
    expect_absent_exists_parent_stale(stale)
    expect_exists_version_four(foreign)


def test_skill_list_prints_each_folder_with_its_description(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.expect_success("skill list", "journal-notes  How to take notes", "journal-chores  How to work a task")


def test_skill_show_prints_the_text_and_digest_of_one_skill(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.expect_success("skill show journal-notes", "Write a note for every decision.")
    story.expect_text("skill show journal-notes", "digest: ")
    story.expect_text("skill show --folder journal-notes", "Write a note for every decision.", "digest: ")


def test_skill_show_of_a_skill_no_module_declares_is_refused(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.expect_refusal("skill show journal-gone", "no module declares the skill journal-gone")


def test_skill_show_and_skill_list_answer_json_rows_for_a_window(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.expect_text("skill show journal-notes --json", '"text": "---')
    story.expect_text("skill list --json", '"folder": "journal-notes"')


@pytest.fixture
def installed_skill_files(new_story):
    return story_with_skill_files(new_story)
