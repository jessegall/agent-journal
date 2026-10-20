from journal.features.feature import Feature
from journal.features.suggestions.listeners.suggest_on_the_hour import SuggestOnTheHour
from journal.support.option import Option


class SuggestionsFeature(Feature):
    FIRST_AFTER = Option("suggestions.first_after", "First suggestions after", "Minutes after the journal starts before it first looks for something to suggest, so nothing greets you the moment it starts", 15, unit="minutes")
    EVERY = Option("suggestions.every", "Look for suggestions every", "Minutes between two looks for something to suggest, such as a package the journal could run as its plugin", 60, unit="minutes")
    name = "suggestions"
    title = "Suggestions"
    help = "Looks for things worth suggesting, first a while after the journal starts and then hourly, and shows each once as a card in the chat: answered or not, it is never suggested again."
    options = (FIRST_AFTER, EVERY)
    listeners = (SuggestOnTheHour,)
