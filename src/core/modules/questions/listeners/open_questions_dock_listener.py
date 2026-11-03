from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.questions.models.enums.question_dock_type import QuestionDockType
from core.modules.questions.queries.question_query import QuestionQuery

QUESTIONS_MODULE = "journal.core.questions"


class OpenQuestionsDockListener(CommitListener):
    """While questions are open one card waits above the chat, and it leaves when the last one is settled."""

    name = "questions.open-dock"
    event = "question.*"
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, questions: QuestionQuery, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.questions, self.items = bus, actors, queries, questions, items

    def handle(self, event: LoggedEvent) -> None:
        if event.environment_id is None:
            return
        actor = self.actors.actor(QUESTIONS_MODULE)
        open_ids = {question.id for question in self.questions.open_ones().environment(event.environment_id).oldest().all_rows()}
        docks = [dock.id for dock in self.queries.query(Dock).filter(environment_id=event.environment_id).all_rows()]
        docked = [item for item in self.items.type_items(QuestionDockType.OPEN.value).filter(state=DockItemState.DOCKED).all_rows() if item.dock_id in docks]
        if open_ids and not docked:
            self.bus.run(AddDockItem(event.environment_id, QuestionDockType.OPEN.value, "question", min(open_ids)), actor, cause_id=event.id, environment_id=event.environment_id)
        if not open_ids:
            for item in docked:
                self.bus.run(RemoveDockItem(item.id), actor, cause_id=event.id, environment_id=event.environment_id)
