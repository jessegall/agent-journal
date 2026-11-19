<?php

declare(strict_types=1);

namespace App\Comments\Resolvers;

use App\Assignments\Support\Page;
use App\Comments\Contracts\Commentable;
use App\Comments\Contracts\CommentResolver;
use App\Comments\Data\CommentList;
use App\Comments\Data\RecordCommentLocation;
use App\Comments\Data\RecordCommentView;
use App\Comments\Data\TextCommentLocation;
use App\Comments\Data\TextCommentView;
use App\Comments\Enums\WholeRecord;
use App\Comments\Exceptions\CommentUnavailable;
use App\Comments\Exceptions\TargetNotCommentable;
use App\Comments\Models\Comment;
use App\Reads\Support\ReadBuilder;
use App\Records\Contracts\RecordResolver;
use App\Records\Data\RecordCard;
use App\Records\Support\RecordIdentity;
use App\Text\Contracts\TextContent;
use App\Text\Exceptions\TargetHasNoText;
use App\Text\Support\MarkdownText;
use App\Text\Support\TextSelection;
use App\Text\Values\TextAnchor;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads comments only through their record: the record is authorized first, then only its own comments are read. A
 * list never loads the record's text; a location loads it only for a text comment.
 */
final readonly class CommentRecords implements CommentResolver
{
    public function __construct(private RecordResolver $records) {}

    public function list(RecordIdentity $target, Page $page): CommentList
    {
        $record = $this->commentable($target);
        $card = $this->records->card($target);
        $comments = self::commentsOf($record)
            ->when($page->afterId !== null, fn ($query) => $query->where('id', '>', $page->afterId))
            ->readLimit($page->limit + 1)
            ->get();
        $shown = $comments->take($page->limit);

        return CommentList::from([
            'items' => array_values($shown->map(fn (Comment $comment) => self::viewOf($card, $comment))->all()),
            'nextAfter' => $comments->count() > $page->limit ? $shown->last()?->id : null,
        ]);
    }

    public function location(RecordIdentity $target, string $commentId, TextSelection $selection = new TextSelection()): RecordCommentLocation|TextCommentLocation
    {
        $record = $this->commentable($target);
        $comment = self::commentsOf($record)->whereKey($commentId)->first() ?? throw CommentUnavailable::for($commentId);
        $subject = $comment->subject();
        $card = $this->records->card($target);

        if ($subject instanceof WholeRecord) {
            return $selection->isOutlineOnly() ? new RecordCommentLocation($card) : throw CommentUnavailable::selectionOnWholeRecord($commentId);
        }

        $text = $record instanceof TextContent ? $record->textVersion($subject->versionId) : throw TargetHasNoText::for($target->type);
        $chosen = $selection->isOutlineOnly() ? new TextSelection(firstLine: $subject->firstLine, lastLine: $subject->lastLine) : $selection;

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

        return $record instanceof Commentable ? $record : throw TargetNotCommentable::for($target->type);
    }

    private static function viewOf(RecordCard $card, Comment $comment): RecordCommentView|TextCommentView
    {
        $subject = $comment->subject();

        return $subject instanceof TextAnchor
            ? new TextCommentView($card, $comment->details(), $subject)
            : new RecordCommentView($card, $comment->details());
    }
}
