from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from engine.testing.expectations.expected_nudge import expected_nudge

PLAN_WAITS = NudgeDeclaration("sample.plan_waits", NudgeType.STEERING, "plan:{plan} is approved and {count} places are free")


def test_a_line_matches_its_declaration_with_the_values_given_in_any_case():
    line = PLAN_WAITS.nudge(plan=4, count=2).text.upper()
    assert expected_nudge(PLAN_WAITS, plan=4, count=2).matches_text(line)


def test_a_value_left_out_matches_any_text():
    assert expected_nudge(PLAN_WAITS, plan=4).matches_text(PLAN_WAITS.nudge(plan=4, count=9).text)


def test_another_value_does_not_match():
    assert not expected_nudge(PLAN_WAITS, plan=5).matches_text(PLAN_WAITS.nudge(plan=4, count=2).text)


def test_a_line_of_another_declaration_does_not_match():
    different = NudgeDeclaration("sample.other", NudgeType.STEERING, "plan:{plan} was cancelled")
    assert not expected_nudge(PLAN_WAITS).matches_lines([different.nudge(plan=4).text])


def test_a_kept_nudge_matches_by_its_key_and_fields():
    kept = PLAN_WAITS.nudge(plan=4, count=2)
    assert expected_nudge(PLAN_WAITS, plan=4).is_kept_as(kept)
    assert not expected_nudge(PLAN_WAITS, plan=3).is_kept_as(kept)
