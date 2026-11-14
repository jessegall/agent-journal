import pytest

from engine.errors.refusal import Refusal
from engine.module.ask_topic import AskTopic
from core.modules.asks.asks_module import AsksModule
from core.modules.asks.support.ask_topics import AskTopics


class OneModuleFinder:
    def modules(self):
        return [AsksModule]


def test_general_registered():
    assert AskTopics(OneModuleFinder()).named("general") == AskTopic("general", "go on with anything the task still holds, or stop")


def test_unknown_topic_refused_with_keys():
    with pytest.raises(Refusal) as refused:
        AskTopics(OneModuleFinder()).named("weather")
    assert "topics: general" in refused.value.suggestion
