import json

from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row

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


def test_a_plugin_s_aliases_arrive_on_install_running_from_the_plugin_s_folder(new_story):
    story = plugin_with_aliases(new_story)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_text("alias show 1", "name: sample-judge", "background: True", "agent_access: True", "LEVEL=2", actor=story.user)
    story.expect_success("sample-judge --changes", "judged at level 2: --changes", actor=story.user)


def test_a_plugin_s_alias_keeps_the_category_its_manifest_declares(new_story):
    story = plugin_with_aliases(new_story)
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    story.expect_text("alias show 1", "name: sample-judge", "category: check", actor=story.user)
    story.expect_absent("alias show 2", "category:", actor=story.user)


def test_a_plugin_that_invents_an_alias_category_is_refused(new_story):
    story = plugin_with_aliases(new_story, INVENTED_CATEGORY)
    story.expect_refusal(f"plugin install {story.plugin_folder} --yes", "the alias greet declares the unknown category magic", actor=story.user)


def test_an_alias_name_a_project_alias_holds_already_is_skipped_and_the_project_alias_kept(new_story):
    story = plugin_with_aliases(new_story)
    story.run('alias add greet "echo mine"', actor=story.user)
    story.expect_text(f"plugin install {story.plugin_folder} --yes", "installed sample, on", actor=story.user)
    story.expect_success("greet", "mine", actor=story.user)


def test_two_aliases_on_one_reader_read_that_reader_once_on_install(new_story):
    story = plugin_with_aliases(new_story, [*ALIASES, {"name": "sample-judge-again", "line": "bin/judge", "reader": "sample-reader"}])
    story.expect_success(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    reader = next(row for row in json.loads(story.run("reader list --json", actor=story.user).output_text)["rows"] if row["name"] == "sample-reader")
    story.expect_text("alias show 3", "name: sample-judge-again", f"reader_id: {reader['id']}", actor=story.user)


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
    expect_row(reader, title="Judging with the sample")
    expect_row(reader, plugin_name="sample")
    story.expect_text("alias show 1", f"reader_id: {reader['id']}", actor=story.user)
    story.run("plugin remove sample", actor=story.user)
    story.expect_absent("reader list", "sample-reader", actor=story.user)


def upgraded_with(story, aliases):
    story.run(f"plugin install {story.plugin_folder} --yes", actor=story.user)
    manifest = json.loads((story.plugin_folder / "journal-plugin.json").read_text())
    (story.plugin_folder / "journal-plugin.json").write_text(json.dumps({**manifest, "version": "2.0.0", "aliases": aliases}))
    story.expect_text("plugin upgrade sample --yes", "2.0.0", actor=story.user)


def test_an_upgrade_adds_an_alias_the_new_version_declares(new_story):
    story = plugin_with_aliases(new_story)
    upgraded_with(story, [*ALIASES, {"name": "extra", "line": "bin/greet", "description": "Added in 2"}])
    story.expect_text("alias show 3", "name: extra", "description: Added in 2", actor=story.user)


def test_an_upgrade_updates_an_alias_whose_declaration_changed(new_story):
    story = plugin_with_aliases(new_story)
    upgraded_with(story, [{**ALIASES[0], "category": "build", "description": "Judge, version 2"}, ALIASES[1]])
    story.expect_text("alias show 1", "name: sample-judge", "category: build", "description: Judge, version 2", actor=story.user)


def test_an_upgrade_gives_an_alias_the_category_a_new_version_declares(new_story):
    story = plugin_with_aliases(new_story)
    upgraded_with(story, [ALIASES[0], {**ALIASES[1], "category": "check"}])
    story.expect_text("alias show 2", "name: greet", "category: check", actor=story.user)


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
    story.expect_success(f"plugin install {folder} --yes", actor=story.agent)
    story.expect_success("sample-judge --changes", "judged", actor=worker)
