from core.base.seed.demo import Demo
from core.base.seed.seeder import Seeder

CART_RULES = "The cart keeps every amount in cents, as task 1 asks.\\n## Totals\\n- in cents\\n- rounded once, at the end\\n## Shipping\\nPriced by weight."


class DocumentsSeeder(Seeder):
    """Writes two documents, one of them edited into a second revision, and a report about the first task."""

    def seed(self, demo: Demo) -> None:
        main = demo.people["main"]
        demo.run(f'doc make "Cart rules" --abstract "How the cart counts money" --body "{CART_RULES}"', main)
        demo.run('doc make "Release steps" --abstract "What happens before a release goes out" --body "## Steps\\n1. Run the suite\\n2. Tag it"', main)
        demo.run("doc keep 1", main)
        demo.run(f'doc edit 1 --body "{CART_RULES}\\n## Returns\\nWithin 30 days."', main)
        demo.run('report make "Cart review" --abstract "What the review of the cart found" --body "## Found\\nThe tax was added twice." --about tasks:1', main)
