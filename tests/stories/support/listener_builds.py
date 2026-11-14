from collections.abc import Iterator
from contextlib import contextmanager
from unittest.mock import patch

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.listener.commit.listener_set import ListenerSet
from engine.module.journal_container import synced_container
from engine.registry.registry import Registry

LISTENER_THREAD = "listeners"


class ListenerBuilds:
    """The listener sets the threads of a story built, by thread name, counted while the story runs."""

    def __init__(self) -> None:
        self.thread_names: list[str] = []

    def count(self, thread_name: str) -> int:
        return self.thread_names.count(thread_name)

    @staticmethod
    @contextmanager
    def counted() -> Iterator["ListenerBuilds"]:
        builds = ListenerBuilds()
        built = ListenerSet.__init__

        def counted_build(listener_set: ListenerSet, thread_name: str, *arguments: object) -> None:
            built(listener_set, thread_name, *arguments)
            builds.thread_names.append(thread_name)

        with patch.object(ListenerSet, "__init__", counted_build):
            yield builds


# builds the listener set of one thread twice from one container, as a thread that lost its set would
def build_twice(home: JournalHome, thread_name: str) -> None:
    container = synced_container(home)
    runner = container.get(CommitListenerRunner)
    ListenerSet(thread_name, container.get(Registry), container, runner.commit_entries())
    try:
        ListenerSet(thread_name, container.get(Registry), container, runner.commit_entries())
    finally:
        container.get(Database).close()
