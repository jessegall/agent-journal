from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class MemoriesSeeder(Seeder):
    """Makes a memory."""

    def seed(self, demo: Demo) -> None:
        main = demo.people["main"]
        flag = demo.environment_flag
        demo.keep_id("memory:fact", demo.new_id(f'memory make "The cart total is in cents" {flag}', main))
