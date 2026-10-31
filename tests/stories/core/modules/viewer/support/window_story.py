import json
import os
import shlex
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.module.module_removal import ModuleRemoval
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.viewer.window_lines import WindowLines
from core.testing.story import Story

ENVIRONMENT = "main"


class WindowStory:
    """A story's checks of the command lines a viewer window may run for the person at the viewer."""

    def __init__(self, story: Story) -> None:
        self.story = story

    def new_person(self, name: str) -> Actor:
        return Actor(self.story.new_row_id(f'actor make user "{name}"'), ActorType.USER)

    def expect_window_allowed(self, window: str, line: str, environment: str = ENVIRONMENT) -> None:
        self.story.container.get(WindowLines).check(window, shlex.split(line), self.story.user, environment)

    def expect_window_refusal(self, window: str, line: str, reason: str, environment: str = ENVIRONMENT) -> None:
        try:
            self.story.container.get(WindowLines).check(window, shlex.split(line), self.story.user, environment)
        except Refusal as refusal:
            assert reason in refusal.reason, f"{window} {line!r} was refused, but not for {reason!r}: {refusal.reason}"
            return
        raise AssertionError(f"{window} {line!r} was not refused")

    def expect_declared_window(self, name: str, loading: str, place: str) -> None:
        registry = Registry.read(self.story.container.get(Database))
        assert registry.has_window(name), f"no installed module declares the window {name}"
        window = registry.window(name)
        assert (window.loading, window.place, window.shipped) == (loading, place, True), f"{name} is declared as {window}"

    def expect_row_count(self, table: str, count: int) -> None:
        counted = self.story.container.get(Database).rows(Statement(f"SELECT count(*) FROM {table}"))[0][0]
        assert counted == count, f"{table} holds {counted} rows, not {count}"

    def module_upgraded(self, old: str, new: str) -> None:
        modules = [new if path == old else path for path in json.loads(self.story.home.module_list.read_text())]
        self.story.home.module_list.write_text(json.dumps(modules))
        self.synced()

    @contextmanager
    def module_code_changed(self) -> Iterator[None]:
        source_file = Path(__file__).with_name("window_samples.py")
        status = os.stat(source_file)
        os.utime(source_file, ns=(status.st_atime_ns, status.st_mtime_ns + 1_000_000))
        try:
            self.synced()
            yield
        finally:
            os.utime(source_file, ns=(status.st_atime_ns, status.st_mtime_ns))

    def synced(self) -> None:
        code, output_text = self.story.synced()
        assert code == 0, f"module sync gave {code}: {output_text}"

    def module_removed(self, name: str) -> None:
        self.story.container.get(ModuleRemoval).remove(name)
        self.synced()
        self.story.container.get(CommitListenerRunner).run()
