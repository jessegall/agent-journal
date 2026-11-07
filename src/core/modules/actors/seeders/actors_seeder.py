from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class ActorsSeeder(Seeder):
    """Makes the person the demo is shown to."""

    def seed(self, demo: Demo) -> None:
        demo.keep_person("user", Actor(demo.new_id('actor make user "Demo"'), ActorType.USER))
