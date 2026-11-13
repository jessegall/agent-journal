import hashlib
import tarfile
from pathlib import Path

from tests.stories.core.support.fixtures import UserJoined
from core.modules.updates.models.enums.update_setting import UpdateSetting

ARCHIVE = "agent-journal.tar.gz"
ADDRESS_SETTING = f"{UpdateSetting.RELEASE_ADDRESS.key}"


def published(folder: Path, marker: str) -> Path:
    """A release folder in the shape install.sh downloads from: agent-journal.tar.gz, holding a src folder whose
    core/release_marker.txt says which release it is, and checksums.txt naming its SHA-256."""
    source = folder / "build" / "src" / "core"
    source.mkdir(parents=True, exist_ok=True)
    (source / "release_marker.txt").write_text(marker)
    with tarfile.open(folder / ARCHIVE, "w:gz") as archive:
        archive.add(folder / "build" / "src", arcname="src")
    digest = hashlib.sha256((folder / ARCHIVE).read_bytes()).hexdigest()
    (folder / "checksums.txt").write_text(f"{digest}  {ARCHIVE}\n")
    return folder


def released_story(new_story, folder: Path, marker: str = "release one"):
    story = new_story(fixture=UserJoined)
    published(folder, marker)
    story.expect_success(f"setting set {ADDRESS_SETTING} {folder.as_uri()} --project", actor=story.user)
    return story


def installed_marker(story) -> str:
    path = story.home.folder / "src" / "core" / "release_marker.txt"
    return path.read_text() if path.is_file() else ""
