from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class WaitsSeeder(Seeder):
    """Has the main agent wait on the blocked task."""

    follows = ["journal.core.tasks"]

    def seed(self, demo: Demo) -> None:
        demo.run(f"wait on 'the price list' --target tasks:{demo.ids['task:blocked']}", demo.people["main"])
