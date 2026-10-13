import json

import features
import pytest
from controllers.types import Features
from migrations.m0088_version_3 import LAST_OF_VERSION_2, run
from resources.base import Refused, SYSTEM
from tests.conftest import fresh

REFUSAL = "update to the last 2.x release first"


def test_a_record_that_went_through_the_last_2_release_is_taken_and_the_figure_switch_moves_to_the_avatar():
    features.load()
    record = fresh()
    settings = record.root / "settings.json"
    settings.write_text(json.dumps({"form_of_address": {"title": "Sir", "mascot": True}}))
    (record.root / "migrations.json").write_text(json.dumps({LAST_OF_VERSION_2: {"at": 1.0, "result": ""}}))
    run(record.root)
    held = json.loads(settings.read_text())
    assert held["form_of_address"] == {"title": "Sir"}, "the old switch is gone from the form of address, and the title beside it is untouched"
    assert held["features"]["avatar"] is True, "the figure that was on stays on, as the project's own switch"
    assert Features(record, actor=SYSTEM).on("avatar", default=False)


def test_a_figure_switched_off_stays_off():
    features.load()
    record = fresh()
    (record.root / "settings.json").write_text(json.dumps({"form_of_address": {"mascot": False}}))
    run(record.root)
    assert record.features.get("avatar") is False


def test_a_record_with_nothing_to_move_is_left_as_it_is():
    features.load()
    record = fresh()
    settings = record.root / "settings.json"
    settings.write_text(json.dumps({"form_of_address": {"title": "Sir"}}))
    assert run(record.root) == "the record is in version 3's shape already"
    assert json.loads(settings.read_text()) == {"form_of_address": {"title": "Sir"}}


def test_a_record_that_missed_the_last_2_release_is_refused_with_one_plain_sentence():
    features.load()
    record = fresh()
    (record.root / "migrations.json").write_text(json.dumps({"m0060_auto_mode_on_everywhere": {"at": 1.0, "result": ""}}))
    with pytest.raises(Refused, match=REFUSAL):
        run(record.root)


def test_a_record_from_before_the_ledger_is_refused():
    features.load()
    record = fresh()
    (record.home / "pins.json").write_text("{}")
    with pytest.raises(Refused, match=REFUSAL):
        run(record.root)


def test_a_new_record_is_taken_whole():
    features.load()
    record = fresh()
    assert run(record.root) == "the record is in version 3's shape already"
