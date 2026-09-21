import time

from controllers.types import Rules
from features.context.reread import standing
from features.parts import Command, Context


class Reread(Command):
    name = "reread"

    def run(self, context: Context, rules: Rules) -> str:
        rows = standing(rules.record)
        rules.record.cleanup_read_at = time.time()
        return "\n\n".join(f"{r.type} {r.n}  {r.title}\n{r.brief}".rstrip() for r in rows)
