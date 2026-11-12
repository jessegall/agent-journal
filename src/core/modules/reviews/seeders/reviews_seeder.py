import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class ReviewsSeeder(Seeder):
    """Requests a review of the closed task with the reviewers switched on, so a reviewer takes it and
    reports."""

    follows = ["journal.core.tasks"]

    def seed(self, demo: Demo) -> None:
        main = demo.people["main"]
        demo.run("setting make journal.core.reviews.reviewer true")
        review = demo.new_id(f"review request task {demo.ids['task:closed']} --points 2 {demo.environment_flag}", main)
        assignments = json.loads(demo.run(f"assignment list --subject-model review --subject {review} --json"))["rows"]
        for assignment in assignments:
            demo.run(f'review record "1 passed\n2 passed" --review {review}', Actor(assignment["actor_id"], ActorType.AGENT))
