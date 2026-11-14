from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.driver.state_board import StateBoard
from engine.log.error_log import ErrorLog
from engine.log.system_log_writer import SystemLogWriter
from engine.registry.registry import Registry


class StateBoards:
    """Makes the state board of one hook, so the walk takes a fresh board for every hook it answers."""

    def __init__(self, registry: Registry, container: Container, errors: ErrorLog, system_log: SystemLogWriter) -> None:
        self.registry, self.container, self.errors, self.system_log = registry, container, errors, system_log

    def for_hook(self, hook: AgentHook) -> StateBoard:
        return StateBoard(self.registry, self.container, self.errors, self.system_log, hook)
