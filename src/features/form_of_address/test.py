# Stays a test: it ships and rewrites the real profile rows on an upgrade and sets the voice once for every environment, through files a Given cannot state.
import json
from pathlib import Path

import features
from controllers.types import Messages, Nudges
from controllers.form_of_address.controller import Profiles, ship
from resources.voices import PLAIN_WORDS, SHIPPED
from features.session_briefing.start import start_block
from resources.base import SYSTEM, USER, Refused
from framework.viewer.settings import apply
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
    return next(row.n for row in Profiles(record, actor=SYSTEM).rows.summaries() if row.title == title)


def test_the_start_block_talks_as_the_butler_until_a_profile_is_chosen_and_only_while_the_feature_is_on():
    features.load()
    record = fresh()
    record.set_setting("form_of_address", PERSON)
    assert 'Address me as "Captain Ada"' in start_block(record), "an empty choice talks as the Butler, by the title and first name you set"
    record.features = {**record.features, "form_of_address": False}
    assert "HOW THE USER WANTS YOU TO TALK" not in start_block(record), "switched off, the start block says nothing about it"


def test_the_five_shipped_profiles_are_rows_that_cannot_be_changed_and_an_upgrade_rewrites_their_wording():
    record = shipped_record()
    profiles = Profiles(record, actor=USER)
    assert [row.title for row in profiles.rows.summaries()] == [voice.title for voice in SHIPPED], "the five ship as rows"
    n = number_of(record, "Homie")
    assert refused(lambda: profiles.update(n, brief="my own")) and refused(lambda: profiles.delete(n)), "a shipped profile cannot be changed or deleted"
    row = Profiles(record, actor=SYSTEM).load(n)
    row.brief = "stale wording"
    Profiles(record, actor=SYSTEM).save(row, "updated")
    assert ship(record) == ["Homie"] and ship(record) == [], "an upgrade puts the shipped wording back, and only that"
    shipped_voices = {row.title: Profiles(record, actor=SYSTEM).load(row.n).voice for row in profiles.rows.summaries()}
    assert shipped_voices == {"Butler": "butler", "Homie": "homie", "Colleague": "colleague", "Coach": "coach", "Squire": "squire"}, \
        "each shipped profile carries its illustration"
    figures = json.loads((Path(__file__).resolve().parents[2] / "web" / "public" / "voices" / "figures" / "figures.json").read_text())
    assert set(shipped_voices.values()) <= set(figures), "and the 3D figure of the voice it names ships with the viewer"
    held = {row.title: Profiles(record, actor=SYSTEM).load(row.n).introduction for row in profiles.rows.summaries()}
    assert held == {voice.title: voice.introduction for voice in SHIPPED} and all(held.values()), "each shipped profile introduces itself in its own voice, kept on its row"
    assert profiles.load(profiles.duplicate(n).n).introduction == held["Homie"], "a copy keeps the introduction, which its owner can then rewrite"
    assert all(len(voice.faces()) == 3 for voice in SHIPPED) and Profiles(record, actor=SYSTEM).load(n).emoji == "🤙 😎 🔥", "each voice carries a few emoji of its own on its row"
    asked = Messages(record, actor=SYSTEM).create("a question")
    assert refused(lambda: Messages(record, actor=SYSTEM).react(asked.n, "🤙")), "the Butler in use has no 🤙 to react with"
    choose(record, n)
    assert "Your own emoji are 🤙 😎 🔥" in start_block(record), "the voice in use tells the agent its emoji"
    Messages(record, actor=SYSTEM).react(asked.n, "🤙")
    assert refused(lambda: Messages(record, actor=SYSTEM).react(asked.n, "⚔️")), "and the reaction set follows the voice in use"


def test_each_chosen_profile_speaks_in_its_own_voice_and_calls_you_as_it_says():
    record = shipped_record()
    lines = {}
    for voice in SHIPPED:
        choose(record, number_of(record, voice.title))
        lines[voice.title] = start_block(record)
    assert all(voice.text in lines[voice.title] for voice in SHIPPED), "each shipped profile's own voice reaches the start block"
    assert 'Address me as "Ada"' in lines["Homie"] and "Never address me by name or title" in lines["Colleague"], "a profile says what it calls you"
    assert 'Address me as "my liege"' in lines["Squire"] and "Captain" not in lines["Squire"], "the Squire calls you by words of its own, never by your title and name"
    squire = Profiles(record, actor=SYSTEM).load(number_of(record, "Squire"))
    assert (squire.address, Profiles(record, actor=SYSTEM).samples()[squire.n].split()[-1]) == ("my liege", "liege!"), \
        "a voice carries its own form of address, and its sample says it"
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
    assert all("one opening sentence in the new voice" in brief for brief in briefs) and len(briefs) >= 2, \
        "every change of voice, choosing a profile as much as editing it, tells the agent to answer with one opening sentence in the new voice"
    choose(record, 0)
    profiles.delete(own.n)


def test_duplicating_makes_an_editable_copy_and_a_calling_must_be_one_of_three():
    record = shipped_record()
    profiles = Profiles(record, actor=USER)
    copy = profiles.duplicate(number_of(record, "Coach"))
    assert copy.title == "Coach (my copy)" and not copy.system and copy.brief == SHIPPED[3].text, "a copy carries the voice and is yours to change"
    assert (copy.voice, profiles.create("Plain", brief="x", sample="y").voice) == ("coach", ""), "a copy keeps its picture and a profile made without one shows none"
    assert profiles.update(copy.n, brief="Cheer less.").brief == "Cheer less.", "a copy can be edited"
    assert profiles.update(copy.n, calling="none").calling == "none", "and how it calls you can be changed"
    assert refused(lambda: profiles.update(copy.n, calling="sir")), "to one of the three only"
    assert refused(lambda: profiles.create("Odd", brief="x", calling="sir")), "a calling outside the three is refused"
    assert profiles.callings()["none"] == "" and "{you}" not in profiles.samples()[copy.n], "a copy keeps the sample with your name filled in"
    from resources.voices import CARTOON, NAMINGS, SPORTING
    assert (copy.naming, [style["label"] for style in profiles.namings()]) == (SPORTING.text, [style.label for style in NAMINGS]), \
        "a copy keeps how the Coach names its agents, and the styles to choose from are offered"
    named = {row.title: Profiles(record, actor=SYSTEM).load(row.n).naming for row in profiles.rows.summaries()}
    assert ("Dr. Einstein" in named["Butler"], "Big Mike" in named["Homie"], "Ada, reviewer" in named["Colleague"], "Coach Bolt" in named["Coach"]) == \
        (True, True, True, True), "each shipped profile names agents in its own style"
    assert profiles.update(copy.n, naming=CARTOON.text).naming == CARTOON.text, "and a profile of your own names them as you write"
    agents = {row.title: Profiles(record, actor=SYSTEM).load(row.n).agent_name for row in profiles.rows.summaries()}
    assert ({title: agents[title] for title in ("Butler", "Homie", "Colleague", "Coach")}, copy.agent_name) == \
        ({"Butler": "Alfred", "Homie": "Lil Agent", "Colleague": "Sam", "Coach": "Coach"}, "Coach"), "each profile names the agent its helpers address"
    butler = number_of(record, "Butler")
    assert profiles.update(butler, agent_name="Jeeves").agent_name == "Jeeves", "the agent's name can be changed on a built-in profile too"
    assert refused(lambda: profiles.update(butler, brief="Be loud.")), "while the rest of a built-in profile stays as shipped"


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


def test_the_voice_and_every_project_wide_setting_and_switch_are_set_once_for_every_environment():
    from controllers.types import Features
    from engine.record import Record
    record = shipped_record()
    other = Record(record.root, "other")
    other.home.mkdir(parents=True)
    choose(record, number_of(record, "Coach"))
    record.set_setting("viewer", {"color_scheme": "dark", "zoom": 2})
    record.set_setting("boards", {"filler_model": "opus", "orchestrating": True})
    Features(record, actor=SYSTEM).switch("boards", False)
    assert other.setting("form_of_address") == {**PERSON, "profile": number_of(record, "Coach")}, "a new environment has the voice already, so it never asks"
    assert (other.viewer, other.setting("boards")) == ({"color_scheme": "dark"}, {"filler_model": "opus"}), \
        "the project's parts are shared and the rest stays with the environment that set it"
    assert record.setting("boards") == {"filler_model": "opus", "orchestrating": True}, "the environment reads its own parts and the project's together"
    assert not features.FEATURES["boards"].enabled(other), "a project-wide switch is turned once for every environment"
    assert "\"form_of_address\"" in (record.root / "settings.json").read_text(), "the voice is written in the project's settings"
