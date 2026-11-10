import pytest

from engine.driver.command_category import CommandCategory
from engine.file.file_access import FileAccess
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.skills.due import environment, start
from tests.stories.server.support.server_client import without_start_skills

LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
JOURNAL_LINE = HookSamples.shell("journal agent list", ShellPart("journal", CommandCategory.JOURNAL, ["agent", "list"]))
SKILL_FILE_NAME = "SKILL.md"


class SkillFileCounts:
    """How many times a hook read the state of a skill file, and how many passes over the skill folders it made."""

    def __init__(self, monkeypatch) -> None:
        self.stats, self.passes = 0, 0
        version, read_skills = FileAccess.version, SkillCatalogue.read_skills

        def counted_version(files, file):
            self.stats += str(file).endswith(SKILL_FILE_NAME)
            return version(files, file)

        def counted_read_skills(catalogue):
            self.passes += 1
            return read_skills(catalogue)

        monkeypatch.setattr(FileAccess, "version", counted_version)
        monkeypatch.setattr(SkillCatalogue, "read_skills", counted_read_skills)


@pytest.fixture
def started_story(new_story):
    story = environment(new_story)
    start(story)
    without_start_skills(story)
    return story


def test_a_tool_use_with_no_journal_line_and_no_due_skill_reads_no_skill_file(started_story, monkeypatch):
    counts = SkillFileCounts(monkeypatch)
    started_story.hook("s-1", LISTING)
    started_story.expect_rows(counts.stats == 0, counts.passes == 0)


def test_a_journal_line_makes_one_pass_over_the_skill_files(started_story, monkeypatch):
    counts = SkillFileCounts(monkeypatch)
    started_story.hook("s-1", JOURNAL_LINE)
    started_story.expect_rows(counts.passes == 1, counts.stats > 0)
