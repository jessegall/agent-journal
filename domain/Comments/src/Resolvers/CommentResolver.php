<?php

declare(strict_types=1);

namespace Domain\Comments\Resolvers;

use App\Data\Pages\RecordCard;
use App\Exceptions\TargetHasNoText;
use App\Reads\Contracts\TextContent;
use App\Records\Contracts\Commentable;
use App\Records\Contracts\RecordResolver;
use App\Support\IdListPage;
use App\Support\MarkdownText;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use App\Support\TextSelection;
use Domain\Comments\Contracts\CommentResolver as CommentResolverContract;
use Domain\Comments\Data\CommentList;
use Domain\Comments\Data\RecordCommentLocation;
use Domain\Comments\Data\RecordCommentView;
use Domain\Comments\Data\TextCommentLocation;
use Domain\Comments\Data\TextCommentView;
use Domain\Comments\Exceptions\CommentUnavailable;
use Domain\Comments\Exceptions\TargetNotCommentable;
use Domain\Comments\Models\Comment;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads comments only through their record: the record is authorized first, then only its own comments are read. A
 * list never loads the record's text; a location loads it only for a text comment.
 */
final readonly class CommentResolver implements CommentResolverContract
{
    public function __construct(private RecordResolver $records) {}

    public function list(RecordIdentity $target, IdListPage $page): CommentList
    {
        $record = $this->commentable($target);
        $card = $this->records->card($target);

        $comments = self::commentsOf($record)
            ->when($page->afterId !== null, fn ($query) => $query->where('id', '>', $page->afterId))
            ->readExactly($page->limit + 1)
            ->get();

        $shown = $comments->take($page->limit);

        return CommentList::from([
            'items' => array_values($shown->map(fn (Comment $comment) => self::viewOf($card, $comment))->all()),
            'nextAfter' => $comments->count() > $page->limit ? $shown->last()?->id : null,
        ]);
    }

    public function commentAddress(): string
    {
        return route('comments.post', absolute: false);
    }

    public function location(
        RecordIdentity $target,
        string $commentId,
        TextSelection $selection = new TextSelection(),
    ): RecordCommentLocation|TextCommentLocation {
        $record = $this->commentable($target);

        $comment = self::commentsOf($record)->whereKey($commentId)->firstOr(
            CommentUnavailable::throwing()->for($commentId),
        );

        $card = $this->records->card($target);

        if ($comment->anchor === null) {
            if ($selection->isOutlineOnly()) {
                return new RecordCommentLocation($card);
            }

            throw CommentUnavailable::selectionOnWholeRecord($commentId);
        }

        $anchor = $comment->anchor->text();

        $text = $record instanceof TextContent ? $record->textVersion(
            $anchor->versionId,
        ) : throw TargetHasNoText::for($target->type);

        $chosen = $selection->isOutlineOnly() ? TextSelection::from([
            'firstLine' => $anchor->firstLine,
            'lastLine' => $anchor->lastLine,
        ]) : $selection;

        return new TextCommentLocation($card, $anchor, MarkdownText::body($text->text)->part($chosen));
    }

    /**
     * The comments on one record, oldest first.
     *
     * @return ReadBuilder<Comment>
     */
    private static function commentsOf(Model $record): ReadBuilder
    {
        return Comment::query()->onTarget($record->getMorphClass(), (string) $record->getKey())->with('anchor');
    }

    private function commentable(RecordIdentity $target): Model&Commentable
    {
        $record = $this->records->requireReadable($target);

        if ($record instanceof Commentable) {
            return $record;
        }

        throw TargetNotCommentable::for($target->type);
    }

    private static function viewOf(RecordCard $card, Comment $comment): RecordCommentView|TextCommentView
    {
        if ($comment->anchor === null) {
            return new RecordCommentView($card, $comment->details);
        }

        return new TextCommentView($card, $comment->details, $comment->anchor->text());
    }
}
