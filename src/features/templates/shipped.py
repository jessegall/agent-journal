from dataclasses import dataclass

from features.plans.resource import MUST_HAVE
from features.templates.controller import Templates
from resources.base import SYSTEM

CRITIQUE = "critique"


@dataclass(frozen=True)
class ShippedTemplate:
    title: str
    applies_to: tuple
    brief: str
    purpose: str = ""
    parts: tuple = ()


FUNCTIONAL = ShippedTemplate(
    title="Functional design",
    applies_to=("doc",),
    brief="A functional design says what is to be built, never how: anyone, the user or a colleague or another agent, can read "
          "it and know what the finished thing must do. Explore while you write it: read the code, look at packages, ask the "
          "questions through the journal. Keep it to what the user sees and does, in their words, and write every requirement "
          "as a point under Must have that someone can tick off. When the user approves it, the doc is made final and Make "
          "the plan turns it into a plan whose rows each name the points they cover.",
    parts=(("What it is for", "who it is for and what it lets them do that they cannot now"),
           ("What the user sees and does", "the screens, the steps and the words, as the user meets them"),
           (MUST_HAVE, "- [ ] one requirement per line, each one something to tick off"),
           ("Open questions", "what still has to be decided, each asked through the journal"),
           ("Not in this version", "what is left out on purpose")),
)
FIND_MISTAKES = ShippedTemplate(
    title="Find what is wrong",
    applies_to=("plan",),
    purpose=CRITIQUE,
    brief="Read the plan as someone who has to build it tomorrow and find what will go wrong: a phase that cannot be done in "
          "the order given, a row that is too big or too vague to finish, a goal no row reaches, a check that proves nothing. "
          "Name each problem with the phase or row it is in and say what to change.",
)
FIND_GAPS = ShippedTemplate(
    title="Find what is missing",
    applies_to=("plan",),
    purpose=CRITIQUE,
    brief="Read the plan against its goal and add what it leaves out: the step nobody wrote down, the migration, the test, the "
          "error case, the user who is not the author. Propose each addition as a row with the phase it belongs in.",
)
CHALLENGE = ShippedTemplate(
    title="Challenge the approach",
    applies_to=("plan",),
    purpose=CRITIQUE,
    brief="Question the plan's approach as a whole: is there a simpler way to reach the same goal, something that already "
          "exists and could be reused, a risk the plan takes without saying so. Give the alternative and what it would cost.",
)
RETIRED = ("Functional design, then technical implementation", "Blank plan")
SHIPPED = (FUNCTIONAL, FIND_MISTAKES, FIND_GAPS, CHALLENGE)


def ship(record) -> list[str]:
    templates = Templates(record, actor=SYSTEM)
    known = {row["title"] for row in templates.rows.summaries()}
    made = []
    for shipped in SHIPPED:
        if shipped.title in known:
            continue
        row = templates.create(shipped.title, brief=shipped.brief, applies_to=list(shipped.applies_to), purpose=shipped.purpose)
        for title, body in shipped.parts:
            templates.section(row.n, title, body)
        made.append(shipped.title)
    return made
