from pathlib import Path

from suites.coding.support.shipped_profiles import HELPER_PROFILES

WORKERS_SKILLS = Path("src/suites/coding/modules/workers/skills")


def test_the_merger_profile_names_the_commands_that_answer_and_pass_on_a_question():
    merger = next(profile for profile in HELPER_PROFILES if profile.name == "journal-merger")
    assert "journal merger answer" in merger.body and "journal merger tell" in merger.body


def test_the_mergers_case_book_has_the_entries_for_a_question():
    case_book = (WORKERS_SKILLS / "journal-merger" / "SKILL.md").read_text()
    assert "journal merger answer <line>" in case_book and "journal merger tell" in case_book


def test_the_worker_skill_says_what_happens_after_asking():
    assert "After you ask, the merger or the journal" in (WORKERS_SKILLS / "journal-workers" / "SKILL.md").read_text()
