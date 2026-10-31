from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class NoticesSeeder(Seeder):
    """Pins two outside links above the demo's chat: a design and a build."""

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        demo.run(f'notice make "Design for the checkout" --link "https://example.org/checkout-design" --label "Open the design" {demo.environment_flag}', user)
        demo.run(f'notice make "Build 12 of the cart" --link "https://example.org/builds/12" --label "Open the build" {demo.environment_flag}', user)
