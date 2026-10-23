from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class UpdateItem:
    """One row an update names: the section it stands under, its ref and its title; the agent's note on it is added to its data when the agent writes one."""

    section: str
    ref: str
    title: str

    def as_data(self) -> dict:
        return asdict(self)
