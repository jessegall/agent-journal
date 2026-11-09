import pytest

from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES

from server.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import UserBuilder

SHIPPED_PROFILES = (*HELPER_PROFILES, *WORKER_PROFILES)

PROGRAM_FOLDERS = (".claude/skills", ".agents/skills")
OLD_TEXT = "an old copy"


def started(story):
    story.run_listeners()
    BootingWork().run(story.container)
    story.run_listeners()


def test_a_start_removes_every_skill_it_gave_out_and_writes_the_latest_and_a_persons_own_stays(updated_skill_files):
    story, program_folder, skills = updated_skill_files
    for program_folder in PROGRAM_FOLDERS:
        skills = story.home.project_folder / program_folder
        story.expect_rows(
            (skills / "journal" / "SKILL.md").read_text() != OLD_TEXT,
            not (skills / "journal-no-longer-shipped").exists(),
            (skills / "my-own-skill" / "SKILL.md").read_text() == OLD_TEXT,
        )


def test_a_start_removes_every_profile_it_gave_out_and_writes_the_latest_and_a_persons_own_stays(updated_profile_files):
    story, agents, shipped = updated_profile_files
    story.expect_rows(
        shipped.read_text() != OLD_TEXT,
        not (agents / "journal-no-longer-shipped.md").exists(),
        (agents / "my-own-profile.md").read_text() == OLD_TEXT,
    )


@pytest.fixture
def distributed_files(new_story):
    story = new_story(fixture=UserBuilder)
    started(story)
    return story


@pytest.fixture
def updated_skill_files(distributed_files):
    story = distributed_files
    for program_folder in PROGRAM_FOLDERS:
        skills = story.home.project_folder / program_folder
        (skills / "journal" / "SKILL.md").write_text(OLD_TEXT)
        (skills / "journal-no-longer-shipped").mkdir()
        (skills / "journal-no-longer-shipped" / "SKILL.md").write_text(OLD_TEXT)
        (skills / "my-own-skill").mkdir()
        (skills / "my-own-skill" / "SKILL.md").write_text(OLD_TEXT)
    started(story)
    return story, program_folder, skills


@pytest.fixture
def updated_profile_files(distributed_files):
    story = distributed_files
    agents = story.home.project_folder / ".claude" / "agents"
    shipped = agents / f"{SHIPPED_PROFILES[0].name}.md"
    shipped.write_text(OLD_TEXT)
    (agents / "journal-no-longer-shipped.md").write_text(OLD_TEXT)
    (agents / "my-own-profile.md").write_text(OLD_TEXT)
    started(story)
    return story, agents, shipped
