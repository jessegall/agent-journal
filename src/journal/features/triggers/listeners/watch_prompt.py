from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.features.triggers.listeners.trigger_watch import TriggerWatch


class WatchPrompt(TriggerWatch[PromptSubmitted]):
    def text_of(self, event: PromptSubmitted) -> str:
        return event.prompt

    def is_users(self, event: PromptSubmitted) -> bool:
        return event.is_users
