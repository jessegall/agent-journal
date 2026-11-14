import shutil

import pytest

from engine.instruction.instruction_imports import INSTRUCTION_FILES
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.helper_start_folder import HelperStartFolder
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, helper_agent


class NoProgramChecks:
    def checked(self, program, folder) -> None:
        return None


@pytest.fixture
def started_folder(played, monkeypatch):
    story = played(EndedHelper)
    folders = story.container.get(AgentFolders)
    story.checkout = story.home.project_folder
    monkeypatch.setattr(HelperStartFolder, "checkout", lambda start_folder, helper: story.checkout)
    (story.checkout / "CLAUDE.md").write_text("The project's own instructions\n")
    (story.checkout / "src").mkdir(exist_ok=True)
    (story.checkout / "src" / "cart.py").write_text("TOTAL = 9\n")
    story.replace(HelperPrograms, NoProgramChecks())
    story.start_folder = folders.start_folder(helper_agent(story))
    yield story
    shutil.rmtree(story.start_folder, ignore_errors=True)


def prepared(story):
    story.container.get(HelperStartFolder).prepare(helper_agent(story))
    return story.start_folder




def test_a_helper_with_a_start_folder_works_there_and_one_without_works_in_the_project(started_folder):
    folders = started_folder.container.get(AgentFolders)
    started_folder.expect_rows(folders.folder(helper_agent(started_folder)) != started_folder.start_folder)
    prepared(started_folder)
    started_folder.expect_rows(folders.folder(helper_agent(started_folder)) == started_folder.start_folder)






