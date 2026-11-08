class GitStoryRequired(AssertionError):
    """Raised by the in-memory git when a story asks for what only real git answers: the story is about git and
    builds its repository with real git."""
