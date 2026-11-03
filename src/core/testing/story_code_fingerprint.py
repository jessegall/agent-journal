from core.base.module.code_fingerprint import CodeFingerprint


class StoryCodeFingerprint(CodeFingerprint):
    """The code's hash for stories: their source does not change while a test process runs, so it is
    worked out once per set of folders and no later command stats a source file, as the real server's
    ticker arranges."""

    ticked = True


STORY_FINGERPRINT = StoryCodeFingerprint()
