<?php

declare(strict_types=1);

namespace Domain\Comments\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Sharing\Shareable;
use App\Enums\Records\TextAnchorType;
use App\Exceptions\IncompleteTextAnchor;
use App\Models\Support\Accessor;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Support\ShareRelationSet;
use App\Values\TextAnchor;
use Carbon\CarbonImmutable;
use Domain\Comments\Data\CommentDetails;
use Domain\Comments\Enums\WholeRecord;
use Domain\Comments\Events\CommentPosted;
use Domain\Comments\Exceptions\CommentAnchorCorrupt;
use Domain\Comments\Exceptions\CommentImmutable;
use Domain\Comments\Support\CommentDetailsFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property string $id
 * @property string $target_type
 * @property string $target_id
 * @property string $author_type
 * @property string $author_id
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
 * @property CarbonImmutable $created_at
 * @property-read mixed $details
 * @property-read mixed $place_label
 * @property-read mixed $target
 *
 * @mixin \Eloquent
 */
final class Comment extends Model implements EventSource, ReadableModel, Shareable
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'section_number' => 'integer',
            'first_line' => 'integer',
            'last_line' => 'integer',
            'start_offset' => 'integer',
            'end_offset' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $comment) => $comment->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * A comment about the whole record, or, with an anchor, about an exact place in one version of its text.
     */
    public static function create(
        Model $target,
        ActorReference $author,
        string $body,
        TextAnchor|null $anchor,
        string $key,
        string $hash,
    ): self {
        $comment = new self();
        $comment->body = $body;
        $comment->submission_key = $key;
        $comment->submission_hash = $hash;
        $comment->target_type = $target->getMorphClass();
        $comment->target_id = (string) $target->getKey();
        $comment->author_type = $author->type;
        $comment->author_id = $author->id;

        if ($anchor !== null) {
            $comment->version_id = $anchor->versionId;
            $comment->version_label = $anchor->versionLabel;
            $comment->anchor_type = $anchor->type->value;
            $comment->section_number = $anchor->sectionNumber === 0 ? null : $anchor->sectionNumber;
            $comment->first_line = $anchor->firstLine;
            $comment->last_line = $anchor->lastLine;
            $comment->quote = $anchor->quote === '' ? null : $anchor->quote;
            $comment->start_offset = $anchor->quote === '' ? null : $anchor->startOffset;
            $comment->end_offset = $anchor->quote === '' ? null : $anchor->endOffset;
        }

        $comment->assertSaved($comment->save());
        $comment->raise(new CommentPosted($comment->id, $comment->target));

        return $comment;
    }

    // ----------[ Transformers ]----------

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }

    /**
     * What the comment is about: the whole record when no anchor column is set, otherwise the complete anchor.
     *
     * @throws CommentAnchorCorrupt when only some anchor columns are set
     */
    public function subject(): WholeRecord|TextAnchor
    {
        $columns = [
            $this->version_id,
            $this->version_label,
            $this->anchor_type,
            $this->section_number,
            $this->first_line,
            $this->last_line,
            $this->quote,
            $this->start_offset,
            $this->end_offset,
        ];

        if (array_filter($columns, fn (mixed $column) => $column !== null) === []) {
            return WholeRecord::Record;
        }

        return $this->anchor();
    }

    // ----------[ Accessors ]----------

    /**
     * The record the comment is on.
     *
     * @return Attribute<RecordIdentity, never>
     */
    protected function target(): Attribute
    {
        return Accessor::get(fn () => new RecordIdentity($this->target_type, $this->target_id));
    }

    /**
     * The comment as it is shown, its text also as safe HTML.
     *
     * @return Attribute<CommentDetails, never>
     */
    protected function details(): Attribute
    {
        return Accessor::get(fn () => CommentDetailsFactory::details($this));
    }

    /**
     * What the comment is about, in a few words: the whole record, or the version and lines of its text.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function placeLabel(): Attribute
    {
        return Accessor::get(function () {
            $subject = $this->subject();

            if ($subject instanceof TextAnchor) {
                return "on {$subject->versionLabel}, lines {$subject->firstLine}-{$subject->lastLine}";
            }

            return 'on the whole record';
        });
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: a comment stays as it was written.
     *
     * @throws CommentImmutable
     */
    private function assertUnedited(): never
    {
        throw CommentImmutable::for($this->id);
    }

    /**
     * Refuses an anchor with no known type or a column its type needs left empty, as a corrupt comment.
     *
     * @throws CommentAnchorCorrupt
     */
    private function assertAnchorComplete(): void
    {
        $type = TextAnchorType::tryFrom((string) $this->anchor_type);

        if ($type === null) {
            throw CommentAnchorCorrupt::for($this->id, IncompleteTextAnchor::withoutType());
        }

        $columns = [
            'versionId' => 'version_id',
            'versionLabel' => 'version_label',
            'firstLine' => 'first_line',
            'lastLine' => 'last_line',
        ];

        if ($type === TextAnchorType::Section) {
            $columns['sectionNumber'] = 'section_number';
        }

        if ($type === TextAnchorType::Quote) {
            $columns = [...$columns, 'quote' => 'quote', 'startOffset' => 'start_offset', 'endOffset' => 'end_offset'];
        }

        foreach ($columns as $field => $name) {
            if ($this->getAttribute($name) === null) {
                throw CommentAnchorCorrupt::for($this->id, IncompleteTextAnchor::missing($type->value, $field));
            }
        }
    }

    // ----------[ Internals ]----------

    /**
     * The anchor its columns hold, refused when a column its type needs is empty.
     *
     * @throws IncompleteTextAnchor
     */
    private function anchor(): TextAnchor
    {
        $this->assertAnchorComplete();
        $type = TextAnchorType::from((string) $this->anchor_type);

        $column = fn (string $field, string $name): string|int => $this->getAttribute($name);
        $isQuote = $type === TextAnchorType::Quote;

        return TextAnchor::restored(
            (string) $column('versionId', 'version_id'),
            (string) $column('versionLabel', 'version_label'),
            $type,
            $type === TextAnchorType::Section ? (int) $column('sectionNumber', 'section_number') : 0,
            (int) $column('firstLine', 'first_line'),
            (int) $column('lastLine', 'last_line'),
            $isQuote ? (string) $column('quote', 'quote') : '',
            $isQuote ? (int) $column('startOffset', 'start_offset') : 0,
            $isQuote ? (int) $column('endOffset', 'end_offset') : 0,
        );
    }

    // ----------[ Queries ]----------

    /**
     * A comment reaches no other record; it is shared only through its parent.
     */
    #[Override]
    public static function shareRelations(): ShareRelationSet
    {
        return ShareRelationSet::none();
    }

    // ----------[ Scopes ]----------

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
        $query->select([
            'id',
            'created_at',
            'quote',
        ])->selectRaw('left(body, ?) as excerpt', [$characters]);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function submittedAs(Builder $query, ActorReference $author, string $key): void
    {
        $query->where('author_type', $author->type)->where('author_id', $author->id)->where('submission_key', $key);
    }
}
