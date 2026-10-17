from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.features.secrets.programs import Programs
from journal.models.author import Author
from journal.models.message import Message
from journal.models.secret import Secret
from journal.models.secret_kind import SecretKind
from journal.refused import Refused
from journal.repositories.mcp_servers import McpServers
from journal.repositories.messages import Messages
from journal.repositories.secrets import Secrets
from journal.secret_values import SecretValues


class SecretCommand(Command):
    """The project's secrets, by number: made, asked for, changed, listed, shown and deleted. None takes a value: the user fills a value on the Secrets page."""

    noun = "secret"

    def __init__(self, secrets: Secrets, values: SecretValues, messages: Messages, servers: McpServers) -> None:
        self.secrets, self.values, self.messages, self.servers = secrets, values, messages, servers

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "a secret with its fields, empty until the user fills them")
        create.add_argument("title")
        create.add_argument("--brief", default="", help="how it is used: the commands it runs with")
        create.add_argument("--kind", default=SecretKind.CUSTOM.value)
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
        self.verb(verbs, "list", "every secret, with what it waits for")
        self.verb(verbs, "show", "a secret's fields, which are filled and the programs it may be given to").add_argument("n", type=int)
        self.verb(verbs, "where", "the file the values live in, outside the project")
        self.verb(verbs, "delete", "a secret put away; its values are kept thirty days for a restore").add_argument("n", type=int)
        self.verb(verbs, "restore", "a deleted secret back, with its values").add_argument("n", type=int)

    def create(self, args: Namespace, where: Where) -> int:
        secret = self.made(args.title, args.brief, SecretKind.named(args.kind), where)
        proposed = f"; proposed for the user to allow: {', '.join(secret.proposed)}" if secret.proposed else ""
        print(f"secret {secret.id} made: {secret.title}, waiting for the user to fill {', '.join(f['name'] for f in secret.fields) or 'its fields'} on the Secrets page{proposed}")
        return 0

    def request(self, args: Namespace, where: Where) -> int:
        reaching = [s.name for s in self.servers.all() if args.title.lower() in (s.name.lower(), s.title.lower())]
        if reaching:
            raise Refused(f"{args.title} is reached through the MCP server {', '.join(reaching)} already: use its tools, and if they cannot do what you need, say what is missing in the chat")
        secret = self.secrets.save(self.made(args.title, "", SecretKind.named(args.kind), where).with_(url=args.url, asked_at=datetime.now(timezone.utc)), where.actor)
        self.messages.save(Message(author=Author.AGENT, text=f"Please fill in the secret {secret.title} on the Secrets page, never in the chat: I need it {args.why}.\n\nsecret {secret.id}"), where.actor)
        print(f"secret {secret.id} asked for: the user fills it on the Secrets page")
        return 0

    def made(self, title: str, brief: str, kind: SecretKind, where: Where) -> Secret:
        return self.secrets.save(Secret(title=title, brief=brief, kind=kind, fields=kind.first_fields(title), proposed=Programs.named_in(brief)), where.actor)

    def update(self, args: Namespace, where: Where) -> int:
        secret = self.secrets.find(args.n)
        secret = self.secrets.save(secret.with_(title=args.title or secret.title, brief=args.brief or secret.brief), where.actor)
        print(f"secret {secret.id} updated: {secret.title}")
        return 0

    def fill(self, args: Namespace, where: Where) -> int:
        raise Refused("a secret's value is filled by the user on the Secrets page, never by a command: ask for it with `journal secret request`")

    def list(self, args: Namespace, where: Where) -> int:
        for s in self.secrets.live():
            print(f"{s.id:>4}  {s.kind:<13} {s.title}" + ("  waiting for the user" if s.waiting() else "") + (f"  given to {', '.join(s.programs)}" if s.programs else ""))
        return 0

    def show(self, args: Namespace, where: Where) -> int:
        s = self.secrets.find(args.n)
        print(f"secret {s.id}: {s.title} ({s.kind})" + (", deleted" if s.deleted_at else ""))
        if s.brief:
            print(s.brief)
        for raw in s.fields:
            print(f"  {raw['name']:<10} {raw['variable']:<24} {'filled' if raw['name'] in s.filled else 'waiting for the user'}{', hidden' if raw.get('hidden', True) else ''}")
        print(f"  given to: {', '.join(s.programs) or 'no program yet'}" + (f"; proposed: {', '.join(s.proposed)}" if s.proposed else ""))
        return 0

    def where(self, args: Namespace, where: Where) -> int:
        print(self.values.path)
        return 0

    def delete(self, args: Namespace, where: Where) -> int:
        secret = self.secrets.save(self.secrets.find(args.n).deleted(datetime.now(timezone.utc)), where.actor)
        print(f"secret {secret.id} deleted; its values are kept thirty days, journal secret restore {secret.id} brings it back")
        return 0

    def restore(self, args: Namespace, where: Where) -> int:
        secret = self.secrets.save(self.secrets.find(args.n).restored(), where.actor)
        print(f"secret {secret.id} restored")
        return 0
