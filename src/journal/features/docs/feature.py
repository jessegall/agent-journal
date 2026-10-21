from journal.features.docs.commands.doc_command import DocCommand
from journal.features.docs.listeners.document_card import DocumentCard
from journal.features.feature import Feature
from journal.support.skill import Skill


class DocsFeature(Feature):
    name = "docs"
    title = "Documents"
    help = "What the project keeps knowing: documents shared by every environment, listed on the Documents page."
    commands = (DocCommand,)
    listeners = (DocumentCard,)

    skill = Skill("docs", "Keep lasting knowledge of the project in a document; load it when something should still be known next month", """
# Documents

A document holds what the project keeps knowing; what was checked now goes in a report, ordered work in a plan.
Documents are the project's, the same in every environment.

- `journal doc create "<title>" --file <path> --abstract "<one line>"` writes one from a markdown file, its `##` headings
  as sections. `journal doc update <n> --file <path>` writes its whole text anew, its title kept.
- `journal doc show <n>` prints its outline, numbered headings with their length; read one section with
  `--section <n or heading>` (`--bullets` for its bullets alone), or find lines with `--grep "<words>"`. Read it whole with
  `--all` only when every section matters to the job; the outline and one section are the default. `journal doc list` names them.
- `journal doc import <folder>` brings in the documents version 3 kept, each folder's doc.md.
""", keywords=("doc", "docs", "document", "documents"))
