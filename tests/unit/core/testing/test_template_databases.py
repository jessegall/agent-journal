from core.testing.template_databases import TemplateDatabases
from tests.stories.core.support.fixtures import UserJoined


def test_two_workers_sharing_a_folder_build_each_template_once_and_the_second_reuses_it(tmp_path):
    first, second = TemplateDatabases(tmp_path), TemplateDatabases(tmp_path)
    built = first.template((), UserJoined)
    reused = second.template((), UserJoined)
    folders = [path for path in tmp_path.iterdir() if path.is_dir()]
    assert reused.home == built.home and reused.state == built.state
    assert len(folders) == len(UserJoined.chain()) + 1


def test_a_story_from_a_shared_template_is_a_copy_the_next_story_does_not_see(tmp_path):
    templates = TemplateDatabases(tmp_path / "templates")
    templates.folder.mkdir()
    story = templates.story(tmp_path / "one", (), UserJoined)
    story.run('message send "only in this story" --environment main', actor=story.user)
    story.close()
    other = templates.story(tmp_path / "two", (), UserJoined)
    other.expect_absent("message list --environment main", "only in this story", actor=other.user)
    other.close()
