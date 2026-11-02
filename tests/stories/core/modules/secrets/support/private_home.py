from pathlib import Path

import pytest

from core.base.private.private_folder import FOLDER_VARIABLE
from tests.stories.core.modules.secrets.support.secret_fixtures import SecretAllowed

VALUE = "tok-live-4f9a2c71"
REPLACEMENT_VALUE = "tok-next-88d1e0b3"


@pytest.fixture(autouse=True)
def private_folder(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> Path:
    """The story's private folder and home folder, under its own temporary folder, so no story reads or writes
    the real values file."""
    folder = tmp_path / "private"
    monkeypatch.setenv(FOLDER_VARIABLE, str(folder))
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    return folder


def values_text(folder: Path) -> str:
    return "".join(path.read_text() for path in folder.glob("*.env")) if folder.is_dir() else ""


def filled_story(new_story, *lines: str):
    """Secret 1, Github, which may go to head, printenv and tr, with the value the user filled, kept in the story's own
    private folder; more lines run as the user after."""
    story = new_story(fixture=SecretAllowed)
    story.expect_success(f"secret fill 1 key {VALUE}", actor=story.user)
    for line in lines:
        story.expect_success(line, actor=story.user)
    return story
