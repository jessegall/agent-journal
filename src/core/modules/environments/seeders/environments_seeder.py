from engine.journal.journal_home import JournalHome
from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class EnvironmentsSeeder(Seeder):
    """Makes the environment of the demo, in the folder the journal sits in."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def seed(self, demo: Demo) -> None:
        demo.run(f"environment make {demo.environment} {self.home.folder.resolve().parent}")
