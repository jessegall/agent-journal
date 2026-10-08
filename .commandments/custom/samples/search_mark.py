from features.history_searches.handlers import SearchMark


def marks(title):
    # @sin SearchMarkLabelDetector
    first = SearchMark("To-do search", "'assign'")
    # @sin SearchMarkLabelDetector
    second = SearchMark(f"{title} search", "'assign'")
    # @sin SearchMarkLabelDetector
    third = SearchMark("Conversation search", "'phone link'")
    # @righteous SearchMarkLabelDetector
    fourth = SearchMark("Searched to-dos", "'assign'")
    # @righteous SearchMarkLabelDetector
    fifth = SearchMark("Searched the conversation", "'phone link'")
    return first, second, third, fourth, fifth
