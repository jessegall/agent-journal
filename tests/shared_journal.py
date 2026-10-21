import shutil
import sqlite3
import types
from enum import Enum
from pathlib import Path

from journal.app import App
from journal.container import Container
from journal.db.connection import Connection
from journal.engine.job_runner import JobRunner
from journal.http.server import Server
from journal.http.share_server import ShareServer
from journal.support.listener_queue import ListenerQueue
from journal.support.secret_values import SecretValues

THREADED = (Container, Connection, Server, ShareServer, ListenerQueue, JobRunner)
"""What runs the journal rather than remembers for it: its threads, sockets and pool are left as they are between tests."""

PLAIN = (type, types.FunctionType, types.MethodType, types.ModuleType, Enum)
"""What has a __dict__ but keeps no state of a journal's."""

DATABASE_SUFFIXES = ("", "-wal", "-shm")


class SharedJournal:
    """One booted journal for the tests of a module, put back after each test as it stood at boot: its rows and their numbering, the files under its root and its secret values, the services built since and what the services built at boot remember."""

    def __init__(self, app: App) -> None:
        self.app = app
        app.console().parser()
        self.settled()
        self.rows = sqlite3.connect(":memory:")
        with sqlite3.connect(app.config.database) as live:
            live.backup(self.rows)
        self.secrets = app.container.get(SecretValues).path
        self.files = self.contents()
        self.folders = {path for path in app.config.root.rglob("*") if path.is_dir()}
        self.instances = dict(app.container._instances)
        self.fields: dict[int, tuple[object, dict[str, object]]] = {}
        for instance in self.instances.values():
            self.remember(instance)

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
        for instance, fields in self.fields.values():
            self.restored(instance, fields)
        with sqlite3.connect(self.app.config.database) as live:
            self.rows.backup(live)
        self.put_back_files()

    def settled(self) -> None:
        if self.app.runtime().deferred._thread:
            self.app.runtime().deferred.drain()

    def contents(self) -> dict[Path, bytes]:
        kept = {path: path.read_bytes() for path in self.app.config.root.rglob("*") if path.is_file() and not self.is_database(path)}
        return kept | ({self.secrets: self.secrets.read_bytes()} if self.secrets.is_file() else {})

    def put_back_files(self) -> None:
        for path in sorted(self.app.config.root.rglob("*"), reverse=True):
            if path in self.files or path in self.folders or self.is_database(path):
                continue
            if path.is_dir() and not path.is_symlink():
                shutil.rmtree(path)
            else:
                path.unlink()
        if self.secrets not in self.files:
            self.secrets.unlink(missing_ok=True)
        for path, content in self.files.items():
            if not path.is_file() or path.read_bytes() != content:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(content)

    def is_database(self, path: Path) -> bool:
        return path.name in {self.app.config.database.name + suffix for suffix in DATABASE_SUFFIXES}

    def remember(self, instance: object) -> None:
        if id(instance) in self.fields or not self.remembers(instance):
            return
        self.fields[id(instance)] = (instance, self.remembered(instance))
        for value in vars(instance).values():
            self.remember(value)

    @staticmethod
    def remembers(instance: object) -> bool:
        return hasattr(instance, "__dict__") and not isinstance(instance, THREADED + PLAIN)

    @staticmethod
    def remembered(instance: object) -> dict[str, object]:
        return {name: value.copy() if isinstance(value, (dict, list, set)) else value for name, value in vars(instance).items()}

    @staticmethod
    def restored(instance: object, fields: dict[str, object]) -> None:
        for name in set(vars(instance)) - set(fields):
            object.__delattr__(instance, name)
        for name, value in fields.items():
            current = vars(instance).get(name)
            if isinstance(value, (dict, list, set)) and type(current) is type(value):
                current.clear()
                current.update(value) if not isinstance(value, list) else current.extend(value)
            else:
                object.__setattr__(instance, name, value)
