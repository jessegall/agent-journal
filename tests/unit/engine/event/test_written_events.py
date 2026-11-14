import threading

from engine.event.written_events import MOST_THREAD_KEYS, WrittenEvents


def written_in_another_thread(written: WrittenEvents, name: str) -> None:
    thread = threading.Thread(target=written.add, args=(name,))
    thread.start()
    thread.join()


def test_taken_returns_the_names_the_calling_thread_wrote():
    written = WrittenEvents()
    written.add("core.tasks.task.created")
    assert written.taken() == {"core.tasks.task.created"}


def test_taken_clears_them():
    written = WrittenEvents()
    written.add("core.tasks.task.created")
    written.taken()
    assert written.taken() == frozenset()


def test_another_threads_names_are_not_taken():
    written = WrittenEvents()
    written_in_another_thread(written, "core.tasks.task.created")
    assert written.taken() == frozenset()


def test_names_are_distinct():
    written = WrittenEvents()
    for _ in range(3):
        written.add("core.tasks.task.created")
    assert written.taken() == {"core.tasks.task.created"}


def test_dead_threads_do_not_grow_the_record():
    written = WrittenEvents()
    for number in range(MOST_THREAD_KEYS + 10):
        written_in_another_thread(written, f"event {number}")
    assert len(written.names) <= MOST_THREAD_KEYS + 1
