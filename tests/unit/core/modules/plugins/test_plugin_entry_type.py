import pytest

from core.modules.plugins.support.plugin_answer import PluginAnswer


@pytest.mark.parametrize("entry", [{"type": "sin-found"}, {"kind": "sin-found"}, {"type": "sin-found", "kind": "old"}])
def test_an_entry_names_its_type_and_an_older_plugin_its_kind(entry):
    assert PluginAnswer.entry_type(entry) == "sin-found"
