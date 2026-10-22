from typing import ClassVar


class DataSource[D]:
    """Whatever reads one named part of the feature data, typed by the part it reads; every feature is one, and a feature may ask a question another one answers."""

    name: ClassVar[str]

    @classmethod
    def missing(cls) -> D:
        raise KeyError(f"no feature reads the {cls.name} part")
