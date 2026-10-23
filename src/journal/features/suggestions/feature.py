from journal.features.feature import Feature
from journal.features.suggestions.listeners.hourly_suggestion import HourlySuggestion
from journal.support.option import Option
from journal.features.suggestions.support.suggestion_process_card import SuggestionProcessCard


class SuggestionsFeature(Feature):
    FIRST_DELAY = Option("suggestions.first_after", "First suggestions after", "Minutes after the journal starts before it first looks for something to suggest, so nothing greets you the moment it starts", 15, unit="minutes")
    INTERVAL = Option("suggestions.every", "Look for suggestions every", "Minutes between two looks for something to suggest, such as a package the journal could run as its plugin", 60, unit="minutes")
    name = "suggestions"
    title = "Suggestions"
    help = "Looks for things worth suggesting, first a while after the journal starts and then hourly, and shows each once as a card in the chat: answered or not, it is never suggested again."
    options = (FIRST_DELAY, INTERVAL)
    listeners = (HourlySuggestion,)
    process_cards = (SuggestionProcessCard,)
