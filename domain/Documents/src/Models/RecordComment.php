<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\CommentCard;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Support\CommentAnchor;
use Domain\Documents\Support\MarkdownText;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A user's comment on a document or a report, in general or on an exact quote of one revision. It is written once.
 *
 * @property string $id
 * @property string $parent_type
 * @property string $parent_id
 * @property ActorType $author_type
 * @property string $author_id
 * @property string $body
 * @property int|null $revision_number
 * @property string|null $quote
 * @property CarbonImmutable|null $created_at
 */
#[Fillable(['body', 'revision_number', 'quote', 'first_line', 'last_line', 'start_offset', 'end_offset'])]
final class RecordComment extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'documents.comment';

    protected function casts(): array
    {
        return [
            'author_type' => ActorType::class,
            'revision_number' => 'integer',
            'first_line' => 'integer',
            'last_line' => 'integer',
            'start_offset' => 'integer',
            'end_offset' => 'integer',
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * Writes a comment on a record by its link type and id; the author is the acting user, never an input.
     */
    public static function post(string $parentType, string $parentId, Actor $author, string $body, CommentAnchor|null $anchor): self
    {
        $comment = new self([
            'body' => $body,
            'revision_number' => $anchor?->revisionNumber,
            'quote' => $anchor?->quote,
            'first_line' => $anchor?->firstLine,
            'last_line' => $anchor?->lastLine,
            'start_offset' => $anchor?->startOffset,
            'end_offset' => $anchor?->endOffset,
        ]);
        $comment->parent_type = $parentType;
        $comment->parent_id = $parentId;
        $comment->author_type = $author->actorType();
        $comment->author_id = $author->actorId();
        $comment->save();

        return $comment;
    }

    /**
     * The comments on one record, oldest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onRecord(Builder $query, string $type, string $id): void
    {
        $query->where('parent_type', $type)->where('parent_id', $id)->orderBy('created_at')->orderBy('id');
    }

    public function card(): CommentCard
    {
        return CommentCard::from([
            'id' => $this->id,
            'authorId' => $this->author_id,
            'body' => $this->body,
            'bodyHtml' => MarkdownText::safeHtmlOf($this->body),
            'createdAt' => (string) $this->created_at?->toIso8601String(),
            'revision' => $this->revision_number === null ? null : (string) $this->revision_number,
            'quote' => $this->quote,
        ]);
    }

    protected static function booted(): void
    {
        self::updating(function (self $comment): void {
            throw RecordImmutable::for('comment');
        });
    }
}
