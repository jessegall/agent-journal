from controllers.types import Agents
from dataclasses import dataclass
from engine.fields import Loaded
from features.routing import Reply, Request, handles
from features.terminal.log import EVERYTHING, LEVELS as TERMINAL_LEVELS, lines as terminal_lines
from resources.base import Refused, USER


@dataclass(frozen=True)
class TerminalQuery(Loaded):
    level: str = EVERYTHING
    after: float = 0.0


@handles("GET", "/api/{env}/agent/{n}/terminal")
def get_terminal(req: Request) -> Reply:
    asked = req.query_as(TerminalQuery)
    level = asked.level
    if level not in TERMINAL_LEVELS:
        raise Refused(f"level is one of {', '.join(TERMINAL_LEVELS)}")
    record = req.record()
    return Reply(200, {"lines": terminal_lines(record, Agents(record, actor=USER).load(req.params["n"]).title, level, asked.after)})
