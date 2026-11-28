<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Exceptions\TextVersionUnavailable;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\Numbered;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Models\Concerns\MeasuresBody;
use Domain\Documents\Models\Concerns\SearchesText;
use Domain\Documents\Support\RecordViewFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $document_id
 * @property string $number_group_id
 * @property int $number
 * @property string $title
 * @property string $abstract
 * @property string $body
 * @property string $author_type
 * @property string $author_id
 * @property CarbonImmutable|null $closed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $card
 * @property-read Document $document
 *
 * @mixin \Eloquent
 */
final class DocumentRevision extends JournalModel implements Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use Linkable;
    use MeasuresBody;
    use SearchesText;

    protected function casts(): array
    {
        return [
            'closed_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => $revision->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * The document's next closed revision, numbered within it.
     */
    public static function create(
        Document $document,
        string $title,
        string $abstract,
        string $body,
        string $authorType,
        string $authorId,
    ): self {
        $revision = new self();
        $revision->document_id = $document->id;
        $revision->title = $title;
        $revision->abstract = $abstract;
        $revision->body = $body;
        $revision->author_type = $authorType;
        $revision->author_id = $authorId;
        $revision->closed_at = CarbonImmutable::now();

        $revision->setRelation('document', $document);
        $revision->save();

        return $revision;
    }

    /**
     * The revision with its text, marked historical when the document has a later one.
     */
    public function view(Document $document): RevisionView
    {
        return RecordViewFactory::revisionView($this, $document);
    }

    /**
     * A revision is numbered within its document.
     */
    public function numberHolder(): Model
    {
        if ($this->relationLoaded('document')) {
            return $this->document;
        }

        return $this->document()->sole();
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<RevisionCard, never>
     */
    protected function card(): Attribute
    {
        return Accessor::get(fn () => RecordViewFactory::revisionCard($this));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Document, $this>
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    // ----------[ Asserts ]----------

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
     * Refuses every edit: a revision stays as it was written.
     *
     * @throws RecordImmutable
     */
    private function assertUnedited(): never
    {
        throw RecordImmutable::for('revision');
    }

    // ----------[ Queries ]----------

    /**
     * The document's current revision; every published document has one from the moment it is created.
     *
     * @throws DocumentMissing
     */
    public static function findCurrentOf(Document $document): self
    {
        $document->assertHasCurrentRevision();

        return $document->currentRevision;
    }

    /**
     * The document's current revision for no version, otherwise its closed revision with that number.
     *
     * @throws TextVersionUnavailable
     */
    public static function findPublishedOf(Document $document, string|null $version): self
    {
        if ($version === null) {
            return $document
                ->revisions()
                ->whereKey($document->current_revision_id)
                ->closed()
                ->firstOr(TextVersionUnavailable::throwing()->named('current'));
        }

        self::assertVersionNumber($version);

        return $document
            ->revisions()
            ->numbered((int) $version)
            ->closed()
            ->firstOr(TextVersionUnavailable::throwing()->named($version));
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, Actor $actor): void
    {
        $query->where('author_type', $actor->actorType())->where('author_id', $actor->actorId());
    }

    /**
     * Only the columns a record card shows, so a list never loads revision bodies.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forCards(Builder $query): void
    {
        $query->select(['id', 'document_id', 'number', 'title', 'abstract', 'closed_at']);
    }

    /**
     * The closed revisions, which every signed-in actor may read.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sharedPublished(Builder $query): void
    {
        $query->whereNotNull('closed_at');
    }

    /**
     * The closed revisions.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function closed(Builder $query): void
    {
        $query->whereNotNull('closed_at');
    }

    /**
     * The revision of that number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function numbered(Builder $query, int $number): void
    {
        $query->where('number', $number);
    }

    /**
     * The rows of the given title.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTitle(Builder $query, string $title): void
    {
        $query->where('title', $title);
    }

    /**
     * The revisions by their number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byNumber(Builder $query): void
    {
        $query->orderBy('number');
    }
}
