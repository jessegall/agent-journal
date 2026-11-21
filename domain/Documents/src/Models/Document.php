<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Comments\Contracts\Commentable;
use App\Comments\Support\HasComments;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Support\ShareRecordCard;
use App\Text\Contracts\TextContent;
use App\Text\Exceptions\TextVersionUnavailable;
use App\Text\Values\TextVersion;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Api\Events\DocumentPublished;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Data\DockCard;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Models\Concerns\CreatedWithAttention;
use Domain\Documents\Models\Concerns\Settles;
use Domain\Documents\Models\Concerns\SharedWithComments;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * A document: lasting knowledge kept as numbered revisions. It keeps no copy of its text; its current text is its
 * highest revision.
 *
 * @property string $id
 * @property int $number
 * @property ActorType $creator_type
 * @property string $creator_id
 * @property AttentionState $attention
 * @property string|null $current_revision_id
 * @property Carbon|null $created_at
 */
#[Fillable(['creator_type', 'creator_id'])]
final class Document extends Model implements Commentable, EventSource, Numbered, ReadableModel, Shareable, TextContent
{
    use BoundedReads;
    use CreatedWithAttention;
    use HasComments;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;
    use Settles;
    use SharedWithComments;

    public const string LINK_TYPE = 'documents.document';

    /**
     * The most characters a document's or a report's title holds.
     */
    public const int TITLE_CHARACTER_LIMIT = 240;

    /**
     * The most characters a document's or a report's abstract holds.
     */
    public const int ABSTRACT_CHARACTER_LIMIT = 1000;

    /**
     * The most characters the reason a document or a report is settled holds.
     */
    public const int SETTLEMENT_REASON_CHARACTER_LIMIT = 2000;

    protected $attributes = ['attention' => 'active'];

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return [
            'creator_type' => ActorType::class,
            'attention' => AttentionState::class,
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new document by its author, numbered and announced; its first revision is added next and made current.
     */
    public static function create(Actor $author): self
    {
        $document = new self(['creator_type' => $author->actorType(), 'creator_id' => $author->actorId()]);
        $document->assertSaved($document->save());
        $document->raise(new DocumentCreated($document->id, $document->number, ActorContext::of($author)));

        return $document;
    }

    // ----------[ Queries ]----------

    /**
     * The document of this number, locked for the transaction: the one lock every writer of a document takes first.
     *
     * @throws DocumentMissing
     */
    public static function lockedForEditing(int|string $number): self
    {
        $query = self::query()->with('currentRevision')->lockForUpdate();

        if (is_int($number)) {
            return $query->where('number', $number)->firstOr(fn () => throw DocumentMissing::numbered($number));
        }

        return $query->whereKey($number)->firstOr(fn () => throw DocumentMissing::identified($number));
    }

    // ----------[ Mutations ]----------

    /**
     * Makes the document's first revision its current one.
     */
    public function startWith(DocumentRevision $revision): void
    {
        $this->current_revision_id = $revision->id;
        $this->assertSaved($this->save());
        $this->setRelation('currentRevision', $revision);
    }

    /**
     * Makes a closed draft's new revision the document's current one, brings a settled document back to attention
     * with its settlements kept, and announces the publication.
     */
    public function publish(DocumentRevision $revision): void
    {
        $this->current_revision_id = $revision->id;

        if ($this->attention === AttentionState::Settled) {
            $this->attention = AttentionState::Active;
        }

        $this->assertSaved($this->save());
        $this->setRelation('currentRevision', $revision);
        $this->raise(new DocumentPublished($this->id, $this->number, $revision->number));
    }

    // ----------[ Answers ]----------

    /**
     * How the document's drafts ended, newest first.
     *
     * @return list<CloseCard>
     */
    public function closes(): array
    {
        return array_values(DocumentClose::query()
            ->where('document_id', $this->id)
            ->orderByDesc('closed_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (DocumentClose $close) => $close->card())
            ->all());
    }

    public function card(): PublicationCard
    {
        $revision = $this->currentRevisionOrFail();

        return PublicationCard::from([
            'id' => $this->id,
            'number' => (string) $this->number,
            'title' => $revision->title,
            'abstract' => $revision->abstract,
            'attention' => $this->attention,
        ]);
    }

    /**
     * The document as a search found it: its card with a snippet of the revision that holds the words.
     */
    public function searchResult(string $words, DocumentRevision $matchingRevision): PublicationCard
    {
        return PublicationCard::from([
            ...$this->card()->all(),
            'snippet' => $matchingRevision->snippetFor($words),
            'foundIn' => "revision {$matchingRevision->number}",
        ]);
    }

    /**
     * The newest revision a search loaded into the relation it searched.
     */
    public function foundRevision(string $relation): DocumentRevision
    {
        $matchingRevision = $relation === 'revisions'
            ? $this->revisions->sortByDesc('number')->first()
            : $this->currentRevision;

        return $matchingRevision ?? $this->currentRevisionOrFail();
    }

    /**
     * The document's safe card for a share: its current closed revision's title, and that revision's number as the
     * published version.
     */
    public function shareCard(): ShareRecordCard
    {
        $revision = $this->currentRevisionOrFail();

        return new ShareRecordCard($this->shareIdentity(), $revision->title, (string) $revision->number);
    }

    public function dockCard(): DockCard
    {
        $revision = $this->currentRevisionOrFail();

        return DockCard::from([
            'type' => 'doc',
            'number' => (string) $this->number,
            'title' => $revision->title,
            'abstract' => $revision->abstract,
            'route' => "/documents/docs/{$this->number}",
        ]);
    }

    public function view(): DocumentView
    {
        $revision = $this->currentRevisionOrFail();

        return new DocumentView(
            $this->id,
            (string) $this->number,
            $revision->title,
            $revision->abstract,
            $revision->body,
            (string) $revision->number,
            $this->creator_type->value,
            $this->creator_id,
            $this->attention,
            (string) $this->created_at?->toIso8601String(),
        );
    }

    /**
     * The close already recorded for a draft token of this document, which a repeated close answers with.
     */
    public function closeOf(string $token): DocumentClose|null
    {
        return DocumentClose::query()->where('document_id', $this->id)->where('token', $token)->first();
    }

    /**
     * The current revision; every published document has one from the moment it is created.
     */
    public function currentRevisionOrFail(): DocumentRevision
    {
        return $this->currentRevision ?? throw DocumentMissing::numbered($this->number);
    }

    /**
     * A published revision's text: the current one, or exactly the named revision number.
     */
    public function textVersion(string|null $version = null): TextVersion
    {
        $revision = $this->publishedRevision($version);

        return TextVersion::ofMarkdown((string) $revision->number, "Revision {$revision->number}", $revision->body);
    }

    /**
     * The current revision for no version, otherwise the closed revision with that number.
     *
     * @throws TextVersionUnavailable
     */
    public function publishedRevision(string|null $version): DocumentRevision
    {
        if ($version === null) {
            return $this->revisions()->whereKey($this->current_revision_id)->whereNotNull('closed_at')->firstOr(
                fn () => throw TextVersionUnavailable::named('current'),
            );
        }

        if (! ctype_digit($version)) {
            throw TextVersionUnavailable::named($version);
        }

        return $this->revisions()->where('number', (int) $version)->whereNotNull('closed_at')->firstOr(
            fn () => throw TextVersionUnavailable::named($version),
        );
    }

    // ----------[ Relations ]----------

    /**
     * @return HasOne<DocumentDraft, $this>
     */
    public function draft(): HasOne
    {
        return $this->hasOne(DocumentDraft::class);
    }

    /**
     * @return HasMany<DocumentRevision, $this>
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(DocumentRevision::class);
    }

    /**
     * The revision the document shows now: the last one published.
     *
     * @return BelongsTo<DocumentRevision, $this>
     */
    public function currentRevision(): BelongsTo
    {
        return $this->belongsTo(DocumentRevision::class, 'current_revision_id');
    }

    // ----------[ Scopes ]----------

    /**
     * Every document: documents are published to every signed-in actor.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sharedPublished(Builder $query): void
    {
        $query->whereHas('revisions', fn (Builder $revisions) => $revisions->whereNotNull('closed_at'));
    }
}
