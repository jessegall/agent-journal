from features.base import Feature, interceptor
from features.law.policy import refusal


class Law(Feature):
    name = "law"
    title_ = "The law, no wigs required"
    abstract_ = "The immutable dispatch rules the journal ships to every agent and project"
    help_ = "Always on. The laws are handed to every session, kept in AGENTS.md and CLAUDE.md, and enforced before a subagent dispatch."
    fixed = True

    @interceptor
    def dispatch(self, provider, record, hook, session) -> str:
        return refusal(provider, hook.tool)
