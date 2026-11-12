from engine.listener.commit.commit_listener import CommitListener
from engine.driver.block_until import BlockUntil


class ReaderWaitListener(CommitListener):
    def handle(self, event):
        # @sin architecture_processes_pressure_outside_the_enforcer
        return BlockUntil(event.agent_id, event.nudge, event.ends)
