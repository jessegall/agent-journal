from suites.coding.support.profile_commands import WORKER_COMMANDS
from suites.coding.support.shipped_profiles import WORKER_RULES, WORKER_UNIT_RULES, WORKER_WRITE_RULES
from suites.coding.support.worker_test_rule import WORKER_TEST_RULE
from suites.coding.modules.workers.support.worker_command import WORK_STEPS


def test_worker_rules_are_the_write_rules_and_the_unit_rules():
    assert WORKER_RULES == WORKER_WRITE_RULES + WORKER_UNIT_RULES


def test_the_worker_texts_say_commit_as_often_as_you_like():
    assert "nothing limits it" in WORKER_UNIT_RULES and "commit as often as you like" in WORKER_COMMANDS


def test_the_worker_texts_say_checkpoints_run_in_the_background():
    assert all("in the background on your commit" in worker_text for worker_text in (WORKER_UNIT_RULES, WORKER_COMMANDS, WORKER_TEST_RULE))


def test_no_worker_text_says_tests_run_at_a_checkpoint_of_the_plan():
    assert not any("at a checkpoint of the plan" in worker_text for worker_text in (WORKER_RULES, WORKER_COMMANDS, WORKER_TEST_RULE))


def test_every_worker_text_names_ask_merge():
    assert all("journal worker ask-merge" in worker_text for worker_text in (WORKER_UNIT_RULES, WORKER_COMMANDS, WORK_STEPS))


def test_no_worker_text_names_journal_worker_deliver():
    assert not any("journal worker deliver" in worker_text for worker_text in (WORKER_RULES, WORKER_COMMANDS, WORK_STEPS))


def test_no_worker_text_says_the_commit_with_none_left_is_final():
    assert not any("is final" in worker_text for worker_text in (WORKER_RULES, WORKER_COMMANDS, WORK_STEPS))
