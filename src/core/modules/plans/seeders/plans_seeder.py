from engine.actor.actor import Actor
from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


REASONED = ("block", "cancel")
ENDED_DOCKS = {"close": "plans.completed", "cancel": "plans.cancelled"}


class PlansSeeder(Seeder):
    """Makes a plan with phases, one of them a checkpoint, and tasks in them, and one plan for each way a
    plan card in the chat can stand: started, paused, cancelled, done and waiting for the user."""

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        plan = demo.new_id(f'plan make "Version 5 demo" {demo.environment_flag}', user)
        values = demo.new_id(f'phase make --plan {plan} "Values" --goal "the cart values pass their tests"', user)
        checkout = demo.new_id(f'phase make --plan {plan} "Checkout" --goal "the checkout pages work" --checkpoint', user)
        demo.run(f"phase place {demo.ids['task:started']} --phase {values}", user)
        demo.run(f"phase place {demo.ids['task:open']} --phase {checkout}", user)
        demo.run(f'task make "Show the cart total in cents" --brief "The cart page shows cents." --phase {values} {demo.environment_flag}', user)
        demo.run(f'task make "Show the delivery cost" --brief "The checkout shows the delivery cost." --phase {checkout} {demo.environment_flag}', user)
        demo.run(f"plan ready {plan}", user)
        demo.run(f"plan approve {plan} {demo.environment_flag}", user)
        self.dock_each_state(demo, user)

    def dock_each_state(self, demo: Demo, user: Actor) -> None:
        # the dock holds six items, which the five plan cards and the task and the fact above them would pass
        demo.run(f"setting set journal.core.docking.most-items 12 {demo.environment_flag}", user)
        moves = {
            "Checkout rewrite": ["ready", "approve", "start"],
            "Shipping rates": ["ready", "approve", "start", "block"],
            "Gift wrap": ["cancel"],
            "Cart totals": ["ready", "approve", "start", "close"],
            "Tax rules": ["ready"],
        }
        for title, steps in moves.items():
            plan = demo.new_id(f'plan make "{title}" {demo.environment_flag}', user)
            demo.run(f'phase make --plan {plan} "First steps" --goal "the plan gets going"', user)
            for step in steps:
                reason = ' --reason "waiting for the shipping rates"' if step in REASONED else ""
                demo.run(f"plan {step} {plan}{reason} {demo.environment_flag}", user)
            # the plans module docks a plan as it is made ready, started or paused; a plan that ended is docked by hand
            if steps[-1] in ("close", "cancel"):
                demo.run(f"dock add {ENDED_DOCKS[steps[-1]]} plan {plan} {demo.environment_flag}", user)
