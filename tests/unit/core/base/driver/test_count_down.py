from dataclasses import dataclass

from core.base.driver.count_down import CountDown
from core.base.driver.seconds import Seconds
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class SampleSpan:
    unit = "tool uses"

    count: int

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return False


def test_a_count_down_says_the_action_due_and_what_remains_in_the_unit_of_its_span():
    assert CountDown("a", "read message {messages}", SampleSpan(20)).nudge(3, messages=12).text == "read message 12 due: 3 tool uses"
    assert CountDown("b", "look again", Seconds(60)).nudge(30).text == "look again due: 30 seconds"
