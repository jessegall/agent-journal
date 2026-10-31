from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class TriggersSeeder(Seeder):
    """Makes a phrase trigger that nudges and a scheduled one that comes every half hour."""

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        demo.run('trigger make "deploy, release" "Run the release sequence"', user)
        demo.run('trigger schedule "Check the build" --every 30', user)
