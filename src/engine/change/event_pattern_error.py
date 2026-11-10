class EventPatternError(Exception):
    """Raised when an event pattern is neither * nor a model name and a change, each of which may be *."""
