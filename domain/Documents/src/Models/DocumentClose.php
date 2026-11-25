<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Actors\Actor;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Models\Support\Accessor;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Events\DocumentClosed;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Support\RecordViews;
use Domain\Documents\Values\CloseResult;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $token
 * @property string $document_id
 * @property int $base_revision_number
 * @property int $result_revision_number
 * @property ActorType $author_type
 * @property string $author_id
 * @property CloseCause $cause
 * @property ?ActorType $closer_type
 * @property ?string $closer_id
 * @property ?string $reason
 * @property bool $published
 * @property CarbonImmutable $closed_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $card attribute
 * @property mixed $result attribute
 */
#[Fillable([
    'token',
    'document_id',
    'base_revision_number',
    'result_revision_number',
    'author_type',
    'author_id',
    'cause',
    'closer_type',
    'closer_id',
    'reason',
    'published',
    'closed_at',
])]
final class DocumentClose extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    protected function casts(): array
    {
        return [
            'author_type' => ActorType::class,
            'closer_type' => ActorType::class,
            'cause' => CloseCause::class,
            'published' => 'boolean',
            'base_revision_number' => 'integer',
            'result_revision_number' => 'integer',
            'closed_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $close) => $close->assertUnedited());
    }

    // ----------[ Constructors ]----------

    public static function create(
        Document $document,
        DocumentDraft $draft,
        int $resultNumber,
        CloseCause $cause,
        Actor|null $closer,
        string|null $reason,
        bool $isPublished,
    ): self {
        $close = new self([
            'token' => $draft->token,
            'document_id' => $draft->document_id,
            'base_revision_number' => $draft->base_revision_number,
            'result_revision_number' => $resultNumber,
            'author_type' => $draft->author_type,
            'author_id' => $draft->author_id,
            'cause' => $cause,
            'closer_type' => $closer?->actorType(),
            'closer_id' => $closer?->actorId(),
            'reason' => $reason === null ? null : trim($reason),
            'published' => $isPublished,
            'closed_at' => CarbonImmutable::now(),
        ]);

        $close->assertSaved($close->save());
        $close->raise(new DocumentClosed($document->id, $document->number, $resultNumber));

        return $close;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<CloseResult, never>
     */
    protected function result(): Attribute
    {
        return Accessor::get(fn () => new CloseResult($this->result_revision_number, $this->published));
    }

    /**
     * @return Attribute<CloseCard, never>
     */
    protected function card(): Attribute
    {
        return Accessor::get(fn () => RecordViews::closeCard($this));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: a draft close stays as it was written.
     *
     * @throws RecordImmutable
     */
    private function assertUnedited(): never
    {
        throw RecordImmutable::for('draft close');
    }

    // ----------[ Scopes ]----------

    /**
     * The document's closes.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDocument(Builder $query, string $documentId): void
    {
        $query->where('document_id', $documentId);
    }

    /**
     * The close of that token.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withToken(Builder $query, string $token): void
    {
        $query->where('token', $token);
    }

    /**
     * The closes newest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function lastClosedFirst(Builder $query): void
    {
        $query->orderByDesc('closed_at')->orderByDesc('id');
    }
}
