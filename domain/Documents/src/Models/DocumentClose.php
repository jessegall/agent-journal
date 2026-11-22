<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Actor;
use App\Contracts\EventSource;
use App\Contracts\ReadableModel;
use App\Enums\ActorType;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Events\DocumentClosed;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Support\RecordViews;
use Domain\Documents\Values\CloseResult;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * How a draft ended: the revision it started from and the one it left, why it closed, who closed it, and whether
 * it published a new revision. It is written once.
 *
 * @property string $token
 * @property int $base_revision_number
 * @property int $result_revision_number
 * @property CloseCause $cause
 * @property bool $published
 * @property string|null $closer_id
 * @property string|null $reason
 * @property CarbonImmutable|null $closed_at
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

    public const string LINK_TYPE = 'documents.close';

    // ----------[ Constructors ]----------

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

    public static function create(
        Document $document,
        DocumentDraft $draft,
        int $resultNumber,
        CloseCause $cause,
        Actor|null $closer,
        string|null $reason,
        bool $published,
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
            'published' => $published,
            'closed_at' => CarbonImmutable::now(),
        ]);

        $close->assertSaved($close->save());
        $close->raise(new DocumentClosed($document->id, $document->number, $resultNumber));

        return $close;
    }

    protected static function booted(): void
    {
        self::updating(function (self $close): void {
            throw RecordImmutable::for('draft close');
        });
    }

    // ----------[ Answers ]----------

    public function result(): CloseResult
    {
        return new CloseResult($this->result_revision_number, $this->published);
    }

    public function card(): CloseCard
    {
        return RecordViews::closeCard($this);
    }
}
