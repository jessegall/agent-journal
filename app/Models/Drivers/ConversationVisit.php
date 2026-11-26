<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Agents\AgentSession;
use App\Models\Support\JournalModel;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $session_id
 * @property string $conversation_id
 * @property int $sequence_number
 * @property string $event_id
 * @property CarbonImmutable $observed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class ConversationVisit extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sequence_number' => 'integer',
            'observed_at' => 'immutable_datetime',
        ];
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
        $existing = self::findOfEvent($session, $eventId);

        if ($existing !== null) {
            return $existing;
        }

        $next = self::resolveNextSequenceNumber($session);

        $conversationVisit = new self();
        $conversationVisit->session_id = $session->id;
        $conversationVisit->conversation_id = $conversation->id;
        $conversationVisit->sequence_number = $next;
        $conversationVisit->event_id = $eventId;
        $conversationVisit->observed_at = $observedAt;
        $conversationVisit->save();

        return $conversationVisit;
    }

    // ----------[ Queries ]----------

    /**
     * The session's visit recorded for this event; none before it.
     */
    public static function findOfEvent(AgentSession $session, string $eventId): self|null
    {
        return self::query()->ofSession($session)->ofEvent($eventId)->first();
    }

    /**
     * The number the session's next visit takes: one past its newest.
     */
    public static function resolveNextSequenceNumber(AgentSession $session): int
    {
        return (int) self::query()->ofSession($session)->max('sequence_number') + 1;
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

    /**
     * The rows of any of the given conversations.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofConversations(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('conversation_id', $ids);
    }

    /**
     * The rows by observed at descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestObservedFirst(Builder $query): void
    {
        $query->orderByDesc('observed_at');
    }
}
