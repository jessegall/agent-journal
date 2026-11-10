import multiprocessing
from queue import Empty
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.testing.stories.story_state import StoryState
from engine.testing.templates.template import Template
from engine.testing.templates.template_databases import STATE_FILE, TemplateDatabases

PROCESS_WAIT_SECONDS = 60


class SampleTemplateDatabases(TemplateDatabases):
    def __init__(self, folder, builds, started=None, release=None):
        super().__init__(folder)
        self.builds, self.started, self.release = builds, started, release

    def synced_template(self, folder, modules):
        home = JournalHome(folder)
        folder.mkdir()
        with self.builds.open("a") as builds:
            builds.write("build\n")
        home.database.write_text("partial")
        if self.started is not None:
            self.started.set()
            self.release.wait(PROCESS_WAIT_SECONDS)
        home.module_list.write_text("[]")
        home.program_table.write_text("{}")
        home.database.write_text("complete")
        return Template(home, StoryState())


class TemplateWriteInterrupted(OSError):
    pass


def read_shared_template(folder, builds, ready, answers, started=None, release=None):
    if ready is not None:
        ready.set()
    template = SampleTemplateDatabases(folder, builds, started, release).shared_template((), None)
    answers.put(template.home.database.read_text())


def test_two_processes_build_one_complete_template(tmp_path):
    folder = tmp_path / "templates"
    folder.mkdir()
    builds = tmp_path / "builds"
    context = multiprocessing.get_context("spawn")
    started, release, ready = context.Event(), context.Event(), context.Event()
    answers = context.Queue()
    first = context.Process(target=read_shared_template, args=(folder, builds, None, answers, started, release))
    second = context.Process(target=read_shared_template, args=(folder, builds, ready, answers))
    first.start()
    try:
        assert started.wait(PROCESS_WAIT_SECONDS)
        second.start()
        assert ready.wait(PROCESS_WAIT_SECONDS)
        with pytest.raises(Empty):
            answers.get(timeout=0.1)
        release.set()
        assert [answers.get(timeout=PROCESS_WAIT_SECONDS), answers.get(timeout=PROCESS_WAIT_SECONDS)] == ["complete", "complete"]
        first.join(PROCESS_WAIT_SECONDS)
        second.join(PROCESS_WAIT_SECONDS)
        assert first.exitcode == second.exitcode == 0
        assert builds.read_text().splitlines() == ["build"]
    finally:
        release.set()
        for process in (first, second):
            if process.pid is not None and process.is_alive():
                process.terminate()
                process.join(PROCESS_WAIT_SECONDS)
        answers.close()


def test_a_template_is_built_when_a_story_first_uses_it_and_not_before(tmp_path):
    folder = tmp_path / "templates"
    folder.mkdir()
    builds = tmp_path / "builds"
    templates = SampleTemplateDatabases(folder, builds)
    assert not builds.exists()
    templates.template((), None)
    assert builds.read_text().splitlines() == ["build"]
    templates.template((), None)
    assert builds.read_text().splitlines() == ["build"]


def test_a_template_saved_by_one_run_is_reused_by_the_next_run(tmp_path):
    folder = tmp_path / "templates"
    folder.mkdir()
    builds = tmp_path / "builds"
    SampleTemplateDatabases(folder, builds).template((), None)
    next_run = SampleTemplateDatabases(folder, builds).template((), None)
    assert next_run.home.database.read_text() == "complete"
    assert builds.read_text().splitlines() == ["build"]


def test_an_interrupted_state_write_never_publishes_a_partial_template(tmp_path, monkeypatch):
    folder = tmp_path / "templates"
    folder.mkdir()
    builds = tmp_path / "builds"
    original = Path.write_bytes

    def interrupted(path, content):
        if path.name.startswith(STATE_FILE):
            original(path, content[:1])
            raise TemplateWriteInterrupted()
        return original(path, content)

    with monkeypatch.context() as changes:
        changes.setattr(Path, "write_bytes", interrupted)
        with pytest.raises(TemplateWriteInterrupted):
            SampleTemplateDatabases(folder, builds).shared_template((), None)
    assert list(folder.glob(f"*/{STATE_FILE}")) == []
    restored = SampleTemplateDatabases(folder, builds).shared_template((), None)
    assert restored.home.database.read_text() == "complete"
    assert restored.state == StoryState()
    assert builds.read_text().splitlines() == ["build", "build"]
