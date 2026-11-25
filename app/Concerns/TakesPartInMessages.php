<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * An actor model's side of messages: it is named by its actor type and id, attached to inboxes through its
 * memberships, and receives in the forwarding inbox it is attached to, otherwise in its personal inbox.
 */
trait TakesPartInMessages
{
    public function participantType(): string
    {
        return $this->actorType();
    }

    public function participantId(): string
    {
        return $this->actorId();
    }

    /**
     * @return HasMany<InboxMember, $this>
     */
    public function inboxMemberships(): HasMany
    {
        return $this->hasMany(InboxMember::class, 'actor_id')->where('actor_type', $this->actorType());
    }

    public function inbox(): Inbox
    {
        $identity = ActorIdentity::of($this);

        return Inbox::query()->forwarding()->attachedTo($identity)->oldestFirst()->first()
            ?? Inbox::personalOf($identity);
    }
}
