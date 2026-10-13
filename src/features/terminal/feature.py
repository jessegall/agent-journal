from events.agents import CommandRan
from expects import Given, Remembered
from resources.types import AgentRow
from framework.base import Feature
from framework.journal import Journal
from features.terminal.details import TerminalDetails
from features.terminal.handlers import KeepCommands
from features.terminal.routes import get_terminal


AGENT = AgentRow(n=1, title="claude-1")


def logged(level: str, tool: str, command: str, output: str = "", at: float = 5.0) -> dict:
    return {"agent": 1, "at": at, "tool": tool, "command": command, "output": output, "stepped": False, "level": level}


EARLIER = [logged("commands", "Bash", f"c{i}", at=float(i)) for i in range(200)]


class Terminal(Feature):
    details = TerminalDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_terminal)
        journal.events.handle(CommandRan, KeepCommands(), expects=[
            Given(CommandRan(agent=1, tool="Bash", command="ls", output="a.txt", at=5.0), rows=[AgentRow(n=1, title="claude-1")])
                >> Remembered("commands", [{"agent": 1, "at": 5.0, "tool": "Bash", "command": "ls", "output": "a.txt", "stepped": False, "level": "commands"}]),
            Given(CommandRan(agent=1, tool="Read", command="src/a.py", output="", at=5.0), rows=[AGENT])
                >> Remembered("everything", [logged("everything", "Read", "src/a.py")]),
            Given(CommandRan(agent=1, tool="Bash", command="journal todo all", output="", at=5.0), rows=[AGENT])
                >> Remembered("journal", [logged("journal", "Bash", "journal todo all")]),
            Given(CommandRan(agent=1, tool="Bash", command="ls", output="  a.txt\n\n", at=5.0), rows=[AGENT])
                >> Remembered("commands", [logged("commands", "Bash", "ls", "a.txt")]),
            Given(CommandRan(agent=1, tool="Bash", command="seq 100", output="\n".join(map(str, range(1, 101))), at=5.0), rows=[AGENT])
                >> Remembered("commands", [logged("commands", "Bash", "seq 100", "\n".join([*map(str, range(1, 61)), "… 40 more lines were not kept"]))]),
            Given(CommandRan(agent=1, tool="Bash", command="pwd", output="", at=300.0), rows=[AGENT], remembered={"terminal@claude-1.commands": [logged("commands", "Bash", "ls", "a")]})
                >> Remembered("commands", [logged("commands", "Bash", "ls", "a"), logged("commands", "Bash", "pwd", "", 300.0)]),
            Given(CommandRan(agent=1, tool="Bash", command="pwd", output="", at=300.0), rows=[AGENT], remembered={"terminal@claude-1.commands": EARLIER})
                >> Remembered("commands", [*EARLIER[1:], logged("commands", "Bash", "pwd", "", 300.0)]),
        ])
