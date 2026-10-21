import subprocess
import threading
from datetime import datetime, timezone

from journal.support.mcp_installing import McpInstalling
from journal.features.secrets.support.browser_logins import BrowserLogins
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.models.secret import Secret
from journal.support.rejection import Rejection
from journal.repositories.mcp_servers import McpServers
from journal.repositories.messages import Messages
from journal.support.scope import Scope
from journal.repositories.secrets import Secrets

STORAGE = "--storage-state"
BROWSER = "playwright"


class LoginWindow:
    """A browser login taken on its own thread: the window opens on the user's computer, the journal goes on, and when the user closes it the login is saved, merged, given to the agent's browser and the agents restarted to use it. A login that saved nothing is said in a message."""

    def __init__(self, logins: BrowserLogins, secrets: Secrets, servers: McpServers, installing: McpInstalling, messages: Messages, scope: Scope) -> None:
        self.logins, self.secrets, self.servers, self.installing, self.messages, self.scope = logins, secrets, servers, installing, messages, scope

    def open(self, secret: Secret, environment_id: int, actor: Actor) -> Secret:
        if not secret.url:
            raise Rejection(f"secret {secret.id}, {secret.title}, has no site address to log in to")
        if secret.logging_in_at:
            return secret
        opening = self.secrets.save(secret.with_(logging_in_at=datetime.now(timezone.utc)), actor)
        threading.Thread(target=self.claimed, args=(opening, environment_id), daemon=True).start()
        return opening

    def claimed(self, secret: Secret, environment_id: int) -> None:
        try:
            saved = self.logins.record(secret.title, secret.url)
        except (Rejection, OSError, subprocess.TimeoutExpired) as failed:
            self.secrets.save(self.secrets.find(secret.id).with_(logging_in_at=None), Actor.system())
            with self.scope.environment(environment_id):
                self.messages.save(Message(author=Author.AGENT, text=f"The login to {secret.title} was not saved: {failed}"), Actor.system())
            return
        self.secrets.save(self.secrets.find(secret.id).with_(logging_in_at=None, session_at=datetime.now(timezone.utc), session_expires=self.logins.expires(saved, secret.url)), Actor.system())
        self.supplied()

    def dropped(self, secret: Secret, actor: Actor) -> Secret:
        self.logins.drop(secret.title)
        cleared = self.secrets.save(secret.with_(session_at=None, session_expires=None), actor)
        self.supplied()
        return cleared

    def supplied(self) -> None:
        merged = self.logins.merge()
        browser = next((s for s in self.servers.all() if s.name == BROWSER), None)
        if browser is None:
            return
        args = list(browser.args)
        while STORAGE in args:
            time = args.index(STORAGE)
            del args[time:time + 2]
        args = [item for item in args if item != "--isolated"]
        if merged is not None:
            args += [STORAGE, str(merged), "--isolated"]
        self.servers.save(browser.with_(args=tuple(args)), Actor.system())
        self.installing.applied()
