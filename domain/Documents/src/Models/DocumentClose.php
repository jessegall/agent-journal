<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Documents\Api\CloseResult;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Exceptions\RecordImmutable;
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
#[Fillable(['token', 'document_id', 'base_revision_number', 'result_revision_number', 'author_type', 'author_id', 'session_id', 'cause', 'closer_type', 'closer_id', 'reason', 'published', 'closed_at'])]
final class DocumentClose extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'documents.close';

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

    public static function record(DocumentDraft $draft, int $resultNumber, CloseCause $cause, Actor|null $closer, string|null $reason, bool $published): self
    {
        return self::query()->create([
            'token' => $draft->token,
            'document_id' => $draft->document_id,
            'base_revision_number' => $draft->base_revision_number,
            'result_revision_number' => $resultNumber,
            'author_type' => $draft->author_type,
            'author_id' => $draft->author_id,
            'session_id' => $draft->session_id,
            'cause' => $cause,
            'closer_type' => $closer?->actorType(),
            'closer_id' => $closer?->actorId(),
            'reason' => $reason,
            'published' => $published,
            'closed_at' => CarbonImmutable::now(),
        ]);
    }

    public function result(): CloseResult
    {
        return new CloseResult($this->result_revision_number, $this->published);
    }

    public function card(): CloseCard
    {
        return CloseCard::from([
            'cause' => $this->cause->value,
            'closerId' => $this->closer_id,
            'reason' => $this->reason,
            'baseRevision' => (string) $this->base_revision_number,
            'resultRevision' => (string) $this->result_revision_number,
            'published' => $this->published,
            'closedAt' => (string) $this->closed_at?->toIso8601String(),
        ]);
    }

    protected static function booted(): void
    {
        self::updating(function (self $close): void {
            throw RecordImmutable::for('draft close');
        });
    }
}
