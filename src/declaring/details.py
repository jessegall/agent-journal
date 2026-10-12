import re
from typing import Callable, ClassVar

from declaring.groups import Group
from declaring.settings import Setting, Settings
from declaring.trigger import NEVER, Trigger
from declaring.holds import Stops
from resources.memo import Memo
from declaring.reach import Reach
from resources.base import ENVIRONMENT, PROJECT, Refused
from resources.text import paragraphs

VALUES = Memo()


class Behaviour:
    def __init__(self, title: str, abstract: str = "", default: bool = True, trigger: Trigger = NEVER, name: str = "",
                 prefix: str = "", scope: str = PROJECT):
        self.name, self.title, self.abstract, self.default, self.trigger = name, paragraphs(title), paragraphs(abstract), default, trigger
        self.prefix, self.scope = prefix, scope
        """Where the switch is kept. A switch over nudges is the project's, since silencing one in a single environment and meeting it again in the next is not what silencing means. One an environment decides for itself, such as a mode, says so."""

    def describe(self) -> dict:
        return {"title": self.title, "abstract": self.abstract, "default": self.default, "trigger": self.trigger.described(),
                "prefix": self.prefix}


PLACEHOLDER = re.compile(r"\{\{(\w+)\}\}")


def always_owed(journal, rows: tuple[str, ...]) -> bool:
    return True


class Line:
    def __init__(self, title: str, brief: str = "", lead: bool = False, name: str = "", while_waiting: bool | None = None, label: str = "",
                 reach: Reach = Reach.MAIN, reply_kept: bool = False, until: tuple[str, ...] = (), owed: Callable = always_owed, scope: Stops = Stops.WRITES):
        self.name, self.title, self.brief, self.lead, self.label, self.reach = name, paragraphs(title), paragraphs(brief), lead, label, reach
        self.reply_kept, self.until, self.owed, self.scope = reply_kept, until, owed, scope
        self.while_waiting = while_waiting

    def placeholders(self) -> list[str]:
        return list(dict.fromkeys(PLACEHOLDER.findall(self.title + self.brief)))

    def filled(self, values: dict) -> tuple[str, str]:
        wanted = set(self.placeholders())
        if wanted != set(values):
            raise Refused(f"the line {self.title!r} takes {sorted(wanted)}, given {sorted(values)}")
        fill = lambda text: PLACEHOLDER.sub(lambda found: str(values[found.group(1)]), text)
        return fill(self.title), fill(self.brief)

    def asking(self, feature: str) -> dict:
        return {"until": list(self.until), "asks": f"{feature}.{self.name}"} if self.until else {}

    def describe(self) -> dict:
        return {"title": self.title, "brief": self.brief, "placeholders": self.placeholders(), "reach": self.reach}


class FeatureDetails:
    name: ClassVar[str] = ""
    title: ClassVar[str] = ""
    abstract: ClassVar[str] = ""
    help: ClassVar[str] = ""
    explains: ClassVar[str] = ""
    label: ClassVar[str] = ""
    hint: ClassVar[str] = ""
    position: ClassVar[int] = 100
    group: ClassVar[Group]
    trigger_label: ClassVar[str] = ""
    lines: ClassVar[list[Line]] = []
    behaviours: ClassVar[list[Behaviour]] = []
    settings: ClassVar[list[Setting]] = []
    trigger: ClassVar[Trigger] = NEVER
    aliases: ClassVar[tuple] = ()
    keywords: ClassVar[tuple] = ()
    when: ClassVar[str] = ""
    speaks_while_waiting: ClassVar[bool] = False
    fixed: ClassVar[bool] = False
    primary: ClassVar[bool] = False
    has_skill: ClassVar[bool] = True
    skill_of: ClassVar[str] = ""
    default: ClassVar[bool] = True
    scope: ClassVar[str] = ENVIRONMENT

    @classmethod
    def values(cls, record) -> Settings:
        return VALUES.get((cls.name, str(record.home)), record.settings_file.held()[0], lambda: Settings(cls.settings, record.setting(cls.name, {})))
