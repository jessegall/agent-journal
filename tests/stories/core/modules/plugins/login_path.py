import subprocess

from core.modules.plugins.support.login_path import FALLBACK_FOLDERS, LoginPath
from tests.stories.support.story_checks import expect_answers, expect_value


def counted_shells(monkeypatch, answer: str) -> list[object]:
    started: list[object] = []

    def shell(*arguments, **options):
        started.append(arguments)
        return subprocess.CompletedProcess(arguments, 0, stdout=f"journal-path-begin:{answer}:journal-path-finish")

    monkeypatch.setattr(subprocess, "run", shell)
    return started


def test_before_any_read_the_usual_folders_answer_and_no_shell_starts(new_story, monkeypatch):
    story = new_story()
    started = counted_shells(monkeypatch, "/from/the/shell")
    expect_split_login_path(story, ":", list(FALLBACK_FOLDERS))
    expect_value(started, [])


def expect_login_path(login_path, expected) -> None:
    actual = login_path.value()
    assert actual == expected, actual


def expect_absent_file_login_path(login_path) -> None:
    actual = login_path.file.is_file()
    assert not actual, actual


def expect_split_login_path(story, text, expected) -> None:
    actual = LoginPath(story.home).value().split(text)
    assert actual == expected, actual


def expect_login_path_range(login_path, number, expected) -> None:
    actual = [login_path.value() for _ in range(number)]
    assert actual == expected, actual


def test_a_round_that_reads_the_shell_for_each_event_and_starts_plugins_reads_the_file_once(new_story, monkeypatch):
    story = new_story()
    counted_shells(monkeypatch, "/from/the/shell")
    login_path = LoginPath(story.home)
    with story.repeated_work.request():
        for _ in range(3):
            login_path.read_shell()
            expect_login_path(login_path, "/from/the/shell")
