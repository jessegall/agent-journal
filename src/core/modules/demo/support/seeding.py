from dataclasses import dataclass

from core.base.seed.seeder import Seeder


@dataclass(frozen=True)
class Seeding:
    """One module's seeder, with the module it belongs to."""

    module: str
    seeder: type[Seeder]
