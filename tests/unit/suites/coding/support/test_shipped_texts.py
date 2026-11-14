import re

from suites.coding.support.shipped_profiles import HELPER_PROFILES, TEXT_VALUES, WORKER_PROFILES
from suites.coding.support.shipped_texts import RESOURCES, ShippedTexts

PROFILE_FILES = sorted((RESOURCES / "profiles").glob("*.md"))
SHIPPED_PROFILES = [*HELPER_PROFILES, *WORKER_PROFILES]


def test_every_shipped_profile_reads_its_instructions_from_a_file_of_its_name():
    assert sorted(profile.name for profile in SHIPPED_PROFILES) == sorted(path.stem for path in PROFILE_FILES)


def test_no_shipped_profile_keeps_a_placeholder_unfilled():
    assert [profile.name for profile in SHIPPED_PROFILES if re.search(r"\{[A-Z][A-Z_]+\}", profile.body)] == []


def test_a_profile_file_names_only_placeholders_that_have_a_text():
    labelled = {name for path in PROFILE_FILES for name in re.findall(r"\{([A-Z][A-Z_]+)\}", path.read_text())}
    assert sorted(labelled - set(TEXT_VALUES)) == []


def test_a_placeholder_is_replaced_by_the_text_it_names():
    assert TEXT_VALUES["WORKER_RULES"] in ShippedTexts.profile("journal-worker", TEXT_VALUES)
