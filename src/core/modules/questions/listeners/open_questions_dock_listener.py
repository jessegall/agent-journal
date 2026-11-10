from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.conditions.main_agent_rows import MainAgentRows
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.questions.models.enums.question_dock_type import QuestionDockType
from core.modules.questions.queries.question_query import QuestionQuery
from core.base.change.touched import Touched
from core.modules.questions.models.question import Question

QUESTIONS_MODULE = "journal.core.questions"

OPEN_QUESTIONS_REASON = "The questions of the main agent that a person has not answered yet; the dock shows every one of them."


class OpenQuestionsDockListener(CommitListener[Touched[Question]]):
    """Docks unanswered questions in the main chat until they are settled."""

    name = "questions.open-dock"
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, questions: QuestionQuery, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.questions, self.items = bus, actors, queries, questions, items

    def handle(self, event: Touched[Question], logged: LoggedEvent) -> None:
        if logged.environment_id is None:
            return
        actor = self.actors.actor(QUESTIONS_MODULE)
        open_ids = {question.id for question in self.questions.open_questions().matching(MainAgentRows()).oldest().full_table(OPEN_QUESTIONS_REASON).all_rows()}
        docks = [dock.id for dock in self.queries.query(Dock).all_rows()]
        docked = [item for item in self.items.type_items(QuestionDockType.OPEN.value).filter(state=DockItemState.DOCKED).all_rows() if item.dock_id in docks]
        if open_ids and not docked:
            self.bus.run(AddDockItem(QuestionDockType.OPEN.value, Question.model_name, min(open_ids)), actor, cause_id=logged.id)
        if not open_ids:
            for item in docked:
                self.bus.run(RemoveDockItem(item.id), actor, cause_id=logged.id)
