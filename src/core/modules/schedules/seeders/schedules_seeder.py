from engine.query.queries import Queries
from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder
from core.modules.agents.models.agent import Agent
from core.modules.schedules.commands.record_scheduled_job.record_scheduled_job import RecordScheduledJob


class SchedulesSeeder(Seeder):
    """Records a repeating job and a one-time job of the demo's main agent."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def seed(self, demo: Demo) -> None:
        main = demo.people["main"]
        environment_id = self.queries.query(Agent).find(main.id).environment_id
        demo.bus.run(RecordScheduledJob(main.id, "demo-review", "17 */2 * * *", "Review the commits of the last two hours", True), main, environment_id=environment_id)
        demo.bus.run(RecordScheduledJob(main.id, "demo-check", "40 20 * * *", "Check that the release notes went out", False), main, environment_id=environment_id)
