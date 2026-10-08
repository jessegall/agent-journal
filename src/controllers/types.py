import time
from pathlib import Path
from engine.record import Record
from controllers.base import CONTROLLERS, register
from resources.base import SYSTEM, Refused
from controllers.messages import Messages
from controllers.todos import Todos
from controllers.works import Works
from controllers.docs import Docs
from controllers.reports import Reports
from controllers.facts import Facts
from controllers.rules import Rules
from controllers.reminders import Reminders
from controllers.questions import Questions
from controllers.comments import Comments
from controllers.agents import Agents
from controllers.notifications import Notifications
from controllers.notices import Notices
from controllers.reactions import Reactions
from controllers.tools import Tools
from controllers.features import Features
from controllers.plugins import Plugins
from controllers.environments import Environments
from controllers.nudges import Nudges


register(Messages, Todos, Works, Docs, Reports, Facts, Rules, Reminders, Questions, Comments, Agents,
         Notifications, Notices, Reactions, Tools, Features, Plugins, Environments, Nudges)


WARM_PAUSE = 0.02
environment_records = Record.every


def warm_record(record: Record, pause: float = 0.0) -> None:
    record.event_log.recent()
    for controller in CONTROLLERS.values():
        try:
            controller(record, actor=SYSTEM)._warm()
        except (OSError, Refused):
            pass
        time.sleep(pause)


def warm(root: Path) -> None:
    from engine.sessions import Sessions
    sessions = Sessions(root)
    for record in sorted(Record.every(root), key=lambda record: not sessions.holder(record.env)):
        warm_record(record, WARM_PAUSE)
