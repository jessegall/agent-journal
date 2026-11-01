import json

from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.support.fixtures import UserJoined

ALIASES = [{"name": "sample-judge", "description": "Judge with the sample", "line": "bin/judge {args}", "env": {"LEVEL": "2"}, "background": True, "workers": True,
            "reader": "sample-reader"},
           {"name": "greet", "line": "bin/greet"}]


def plugin_with_aliases(new_story):
    story = new_story(fixture=UserJoined)
    folder = sample_plugin_folder(story.home.folder.parent)
    manifest = json.loads((folder / "journal-plugin.json").read_text())
    (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "aliases": ALIASES}))
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
    story.expect_text("alias show 1", "name: sample-judge", "background: True", "worker_access: True", "LEVEL=2", actor=story.user)
    story.expect_success("sample-judge --changes", "judged at level 2: --changes", actor=story.user)


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
    assert reader["lines_pattern"] == "^judged" and reader["title"] == "Judging with the sample" and reader["plugin_name"] == "sample", reader
    story.expect_text("alias show 1", f"reader_id: {reader['id']}", actor=story.user)
    story.run("plugin remove sample", actor=story.user)
    story.expect_absent("reader list", "sample-reader", actor=story.user)
