<?php

declare(strict_types=1);

namespace App\Inboxes\Contracts;

use App\Support\ActorReference;

/**
 * Ends an actor's part in the inboxes it lost the right to be in, inside the caller's transaction: each membership
 * ends as a leave does.
 */
interface InboxParticipationEnding
{
    /**
     * The user's grant for one environment was revoked: its inboxes there end for it.
     */
    public function endInEnvironment(ActorReference $user, string|null $environmentId): void;

    /**
     * The user's account was disabled: every inbox it is in ends for it.
     */
    public function endEverywhere(ActorReference $user): void;

    /**
     * The agent was retired: every inbox it is in ends for it.
     */
    public function endForRetirement(ActorReference $agent): void;
}
