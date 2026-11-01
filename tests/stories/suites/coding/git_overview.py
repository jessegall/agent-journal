import json
import shlex
import subprocess

from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def git(folder, *arguments: str) -> None:
    subprocess.run(["git", "-c", "user.name=Ada", "-c", "user.email=ada@example.test", *arguments], cwd=folder, check=True, capture_output=True, timeout=15)


def repository_story(new_story):
    story = new_story(fixture=UserJoined)
    folder = story.home.folder.parent / "repository"
    folder.mkdir()
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(folder))}")
    git(folder, "init", "-q", "-b", "main")
    (folder / "cart.py").write_text("one\n")
    git(folder, "add", "cart.py")
    git(folder, "commit", "-q", "-m", "Add the cart")
    git(folder, "checkout", "-q", "-b", "shop")
    (folder / "cart.py").write_text("two\n")
    git(folder, "commit", "-q", "-am", "Count in cents")
    return story


def read(story, line: str) -> dict:
    return json.loads(story.run(f"git-overview {line} --environment main --json", actor=story.user).output_text)


def test_the_branches_say_how_far_each_is_from_the_base(new_story):
    rows = {row["name"]: row for row in read(repository_story(new_story), "branches")["rows"]}
    assert rows["shop"]["current"] and rows["shop"]["extra_commits"] == 1 and rows["shop"]["missing_commits"] == 0 and rows["shop"]["subject"] == "Count in cents"
    assert not rows["main"]["current"] and rows["main"]["extra_commits"] == 0


def test_the_commits_of_the_current_branch_are_paged(new_story):
    story = repository_story(new_story)
    first = read(story, "commits --limit 1")
    assert [row["subject"] for row in first["rows"]] == ["Count in cents"] and not first["is_last_page"]
    second = read(story, "commits --limit 1 --skip 1")
    assert [row["subject"] for row in second["rows"]] == ["Add the cart"] and second["is_last_page"]


def test_a_folder_that_is_no_repository_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    folder = story.home.folder.parent / "plain"
    folder.mkdir()
    story.expect_success(f"environment edit 1 --folder {shlex.quote(str(folder))}")
    story.expect_refusal("git-overview commits --environment main", "could not read this repository", actor=story.user)


def test_the_git_window_declares_its_lines(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("coding.git", "git-overview branches --skip 30")
    window.expect_window_allowed("coding.git", "git-overview commits --skip 30")
    window.expect_window_allowed("coding.git", "git-overview pulls")
