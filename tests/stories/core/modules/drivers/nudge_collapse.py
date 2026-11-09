from core.base.driver.nudge import Nudge
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_record import RuleRecord
from core.testing.expect_row import expect_row

QUEUED = NudgeDeclaration("shop.queued", NudgeType.STEERING, "task {task} is still queued for worker {worker}", plural_text="tasks {task} are still queued for worker {worker}")
STALE = NudgeDeclaration("shop.stale", NudgeType.STEERING, "cart {cart} is stale")
CHARGED = NudgeDeclaration("shop.charged", NudgeType.STEERING, "charge {cart}", required_command="shop charge {cart}")
FREE_TEXT = NudgeDeclaration("shop.free", NudgeType.STEERING, "{text}")


def read_answers(*nudges: Nudge) -> RuleAnswers:
    return rule_answers(*[[nudge] for nudge in nudges])


def rule_answers(*rules: list[Nudge]) -> RuleAnswers:
    records = [RuleRecord(f"rule_{number}", "lead", answer.outcome, answer) for number, answer in enumerate(RuleAnswer.with_nudges(*nudges) for nudges in rules)]
    return RuleAnswers(["lead"], records)


def test_three_nudges_of_one_kind_make_one_line_naming_all_three():
    answers = read_answers(QUEUED.nudge(task=5817, worker=425), QUEUED.nudge(task=5836, worker=425), QUEUED.nudge(task=5853, worker=425))
    expect_row(answers, lines=["tasks 5817, 5836, 5853 are still queued for worker 425"])


def test_two_kinds_make_two_lines_and_one_of_a_kind_stays_as_it_is():
    answers = read_answers(QUEUED.nudge(task=5817, worker=425), STALE.nudge(cart=7), QUEUED.nudge(task=5836, worker=425), QUEUED.nudge(task=5853, worker=425))
    expect_row(answers, lines=["tasks 5817, 5836, 5853 are still queued for worker 425", "cart 7 is stale"])


def test_a_single_nudge_is_left_whole():
    nudge = QUEUED.nudge(task=5817, worker=425)
    expect_delivered_nudges_answers(nudge, [nudge])
    expect_lines_answers(nudge, ["task 5817 is still queued for worker 425"])


def test_a_kind_without_words_for_many_says_its_one_line_with_the_values_joined():
    answers = read_answers(STALE.nudge(cart=7), STALE.nudge(cart=8))
    expect_row(answers, lines=["cart 7, 8 is stale"])


def test_nudges_of_one_kind_from_different_rules_collapse_and_name_the_first_rule():
    answers = rule_answers([QUEUED.nudge(task=1, worker=425)], [QUEUED.nudge(task=2, worker=425)])
    expect_row(answers, rule_lines=[("rule_0", "tasks 1, 2 are still queued for worker 425")])


def test_tasks_for_different_workers_stay_separate():
    answers = read_answers(QUEUED.nudge(task=1, worker=4), QUEUED.nudge(task=2, worker=5), QUEUED.nudge(task=3, worker=4))
    expect_row(answers, lines=["tasks 1, 3 are still queued for worker 4", "task 2 is still queued for worker 5"])


def test_the_collapsed_line_keeps_its_key_type_and_labelled_words():
    answers = read_answers(QUEUED.nudge(task=1, worker=425), QUEUED.nudge(task=2, worker=425))
    expect_key_nudge_type(answers, [("shop.queued", NudgeType.STEERING)])
    expect_labelled_lines_answers(answers, ["journal: tasks 1, 2 are still queued for worker 425"])


def test_a_line_that_names_a_command_to_run_is_never_merged():
    answers = read_answers(CHARGED.nudge(cart=1), CHARGED.nudge(cart=2))
    expect_row(answers, lines=["charge 1", "charge 2"])


def test_a_line_someone_wrote_is_never_merged():
    answers = read_answers(FREE_TEXT.nudge(text="first"), FREE_TEXT.nudge(text="second"))
    expect_row(answers, lines=["first", "second"])


def test_a_line_said_twice_with_the_same_words_stays_one_line():
    answers = read_answers(STALE.nudge(cart=7), STALE.nudge(cart=7))
    expect_row(answers, lines=["cart 7 is stale"])


def test_a_collapsed_line_that_was_skipped_is_not_delivered():
    rules = read_answers(QUEUED.nudge(task=1, worker=4), QUEUED.nudge(task=2, worker=4)).rules
    answers = RuleAnswers(["lead"], rules, skipped_lines=frozenset({("shop.queued", "tasks 1, 2 are still queued for worker 4")}))
    expect_row(answers, lines=[])
    expect_row(answers, delivered_nudges=[])


def expect_key_nudge_type(answers, expected) -> None:
    actual = [(nudge.key, nudge.type) for nudge in answers.delivered_nudges]
    assert actual == expected, actual


def expect_labelled_lines_answers(answers, expected) -> None:
    actual = answers.labelled_lines
    assert actual == expected, actual


def expect_delivered_nudges_answers(nudge, expected) -> None:
    actual = read_answers(nudge).delivered_nudges
    assert actual == expected, actual


def expect_lines_answers(nudge, expected) -> None:
    actual = read_answers(nudge).lines
    assert actual == expected, actual
