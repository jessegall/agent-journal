<?php

declare(strict_types=1);

namespace App\Agents\Activity\Contracts;

use App\Agents\Enums\ActivityType;
use App\Support\ActorReference;

/**
 * Where what an agent did is written, for the Activity window to show.
 */
interface ActivityLog
{
    /**
     * Adds one line of what the agent did, of the type, about the subject.
     */
    public function record(ActorReference $agent, ActivityType $type, string $subject): void;
}
