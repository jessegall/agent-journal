# Comments and record text

Core lets any record take comments, and lets a record with text in versions be read and commented on at an exact
place. Domains opt in on their model; everything else is Core.

## Two opt-ins

- **Comments about the whole record.** The model implements `App\Contracts\Records\Commentable` and uses
  `App\Concerns\HasComments`. Nothing else is needed. The Notes fixture's `Note` is the example.
- **Comments about a place in the text too.** The model also implements `App\Contracts\Reads\TextContent`:
  `textVersion(?string $version): TextVersion` returns the named version (or the current one) and refuses an
  unknown one with `TextVersionUnavailable`. Documents (each closed revision is a version) and reports (version 1 only)
  do this, and so does the Notes fixture's `NotePage`. A record with only `TextContent` can be read but takes no
  comments (`NoteSnapshot`).

A text comment points at a section, a span of lines or an exact quote with UTF-8 byte offsets, always in one version.
It keeps pointing there after newer versions; nothing is searched for again.

## Commands

```
journal comment post "note 1" --body "Is this still open?"
journal comment post "doc 12" --body "Why?" --at-revision 4 --lines 12-16
journal comment post "doc 12" --body "Which part?" --at-revision 4 --section 3
journal comment post "doc 12" --body "This word" --at-revision 4 --lines 12-12 --quote "the plan" --start-offset 5 --end-offset 13
journal comment list "doc 12" [--after <nextAfter>]
journal comment location "doc 12" <comment id> [--lines 20-40]

journal text version "doc 12" [--at-revision 4]
journal text sections "doc 12" --at-revision 4 [--after-section 0]
journal text read "doc 12" --at-revision 4 --lines 12-30 | --section 3
```

No place flag means a comment on the whole record; a mixed or partial set of place flags is refused. A post prints
its submission key: a retry with the same key returns the first comment instead of a second one. Text flags on a
record without text are refused, and so is `--lines` when locating a whole-record comment. `journal doc comments` and
`journal report comments` remain thin readers over the same list.

## The public contract exception

`HasComments::comments()` is the one public member allowed to name the private `App\Models\Records\Comment` model,
as the relation it returns (`tests/Architecture/Support/PublicContracts.php`). Domains read comments only through
`CommentReader` and post them only through `PostComment` and `PostTextComment`.

## Events

`CommentPosted` carries the comment id and its record, never its text. It is dispatched once, after the comment's
transaction commits; there is no outbox or retry. A listener that fails is logged with the comment id and the
listener's failure class only, and never turns the committed comment into an error.
