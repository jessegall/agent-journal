from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class ActorsSeeder(Seeder):
    """Makes the person the demo is shown to."""

    def seed(self, demo: Demo) -> None:
        demo.keep_person("user", Actor(demo.new_id('actor make user "Demo"'), ActorType.USER))
