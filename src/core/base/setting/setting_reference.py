from dataclasses import dataclass


@dataclass(frozen=True)
class SettingReference:
    """Places a setting group another module declares in this module's tree, by the group's full key: the group keeps
    its one key and its one value, and the tree shows it here as well as in its own module."""

    group: str

    @property
    def key(self) -> str:
        return self.group.rsplit(".", 1)[-1]
