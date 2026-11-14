
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_outcome_with, expect_value

TEST_ROWS_REASON = "the test reads every row it checks"


def expect_delivery_count(rows, expected) -> None:
    actual = sorted(((row.text, row.delivery_count) for row in rows))
    assert actual == expected, actual


def expect_turn_limited_nudge(declared, expected) -> None:
    actual = declared.nudge().turn_limited
    assert actual is expected, actual


def expect_item_nudge_type(expected) -> None:
    actual = [item.value for item in NudgeType]
    assert actual == expected, actual


def expect_nudge(nudge, expected) -> None:
    actual = len(nudge.text)
    assert actual == expected, actual


def expect_endswith_nudge(nudge, text) -> None:
    actual = nudge.text.endswith(text)
    assert actual, actual


def test_a_declared_nudge_fills_its_fields_and_keeps_its_key_and_type():
    nudge = NudgeDeclaration("shop.total", NudgeType.STEERING, "the total is {total}").nudge(total=12)
    expect_row(nudge, key="shop.total", type=NudgeType.STEERING, text="the total is 12", labelled="journal: the total is 12")


def test_a_nudge_longer_than_its_longest_is_cut_in_its_middle_so_its_end_stays():
    nudge = NudgeDeclaration("shop.long", NudgeType.STEERING, "{text} {other} do this").nudge(text="x" * 70, other="y" * 70)
    expect_nudge(nudge, 120)
    expect_endswith_nudge(nudge, "do this")
    expect_outcome_with(nudge, "…")


def test_a_steering_line_and_a_refusal_are_cut_at_120_characters_and_only_info_may_be_longer():
    template = "{text} " + "w" * 700
    lengths = {nudge_type: len(NudgeDeclaration("shop.kind", nudge_type, template).nudge(text="x").text) for nudge_type in NudgeType}
    expect_value(lengths, {NudgeType.NOTICE: 702, NudgeType.STEERING: 120, NudgeType.REFUSAL: 120, NudgeType.SAFETY_REFUSAL: 120})


def test_each_type_can_be_declared():
    expect_item_nudge_type(["info", "steering", "refusal", "safety_refusal"])


def test_a_reminder_on_a_clock_is_said_again_in_the_same_turn():
    declared = NudgeDeclaration("shop.reminder", NudgeType.STEERING, "check the cart", turn_limited=False)
    expect_turn_limited_nudge(declared, False)
