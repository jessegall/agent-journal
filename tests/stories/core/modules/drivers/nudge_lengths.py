from core.modules.skills.support.skill_nudges import READ_SKILL_FIRST
from core.modules.triggers.support.trigger_nudges import TRIGGER_LINE


def test_a_line_someone_wrote_and_a_path_to_open_stay_whole():
    expect_nudge_trigger(TRIGGER_LINE, "x", 500, "x" * 500)
    path = ".agents/skills/commandments-rows-through-their-repository/SKILL.md"
    expect_nudge_skill_with(READ_SKILL_FIRST, path, path)


def expect_nudge_skill_with(item, path, expected) -> None:
    actual = item.nudge(path=path).text
    assert expected in actual, actual


def expect_nudge_trigger(item, text, number, expected) -> None:
    actual = item.nudge(text=text * number).text
    assert actual == expected, actual
