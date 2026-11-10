from engine.seed.demo import Demo
from engine.seed.seeder import Seeder


class AliasesSeeder(Seeder):
    """Adds two demo aliases: the cart tests and a greeting that takes its words."""

    def seed(self, demo: Demo) -> None:
        user = demo.people["user"]
        demo.run('alias add cart-tests "python3 -m pytest tests/cart" --about "the cart tests"', user)
        demo.run('alias add greet "echo hello {args}" --about "says hello to whoever is named"', user)
