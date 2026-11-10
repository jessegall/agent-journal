from collections.abc import Sequence


class NameGroups:
    """Names that must be unique in their group, and a line for each name used twice."""

    @staticmethod
    def duplicates(groups: Sequence[tuple[str, Sequence[str]]]) -> tuple[str, ...]:
        return tuple(f"two {group} named {name}" for group, names in groups for name in sorted({name for name in names if list(names).count(name) > 1}))
