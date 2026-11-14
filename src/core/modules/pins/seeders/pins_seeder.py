from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class PinsSeeder(Seeder):
    """Pins two outside links above the demo's chat: a design and a build."""

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        demo.run(f'pin make "Design for the checkout" --link "https://example.org/checkout-design" --label "Open the design" {demo.environment_flag}', user)
        demo.run(f'pin make "Build 12 of the cart" --link "https://example.org/builds/12" --label "Open the build" {demo.environment_flag}', user)
