import io
import json
import re
import shlex

from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.command.bus import Bus
from engine.container.container import Container
from engine.seed.errors.demo_error import DemoError
from engine.types.type_guards import is_mapping

DEMO_ENVIRONMENT = "demo"


class Demo:
    """What a seeder is given: the lines it may run, as a user or an agent would type them, the people and
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
        row = json.loads(self.run(f"{line} --json", actor).splitlines()[0])
        if not is_mapping(row) or "id" not in row:
            raise DemoError(f"the demo ran {line!r}, which printed no row with an id")
        return int(str(row["id"]))

    def read_number(self, line: str, pattern: str, actor: Actor | None = None) -> int:
        matched = re.search(pattern, self.run(line, actor))
        if matched is None:
            raise DemoError(f"the demo ran {line!r}, which printed nothing like {pattern!r}")
        return int(matched[1])

    def keep_person(self, role: str, actor: Actor) -> None:
        self.people[role] = actor

    def keep_id(self, name: str, row_id: int) -> None:
        self.ids[name] = row_id
