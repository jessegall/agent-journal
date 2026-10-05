import features
from features.session_briefing.start import start_block
from tests.conftest import fresh


def test_the_start_block_addresses_the_user_only_while_the_feature_is_on():
    features.load()
    record = fresh()
    record.set_setting("form_of_address", {"title": "Captain", "first_name": "Ada"})
    assert 'ADDRESS THE USER as "Captain Ada"' in start_block(record), "the title and first name the user set are how the agent addresses them"
    record.features = {**record.features, "form_of_address": False}
    assert "ADDRESS THE USER" not in start_block(record), "switched off, the start block says nothing about it"


def test_the_chosen_profile_is_the_voice_and_a_change_reaches_the_running_agent():
    from features.form_of_address.voices import SHIPPED
    from tests.kit import report
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    record.set_setting("form_of_address", {"title": "Captain", "first_name": "Ada"})
    assert 'ADDRESS THE USER as "Captain Ada" the way a good butler would' in start_block(record), "until a profile is chosen the agent talks as the Butler"
    lines = {voice.key: start_block(record) for voice in SHIPPED if not record.set_setting("form_of_address", {"title": "Captain", "first_name": "Ada", "profile": voice.key})}
    assert all(voice.text.split("{")[0] in lines[voice.key] for voice in SHIPPED) and len({voice.text for voice in SHIPPED}) == 4, \
        "each shipped profile's own voice reaches the start block"
    assert '"Ada"' in lines["homie"] and "Captain" not in lines["homie"].split("TALK TO THE USER")[1].split("\n")[0], \
        "a profile that calls you by name drops the title, which stays in Settings"
    from surfaces.settings import apply
    apply(record, {"form_of_address": {"title": "Captain", "first_name": "Ada", "profile": "coach"}}, "user")
    from controllers.types import Nudges
    briefs = [n.brief for n in Nudges(record).all() if n.title == "the user changed how you talk to them"]
    assert len(briefs) == 1 and "encouraging coach" in briefs[0], "a change saved in Settings reaches the running agent at once, with the new voice"
