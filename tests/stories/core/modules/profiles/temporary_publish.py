from pathlib import Path

from core.modules.profiles.support.profile_files import ProfileFiles
from tests.stories.core.support.coding_fixtures import UserBuilder


def test_write_the_published_copies(new_story):
    story = new_story(fixture=UserBuilder)
    files = story.container.get(ProfileFiles)
    files.publish()
    repository = Path(__file__).resolve().parents[5]
    for path in sorted(files.folder(".claude/agents").glob("journal-*.md")):
        target = repository / ".claude/agents" / path.name
        if target.read_text() != path.read_text():
            target.write_text(path.read_text())
