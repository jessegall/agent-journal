import threading

from engine.event.saved_events import MOST_THREAD_KEYS, SavedEvents


def second_thread_save(saved: SavedEvents, name: str) -> None:
    thread = threading.Thread(target=saved.add, args=(name,))
    thread.start()
    thread.join()


def test_taken_returns_the_names_the_calling_thread_wrote():
    saved = SavedEvents()
    saved.add("core.tasks.task.created")
    assert saved.taken() == {"core.tasks.task.created"}


def test_taken_clears_them():
    saved = SavedEvents()
    saved.add("core.tasks.task.created")
    saved.taken()
    assert saved.taken() == frozenset()


def test_another_threads_names_are_not_taken():
    saved = SavedEvents()
    second_thread_save(saved, "core.tasks.task.created")
    assert saved.taken() == frozenset()


def test_names_are_distinct():
    saved = SavedEvents()
    for _ in range(3):
        saved.add("core.tasks.task.created")
    assert saved.taken() == {"core.tasks.task.created"}


def test_dead_threads_do_not_grow_the_record():
    saved = SavedEvents()
    for number in range(MOST_THREAD_KEYS + 10):
        second_thread_save(saved, f"event {number}")
    assert len(saved.names) <= MOST_THREAD_KEYS + 1
