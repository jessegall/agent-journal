from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class DriversSeeder(Seeder):
    """Lets the coding suite drive the environment of the demo."""

    def seed(self, demo: Demo) -> None:
        demo.run(f"suite choose coding {demo.environment_flag}")
