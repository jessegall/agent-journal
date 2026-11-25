<?php

declare(strict_types=1);

namespace App\Models\Inboxes;

use App\Contracts\Messages\MessageParticipant;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Enums\ActorType;
use PhpOption\Option;
use App\Events\Inboxes\InboxJoined;
use App\Events\Inboxes\InboxLeft;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One actor attached to one inbox, from when it joined until it left.
 *
 * @property string $id
 * @property string $inbox_id
 * @property string $actor_type
 * @property string $actor_id
 * @property CarbonImmutable $joined_at
 * @property CarbonImmutable|null $left_at
 */
#[Fillable(['inbox_id', 'actor_type', 'actor_id', 'joined_at'])]
final class InboxMember extends Model implements EventSource
{
    /**
     * The most inboxes one read lists for an actor.
     */
    public const int ATTACHED_LIMIT = 200;

    use HasUlids;
    use RaisesEvents;

    public $timestamps = false;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['joined_at' => 'immutable_datetime', 'left_at' => 'immutable_datetime'];
    }

    // ----------[ Queries ]----------

    /**
     * Detaches the actor from the inbox; an actor not attached leaves nothing.
     */
    public static function leave(string $inboxId, ActorIdentity $actor, CarbonImmutable $at): void
    {
        $member = self::query()->active()->ofActor($actor)->ofInbox($inboxId)->first();

        if ($member === null) {
            return;
        }

        $member->left_at = $at;
        $member->save();
        $member->raise(new InboxLeft($inboxId, $actor));
    }

    /**
     * Attaches the actor to the inbox; an actor already attached stays as it is.
     */
    public static function join(string $inboxId, ActorIdentity $actor, CarbonImmutable $at): void
    {
        $member = self::query()->active()->ofActor($actor)->firstOrCreate(
            ['inbox_id' => $inboxId, 'actor_type' => $actor->type->value, 'actor_id' => $actor->id],
            ['joined_at' => $at],
        );

        if ($member->wasRecentlyCreated) {
            $member->raise(new InboxJoined($inboxId, $actor));
        }
    }

    /**
     * Whether the actor is attached to the inbox now.
     */
    public static function isAttached(string $inboxId, ActorIdentity $actor): bool
    {
        return self::query()->active()->ofActor($actor)->ofInbox($inboxId)->exists();
    }

    /**
     * Which of these membership rows are still active.
     *
     * @param  list<string>  $memberIds
     * @return list<string>
     */
    public static function activeIdsAmong(array $memberIds): array
    {
        if ($memberIds === []) {
            return [];
        }

        return array_values(self::query()->active()->whereKey($memberIds)->pluck('id')->all());
    }

    /**
     * The actor's active membership of the inbox.
     *
     * @return Option<self>
     */
    public static function activeOf(string $inboxId, ActorIdentity $actor): Option
    {
        return Option::fromValue(self::query()->active()->ofInbox($inboxId)->ofActor($actor)->first());
    }

    /**
     * The actors of one type attached to any of the inboxes now, each once.
     *
     * @param  list<string>  $inboxIds
     * @return list<ActorIdentity>
     */
    public static function attachedTo(array $inboxIds, ActorType $type): array
    {
        return self::query()
            ->active()
            ->ofInboxes($inboxIds)
            ->ofActorType($type)
            ->distinct()
            ->pluck('actor_id')
            ->map(fn (string $actorId) => new ActorIdentity($type, $actorId))
            ->values()
            ->all();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->whereNull('left_at');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofActor(Builder $query, ActorIdentity $actor): void
    {
        $query->where($actor->asColumns('actor'));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofParticipant(Builder $query, MessageParticipant $participant): void
    {
        $query->where('actor_type', $participant->participantType())->where('actor_id', $participant->participantId());
    }

    /**
     * The inbox's members.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofInbox(Builder $query, string $inboxId): void
    {
        $query->where('inbox_id', $inboxId);
    }

    /**
     * The members of the inboxes.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $inboxIds
     */
    #[Scope]
    protected function ofInboxes(Builder $query, array $inboxIds): void
    {
        $query->whereIn('inbox_id', $inboxIds);
    }

    /**
     * The members of that actor type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofActorType(Builder $query, ActorType $type): void
    {
        $query->where('actor_type', $type->value);
    }
}
