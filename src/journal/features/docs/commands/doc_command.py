from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.support.caller import Caller
from journal.support.outline import Outline
from journal.features.docs.support.version3_doc import Version3Doc
from journal.models.doc import Doc
from journal.support.rejection import Rejection
from journal.repositories.docs import Docs


class DocCommand(Command):
    noun = "doc"

    def __init__(self, docs: Docs) -> None:
        self.docs = docs

    def arguments(self, verbs) -> None:
        creation = self.verb(verbs, "create", "write a document of the project, the same in every environment")
        creation.add_argument("title")
        creation.add_argument("--file", required=True, help="a markdown file holding its text; ## headings are its sections")
        creation.add_argument("--abstract", default="", help="one line that says what it is")
        update = self.verb(verbs, "update", "write a document's text anew from a markdown file, its title kept")
        update.add_argument("n", type=int)
        update.add_argument("--file", required=True, help="a markdown file holding its whole new text; ## headings are its sections")
        update.add_argument("--abstract", default=None, help="a new one line that says what it is")
        display = self.verb(verbs, "show", "a document: its outline, then one section at a time")
        display.add_argument("n", type=int)
        Outline.arguments(display)
        self.verb(verbs, "list", "every document of the project")
        imported = self.verb(verbs, "import", "bring in the documents version 3 kept, each folder's doc.md; one titled as a document here already is left")
        imported.add_argument("folder", help="version 3's project/doc folder")

    def create(self, args: Namespace, caller: Caller) -> int:
        doc = self.docs.save(Doc(title=args.title, abstract=args.abstract, body=Path(args.file).read_text()), caller.actor)
        print(f"doc {doc.id}: {doc.title}")
        return 0

    def update(self, args: Namespace, caller: Caller) -> int:
        data = self.docs.find(args.n)
        doc = self.docs.save(data.with_(body=Path(args.file).read_text(), abstract=data.abstract if args.abstract is None else args.abstract), caller.actor)
        print(f"doc {doc.id} written anew: {doc.title}")
        return 0

    def show(self, args: Namespace, caller: Caller) -> int:
        doc = self.docs.find(args.n)
        print("\n".join([*filter(None, (f"doc {doc.id}: {doc.title}", doc.abstract)), *Outline.build(doc.body).summary(args)]))
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for doc in self.docs.all():
            print(f"{doc.id:>4}  {doc.title}")
        return 0

    def import_(self, args: Namespace, caller: Caller) -> int:
        folder = Path(args.folder).expanduser()
        if not folder.is_dir():
            raise Rejection(f"no such folder: {folder}")
        rows = [doc for doc in map(Version3Doc.read, sorted(p for p in folder.iterdir() if p.is_dir())) if doc]
        new = [doc for doc in rows if not self.docs.titled(doc.title)]
        for doc in new:
            self.docs.save(doc, caller.actor)
        print(f"{len(new)} documents brought in, {len(rows) - len(new)} already here")
        return 0
