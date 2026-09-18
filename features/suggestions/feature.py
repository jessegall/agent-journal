from controllers.types import ACCEPT, ADJUST, Suggestions, Todos
from features.base import Feature, on
from resources.base import SYSTEM


class SuggestionsDecided(Feature):
    name = "suggestions"
    title_ = "Suggestions decided"
    abstract_ = "An accepted or adjusted suggestion becomes a to-do that cites it; a decline files nothing"
    help_ = "The to-do carries the suggestion's title and brief — or the user's own words when adjusted — and auto mode works it like any other."

    @on("suggestion.completed")
    def filed(self, event, record) -> None:
        suggestions = Suggestions(record, actor=SYSTEM)
        s = suggestions.load(event.n)
        decision = s.data.get("decision")
        if decision not in (ACCEPT.lower(), ADJUST.lower()):
            return
        todos = Todos(record, actor=SYSTEM)
        title = s.title if decision == ACCEPT.lower() else s.outcome.split("\n")[0][:80]
        brief = s.brief if decision == ACCEPT.lower() else f"{s.outcome}\n\nProposed as: {s.title}\n{s.brief}".strip()
        todos.create(title, brief=brief, about=s.ref)
