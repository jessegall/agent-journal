from engine.listener.commit.commit_listener import CommitListener
from engine.driver.open_hold import OpenHold


class ReaderWaitListener(CommitListener):
    def handle(self, event):
        # @sin architecture_processes_pressure_outside_the_enforcer
        return OpenHold(event.agent_id, event.agent_message, event.ends)
