from core.base.template.template_declaration import TemplateDeclaration

CRITIQUE = "critique"
TESTING = "testing"
DOC_TARGETS = tuple(["doc"])
PLAN_TARGETS = tuple(["plan"])
CODING_TEMPLATES = [
    TemplateDeclaration(
        title="Functional design",
        targets=DOC_TARGETS,
        brief="A functional design says what is to be built, never how: anyone, the user or a colleague or another agent, can read it and know what the finished thing must do. Explore while you write it: read the code, look at packages, ask the questions through the journal. Keep it to what the user sees and does, in their words, and write every requirement as a point under Must have that someone can tick off. When the user approves it, the doc is made final and a plan is made from it whose tasks each name the points they cover.",
        parts=(
            "What it is for: who it is for and what it lets them do that they cannot now",
            "What the user sees and does: the screens, the steps and the words, as the user sees them",
            "Must have: - [ ] one requirement per line, each one something to tick off",
            "Open questions: what still has to be decided, each asked through the journal",
            "Not in this version: what is left out on purpose",
        ),
    ),
    TemplateDeclaration(
        title="Find what is wrong",
        targets=PLAN_TARGETS,
        purpose=CRITIQUE,
        brief="Read the plan as someone who has to build it tomorrow and find what will go wrong: a phase that cannot be done in the order given, a task that is too big or too vague to finish, a goal no task reaches, a check that proves nothing. Name each problem with the phase or task it is in and say what to change.",
    ),
    TemplateDeclaration(
        title="Find what is missing",
        targets=PLAN_TARGETS,
        purpose=CRITIQUE,
        brief="Read the plan against its goal and add what it leaves out: the step nobody wrote down, the migration, the test, the error case, the user who is not the author. Propose each addition as a task with the phase it belongs in.",
    ),
    TemplateDeclaration(
        title="Challenge the approach",
        targets=PLAN_TARGETS,
        purpose=CRITIQUE,
        brief="Question the plan's approach as a whole: is there a simpler way to reach the same goal, something that already exists and could be reused, a risk the plan takes without saying so. Give the alternative and what it would cost.",
    ),
    TemplateDeclaration(
        title="Never run tests",
        targets=PLAN_TARGETS,
        purpose=TESTING,
        brief="Run no tests while you follow this plan; write the tests that prove each task and leave them for the user to run.",
    ),
    TemplateDeclaration(
        title="Tests at the end of each phase",
        targets=PLAN_TARGETS,
        purpose=TESTING,
        brief="Write the tests each task needs, and run the tests only at the end of each phase.",
    ),
    TemplateDeclaration(
        title="Scoped tests after each task",
        targets=PLAN_TARGETS,
        purpose=TESTING,
        brief="After each task run the tests that cover what it changed, by name, and the full suite at the end of each phase.",
    ),
    TemplateDeclaration(
        title="Test throughout",
        targets=PLAN_TARGETS,
        purpose=TESTING,
        brief="Run the full suite whenever it helps, and after every task at least.",
    ),
]
