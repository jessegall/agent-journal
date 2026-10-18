from journal.http.v3.shapers.agents_shaper import AgentsShaper
from journal.http.v3.shapers.comments_shaper import CommentsShaper
from journal.http.v3.shapers.environments_shaper import EnvironmentsShaper
from journal.http.v3.shapers.memory_shaper import MemoryShaper
from journal.http.v3.shapers.messages_shaper import MessagesShaper
from journal.http.v3.shapers.nudges_shaper import NudgesShaper
from journal.http.v3.shapers.plans_shaper import PlansShaper
from journal.http.v3.shapers.plugins_shaper import PluginsShaper
from journal.http.v3.shapers.profiles_shaper import ProfilesShaper
from journal.http.v3.shapers.questions_shaper import QuestionsShaper
from journal.http.v3.shapers.reactions_shaper import ReactionsShaper
from journal.http.v3.shapers.rules_shaper import RulesShaper
from journal.http.v3.shapers.secrets_shaper import SecretsShaper
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import seconds
from journal.http.v3.shapers.simple_shaper import SimpleShaper
from journal.http.v3.shapers.todos_shaper import TodosShaper
from journal.http.v3.shapers.workers_shaper import WorkersShaper
from journal.http.v3.shapers.works_shaper import WorksShaper
from journal.http.v3.shapers.notices_shaper import NoticesShaper
from journal.http.v3.shapers.writing_shaper import WritingShaper
from journal.container import Container
from journal.repositories.not_found import NotFound
from journal.repositories.checks import Checks
from journal.repositories.docs import Docs
from journal.repositories.facts import Facts
from journal.repositories.links import Links
from journal.repositories.reminders import Reminders
from journal.repositories.reports import Reports
from journal.repositories.sequences import Sequences
from journal.repositories.templates import Templates
from journal.repositories.triggers import Triggers

EMPTY = ("notification", "suggestion", "tool", "browser", "feature", "ticket", "board", "worktree", "critique", "dump", "record", "output", "collection", "share", "phone")


class Shapers:
    """Every version 3 type by name, each knowing how to read its rows from version 4."""

    def __init__(self, container: Container) -> None:
        get = container.get
        own = [
            get(MessagesShaper), get(CommentsShaper), get(NoticesShaper), get(TodosShaper), get(WorksShaper), get(QuestionsShaper), get(RulesShaper), get(PlansShaper),
            get(EnvironmentsShaper), get(NudgesShaper), get(AgentsShaper), get(WorkersShaper), get(ProfilesShaper), get(ReactionsShaper), get(SecretsShaper), get(PluginsShaper),
            MemoryShaper(get(Facts), "fact", {"keywords": [], "keywords_in": "both"}), MemoryShaper(get(Reminders), "reminder", {"whom": "", "until": ""}),
            WritingShaper(get(Reports), get(Links), "report", {"kind": "", "number": 0, "docked": False, "dismissed": False, "items": []}),
            WritingShaper(get(Docs), get(Links), "doc", {"status": "final", "written": True, "revisions": 1, "hidden": False}),
            SimpleShaper(get(Sequences), "sequence", lambda r: r.title, lambda r: "", lambda r: {"runs": {}, "system": False, "starts_on": r.starts_on or next((f"trigger:{t.id}" for t in get(Triggers).starting(r.title)), "")}, sections=lambda r: [{"title": s, "body": ""} for s in r.steps]),
            SimpleShaper(get(Templates), "template", lambda r: r.title, lambda r: r.brief, lambda r: {"purpose": r.purpose, "applies_to": list(r.applies_to), "fields": []},
                         sections=lambda r: [{"title": part.split(":", 1)[0].strip(), "body": part.split(":", 1)[1].strip() if ":" in part else ""} for part in r.parts]),
            SimpleShaper(get(Triggers), "trigger", lambda r: ", ".join(r.words), lambda r: r.text, lambda r: {"words": list(r.words), "action": r.action.value}),
            SimpleShaper(get(Checks), "check", lambda r: r.title, lambda r: r.brief, lambda r: {"command": r.command, "every": r.every, "runs": [], "last": {"at": seconds(r.last_ran_at), "ok": bool(r.last_passed), "took": 0, "output": r.last_output}}),
        ]
        self._by_type: dict[str, Shaper] = {shaper.type: shaper for shaper in own}
        for name in EMPTY:
            empty = Shaper()
            empty.type = name
            self._by_type.setdefault(name, empty)

    def named(self, type: str) -> Shaper:
        if type not in self._by_type:
            raise NotFound("row types", type)
        return self._by_type[type]

    def types(self) -> list[str]:
        return list(self._by_type)
