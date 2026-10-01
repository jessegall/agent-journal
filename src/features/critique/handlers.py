from dataclasses import dataclass
from typing import ClassVar

from controllers.types import Nudges, Reports
from engine.events.resources import ResourceEvent
from features.critique.controller import Critiques
from features.helpers.controller import Helpers
from features.parts import Context, Handler
from resources.base import SYSTEM, titled


@dataclass(frozen=True)
class HelperUpdated(ResourceEvent):
    on: ClassVar[str] = "helper.updated"


class GatherFindings(Handler):
    def handle(self, context: Context, event: HelperUpdated) -> None:
        helper = Helpers(context.record, actor=SYSTEM).load(event.n)
        if not helper.report:
            return
        critiques = Critiques(context.record, actor=SYSTEM)
        for row in critiques._standing():
            critic = next((c for c in row.critics if c["helper"] == helper.n), None)
            if critic is None or helper.n in row.reported:
                continue
            Reports(context.record, actor=SYSTEM).section(row.report, f"{critic['name']}, {critic['lens']}", helper.report)
            reported = [*row.reported, helper.n]
            critiques.update(row.n, reported=reported)
            if len(reported) == len(row.critics):
                Nudges(context.record, actor=SYSTEM)._to_primary(titled(context.feature.line("gathered", {"n": row.n, "report": row.report})[0]))
