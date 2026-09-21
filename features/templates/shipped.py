from features.templates.controller import Templates
from resources.base import SYSTEM

BLANK = {
    "title": "Blank plan",
    "applies_to": ["plan"],
    "brief": "Build the plan with the user, in order. Name the goal as what is true when it is done. Add every phase with the line "
             "that says when it is complete, and mark a checkpoint where the user should look before it goes on. Then file the "
             "rows and put each under its phase, and mark the plan ready. Only the user activates it.",
    "parts": [],
}
FUNCTIONAL = {
    "title": "Functional design, then technical implementation",
    "applies_to": ["plan"],
    "brief": "Research first, and write nothing technical until the functional design is approved. The first phase studies what is "
             "asked and writes a functional doc: what the user sees and does, in their words, with the open questions asked through "
             "the journal. It ends at a checkpoint where the user approves the doc. Only then does the second phase file the technical "
             "to-dos, each citing the part of the doc it builds, and build and test them.",
    "parts": [("Functional design (checkpoint)", "the functional doc is written and the user has approved it"),
              ("Technical implementation", "every technical to-do is built and tested against the functional doc")],
}
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
