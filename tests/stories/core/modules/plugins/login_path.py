import subprocess

from core.modules.plugins.support.login_path import FALLBACK_FOLDERS, LoginPath


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
    assert [login_path.value() for _ in range(3)] == ["/from/the/shell"] * 3
    assert started == []


def test_before_any_read_the_usual_folders_answer_and_no_shell_starts(new_story, monkeypatch):
    story = new_story()
    started = counted_shells(monkeypatch, "/from/the/shell")
    assert LoginPath(story.home).value().split(":") == list(FALLBACK_FOLDERS)
    assert started == []


def test_a_failed_read_keeps_no_answer_and_the_clock_reads_again(new_story, monkeypatch):
    story = new_story()
    counted_shells(monkeypatch, "")
    login_path = LoginPath(story.home)
    login_path.read_shell()
    assert not login_path.file.is_file()
    started = counted_shells(monkeypatch, "/from/the/shell")
    login_path.fill_missing()
    login_path.fill_missing()
    assert login_path.value() == "/from/the/shell"
    assert len(started) == 1
