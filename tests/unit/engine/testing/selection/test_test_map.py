import sys

from engine.testing.selection.function_bodies import FunctionBodies
from engine.testing.selection.test_map import RECORD_VARIABLE, TestMap
from engine.testing.selection.test_map_recorder import TestMapRecorder

SOURCE = '''
class Cart:
    def total(self):
        return 1

    def count(self):
        return 2


def outer():
    def inner():
        return 3
    return inner
'''


def executed_test_count() -> int:
    return 1


def unrun_test_count() -> int:
    return 2


def test_records_a_function_that_ran_and_not_one_that_did_not():
    # a full run records with the default slot, so this recorder takes another
    recorder = TestMapRecorder(sys.monitoring.OPTIMIZER_ID)
    recorder.start()
    try:
        recorder.begin_test()
        executed_test_count()
        recorder.finish_test("case")
    finally:
        recorder.stop()
    recorded = recorder.tests["case"]
    assert any(name.endswith("::ran_here") for name in recorded)
    assert not any(name.endswith("::not_run_here") for name in recorded)


def test_body_hash_changes_with_the_body_only():
    before = FunctionBodies.hashes(SOURCE)
    commented = FunctionBodies.hashes(SOURCE.replace("class Cart:", "# a cart\nclass Cart:"))
    sibling_changed = FunctionBodies.hashes(SOURCE.replace("return 2", "return 5"))
    assert set(before) == {"Cart.total", "Cart.count", "outer", "outer.<locals>.inner"}
    assert commented == before
    assert sibling_changed["Cart.total"] == before["Cart.total"] and sibling_changed["Cart.count"] != before["Cart.count"]


def test_map_is_written_only_on_a_full_run(monkeypatch, tmp_path):
    monkeypatch.delenv(RECORD_VARIABLE, raising=False)
    assert not TestMap.is_recorded(False)
    assert TestMap.is_recorded(True)
    file = tmp_path / "test-map.json"
    TestMap({"case": ["src/a.py::f"]}, {"case": ["src/b.py"]}, {"src/a.py": {"f": "1"}}).write(file)
    assert TestMap.read(file) == TestMap({"case": ["src/a.py::f"]}, {"case": ["src/b.py"]}, {"src/a.py": {"f": "1"}})
