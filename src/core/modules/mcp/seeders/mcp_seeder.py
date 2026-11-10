from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class McpSeeder(Seeder):
    """Adds a demo server the catalogue does not suggest."""

    def seed(self, demo: Demo) -> None:
        demo.run('mcp add payments "https://mcp.payments.example/sse"', demo.people["user"])
