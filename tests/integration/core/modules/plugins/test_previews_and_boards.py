import json
import re
import subprocess
from pathlib import Path

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_releases import PluginReleases
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.suites.coding.modules.workers.support.program_split import viewer_client

GUIDE = Path("src/core/modules/plugins/web/src/PluginGuide.vue")
SKILL = Path("src/core/modules/plugins/skills/journal-plugins/SKILL.md")
MANIFEST = {"name": "standup", "title": "Standup", "version": "1.2.0", "description": "Writes the daily standup", "requires": {"sh": {"check": "command -v sh"}}, "setup": [{"name": "packages", "run": "true"}],
            "services": [{"name": "web", "command": ["server.sh", "--quiet"]}], "dashboard": {"name": "daily", "title": "Daily", "events": ["core.tasks.task.created", "core.tasks.task.nothing"]}}
PAGES = {"title": "Today", "start": "start", "pages": {"start": {"title": "Today", "view": {"type": "stack", "children": []}}}}
GIT_LIMIT_SECONDS = 30


def plugin_folder(story, version: str = "1.2.0") -> Path:
    folder = story.home.folder.parent / "standup"
    folder.mkdir(exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps({**MANIFEST, "version": version}))
    return folder


def installed_plugin(played):
    story = played(BuilderStarted)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.folder = plugin_folder(story)
    story.expect_success(f"plugin install {story.folder} --yes", actor=story.user)
    return story


def board_file(story) -> Path:
    path = story.home.folder / "plugin-data" / "standup" / "dashboards" / "daily.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    return path








def test_the_latest_of_a_repository_is_its_highest_version_tag(played):
    story = played(BuilderStarted)
    repository = story.home.folder.parent / "repository"
    repository.mkdir()
    for line in (["init"], ["-c", "user.name=Story", "-c", "user.email=story@example.com", "commit", "--allow-empty", "-m", "First"], ["tag", "v1.9.0"], ["tag", "v1.10.0"], ["tag", "nightly"]):
        subprocess.run(["git", "-C", str(repository), *line], check=True, capture_output=True, timeout=GIT_LIMIT_SECONDS)
    latest = story.container.get(PluginReleases).latest("standup", "v1.9.0", f"file://{repository}")
    story.expect_rows(latest.newest == "v1.10.0", latest.is_newer)
    empty = story.home.folder.parent / "empty"
    empty.mkdir()
    subprocess.run(["git", "-C", str(empty), "init"], check=True, capture_output=True, timeout=GIT_LIMIT_SECONDS)
    story.expect_rows(story.container.get(PluginReleases).latest("standup", "v1.9.0", f"file://{empty}").newest is None)


def test_the_latest_of_a_repository_that_cannot_be_read_is_refused(played):
    story = installed_plugin(played)
    releases = story.container.get(PluginReleases)
    with pytest.raises(Refusal, match="could not be read"):
        releases.latest("standup", "1.0", f"file://{story.home.folder.parent}/nowhere")














def tagged_repository(story, name: str = "repository", version: str = "1.0.0", tag: str = "v1.0.0") -> Path:
    folder = story.home.folder.parent / name
    folder.mkdir(exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "standup", "title": "Standup", "version": version, "setup": [{"name": "packages", "run": "true"}]}))
    config = ["-c", "user.name=Story", "-c", "user.email=story@example.com"]
    for line in (["init", "-q"], ["add", "-A"], [*config, "commit", "-q", "--allow-empty", "-m", version], ["tag", tag]):
        subprocess.run(["git", "-C", str(folder), *line], check=True, capture_output=True, timeout=GIT_LIMIT_SECONDS)
    return folder












