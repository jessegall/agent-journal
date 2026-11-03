from core.base.driver.nudge import Nudge
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_record import RuleRecord

QUEUED = NudgeDeclaration("shop.queued", NudgeType.NUDGE, "task {task} is still queued for worker {worker}", many_text="tasks {task} are still queued for worker {worker}")
STALE = NudgeDeclaration("shop.stale", NudgeType.NUDGE, "cart {cart} is stale")
PAID = NudgeDeclaration("shop.paid", NudgeType.INSTRUCTION, "pay {cart}", required_command="shop pay {cart}")
FREE_TEXT = NudgeDeclaration("shop.free", NudgeType.NUDGE, "{text}")


def answers_of(*nudges: Nudge) -> RuleAnswers:
    return answers_by_rule(*[[nudge] for nudge in nudges])


def answers_by_rule(*rules: list[Nudge]) -> RuleAnswers:
    records = [RuleRecord(f"rule_{number}", "lead", answer.outcome, answer) for number, answer in enumerate(RuleAnswer.with_nudges(*nudges) for nudges in rules)]
    return RuleAnswers(["lead"], records)


def test_three_nudges_of_one_kind_make_one_line_naming_all_three():
    answers = answers_of(QUEUED.nudge(task=5817, worker=425), QUEUED.nudge(task=5836, worker=425), QUEUED.nudge(task=5853, worker=425))
    assert answers.lines == ["tasks 5817, 5836, 5853 are still queued for worker 425"]


def test_two_kinds_make_two_lines_and_one_of_a_kind_stays_as_it_is():
    answers = answers_of(QUEUED.nudge(task=5817, worker=425), STALE.nudge(cart=7), QUEUED.nudge(task=5836, worker=425), QUEUED.nudge(task=5853, worker=425))
    assert answers.lines == ["tasks 5817, 5836, 5853 are still queued for worker 425", "cart 7 is stale"]


def test_a_single_nudge_is_left_whole():
    nudge = QUEUED.nudge(task=5817, worker=425)
    assert answers_of(nudge).delivered_nudges == [nudge] and answers_of(nudge).lines == ["task 5817 is still queued for worker 425"]


def test_a_kind_without_words_for_many_says_its_one_line_with_the_values_joined():
    answers = answers_of(STALE.nudge(cart=7), STALE.nudge(cart=8))
    assert answers.lines == ["cart 7, 8 is stale"]


def test_nudges_of_one_kind_from_different_rules_collapse_and_name_the_first_rule():
    answers = answers_by_rule([QUEUED.nudge(task=1, worker=425)], [QUEUED.nudge(task=2, worker=425)])
    assert answers.rule_lines == [("rule_0", "tasks 1, 2 are still queued for worker 425")]


def test_a_field_that_differs_is_listed_once_per_value():
    answers = answers_of(QUEUED.nudge(task=1, worker=4), QUEUED.nudge(task=2, worker=5), QUEUED.nudge(task=3, worker=4))
    assert answers.lines == ["tasks 1, 2, 3 are still queued for worker 4, 5"]


def test_the_collapsed_line_keeps_its_key_type_and_labelled_words():
    answers = answers_of(QUEUED.nudge(task=1, worker=425), QUEUED.nudge(task=2, worker=425))
    assert [(nudge.key, nudge.type) for nudge in answers.delivered_nudges] == [("shop.queued", NudgeType.NUDGE)] and answers.labelled_lines == ["journal: tasks 1, 2 are still queued for worker 425"]


def test_a_line_that_names_a_command_to_run_is_never_merged():
    answers = answers_of(PAID.nudge(cart=1), PAID.nudge(cart=2))
    assert answers.lines == ["pay 1", "pay 2"]


def test_a_line_someone_wrote_is_never_merged():
    answers = answers_of(FREE_TEXT.nudge(text="first"), FREE_TEXT.nudge(text="second"))
    assert answers.lines == ["first", "second"]


def test_a_line_said_twice_with_the_same_words_stays_one_line():
    answers = answers_of(STALE.nudge(cart=7), STALE.nudge(cart=7))
    assert answers.lines == ["cart 7 is stale"]


def test_a_collapsed_line_that_was_skipped_is_not_delivered():
    rules = answers_of(QUEUED.nudge(task=1, worker=4), QUEUED.nudge(task=2, worker=4)).rules
    answers = RuleAnswers(["lead"], rules, skipped_lines=frozenset({("shop.queued", "tasks 1, 2 are still queued for worker 4")}))
    assert answers.lines == [] and answers.delivered_nudges == []
