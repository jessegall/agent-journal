from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class DockingSeeder(Seeder):
    """Docks the started task and the fact above the chat."""

    follows = ["journal.core.tasks", "journal.core.memories"]

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        demo.run(f"dock add tasks.task task {demo.ids['task:started']} {demo.environment_flag}", user)
        demo.run(f"dock add memories.memory memory {demo.ids['memory:fact']} {demo.environment_flag}", user)
