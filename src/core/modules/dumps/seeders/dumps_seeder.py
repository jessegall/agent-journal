from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class DumpsSeeder(Seeder):
    """Pours one dump of two notes in; the agent files the first and leaves the second unread."""

    def seed(self, demo: Demo) -> None:
        user, main = demo.people["user"], demo.people["main"]
        demo.run(f'dump make "Notes from the call" --parts "The cart rounds twice | Ship on Friday" {demo.environment_flag}', user)
        demo.run('dump name 1 "Call notes"', main)
        demo.run('dump filed 1 1 "made a task" --refs tasks:1', main)
