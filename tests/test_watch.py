import time

from controllers.types import Notices
from engine import watch
from engine.record import Record


class Driver:
    def __init__(self):
        self.said = []

    def alive(self):
        return True

    def send(self, text):
        self.said.append(text)


def test_an_engine_that_dies_the_moment_it_starts_is_a_break_not_a_reload():
    assert [watch.crashed(code, time.time()) for code in (None, 0)] == [False, False], \
        "a clean exit or a still-running engine is not a crash"
    assert watch.crashed(1, time.time()) is True, "a failure the moment it started is"
    assert watch.crashed(1, time.time() - watch.CRASH_WITHIN - 1) is False, \
        "a failure after it has been up a while is a reload, not a crash"


def test_what_it_left_behind_is_read_from_its_log_and_told_once(tmp_path):
    root = tmp_path / ".journal"
    record = Record(root, "main")
    notices = Notices(record)

    watch.log_file(root).parent.mkdir(parents=True, exist_ok=True)
    watch.log_file(root).write_text("Traceback (most recent call last):\nImportError: cannot import name 'MOST_STEPS'\n")
    assert "ImportError" in watch.why(root), "its last words are read back"
    assert (watch.told(root, "main", watch.why(root)), [n.title for n in notices.all(completed=True)]) == (True, [watch.TITLE]), \
        "the user is told once, with what it said"
    assert (watch.told(root, "main", watch.why(root)), len(notices.all(completed=True))) == (False, 1), \
        "and not told again while it is still broken"
    assert "ImportError" in notices.load(1).brief, "the notice carries the error and asks for a fix"

    watch.cleared(root, "main")
    assert (bool(notices.load(1).completed), notices.load(1).outcome) == (True, "the engine is running again"), \
        "the notice is closed with why"
    assert (watch.told(root, "main", "gone again"), len(notices.all(completed=True))) == (True, 2), "a fresh break tells the user again"


def test_an_error_mid_flight_never_stops_the_engine_and_the_agent_hears_it(tmp_path):
    root = tmp_path / ".journal"
    record = Record(root, "main")
    notices = Notices(record)
    spoke = Driver()

    watch.broke(record, "Traceback\nTypeError: bad", spoke)
    told = [n for n in notices.all(completed=True) if n.title == watch.FAULT]
    assert (len(told), "TypeError" in told[0].brief, "TypeError" in spoke.said[0]) == (1, True, True), \
        "an error while it runs raises its own notice and is typed to the agent"
    watch.broke(record, "Traceback\nTypeError: bad", spoke)
    assert (len([n for n in notices.all(completed=True) if n.title == watch.FAULT]), len(spoke.said)) == (1, 1), \
        "the same trouble is not said twice"
    watch.broke(record, "Traceback\nValueError: something else", spoke)
    assert (len([n for n in notices.all(completed=True) if n.title == watch.FAULT]), len(spoke.said), "ValueError" in spoke.said[-1]) == (2, 2, True), \
        "a different error is its own notice, and is said too"
    watch.steady(record)
    assert ([n.outcome for n in notices.all(completed=True) if n.title == watch.FAULT], watch.broke(record, "Traceback\nTypeError: bad", spoke) or len(spoke.said)) == \
        ([watch.STEADY, watch.STEADY], 3), "a stretch of clean ticks closes every fault it left behind"
