import re

from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder

CODE_LINE = re.compile(r"^code: (\S+)$", re.MULTILINE)


class PhoneSeeder(Seeder):
    """Pairs a phone with the viewer as the person."""

    def seed(self, demo: Demo) -> None:
        invitation = CODE_LINE.search(demo.run("phone pair", demo.people["user"]))
        if invitation is not None:
            demo.run(f"phone redeem {invitation[1]} --token-digest demo-phone --name Demo-phone")
