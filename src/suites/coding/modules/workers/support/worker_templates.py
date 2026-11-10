from engine.template.template_declaration import TemplateDeclaration
from suites.coding.support.coding_templates import TESTING

WORKER_TARGETS = tuple(["worker"])
WORKER_TEMPLATES = [
    TemplateDeclaration(
        title="No tests",
        targets=WORKER_TARGETS,
        purpose=TESTING,
        brief="Run no tests. Write the tests that prove your change and name each, with the command that runs it, in your proof: the agent that merges your work runs them.",
    ),
    TemplateDeclaration(
        title="The journal tests",
        targets=WORKER_TARGETS,
        purpose=TESTING,
        brief="Run no tests yourself. Write the tests that prove your change and name them in your proof, the tests that cover the files you changed and the tests you wrote, never the whole suite: the journal runs them in your worktree, and your work stands only once they pass.",
    ),
    TemplateDeclaration(
        title="Scoped tests",
        targets=WORKER_TARGETS,
        purpose=TESTING,
        brief="Run only the tests that cover your change, by name, and the new tests you write. Never run the full suite: the agent that sent you runs it once your work is back.",
    ),
    TemplateDeclaration(
        title="Full suite",
        targets=WORKER_TARGETS,
        purpose=TESTING,
        brief="Run the tests that cover your change while you work, and the full suite once before you hand it back.",
    ),
]
