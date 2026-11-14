import threading

from engine.event.written_events import MOST_THREAD_KEYS, WrittenEvents


def written_in_another_thread(saved: WrittenEvents, name: str) -> None:
    thread = threading.Thread(target=saved.add, args=tuple([name]))
    thread.start()
    thread.join()


def test_taken_returns_the_names_the_calling_thread_wrote():
    saved = WrittenEvents()
    saved.add("core.tasks.task.created")
    assert saved.taken() == {"core.tasks.task.created"}


def test_taken_clears_them():
    saved = WrittenEvents()
    saved.add("core.tasks.task.created")
    saved.taken()
    assert saved.taken() == frozenset()


def test_another_threads_names_are_not_taken():
    saved = WrittenEvents()
    written_in_another_thread(saved, "core.tasks.task.created")
    assert saved.taken() == frozenset()


def test_names_are_distinct():
    saved = WrittenEvents()
    for _ in range(3):
        saved.add("core.tasks.task.created")
    assert saved.taken() == {"core.tasks.task.created"}


def test_dead_threads_do_not_grow_the_record():
    saved = WrittenEvents()
    for number in range(MOST_THREAD_KEYS + 10):
        written_in_another_thread(saved, f"event {number}")
    assert len(saved.names) <= MOST_THREAD_KEYS + 1
