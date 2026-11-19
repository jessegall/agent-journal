from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.process_type import ProcessType
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener import CommitListener
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.setting.setting_values import SettingValues
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.voices.support.voices_settings import NAME_KEY

GIT_SECONDS = 5


class VoiceGitNameListener(CommitListener[JournalBooting]):
    """As the journal starts, a project with no name for its user takes the first name git knows the user by, read
    here outside any write, so the voice never runs git while a hook holds the write turn."""

    name = "voices.git-name"

    def __init__(self, values: SettingValues, home: JournalHome, executor: ProcessExecutor, bus: Bus) -> None:
        self.values, self.home, self.executor, self.bus = values, home, executor, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        if self.values.project.text(NAME_KEY):
            return
        first_name = self.git_first_name()
        if first_name:
            self.bus.run(SetSetting(NAME_KEY, first_name, True), Actor.core(), cause_id=logged.id)

    def git_first_name(self) -> str:
        try:
            full = self.executor.execute(ExecutionRequest(["git", "config", "user.name"], self.home.project_folder, ProcessType.QUICK, GIT_SECONDS)).stdout.strip()
        except (OSError, RunTimeLimitError):
            return ""
        return full.split(" ")[0] if full else ""
