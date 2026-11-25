<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasComments;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Actors\Actor;
use App\Contracts\Events\EventSource;
use App\Contracts\Reads\TextContent;
use App\Contracts\Records\Commentable;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Sharing\Shareable;
use App\Enums\ActorType;
use App\Exceptions\TextVersionUnavailable;
use App\Support\ActorContext;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\ShareRecordCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use App\Values\TextVersion;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Data\DockSuggestion;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Events\DocumentFirstRevisionSet;
use Domain\Documents\Events\DocumentPublished;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Models\Concerns\CreatedWithAttention;
use Domain\Documents\Models\Concerns\Settles;
use Domain\Documents\Models\Concerns\SharedWithComments;
use Domain\Documents\Support\Cards\DocumentDockCard;
use Domain\Documents\Support\DocumentType;
use Domain\Documents\Support\RecordViews;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Query\JoinClause;
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
#[Fillable([
    'creator_type',
    'creator_id',
])]
final class Document extends Model implements Commentable, Dockable, EventSource, Numbered, ReadableModel, Shareable, TextContent
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

    public const string LINK_TYPE = DocumentType::VALUE;

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

    protected function casts(): array
    {
        return [
            'creator_type' => ActorType::class,
            'attention' => AttentionState::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new document by its author, numbered and announced; its first revision is added next and made current.
     */
    public static function create(Actor $author): self
    {
        $document = new self([
            'creator_type' => $author->actorType(),
            'creator_id' => $author->actorId(),
        ]);
        $document->assertSaved($document->save());
        $document->raise(new DocumentCreated($document->id, $document->number, ActorContext::of($author)));

        return $document;
    }

    // ----------[ Mutations ]----------

    /**
     * Makes the document's first revision its current one.
     */
    public function startWith(DocumentRevision $revision): void
    {
        $this->current_revision_id = $revision->id;
        $this->assertSaved($this->save());
        $this->raise(new DocumentFirstRevisionSet($this->id, $revision->id));
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

    // ----------[ Transformers ]----------

    /**
     * How the document's drafts ended, newest first.
     *
     * @return list<CloseCard>
     */
    public function closes(): array
    {
        return array_values(DocumentClose::query()
            ->ofDocument($this->id)
            ->lastClosedFirst()
            ->get()
            ->map(fn (DocumentClose $close) => $close->card)
            ->all());
    }

    /**
     * The document as a search found it: its card with a snippet of the revision that holds the words.
     */
    public function searchResult(string $words, DocumentRevision $matchingRevision): PublicationCard
    {
        return PublicationCard::from([
            ...$this->card->all(),
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

        return $matchingRevision ?? $this->currentRevisionOrFail;
    }

    /**
     * The close already recorded for a draft token of this document, which a repeated close answers with.
     */
    public function closeOf(string $token): DocumentClose|null
    {
        return DocumentClose::query()->ofDocument($this->id)->withToken($token)->first();
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
            $revision = $this->revisions()->whereKey($this->current_revision_id)->closed()->first();
            self::assertPublished($revision, 'current');

            return $revision;
        }

        self::assertVersionNumber($version);
        $revision = $this->revisions()->numbered((int) $version)->closed()->first();
        self::assertPublished($revision, $version);

        return $revision;
    }

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->id);
    }

    /**
     * Its card in a dock: what it is called and where it stands, with Open when the viewer may open it.
     */
    public function composeDockCard(CardContext $context): DockCard
    {
        return new DocumentDockCard($this, $context)->card;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<PublicationCard, never>
     */
    protected function card(): Attribute
    {
        return Attribute::get(fn () => RecordViews::documentCard($this))->withoutObjectCaching();
    }

    /**
     * The document's safe card for a share: its current closed revision's title, and that revision's number as the
     * published version.
     *
     * @return Attribute<ShareRecordCard, never>
     */
    protected function shareCard(): Attribute
    {
        return Attribute::get(function () {
            $revision = $this->currentRevisionOrFail;

            return new ShareRecordCard($this->shareIdentity(), $revision->title, (string) $revision->number);
        })->withoutObjectCaching();
    }

    /**
     * @return Attribute<DockSuggestion, never>
     */
    protected function dockCard(): Attribute
    {
        return Attribute::get(fn () => RecordViews::documentSuggestion($this))->withoutObjectCaching();
    }

    /**
     * @return Attribute<DocumentView, never>
     */
    protected function view(): Attribute
    {
        return Attribute::get(fn () => RecordViews::documentView($this))->withoutObjectCaching();
    }

    /**
     * The current revision; every published document has one from the moment it is created.
     *
     * @return Attribute<DocumentRevision, never>
     */
    protected function currentRevisionOrFail(): Attribute
    {
        return Attribute::get(function (): DocumentRevision {
            $this->assertHasCurrentRevision();

            return $this->currentRevision;
        })->withoutObjectCaching();
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

    // ----------[ Asserts ]----------

    /**
     * Refuses a version that names no closed revision of the document.
     *
     * @phpstan-assert DocumentRevision $revision
     *
     * @throws TextVersionUnavailable
     */
    private static function assertPublished(DocumentRevision|null $revision, string $version): void
    {
        if ($revision === null) {
            throw TextVersionUnavailable::named($version);
        }
    }

    /**
     * Refuses a version that is not a revision number.
     *
     * @throws TextVersionUnavailable
     */
    private static function assertVersionNumber(string $version): void
    {
        if (! ctype_digit($version)) {
            throw TextVersionUnavailable::named($version);
        }
    }

    /**
     * Refuses a document without its current revision.
     *
     * @phpstan-assert !null $this->currentRevision
     *
     * @throws DocumentMissing
     */
    private function assertHasCurrentRevision(): void
    {
        if ($this->currentRevision === null) {
            throw DocumentMissing::numbered($this->number);
        }
    }

    /**
     * Refuses a number or id no document holds.
     *
     * @phpstan-assert self $document
     *
     * @throws DocumentMissing
     */
    private static function assertFound(self|null $document, int|string $reference): void
    {
        if ($document !== null) {
            return;
        }

        if (is_int($reference)) {
            throw DocumentMissing::numbered($reference);
        }

        throw DocumentMissing::identified($reference);
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
            $document = $query->numberedInJournal($number)->first();
            self::assertFound($document, $number);

            return $document;
        }

        $document = $query->whereKey($number)->first();
        self::assertFound($document, $number);

        return $document;
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

    /**
     * Each document joined to its latest closed revision as published: its title, number and body, never a draft's.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withPublishedRevision(Builder $query): void
    {
        $query->join('document_revisions as published', function (JoinClause $join): void {
            $join->on('published.document_id', '=', 'documents.id')
                ->whereNotNull('published.closed_at')
                ->whereRaw('published.closed_at = (select max(closed.closed_at) from document_revisions as closed '
                    .'where closed.document_id = documents.id and closed.closed_at is not null)');
        });
    }
}
