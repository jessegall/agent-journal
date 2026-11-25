<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Scope;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Agents\AgentSession;
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

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['sequence_number' => 'integer', 'observed_at' => 'immutable_datetime'];
    }

    // ----------[ Constructors ]----------

    /**
     * Appends the next visit of the session to the conversation, once per event: the same event id finds the visit
     * already kept.
     */
    public static function create(
        AgentSession $session,
        DriverConversation $conversation,
        string $eventId,
        CarbonImmutable $observedAt,
    ): self {
        $existing = self::query()->ofSession($session)->ofEvent($eventId)->first();

        if ($existing !== null) {
            return $existing;
        }

        $next = (int) self::query()->ofSession($session)->max('sequence_number') + 1;

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

    // ----------[ Scopes ]----------

    /**
     * The session's visits.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSession(Builder $query, AgentSession $session): void
    {
        $query->where('session_id', $session->id);
    }

    /**
     * The visit recorded from the event.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofEvent(Builder $query, string $eventId): void
    {
        $query->where('event_id', $eventId);
    }
}
