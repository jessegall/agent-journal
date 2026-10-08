from features.gmail.commands import ProposeReply
from features.gmail.details import GmailDetails
from features.gmail.working import GmailWork
from features.integrations.base import IntegrationFeature
from features.journal import Journal


class Gmail(GmailWork, IntegrationFeature):
    key_refused = ("AUTHENTICATIONFAILED", "Invalid credentials", "Username and Password not accepted")
    details = GmailDetails

    def register(self, journal: Journal) -> None:
        super().register(journal)
        journal.commands.add("ticket", ProposeReply())
