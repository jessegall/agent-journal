<?php

declare(strict_types=1);

namespace App\Comments\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Comments\Data\CommentDetails;
use App\Comments\Enums\WholeRecord;
use App\Comments\Exceptions\CommentAnchorCorrupt;
use App\Comments\Exceptions\CommentImmutable;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Support\ShareRelationSet;
use App\Text\Exceptions\IncompleteTextAnchor;
use App\Text\Support\MarkdownText;
use App\Text\Values\TextAnchor;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A comment any actor left on a record: about the whole record, or about an exact place in one version of its text.
 * It is written once and never changed.
 *
 * @property string $id
 * @property string $target_type
 * @property string $target_id
 * @property ActorType $author_type
 * @property string $author_id
 * @property string|null $author_session_id
 * @property string $body
 * @property string|null $version_id
 * @property string|null $version_label
 * @property string|null $anchor_type
 * @property int|null $section_number
 * @property int|null $first_line
 * @property int|null $last_line
 * @property string|null $quote
 * @property int|null $start_offset
 * @property int|null $end_offset
 * @property string $submission_key
 * @property string $submission_hash
 * @property CarbonImmutable|null $created_at
 */
#[Fillable(['body', 'submission_key', 'submission_hash'])]
final class Comment extends Model implements ReadableModel, Shareable
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.comment';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'author_type' => ActorType::class,
            'section_number' => 'integer',
            'first_line' => 'integer',
            'last_line' => 'integer',
            'start_offset' => 'integer',
            'end_offset' => 'integer',
            'created_at' => 'immutable_datetime',
        ];
    }

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * A comment reaches no other record; it is shared only through its parent.
     */
    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::none();
    }

    /**
     * A comment about the whole record.
     */
    public static function postOnRecord(Model $target, ActorIdentity $author, string|null $sessionId, string $body, string $key, string $hash): self
    {
        $comment = self::draft($target, $author, $sessionId, $body, $key, $hash);
        $comment->save();

        return $comment;
    }

    /**
     * A comment about an exact place in one version of the record's text.
     */
    public static function postOnText(Model $target, ActorIdentity $author, string|null $sessionId, string $body, TextAnchor $anchor, string $key, string $hash): self
    {
        $comment = self::draft($target, $author, $sessionId, $body, $key, $hash);
        $comment->version_id = $anchor->versionId;
        $comment->version_label = $anchor->versionLabel;
        $comment->anchor_type = $anchor->type->value;
        $comment->section_number = $anchor->sectionNumber === 0 ? null : $anchor->sectionNumber;
        $comment->first_line = $anchor->firstLine;
        $comment->last_line = $anchor->lastLine;
        $comment->quote = $anchor->quote === '' ? null : $anchor->quote;
        $comment->start_offset = $anchor->quote === '' ? null : $anchor->startOffset;
        $comment->end_offset = $anchor->quote === '' ? null : $anchor->endOffset;
        $comment->save();

        return $comment;
    }

    /**
     * What the comment is about: the whole record when no anchor column is set, otherwise the complete anchor.
     *
     * @throws CommentAnchorCorrupt when only some anchor columns are set
     */
    public function subject(): WholeRecord|TextAnchor
    {
        $columns = [$this->version_id, $this->version_label, $this->anchor_type, $this->section_number, $this->first_line, $this->last_line, $this->quote, $this->start_offset, $this->end_offset];

        if (array_filter($columns, fn (mixed $column) => $column !== null) === []) {
            return WholeRecord::Record;
        }

        try {
            return TextAnchor::stored([
                'versionId' => $this->version_id,
                'versionLabel' => $this->version_label,
                'type' => $this->anchor_type,
                'sectionNumber' => $this->section_number,
                'firstLine' => $this->first_line,
                'lastLine' => $this->last_line,
                'quote' => $this->quote,
                'startOffset' => $this->start_offset,
                'endOffset' => $this->end_offset,
            ]);
        } catch (IncompleteTextAnchor $broken) {
            throw CommentAnchorCorrupt::for($this->id, $broken->getMessage());
        }
    }

    /**
     * The record the comment is on.
     */
    public function target(): RecordIdentity
    {
        return new RecordIdentity($this->target_type, $this->target_id);
    }

    /**
     * What the comment is about, in a few words: the whole record, or the version and lines of its text.
     */
    public function placeLabel(): string
    {
        $subject = $this->subject();

        return $subject instanceof TextAnchor ? "on {$subject->versionLabel}, lines {$subject->firstLine}-{$subject->lastLine}" : 'on the whole record';
    }

    /**
     * The comment as it is shown, its text also as safe HTML.
     */
    public function details(): CommentDetails
    {
        return new CommentDetails($this->id, $this->author_type, $this->author_id, (string) $this->created_at?->toIso8601String(), $this->body, MarkdownText::safeHtmlOf($this->body));
    }

    /**
     * The comments on one record, oldest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onTarget(Builder $query, string $type, string $id): void
    {
        $query->where('target_type', $type)->where('target_id', $id)->orderBy('id');
    }

    /**
     * The comment an author left in one session under one submission key.
     *
     * @param  Builder<self>  $query
     */
    /**
     * The comments on one record, oldest first by written time and then id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function publiclyOrderedOn(Builder $query, string $type, string $id): void
    {
        $query->where('target_type', $type)->where('target_id', $id)->orderBy('created_at')->orderBy('id');
    }

    /**
     * The comments written after this position, by written time and then id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function writtenAfter(Builder $query, CarbonImmutable $writtenAt, string $id): void
    {
        $query->where(fn (Builder $later) => $later
            ->where('created_at', '>', $writtenAt)
            ->orWhere(fn (Builder $same) => $same->where('created_at', $writtenAt)->where('id', '>', $id)));
    }

    /**
     * The columns a public page shows: the id, written time and quote, and the body cut to its first characters by
     * the database, so a long body is never loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function excerpts(Builder $query, int $characters): void
    {
        $query->select(['id', 'created_at', 'quote'])->selectRaw('left(body, ?) as excerpt', [$characters]);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function submittedAs(Builder $query, ActorIdentity $author, string|null $sessionId, string $key): void
    {
        $query->where('author_type', $author->type->value)->where('author_id', $author->id)->where('author_session_id', $sessionId)->where('submission_key', $key);
    }

    protected static function booted(): void
    {
        self::updating(function (self $comment): void {
            throw CommentImmutable::for($comment->id);
        });
    }

    private static function draft(Model $target, ActorIdentity $author, string|null $sessionId, string $body, string $key, string $hash): self
    {
        $comment = new self(['body' => $body, 'submission_key' => $key, 'submission_hash' => $hash]);
        $comment->target_type = $target->getMorphClass();
        $comment->target_id = (string) $target->getKey();
        $comment->author_type = $author->type;
        $comment->author_id = $author->id;
        $comment->author_session_id = $sessionId;

        return $comment;
    }
}
