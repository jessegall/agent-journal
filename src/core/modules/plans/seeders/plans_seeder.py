from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class PlansSeeder(Seeder):
    """Makes a plan with phases, one of them a checkpoint, and tasks in them."""

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        plan = demo.new_id(f'plan make "Version 5 demo" {demo.environment_flag}', user)
        values = demo.new_id(f'phase make --plan {plan} "Values" --goal "the cart values pass their tests"', user)
        checkout = demo.new_id(f'phase make --plan {plan} "Checkout" --goal "the checkout pages work" --checkpoint', user)
        demo.run(f"phase place {demo.ids['task:started']} --phase {values}", user)
        demo.run(f"phase place {demo.ids['task:open']} --phase {checkout}", user)
        demo.run(f"plan ready {plan}", user)
        demo.run(f"plan approve {plan}", user)
