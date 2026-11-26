<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Inboxes\Contracts\InboxParticipationEnding;
use App\Support\ActorReference;

/**
 * Without a domain that holds inboxes an actor leaves when its rights go, there is nothing to end.
 */
final readonly class KeptInboxParticipation implements InboxParticipationEnding
{
    public function endInEnvironment(ActorReference $user, string|null $environmentId): void {}

    public function endEverywhere(ActorReference $user): void {}

    public function endForRetirement(ActorReference $agent): void {}
}
