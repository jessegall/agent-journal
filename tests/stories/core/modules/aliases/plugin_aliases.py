import json

from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.support.fixtures import UserJoined
from engine.testing.expectations.expect_row import expect_row

ALIASES = [{"name": "sample-judge", "description": "Judge with the sample", "line": "bin/judge {args}", "env": {"LEVEL": "2"}, "background": True, "workers": True,
            "reader": "sample-reader", "category": "check"},
           {"name": "greet", "line": "bin/greet"}]
INVENTED_CATEGORY = [{"name": "greet", "line": "bin/greet", "category": "magic"}]


def plugin_with_aliases(new_story, aliases=ALIASES):
    story = new_story(fixture=UserJoined)
    folder = sample_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "aliases": aliases}))
    (folder / "bin").mkdir(exist_ok=True)
    judge = folder / "bin" / "judge"
    judge.write_text('#!/bin/sh\necho "judged at level $LEVEL: $*"\n')
    judge.chmod(0o755)
    (folder / ".journal-plugin" / "readers").mkdir(parents=True)
    (folder / ".journal-plugin" / "readers" / "sample-reader.pattern").write_text("# the judged lines\n^judged\nlabel: Judging with the sample\nfinished: ^judged\n")
    story.plugin_folder = folder
    return story


def test_a_plugin_s_alias_keeps_the_category_its_manifest_declares(new_story):
    story = plugin_with_aliases(new_story)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_text("alias show 1", "name: sample-judge", "category: check", actor=story.user)
    story.expect_absent("alias show 2", "category:", actor=story.user)


def test_an_alias_name_a_project_alias_holds_already_is_skipped_and_the_project_alias_kept(new_story):
    story = plugin_with_aliases(new_story)
    story.run('alias add greet "echo mine"', actor=story.user)
    story.expect_text(f"plugin install {story.plugin_folder} --yes", "installed sample, on", actor=story.user)
    story.expect_success("greet", "mine", actor=story.user)


def test_a_plugin_s_aliases_go_with_the_plugin(new_story):
    story = plugin_with_aliases(new_story)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.run("plugin remove sample", actor=story.user)
    story.expect_absent("alias list", "sample-judge", actor=story.user)


def test_a_plugin_s_readers_arrive_on_install_for_its_aliases_and_go_with_the_plugin(new_story):
    story = plugin_with_aliases(new_story)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    reader = next(row for row in json.loads(story.run("reader list --json", actor=story.user).output_text)["rows"] if row["name"] == "sample-reader")
    expect_row(reader, lines_pattern="^judged")
    expect_row(reader, title="the judged lines", subject="Judging with the sample")
    expect_row(reader, plugin_name="sample")
    story.expect_text("alias show 1", f"reader_id: {reader['id']}", actor=story.user)
    story.run("plugin remove sample", actor=story.user)
    story.expect_absent("reader list", "sample-reader", actor=story.user)


def upgraded_with(story, aliases):
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    manifest = json.loads((story.plugin_folder / "journal-plugin.json").read_text())
    (story.plugin_folder / "journal-plugin.json").write_text(json.dumps({**manifest, "version": "2.0.0", "aliases": aliases}))
    story.expect_text("plugin upgrade sample --yes", "2.0.0", actor=story.user)


def test_an_upgrade_removes_an_alias_the_new_version_no_longer_declares(new_story):
    story = plugin_with_aliases(new_story)
    upgraded_with(story, [ALIASES[0]])
    story.expect_no_text("alias list", "greet", actor=story.user)
    story.expect_text("alias list", "sample-judge", actor=story.user)


def test_an_upgrade_leaves_alone_a_name_the_project_holds(new_story):
    story = plugin_with_aliases(new_story, [ALIASES[0]])
    story.run('alias add extra "echo mine"', actor=story.user)
    upgraded_with(story, [ALIASES[0], {"name": "extra", "line": "bin/greet"}])
    story.expect_success("extra", "mine", actor=story.user)


def test_an_upgrade_keeps_agent_access_a_person_granted(new_story):
    story = plugin_with_aliases(new_story, [ALIASES[1]])
    story.expect_success(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_success("alias edit greet --agents", actor=story.user)
    manifest = json.loads((story.plugin_folder / "journal-plugin.json").read_text())
    (story.plugin_folder / "journal-plugin.json").write_text(json.dumps({**manifest, "version": "2.0.0", "aliases": [{**ALIASES[1], "description": "Updated"}]}))
    story.expect_success("plugin upgrade sample --yes", actor=story.user)
    story.expect_text("alias show 1", "agent_access: True", "description: Updated", actor=story.user)


def test_a_manifest_alias_for_agents_is_open_to_a_worker_on_install(new_story):
    from tests.stories.core.modules.aliases.running import worker_actor

    story, worker = worker_actor(new_story)
    folder = sample_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "aliases": [{"name": "sample-judge", "line": "judge", "agents": True}]}))
    judge = folder / "judge"
    judge.write_text('#!/bin/sh\necho judged\n')
    judge.chmod(0o755)
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    story.expect_success("sample-judge --changes", "judged", actor=worker)


def test_a_plugin_s_alias_reads_the_settings_of_the_environment_it_runs_in(new_story):
    story = plugin_with_aliases(new_story, [{"name": "show-level", "line": "bin/show"}])
    display = story.plugin_folder / "bin" / "show"
    display.write_text('#!/bin/sh\necho "env=$JOURNAL_ENV settings=$(cat "$JOURNAL_SETTINGS")"\n')
    display.chmod(0o755)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_success("plugin configure sample level 5", actor=story.user)
    story.expect_success("plugin configure sample level 9 --environment main", actor=story.user)
    shown = story.run("show-level", actor=story.user, environment_id=1)
    story.expect_rows('env=main settings={"level": 9' in shown.output_text, detail=shown.output_text)
