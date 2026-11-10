from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class AgentsSeeder(Seeder):
    """Starts the main agent of the demo."""

    def seed(self, demo: Demo) -> None:
        demo.keep_person("main", Actor(demo.new_id(f"agent start demo-main claude main {demo.environment_flag}"), ActorType.AGENT))
