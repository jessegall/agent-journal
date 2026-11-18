import os
import shutil
import sqlite3
from journal.support.agent_role import AgentRole
from pathlib import Path

from journal.app import App
from journal.db.connection import Connection
from journal.support.secret_values import SecretValues
from tests.service_memory import ServiceMemory

DATABASE_SUFFIXES = ("", "-wal", "-shm")


class SharedJournal:
    """One booted journal for the tests of a module, put back after each test as it stood at boot: its rows and their numbering, the files and links under its root and its secret values, the services built since and what the services built at boot remember."""

    def __init__(self, app: App) -> None:
        self.app = app
        app.console().parser(AgentRole.MAIN)
        self.settled()
        self.rows = sqlite3.connect(":memory:")
        with sqlite3.connect(app.config.database) as live:
            live.backup(self.rows)
        self.secrets = str(app.container.get(SecretValues).path)
        self.folders, files = self.tree()
        self.links = {path: os.readlink(path) for path in (*self.folders, *files) if os.path.islink(path)}
        kept = [path for path in files if not self.is_database(path) and path not in self.links] + ([self.secrets] if os.path.isfile(self.secrets) else [])
        self.files = {path: Path(path).read_bytes() for path in kept}
        self.stamps = {path: self.stamp(path) for path in kept}
        self.instances = dict(app.container._instances)
        self.memory = ServiceMemory(self.instances.values())

    def reset(self) -> None:
        jobs = self.app.runtime().jobs
        running = jobs._thread is not None
        jobs.stop()
        self.settled()
        self.put_back()
        if running:
            jobs.start()

    def put_back(self) -> None:
        self.app.container._instances.clear()
        self.app.container._instances.update(self.instances)
        self.memory.put_back()
        with sqlite3.connect(self.app.config.database) as live:
            self.rows.backup(live)
        self.app.container.get(Connection).cache.cleared()
        self.put_back_files()

    def settled(self) -> None:
        if self.app.runtime().deferred._thread:
            self.app.runtime().deferred.drain()

    def tree(self) -> tuple[set[str], list[str]]:
        folders, files = set(), []
        for folder, inner, names in os.walk(self.app.config.root):
            folders.update(os.path.join(folder, name) for name in inner)
            files.extend(os.path.join(folder, name) for name in names)
        return folders, files

    def put_back_files(self) -> None:
        folders, files = self.tree()
        for path in files:
            if path not in self.files and path not in self.links and not self.is_database(path):
                os.unlink(path)
        for path in sorted(folders - self.folders, reverse=True):
            if os.path.islink(path):
                os.unlink(path)
            elif os.path.isdir(path):
                shutil.rmtree(path)
        if self.secrets not in self.files and os.path.isfile(self.secrets):
            os.unlink(self.secrets)
        for path, target in self.links.items():
            if not os.path.islink(path) or os.readlink(path) != target:
                self.removed(path)
                os.makedirs(os.path.dirname(path), exist_ok=True)
                os.symlink(target, path)
        for path, content in self.files.items():
            if self.stamp(path) != self.stamps[path]:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                Path(path).write_bytes(content)
                self.stamps[path] = self.stamp(path)

    @staticmethod
    def removed(path: str) -> None:
        if os.path.islink(path) or os.path.isfile(path):
            os.unlink(path)
        elif os.path.isdir(path):
            shutil.rmtree(path)

    @staticmethod
    def stamp(path: str) -> tuple:
        try:
            status = os.stat(path)
        except FileNotFoundError:
            return ()
        return status.st_mtime_ns, status.st_size

    def is_database(self, path: str) -> bool:
        return os.path.basename(path) in {self.app.config.database.name + suffix for suffix in DATABASE_SUFFIXES}
