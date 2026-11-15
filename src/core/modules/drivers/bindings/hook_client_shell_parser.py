import json

from engine.agent_machine.contracts.shell_parser import ShellParser
from engine.driver.shell_line import ShellLine
from engine.enums.process_type import ProcessType
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor

PARSE_LIMIT_SECONDS = 10


class HookClientShellParser(ShellParser):
    """Asks the installed hook client to parse a shell line with the command table the hook reads."""

    def __init__(self, home: JournalHome, executor: ProcessExecutor) -> None:
        self.home, self.executor = home, executor

    def line(self, text: str) -> ShellLine:
        finished = self.executor.execute(ExecutionRequest([str(self.home.folder / "bin" / "journal-hook"), "--parse-shell", str(self.home.folder / "command_table.json")],
                                                          self.home.folder, ProcessType.QUICK, PARSE_LIMIT_SECONDS, stdin=text))
        if not finished.succeeded:
            raise Refusal("the rewritten line could not be parsed", finished.stderr.strip())
        return ShellLine.parsed(json.loads(finished.stdout))
