import json

import pytest

import features
from commands.http import dispatch
from surfaces.color import default, identity, set_color
from tests.conftest import fresh, refused


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_the_project_color_is_hashed_customizable_and_served_by_the_identity_endpoint():
    record = fresh()
    assert (default("agent-journal"), default("agent-journal")) == ("#0090ff", "#0090ff"), \
        "the project name always chooses the same palette color"
    assert identity(record.root) == {
        "project": record.root.parent.name,
        "color": default(record.root.parent.name),
        "default_color": default(record.root.parent.name),
        "custom_color": "",
    }, "identity starts with its hashed project color"

    set_color(record.root, "#A1B2C3")
    assert identity(record.root)["color"] == "#a1b2c3", "a custom color is project-scoped and normalized"
    assert (record.root / "settings.json").is_file() is True, "the project setting stays outside every environment"
    assert refused(lambda: set_color(record.root, "red")) == "color must be a six-digit hex color", "an invalid color is refused"

    reply = dispatch("POST", "/api/identity", record.root, {}, {"color": "#123456"})
    assert (reply.code, reply.body["color"], json.loads((record.root / "settings.json").read_text())["color"]) == (200, "#123456", "#123456"), \
        "the identity endpoint saves and returns the project color"
    reply = dispatch("POST", "/api/identity", record.root, {}, {"color": None})
    assert (reply.body["color"], reply.body["custom_color"]) == (default(record.root.parent.name), ""), \
        "reset restores the hashed color"
    reply = dispatch("POST", "/api/identity", record.root, {}, {"color": "wrong"})
    assert (reply.code, reply.body["error"]) == (400, "color must be a six-digit hex color"), \
        "the endpoint refuses an invalid color"
