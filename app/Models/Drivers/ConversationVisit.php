<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Agents\AgentSession;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $session_id
 * @property string $conversation_id
 * @property int $sequence_number
 * @property string $event_id
 * @property CarbonImmutable $observed_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
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
        $existing = self::query()->ofSession($session)->ofEvent($eventId)->first();

        if ($existing !== null) {
            return $existing;
        }

        $next = (int) self::query()->ofSession($session)->max('sequence_number') + 1;

        $conversationVisit = new self();
        $conversationVisit->session_id = $session->id;
        $conversationVisit->conversation_id = $conversation->id;
        $conversationVisit->sequence_number = $next;
        $conversationVisit->event_id = $eventId;
        $conversationVisit->observed_at = $observedAt;
        $conversationVisit->save();

        return $conversationVisit;
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
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $conversationIds
     */
    #[Scope]
    protected function ofConversations(Builder $query, array|Builder|Closure $conversationIds): void
    {
        $query->whereIn('conversation_id', $conversationIds);
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
