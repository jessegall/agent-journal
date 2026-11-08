from core.base.file_access import FileAccess
import json
from pathlib import Path

from core.testing.story_fixture import StoryFixture

Request = tuple[tuple[str, ...], type[StoryFixture] | None]


class TemplateRequests:
    """The templates of stories that name modules of their own, which no file declares: each one built is
    noted in a file that outlives a code change, so the next run builds it before its runners start."""

    def __init__(self, file: Path) -> None:
        self.file = file

    def add(self, modules: tuple[str, ...], fixture: type[StoryFixture] | None) -> None:
        names = [fixture.__module__, fixture.__qualname__] if fixture else None
        with FileAccess.shared().writer(self.file, mode="a") as lines:
            lines.write(json.dumps([list(modules), names]) + "\n")

    def listed(self, fixtures: tuple[type[StoryFixture], ...]) -> list[Request]:
        if not self.file.is_file():
            return []
        fixture_lookup = {(fixture.__module__, fixture.__qualname__): fixture for fixture in fixtures}
        requests = [json.loads(line) for line in dict.fromkeys(FileAccess.shared().read(self.file).splitlines())]
        return [(tuple(modules), fixture_lookup[tuple(names)] if names else None) for modules, names in requests
                if not names or tuple(names) in fixture_lookup]
