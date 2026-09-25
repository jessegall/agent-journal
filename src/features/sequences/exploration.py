from resources.base import USER

PANEL = "the New work panel"
FILLER = "board-filler"
LOG = ("While you work, tell the panel what you are doing in a few words, at every step and whenever a step takes a while: "
       "journal board log <board n> \"<short status>\".")

RULES = ("A request typed into a board's New work panel is explored until you know the goal: what the user wants to reach, for "
         "whom, and what done means. The board then holds the cards that reach it. The panel is a place of "
         "clicking, not reading: every turn is one question on the board, never a paragraph and never in the chat, and you talk "
         "only about the feature and its tickets, never about rows, chips, ticket numbers, commands or the journal. After every "
         "answer, rate how well you now understand what they want, 1 to 5, and say in one short line what you think they want: "
         "journal board score <board n> <score> --reading \"<what you think they want>\". The panel shows that line, never the score. The score hands "
         "you the step for it; at 4 you may settle the scope first, and at 5 the drafting starts by itself. You have five ratings: if the fifth is still below 4, the "
         "panel tells them you do not know what they want and offers to start over. A typed answer counts as its turn; if it "
         "names a feature none of your options did, it replaces the request. An answer of Start over means they closed the "
         "panel: write nothing more to the board. Use judgment: the board's name, its brief and the cards already on it carry "
         "meaning. Ask only what changes the cards; skip a step you can already answer by rating higher. " + "When you rate 5, give the goal and what done means with it: journal board score <board n> 5 --reading \"<reading>\" --goal \"<the goal in their words>\" --done \"<clause>|<clause>|...\", each clause one thing a person can check, such as \"a visitor can read every page without signing in\"." + " " + LOG)

ASK = ("journal board ask <board n> \"<question>\" --abstract \"<one plain line>\" --set options='[{\"title\": \"<option>\", "
       "\"text\": \"<what it gives them>\"}, ...]'")

EXPLORATION = {
    "title": "Exploring a request",
    "brief": RULES,
    "starts_on": "message.requested",
    "started_by": USER,
    "talks_in": PANEL,
    "dispatch": FILLER,
    "steps": [
        ("Read the request", "Read the context before anything else: the board's name and brief (journal board show <board n>) "
                             "and the cards already on it (journal ticket board <board n>). Then rate at once how well the "
                             "request alone tells you what they want, with your one-line reading of it: journal board score <board n> "
                             "<1-5> --reading \"<what you think they want>\". A request that "
                             "already names one clear feature can be a 4."),
        ("Name the goal (score 1)", "You do not know yet what they want to reach. Offer the three outcomes their words most "
                                   "likely mean on this board, most likely first, each a result for someone rather than a feature, "
                                   f"with who it is for and what it would give them: {ASK}. When their words cannot be read, ask "
                                   "\"I couldn't read that. Which of these?\". When it is answered, rate again with journal board score."),
        ("Set the scope (score 2)", "You know the goal. Ask what belongs in this round: offer the parts the goal needs as options, "
                                   f"the ones you would keep first, as a checklist they tick: {ASK} --set multiple=true. When it is "
                                   "answered, rate again."),
        ("Say what done means (score 3)", "You know the scope. Offer three or four finished states built from it, each a check "
                                         "a person can make (\"done when a visitor can ...\"), so one click settles what done "
                                         f"means, as a checklist they tick: {ASK} --set multiple=true. Keep the answer: it becomes "
                                         "the goal's clauses. When it is answered, rate again."),
        ("Choose the first slice (score 4)", "You know what they want and what done means. This step is yours to judge: if what "
                                            "should work first is still open, ask one question about it, with the smallest useful "
                                            f"slice first: {ASK}. When it is answered, or nothing is open, start the drafting: "
                                            "journal board score <board n> 5 with the goal and clauses."),
    ],
}
