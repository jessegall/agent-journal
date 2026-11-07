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


def test_asking_for_the_path_three_times_starts_no_shell_and_answers_what_the_boot_read(new_story, monkeypatch):
    story = new_story()
    started = counted_shells(monkeypatch, "/from/the/shell")
    login_path = LoginPath(story.home)
    login_path.read_shell()
    started.clear()
    expect_login_path_range(login_path, 3, ["/from/the/shell"] * 3)
    expect_value(started, [])


def test_before_any_read_the_usual_folders_answer_and_no_shell_starts(new_story, monkeypatch):
    story = new_story()
    started = counted_shells(monkeypatch, "/from/the/shell")
    expect_split_login_path(story, ":", list(FALLBACK_FOLDERS))
    expect_value(started, [])


def test_a_failed_read_keeps_no_answer_and_the_clock_reads_again(new_story, monkeypatch):
    story = new_story()
    counted_shells(monkeypatch, "")
    login_path = LoginPath(story.home)
    login_path.read_shell()
    expect_absent_file_login_path(login_path)
    started = counted_shells(monkeypatch, "/from/the/shell")
    login_path.fill_missing()
    login_path.fill_missing()
    expect_login_path(login_path, "/from/the/shell")
    expect_answers(started, 1)


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
