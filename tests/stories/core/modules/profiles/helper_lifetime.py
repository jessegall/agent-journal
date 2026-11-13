import json

import pytest

from engine.registry.registry import Registry
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.profile_storage import boot, change_version, profile_line, profile_path, profile_row, profile_story, save_profile_file, save_registered
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_MEDIOR_PROFILE

__all__ = ["profile_story"]

OCCUPANT_REFUSAL = "occupant must be continue, when-cold or each-launch"
KEPT_REFUSAL = "agents are kept; a user retires them"
REVIEWER_SAVE_LINE = 'profile save critic --description "Reads a change and says what is wrong" --body "Read the diff." --reason needed'
MERGER_PROFILE_TEXT = f"---\nname: {MERGER_PROFILE.name}\n{{field}}\n---\n"
REVIEWER_PROFILE_TEXT = "---\nname: critic\ndescription: Reads changes\nkind: helper\nmodel: inherit\n{field}\n---\nRead the diff.\n"


@pytest.fixture
def person(new_story):
    return new_story(fixture=UserBuilder)


def personal_file(story, name: str, text: str):
    path = save_profile_file(story, name, text)
    boot(story)
    return path


def test_a_personal_file_with_occupant_each_launch_shows_in_profile_show(person):
    personal_file(person, f"{MERGER_PROFILE.name}", MERGER_PROFILE_TEXT.format(field="occupant: each-launch"))
    person.expect_text(f"profile show {MERGER_PROFILE.name}", "occupant: each-launch", actor=person.user)
    person.expect_text(f"profile show {MERGER_PROFILE.name} --json", '"occupant": "each-launch"', actor=person.user)


def test_profile_save_with_an_occupant_writes_the_file_and_the_list_shows_it(person):
    person.expect_success(f"profile save {MERGER_PROFILE.name} --occupant continue --reason needed", actor=person.user)
    person.expect_rows('occupant: "continue"' in profile_path(person, f"{MERGER_PROFILE.name}").read_text())
    merger_line = next(line for line in person.run("profile list", actor=person.user).output_text.splitlines() if line.startswith(f"{MERGER_PROFILE.name}"))
    person.expect_rows("continue" in merger_line, detail=merger_line)


def test_a_profile_with_no_occupant_field_is_when_cold(person):
    person.expect_success(REVIEWER_SAVE_LINE, actor=person.user)
    person.expect_text("profile show critic", "occupant: when-cold", actor=person.user)


def test_independent_reads_as_each_launch_and_is_never_written_again(person):
    personal_file(person, "critic", REVIEWER_PROFILE_TEXT.format(field="independent: true"))
    person.expect_text("profile show critic", "occupant: each-launch", actor=person.user)
    person.expect_success(f"{REVIEWER_SAVE_LINE} --independent", actor=person.user)
    text = profile_path(person).read_text()
    person.expect_rows('occupant: "each-launch"' in text, "independent" not in text, detail=text)


def test_an_unknown_occupant_word_is_refused_and_the_file_stays_as_it_was(person):
    person.expect_success(REVIEWER_SAVE_LINE, actor=person.user)
    original_bytes = profile_path(person).read_bytes()
    person.expect_refusal(f"{REVIEWER_SAVE_LINE} --occupant forever", OCCUPANT_REFUSAL, actor=person.user)
    person.expect_rows(profile_path(person).read_bytes() == original_bytes)


@pytest.mark.parametrize("word", ["kept", "never"])
def test_a_reuse_word_in_a_file_or_on_the_save_line_is_refused_and_the_file_stays_as_it_was(person, word):
    path = save_profile_file(person, "critic", REVIEWER_PROFILE_TEXT.format(field=f"reuse: {word}"))
    original_bytes = path.read_bytes()
    person.expect_refusal(f"{REVIEWER_SAVE_LINE} --reuse never", KEPT_REFUSAL, actor=person.user)
    person.expect_rows(path.read_bytes() == original_bytes)


def test_a_module_upgrade_keeps_a_persons_occupant(profile_story):
    story = profile_story
    save_registered(story, "--occupant", "continue")
    change_version(story, "ProfileVersionTwo")
    row = profile_row(story, "module-reader")
    story.expect_rows(row["occupant"] == "continue", "occupant" in row["changed"], row["description"] == "Reads a changed question", detail=str(row))


def test_a_worker_profile_that_declares_an_occupant_is_refused_naming_its_type_and_start_line(person):
    person.expect_refusal(f"profile save {WORKER_MEDIOR_PROFILE.name} --occupant each-launch --reason needed", "worker", actor=person.user)
    person.expect_refusal(f"profile save {WORKER_MEDIOR_PROFILE.name} --occupant each-launch --reason needed", "journal worker dispatch", actor=person.user)


def test_the_reviewer_the_merger_and_the_researcher_each_show_their_own_occupant(profile_story):
    story = profile_story
    profile_line(story, ["profile", "save", f"{MERGER_PROFILE.name}", "--occupant", "each-launch"])
    occupants = {name: profile_row(story, name)["occupant"] for name in (f"{PLAN_REVIEWER_PROFILE.name}", f"{MERGER_PROFILE.name}", f"{RESEARCHER_PROFILE.name}")}
    story.expect_rows(occupants == {f"{PLAN_REVIEWER_PROFILE.name}": "each-launch", f"{MERGER_PROFILE.name}": "each-launch", f"{RESEARCHER_PROFILE.name}": "when-cold"}, detail=str(occupants))


def stored_profiles(story, name: str, **fields: object) -> str:
    entries = json.loads(story.container.get(Registry).entries_text())
    for entry in entries["profiles"]:
        if entry["profile"]["name"] == name:
            entry["profile"].pop("occupant", None)
            entry["profile"].update(fields)
    return json.dumps(entries)


@pytest.mark.parametrize("independent,occupant", [(True, "each-launch"), (False, "when-cold")])
def test_a_stored_row_with_only_independent_restores_as_its_occupant(person, independent, occupant):
    restored = Registry.parsed("profiles", stored_profiles(person, f"{RESEARCHER_PROFILE.name}", independent=independent))
    person.expect_rows(str(restored.profile(f"{RESEARCHER_PROFILE.name}").profile.occupant) == occupant)


def test_a_stored_row_that_holds_a_reuse_word_is_refused(person):
    with pytest.raises(Exception, match=KEPT_REFUSAL):
        Registry.parsed("profiles", stored_profiles(person, f"{RESEARCHER_PROFILE.name}", reuse="never"))
