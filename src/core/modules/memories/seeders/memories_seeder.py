from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class MemoriesSeeder(Seeder):
    """Makes a memory of each type: a fact, a rule and a reminder."""

    def seed(self, demo: Demo) -> None:
        user, main = demo.people["user"], demo.people["main"]
        flag = demo.environment_flag
        demo.keep_id("memory:fact", demo.new_id(f'memory make "The cart total is in cents" --type fact {flag}', main))
        demo.keep_id("memory:rule", demo.new_id(f'memory make "Always run the tests before a commit" --type rule --project {flag}', user))
        demo.keep_id("memory:reminder", demo.new_id(f'memory make "Check the cart totals" --type reminder {flag}', main))
