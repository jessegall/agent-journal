from core.modules.skills.agent_messages.read_skill_first_message import ReadSkillFirstMessage
from core.modules.triggers.agent_messages.trigger_line_message import TriggerLineMessage


def expect_agent_message_skill_with(item, path, expected) -> None:
    actual = item.agent_message(instruction=path).text
    assert expected in actual, actual


def expect_agent_message_trigger(item, number, expected) -> None:
    actual = item.agent_message(trigger=number).text
    assert actual == expected, actual


def test_a_line_someone_wrote_and_a_path_to_open_stay_whole():
    expect_agent_message_trigger(TriggerLineMessage.declared(), 500, TriggerLineMessage.declared().agent_message(trigger=500).text)
    path = ".agents/skills/commandments-rows-through-their-repository/SKILL.md"
    expect_agent_message_skill_with(ReadSkillFirstMessage.declared(), path, path)
