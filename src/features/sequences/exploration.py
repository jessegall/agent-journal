from resources.base import USER

PANEL = "the New work panel"
LOG = ("While you work, tell the panel what you are doing in a few words, at every step and whenever a step takes a while: "
       "journal board log <board n> \"<short status>\".")

RULES = ("A request typed into a board's New work panel is explored until you know what the user wants. The panel is a place of "
         "clicking, not reading: every turn is one question on the board, never a paragraph and never in the chat, and you talk "
         "only about the feature and its tickets, never about rows, chips, ticket numbers, commands or the journal. After every "
         "answer, rate how well you now understand what they want, 1 to 5: journal board score <board n> <score>. The score hands "
         "you the step for it; at 4 you may settle the scope first, and at 5 the drafting starts by itself. You have five ratings: if the fifth is still below 4, the "
         "panel tells them you do not know what they want and offers to start over. A typed answer counts as its turn; if it "
         "names a feature none of your options did, it replaces the request. An answer of Start over means they closed the "
         "panel: write nothing more to the board. Use judgment: the board's name, its brief and the cards already on it carry "
         "meaning. " + LOG)

ASK = ("journal board ask <board n> \"<question>\" --abstract \"<one plain line>\" --set options='[{\"title\": \"<option>\", "
       "\"text\": \"<what it gives them>\"}, ...]'")

EXPLORATION = {
    "title": "Exploring a request",
    "brief": RULES,
    "starts_on": "message.requested",
    "started_by": USER,
    "talks_in": PANEL,
    "steps": [
        ("Read the request", "Read the context before anything else: the board's name and brief (journal board show <board n>) "
                             "and the cards already on it (journal ticket board <board n>). Then rate at once how well the "
                             "request alone tells you what they want: journal board score <board n> <1-5>. A request that "
                             "already names one clear feature can be a 4."),
        ("Find the feature (score 1)", "You do not know yet which feature they mean. Offer the three features their words most "
                                      "likely mean on this board, most likely first, each clearly different, with a line under "
                                      f"each on what it would give them: {ASK}. When their words cannot be read, ask \"I couldn't "
                                      "read that. Which of these?\". When it is answered, rate again with journal board score."),
        ("Pin it down (score 2)", "You know roughly what they want. Ask one question about the part of the feature that most "
                                 "decides the tickets, in terms of what they would see or do, never how it is built, with three "
                                 f"options that each carry an example: {ASK}. When it is answered, rate again."),
        ("Make it concrete (score 3)", "You nearly know. Offer three or four finished versions of the feature built from their "
                                      "answers, each with what it gives them as the example, so one click settles it: "
                                      f"{ASK}. When it is answered, rate again."),
        ("Settle the scope (score 4)", "You know what they want. This step is optional and yours to judge: if something about "
                                       "the plan itself is still open, such as how broad the first version should be, ask one "
                                       f"question about it: {ASK}. When it is answered, rate again. When nothing is open, "
                                       "start the drafting at once with journal board score <board n> 5."),
    ],
}
