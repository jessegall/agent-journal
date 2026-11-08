import pytest
import subprocess

from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.support.project_file_expectations import expect_project_files


pytestmark = pytest.mark.real_git


def files_story(new_story):
    story = new_story(fixture=BuilderStarted)
    repository = repository_environment(story)
    (repository.folder / "shop").mkdir()
    (repository.folder / "shop" / "cart.py").write_text("TOTAL = 1\n")
    (repository.folder / "notes.bin").write_bytes(b"\0\0\0")
    subprocess.run(["git", "add", "-A"], cwd=repository.folder, check=True)
    return story


def test_a_folder_lists_folders_first_and_hides_what_nobody_reads(new_story):
    story = files_story(new_story)
    expect_project_files(story)
    story.expect_text("project-file list shop --environment main", "shop/cart.py", actor=story.agent)


def test_find_names_the_tracked_files_whose_path_holds_the_words(new_story):
    story = files_story(new_story)
    story.expect_text('project-file find "shop cart" --environment main', "shop/cart.py", actor=story.agent)
    story.expect_text('project-file find "no such file" --environment main', "nothing found", actor=story.agent)


def test_show_gives_a_files_text(new_story):
    story = files_story(new_story)
    story.expect_text("project-file show shop/cart.py --environment main", "TOTAL = 1", actor=story.agent)


def test_a_path_outside_the_project_a_binary_file_and_a_folder_are_refused(new_story):
    story = files_story(new_story)
    story.expect_refusal("project-file show ../../etc/passwd --environment main", "is outside the project", actor=story.agent)
    story.expect_refusal("project-file list ../.. --environment main", "is outside the project", actor=story.agent)
    story.expect_refusal("project-file show notes.bin --environment main", "is not text", actor=story.agent)
    story.expect_refusal("project-file show shop --environment main", "is no file", actor=story.agent)
