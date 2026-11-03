from core.base.driver.count_down import CountDown
from core.base.driver.seconds import Seconds
from core.modules.drivers.support.tool_use_span import ToolUseSpan
from core.modules.drivers.support.write_span import WriteSpan


def test_a_count_down_says_the_action_due_and_what_remains_in_the_unit_of_its_span():
    assert CountDown("a", "read message {messages}", ToolUseSpan(20)).nudge(3, messages=12).text == "read message 12 due: 3 tool uses"
    assert CountDown("b", "log task {task}", WriteSpan(25)).nudge(25, task=7).text == "log task 7 due: 25 writes"
    assert CountDown("c", "look again", Seconds(60)).nudge(30).text == "look again due: 30 seconds"
