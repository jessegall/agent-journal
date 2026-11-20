<?php

declare(strict_types=1);

namespace App\Supervision\Values;

use App\Actors\Support\ActorIdentity;

/**
 * An ask that needs a supervisor profile's helper started: the profile, the ask that causes it, what it asks and the
 * actor that asked, who stays the cause of the start.
 */
final readonly class SupervisorRequest
{
    public function __construct(
        public string $profileKey,
        public string $askId,
        public string $body,
        public ActorIdentity $cause,
    ) {}
}
