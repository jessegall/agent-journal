class Refused(Exception):
    """A listener on a saving, creating, updating or deleting event said no; the write does not happen and the caller hears why."""
