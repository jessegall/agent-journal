from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class SequencesSeeder(Seeder):
    """Writes a release sequence and has the main agent take its first step up."""

    def seed(self, demo: Demo) -> None:
        user, main = demo.people["user"], demo.people["main"]
        demo.run('sequence make "Release steps" --steps "Run the whole suite | Tag the release | Write the release notes"', user)
        demo.run("sequence run 1", main)
        demo.run("sequence follow", main)
