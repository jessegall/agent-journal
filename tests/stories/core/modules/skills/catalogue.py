import os
from pathlib import Path

from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.fixtures import MainEnvironment

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


def test_skill_write_puts_each_skill_in_both_program_folders(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.expect_success("skill write", "written: journal-notes", "written: journal-tasks")
    for program_folder in PROGRAM_FOLDERS:
        assert "Write a note for every decision." in skill_file(story, program_folder, "journal-notes").read_text()
        assert "Start a task before you write." in skill_file(story, program_folder, "journal-tasks").read_text()


def test_skill_write_rewrites_only_a_changed_file(new_story):
    story = story_with_skill_files(new_story)
    unchanged, changed = skill_file(story, ".claude/skills", "journal-tasks"), skill_file(story, ".claude/skills", "journal-notes")
    os.utime(unchanged, ns=(1, 1))
    changed.write_text("an old text")
    story.expect_success("skill write", "unchanged: journal-tasks", "written: journal-notes")
    assert unchanged.stat().st_mtime_ns == 1
    assert "Write a note for every decision." in changed.read_text()


def test_skill_write_clears_the_journals_stale_folders_and_never_one_it_did_not_write(new_story):
    story = story_with_skill_files(new_story)
    stale, foreign = skill_file(story, ".claude/skills", "journal-old"), skill_file(story, ".claude/skills", "writing-story-tests")
    for file in (stale, foreign):
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text("kept or cleared")
    story.expect_success("skill write", "removed: journal-old")
    assert not stale.parent.exists()
    assert foreign.exists()


def test_skill_list_prints_each_folder_with_its_description(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.expect_success("skill list", "journal-notes  How to take notes", "journal-tasks  How to work a task")


def test_skill_show_prints_the_text_and_digest_of_one_skill(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.expect_success("skill show journal-notes", "Write a note for every decision.")
    assert "digest: " in story.run("skill show journal-notes").output_text


def test_skill_show_of_a_skill_no_module_declares_is_refused(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    story.expect_refusal("skill show journal-gone", "no module declares the skill journal-gone")


def test_skill_show_and_skill_list_answer_json_rows_for_a_window(new_story):
    story = new_story(GOOD, fixture=MainEnvironment)
    assert '"text": "---' in story.run("skill show journal-notes --json").output_text
    assert '"folder": "journal-notes"' in story.run("skill list --json").output_text
