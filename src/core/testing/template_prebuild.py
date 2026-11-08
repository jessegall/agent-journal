from contextlib import suppress
import importlib
import os
from collections.abc import Callable
from pathlib import Path

from core.base.file_access import FileAccess
from core.testing.story_fixture import StoryFixture
from core.testing.template_databases import TemplateDatabases
from core.testing.template_requests import Request

FIXTURE_MARK = "StoryFixture"


class TemplatePrebuild:
    """Builds the template of every fixture the stories declare, every template a story asked for by its
    modules, and the empty one, before the tests start, so no story builds one inside the run: a template
    already built costs a look at its folder. Fixtures of one depth are built at once by several processes,
    each after the fixtures it builds on. A module that does not import, or a fixture that does not build,
    is left for the story that needs it to report."""

    def __init__(self, templates: TemplateDatabases, tests: Path, package: str = "tests", processes: int = 1) -> None:
        self.templates, self.tests, self.package, self.processes = templates, tests, package, processes

    def run(self) -> None:
        self.attempt(lambda: self.templates.template((), None))
        fixtures = self.fixtures()
        requests = [*(((), fixture) for fixture in fixtures), *self.templates.requests.listed(fixtures)]
        self.build_group(sorted(requests, key=self.depth))

    @staticmethod
    def depth(request: Request) -> int:
        return len(request[1].chain()) if request[1] else 0

    def build_group(self, requests: list[Request]) -> None:
        group, *child_groups = [requests[start::self.processes] for start in range(self.processes)]
        children = [self.child_process(child_group) for child_group in child_groups]
        self.build(group)
        for child in children:
            os.waitpid(child, 0)

    def child_process(self, requests: list[Request]) -> int:
        child = os.fork()
        if child:
            return child
        try:
            self.build(requests)
        finally:
            os._exit(0)

    def build(self, requests: list[Request]) -> None:
        for modules, fixture in requests:
            self.attempt(lambda: self.templates.template(modules, fixture))

    @staticmethod
    def attempt(build: Callable[[], object]) -> None:
        with suppress(Exception):
            build()

    def fixtures(self) -> tuple[type[StoryFixture], ...]:
        for path in sorted(self.tests.rglob("*.py")):
            if FIXTURE_MARK in FileAccess.shared().read(path, errors="replace"):
                self.attempt(lambda: importlib.import_module(self.module_name(path)))
        return StoryFixture.declared()

    def module_name(self, path: Path) -> str:
        parts = path.relative_to(self.tests).with_suffix("").parts
        return ".".join((self.package, *(parts[:-1] if parts[-1] == "__init__" else parts)))
