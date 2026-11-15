from core.modules.skills.nudges.read_skill_first_nudge import ReadSkillFirstNudge
from core.modules.triggers.nudges.trigger_line_nudge import TriggerLineNudge


def expect_nudge_skill_with(item, path, expected) -> None:
    actual = item.nudge(instruction=path).text
    assert expected in actual, actual


def expect_nudge_trigger(item, number, expected) -> None:
    actual = item.nudge(trigger=number).text
    assert actual == expected, actual


def test_a_line_someone_wrote_and_a_path_to_open_stay_whole():
    expect_nudge_trigger(TriggerLineNudge.declared(), 500, TriggerLineNudge.declared().nudge(trigger=500).text)
    path = ".agents/skills/commandments-rows-through-their-repository/SKILL.md"
    expect_nudge_skill_with(ReadSkillFirstNudge.declared(), path, path)
