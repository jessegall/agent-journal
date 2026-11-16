from enum import StrEnum


class MatcherStyle(StrEnum):
    """How an agent program reads the matcher of a hook entry: as an exact name or a list of names when it holds
    only name characters and as a regex otherwise, or always as a regex."""

    NAME_ALTERNATIVES = "names_or_regex"
    REGEX = "regex"
