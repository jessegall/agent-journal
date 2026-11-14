from engine.template.template_declaration import TemplateDeclaration
from suites.coding.templates.template_words import DOC_TARGETS


class FunctionalDesignTemplate(TemplateDeclaration):
    """The Functional design template."""

    title = "Functional design"
    targets = DOC_TARGETS
    brief = "A functional design says what is to be built, never how: anyone, the user or a colleague or another agent, can read it and know what the finished thing must do. Explore while you write it: read the code, look at packages, ask the questions through the journal. Keep it to what the user sees and does, in their words, and write every requirement as a point under Must have that someone can tick off. When the user approves it, the doc is made final and a plan is made from it whose tasks each name the points they cover."
    parts = (
            "What it is for: who it is for and what it lets them do that they cannot now",
            "What the user sees and does: the screens, the steps and the words, as the user sees them",
            "Must have: - [ ] one requirement per line, each one something to tick off",
            "Open questions: what still has to be decided, each asked through the journal",
            "Not in this version: what is left out on purpose",
        )
