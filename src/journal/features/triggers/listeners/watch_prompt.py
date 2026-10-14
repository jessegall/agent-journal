from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.features.triggers.listeners.watching import Watching


class WatchPrompt(Watching[PromptSubmitted]):
    def text_of(self, event: PromptSubmitted) -> str:
        return event.prompt
