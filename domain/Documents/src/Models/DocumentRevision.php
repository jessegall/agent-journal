<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\RevisionCard;
use Domain\Documents\Data\RevisionView;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Models\Concerns\MeasuresBody;
use Domain\Documents\Models\Concerns\SearchesText;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One revision of a document, numbered within it: revision 1, 2, 3. A closed revision never changes.
 *
 * @property string $id
 * @property string $document_id
 * @property int $number
 * @property string $title
 * @property string $abstract
 * @property string $body
 * @property ActorType $author_type
 * @property string $author_id
 * @property Carbon|null $closed_at
 */
#[Fillable(['document_id', 'title', 'abstract', 'body', 'author_type', 'author_id', 'closed_at'])]
final class DocumentRevision extends Model implements Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use MeasuresBody;
    use SearchesText;

    public const string LINK_TYPE = 'documents.revision';

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return [
            'author_type' => ActorType::class,
            'closed_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * The document's next closed revision, numbered within it.
     */
    public static function create(
        Document $document,
        string $title,
        string $abstract,
        string $body,
        ActorType $authorType,
        string $authorId,
    ): self {
        $revision = new self([
            'document_id' => $document->id,
            'title' => $title,
            'abstract' => $abstract,
            'body' => $body,
            'author_type' => $authorType,
            'author_id' => $authorId,
            'closed_at' => CarbonImmutable::now(),
        ]);
        $revision->setRelation('document', $document);
        $revision->save();

        return $revision;
    }

    protected static function booted(): void
    {
        self::updating(function (self $revision): void {
            throw RecordImmutable::for('revision');
        });
    }

    // ----------[ Answers ]----------

    public function card(): RevisionCard
    {
        return RevisionCard::from([
            'number' => (string) $this->number,
            'title' => $this->title,
            'authorType' => $this->author_type->value,
            'authorId' => $this->author_id,
            'closedAt' => (string) $this->closed_at?->toIso8601String(),
        ]);
    }

    /**
     * The revision with its text, marked historical when the document has a later one.
     */
    public function view(Document $document): RevisionView
    {
        return RevisionView::from([
            'documentNumber' => (string) $document->number,
            'number' => (string) $this->number,
            'title' => $this->title,
            'abstract' => $this->abstract,
            'body' => $this->body,
            'authorType' => $this->author_type->value,
            'authorId' => $this->author_id,
            'closedAt' => (string) $this->closed_at?->toIso8601String(),
            'historical' => $document->currentRevisionOrFail()->number !== $this->number,
        ]);
    }

    /**
     * A revision is numbered within its document.
     */
    public function numberHolder(): Model
    {
        return $this->relationLoaded('document') ? $this->document : $this->document()->sole();
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Document, $this>
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, Actor $actor): void
    {
        $query->where('author_type', $actor->actorType()->value)->where('author_id', $actor->actorId());
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
}
