from journal.http.v3.shapers.agents_shaper import AgentsShaper
from journal.http.v3.shapers.comments_shaper import CommentsShaper
from journal.http.v3.shapers.environments_shaper import EnvironmentsShaper
from journal.http.v3.shapers.memory_shaper import MemoryShaper
from journal.http.v3.shapers.messages_shaper import MessagesShaper
from journal.http.v3.shapers.nudges_shaper import NudgesShaper
from journal.http.v3.shapers.plans_shaper import PlansShaper
from journal.http.v3.shapers.profiles_shaper import ProfilesShaper
from journal.http.v3.shapers.questions_shaper import QuestionsShaper
from journal.http.v3.shapers.rules_shaper import RulesShaper
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.shapers.simple_shaper import SimpleShaper
from journal.http.v3.shapers.todos_shaper import TodosShaper
from journal.http.v3.shapers.workers_shaper import WorkersShaper
from journal.http.v3.shapers.works_shaper import WorksShaper
from journal.http.v3.shapers.writing_shaper import WritingShaper
from journal.container import Container
from journal.repositories.checks import Checks
from journal.repositories.docs import Docs
from journal.repositories.facts import Facts
from journal.repositories.reminders import Reminders
from journal.repositories.reports import Reports
from journal.repositories.sequences import Sequences
from journal.repositories.triggers import Triggers

EMPTY = ("notification", "notice", "reaction", "suggestion", "tool", "plugin", "browser", "feature", "ticket", "board", "worktree", "template", "critique", "dump", "record", "output", "collection", "share", "secret", "phone")


class Shapers:
    """Every version 3 type by name, each knowing how to read its rows from version 4."""

    def __init__(self, container: Container) -> None:
        get = container.get
        own = [
            get(MessagesShaper), get(CommentsShaper), get(TodosShaper), get(WorksShaper), get(QuestionsShaper), get(RulesShaper), get(PlansShaper),
            get(EnvironmentsShaper), get(NudgesShaper), get(AgentsShaper), get(WorkersShaper), get(ProfilesShaper),
            MemoryShaper(get(Facts), "fact", {"keywords": [], "keywords_in": "both"}), MemoryShaper(get(Reminders), "reminder", {"whom": "", "until": ""}),
            WritingShaper(get(Reports), "report", {"kind": "", "number": 0, "docked": False, "dismissed": False, "items": []}),
            WritingShaper(get(Docs), "doc", {"status": "final", "written": True, "revisions": 1, "hidden": False}),
            SimpleShaper(get(Sequences), "sequence", lambda r: r.title, lambda r: "\n".join(f"{i + 1}. {s}" for i, s in enumerate(r.steps)), lambda r: {"steps": [{"text": s} for s in r.steps], "starts_on": ""}),
            SimpleShaper(get(Triggers), "trigger", lambda r: ", ".join(r.words), lambda r: r.text, lambda r: {"words": list(r.words), "action": r.action.value}),
            SimpleShaper(get(Checks), "check", lambda r: r.title, lambda r: r.command, lambda r: {"command": r.command, "every": r.every, "state": "failed" if r.last_passed is False else "passed" if r.last_passed else "", "output": r.last_output}),
        ]
        self._by_type: dict[str, Shaper] = {shaper.type: shaper for shaper in own}
        for name in EMPTY:
            empty = Shaper()
            empty.type = name
            self._by_type.setdefault(name, empty)

    def named(self, type: str) -> Shaper | None:
        return self._by_type.get(type)

    def types(self) -> list[str]:
        return list(self._by_type)
