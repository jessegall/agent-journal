import pytest

import features
from controllers.types import Agents, Notices, Notifications, Nudges, Todos
from engine.stored import read_json
from engine.hooks import gate_file
from features.base import held
from features.plugins.answer import MOST, apply
from resources.base import PLUGIN, SYSTEM
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_each_key_of_an_answer_becomes_a_row_of_its_own_written_as_the_plugin():
    record = fresh()
    Agents(record, actor=SYSTEM).by_session("claude-3")

    did = apply(record, "works", "claude-3", {
        "whisper": "phpstan: 2 errors in src/Engine.php",
        "say": "the workflow finished",
        "notify": {"title": "Workflow ran", "abstract": "3 nodes", "brief": "all green"},
        "notice": {"title": "Pint failed", "tone": "warn"},
        "todo": {"title": "Add a test for NodeX", "brief": "it has none"},
    })
    assert did == ["whisper", "say", "notify", "notice", "todo"], "every key was applied, in the order they are known"
    whispered, said = sorted(Nudges(record).all(), key=lambda r: r.n)
    assert [(n.private, n.session, n.brief) for n in (whispered, said)] == \
        [(True, "claude-3", "phpstan: 2 errors in src/Engine.php"), (False, "claude-3", "the workflow finished")], \
        "a whisper is private and a say is spoken, both to the event's agent"
    assert ([(n.title, n.abstract) for n in Notifications(record).all()], [(n.title, n.data.get("tone")) for n in Notices(record).all()]) == \
        ([("Workflow ran", "3 nodes")], [("Pint failed", "warn")]), "a notification and a notice are written with what they say"
    assert [(t.title, t.brief) for t in Todos(record).all()] == [("Add a test for NodeX", "it has none")], "a to-do is filed with its brief"
    assert ({r.data.get("plugin") for r in Todos(record).all() + Notifications(record).all()}, Todos(record).all()[0].seen) == \
        ({"works"}, [PLUGIN]), "every row says which plugin wrote it, and that a plugin did"

    apply(record, "works", "claude-3", {"hold": "tests are red: run composer test first"})
    assert read_json(gate_file(record.root, record.env, "claude-3"), {}).get("plugin:works") == "tests are red: run composer test first", \
        "the hold is written under the plugin's own key, with its reason"
    assert ("tests are red: run composer test first" in held(record, "claude-3")) is True, "and the gate says it in the agent's words"
    apply(record, "works", "claude-3", {"hold": ""})
    assert ("plugin:works" in read_json(gate_file(record.root, record.env, "claude-3"), {}), "tests are red" in held(record, "claude-3")) == \
        (False, False), "an empty hold lets go"

    did = apply(record, "works", "claude-3", {"refuse": "too late", "nonsense": 1, "todo": {"title": ""}, "say": "still said"})
    assert did == ["say"], "refuse and unknown keys are ignored, and a refused row does not stop the others"
    assert len(Todos(record).all()) == 1, "nothing was filed for the empty to-do"

    many = {key: "x" for key in ("whisper", "say")}
    assert (len(apply(record, "works", "claude-3", many)) <= MOST) is True, "at most twenty instructions are taken from one answer"
