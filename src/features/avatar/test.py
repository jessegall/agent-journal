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
    assert json.loads(settings.read_text()) == {"form_of_address": {"title": "Sir"}}, "the old switch is gone from the form of address"
