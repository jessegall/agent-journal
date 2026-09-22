from features.templates.controller import Templates
from resources.base import SYSTEM

BLANK = {
    "title": "Blank plan",
    "applies_to": ["plan"],
    "brief": "Build the plan with the user, in order. Name the goal as what is true when it is done. Add every phase with the line "
             "that says when it is complete, and mark a checkpoint where the user should look before it goes on. Then file the "
             "rows and put each under its phase, and mark the plan ready. Only the user approves it; the agent then starts it.",
    "parts": [],
}
MUST_HAVE = "Must have"
FUNCTIONAL = {
    "title": "Functional design",
    "applies_to": ["doc"],
    "brief": "A functional design says what is to be built, never how: anyone, the user or a colleague or another agent, can read "
             "it and know what the finished thing must do. Explore while you write it: read the code, look at packages, ask the "
             "questions through the journal. Keep it to what the user sees and does, in their words, and write every requirement "
             "as a point under Must have that someone can tick off. When the user approves it, the doc is made final and Make "
             "the plan turns it into a plan whose rows each name the points they cover.",
    "parts": [("What it is for", "who it is for and what it lets them do that they cannot now"),
              ("What the user sees and does", "the screens, the steps and the words, as the user meets them"),
              (MUST_HAVE, "- [ ] one requirement per line, each one something to tick off"),
              ("Open questions", "what still has to be decided, each asked through the journal"),
              ("Not in this version", "what is left out on purpose")],
}
RETIRED = ("Functional design, then technical implementation",)
SHIPPED = (BLANK, FUNCTIONAL)


def ship(record) -> list[str]:
    templates = Templates(record, actor=SYSTEM)
    known = {row["title"] for row in templates.summaries()}
    made = []
    for shipped in SHIPPED:
        if shipped["title"] in known:
            continue
        row = templates.create(shipped["title"], brief=shipped["brief"], applies_to=shipped["applies_to"])
        for title, body in shipped["parts"]:
            templates.section(row.n, title, body)
        made.append(shipped["title"])
    return made
