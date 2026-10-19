import subprocess
import threading
from datetime import datetime, timezone

from journal.features.mcp.installing import Installing
from journal.features.secrets.browser_logins import BrowserLogins
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.models.secret import Secret
from journal.support.refused import Refused
from journal.repositories.mcp_servers import McpServers
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.secrets import Secrets

STORAGE = "--storage-state"
BROWSER = "playwright"
"""The MCP server whose browser the agent drives, which is given the saved logins."""


class LoginWindow:
    """A browser login taken on its own thread: the window opens on the user's computer, the journal goes on, and when the user closes it the login is saved, merged, given to the agent's browser and the agents restarted to use it. A login that saved nothing is said in a message."""

    def __init__(self, logins: BrowserLogins, secrets: Secrets, servers: McpServers, installing: Installing, messages: Messages, scope: Scope) -> None:
        self.logins, self.secrets, self.servers, self.installing, self.messages, self.scope = logins, secrets, servers, installing, messages, scope

    def open(self, secret: Secret, environment_id: int, by: Actor) -> Secret:
        if not secret.url:
            raise Refused(f"secret {secret.id}, {secret.title}, has no site address to log in to")
        if secret.logging_in_at:
            return secret
        opening = self.secrets.save(secret.with_(logging_in_at=datetime.now(timezone.utc)), by)
        threading.Thread(target=self.taken, args=(opening, environment_id), daemon=True).start()
        return opening

    def taken(self, secret: Secret, environment_id: int) -> None:
        try:
            saved = self.logins.record(secret.title, secret.url)
        except (Refused, OSError, subprocess.TimeoutExpired) as failed:
            self.secrets.save(self.secrets.find(secret.id).with_(logging_in_at=None), Actor.system())
            with self.scope.of(environment_id):
                self.messages.save(Message(author=Author.AGENT, text=f"The login to {secret.title} was not saved: {failed}"), Actor.system())
            return
        self.secrets.save(self.secrets.find(secret.id).with_(logging_in_at=None, session_at=datetime.now(timezone.utc), session_expires=self.logins.expires(saved, secret.url)), Actor.system())
        self.given()

    def forgotten(self, secret: Secret, by: Actor) -> Secret:
        """A login taken back: its saved session deleted, the agent's browser given what remains, and the agents restarted without it."""
        self.logins.forget(secret.title)
        cleared = self.secrets.save(secret.with_(session_at=None, session_expires=None), by)
        self.given()
        return cleared

    def given(self) -> None:
        """The agent's browser started with every saved login, isolated from any other profile, or with none; the agents restarted to use it."""
        merged = self.logins.merge()
        browser = next((s for s in self.servers.all() if s.name == BROWSER), None)
        if browser is None:
            return
        args = list(browser.args)
        while STORAGE in args:
            at = args.index(STORAGE)
            del args[at:at + 2]
        args = [a for a in args if a != "--isolated"]
        if merged is not None:
            args += [STORAGE, str(merged), "--isolated"]
        self.servers.save(browser.with_(args=tuple(args)), Actor.system())
        self.installing.applied()
