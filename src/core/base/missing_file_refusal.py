from core.base.refusal import Refusal


class MissingFileRefusal(Refusal):
    """A refusal that says a file is not in the place named, which a plugin tells from any other by its exit code."""

    exit_code = 4
