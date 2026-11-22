<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Data\WakeStatus;
use App\Enums\WakeState;
use App\Support\ActorIdentity;
use App\Support\AttentionOrigin;
use App\Support\AttentionOutcome;
use App\Support\InboxMembers;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * That one member of an inbox was asked to look because of one message or seat change, and the wake its runtime
 * accepted, if it runs in one. One row per origin and actor, so a replay asks nobody twice.
 *
 * @property string $id
 * @property string $origin_type
 * @property string $origin_id
 * @property string $origin_receipt_id
 * @property string $inbox_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string|null $request_id
 * @property int|null $wake_sequence
 */
#[Table('message_attentions')]
#[Fillable([
    'origin_type',
    'origin_id',
    'origin_receipt_id',
    'inbox_id',
    'actor_type',
    'actor_id',
    'request_id',
    'wake_sequence',
])]
final class MessageAttention extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsRowSets;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['wake_sequence' => 'integer'];
    }

    public static function create(
        AttentionOrigin $origin,
        string $inboxId,
        ActorIdentity $actor,
        AttentionOutcome $outcome,
    ): self {
        $attention = self::unsaved($origin, $inboxId, $actor, $outcome);
        $attention->save();

        return $attention;
    }

    /**
     * The row of one actor asked, not yet written, for createAll.
     */
    public static function unsaved(
        AttentionOrigin $origin,
        string $inboxId,
        ActorIdentity $actor,
        AttentionOutcome $outcome,
    ): self {
        return new self([
            'origin_type' => $origin->type,
            'origin_id' => $origin->id,
            'origin_receipt_id' => $origin->sourceId,
            'inbox_id' => $inboxId,
            'actor_type' => $actor->type->value,
            'actor_id' => $actor->id,
            'request_id' => $outcome->requestId,
            'wake_sequence' => $outcome->requestId === null ? null : $outcome->sequence,
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The keys of the actors already asked because of this origin.
     *
     * @return list<string>
     */
    public static function actorsAskedFor(AttentionOrigin $origin): array
    {
        return array_values(self::query()
            ->where('origin_type', $origin->type)
            ->where('origin_id', $origin->id)
            ->limit(InboxMembers::LIMIT)
            ->get()
            ->map(fn (self $attention) => "{$attention->actor_type}:{$attention->actor_id}")
            ->all());
    }

    // ----------[ Answers ]----------

    /**
     * Whether this member's runtime accepted the wake, as its message's author reads it.
     */
    public function wakeStatus(): WakeStatus
    {
        return new WakeStatus(
            $this->actor_type,
            $this->actor_id,
            $this->request_id,
            $this->request_id === null ? WakeState::WaitingForStartup : WakeState::Accepted,
        );
    }
}
