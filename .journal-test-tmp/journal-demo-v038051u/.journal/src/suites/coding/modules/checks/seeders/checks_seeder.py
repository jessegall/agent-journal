from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class ChecksSeeder(Seeder):
    """Makes a check that passes and one that fails, and runs both once."""

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        demo.run('check make "Suite" --command "true" --every 0', user)
        demo.run('check make "Lint" --command "echo two problems; false" --every 0', user)
        demo.run("check run 1", user)
        demo.run("check run 2", user)
