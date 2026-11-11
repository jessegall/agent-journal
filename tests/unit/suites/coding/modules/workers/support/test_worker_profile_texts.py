from suites.coding.support.profile_commands import WORKER_COMMANDS
from suites.coding.support.shipped_profiles import WORKER_RULES, WORKER_UNIT_RULES, WORKER_WRITE_RULES


def test_worker_rules_are_the_write_rules_and_the_unit_rules():
    assert WORKER_RULES == WORKER_WRITE_RULES + WORKER_UNIT_RULES


def test_the_worker_texts_say_commit_as_often_as_you_like():
    assert "Nothing limits your commits" in WORKER_UNIT_RULES and "commit as often as you like" in WORKER_COMMANDS
