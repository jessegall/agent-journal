from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.documents.support.document_filers import DocumentFilers

REPORTING_PROFILES = ("journal-debugger", "journal-researcher", "journal-code-reviewer", "journal-plan-reviewer")


class ReportDocumentFilers(DocumentFilers):
    """A debugger, researcher or reviewer answers a question once, so it files reports; documents, which are
    revised and referred to later, are for designers, planners and the people who read them."""

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, actor: Actor) -> None:
        if actor.type is not ActorType.AGENT:
            return
        profile = self.agents.find_unscoped(actor.id).profile
        if profile in REPORTING_PROFILES:
            raise Refusal(f"{profile} files reports, not documents", 'journal report make "<title>" --abstract "<one line>" --body "<markdown>" files a report')
