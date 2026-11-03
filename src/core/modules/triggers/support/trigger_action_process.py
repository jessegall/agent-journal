import subprocess

from core.base.journal_home import JournalHome
from core.modules.triggers.models.support.trigger_extra_action import TriggerExtraAction


class TriggerActionProcess:
    """Starts a trigger's extra action in the project folder and does not wait for it to end."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def start(self, action: TriggerExtraAction) -> None:
        subprocess.Popen(action.program_arguments(), cwd=self.home.project_folder, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
