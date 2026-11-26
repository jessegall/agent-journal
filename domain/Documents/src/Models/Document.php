<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Actors\Actor;
use App\Contracts\Events\EventSource;
use App\Contracts\Projects\ProjectOwned;
use App\Contracts\Reads\TextContent;
use App\Contracts\Records\Commentable;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Sharing\Shareable;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToProjectOrGlobal;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\ShareRecordCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use App\Values\ProjectOwner;
use App\Values\TextVersion;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Data\DockSuggestion;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Events\DocumentFirstRevisionSet;
use Domain\Documents\Events\DocumentPublished;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Models\Concerns\CreatedWithAttention;
use Domain\Documents\Models\Concerns\Settles;
use Domain\Documents\Models\Concerns\SharedWithComments;
use Domain\Documents\Support\Cards\DocumentDockCard;
use Domain\Documents\Support\RecordViews;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Query\JoinClause;

/**
 * @property string $id
 * @property string|null $project_id
 * @property string $number_group_id
 * @property int $number
 * @property string $creator_type
 * @property string $creator_id
 * @property AttentionStatus $attention
 * @property string|null $current_revision_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $card
 * @property-read DocumentRevision|null $currentRevision
 * @property-read mixed $dock_card
 * @property-read DocumentDraft|null $draft
 * @property-read Collection<int, DocumentRevision> $revisions
 * @property-read int|null $revisions_count
 * @property-read mixed $view
 *
 * @mixin \Eloquent
 */
final class Document extends JournalModel implements
    Commentable,
    Dockable,
    EventSource,
    Numbered,
    ProjectOwned,
    ReadableModel,
    Shareable,
    TextContent
{
    use BelongsToProjectOrGlobal;
    use BoundedReads;
    use CreatedWithAttention;
    use HasNumber;
    use Linkable;
    use OrdersById;
    use RaisesEvents;
    use Settles;
    use SharedWithComments;

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
            'attention' => AttentionStatus::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new document by its author, numbered and announced; its first revision is added next and made current.
     */
    public static function create(Actor $author, ProjectOwner $owner): self
    {
        $document = new self();
        $document->assignOwner($owner);
        $document->creator_type = $author->actorType();
        $document->creator_id = $author->actorId();
        $document->assertSaved($document->save());
        $document->raise(new DocumentCreated($document->id, $document->number, ActorReference::of($author)));

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

        if ($this->attention === AttentionStatus::Settled) {
            $this->attention = AttentionStatus::Active;
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
     * The document as a search found it: its card with a snippet of the newest revision the search loaded into the
     * relation it searched.
     */
    public function searchResult(string $words, string $relation): PublicationCard
    {
        $matchingRevision = $this->foundRevision($relation);

        return PublicationCard::from([
            ...$this->card->all(),
            'snippet' => $matchingRevision->snippetFor($words),
            'foundIn' => "revision {$matchingRevision->number}",
        ]);
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
        $revision = DocumentRevision::findPublishedOf($this, $version);

        return TextVersion::ofMarkdown((string) $revision->number, "Revision {$revision->number}", $revision->body);
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

    /**
     * The document's safe card for a share: its current closed revision's title, and that revision's number as the
     * published version.
     */
    public function shareCard(): ShareRecordCard
    {
        $revision = DocumentRevision::findCurrentOf($this);

        return new ShareRecordCard($this->shareIdentity(), $revision->title, (string) $revision->number);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<PublicationCard, never>
     */
    protected function card(): Attribute
    {
        return Accessor::get(fn () => RecordViews::documentCard($this));
    }

    /**
     * @return Attribute<DockSuggestion, never>
     */
    protected function dockCard(): Attribute
    {
        return Accessor::get(fn () => RecordViews::documentSuggestion($this));
    }

    /**
     * @return Attribute<DocumentView, never>
     */
    protected function view(): Attribute
    {
        return Accessor::get(fn () => RecordViews::documentView($this));
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
     * Refuses a document without its current revision; every published document has one from the moment it is
     * created.
     *
     * @phpstan-assert !null $this->currentRevision
     *
     * @throws DocumentMissing
     */
    public function assertHasCurrentRevision(): void
    {
        if ($this->currentRevision === null) {
            throw DocumentMissing::numbered($this->number);
        }
    }

    // ----------[ Internals ]----------

    /**
     * The newest revision a search loaded into the relation it searched.
     */
    private function foundRevision(string $relation): DocumentRevision
    {
        $matchingRevision = $relation === 'revisions'
            ? $this->revisions->sortByDesc('number')->first()
            : $this->currentRevision;

        return $matchingRevision ?? DocumentRevision::findCurrentOf($this);
    }

    // ----------[ Queries ]----------

    /**
     * The document of this number, locked for the transaction: the one lock every writer of a document takes first.
     *
     * @throws DocumentMissing
     */
    public static function findLockedForEditing(int|string $number): self
    {
        $query = self::query()->with('currentRevision')->lockForUpdate();

        if (is_int($number)) {
            return $query->numberedInJournal($number)->firstOr(DocumentMissing::throwing()->numbered($number));
        }

        return $query->whereKey($number)->firstOr(DocumentMissing::throwing()->identified($number));
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

    /**
     * The rows of the given number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withNumber(Builder $query, int $number): void
    {
        $query->where('number', $number);
    }

    /**
     * The rows with their currentRevision loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withCurrentRevision(Builder $query): void
    {
        $query->with('currentRevision');
    }

    /**
     * The rows with their draft loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withDraft(Builder $query): void
    {
        $query->with('draft');
    }

    /**
     * The documents with their current revision loaded as much as a card shows.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withCurrentRevisionCard(Builder $query): void
    {
        $query->with(['currentRevision' => fn (BelongsTo $revision) => $revision->forCards()]);
    }
}
