from argparse import Namespace
from pathlib import Path

from journal.console.command import Command
from journal.support.where import Where
from journal.support.outline import Outline
from journal.features.docs.support.version3_doc import Version3Doc
from journal.models.doc import Doc
from journal.support.refused import Refused
from journal.repositories.docs import Docs


class DocCommand(Command):
    noun = "doc"

    def __init__(self, docs: Docs) -> None:
        self.docs = docs

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "write a document of the project, the same in every environment")
        create.add_argument("title")
        create.add_argument("--file", required=True, help="a markdown file holding its text; ## headings are its sections")
        create.add_argument("--abstract", default="", help="one line that says what it is")
        update = self.verb(verbs, "update", "write a document's text anew from a markdown file, its title kept")
        update.add_argument("n", type=int)
        update.add_argument("--file", required=True, help="a markdown file holding its whole new text; ## headings are its sections")
        update.add_argument("--abstract", default=None, help="a new one line that says what it is")
        show = self.verb(verbs, "show", "a document: its outline, then one section at a time")
        show.add_argument("n", type=int)
        Outline.arguments(show)
        self.verb(verbs, "list", "every document of the project")
        imported = self.verb(verbs, "import", "bring in the documents version 3 kept, each folder's doc.md; one titled as a document here already is left")
        imported.add_argument("folder", help="version 3's project/doc folder")

    def create(self, args: Namespace, where: Where) -> int:
        doc = self.docs.save(Doc(title=args.title, abstract=args.abstract, body=Path(args.file).read_text()), where.actor)
        print(f"doc {doc.id}: {doc.title}")
        return 0

    def update(self, args: Namespace, where: Where) -> int:
        standing = self.docs.find(args.n)
        doc = self.docs.save(standing.with_(body=Path(args.file).read_text(), abstract=standing.abstract if args.abstract is None else args.abstract), where.actor)
        print(f"doc {doc.id} written anew: {doc.title}")
        return 0

    def show(self, args: Namespace, where: Where) -> int:
        doc = self.docs.find(args.n)
        print("\n".join([*filter(None, (f"doc {doc.id}: {doc.title}", doc.abstract)), *Outline.of(doc.body).told(args)]))
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for doc in self.docs.all():
            print(f"{doc.id:>4}  {doc.title}")
        return 0

    def import_(self, args: Namespace, where: Where) -> int:
        folder = Path(args.folder).expanduser()
        if not folder.is_dir():
            raise Refused(f"no such folder: {folder}")
        found = [doc for doc in map(Version3Doc.read, sorted(p for p in folder.iterdir() if p.is_dir())) if doc]
        new = [doc for doc in found if not self.docs.titled(doc.title)]
        for doc in new:
            self.docs.save(doc, where.actor)
        print(f"{len(new)} documents brought in, {len(found) - len(new)} already here")
        return 0
