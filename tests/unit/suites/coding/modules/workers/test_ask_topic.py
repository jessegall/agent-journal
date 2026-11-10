import pytest

from suites.coding.models.enums.ask_topic import AskTopic


def test_the_topics_are_the_six_a_worker_can_name():
    assert [topic.value for topic in AskTopic] == ["judge", "tests", "built", "conflict", "tool", "general"]


@pytest.mark.parametrize("topic", list(AskTopic))
def test_every_topic_has_a_meanwhile_line(topic):
    assert topic.waiting_work()


def test_each_meanwhile_line_is_its_own():
    assert len({topic.waiting_work() for topic in AskTopic}) == len(AskTopic)


@pytest.mark.parametrize("topic", list(AskTopic))
def test_every_topic_builds_the_ask_line(topic):
    assert topic.question_line() == f'If you cannot go on: journal worker ask "<what>" --about {topic.value}'


@pytest.mark.parametrize("topic", list(AskTopic))
def test_a_hint_gets_the_ask_line_after_the_fix(topic):
    assert topic.hint("run the fix") == f"run the fix. {topic.question_line()}"
