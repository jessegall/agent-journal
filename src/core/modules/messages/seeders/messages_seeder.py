from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class MessagesSeeder(Seeder):
    """Makes messages back and forth between the person and the main agent, the last one with a reaction."""

    def seed(self, demo: Demo) -> None:
        user, main = demo.people["user"], demo.people["main"]
        flag = demo.environment_flag
        demo.run(f'message send "Fix the cart total first" {flag}', user)
        demo.run(f'message send "On it" {flag}', main)
        demo.run(f'message send "Please keep the tax in the summary" {flag}', user)
        finished = demo.new_id(f'message send "Done, the tax is added once" {flag}', main)
        demo.run(f'message react {finished} "👍"', user)
