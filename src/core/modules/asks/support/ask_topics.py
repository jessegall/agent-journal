from engine.errors.refusal import Refusal
from engine.module.ask_topic import AskTopic
from engine.module.module_finder import ModuleFinder


class AskTopics:
    """The topics the installed modules let a helper ask about."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.finder = finder

    def all(self) -> tuple[AskTopic, ...]:
        return tuple(topic for module in self.finder.modules() for topic in module.ask_topic_declarations())

    def by_key(self, key: str) -> AskTopic:
        topics = self.all()
        matched = next((topic for topic in topics if topic.key == key), None)
        if matched is None:
            raise Refusal(f"there is no topic {key}", f"topics: {', '.join(topic.key for topic in topics)}")
        return matched
