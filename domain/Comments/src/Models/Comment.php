<?php

declare(strict_types=1);

namespace Domain\Comments\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\Commentable;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Sharing\Shareable;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Support\ShareRelationSet;
use Carbon\CarbonImmutable;
use Domain\Comments\Data\CommentDetails;
use Domain\Comments\Events\CommentPosted;
use Domain\Comments\Exceptions\CommentImmutable;
use Domain\Comments\Support\CommentDetailsFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Override;

/**
 * @property string $id
 * @property string $target_type
 * @property string $target_id
 * @property string $author_type
 * @property string $author_id
 * @property string $body
 * @property string $submission_key
 * @property string $submission_hash
 * @property CarbonImmutable $created_at
 * @property-read CommentAnchor|null $anchor
 * @property-read mixed $details
 * @property-read mixed $place_label
 * @property-read mixed $target
 *
 * @mixin \Eloquent
 */
final class Comment extends JournalModel implements EventSource, ReadableModel, Shareable
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    public const null UPDATED_AT = null;

    protected static function booted(): void
    {
        self::updating(fn (self $comment) => $comment->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * A comment on a record; an anchor written for it makes it about an exact place in one version of its text.
     */
    public static function create(Model&Commentable $target, ActorReference $author, string $body, string $key, string $hash): self
    {
        $comment = new self();
        $comment->body = $body;
        $comment->submission_key = $key;
        $comment->submission_hash = $hash;
        $comment->target_type = $target->getMorphClass();
        $comment->target_id = (string) $target->getKey();
        $comment->author_type = $author->type;
        $comment->author_id = $author->id;

        $comment->assertSaved($comment->save());
        $comment->raise(new CommentPosted($comment->id, $comment->target));

        return $comment;
    }

    // ----------[ Transformers ]----------

    public function shareIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
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
            if ($this->anchor === null) {
                return 'on the whole record';
            }

            return "on {$this->anchor->version_label}, lines {$this->anchor->first_line}-{$this->anchor->last_line}";
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

    // ----------[ Relations ]----------

    /**
     * The place in the record's text the comment is about; a comment about the whole record has none.
     *
     * @return HasOne<CommentAnchor, $this>
     */
    public function anchor(): HasOne
    {
        return $this->hasOne(CommentAnchor::class);
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
     * The columns a public page shows: the id and written time, the quote of its anchor, and the body cut to its first
     * characters by the database, so a long body is never loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function excerpts(Builder $query, int $characters): void
    {
        $query->select(['id', 'created_at'])
            ->selectRaw('left(body, ?) as excerpt', [$characters])
            ->with('anchor:comment_id,quote');
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
