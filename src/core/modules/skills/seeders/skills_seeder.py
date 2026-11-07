from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class SkillsSeeder(Seeder):
    """Gives the main agent a skill that is loaded."""

    def seed(self, demo: Demo) -> None:
        main = demo.people["main"]
        skill = demo.new_id(f"agent-skill make {main.id} journal-notes")
        demo.run(f"agent-skill load {skill} --digest abc123")
