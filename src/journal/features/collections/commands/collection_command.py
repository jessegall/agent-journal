import re
from argparse import Namespace

from journal.console.command import Command
from journal.models.collection import Collection
from journal.models.support.ref import Ref
from journal.repositories.collections import Collections
from journal.repositories.rows import Rows
from journal.support.caller import Caller
from journal.support.rejection import Rejection

ROW = re.compile(r"^[a-z_]+:\d+$")


class CollectionCommand(Command):
    """journal collection: named collections of rows that belong together, of any type; a row can sit in several."""

    noun = "collection"

    def __init__(self, collections: Collections, rows: Rows) -> None:
        self.collections, self.rows = collections, rows

    def arguments(self, verbs) -> None:
        creation = self.verb(verbs, "create", "make a collection named for what belongs in it")
        creation.add_argument("title")
        creation.add_argument("--abstract", default="", help="what belongs in it, in one line")
        addition = self.verb(verbs, "add", "put rows of any type in a collection, each as table:id, such as docs:41 or tasks:785")
        addition.add_argument("n", type=int)
        addition.add_argument("refs", nargs="+")
        removal = self.verb(verbs, "remove", "take a row out of a collection")
        removal.add_argument("n", type=int)
        removal.add_argument("ref")
        self.verb(verbs, "members", "the rows in a collection").add_argument("n", type=int)
        self.verb(verbs, "list", "every collection here, with how many rows each holds")
        title_change = self.verb(verbs, "rename", "name a collection again")
        title_change.add_argument("n", type=int)
        title_change.add_argument("title")

    def create(self, args: Namespace, caller: Caller) -> int:
        collection = self.collections.save(Collection(title=args.title, abstract=args.abstract), caller.actor)
        print(f"collection {collection.id}: {collection.title}")
        return 0

    def add(self, args: Namespace, caller: Caller) -> int:
        collection, refs = self.collections.find(args.n), [self.row(text) for word in args.refs for text in word.split(",") if text.strip()]
        for ref in refs:
            self.collections.joined(collection, ref, caller.actor)
        print(f"collection {collection.id} holds {', '.join(map(str, refs))}")
        return 0

    def remove(self, args: Namespace, caller: Caller) -> int:
        collection, ref = self.collections.find(args.n), Ref.parse(args.ref)
        self.collections.parted(collection, ref, caller.actor)
        print(f"{ref} is out of collection {collection.id}")
        return 0

    def members(self, args: Namespace, caller: Caller) -> int:
        collection = self.collections.find(args.n)
        print(f"collection {collection.id}: {collection.title}")
        for ref in self.collections.members(collection):
            print(f"  {ref}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for collection in self.collections.scoped():
            print(f"{collection.id:>4}  {collection.title}  ({len(self.collections.members(collection))} rows)")
        return 0

    def rename(self, args: Namespace, caller: Caller) -> int:
        collection = self.collections.save(self.collections.find(args.n).with_(title=args.title), caller.actor)
        print(f"collection {collection.id} is now: {collection.title}")
        return 0

    def row(self, text: str) -> Ref:
        if not ROW.match(text.strip()) or not self.rows.is_row(Ref.parse(text.strip())):
            raise Rejection(f"not a row here: {text.strip()}; write each as table:id, such as docs:41")
        return Ref.parse(text.strip())
