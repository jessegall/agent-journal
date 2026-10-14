from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.features.messages.listeners.tell_inbox import TellInbox


class InboxAtPrompt(TellInbox[PromptSubmitted]):
    pass
