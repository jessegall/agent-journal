import shutil

import pytest

from core.base.instruction_imports import INSTRUCTION_FILES
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.helper_settings import HELPER_INSTRUCTION_FILES
from core.modules.helpers.support.helper_start_folder import HelperStartFolder
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, helper_agent


class NoProgramChecks:
    def checked(self, program, folder) -> None:
        return None


@pytest.fixture
def started_folder(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    folders = story.container.get(AgentFolders)
    story.checkout = story.home.project_folder
    monkeypatch.setattr(HelperStartFolder, "checkout", lambda start_folder, helper: story.checkout)
    (story.checkout / "CLAUDE.md").write_text("The project's own instructions\n")
    (story.checkout / "src").mkdir(exist_ok=True)
    (story.checkout / "src" / "cart.py").write_text("TOTAL = 9\n")
    story.container.bind(HelperPrograms, NoProgramChecks())
    story.start_folder = folders.start_folder(helper_agent(story))
    yield story
    shutil.rmtree(story.start_folder, ignore_errors=True)


def prepared(story):
    story.container.get(HelperStartFolder).prepare(helper_agent(story))
    return story.start_folder


def test_a_start_folder_links_the_project_and_holds_instructions_of_its_own(started_folder):
    folder = prepared(started_folder)
    project = started_folder.checkout
    written = [(folder / name).read_text() for name in INSTRUCTION_FILES]
    started_folder.expect_rows((folder / "src").is_symlink(), (folder / "src" / "cart.py").read_text() == "TOTAL = 9\n", (folder / "src").resolve() == (project / "src").resolve(),
                               all("The project's own instructions" not in text for text in written), all(text.strip() for text in written), not (folder / "CLAUDE.md").is_symlink(),
                               not (folder / ".claude").is_symlink(), detail=str(written))


def test_a_helper_with_a_start_folder_works_there_and_one_without_works_in_the_project(started_folder):
    folders = started_folder.container.get(AgentFolders)
    started_folder.expect_rows(folders.folder(helper_agent(started_folder)) != started_folder.start_folder)
    prepared(started_folder)
    started_folder.expect_rows(folders.folder(helper_agent(started_folder)) == started_folder.start_folder)


def test_preparing_again_writes_the_profile_text_anew_and_keeps_the_links(started_folder):
    folder = prepared(started_folder)
    (folder / "CLAUDE.md").write_text("stale text\n")
    prepared(started_folder)
    started_folder.expect_rows("stale text" not in (folder / "CLAUDE.md").read_text(), (folder / "src").is_symlink())


def test_a_start_folder_holds_only_the_skills_of_the_helpers_profile(started_folder):
    skills = started_folder.checkout / ".claude" / "skills"
    for name in ("journal-helpers", "journal-planning"):
        (skills / name).mkdir(parents=True, exist_ok=True)
        (skills / name / "SKILL.md").write_text(f"# {name}\n")
    held = prepared(started_folder) / ".claude" / "skills"
    started_folder.expect_rows((held / "journal-helpers" / "SKILL.md").is_file(), not (held / "journal-planning").exists(), not held.is_symlink(), (held / "journal-helpers").is_symlink())


def test_a_start_folder_made_with_the_whole_skills_folder_is_narrowed(started_folder):
    skills = started_folder.checkout / ".claude" / "skills"
    (skills / "journal-planning").mkdir(parents=True, exist_ok=True)
    folder = prepared(started_folder)
    shutil.rmtree(folder / ".claude" / "skills", ignore_errors=True)
    (folder / ".claude" / "skills").symlink_to(skills)
    prepared(started_folder)
    started_folder.expect_rows(not (folder / ".claude" / "skills").is_symlink(), not (folder / ".claude" / "skills" / "journal-planning").exists())


def test_with_the_setting_off_no_start_folder_is_made(started_folder):
    started_folder.expect_success(f"setting set {HELPER_INSTRUCTION_FILES} false --project", actor=started_folder.user)
    folder = prepared(started_folder)
    started_folder.expect_rows(not folder.exists())
