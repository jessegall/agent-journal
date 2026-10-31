from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class TasksSeeder(Seeder):
    """Makes tasks in each state, with log lines: one closed, one started by the main agent, one blocked, one
    cancelled and one still open."""

    def seed(self, demo: Demo) -> None:
        user, main = demo.people["user"], demo.people["main"]
        flag = demo.environment_flag
        closed = demo.new_id(f'task make "Round the cart total to cents" {flag}', user)
        demo.run(f"task start {closed}", main)
        demo.run(f'task log {closed} "Rounded in the cart total"', main)
        demo.run(f'task close {closed} --outcome "done"', main)
        started = demo.new_id(f'task make "Fix the cart total" --brief "The total shows dollars where cents are meant." {flag}', user)
        demo.run(f"task start {started}", main)
        demo.run(f'task log {started} "Found the cart total in cents"', main)
        demo.run(f'task log {started} "The tax is added twice in the summary"', main)
        blocked = demo.new_id(f'task make "Price the shipping" {flag}', user)
        demo.run(f'task block {blocked} --reason "waiting on the price list"', user)
        cancelled = demo.new_id(f'task make "Add a gift wrap option" {flag}', user)
        demo.run(f'task cancel {cancelled} --reason "not needed"', user)
        waiting = demo.new_id(f'task make "Show the delivery date" {flag}', user)
        for name, row_id in (("closed", closed), ("started", started), ("blocked", blocked), ("cancelled", cancelled), ("open", waiting)):
            demo.keep_id(f"task:{name}", row_id)
