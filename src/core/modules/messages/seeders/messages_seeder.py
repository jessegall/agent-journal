from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class MessagesSeeder(Seeder):
    """Makes messages back and forth between the person and the main agent."""

    def seed(self, demo: Demo) -> None:
        user, main = demo.people["user"], demo.people["main"]
        flag = demo.environment_flag
        demo.run(f'message send "Fix the cart total first" {flag}', user)
        demo.run(f'message send "On it" {flag}', main)
        demo.run(f'message send "Please keep the tax in the summary" {flag}', user)
        demo.run(f'message send "Done, the tax is added once" {flag}', main)
