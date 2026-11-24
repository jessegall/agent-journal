<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Reads\TextContent;
use App\Contracts\Records\Commentable;
use App\Contracts\Records\CommentResolver;
use App\Contracts\Records\RecordResolver;
use App\Data\Comments\CommentList;
use App\Data\Comments\RecordCommentLocation;
use App\Data\Comments\RecordCommentView;
use App\Data\Comments\TextCommentLocation;
use App\Data\Comments\TextCommentView;
use App\Data\Pages\RecordCard;
use App\Enums\WholeRecord;
use App\Exceptions\CommentUnavailable;
use App\Exceptions\TargetHasNoText;
use App\Exceptions\TargetNotCommentable;
use App\Models\Records\Comment;
use App\Support\IdListPage;
use App\Support\MarkdownText;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use App\Support\TextSelection;
use App\Values\TextAnchor;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads comments only through their record: the record is authorized first, then only its own comments are read. A
 * list never loads the record's text; a location loads it only for a text comment.
 */
final readonly class CommentRecords implements CommentResolver
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

    public function location(
        RecordIdentity $target,
        string $commentId,
        TextSelection $selection = new TextSelection(),
    ): RecordCommentLocation|TextCommentLocation {
        $record = $this->commentable($target);

        $comment = self::commentsOf($record)->whereKey($commentId)->firstOr(
            fn () => throw CommentUnavailable::for($commentId),
        );

        $subject = $comment->subject();
        $card = $this->records->card($target);

        if ($subject instanceof WholeRecord) {
            if ($selection->isOutlineOnly()) {
                return new RecordCommentLocation($card);
            }

            throw CommentUnavailable::selectionOnWholeRecord($commentId);
        }

        $text = $record instanceof TextContent ? $record->textVersion(
            $subject->versionId,
        ) : throw TargetHasNoText::for($target->type);

        $chosen = $selection->isOutlineOnly() ? TextSelection::from([
            'firstLine' => $subject->firstLine,
            'lastLine' => $subject->lastLine,
        ]) : $selection;

        return new TextCommentLocation($card, $subject, MarkdownText::body($text->text)->part($chosen));
    }

    /**
     * The comments on one record, oldest first.
     *
     * @return ReadBuilder<Comment>
     */
    private static function commentsOf(Model $record): ReadBuilder
    {
        return Comment::query()->onTarget($record->getMorphClass(), (string) $record->getKey());
    }

    /**
     * @return Model&Commentable
     */
    private function commentable(RecordIdentity $target): Model
    {
        $record = $this->records->requireReadable($target);

        if ($record instanceof Commentable) {
            return $record;
        }

        throw TargetNotCommentable::for($target->type);
    }

    private static function viewOf(RecordCard $card, Comment $comment): RecordCommentView|TextCommentView
    {
        $subject = $comment->subject();

        if ($subject instanceof TextAnchor) {
            return new TextCommentView($card, $comment->details, $subject);
        }

        return new RecordCommentView($card, $comment->details);
    }
}
