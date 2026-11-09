from core.base.module.code_fingerprint import CodeFingerprint
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_visited_limit

TREE_FILE_COUNT = 1000
TEMPLATE_SYNC_COMMANDS = 2


def test_stories_of_one_process_hash_the_source_tree_at_most_once(new_story, monkeypatch):
    hashed = []
    original = CodeFingerprint.files_text

    def counted(self, files):
        hashed.append(len(files))
        return original(self, files)

    monkeypatch.setattr(CodeFingerprint, "files_text", counted)
    for _ in range(3):
        story = new_story(fixture=UserJoined)
        for _ in range(5):
            story.run("task list --environment main", actor=story.user)
    tree_hashes = [file_count for file_count in hashed if file_count > TREE_FILE_COUNT]
    expect_visited_limit(tree_hashes, TEMPLATE_SYNC_COMMANDS)
