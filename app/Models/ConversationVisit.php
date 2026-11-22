<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One time a journal session was seen in a native conversation, in the order the session's starts came.
 *
 * @property string $id
 * @property string $session_id
 * @property string $conversation_id
 * @property int $sequence_number
 * @property string $event_id
 * @property CarbonImmutable $observed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['session_id', 'conversation_id', 'sequence_number', 'event_id', 'observed_at'])]
final class ConversationVisit extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['sequence_number' => 'integer', 'observed_at' => 'immutable_datetime'];
    }

    /**
     * Appends the next visit of the session to the conversation, once per event: the same event id finds the visit
     * already kept.
     */
    public static function appendOnce(
        AgentSession $session,
        DriverConversation $conversation,
        string $eventId,
        CarbonImmutable $observedAt,
    ): self {
        $existing = self::query()->where('session_id', $session->id)->where('event_id', $eventId)->first();

        if ($existing !== null) {
            return $existing;
        }

        $next = (int) self::query()->where('session_id', $session->id)->max('sequence_number') + 1;

        return self::query()->create(
            [
                'session_id' => $session->id,
                'conversation_id' => $conversation->id,
                'sequence_number' => $next,
                'event_id' => $eventId,
                'observed_at' => $observedAt,
            ],
        );
    }
}
