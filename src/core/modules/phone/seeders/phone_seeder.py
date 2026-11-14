import re

from engine.seed.demo import Demo
from engine.seed.seeder import Seeder

CODE_LINE = re.compile(r"^code: (\S+)$", re.MULTILINE)


class PhoneSeeder(Seeder):
    """Pairs a phone with the viewer as the user."""

    def seed(self, demo: Demo) -> None:
        pair_code = CODE_LINE.search(demo.run("phone pair", demo.people["user"]))
        if pair_code is not None:
            demo.run(f"phone redeem {pair_code[1]} --token-digest demo-phone --name Demo-phone")
