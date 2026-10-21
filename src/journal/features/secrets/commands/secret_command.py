import time
from argparse import Namespace
from pathlib import Path
from datetime import datetime, timezone

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.secrets.support.browser_logins import WINDOW_SECONDS
from journal.features.secrets.support.login_window import LoginWindow
from journal.features.secrets.support.programs import Programs
from journal.features.secrets.support.secret_run import SecretRun
from journal.models.author import Author
from journal.models.message import Message
from journal.models.secret import Secret
from journal.models.secret_kind import SecretKind
from journal.support.rejection import Rejection
from journal.repositories.mcp_servers import McpServers
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.secrets import Secrets
from journal.repositories.workers import Workers
from journal.support.secret_values import SecretValues


class SecretCommand(Command):
    """The project's secrets, by number: made, asked for, changed, listed, shown and deleted. None takes a value: the user fills a value on the Secrets page."""

    noun = "secret"

    def __init__(self, secrets: Secrets, values: SecretValues, messages: Messages, servers: McpServers, runner: SecretRun, workers: Workers, window: LoginWindow, scope: Scope) -> None:
        self.secrets, self.values, self.messages, self.servers, self.runner, self.workers, self.window, self.scope = secrets, values, messages, servers, runner, workers, window, scope

    def arguments(self, verbs) -> None:
        creation = self.verb(verbs, "create", "a secret with its fields, empty until the user fills them")
        creation.add_argument("title")
        creation.add_argument("--brief", default="", help="how it is used: the commands it runs with")
        creation.add_argument("--kind", default=SecretKind.CUSTOM.value)
        request = self.verb(verbs, "request", "ask the user for a secret: it is made, and a message asks them to fill it on the Secrets page")
        request.add_argument("title")
        request.add_argument("--why", required=True, help="what you need it for")
        request.add_argument("--kind", default=SecretKind.API_KEY.value)
        request.add_argument("--url", default="", help="the site of a browser login")
        update = self.verb(verbs, "update", "change a secret's title or how it is used")
        update.add_argument("n", type=int)
        update.add_argument("--title", default="")
        update.add_argument("--brief", default="")
        self.verb(verbs, "fill", "the user fills a value on the Secrets page, never by a command").add_argument("n", type=int)
        store = self.verb(verbs, "store", "move a value you made yourself, such as a generated password, from a file into a secret; the file is deleted")
        store.add_argument("n", type=int)
        store.add_argument("field")
        store.add_argument("file")
        self.verb(verbs, "list", "every secret, with what it waits for")
        self.verb(verbs, "show", "a secret's fields, which are filled and the programs it may be given to").add_argument("n", type=int)
        run = self.verb(verbs, "run", "give a secret to a program it may go to: its value on the program's input, or in variables with --env, and masked in what it prints")
        run.add_argument("secret", help="the secret's number or title")
        run.add_argument("--stdin", default="", help="what the program reads, with {field} where a value goes; the hidden value alone when left out")
        run.add_argument("--env", action="store_true", help="the values in the fields' variables too")
        run.add_argument("command", nargs="*", help="after --: the program and its arguments")
        propose = self.verb(verbs, "propose", "propose a program a secret may go to; the user allows it on the Secrets page")
        propose.add_argument("n", type=int)
        propose.add_argument("program")
        login = self.verb(verbs, "login", "log in to a browser login's site, only where the user lets the agent log in on its own; --wait waits for the window to close")
        login.add_argument("n", type=int)
        login.add_argument("--wait", action="store_true")
        self.verb(verbs, "folder", "the file the values live in, outside the project")
        self.verb(verbs, "delete", "a secret put away; its values are kept thirty days for a restore").add_argument("n", type=int)
        self.verb(verbs, "restore", "a deleted secret back, with its values").add_argument("n", type=int)

    def create(self, args: Namespace, caller: Caller) -> int:
        secret = self.file(args.title, args.brief, SecretKind.lookup(args.kind), caller)
        proposed = f"; proposed for the user to allow: {', '.join(secret.proposed)}" if secret.proposed else ""
        print(f"secret {secret.id} made: {secret.title}, waiting for the user to fill {', '.join(f['name'] for f in secret.fields) or 'its fields'} on the Secrets page{proposed}")
        return 0

    def request(self, args: Namespace, caller: Caller) -> int:
        reaching = [s.name for s in self.servers.all() if args.title.lower() in (s.name.lower(), s.title.lower())]
        if reaching:
            raise Rejection(f"{args.title} is reached through the MCP server {', '.join(reaching)} already: use its tools, and if they cannot do what you need, say what is missing in the chat")
        secret = self.secrets.save(self.file(args.title, "", SecretKind.lookup(args.kind), caller).with_(url=args.url, questioned_at=datetime.now(timezone.utc)), caller.actor)
        asking = f"Please log in to {secret.title} with the Log in button on the Secrets page; a browser opens on your computer, and the login is saved when you close it" if secret.kind == SecretKind.BROWSER_LOGIN else f"Please fill in the secret {secret.title} on the Secrets page, never in the chat"
        self.messages.save(Message(author=Author.AGENT, text=f"{asking}: I need it {args.why}.\n\nsecret {secret.id}"), caller.actor)
        print(f"secret {secret.id} asked for: the user fills it on the Secrets page")
        return 0

    def file(self, title: str, brief: str, kind: SecretKind, caller: Caller) -> Secret:
        return self.secrets.save(Secret(title=title, brief=brief, kind=kind, fields=kind.first_fields(title), proposed=Programs.mentioned(brief)), caller.actor)

    def update(self, args: Namespace, caller: Caller) -> int:
        secret = self.secrets.find(args.n)
        secret = self.secrets.save(secret.with_(title=args.title or secret.title, brief=args.brief or secret.brief), caller.actor)
        print(f"secret {secret.id} updated: {secret.title}")
        return 0

    def fill(self, args: Namespace, caller: Caller) -> int:
        raise Rejection("a secret's value is filled by the user on the Secrets page, never by a command: ask for it with `journal secret request`")

    def store(self, args: Namespace, caller: Caller) -> int:
        secret = self.secrets.find(args.n)
        file = Path(args.file)
        if not file.is_file():
            raise Rejection(f"no file at {args.file}: write the value you made to a file, and the journal moves it into the secret")
        value = file.read_text().strip()
        file.unlink()
        if not value:
            raise Rejection(f"{args.file} held no value; it is deleted all the same")
        self.values.put_field(secret.field(args.field), value)
        self.secrets.save(secret.is_filled(args.field), caller.actor)
        print(f"{args.field} of secret {secret.id} stored, and {args.file} deleted")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for s in self.secrets.active():
            print(f"{s.id:>4}  {s.kind:<13} {s.title}" + ("  waiting for the user" if s.waiting() else "") + (f"  given to {', '.join(s.programs)}" if s.programs else ""))
        return 0

    def show(self, args: Namespace, caller: Caller) -> int:
        s = self.secrets.find(args.n)
        print(f"secret {s.id}: {s.title} ({s.kind})" + (", deleted" if s.deleted_at else ""))
        if s.brief:
            print(s.brief)
        for raw in s.fields:
            print(f"  {raw['name']:<10} {raw['variable']:<24} {'filled' if raw['name'] in s.filled else 'waiting for the user'}{', hidden' if raw.get('hidden', True) else ''}")
        print(f"  given to: {', '.join(s.programs) or 'no program yet'}" + (f"; proposed: {', '.join(s.proposed)}" if s.proposed else ""))
        return 0

    def run(self, args: Namespace, caller: Caller) -> int:
        secret = self.lookup(args.secret)
        if not secret.helpers and caller.session is not None and self.workers.session_worker(caller.session):
            raise Rejection(f"secret {secret.id} is the main agent's alone: the user lets helpers have it on the Secrets page")
        code, output = self.runner.run(secret, [c for c in args.command if c != "--"], args.stdin, args.env)
        self.secrets.save(secret.with_(used_at=datetime.now(timezone.utc)), caller.actor)
        print(output.decode(errors="replace"), end="")
        return code

    def propose(self, args: Namespace, caller: Caller) -> int:
        secret = self.secrets.find(args.n)
        name = args.program
        if "/" in name or Programs.is_withheld(name):
            raise Rejection(f"a secret is never given to {name}: propose the program that uses it directly, named bare, such as curl or gh")
        if name in secret.programs or name in secret.proposed:
            print(f"{name} is {'allowed' if name in secret.programs else 'proposed'} for secret {secret.id} already")
            return 0
        self.secrets.save(secret.with_(proposed=(*secret.proposed, name)), caller.actor)
        print(f"{name} proposed for secret {secret.id}: the user allows it on the Secrets page")
        return 0

    def login(self, args: Namespace, caller: Caller) -> int:
        secret = self.secrets.find(args.n)
        if args.wait:
            return self.waited(secret)
        if not secret.auto_login:
            raise Rejection(f"the user logs in to {secret.title} with the Log in button on the Secrets page; ask for it with `journal secret request {secret.title} --kind 'browser login' --url <address> --why <what for>`")
        self.window.open(secret, self.scope.id, caller.actor)
        print(f"a browser opens on {secret.url} on the user's computer: wait for it with `journal secret login {secret.id} --wait`")
        return 0

    def waited(self, secret: Secret) -> int:
        began = time.time()
        while self.secrets.find(secret.id).login_started_at and time.time() - began < WINDOW_SECONDS:
            time.sleep(1)
        finished = self.secrets.find(secret.id)
        print(f"logged in to {finished.title}" if finished.session_at else f"no login to {finished.title} is saved")
        return 0 if finished.session_at else 1

    def lookup(self, value: str) -> Secret:
        rows = [s for s in self.secrets.active() if str(s.id) == value or s.title.lower() == value.lower()]
        if not rows:
            raise Rejection(f"no secret is numbered or titled {value!r}: `journal secret list` names them")
        return rows[0]

    def folder(self, args: Namespace, caller: Caller) -> int:
        print(self.values.path)
        return 0

    def delete(self, args: Namespace, caller: Caller) -> int:
        secret = self.secrets.save(self.secrets.find(args.n).deleted(datetime.now(timezone.utc)), caller.actor)
        print(f"secret {secret.id} deleted; its values are kept thirty days, journal secret restore {secret.id} brings it back")
        return 0

    def restore(self, args: Namespace, caller: Caller) -> int:
        secret = self.secrets.save(self.secrets.find(args.n).restored(), caller.actor)
        print(f"secret {secret.id} restored")
        return 0
