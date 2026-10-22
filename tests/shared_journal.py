import os
import shutil
import sqlite3
import threading
import types
from journal.support.caller_kind import CallerKind
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

THREADED = (Container, Connection, Server, ShareServer, ListenerQueue, JobRunner, threading.local)
"""What runs the journal rather than remembers for it: its threads, sockets and pool, and what each thread keeps for itself, are left as they are between tests."""

PLAIN = (type, types.FunctionType, types.MethodType, types.ModuleType, Enum)
"""What has a __dict__ but keeps no state of a journal's."""

DATABASE_SUFFIXES = ("", "-wal", "-shm")


class SharedJournal:
    """One booted journal for the tests of a module, put back after each test as it stood at boot: its rows and their numbering, the files under its root and its secret values, the services built since and what the services built at boot remember."""

    def __init__(self, app: App) -> None:
        self.app = app
        app.console().parser(CallerKind.MAIN_AGENT)
        self.settled()
        self.rows = sqlite3.connect(":memory:")
        with sqlite3.connect(app.config.database) as live:
            live.backup(self.rows)
        self.secrets = str(app.container.get(SecretValues).path)
        self.folders, files = self.tree()
        kept = [path for path in files if not self.is_database(path)] + ([self.secrets] if os.path.isfile(self.secrets) else [])
        self.files = {path: Path(path).read_bytes() for path in kept}
        self.stamps = {path: self.stamp(path) for path in kept}
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

    def tree(self) -> tuple[set[str], list[str]]:
        folders, files = set(), []
        for folder, inner, names in os.walk(self.app.config.root):
            folders.update(os.path.join(folder, name) for name in inner)
            files.extend(os.path.join(folder, name) for name in names)
        return folders, files

    def put_back_files(self) -> None:
        folders, files = self.tree()
        for path in files:
            if path not in self.files and not self.is_database(path):
                os.unlink(path)
        for path in sorted(folders - self.folders, reverse=True):
            if os.path.islink(path):
                os.unlink(path)
            elif os.path.isdir(path):
                shutil.rmtree(path)
        if self.secrets not in self.files and os.path.isfile(self.secrets):
            os.unlink(self.secrets)
        for path, content in self.files.items():
            if self.stamp(path) != self.stamps[path]:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                Path(path).write_bytes(content)
                self.stamps[path] = self.stamp(path)

    @staticmethod
    def stamp(path: str) -> tuple:
        try:
            status = os.stat(path)
        except FileNotFoundError:
            return ()
        return status.st_mtime_ns, status.st_size

    def is_database(self, path: str) -> bool:
        return os.path.basename(path) in {self.app.config.database.name + suffix for suffix in DATABASE_SUFFIXES}

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
