from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class QuestionsSeeder(Seeder):
    """Asks one question that stays open and one the person answers."""

    def seed(self, demo: Demo) -> None:
        user, main = demo.people["user"], demo.people["main"]
        flag = demo.environment_flag
        demo.run(f'question ask "Which database?" --options sqlite postgres --recommend postgres {flag}', main)
        answered = demo.read_number(f'question ask "What should the page be called?" {flag}', r"question (\d+) asked", main)
        demo.run(f"question answer {answered} --answer Cart", user)
