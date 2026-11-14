from engine.seed.demo import Demo
from engine.seed.seeder import Seeder
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType


class CodingSeeder(Seeder):
    """Chooses the coding suite and starts an idle worker in the demo."""

    def seed(self, demo: Demo) -> None:
        demo.run(f"suite choose coding {demo.environment_flag}")
        demo.keep_person("worker", Actor(demo.new_id(f"agent start demo-worker claude worker {demo.environment_flag}"), ActorType.AGENT))
