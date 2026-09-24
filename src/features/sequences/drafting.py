DRAFTING = {
    "title": "Drafting the board's cards",
    "brief": "You know what the user wants. Draft the cards for it one by one, so each appears on the board while you write, "
             "then say one short line. Talk only about the feature and its tickets, never about rows, chips, ticket numbers, "
             "commands or the journal.",
    "starts_on": "",
    "started_by": "",
    "steps": [
        ("Guess the count", "Before your first card, guess how many you will write, on the low side: journal board expect "
                            "<board n> <count>. The panel shows that many placeholders. You may not finish with fewer cards "
                            "than you guessed. Then journal sequence next <this sequence> --about <ref>."),
        ("Draft the cards", "Most requests are one card. Draft one card per piece of work that can be built, reviewed and "
                            "merged on its own branch; the steps inside it go in its brief. Draft them in the order they "
                            "should run: journal ticket create \"<the work>\" --abstract \"<one line>\" --brief \"<the card's "
                            "back>\" --about <ref> --set board=<n> --set draft=true --set source=user. The title names the work "
                            "in a few words; the abstract is one line of at most 140 characters; the brief has five short "
                            "parts: What, Why, Touches, Done when, Risk. Link each card to any doc or plan you read for it, "
                            "and when one needs another first: journal ticket depend <waits> <needed first>. When the project "
                            "has an organization, name the domain that answers for it with --set owner=<domain>. To write "
                            "more cards than you guessed, raise the guess first with journal board expect and say so in the "
                            "panel with journal board say <board n> \"I think I'll need more cards than I said.\". When "
                            "every card is drafted, offer two to four groups they can pick at once: journal board group "
                            "<board n> \"<name>\" \"<ticket>, <ticket>\". Then journal sequence next <this sequence> --about <ref>."),
        ("Say one line", "Say it in the panel with journal board say <board n> \"<line>\", at most 200 characters about the "
                         "cards, like \"Five tickets drafted. Pick the ones to keep.\" No numbers such as #12, rows, chips, "
                         "commands or the journal. Finish with journal sequence next <this sequence> --about <ref>."),
    ],
}
