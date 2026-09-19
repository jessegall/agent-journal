from features.base import Feature


class Law(Feature):
    name = "law"
    title_ = "The law, no wigs required"
    abstract_ = "The immutable dispatch rules the journal ships to every agent and project"
    help_ = "Always on. The laws are handed to every session, kept in AGENTS.md and CLAUDE.md, and enforced before a subagent dispatch."
    fixed = True
