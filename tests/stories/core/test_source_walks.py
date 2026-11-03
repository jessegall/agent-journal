from core.base.module.code_fingerprint import CodeFingerprint
from tests.stories.core.support.fixtures import UserJoined


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
    assert len(hashed) <= 1, hashed
