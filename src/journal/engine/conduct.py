from journal.engine.base_state import BaseState


class Conduct(BaseState):
    """A feature's conduct toward the agent in every state: on_ listeners named for their event alone, on_tool_starting, folded into the base state at boot. A conduct is never a state on the stack: every listener runs on the state, after the state's own, with the state as itself, so it reads the state and answers with the state's own answers, none, swap, push, pop, forward or refuse."""
