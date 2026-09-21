import pytest

import features
from controllers.types import Plugins
from features.format import formatted
from features.plugins.manifest import chat
from resources.base import SYSTEM
from tests.conftest import fresh, refused


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_chat_rule_is_read_from_the_manifest_and_refused_when_it_is_not_one():
    assert chat("works", [{"find": r"WF-(\d+)", "as": r"[workflow \1](#/wf/\1)"}]) == \
        [{"find": r"WF-(\d+)", "as": r"[workflow \1](#/wf/\1)"}], "a rule finds a pattern and says what it becomes"
    assert ("is not a pattern" in refused(lambda: chat("works", [{"find": "(", "as": "x"}]))) is True, \
        "a rule that is not a pattern is refused"
    assert ("each chat rule is" in refused(lambda: chat("works", [{"find": "a", "as": "b", "then": "c"}]))) is True, \
        "a rule with anything else in it is refused"


def test_an_installed_plugins_rules_shape_the_text_the_chat_is_given():
    record = fresh()
    plugins = Plugins(record, actor=SYSTEM)
    row = plugins.create("Workflows", manifest={"name": "works", "chat": [{"find": r"WF-(\d+)", "as": r"[workflow \1](#/wf/\1)"}]}, enabled=True)
    assert formatted("see WF-42 for the run", record) == "see [workflow 42](#/wf/42) for the run", \
        "the plugin's rule is applied to what the chat is given"
    plugins.update(row.n, enabled=False)
    assert formatted("see WF-42 for the run", record) == "see WF-42 for the run", "a plugin that is off shapes nothing"
    assert formatted("see WF-42", None) == "see WF-42", "with no record, nothing is shaped"
