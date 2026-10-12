from dataclasses import asdict, dataclass
from typing import ClassVar

from resources.fields import Loaded

from resources.base import PROJECT, SIDEBAR, USER, Resource, ResourceDetails
from resources.shapes import NUMBER, TEXT, Field, Shape

TIMEOUT = 600


@dataclass(frozen=True)
class Finding(Loaded):
    name: str = ""
    file: str = ""
    line: int = 0
    where: str = ""
    text: str = ""
    group: str = ""


@dataclass(frozen=True)
class CheckReport(Loaded):
    title: str = ""
    summary: str = ""
    findings: tuple[Finding, ...] = ()


@dataclass(frozen=True)
class CheckRun(Loaded):
    ok: bool | None = None
    code: int = 0
    at: float = 0.0
    took: float = 0.0
    steps: int = 0
    output: str = ""
    report: CheckReport | None = None

    def to_json(self) -> dict:
        return asdict(self)

    @property
    def summary(self) -> dict:
        return {"ok": self.ok, "code": self.code, "at": self.at, "took": self.took}


class Check(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Check",
        abstract="A script that says pass or fail about the project, run by hand, by its button, or every so many minutes",
        help="A check names the command it runs from the project root, or an instruction the agent carries out itself, and how often; exit 0 passes, anything else fails and its output says why. journal check run <n> runs one, journal check sweep runs every check.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="command", runs_commands=True),
        Field(TEXT, name="instruction"),
        Field(NUMBER, default=0, name="asked_at"),
        Field(TEXT, name="touched"),
        Field(TEXT, name="then"),
        Field(NUMBER, default=0, name="every"),
        Field(NUMBER, default=TIMEOUT, name="timeout"),
        Field(TEXT, name="failure"),
        Field(default=dict, name="last"),
        Field(default=dict, name="running"),
        Field(default=list, name="runs"),
    ]
    type = "check"
    icon = "checkbox"
    listed_under = SIDEBAR
    scope = PROJECT
    command_names = {"complete": "retire", "passes": "pass", "fails": "fail"}
    notified = (USER,)
    view = "check"

    @property
    def last_run(self) -> CheckRun:
        return CheckRun.from_json(self.last)

    def failure_title(self, headline: str) -> str:
        return (self.failure.replace("{summary}", headline) if self.failure else f"check {self.n} failed - {headline}")[:80]
