import features
from features.form_of_address.address import GIT_NAMES
from features.session_briefing.start import start_block
from tests.conftest import fresh


def test_the_start_block_addresses_the_user_only_while_the_feature_is_on():
    features.load()
    record = fresh()
    GIT_NAMES[str(record.root.parent)] = ""
    record.set_setting("form_of_address", {"title": "Captain", "first_name": "Ada"})
    assert 'ADDRESS THE USER as "Captain Ada"' in start_block(record), "the title and first name the user set are how the agent addresses them"
    record.features = {**record.features, "form_of_address": False}
    assert "ADDRESS THE USER" not in start_block(record), "switched off, the start block says nothing about it"
