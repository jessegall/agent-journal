<?php

declare(strict_types=1);

namespace App\Contracts\Activity;

use App\Enums\ActivityType;
use App\Support\ActorIdentity;

/**
 * Where what an agent did is written, for the Activity window to show.
 */
interface ActivityLog
{
    /**
     * Adds one line of what the agent did, of the type, about the subject.
     */
    public function record(ActorIdentity $agent, ActivityType $type, string $subject): void;
}
