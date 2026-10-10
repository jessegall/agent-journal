import re

from engine.gates import Runs, held
from engine.reach import Reach
from features.parts import AgentContext, ToolInterceptor
from providers import command_effects


class RefuseHeldCalls(ToolInterceptor):
    reach = Reach.BOTH
    runs = Runs.SYNC

    def intercept(self, context: AgentContext, call) -> str:
        return held(context.record, context.agent.session, context.provider.is_subagent(context.hook), command_effects.writes(context.hook))


WAIT_LOOP = re.compile(r"\b(?:until|while)\b[^;\n]*;?\s*do\b")
WAIT_ONLY = re.compile(r"(?:timeout\s+\S+(?:\s+sleep\s+\S+)?|sleep\s+\S+)")
WAIT_WAY = ('Say what you wait for with the await tag ([!await] or journal work await "..." --on <ids>) and stop; '
            "a message or a report wakes you.")


def only_waits(shell: str) -> bool:
    steps = [step.strip() for step in re.split(r"[;&|\n]+", WAIT_LOOP.sub(";", shell))]
    steps = [step for step in steps if step and step != "done"]
    return bool(steps) and all(WAIT_ONLY.fullmatch(step) for step in steps)


class RefuseWaitingInTheShell(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.SYNC

    def intercept(self, context: AgentContext, call) -> str:
        shell = call.shell_command
        if not shell or call.tool_input.get("run_in_background") or not only_waits(shell):
            return ""
        return WAIT_WAY
