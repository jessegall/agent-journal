<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\ReadableModel;
use App\Enums\ActorType;
use App\Enums\IntervalRole;
use App\Enums\LeaveReason;
use App\Events\ChatMemberJoined;
use App\Events\ChatMemberLeft;
use App\Events\ChatRoleChanged;
use App\Exceptions\ChatStateConflict;
use App\Support\ActorIdentity;
use App\Support\ChatInterval;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One stretch of one actor's membership in a chat inbox, from the timeline position it joined at until it left. An
 * actor holds at most one active interval per inbox; rejoining opens a new one.
 *
 * @property string $id
 * @property string $inbox_id
 * @property string $actor_type
 * @property string $actor_id
 * @property IntervalRole $role
 * @property int $joined_sequence
 * @property CarbonImmutable $joined_at
 * @property CarbonImmutable|null $left_at
 * @property LeaveReason|null $leave_reason
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read ActorIdentity $actor
 * @property-read ChatInterval $chatInterval
 */
#[Table('inbox_intervals')]
#[Fillable(['inbox_id', 'actor_type', 'actor_id', 'role', 'joined_sequence', 'joined_at'])]
final class InboxInterval extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'role' => IntervalRole::class,
            'leave_reason' => LeaveReason::class,
            'joined_sequence' => 'integer',
            'joined_at' => 'immutable_datetime',
            'left_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new active interval for the actor, starting at the timeline position its joining took.
     */
    public static function create(string $inboxId, ActorIdentity $actor, IntervalRole $role, int $joinedSequence): self
    {
        $interval = new self([
            'inbox_id' => $inboxId,
            ...$actor->asColumns('actor'),
            'role' => $role,
            'joined_sequence' => $joinedSequence,
            'joined_at' => CarbonImmutable::now(),
        ]);

        $interval->assertSaved($interval->save());
        $interval->raise(new ChatMemberJoined($interval->id, $inboxId, $actor));

        return $interval;
    }

    // ----------[ Mutations ]----------

    /**
     * Ends the interval: the actor no longer takes part from this moment.
     *
     * @throws ChatStateConflict
     */
    public function end(LeaveReason $reason, CarbonImmutable $at): void
    {
        if (! $this->isActive()) {
            throw ChatStateConflict::intervalEnded($this->id);
        }

        $this->left_at = $at;
        $this->leave_reason = $reason;
        $this->assertSaved($this->save());
        $this->raise(new ChatMemberLeft($this->id, $this->inbox_id, $this->actor, $reason));
    }

    /**
     * Gives the interval the role it holds from now on, as an owner transfer does.
     *
     * @throws ChatStateConflict
     */
    public function takeRole(IntervalRole $role): void
    {
        if (! $this->isActive()) {
            throw ChatStateConflict::intervalEnded($this->id);
        }

        $this->role = $role;
        $this->assertSaved($this->save());
        $this->raise(new ChatRoleChanged($this->id, $this->inbox_id, $this->actor, $role));
    }

    // ----------[ Answers ]----------

    public function isActive(): bool
    {
        return $this->left_at === null;
    }

    public function isHeldBy(ActorIdentity $actor): bool
    {
        return $this->actor_type === $actor->type->value && $this->actor_id === $actor->id;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<ActorIdentity, never>
     */
    protected function actor(): Attribute
    {
        return Attribute::get(fn () => new ActorIdentity(ActorType::from($this->actor_type), $this->actor_id));
    }

    /**
     * The interval as the plain value chat code passes around.
     *
     * @return Attribute<ChatInterval, never>
     */
    protected function chatInterval(): Attribute
    {
        return Attribute::get(fn () => new ChatInterval(
            $this->id,
            $this->inbox_id,
            $this->actor,
            $this->role,
            $this->joined_sequence,
        ));
    }

    // ----------[ Scopes ]----------

    /**
     * The intervals of an inbox's current members.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function activeFor(Builder $query, string $inboxId): void
    {
        $query->where('inbox_id', $inboxId)->whereNull('left_at');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldBy(Builder $query, ActorIdentity $actor): void
    {
        $query->where('actor_type', $actor->type->value)->where('actor_id', $actor->id);
    }
}
