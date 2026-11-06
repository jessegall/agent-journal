from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class QuestionsSeeder(Seeder):
    """Asks one question that stays open and one the person answers."""

    def seed(self, demo: Demo) -> None:
        user, main = demo.people["user"], demo.people["main"]
        flag = demo.environment_flag
        demo.run(f'question ask "Which database?" --context "The app stores carts and orders. A single file is enough for one server, and postgres is needed once several servers share the data. sqlite is the single file; postgres is a separate database server." --options sqlite postgres --recommend postgres {flag}', main)
        answered = demo.read_number(f'question ask "What should the page be called?" --context "The new page lists what a customer has put in the cart. Its name shows in the menu and in the address, so pick a short word." {flag}', r"question (\d+) asked", main)
        demo.run(f"question answer {answered} --answer Cart", user)
