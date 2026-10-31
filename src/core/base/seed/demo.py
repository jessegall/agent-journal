import io
import re
import shlex

from core.base.actor import Actor
from core.base.caller.caller import Caller
from core.base.cli.console import Console
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.seed.demo_error import DemoError

ID_LINE = re.compile(r"^id: (\d+)$", re.MULTILINE)


DEMO_ENVIRONMENT = "demo"


class Demo:
    """What a seeder is given: the lines it may run, as a person or an agent would type them, the people and
    rows the seeders before it kept under a name, and the container for a command that has no line."""

    def __init__(self, container: Container, environment: str = DEMO_ENVIRONMENT) -> None:
        self.container, self.environment = container, environment
        self.people: dict[str, Actor] = {}
        self.ids: dict[str, int] = {}
        self.ran: list[str] = []

    @property
    def bus(self) -> Bus:
        return self.container.get(Bus)

    @property
    def environment_flag(self) -> str:
        return f"--environment {self.environment}"

    def run(self, line: str, actor: Actor | None = None) -> str:
        stream = io.StringIO()
        code = self.container.get(Console).run(shlex.split(line), Caller(actor or Actor.core()), stream)
        if code != 0:
            raise DemoError(f"the demo ran {line!r}, which gave {code}: {stream.getvalue().strip()}")
        self.ran.append(line)
        return stream.getvalue()

    def new_id(self, line: str, actor: Actor | None = None) -> int:
        matched = ID_LINE.search(self.run(line, actor))
        if matched is None:
            raise DemoError(f"the demo ran {line!r}, which printed no row with an id")
        return int(matched[1])

    def read_number(self, line: str, pattern: str, actor: Actor | None = None) -> int:
        matched = re.search(pattern, self.run(line, actor))
        if matched is None:
            raise DemoError(f"the demo ran {line!r}, which printed nothing like {pattern!r}")
        return int(matched[1])

    def keep_person(self, role: str, actor: Actor) -> None:
        self.people[role] = actor

    def keep_id(self, name: str, row_id: int) -> None:
        self.ids[name] = row_id
