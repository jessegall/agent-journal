from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.dump_arrived import DumpArrived
from journal.features.dumps.states.sorting_dump import items_in


class DumpsConduct(Conduct):
    """The dumps feature's conduct in every state: a dump the user drops pushes SortingDump over whatever the agent was doing, told how many items wait."""

    def on_dump_arrived_dumps(self, event: DumpArrived, settings: Settings) -> Transition:
        from journal.features.dumps.feature import DumpsFeature
        from journal.features.dumps.states.sorting_dump import SortingDump
        if not event.by_user:
            return self.none()
        return self.push(SortingDump(dump_id=event.dump_id)).typing(DumpsFeature.DUMP_ARRIVAL.create(n=event.dump_id, count=items_in(event.waiting)))
