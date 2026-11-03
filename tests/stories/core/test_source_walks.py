from core.base.module.code_fingerprint import CodeFingerprint
from tests.stories.core.support.fixtures import UserJoined

WHOLE_TREE_FILES = 1000
TEMPLATE_SYNC_AND_COMMANDS = 2


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
    whole_tree_hashes = [count for count in hashed if count > WHOLE_TREE_FILES]
    assert len(whole_tree_hashes) <= TEMPLATE_SYNC_AND_COMMANDS, hashed
