from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class TemplatesSeeder(Seeder):
    """Writes a critique template for plans and a testing template."""

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        demo.run('template make "Find what is missing" --brief "Read the plan against its goal and add what it leaves out" --applies-to plan --purpose critique'
                 ' --parts "Gaps: what is left out | Tasks: one per gap"', user)
        demo.run('template make "Full suite" --brief "Run every test at a phase end" --purpose testing --commands "sh scripts/run_tests.sh"', user)
