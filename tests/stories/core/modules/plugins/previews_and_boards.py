import json
import re
import subprocess
from pathlib import Path

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.refusal import Refusal
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_releases import PluginReleases
from tests.stories.core.support.coding_fixtures import BuilderStarted

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


def installed_plugin(new_story):
    story = new_story(fixture=BuilderStarted)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.folder = plugin_folder(story)
    story.expect_success(f"plugin install {story.folder} --yes", actor=story.user)
    return story


def board_file(story) -> Path:
    path = story.home.folder / "plugin-data" / "standup" / "dashboards" / "daily.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def test_a_preview_names_everything_the_plugin_would_run_and_installs_nothing(new_story):
    story = new_story(fixture=BuilderStarted)
    folder = plugin_folder(story)
    story.expect_text(f"plugin preview {folder}", "requires sh: command -v sh", "setup packages: true", "service web: server.sh --quiet")
    story.expect_absent("plugin list", "standup")


def test_a_preview_of_a_folder_with_no_plugin_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal(f"plugin preview {story.home.folder.parent}", "contains no plugin")


def test_the_latest_says_a_folder_has_a_newer_version(new_story):
    story = installed_plugin(new_story)
    story.expect_text("plugin latest standup", "1.2.0 is the newest")
    plugin_folder(story, "1.10.0")
    story.expect_text("plugin latest standup", "1.10.0 is newer than 1.2.0")


def test_the_latest_of_a_repository_is_its_highest_version_tag(new_story):
    story = new_story(fixture=BuilderStarted)
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


def test_the_latest_of_a_repository_that_cannot_be_read_is_refused(new_story):
    story = installed_plugin(new_story)
    releases = story.container.get(PluginReleases)
    with pytest.raises(Refusal, match="could not be read"):
        releases.latest("standup", "1.0", f"file://{story.home.folder.parent}/nowhere")


def test_a_plugins_description_is_read_from_its_manifest(new_story):
    story = installed_plugin(new_story)
    story.expect_text("plugin descriptions", "standup: Writes the daily standup")


def test_a_dashboard_is_listed_and_says_when_nothing_is_written(new_story):
    story = installed_plugin(new_story)
    story.expect_text("plugin dashboards", "standup: Daily")
    story.expect_text("plugin dashboard standup", "has written nothing on its dashboard yet")


def test_a_dashboard_lists_the_events_it_names_by_their_viewer_names_and_leaves_out_an_unknown_key(new_story):
    story = installed_plugin(new_story)
    rows = json.loads(story.run("plugin dashboards --json").output_text)["rows"]
    story.expect_rows(rows[0]["events"] == ["task.create"])


def test_a_written_dashboard_is_read_back(new_story):
    story = installed_plugin(new_story)
    board_file(story).write_text(json.dumps(PAGES))
    story.expect_text("plugin dashboard standup", "Today")


def test_a_dashboard_that_is_not_valid_says_so(new_story):
    story = installed_plugin(new_story)
    board_file(story).write_text("{ half written")
    story.expect_text("plugin dashboard standup", "not valid JSON")
    board_file(story).write_text("{}")
    story.expect_text("plugin dashboard standup", "does not state its start and pages")


def test_a_plugin_with_no_dashboard_declares_none(new_story):
    story = new_story(fixture=BuilderStarted)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    folder = story.home.folder.parent / "plain"
    folder.mkdir()
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "plain", "title": "Plain", "version": "1"}))
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    story.expect_refusal("plugin dashboard plain", "declares no dashboard")
    story.expect_absent("plugin dashboards", "plain")


def test_the_guide_example_is_a_manifest_the_journal_reads(new_story):
    story = new_story(fixture=BuilderStarted)
    example = re.search(r"const EXAMPLE = `(.*?)`;", GUIDE.read_text(), re.DOTALL)
    folder = story.home.folder.parent / "guide"
    folder.mkdir()
    (folder / "journal-plugin.json").write_text(example.group(1))
    (folder / "settings.json").write_text("[]")
    manifest = PluginManifest.read(folder)
    story.expect_rows(manifest.name == "standup", manifest.event_names == tuple(["file_edited"]), manifest.services[0].name == "web", manifest.dashboard.name == "standup")
    guide = GUIDE.read_text()
    story.expect_rows("relative:" in guide, "checkout:" in guide, "project_reads" in guide, '"tell":' in guide, "task.close" not in guide,
                      "listen: guard" in guide, "listen: listen" in guide, "listen: commit" in guide, "journal event keys" in SKILL.read_text())


def tagged_repository(story, name: str = "repository", version: str = "1.0.0", tag: str = "v1.0.0") -> Path:
    folder = story.home.folder.parent / name
    folder.mkdir(exist_ok=True)
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "standup", "title": "Standup", "version": version, "setup": [{"name": "packages", "run": "true"}]}))
    config = ["-c", "user.name=Story", "-c", "user.email=story@example.com"]
    for line in (["init", "-q"], ["add", "-A"], [*config, "commit", "-q", "--allow-empty", "-m", version], ["tag", tag]):
        subprocess.run(["git", "-C", str(folder), *line], check=True, capture_output=True, timeout=GIT_LIMIT_SECONDS)
    return folder


def test_a_repository_previews_and_installs_at_its_newest_release_keeping_its_address(new_story):
    story = new_story(fixture=BuilderStarted)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    address = f"file://{tagged_repository(story)}"
    story.expect_text(f"plugin preview {address}", "setup packages: true")
    story.expect_text(f"plugin install {address} --yes", "installed standup, on", actor=story.user)
    story.expect_text("plugin list --json", address, "1.0.0", actor=story.user)
    story.expect_rows((story.home.folder / "plugins" / "standup" / "journal-plugin.json").is_file(), not (story.home.folder / "plugins" / "standup" / ".git").exists())
    story.expect_rows(not list((story.home.folder / "plugin-staging").glob("*")) if (story.home.folder / "plugin-staging").exists() else True)


def test_a_repository_that_cannot_be_cloned_says_so(new_story):
    story = new_story(fixture=BuilderStarted)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_refusal(f"plugin install file://{story.home.folder.parent}/nowhere --yes", "could not be", actor=story.user)


def test_an_upgrade_shows_what_changes_applies_only_with_yes_and_stays_on(new_story):
    story = installed_plugin(new_story)
    (story.folder / "journal-plugin.json").write_text(json.dumps({**MANIFEST, "version": "1.3.0", "setup": [{"name": "packages", "run": "true"}, {"name": "more", "run": "echo more"}]}))
    story.expect_text("plugin upgrade standup", "1.2.0 to 1.3.0", "new setup more: echo more", actor=story.user)
    story.expect_text("plugin list --json", '"release": "1.2.0"', actor=story.user)
    story.expect_text("plugin upgrade standup --yes", "standup is now 1.3.0", actor=story.user)
    story.expect_text("plugin list --json", '"release": "1.3.0"', '"enabled": true', actor=story.user)
    story.expect_rows("1.3.0" in (story.home.folder / "plugins" / "standup" / "journal-plugin.json").read_text())


def test_an_upgrade_preview_shows_the_diff_of_the_files_it_changes(new_story):
    story = installed_plugin(new_story)
    (story.folder / "hello.sh").write_text("echo old\necho kept\n")
    story.run("plugin upgrade standup --yes", actor=story.user)
    (story.folder / "hello.sh").write_text("echo new\necho kept\n")
    (story.folder / "extra.txt").write_text("a new file\n")
    (story.folder / "journal-plugin.json").write_text(json.dumps({**MANIFEST, "version": "1.3.0", "setup": [{"name": "packages", "run": "true"}]}))
    story.expect_text("plugin upgrade standup", "-echo old", "+echo new", "+a new file", actor=story.user)
    story.expect_absent("plugin upgrade standup", "echo kept", actor=story.user)


def test_a_failed_setup_leaves_the_old_code(new_story):
    story = installed_plugin(new_story)
    (story.folder / "journal-plugin.json").write_text(json.dumps({**MANIFEST, "version": "1.3.0", "setup": [{"name": "broken", "run": "false"}]}))
    story.expect_refusal("plugin upgrade standup --yes", "broken", actor=story.agent)
    story.expect_rows("1.2.0" in (story.home.folder / "plugins" / "standup" / "journal-plugin.json").read_text())
    story.expect_text("plugin list --json", '"release": "1.2.0"', actor=story.user)

