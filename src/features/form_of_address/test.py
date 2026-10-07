import features
from controllers.types import Nudges
from features.form_of_address.controller import Profiles, ship
from features.form_of_address.voices import PLAIN_WORDS, SHIPPED
from features.session_briefing.start import start_block
from resources.base import SYSTEM, USER, Refused
from surfaces.settings import apply
from tests.conftest import fresh, refused
from tests.kit import report

PERSON = {"title": "Captain", "first_name": "Ada"}


def shipped_record():
    features.load()
    record = fresh()
    ship(record)
    return record


def choose(record, n: int) -> None:
    apply(record, {"form_of_address": {**PERSON, "profile": n}}, USER)


def number_of(record, title: str) -> int:
    return next(row["n"] for row in Profiles(record, actor=SYSTEM).rows.summaries() if row["title"] == title)


def test_the_start_block_talks_as_the_butler_until_a_profile_is_chosen_and_only_while_the_feature_is_on():
    features.load()
    record = fresh()
    record.set_setting("form_of_address", PERSON)
    assert 'Address me as "Captain Ada"' in start_block(record), "an empty choice talks as the Butler, by the title and first name you set"
    record.features = {**record.features, "form_of_address": False}
    assert "HOW THE USER WANTS YOU TO TALK" not in start_block(record), "switched off, the start block says nothing about it"


def test_the_four_shipped_profiles_are_rows_that_cannot_be_changed_and_an_upgrade_rewrites_their_wording():
    record = shipped_record()
    profiles = Profiles(record, actor=USER)
    assert [row["title"] for row in profiles.rows.summaries()] == [voice.title for voice in SHIPPED], "the four ship as rows"
    n = number_of(record, "Homie")
    assert refused(lambda: profiles.update(n, brief="my own")) and refused(lambda: profiles.delete(n)), "a shipped profile cannot be changed or deleted"
    row = Profiles(record, actor=SYSTEM).load(n)
    row.brief = "stale wording"
    Profiles(record, actor=SYSTEM).save(row, "updated")
    assert ship(record) == ["Homie"] and ship(record) == [], "an upgrade puts the shipped wording back, and only that"


def test_each_chosen_profile_speaks_in_its_own_voice_and_calls_you_as_it_says():
    record = shipped_record()
    lines = {}
    for voice in SHIPPED:
        choose(record, number_of(record, voice.title))
        lines[voice.title] = start_block(record)
    assert all(voice.text in lines[voice.title] for voice in SHIPPED), "each shipped profile's own voice reaches the start block"
    assert 'Address me as "Ada"' in lines["Homie"] and "Never address me by name or title" in lines["Colleague"], "a profile says what it calls you"
    choose(record, 999)
    assert SHIPPED[0].text in start_block(record), "a choice that names no profile talks as the Butler"


def test_a_profile_in_use_cannot_be_deleted_and_changing_it_reaches_the_running_agent():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    profiles = Profiles(record, actor=USER)
    own = profiles.create("Quiet", brief="Keep every answer to one line.", calling="none", sample="In and green.")
    choose(record, own.n)
    assert refused(lambda: profiles.delete(own.n)), "the profile in use is refused deletion until another is chosen"
    profiles.update(own.n, brief="Keep every answer to two lines.")
    briefs = [n.brief for n in Nudges(record).all() if n.title == "the user changed how you talk to them"]
    assert any("two lines" in brief for brief in briefs), "editing the profile in use tells the agent at once"
    choose(record, 0)
    profiles.delete(own.n)


def test_duplicating_makes_an_editable_copy_and_a_calling_must_be_one_of_three():
    record = shipped_record()
    profiles = Profiles(record, actor=USER)
    copy = profiles.duplicate(number_of(record, "Coach"))
    assert copy.title == "Coach (my copy)" and not copy.system and copy.brief == SHIPPED[3].text, "a copy carries the voice and is yours to change"
    assert profiles.update(copy.n, brief="Cheer less.").brief == "Cheer less.", "a copy can be edited"
    assert profiles.update(copy.n, calling="none").calling == "none", "and how it calls you can be changed"
    assert refused(lambda: profiles.update(copy.n, calling="sir")), "to one of the three only"
    assert refused(lambda: profiles.create("Odd", brief="x", calling="sir")), "a calling outside the three is refused"
    assert profiles.callings()["none"] == "" and "{you}" not in profiles.samples()[copy.n], "a copy keeps the sample with your name filled in"


def test_each_profile_answers_a_joke_in_its_own_manner_and_the_journal_words_stay_plain_in_every_voice():
    record = shipped_record()
    assert len({voice.humour for voice in SHIPPED}) == len(SHIPPED) and all(voice.humour for voice in SHIPPED), "every shipped profile has humour of its own"
    for voice in SHIPPED:
        choose(record, number_of(record, voice.title))
        block = start_block(record)
        assert voice.humour in block, "the profile's humour is in the voice text"
        assert PLAIN_WORDS in block and "call your helpers" not in block, "helper, subagent, to-do and environment stay plain in every voice"
    profiles = Profiles(record, actor=USER)
    copy = profiles.duplicate(number_of(record, "Butler"))
    assert copy.humour == SHIPPED[0].humour, "a copy keeps the humour"
    assert profiles.update(copy.n, humour="Answer with one growl.").humour == "Answer with one growl.", "and it can be changed"
    assert refused(lambda: profiles.update(number_of(record, "Butler"), humour="Answer with one growl.")), "a shipped profile's humour is locked"
