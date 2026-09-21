import pytest

import features
from commands.http import dispatch
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_picked_answer_is_held_for_a_configurable_duration():
    record = fresh("main")
    questions = features.FEATURES["questions"]
    assert questions.held_for(record) == 3, "a picked answer is held for three seconds by default"
    assert (questions.describe()["fixed"], questions.enabled(record)) == (True, True), "the feature cannot be switched off"

    record.set_setting("questions", {"hold": 8})
    assert questions.held_for(record) == 8, "a setting says how long instead"

    got = dispatch("GET", "/api/main/settings", record.root, {}, {})
    assert (got.code, got.body["questions"]["hold"]) == (200, 8), "the viewer is handed the hold with the rest of the settings"
    saved = dispatch("POST", "/api/main/settings", record.root, {}, {"questions": {"hold": 1}})
    assert (saved.code, saved.body["questions"]["hold"]) == (200, 1), "and can set it"
