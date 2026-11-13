from dataclasses import asdict

from core.modules.helpers.types.helper import Helper
from engine.enums.access import Access
from engine.helper_type.helper_type_entry import HelperTypeEntry
from suites.coding.modules.workers.types.merger import Merger
from suites.coding.modules.workers.types.worker import Worker


def test_a_worker_and_a_merger_are_helpers():
    assert issubclass(Worker, Helper) and issubclass(Merger, Helper)
    assert Worker.bases() == tuple(["helper"]) and Merger.bases() == tuple(["helper"]) and Helper.bases() == ()


def test_a_subclass_takes_every_field_it_does_not_set_from_its_base():
    assert (Merger.access, Merger.run_limit_key, Merger.job_command, Merger.line) == (Helper.access, Helper.run_limit_key, Helper.job_command, Helper.line)
    assert (Merger.key, Merger.label, Merger.default_profile) == ("merger", "Merger", "journal-merger")
    assert Worker.access is Access.WRITING and Helper.access is Access.READ


def test_is_a_answers_by_class():
    worker = HelperTypeEntry.declared("journal.suites.coding.workers", Worker)
    helper = HelperTypeEntry.declared("journal.core.helpers", Helper)
    assert worker.matches(Helper) and worker.matches(Worker) and not worker.matches(Merger)
    assert helper.matches(Helper) and not helper.matches(Worker)


def test_the_key_text_is_what_is_stored():
    stored = asdict(HelperTypeEntry.declared("journal.suites.coding.workers", Merger))
    assert stored["key"] == "merger" and stored["bases"] == tuple(["helper"]) and "extends" not in stored
