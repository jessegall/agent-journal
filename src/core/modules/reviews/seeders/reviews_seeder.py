import re

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder

REVIEWER_ID = re.compile(r"^reviewer_id: (\d+)$", re.MULTILINE)


class ReviewsSeeder(Seeder):
    """Requests a review of the closed task with the reviewers switched on, so a reviewer takes it and reports."""

    follows = ["journal.core.tasks"]

    def seed(self, demo: Demo) -> None:
        main = demo.people["main"]
        demo.run("setting make reviews.reviewer true")
        review = demo.new_id(f"review request task {demo.ids['task:closed']} --points 2 {demo.environment_flag}", main)
        reviewer = REVIEWER_ID.search(demo.run(f"review show {review}"))
        if reviewer is not None:
            demo.run(f'review record "1 passed\n2 passed" --review {review}', Actor(int(reviewer[1]), ActorType.AGENT))
