from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class SecretsSeeder(Seeder):
    """Adds a demo secret that waits for its key to be filled in."""

    def seed(self, demo: Demo) -> None:
        demo.run(f'secret make "Payment test key" --brief "The cart tests charge a test card with it" {demo.environment_flag}', demo.people["main"])
