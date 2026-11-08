import importlib
from collections.abc import Callable
from pathlib import Path

from core.testing.story_fixture import StoryFixture
from core.testing.template_databases import TemplateDatabases

FIXTURE_MARK = "StoryFixture"


class TemplatePrebuild:
    """Builds the template of every fixture the stories declare, and the empty one, before the test runners start, so
    no runner builds one inside the run: a template already built costs a look at its folder. A module that does not
    import, or a fixture that does not build, is left for the story that needs it to report."""

    def __init__(self, templates: TemplateDatabases, tests: Path, package: str = "tests") -> None:
        self.templates, self.tests, self.package = templates, tests, package

    def run(self) -> int:
        built = 0
        self.attempt(lambda: self.templates.template((), None))
        for fixture in self.fixtures():
            built += self.attempt(lambda: self.templates.template((), fixture))
        return built

    @staticmethod
    def attempt(build: Callable[[], object]) -> int:
        try:
            build()
        except Exception:
            return 0
        return 1

    def fixtures(self) -> tuple[type[StoryFixture], ...]:
        for path in sorted(self.tests.rglob("*.py")):
            if FIXTURE_MARK in path.read_text(errors="replace"):
                self.attempt(lambda: importlib.import_module(self.module_name(path)))
        return StoryFixture.declared()

    def module_name(self, path: Path) -> str:
        parts = path.relative_to(self.tests).with_suffix("").parts
        return ".".join((self.package, *(parts[:-1] if parts[-1] == "__init__" else parts)))
