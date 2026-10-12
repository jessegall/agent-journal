import importlib
import json

import features
from controllers.types import Features
from resources.base import SYSTEM
from tests.conftest import fresh


def test_the_figure_switch_moves_from_the_form_of_address_to_the_avatar():
    features.load()
    record = fresh()
    settings = record.root / "settings.json"
    settings.write_text(json.dumps({"form_of_address": {"title": "Sir", "mascot": True}}))
    migrate = importlib.import_module("migrations.m0086_the_avatar_is_its_own_feature")
    migrate.run(record.root)
    assert Features(record, actor=SYSTEM).on("avatar", default=False), "an environment that had the figure on keeps it on"
    held = json.loads(settings.read_text())
    assert held["form_of_address"] == {"title": "Sir"}, "the old switch is gone from the form of address, and the title it sat beside is untouched"
    assert held["features"]["avatar"] is True, "and it is the project's own switch now, where it was before: a new environment starts with the figure the project chose"


def test_a_figure_switched_in_an_environment_is_kept_for_the_whole_project():
    features.load()
    migrate = importlib.import_module("migrations.m0087_the_avatar_switch_is_kept_for_the_project")
    for chosen in (True, False):
        record = fresh()
        Features(record, actor=SYSTEM).create("avatar", enabled=chosen)
        migrate.run(record.root)
        assert Features(record, actor=SYSTEM).on("avatar", default=not chosen) is chosen, "the environment's choice is the project's now"
        assert record.features.get("avatar") is chosen, "the switch is written for the project, where the viewer reads it"
