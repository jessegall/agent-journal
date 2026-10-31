from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class SharingSeeder(Seeder):
    """Shares the demo plan as a read-only link for a week."""

    follows = ["journal.core.plans"]

    def seed(self, demo: Demo) -> None:
        demo.run("share make plans:1", demo.people["user"])
