<?php

declare(strict_types=1);

namespace App\Models\Inboxes;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Actors\StoredActor;
use App\Contracts\Events\EventSource;
use App\Contracts\Messages\MessageParticipant;
use App\Contracts\Records\ReadableModel;
use App\Events\Inboxes\InboxJoined;
use App\Events\Inboxes\InboxLeft;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $inbox_id
 * @property string $actor_type
 * @property string $actor_id
 * @property CarbonImmutable $joined_at
 * @property ?CarbonImmutable $left_at
 */
final class InboxMember extends Model implements EventSource, ReadableModel
{
    /**
     * The most inboxes one read lists for an actor.
     */
    public const int ATTACHED_LIMIT = 200;

    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public $timestamps = false;

    public const string CREATED_AT = 'joined_at';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'joined_at' => 'immutable_datetime',
            'left_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * Detaches the member from its inbox.
     */
    public function leave(CarbonImmutable $at): void
    {
        $this->left_at = $at;
        $this->save();
        $this->raise(new InboxLeft($this->inbox_id, ActorIdentity::fromStored($this->actor_type, $this->actor_id)));
    }

    // ----------[ Queries ]----------

    /**
     * The actor's active membership of the inbox; none when it is not attached.
     */
    public static function findActive(string $inboxId, ActorIdentity $actor): self|null
    {
        return self::query()->active()->ofActor($actor)->ofInbox($inboxId)->first();
    }

    /**
     * Attaches the actor to the inbox; an actor already attached stays as it is.
     */
    public static function create(string $inboxId, ActorIdentity $actor, CarbonImmutable $at): void
    {
        if (self::query()->active()->ofActor($actor)->ofInbox($inboxId)->exists()) {
            return;
        }

        $member = new self();
        $member->inbox_id = $inboxId;
        $member->actor_type = $actor->type;
        $member->actor_id = $actor->id;
        $member->joined_at = $at;
        $member->assertSaved($member->save());
        $member->raise(new InboxJoined($inboxId, $actor));
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
     * @param  list<string>  $ids
     * @return list<string>
     */
    public static function activeIdsAmong(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return array_values(self::query()->active()->whereKey($ids)->pluck('id')->all());
    }

    /**
     * The actor's active membership of the inbox.
     *
     * @return Option<self>
     */
    public static function activeOf(string $inboxId, ActorIdentity $actor): Option
    {
        $inboxMember = self::query()->active()->ofInbox($inboxId)->ofActor($actor)->first();

        return Option::fromValue($inboxMember);
    }

    /**
     * The actors of one class attached to any of the inboxes now, each once.
     *
     * @param  list<string>  $inboxIds
     * @param  class-string<StoredActor>  $actorClass
     * @return list<ActorIdentity>
     */
    public static function attachedTo(array $inboxIds, string $actorClass): array
    {
        $type = ActorIdentity::storedTypeOf($actorClass);

        $actorIds = self::query()
            ->active()
            ->ofInboxes($inboxIds)
            ->ofActorType($type)
            ->distinct()
            ->pluck('actor_id')
            ->all();

        return array_map(fn (string $actorId) => ActorIdentity::fromStored($type, $actorId), array_values($actorIds));
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
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofInboxes(Builder $query, array $ids): void
    {
        $query->whereIn('inbox_id', $ids);
    }

    /**
     * The members of that actor type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofActorType(Builder $query, string $type): void
    {
        $query->where('actor_type', $type);
    }

    /**
     * Only the inbox of each row, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inboxIds(Builder $query): void
    {
        $query->select('inbox_id');
    }
}
