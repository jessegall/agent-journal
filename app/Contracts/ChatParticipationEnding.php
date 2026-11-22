<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;

/**
 * Ends a user's part in the chats it lost the right to be in, inside the caller's transaction: each membership ends
 * as a removal does, and a chat it owned passes to the earliest-joined member who may manage it, or closes.
 */
interface ChatParticipationEnding
{
    /**
     * The user's grant for one environment was revoked: its chats there end for it.
     */
    public function endInEnvironment(ActorIdentity $user, string|null $environmentId): void;

    /**
     * The user's account was disabled: every chat it is in ends for it.
     */
    public function endEverywhere(ActorIdentity $user): void;

    /**
     * The agent was retired: every chat it is in ends for it, its questions closing because their respondent left.
     */
    public function endForRetirement(ActorIdentity $agent): void;
}
