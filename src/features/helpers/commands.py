from controllers.types import Agents
from features.helpers.reuse import retire, subagent_rows
from features.parts import Command, Context
from resources.base import Refused


class RetireSubagent(Command):
    name = "retire"

    def run(self, context: Context, agents: Agents, subagent: str):
        primary = agents.primary_to_read()
        known = {sub.address for sub in subagent_rows(primary)} if primary else set()
        if subagent not in known:
            raise Refused(f"{subagent} is not one of your subagents; name one by its id: journal agent retire <id>")
        retire(context.record, subagent)
        return f"subagent {subagent} is retired, so it no longer counts against the agents kept for reuse"
