
from suites.coding.support.shipped_profiles import HELPER_PROFILES
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from tests.stories.support.story_checks import expect_value

SKILLS_FOLDER = ".claude/skills"
LISTED = "journal,journal-tasks"
MAIN_SKILL = "journal-dumps"


def stored(repository, worker, skill: str) -> bool:
    return (repository.worktree_folder(worker.id) / SKILLS_FOLDER / skill / "SKILL.md").is_file()


def test_the_merger_profile_carries_the_case_book_skill():
    merger = next(profile for profile in HELPER_PROFILES if profile.name == f"{MERGER_PROFILE.name}")
    expect_value(f"{MERGER_PROFILE.name}" in merger.skills and "journal-dispatching-workers" in merger.skills, True)
