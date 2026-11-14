from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST
from core.modules.triggers.support.trigger_nudges import TRIGGER_LINE


def test_a_line_someone_wrote_and_a_path_to_open_stay_whole():
    expect_nudge_trigger(TRIGGER_LINE, 500, TRIGGER_LINE.nudge(trigger=500).text)
    path = ".agents/skills/commandments-rows-through-their-repository/SKILL.md"
    expect_nudge_skill_with(READ_SKILL_FIRST, path, path)


def expect_nudge_skill_with(item, path, expected) -> None:
    actual = item.nudge(instruction=path).text
    assert expected in actual, actual


def expect_nudge_trigger(item, number, expected) -> None:
    actual = item.nudge(trigger=number).text
    assert actual == expected, actual
