from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder


class TranscriptionsSeeder(Seeder):
    """Adds a transcription of a short meeting about the cart."""

    def seed(self, demo: Demo) -> None:
        text = "Ada: the cart rounds the total twice. Grace: then fix the rounding before Friday. Ada: and add the delivery date to the summary."
        demo.run(f'transcription make "Cart meeting" --text "{text}" {demo.environment_flag}', demo.people["user"])
