<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorProvisioning as ActorProvisioningContract;
use App\Contracts\Time\ServerClock;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;

/**
 * Gives every newly admitted actor its personal inbox and attaches it there, in the caller's transaction, so a failure
 * undoes the actor's admission with it.
 */
final readonly class ActorProvisioning implements ActorProvisioningContract
{
    public function __construct(private ServerClock $clock) {}

    public function provision(ActorReference $actor, string $label): void
    {
        $inbox = Inbox::create(Inbox::PERSONAL_PROVIDER, $actor->text(), $label);

        InboxMember::create($inbox->id, $actor, $this->clock->now());
    }
}
