# Documents and reports

The Documents domain (`domain/Documents`) keeps two kinds of shared records.

- A **document** is lasting knowledge that changes over time, such as a design or a spec. Its text is kept as
  **revisions**: revision 1 when it is created, and one more each time a changed draft is closed.
- A **report** says what was checked or found at one moment, such as a review or a trace. It is filed once and its
  text never changes.

Both are published to every signed-in user and agent of the journal. A record they link to keeps its own privacy.

## Numbers

Documents and reports have numbers of their own: `doc 4`, `report 7`. A revision is numbered within its document:
revision 2 of doc 4. Commands, pages and links all name records by these numbers.

## Editing a document

A document is edited in a **draft**. Each document has at most one open draft, and each editor holds at most one
draft at a time.

| Step | Command | What happens |
|---|---|---|
| Open | `doc:open 4` | Starts a draft from the current revision, at version 1. Opening it again in the same session gives the same draft. |
| Edit | `doc:edit 4` | Saves the next version: the whole body (`--body`, `--body -`, `--file`), one section (`--section <number or heading>`), one exact piece (`--replace` with `--with`), or the title and abstract. |
| Read the draft | `doc:show 4 --draft` | Shows your own draft; nobody else sees its text. |
| Close | `doc:close 4` | Publishes the draft as the next revision when its text changed, and adds no revision when it did not. |

Every edit names the version it was made on. A save on an older version is refused and the newer text stays; read
the draft again and repeat the edit.

A draft also closes in two other ways:

- **Recovery**: a user closes someone else's abandoned draft from the document page, at the version shown, with a
  reason. The new revision keeps the draft's author; the close records the user and the reason.
- **Session end**: when an agent's session ends, its draft closes inside the same transaction. A changed draft becomes
  the next revision under that agent.

## Reading

- `doc:show 4` and `report:show 7` print the outline with each section's line span.
- `--section`, `--lines a-b`, `--bullets`, `--grep` and `--all` read a part. A part longer than 200 lines or 16 KiB is
  cut, and the output gives the exact command that reads on.
- `doc:revisions 4` lists the revisions and `doc:revision 4 1` prints one in full, marked historical when a later one
  exists.
- `doc:list --query` and `report:list --query` search titles, abstracts and text for the literal words, ignoring case.
  Only the current revision is searched unless `--revisions` is given, and drafts are never searched.

## Settling

A record that needs no more attention is **settled** with a reason: `doc:settle 4 --why "<reason>"` or
`report:settle 7 --why "<reason>"`. A user may settle any record, an agent only the records it created. A document
with an open draft must be closed first. Settling again with the same reason changes nothing; another reason is
refused.

When a changed revision of a settled document is published, the document asks for attention again. Its earlier
settlements stay in its history, which `doc:inspect 4` and `report:inspect 7` show together with who is editing it,
how its drafts ended and its links.

## Comments

Users comment on documents and reports from their pages, in general or on the exact text they selected in one
revision. The server checks that the quote is the text of that revision. Agents cannot comment; they read comments
with `doc:comments 4` and `report:comments 7`. A comment on a quote opens that revision with the quote highlighted.

## Links

Links are explicit; mentioning a record in the text links nothing.

- `link:add "report 7" "plan 3"` and `link:remove "report 7" "plan 3"` link any two records whose owners registered a
  record provider. You must be allowed to change the first and read the second.
- `doc:make` and `report:make` take `--about "task 12"`, repeatable up to 50 times. The links are written in the same
  transaction as the record, so an unreadable target creates nothing.
- A page lists only the links its reader may see; a hidden link leaves no trace.

Another domain makes its records linkable by implementing `ProvidesLinkRecords` on its domain class. That method
returns its link alias with a provider class implementing `App\Records\Contracts\RecordProvider`. Most providers use
the `App\Records\Support\ProvidesModelRecords` trait and supply four things:

- the query of the records the actor may read;
- the card of one record;
- whether the actor may change it;
- the word people name it by, such as `task`.

## Dock cards

A document or report can be docked as a card in an agent session's chat. A record an agent creates is docked in its
own running session. A user docks a record into any running session from its page; an agent only into its own.
Docking again shows the same card, and hiding a card leaves the record and its links alone. A settled record leaves
the dock until a changed revision makes it active.

## Limits

| What | Limit |
|---|---|
| Title | 200 characters, one line |
| Abstract | 500 characters, one line |
| Body | 1 MiB of UTF-8 Markdown, every code fence closed |
| Comment | 16 KiB |
| Settlement reason | 2,000 characters |
| Links written at once | 50 |
| One read part | 200 lines or 16 KiB |
| A list page | 50 rows, up to 100 |

## Differences from version 5

- **Drafts are separate rows.** A closed revision never changes. In version 5 an open document was edited in place.
- **Reports never change.** A correction is a new report linked to the original; `report:edit` explains this and
  changes nothing.
- **Links are explicit only.** Nothing is linked because a number appears in the text.
- **No version 5 data is imported.**
- **Some version 5 features are not part of version 6:** attachments, templates, an approval flow and several people
  typing in one document at once.
